'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface StudentInput {
  name: string;
  username: string;
  password?: string;
  noPeserta: string;
  nisn: string;
  nis?: string;
  gender?: string;
  classId: string;
  roomId?: string;
  sessionId?: string;
  serverName?: string;
  photoUrl?: string;
}

// 1. GET ALL STUDENTS (FETCH DARI DATABASE POSTGRESQL)
export async function getStudentsAction() {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
        class: true,
        room: true,
        session: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      success: true,
      data: students.map((s) => ({
        id: s.id,
        userId: s.userId,
        noPeserta: s.noPeserta,
        name: s.user.name,
        nisn: s.nisn,
        nis: s.nis || '-',
        level: s.class?.level || 'X',
        className: s.class?.name || '-',
        classId: s.classId,
        jurusan: s.class?.major || 'UMUM',
        username: s.user.username,
        passwordText: '••••••••', // Masked for security
        room: s.room?.name || s.room?.code || '-',
        roomId: s.roomId || '',
        session: s.session?.name || (s.session ? `Sesi ${s.session.sessionNumber}` : '-'),
        sessionId: s.sessionId || '',
        server: s.serverName || 'SERVER-01',
        photoUrl: s.photoUrl || undefined,
        isActive: s.user.isActive,
      })),
    };
  } catch (error: any) {
    console.error('getStudentsAction error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

// 2. CREATE NEW STUDENT (SIMPAN KE POSTGRESQL)
export async function createStudentAction(input: StudentInput) {
  try {
    // 1. Dapatkan School ID (default sekolah pertama jika tidak dispesifikasikan)
    const school = await prisma.school.findFirst();
    if (!school) {
      throw new Error('Data Master Sekolah belum ada. Silakan inisiasi data sekolah.');
    }

    // 2. Hash Password (default siswa123 jika tidak diisi)
    const rawPassword = input.password || 'siswa123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    // 3. Validasi keunikan username, noPeserta, dan nisn
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: input.username },
          { studentProfile: { noPeserta: input.noPeserta } },
          { studentProfile: { nisn: input.nisn } },
        ],
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'Username, No. Peserta, atau NISN sudah terdaftar.',
      };
    }

    // 4. Buat User & Student dalam Transaction
    const newStudent = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: input.username,
          password: hashedPassword,
          name: input.name,
          role: 'STUDENT',
          isActive: true,
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          schoolId: school.id,
          noPeserta: input.noPeserta,
          nisn: input.nisn,
          nis: input.nis || '',
          gender: input.gender || 'L',
          classId: input.classId,
          roomId: input.roomId || null,
          sessionId: input.sessionId || null,
          serverName: input.serverName || 'SERVER-01',
          photoUrl: input.photoUrl || null,
        },
        include: {
          user: true,
          class: true,
          room: true,
          session: true,
        },
      });

      return student;
    });

    try {
      revalidatePath('/');
    } catch {
      // Invariant safe fallback when outside Next.js request context
    }
    return { success: true, data: newStudent };
  } catch (error: any) {
    console.error('createStudentAction error:', error);
    return { success: false, error: error.message };
  }
}

// 3. UPDATE STUDENT (PERBARUI DI POSTGRESQL)
export async function updateStudentAction(studentId: string, input: Partial<StudentInput>) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true },
    });

    if (!student) {
      return { success: false, error: 'Data siswa tidak ditemukan.' };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update User info jika ada perubahan name/username/password
      const userDataToUpdate: any = {};
      if (input.name) userDataToUpdate.name = input.name;
      if (input.username) userDataToUpdate.username = input.username;
      if (input.password && input.password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        userDataToUpdate.password = await bcrypt.hash(input.password, salt);
      }

      if (Object.keys(userDataToUpdate).length > 0) {
        await tx.user.update({
          where: { id: student.userId },
          data: userDataToUpdate,
        });
      }

      // 2. Update Student info
      const studentDataToUpdate: any = {};
      if (input.noPeserta) studentDataToUpdate.noPeserta = input.noPeserta;
      if (input.nisn) studentDataToUpdate.nisn = input.nisn;
      if (input.nis !== undefined) studentDataToUpdate.nis = input.nis;
      if (input.gender) studentDataToUpdate.gender = input.gender;
      if (input.classId) studentDataToUpdate.classId = input.classId;
      if (input.roomId !== undefined) studentDataToUpdate.roomId = input.roomId || null;
      if (input.sessionId !== undefined) studentDataToUpdate.sessionId = input.sessionId || null;
      if (input.serverName) studentDataToUpdate.serverName = input.serverName;

      await tx.student.update({
        where: { id: studentId },
        data: studentDataToUpdate,
      });
    });

    try {
      revalidatePath('/');
    } catch {
      // Invariant safe fallback
    }
    return { success: true };
  } catch (error: any) {
    console.error('updateStudentAction error:', error);
    return { success: false, error: error.message };
  }
}

// 4. DELETE STUDENT (HAPUS DARI POSTGRESQL)
export async function deleteStudentAction(studentId: string) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return { success: false, error: 'Siswa tidak ditemukan.' };
    }

    // Menghapus User akan secara otomatis meng-cascade delete Student
    await prisma.user.delete({
      where: { id: student.userId },
    });

    try {
      revalidatePath('/');
    } catch {
      // Invariant safe fallback
    }
    return { success: true };
  } catch (error: any) {
    console.error('deleteStudentAction error:', error);
    return { success: false, error: error.message };
  }
}

// 5. GET MASTER DATA DROPDOWNS (KELAS, RUANGAN, SESI)
export async function getStudentMasterDropdownsAction() {
  try {
    const [classes, rooms, sessions] = await Promise.all([
      prisma.class.findMany({ orderBy: { name: 'asc' } }),
      prisma.room.findMany({ orderBy: { code: 'asc' } }),
      prisma.examSession.findMany({ orderBy: { sessionNumber: 'asc' } }),
    ]);

    return {
      success: true,
      data: {
        classes: classes.map((c) => ({
          id: c.id,
          name: c.name,
          level: c.level,
          jurusan: c.major || '',
          waliKelas: '',
          totalStudents: 0,
        })),
        rooms: rooms.map((r) => ({
          id: r.id,
          code: r.code,
          name: r.name,
          capacity: r.capacity,
          proctorName: r.proctorName || '-',
          serverName: r.serverName || 'SERVER-01',
        })),
        sessions: sessions.map((s) => ({
          id: s.id,
          sessionNumber: s.sessionNumber,
          name: s.name,
          timeRange: `${s.startTime} - ${s.endTime}`,
        })),
      },
    };
  } catch (error: any) {
    console.error('getStudentMasterDropdownsAction error:', error);
    return {
      success: false,
      data: { classes: [], rooms: [], sessions: [] },
    };
  }
}
