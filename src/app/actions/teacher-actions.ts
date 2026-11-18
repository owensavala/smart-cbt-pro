'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface TeacherInput {
  name: string;
  nip: string;
  username: string;
  password?: string;
  jabatan?: string;
  waliKelas?: string;
  kajur?: string;
  geminiApiKey?: string;
  assignedSubjectIds?: string[];
}

export async function getTeachersAction() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        assignedSubjects: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      success: true,
      data: teachers.map((t) => ({
        id: t.id,
        userId: t.userId,
        name: t.user.name,
        nip: t.nip || '-',
        username: t.user.username,
        passwordText: '••••••••',
        jabatan: t.title || 'Guru Mapel',
        waliKelas: t.waliKelas || '',
        kajur: t.kajur || '',
        geminiApiKey: t.geminiApiKey || '',
        assignedSubjectIds: t.assignedSubjects.map((as) => as.subjectId),
        assignedSubjectNames: t.assignedSubjects.map((as) => as.subject.name),
        isActive: t.user.isActive,
      })),
    };
  } catch (error: any) {
    console.error('getTeachersAction error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createTeacherAction(input: TeacherInput) {
  try {
    const school = await prisma.school.findFirst();
    if (!school) {
      throw new Error('Data Master Sekolah belum ada.');
    }

    const rawPassword = input.password || 'guru123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: input.username }, { teacherProfile: { nip: input.nip } }],
      },
    });

    if (existingUser) {
      return { success: false, error: 'Username atau NIP guru sudah terdaftar.' };
    }

    const teacher = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: input.username,
          password: hashedPassword,
          name: input.name,
          role: 'TEACHER',
          isActive: true,
        },
      });

      const newTeacher = await tx.teacher.create({
        data: {
          userId: user.id,
          schoolId: school.id,
          nip: input.nip,
          title: input.jabatan || 'Guru Mapel',
          waliKelas: input.waliKelas || null,
          kajur: input.kajur || null,
          geminiApiKey: input.geminiApiKey || null,
          assignedSubjects: input.assignedSubjectIds && input.assignedSubjectIds.length > 0
            ? {
                create: input.assignedSubjectIds.map((subId) => ({
                  subjectId: subId,
                })),
              }
            : undefined,
        },
        include: {
          user: true,
          assignedSubjects: true,
        },
      });

      return newTeacher;
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true, data: teacher };
  } catch (error: any) {
    console.error('createTeacherAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateTeacherAction(teacherId: string, input: Partial<TeacherInput>) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: { user: true },
    });

    if (!teacher) {
      return { success: false, error: 'Data guru tidak ditemukan.' };
    }

    await prisma.$transaction(async (tx) => {
      const userUpdate: any = {};
      if (input.name) userUpdate.name = input.name;
      if (input.username) userUpdate.username = input.username;
      if (input.password && input.password.trim() !== '' && !input.password.includes('•')) {
        const salt = await bcrypt.genSalt(10);
        userUpdate.password = await bcrypt.hash(input.password, salt);
      }

      if (Object.keys(userUpdate).length > 0) {
        await tx.user.update({
          where: { id: teacher.userId },
          data: userUpdate,
        });
      }

      const teacherUpdate: any = {};
      if (input.nip !== undefined) teacherUpdate.nip = input.nip;
      if (input.jabatan !== undefined) teacherUpdate.title = input.jabatan;
      if (input.waliKelas !== undefined) teacherUpdate.waliKelas = input.waliKelas;
      if (input.kajur !== undefined) teacherUpdate.kajur = input.kajur;
      if (input.geminiApiKey !== undefined) teacherUpdate.geminiApiKey = input.geminiApiKey;

      if (input.assignedSubjectIds !== undefined) {
        await tx.teacherSubject.deleteMany({
          where: { teacherId },
        });
        if (input.assignedSubjectIds.length > 0) {
          await tx.teacherSubject.createMany({
            data: input.assignedSubjectIds.map((subId) => ({
              teacherId,
              subjectId: subId,
            })),
          });
        }
      }

      await tx.teacher.update({
        where: { id: teacherId },
        data: teacherUpdate,
      });
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true };
  } catch (error: any) {
    console.error('updateTeacherAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteTeacherAction(teacherId: string) {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      return { success: false, error: 'Guru tidak ditemukan.' };
    }

    await prisma.user.delete({
      where: { id: teacher.userId },
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true };
  } catch (error: any) {
    console.error('deleteTeacherAction error:', error);
    return { success: false, error: error.message };
  }
}
