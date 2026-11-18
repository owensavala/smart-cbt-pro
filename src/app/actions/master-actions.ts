'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ========================================================
// 1. DATA MAPEL (SUBJECTS)
// ========================================================

export interface SubjectInput {
  code: string;
  name: string;
  level: string;
  order?: number;
  isActive?: boolean;
}

export async function getSubjectsAction() {
  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { order: 'asc' },
    });

    return {
      success: true,
      data: subjects.map((s) => ({
        id: s.id,
        code: s.code,
        name: s.name,
        level: s.level,
        order: s.order,
        isActive: s.isActive,
      })),
    };
  } catch (error: any) {
    console.error('getSubjectsAction error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createSubjectAction(input: SubjectInput) {
  try {
    const school = await prisma.school.findFirst();
    if (!school) throw new Error('Data Master Sekolah belum ada.');

    const newSub = await prisma.subject.create({
      data: {
        schoolId: school.id,
        code: input.code,
        name: input.name,
        level: input.level || 'X',
        order: input.order || 0,
        isActive: input.isActive ?? true,
      },
    });

    try { revalidatePath('/'); } catch {}
    return { success: true, data: newSub };
  } catch (error: any) {
    console.error('createSubjectAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateSubjectAction(id: string, input: Partial<SubjectInput>) {
  try {
    const updated = await prisma.subject.update({
      where: { id },
      data: {
        ...(input.code && { code: input.code }),
        ...(input.name && { name: input.name }),
        ...(input.level && { level: input.level }),
        ...(input.order !== undefined && { order: input.order }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });

    try { revalidatePath('/'); } catch {}
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('updateSubjectAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteSubjectAction(id: string) {
  try {
    await prisma.subject.delete({
      where: { id },
    });

    try { revalidatePath('/'); } catch {}
    return { success: true };
  } catch (error: any) {
    console.error('deleteSubjectAction error:', error);
    return { success: false, error: error.message };
  }
}

// ========================================================
// 2. DATA RUANGAN (ROOMS)
// ========================================================

export interface RoomInput {
  code: string;
  name: string;
  capacity?: number;
  proctorName?: string;
  serverName?: string;
  description?: string;
}

export async function getRoomsAction() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { code: 'asc' },
    });

    return {
      success: true,
      data: rooms.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
        capacity: r.capacity,
        proctorName: r.proctorName || '-',
        serverName: r.serverName || 'SERVER-01',
        description: r.description || undefined,
      })),
    };
  } catch (error: any) {
    console.error('getRoomsAction error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createRoomAction(input: RoomInput) {
  try {
    const school = await prisma.school.findFirst();
    if (!school) throw new Error('Data Master Sekolah belum ada.');

    const newRoom = await prisma.room.create({
      data: {
        schoolId: school.id,
        code: input.code,
        name: input.name,
        capacity: input.capacity || 36,
        proctorName: input.proctorName || null,
        serverName: input.serverName || 'SR01',
        description: input.description || null,
      },
    });

    try { revalidatePath('/'); } catch {}
    return { success: true, data: newRoom };
  } catch (error: any) {
    console.error('createRoomAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateRoomAction(id: string, input: Partial<RoomInput>) {
  try {
    const updated = await prisma.room.update({
      where: { id },
      data: {
        ...(input.code && { code: input.code }),
        ...(input.name && { name: input.name }),
        ...(input.capacity !== undefined && { capacity: input.capacity }),
        ...(input.proctorName !== undefined && { proctorName: input.proctorName }),
        ...(input.serverName !== undefined && { serverName: input.serverName }),
        ...(input.description !== undefined && { description: input.description }),
      },
    });

    try { revalidatePath('/'); } catch {}
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('updateRoomAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteRoomAction(id: string) {
  try {
    await prisma.room.delete({
      where: { id },
    });

    try { revalidatePath('/'); } catch {}
    return { success: true };
  } catch (error: any) {
    console.error('deleteRoomAction error:', error);
    return { success: false, error: error.message };
  }
}

// ========================================================
// 3. DATA SESI (EXAM SESSIONS)
// ========================================================

export interface SessionInput {
  sessionNumber: number;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export async function getSessionsAction() {
  try {
    const sessions = await prisma.examSession.findMany({
      orderBy: { sessionNumber: 'asc' },
    });

    return {
      success: true,
      data: sessions.map((s) => ({
        id: s.id,
        sessionNumber: s.sessionNumber,
        name: s.name,
        timeRange: `${s.startTime} - ${s.endTime}`,
        startTime: s.startTime,
        endTime: s.endTime,
        description: s.description || undefined,
      })),
    };
  } catch (error: any) {
    console.error('getSessionsAction error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createSessionAction(input: SessionInput) {
  try {
    const school = await prisma.school.findFirst();
    if (!school) throw new Error('Data Master Sekolah belum ada.');

    const newSes = await prisma.examSession.create({
      data: {
        schoolId: school.id,
        sessionNumber: input.sessionNumber,
        name: input.name,
        startTime: input.startTime,
        endTime: input.endTime,
        description: input.description || null,
      },
    });

    try { revalidatePath('/'); } catch {}
    return { success: true, data: newSes };
  } catch (error: any) {
    console.error('createSessionAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateSessionAction(id: string, input: Partial<SessionInput>) {
  try {
    const updated = await prisma.examSession.update({
      where: { id },
      data: {
        ...(input.sessionNumber !== undefined && { sessionNumber: input.sessionNumber }),
        ...(input.name && { name: input.name }),
        ...(input.startTime && { startTime: input.startTime }),
        ...(input.endTime && { endTime: input.endTime }),
        ...(input.description !== undefined && { description: input.description }),
      },
    });

    try { revalidatePath('/'); } catch {}
    return { success: true, data: updated };
  } catch (error: any) {
    console.error('updateSessionAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteSessionAction(id: string) {
  try {
    await prisma.examSession.delete({
      where: { id },
    });

    try { revalidatePath('/'); } catch {}
    return { success: true };
  } catch (error: any) {
    console.error('deleteSessionAction error:', error);
    return { success: false, error: error.message };
  }
}

// ========================================================
// 4. BULK IMPORT MASTER DATA ACTION (DALAM SATU PINTU)
// ========================================================

export async function saveBulkMasterDataAction(payload: {
  classes: { name: string; level: string; jurusan?: string }[];
  rooms: { code: string; name: string; capacity?: number; serverName?: string }[];
  sessions: { sessionNumber: number; name: string; startTime?: string; endTime?: string }[];
  students: {
    noPeserta: string;
    nisn: string;
    nis?: string;
    name: string;
    level: string;
    className: string;
    jurusan?: string;
    username: string;
    passwordText?: string;
    room?: string;
    sessionNumber?: number;
    server?: string;
    photoUrl?: string;
  }[];
}) {
  try {
    const school = await prisma.school.findFirst();
    if (!school) {
      throw new Error('Data Master Sekolah belum ada.');
    }

    // 1. Upsert Rooms
    const roomMap = new Map<string, string>(); // code -> id
    for (const r of payload.rooms) {
      const existing = await prisma.room.findFirst({
        where: { schoolId: school.id, code: r.code },
      });
      if (existing) {
        roomMap.set(r.code, existing.id);
      } else {
        const created = await prisma.room.create({
          data: {
            schoolId: school.id,
            code: r.code,
            name: r.name || `Ruangan ${r.code}`,
            capacity: r.capacity || 36,
            serverName: r.serverName || 'SR01',
          },
        });
        roomMap.set(r.code, created.id);
      }
    }

    // 2. Upsert Sessions
    const sessionMap = new Map<number, string>(); // sessionNumber -> id
    for (const s of payload.sessions) {
      const existing = await prisma.examSession.findFirst({
        where: { schoolId: school.id, sessionNumber: s.sessionNumber },
      });
      if (existing) {
        sessionMap.set(s.sessionNumber, existing.id);
      } else {
        const created = await prisma.examSession.create({
          data: {
            schoolId: school.id,
            sessionNumber: s.sessionNumber,
            name: s.name || `Sesi ${s.sessionNumber}`,
            startTime: s.startTime || '07:30',
            endTime: s.endTime || '09:30',
          },
        });
        sessionMap.set(s.sessionNumber, created.id);
      }
    }

    // 3. Upsert Classes
    const classMap = new Map<string, string>(); // className -> id
    for (const c of payload.classes) {
      const existing = await prisma.class.findFirst({
        where: { schoolId: school.id, name: c.name },
      });
      if (existing) {
        classMap.set(c.name, existing.id);
      } else {
        const created = await prisma.class.create({
          data: {
            schoolId: school.id,
            name: c.name,
            level: c.level || 'X',
            major: c.jurusan || 'UMUM',
            academicYear: school.academicYear,
          },
        });
        classMap.set(c.name, created.id);
      }
    }

    // 4. Upsert Students
    let importedStudents = 0;
    const defaultPassword = '1010';
    const salt = await bcrypt.genSalt(10);
    const cachedHash = await bcrypt.hash(defaultPassword, salt);

    for (const st of payload.students) {
      const classId = classMap.get(st.className);
      if (!classId) continue;

      const roomId = st.room ? roomMap.get(st.room) || null : null;
      const sessNum = st.sessionNumber || 1;
      const sessionId = sessionMap.get(sessNum) || null;

      // Hash password
      let passHash = cachedHash;
      if (st.passwordText && st.passwordText !== defaultPassword) {
        passHash = await bcrypt.hash(st.passwordText, salt);
      }

      // Check user
      const existingUser = await prisma.user.findUnique({
        where: { username: st.username },
      });

      if (existingUser) {
        // Update user & student
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: st.name,
            password: passHash,
          },
        });

        await prisma.student.upsert({
          where: { userId: existingUser.id },
          update: {
            noPeserta: st.noPeserta,
            nisn: st.nisn,
            nis: st.nis || null,
            classId,
            roomId,
            sessionId,
            serverName: st.server || 'SR01',
            photoUrl: st.photoUrl || null,
          },
          create: {
            userId: existingUser.id,
            schoolId: school.id,
            noPeserta: st.noPeserta,
            nisn: st.nisn,
            nis: st.nis || null,
            classId,
            roomId,
            sessionId,
            serverName: st.server || 'SR01',
            photoUrl: st.photoUrl || null,
          },
        });
      } else {
        // Create user & student
        const newUser = await prisma.user.create({
          data: {
            username: st.username,
            name: st.name,
            password: passHash,
            role: 'STUDENT',
            isActive: true,
          },
        });

        await prisma.student.create({
          data: {
            userId: newUser.id,
            schoolId: school.id,
            noPeserta: st.noPeserta,
            nisn: st.nisn,
            nis: st.nis || null,
            classId,
            roomId,
            sessionId,
            serverName: st.server || 'SR01',
            photoUrl: st.photoUrl || null,
          },
        });
      }
      importedStudents++;
    }

    try { revalidatePath('/'); } catch {}

    return {
      success: true,
      data: {
        importedStudents,
        totalClasses: classMap.size,
        totalRooms: roomMap.size,
        totalSessions: sessionMap.size,
      },
    };
  } catch (error: any) {
    console.error('saveBulkMasterDataAction error:', error);
    return { success: false, error: error.message };
  }
}
