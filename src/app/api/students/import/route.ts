import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

function getField(row: Record<string, any>, ...aliases: string[]): string {
  for (const key of Object.keys(row)) {
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const alias of aliases) {
      if (cleanKey === alias.toLowerCase().replace(/[^a-z0-9]/g, '')) {
        return String(row[key] ?? '').trim();
      }
    }
  }
  return '';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File Excel (.xlsx) tidak ditemukan dalam form data.' },
        { status: 400 }
      );
    }

    // 1. Baca buffer file excel
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      return NextResponse.json(
        { success: false, error: 'File Excel tidak memiliki lembar kerja (sheet).' },
        { status: 400 }
      );
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

    if (rawRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lembar kerja Excel kosong. Tidak ada data siswa yang ditemukan.' },
        { status: 400 }
      );
    }

    // 2. Pastikan Data Sekolah Ada
    let school = await prisma.school.findFirst();
    if (!school) {
      school = await prisma.school.create({
        data: {
          npsn: '10203040',
          name: 'SMA NEGERI 1 NUSANTARA',
          level: 'SMA_SMK_MA',
          academicYear: '2026/2027',
        },
      });
    }

    // Cache Kelas, Ruangan, dan Sesi untuk efisiensi
    const classCache = new Map<string, string>();
    const roomCache = new Map<string, string>();
    const sessionCache = new Map<string, string>();

    const existingClasses = await prisma.class.findMany({ where: { schoolId: school.id } });
    for (const c of existingClasses) {
      classCache.set(c.name.toLowerCase(), c.id);
    }

    const existingRooms = await prisma.room.findMany({ where: { schoolId: school.id } });
    for (const r of existingRooms) {
      roomCache.set(r.code.toLowerCase(), r.id);
      roomCache.set(r.name.toLowerCase(), r.id);
    }

    const existingSessions = await prisma.examSession.findMany({ where: { schoolId: school.id } });
    for (const s of existingSessions) {
      sessionCache.set(String(s.sessionNumber), s.id);
      sessionCache.set(s.name.toLowerCase(), s.id);
    }

    // Default Fallback Class jika baris tidak menyebutkan kelas
    let defaultClassId = existingClasses[0]?.id;
    if (!defaultClassId) {
      const createdCls = await prisma.class.create({
        data: {
          schoolId: school.id,
          name: 'X MIPA 1',
          level: 'X',
          major: 'MIPA',
          academicYear: school.academicYear,
        },
      });
      defaultClassId = createdCls.id;
      classCache.set('x mipa 1', defaultClassId);
    }

    let successCount = 0;
    const errors: string[] = [];
    const salt = await bcrypt.genSalt(10);
    const defaultHashedPassword = await bcrypt.hash('siswa123', salt);

    // 3. Proses tiap baris siswa
    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const rowNum = i + 2; // Index baris di Excel

      const name = getField(row, 'namalengkap', 'nama', 'namasiswa', 'name', 'fullname');
      const nisn = getField(row, 'nisn', 'nomorinduksiswanasional');
      const noPeserta = getField(row, 'nopeserta', 'nomorpeserta', 'nopeserta');
      const nis = getField(row, 'nis', 'nomorinduksiswa');
      const genderRaw = getField(row, 'jeniskelamin', 'jk', 'gender');
      const classNameRaw = getField(row, 'kelas', 'class', 'rombel', 'namakelas');
      const roomRaw = getField(row, 'ruang', 'ruangan', 'room', 'koderuang', 'lab');
      const sessionRaw = getField(row, 'sesi', 'session', 'sesiujian');
      const usernameRaw = getField(row, 'username', 'user', 'idlogin');
      const passwordRaw = getField(row, 'password', 'katasandi', 'pass');

      if (!name || (!nisn && !noPeserta)) {
        errors.push(`Baris ${rowNum}: Nama dan NISN/No. Peserta wajib diisi.`);
        continue;
      }

      const finalNisn = nisn || `NISN${Date.now()}${i}`;
      const finalNoPeserta = noPeserta || `U-2026-${String(i + 1).padStart(3, '0')}`;
      const finalUsername = usernameRaw || finalNisn;
      const finalGender = genderRaw.toUpperCase().startsWith('P') ? 'P' : 'L';

      // A. Resolusi Kelas
      let classId = defaultClassId;
      if (classNameRaw) {
        const lowerCls = classNameRaw.toLowerCase();
        if (classCache.has(lowerCls)) {
          classId = classCache.get(lowerCls)!;
        } else {
          // Buat kelas baru otomatis
          const newCls = await prisma.class.create({
            data: {
              schoolId: school.id,
              name: classNameRaw,
              level: classNameRaw.split(' ')[0] || 'X',
              major: 'UMUM',
              academicYear: school.academicYear,
            },
          });
          classId = newCls.id;
          classCache.set(lowerCls, classId);
        }
      }

      // B. Resolusi Ruangan
      let roomId: string | null = null;
      if (roomRaw) {
        const lowerRoom = roomRaw.toLowerCase();
        if (roomCache.has(lowerRoom)) {
          roomId = roomCache.get(lowerRoom)!;
        } else {
          const newRoom = await prisma.room.create({
            data: {
              schoolId: school.id,
              code: roomRaw,
              name: `Ruangan ${roomRaw}`,
              capacity: 36,
            },
          });
          roomId = newRoom.id;
          roomCache.set(lowerRoom, roomId);
        }
      }

      // C. Resolusi Sesi
      let sessionId: string | null = null;
      if (sessionRaw) {
        const sessionClean = sessionRaw.replace(/[^0-9]/g, '') || '1';
        const sessionNum = parseInt(sessionClean, 10);
        if (sessionCache.has(String(sessionNum))) {
          sessionId = sessionCache.get(String(sessionNum))!;
        } else {
          const newSession = await prisma.examSession.create({
            data: {
              schoolId: school.id,
              sessionNumber: sessionNum,
              name: `Sesi ${sessionNum}`,
              startTime: sessionNum === 1 ? '07:30' : sessionNum === 2 ? '10:00' : '13:00',
              endTime: sessionNum === 1 ? '09:30' : sessionNum === 2 ? '12:00' : '15:00',
            },
          });
          sessionId = newSession.id;
          sessionCache.set(String(sessionNum), sessionId);
        }
      }

      // D. Hash Password
      const hashedPassword = passwordRaw ? await bcrypt.hash(passwordRaw, salt) : defaultHashedPassword;

      try {
        // Upsert User
        const user = await prisma.user.upsert({
          where: { username: finalUsername },
          update: {
            name,
            password: hashedPassword,
          },
          create: {
            username: finalUsername,
            password: hashedPassword,
            name,
            role: 'STUDENT',
            isActive: true,
          },
        });

        // Upsert Student
        await prisma.student.upsert({
          where: { userId: user.id },
          update: {
            noPeserta: finalNoPeserta,
            nisn: finalNisn,
            nis: nis || '',
            gender: finalGender,
            classId,
            roomId,
            sessionId,
            schoolId: school.id,
          },
          create: {
            userId: user.id,
            schoolId: school.id,
            noPeserta: finalNoPeserta,
            nisn: finalNisn,
            nis: nis || '',
            gender: finalGender,
            classId,
            roomId,
            sessionId,
            serverName: 'SERVER-01',
          },
        });

        successCount++;
      } catch (err: any) {
        errors.push(`Baris ${rowNum} (${name}): ${err.message}`);
      }
    }

    try {
      revalidatePath('/');
    } catch {}

    return NextResponse.json({
      success: true,
      count: successCount,
      totalRows: rawRows.length,
      errors: errors.slice(0, 10), // Batasi 10 error pertama agar response rapi
      message: `Berhasil mengimpor ${successCount} dari ${rawRows.length} data siswa ke database PostgreSQL.`,
    });
  } catch (error: any) {
    console.error('Import students error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
