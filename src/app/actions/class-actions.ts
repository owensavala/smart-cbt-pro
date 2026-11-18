'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface ClassInput {
  name: string;
  level: string;
  major?: string;
  academicYear?: string;
  waliKelasId?: string;
}

export async function getClassesAction() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        _count: {
          select: { students: true },
        },
        waliKelas: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return {
      success: true,
      data: classes.map((c) => ({
        id: c.id,
        name: c.name,
        level: c.level,
        jurusan: c.major || 'UMUM',
        waliKelas: c.waliKelas?.user.name || '-',
        waliKelasId: c.waliKelasId || undefined,
        totalStudents: c._count.students,
        academicYear: c.academicYear,
      })),
    };
  } catch (error: any) {
    console.error('getClassesAction error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createClassAction(input: ClassInput) {
  try {
    const school = await prisma.school.findFirst();
    if (!school) {
      throw new Error('Data Master Sekolah belum ada.');
    }

    const year = input.academicYear || school.academicYear;

    const existingClass = await prisma.class.findUnique({
      where: {
        schoolId_name_academicYear: {
          schoolId: school.id,
          name: input.name,
          academicYear: year,
        },
      },
    });

    if (existingClass) {
      return { success: false, error: `Kelas ${input.name} untuk T.A ${year} sudah ada.` };
    }

    const newClass = await prisma.class.create({
      data: {
        schoolId: school.id,
        name: input.name,
        level: input.level,
        major: input.major || 'UMUM',
        academicYear: year,
        waliKelasId: input.waliKelasId || null,
      },
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true, data: newClass };
  } catch (error: any) {
    console.error('createClassAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateClassAction(classId: string, input: Partial<ClassInput>) {
  try {
    await prisma.class.update({
      where: { id: classId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.level && { level: input.level }),
        ...(input.major !== undefined && { major: input.major }),
        ...(input.waliKelasId !== undefined && { waliKelasId: input.waliKelasId || null }),
      },
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true };
  } catch (error: any) {
    console.error('updateClassAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteClassAction(classId: string) {
  try {
    // Cek apakah masih ada siswa di kelas ini
    const studentCount = await prisma.student.count({
      where: { classId },
    });

    if (studentCount > 0) {
      return {
        success: false,
        error: `Tidak dapat menghapus kelas karena masih ada ${studentCount} siswa terdaftar di dalamnya.`,
      };
    }

    await prisma.class.delete({
      where: { id: classId },
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true };
  } catch (error: any) {
    console.error('deleteClassAction error:', error);
    return { success: false, error: error.message };
  }
}
