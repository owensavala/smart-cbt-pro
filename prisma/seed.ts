import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';
import { studentRawNames } from '../scripts/generate_sma_data';

async function main() {
  console.log('🌱 Starting Comprehensive SMA Seeding (100 Students, IPA & IPS, Single Guru & Operator)...');

  // Hashed Passwords
  const salt = await bcrypt.genSalt(10);
  const passwordAdmin = await bcrypt.hash('admin123', salt);
  const passwordOperator = await bcrypt.hash('operator123', salt);
  const passwordGuru = await bcrypt.hash('guru123', salt);
  const passwordSiswa = await bcrypt.hash('12345678', salt);

  // 1. DATA MASTER SEKOLAH (SMA INTEGRAL HIDAYATULLAH)
  const school = await prisma.school.upsert({
    where: { npsn: '60204321' },
    update: {
      name: 'SMA INTEGRAL HIDAYATULLAH',
      subName: 'Kota Ternate • CBT & Asesmen Digital SMA',
      level: 'SMA_SMK_MA',
      headmasterName: 'Drs. H. Ahmad Dahlan, M.Pd.',
      headmasterNip: '197505122000031002',
      proctorName: 'Ahmad Fauzi, S.Kom.',
      proctorNip: '198502152010011015',
    },
    create: {
      npsn: '60204321',
      name: 'SMA INTEGRAL HIDAYATULLAH',
      subName: 'Kota Ternate • CBT & Asesmen Digital SMA',
      level: 'SMA_SMK_MA',
      address: 'Jl. Pesantren Kalumata Puncak',
      district: 'Ternate Selatan',
      city: 'Kota Ternate',
      province: 'Maluku Utara',
      postalCode: '97717',
      phone: '0821XXXX',
      email: 'info@smaintegral.sch.id',
      website: 'https://smaintegral.sch.id',
      academicYear: '2025/2026',
      semester: 'GANJIL',
      headmasterName: 'Drs. H. Ahmad Dahlan, M.Pd.',
      headmasterNip: '197505122000031002',
      proctorName: 'Ahmad Fauzi, S.Kom.',
      proctorNip: '198502152010011015',
    },
  });
  console.log(`✓ Sekolah terdaftar: ${school.name} (NPSN: ${school.npsn})`);

  // 1b. BRANDING
  await prisma.schoolBranding.upsert({
    where: { schoolId: school.id },
    update: {
      appName: 'SmartCBT Pro',
      appSubName: 'Sistem Asesmen Sekolah SMA Terpadu',
      themeColor: 'EMERALD',
      loginHeroTitle: 'Portal Ujian Berbasis Komputer & Digital Asesmen SMA',
      loginHeroSubtitle: 'Gunakan No. Peserta dan Password resmi yang tercetak pada Kartu Peserta Ujian.',
    },
    create: {
      schoolId: school.id,
      appName: 'SmartCBT Pro',
      appSubName: 'Sistem Asesmen Sekolah SMA Terpadu',
      themeColor: 'EMERALD',
      logoType: 'MADRASAH',
      loginHeroTitle: 'Portal Ujian Berbasis Komputer & Digital Asesmen SMA',
      loginHeroSubtitle: 'Gunakan No. Peserta dan Password resmi yang tercetak pada Kartu Peserta Ujian.',
      enableWatermark: true,
      watermarkOpacity: 0.1,
      watermarkPattern: '{name} - {nisn} - {ip}',
      enableFullscreenLock: true,
      maxViolationsAllowed: 5,
      gracePeriodSeconds: 4,
      enableAutoSave: true,
      allowTokenBypass: false,
      isLicenseValid: true,
    },
  });

  // 2. KELAS SMA (X MIPA 1, X MIPA 2, X IPS 1, X IPS 2)
  const classDefs = [
    { name: 'X MIPA 1', level: 'X', major: 'IPA' },
    { name: 'X MIPA 2', level: 'X', major: 'IPA' },
    { name: 'X IPS 1', level: 'X', major: 'IPS' },
    { name: 'X IPS 2', level: 'X', major: 'IPS' },
  ];

  const dbClasses: Record<string, any> = {};
  for (const c of classDefs) {
    const cls = await prisma.class.upsert({
      where: {
        schoolId_name_academicYear: {
          schoolId: school.id,
          name: c.name,
          academicYear: '2025/2026',
        },
      },
      update: { level: c.level, major: c.major },
      create: {
        schoolId: school.id,
        name: c.name,
        level: c.level,
        major: c.major,
        academicYear: '2025/2026',
      },
    });
    dbClasses[c.name] = cls;
  }
  console.log('✓ 4 Kelas SMA (X MIPA 1, X MIPA 2, X IPS 1, X IPS 2) berhasil disiapkan');

  // 3. RUANG LAB
  const roomDefs = [
    { code: 'LAB-01', name: 'Lab Komputer 1 (Sains Digital)', capacity: 40 },
    { code: 'LAB-02', name: 'Lab Komputer 2 (Multimedia)', capacity: 40 },
    { code: 'LAB-03', name: 'Lab Komputer 3 (CBT Center)', capacity: 40 },
  ];
  const dbRooms: Record<string, any> = {};
  for (const r of roomDefs) {
    const rm = await prisma.room.upsert({
      where: {
        schoolId_code: {
          schoolId: school.id,
          code: r.code,
        },
      },
      update: { name: r.name, capacity: r.capacity },
      create: {
        schoolId: school.id,
        code: r.code,
        name: r.name,
        capacity: r.capacity,
        proctorName: 'Ahmad Fauzi, S.Kom.',
        serverName: 'SERVER-01',
      },
    });
    dbRooms[r.code] = rm;
  }

  // 4. SESI UJIAN
  const ses1 = await prisma.examSession.upsert({
    where: { schoolId_sessionNumber: { schoolId: school.id, sessionNumber: 1 } },
    update: { name: 'Sesi 1 (Pagi)', startTime: '07:30', endTime: '09:30' },
    create: {
      schoolId: school.id,
      sessionNumber: 1,
      name: 'Sesi 1 (Pagi)',
      startTime: '07:30',
      endTime: '09:30',
      description: 'Sesi Ujian Pagi Utama',
    },
  });

  const ses2 = await prisma.examSession.upsert({
    where: { schoolId_sessionNumber: { schoolId: school.id, sessionNumber: 2 } },
    update: { name: 'Sesi 2 (Siang)', startTime: '10:00', endTime: '12:00' },
    create: {
      schoolId: school.id,
      sessionNumber: 2,
      name: 'Sesi 2 (Siang)',
      startTime: '10:00',
      endTime: '12:00',
      description: 'Sesi Ujian Siang',
    },
  });

  // 5. MATA PELAJARAN SMA
  const subjectDefs = [
    { code: 'SOS', name: 'Sosiologi', level: 'X', order: 1 },
    { code: 'PPKN', name: 'Pendidikan Pancasila dan Kewarganegaraan', level: 'X', order: 2 },
    { code: 'MAT', name: 'Matematika Wajib', level: 'X', order: 3 },
    { code: 'FIS', name: 'Fisika', level: 'X', order: 4 },
    { code: 'BIO', name: 'Biologi', level: 'X', order: 5 },
    { code: 'KIM', name: 'Kimia', level: 'X', order: 6 },
    { code: 'EKO', name: 'Ekonomi', level: 'X', order: 7 },
    { code: 'GEO', name: 'Geografi', level: 'X', order: 8 },
    { code: 'SEJ', name: 'Sejarah Indonesia', level: 'X', order: 9 },
    { code: 'BINDO', name: 'Bahasa Indonesia', level: 'X', order: 10 },
    { code: 'BING', name: 'Bahasa Inggris', level: 'X', order: 11 },
  ];

  const dbSubjects: Record<string, any> = {};
  for (const s of subjectDefs) {
    const sb = await prisma.subject.upsert({
      where: {
        schoolId_code: {
          schoolId: school.id,
          code: s.code,
        },
      },
      update: { name: s.name, level: s.level, order: s.order },
      create: {
        schoolId: school.id,
        code: s.code,
        name: s.name,
        level: s.level,
        order: s.order,
        isActive: true,
      },
    });
    dbSubjects[s.code] = sb;
  }

  // 6. USERS
  // A. Super Admin (superadmin & admin)
  await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: { password: passwordAdmin, name: 'Super Administrator' },
    create: {
      username: 'superadmin',
      password: passwordAdmin,
      name: 'Super Administrator',
      email: 'superadmin@smartcbt.sch.id',
      role: 'SUPER_ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: passwordAdmin, name: 'Super Administrator' },
    create: {
      username: 'admin',
      password: passwordAdmin,
      name: 'Super Administrator',
      email: 'admin@smartcbt.sch.id',
      role: 'SUPER_ADMIN',
    },
  });

  // B. Operator (Ahmad Fauzi, S.Kom.)
  await prisma.user.upsert({
    where: { username: 'operator' },
    update: { password: passwordOperator, name: 'Ahmad Fauzi, S.Kom.' },
    create: {
      username: 'operator',
      password: passwordOperator,
      name: 'Ahmad Fauzi, S.Kom.',
      email: 'operator@smartcbt.sch.id',
      role: 'OPERATOR',
      operatorProfile: {
        create: {
          nip: '198502152010011015',
          assignedRoom: 'LAB-01',
          schoolId: school.id,
        },
      },
    },
  });

  // C. Guru Utama (Dermawan Surya Kencana, S. Sos)
  // Clean up any old Dra. Sri Wahyuni user
  const oldSri = await prisma.user.findFirst({ where: { username: 'guru_matematika' } });
  if (oldSri) {
    await prisma.teacherSubject.deleteMany({ where: { teacher: { userId: oldSri.id } } });
    await prisma.teacher.deleteMany({ where: { userId: oldSri.id } });
    await prisma.user.delete({ where: { id: oldSri.id } });
  }

  const teacherUser = await prisma.user.upsert({
    where: { username: 'dermawanf727@gmail.com' },
    update: {
      password: passwordGuru,
      name: 'Dermawan Surya Kencana, S. Sos',
      email: 'dermawanf727@gmail.com',
    },
    create: {
      username: 'dermawanf727@gmail.com',
      password: passwordGuru,
      name: 'Dermawan Surya Kencana, S. Sos',
      email: 'dermawanf727@gmail.com',
      role: 'TEACHER',
      teacherProfile: {
        create: {
          nip: '198403152009021004',
          title: 'Guru Sosiologi & PPKn SMA',
          waliKelas: 'X IPS 1',
          kajur: 'IPS (Ilmu Pengetahuan Sosial)',
          schoolId: school.id,
        },
      },
    },
    include: { teacherProfile: true },
  });

  const teacher =
    teacherUser.teacherProfile ||
    (await prisma.teacher.findFirst({ where: { userId: teacherUser.id } }));

  if (!teacher) {
    throw new Error('Teacher record could not be found or created.');
  }

  if (teacher) {
    // Assign teacher to all subjects
    for (const code of Object.keys(dbSubjects)) {
      await prisma.teacherSubject.upsert({
        where: {
          teacherId_subjectId: {
            teacherId: teacher.id,
            subjectId: dbSubjects[code].id,
          },
        },
        update: {},
        create: {
          teacherId: teacher.id,
          subjectId: dbSubjects[code].id,
        },
      });
    }
  }

  console.log(`✓ Guru terdaftar: ${teacherUser.name} (${teacherUser.username})`);

  // 7. SEED 100 SISWA SMA (IPA & IPS)
  console.log('Seeding 100 SMA students...');
  // Clean up any old attempts and students
  await prisma.studentAnswer.deleteMany({});
  await prisma.examViolationLog.deleteMany({});
  await prisma.studentExamAttempt.deleteMany({});
  await prisma.student.deleteMany({});

  const studentIds: string[] = [];

  for (let idx = 0; idx < studentRawNames.length; idx++) {
    const s = studentRawNames[idx];
    const classCode = s.class.includes('MIPA 1') ? '0101' : s.class.includes('MIPA 2') ? '0102' : s.class.includes('IPS 1') ? '0201' : '0202';
    const numStr = String((idx % 25) + 1).padStart(4, '0');
    const noPeserta = `26-27-04-1-${classCode}-${numStr}`;
    const userPass = s.pass === '12345678' ? passwordSiswa : await bcrypt.hash(s.pass, salt);

    const user = await prisma.user.upsert({
      where: { username: s.user },
      update: {
        name: s.name,
        password: userPass,
        role: 'STUDENT',
      },
      create: {
        username: s.user,
        password: userPass,
        name: s.name,
        email: `${s.user}@student.smaintegral.sch.id`,
        role: 'STUDENT',
      },
    });

    const targetClass = dbClasses[s.class];
    const targetRoom = dbRooms[s.room] || dbRooms['LAB-01'];
    const targetSession = s.session.includes('Sesi 1') ? ses1 : ses2;

    const studentRecord = await prisma.student.upsert({
      where: { userId: user.id },
      update: {
        noPeserta,
        nisn: s.nisn,
        nis: s.nis,
        gender: s.gender,
        schoolId: school.id,
        classId: targetClass.id,
        roomId: targetRoom.id,
        sessionId: targetSession.id,
        serverName: 'SERVER-01',
      },
      create: {
        userId: user.id,
        noPeserta,
        nisn: s.nisn,
        nis: s.nis,
        gender: s.gender,
        schoolId: school.id,
        classId: targetClass.id,
        roomId: targetRoom.id,
        sessionId: targetSession.id,
        serverName: 'SERVER-01',
      },
    });

    studentIds.push(studentRecord.id);
  }
  console.log(`✓ 100 Siswa SMA terdaftar sukses dengan demo student: ARJUN (arjun / 12345678)`);

  // 8. QUESTION BANK & QUESTIONS (Matematika Wajib X)
  const questionBank = await prisma.questionBank.upsert({
    where: {
      schoolId_code: {
        schoolId: school.id,
        code: 'BQ-MAT-X-01',
      },
    },
    update: { totalQuestions: 6 },
    create: {
      schoolId: school.id,
      subjectId: dbSubjects['MAT'].id,
      teacherId: teacher.id,
      code: 'BQ-MAT-X-01',
      title: 'Bank Soal Matematika Wajib Aljabar & Fungsi X',
      level: 'X',
      totalQuestions: 6,
    },
  });

  const q1 = await prisma.question.upsert({
    where: { id: 'seed_q_mat_x_01' },
    update: {},
    create: {
      id: 'seed_q_mat_x_01',
      questionBankId: questionBank.id,
      type: 'PG',
      prompt: 'Nilai x yang memenuhi persamaan nilai mutlak |2x - 4| = 6 adalah ....',
      points: 15,
      difficulty: 'MEDIUM',
      order: 1,
      options: {
        create: [
          { code: 'A', text: 'x = 5 atau x = -1', isCorrect: true, order: 1 },
          { code: 'B', text: 'x = 5 atau x = 1', isCorrect: false, order: 2 },
          { code: 'C', text: 'x = -5 atau x = -1', isCorrect: false, order: 3 },
          { code: 'D', text: 'x = 3 atau x = -2', isCorrect: false, order: 4 },
        ],
      },
    },
  });

  const q2 = await prisma.question.upsert({
    where: { id: 'seed_q_mat_x_02' },
    update: {},
    create: {
      id: 'seed_q_mat_x_02',
      questionBankId: questionBank.id,
      type: 'PGK',
      pgkSubtype: 'MULTI_SELECT',
      prompt: 'Pilihlah DUA atau LEBIH sifat nilai mutlak yang BENAR untuk setiap bilangan real x dan y:',
      points: 15,
      difficulty: 'MEDIUM',
      order: 2,
      options: {
        create: [
          { code: '1', text: '|x| ≥ 0 untuk setiap bilangan real x', isCorrect: true, order: 1 },
          { code: '2', text: '|x · y| = |x| · |y|', isCorrect: true, order: 2 },
          { code: '3', text: '|x + y| ≤ |x| + |y| (Ketaksamaan Segitiga)', isCorrect: true, order: 3 },
          { code: '4', text: '|x - y| = |x| - |y| untuk semua x dan y', isCorrect: false, order: 4 },
        ],
      },
    },
  });

  const q3 = await prisma.question.upsert({
    where: { id: 'seed_q_mat_x_03' },
    update: {},
    create: {
      id: 'seed_q_mat_x_03',
      questionBankId: questionBank.id,
      type: 'PGK',
      pgkSubtype: 'TRUE_FALSE_MATRIX',
      prompt: 'Tentukan Benar atau Salah untuk setiap pernyataan relasi dan fungsi berikut:',
      points: 15,
      difficulty: 'MEDIUM',
      order: 3,
      options: {
        create: [
          { code: 'TF1', text: 'Setiap fungsi pasti merupakan relasi.', statement: 'Setiap fungsi pasti merupakan relasi.', isCorrect: true, order: 1 },
          { code: 'TF2', text: 'Setiap relasi pasti merupakan fungsi.', statement: 'Setiap relasi pasti merupakan fungsi.', isCorrect: false, order: 2 },
          { code: 'TF3', text: 'Daerah asal (domain) fungsi f(x) = 1/(x-2) adalah semua bilangan real kecuali 2.', statement: 'Daerah asal (domain) fungsi f(x) = 1/(x-2) adalah semua bilangan real kecuali 2.', isCorrect: true, order: 3 },
        ],
      },
    },
  });

  const q4 = await prisma.question.upsert({
    where: { id: 'seed_q_mat_x_04' },
    update: {
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgMjYwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj4KICA8cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjI2MCIgcng9IjE2IiBmaWxsPSIjMGQxMzFmIiBzdHJva2U9IiMxZTI5M2IiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjI1MCIgeT0iMzAiIGZpbGw9IiMzOGJkZjgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+S1VSVkEgUEFSQUJPTEEgRlVOR1NJIEtVQURSQVQgZih4KSA9IGF4wrIgKyBieCArIGM8L3RleHQ+CiAgPGxpbmUgeDE9IjQwIiB5MT0iMTUwIiB4Mj0iNDYwIiB5Mj0iMTUwIiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNCIvPgogIDx0ZXh0IHg9IjQ2NSIgeT0iMTU0IiBmaWxsPSIjOTRhM2I4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiI+WDwvdGV4dD4KICA8bGluZSB4MT0iMjUwIiB5MT0iNDUiIHgyPSIyNTAiIHkyPSIyNDUiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI0Ii8+CiAgPHRleHQgeD0iMjU1IiB5PSI1NSIgZmlsbD0iIzk0YTNiOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiPlk8L3RleHQ+CiAgPHBhdGggZD0iTTYwLDYwIFExMzAsMjIwIDIwMCw2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjMiLz4KICA8dGV4dCB4PSIxMzAiIHk9IjIzNSIgZmlsbD0iIzM0ZDM5OSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5hICZndDsgMCAoVGl0aWsgTWluKTwvdGV4dD4KICA8cGF0aCBkPSJNMjgwLDIyMCBRMzUwLDcwIDQyMCwyMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Y0M2Y1ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPHRleHQgeD0iMzUwIiB5PSI2NSIgZmlsbD0iI2ZiNzE4NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5hICZsdDsgMCAoVGl0aWsgTWFrcyk8L3RleHQ+CiAgPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTUwIiByPSI0IiBmaWxsPSIjZmJiZjI0Ii8+CiAgPHRleHQgeD0iMjQwIiB5PSIxNDAiIGZpbGw9IiNmZGUwNDciIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9ImVuZCI+RCA9IDA8L3RleHQ+Cjwvc3ZnPg==',
      imageCaption: 'Gambar 1.2 Sketsa Kurva Parabola Fungsi Kuadrat f(x) = ax² + bx + c',
      prompt: 'Perhatikan gambar kurva fungsi kuadrat berikut! Jodohkan karakteristik koefisien grafik fungsi kuadrat f(x) = ax² + bx + c dengan bentuk kurvanya:',
    },
    create: {
      id: 'seed_q_mat_x_04',
      questionBankId: questionBank.id,
      type: 'MATCHING',
      prompt: 'Perhatikan gambar kurva fungsi kuadrat berikut! Jodohkan karakteristik koefisien grafik fungsi kuadrat f(x) = ax² + bx + c dengan bentuk kurvanya:',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgMjYwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj4KICA8cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjI2MCIgcng9IjE2IiBmaWxsPSIjMGQxMzFmIiBzdHJva2U9IiMxZTI5M2IiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjI1MCIgeT0iMzAiIGZpbGw9IiMzOGJkZjgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+S1VSVkEgUEFSQUJPTEEgRlVOR1NJIEtVQURSQVQgZih4KSA9IGF4wrIgKyBieCArIGM8L3RleHQ+CiAgPGxpbmUgeDE9IjQwIiB5MT0iMTUwIiB4Mj0iNDYwIiB5Mj0iMTUwIiBzdHJva2U9IiM2NDc0OGIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWRhc2hhcnJheT0iNCIvPgogIDx0ZXh0IHg9IjQ2NSIgeT0iMTU0IiBmaWxsPSIjOTRhM2I4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiI+WDwvdGV4dD4KICA8bGluZSB4MT0iMjUwIiB5MT0iNDUiIHgyPSIyNTAiIHkyPSIyNDUiIHN0cm9rZT0iIzY0NzQ4YiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtZGFzaGFycmF5PSI0Ii8+CiAgPHRleHQgeD0iMjU1IiB5PSI1NSIgZmlsbD0iIzk0YTNiOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiPlk8L3RleHQ+CiAgPHBhdGggZD0iTTYwLDYwIFExMzAsMjIwIDIwMCw2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjMiLz4KICA8dGV4dCB4PSIxMzAiIHk9IjIzNSIgZmlsbD0iIzM0ZDM5OSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5hICZndDsgMCAoVGl0aWsgTWluKTwvdGV4dD4KICA8cGF0aCBkPSJNMjgwLDIyMCBRMzUwLDcwIDQyMCwyMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Y0M2Y1ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPHRleHQgeD0iMzUwIiB5PSI2NSIgZmlsbD0iI2ZiNzE4NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTEiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5hICZsdDsgMCAoVGl0aWsgTWFrcyk8L3RleHQ+CiAgPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTUwIiByPSI0IiBmaWxsPSIjZmJiZjI0Ii8+CiAgPHRleHQgeD0iMjQwIiB5PSIxNDAiIGZpbGw9IiNmZGUwNDciIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9ImVuZCI+RCA9IDA8L3RleHQ+Cjwvc3ZnPg==',
      imageCaption: 'Gambar 1.2 Sketsa Kurva Parabola Fungsi Kuadrat f(x) = ax² + bx + c',
      points: 15,
      difficulty: 'MEDIUM',
      order: 4,
      matchingPairs: {
        create: [
          { premise: 'Nilai a > 0', target: 'Parabola terbuka ke atas (memiliki titik balik minimum)', order: 1 },
          { premise: 'Nilai a < 0', target: 'Parabola terbuka ke bawah (memiliki titik balik maksimum)', order: 2 },
          { premise: 'Diskriminan D = 0', target: 'Kurva parabola menyinggung sumbu X di satu titik', order: 3 },
        ],
      },
    },
  });

  const q5 = await prisma.question.upsert({
    where: { id: 'seed_q_mat_x_05' },
    update: {},
    create: {
      id: 'seed_q_mat_x_05',
      questionBankId: questionBank.id,
      type: 'SHORT_ANSWER',
      prompt: 'Jika fungsi f(x) = 3x - 5 dan g(x) = 2x + 1, tentukan nilai dari komposisi fungsi (f ∘ g)(2)! Tuliskan jawaban berupa angka saja.',
      points: 20,
      difficulty: 'MEDIUM',
      order: 5,
      acceptableAnswers: ['10', 'sepuluh'],
    },
  });

  const q6 = await prisma.question.upsert({
    where: { id: 'seed_q_mat_x_06' },
    update: {},
    create: {
      id: 'seed_q_mat_x_06',
      questionBankId: questionBank.id,
      type: 'ESSAY',
      prompt: 'Jelaskan langkah-langkah dalam menyelesaikan pertidaksamaan rasional (x - 3)/(x + 2) ≥ 0 serta tentukan himpunan penyelesaiannya!',
      points: 20,
      difficulty: 'HARD',
      order: 6,
      idealAnswer: 'Langkah pertama mencari pembuat nol pembilang (x = 3) dan pembuat nol penyebut (x = -2 dengan syarat penyebut tidak sama dengan nol). Selanjutnya buat garis bilangan dan uji tanda pada setiap interval. Himpunan penyelesaiannya adalah x < -2 atau x >= 3.',
      essayRubric: {
        idealAnswer: 'Langkah pertama mencari pembuat nol pembilang (x = 3) dan pembuat nol penyebut (x = -2 dengan syarat penyebut tidak sama dengan nol). Selanjutnya buat garis bilangan dan uji tanda pada setiap interval. Himpunan penyelesaiannya adalah x < -2 atau x >= 3.',
        maxScore: 20,
        strictness: 'standard',
        keyPoints: [
          { concept: 'Menentukan pembuat nol pembilang (x=3) dan penyebut (x=-2)', weight: 7, mandatoryKeywords: ['pembuat nol', 'pembilang', 'penyebut'] },
          { concept: 'Syarat penyebut tidak boleh nol (x ≠ -2) dan pengujian tanda interval', weight: 6, mandatoryKeywords: ['syarat', 'garis bilangan', 'interval', 'tanda'] },
          { concept: 'Himpunan penyelesaian akhir yang benar: x < -2 atau x >= 3', weight: 7, mandatoryKeywords: ['himpunan penyelesaian', '-2', '3'] },
        ],
      },
    },
  });

  // 9. EXAM SCHEDULE (PAS-2026-MAT-X1)
  const examSchedule = await prisma.examSchedule.upsert({
    where: { id: 'sch_mat_x' },
    update: {
      code: 'PAS-2026-MAT-X1',
      title: 'Asesmen Sumatif Matematika Wajib Kelas X',
      teacherId: teacher.id,
      subjectId: dbSubjects['MAT'].id,
      status: 'ACTIVE',
      activeToken: '36S7KS',
      tokenRequired: true,
      examDate: new Date('2026-05-18T07:30:00.000Z'),
    },
    create: {
      id: 'sch_mat_x',
      schoolId: school.id,
      code: 'PAS-2026-MAT-X1',
      title: 'Asesmen Sumatif Matematika Wajib Kelas X',
      subjectId: dbSubjects['MAT'].id,
      teacherId: teacher.id,
      academicYear: '2025/2026',
      semester: 'GANJIL',
      examDate: new Date('2026-05-18T07:30:00.000Z'),
      startTime: '07:30',
      endTime: '09:30',
      durationMinutes: 90,
      sessionNumber: 1,
      tokenRequired: true,
      activeToken: '36S7KS',
      isTokenDynamic: false,
      proctorPin: '123456',
      randomizeQuestions: true,
      randomizeOptions: true,
      showResultDirectly: true,
      passScore: 75.0,
      maxViolations: 5,
      enableGracePeriod: true,
      gracePeriodSeconds: 4,
      enableWatermark: true,
      status: 'ACTIVE',
    },
  });

  // Assign to all 4 classes
  for (const c of Object.values(dbClasses)) {
    await prisma.examClassTarget.upsert({
      where: { examId_classId: { examId: examSchedule.id, classId: c.id } },
      update: {},
      create: { examId: examSchedule.id, classId: c.id },
    });
  }

  // Link questions
  const qIds = [q1.id, q2.id, q3.id, q4.id, q5.id, q6.id];
  for (let i = 0; i < qIds.length; i++) {
    await prisma.examQuestion.upsert({
      where: { examId_questionId: { examId: examSchedule.id, questionId: qIds[i] } },
      update: { order: i + 1 },
      create: { examId: examSchedule.id, questionId: qIds[i], order: i + 1 },
    });
  }

  // 10. ATTEMPTS FOR ANALYTICS (75 students completed, 1 in progress, 1 locked)
  for (let i = 0; i < studentIds.length; i++) {
    const sId = studentIds[i];
    const isArjun = i === 0;
    const isLocked = i === 84; // Sultan Al Qusyairy

    if (isArjun) {
      await prisma.studentExamAttempt.upsert({
        where: { examId_studentId: { examId: examSchedule.id, studentId: sId } },
        update: { status: 'IN_PROGRESS', totalScore: 75.0, percentageScore: 75.0, violationsCount: 0 },
        create: {
          examId: examSchedule.id,
          studentId: sId,
          status: 'IN_PROGRESS',
          startTime: new Date(),
          totalScore: 75.0,
          percentageScore: 75.0,
          totalCorrect: 4,
          totalWrong: 1,
          violationsCount: 0,
        },
      });
    } else if (isLocked) {
      await prisma.studentExamAttempt.upsert({
        where: { examId_studentId: { examId: examSchedule.id, studentId: sId } },
        update: { status: 'LOCKED', totalScore: 40.0, percentageScore: 40.0, violationsCount: 6, isLocked: true },
        create: {
          examId: examSchedule.id,
          studentId: sId,
          status: 'LOCKED',
          startTime: new Date(Date.now() - 3600000),
          totalScore: 40.0,
          percentageScore: 40.0,
          totalCorrect: 2,
          totalWrong: 4,
          violationsCount: 6,
          isLocked: true,
        },
      });
    } else if (i < 76) {
      const scores = [85, 92.5, 78, 88.5, 95, 70, 82.5, 90, 67.5, 97.5, 80, 86, 91, 74, 89];
      const score = scores[i % scores.length];
      const correct = Math.floor((score / 100) * 40);
      const wrong = 40 - correct;

      await prisma.studentExamAttempt.upsert({
        where: { examId_studentId: { examId: examSchedule.id, studentId: sId } },
        update: { status: 'SUBMITTED', totalScore: score, percentageScore: score, violationsCount: i % 9 === 0 ? 1 : 0 },
        create: {
          examId: examSchedule.id,
          studentId: sId,
          status: 'SUBMITTED',
          startTime: new Date(Date.now() - 7200000),
          submitTime: new Date(Date.now() - 3600000),
          totalScore: score,
          percentageScore: score,
          totalCorrect: correct,
          totalWrong: wrong,
          violationsCount: i % 9 === 0 ? 1 : 0,
        },
      });
    }
  }

  console.log('✓ Seeding database SMA selesai 100%! Semua data terintegrasi sempurna.');
}

main()
  .catch(async (e) => {
    console.error('❌ Error saat seeding:', e);
    await prisma.$disconnect().catch(() => {});
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
