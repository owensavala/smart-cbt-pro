'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ExamStatus } from '@prisma/client';
import { MOCK_EXAM_SCHEDULES } from '@/lib/mock-data';

export type DayOfWeekIndo = 'MINGGU' | 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU';

export interface ExamScheduleInput {
  code: string;
  title: string;
  subjectId: string;
  teacherId?: string;
  examDate?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  sessionNumber?: number;
  tokenRequired?: boolean;
  activeToken?: string;
  randomizeQuestions: boolean; // SAKLAR ON/OFF ACAK SOAL
  randomizeOptions: boolean;   // SAKLAR ON/OFF ACAK OPSI JAWABAN (A-E)
  passScore?: number;
  maxViolations?: number;
  enableGracePeriod?: boolean;
  gracePeriodSeconds?: number;
  enableWatermark?: boolean;
  status?: ExamStatus;
  targetClassIds?: string[];
}

const DAY_OF_WEEK_MAP: Record<number, DayOfWeekIndo> = {
  0: 'MINGGU',
  1: 'SENIN',
  2: 'SELASA',
  3: 'RABU',
  4: 'KAMIS',
  5: 'JUMAT',
  6: 'SABTU',
};

export async function getExamSchedulesAction() {
  try {
    const schedules = await prisma.examSchedule.findMany({
      include: {
        subject: true,
        teacher: {
          include: {
            user: true,
          },
        },
        targetClasses: {
          include: {
            class: true,
          },
        },
        examQuestions: {
          include: {
            question: {
              include: {
                options: true,
                matchingPairs: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { examDate: 'asc' },
    });

    return {
      success: true,
      error: undefined as string | undefined,
      data: schedules.map((s) => ({
        id: s.id,
        code: s.code,
        title: s.title,
        subjectId: s.subjectId,
        subjectName: s.subject.name,
        subject: s.subject.name,
        level: s.subject.level,
        grade: s.subject.level,
        className: s.targetClasses.map((tc) => tc.class.name).join(', ') || 'Semua Kelas',
        targetClassIds: s.targetClasses.map((tc) => tc.classId),
        teacherId: s.teacherId,
        teacherName: s.teacher.user.name,
        examDate: s.examDate.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        rawExamDate: s.examDate.toISOString().split('T')[0],
        dayOfWeek: (DAY_OF_WEEK_MAP[s.examDate.getDay()] || 'SENIN') as DayOfWeekIndo,
        startTime: s.startTime,
        endTime: s.endTime,
        durationMinutes: s.durationMinutes,
        sessionNumber: s.sessionNumber || 1,
        isActive: s.status === 'ACTIVE',
        status: s.status,
        totalQuestions: s.examQuestions.length,
        tokenRequired: s.tokenRequired,
        activeToken: s.activeToken || '36S7KS',
        proctorPin: s.proctorPin || '123456',
        randomizeQuestions: s.randomizeQuestions, // SAKLAR ACAK SOAL
        randomizeOptions: s.randomizeOptions,     // SAKLAR ACAK OPSI
        passScore: s.passScore,
        maxViolations: s.maxViolations,
        enableGracePeriod: s.enableGracePeriod,
        gracePeriodSeconds: s.gracePeriodSeconds,
        enableWatermark: s.enableWatermark,
        questions: s.examQuestions.map((eq, idx) => ({
          id: eq.question.id,
          number: idx + 1,
          type: eq.question.type,
          prompt: eq.question.prompt,
          imageUrl: eq.question.imageUrl || undefined,
          imageCaption: eq.question.imageCaption || undefined,
          points: eq.question.points,
          subjectId: s.subjectId,
          options: eq.question.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            code: opt.code,
            isCorrect: opt.isCorrect,
          })),
          correctOptionId: eq.question.options.find((o) => o.isCorrect)?.id || '',
          pairs: (eq.question.matchingPairs || []).map((m) => ({
            id: m.id,
            premise: m.premise,
            target: m.target,
          })),
          acceptableAnswers: (eq.question.acceptableAnswers as string[]) || [],
          rubric: (eq.question.essayRubric as any) || undefined,
        })),
      })),
    };
  } catch (error: any) {
    console.warn('getExamSchedulesAction database unavailable, falling back to mock data:', error?.message || error);
    return {
      success: true,
      error: undefined as string | undefined,
      data: MOCK_EXAM_SCHEDULES.map((s) => ({
        id: s.id,
        code: s.code,
        title: s.title,
        subjectId: s.subjectId,
        subjectName: s.subjectName || s.subject || 'Mata Pelajaran',
        subject: s.subjectName || s.subject || 'Mata Pelajaran',
        level: s.level,
        grade: s.level,
        className: s.className || 'Semua Kelas',
        targetClassIds: [],
        teacherId: s.teacherId,
        teacherName: s.teacherName,
        examDate: s.examDate,
        rawExamDate: s.examDate,
        dayOfWeek: (s.dayOfWeek || 'SENIN') as DayOfWeekIndo,
        startTime: s.startTime,
        endTime: s.endTime,
        durationMinutes: s.durationMinutes,
        sessionNumber: s.sessionNumber || 1,
        isActive: s.isActive ?? true,
        status: ((s.isActive ?? true) ? 'ACTIVE' : 'DRAFT') as ExamStatus,
        totalQuestions: s.totalQuestions || (s.questions ? s.questions.length : 0),
        tokenRequired: s.tokenRequired ?? true,
        activeToken: s.activeToken || '36S7KS',
        proctorPin: s.proctorPin || '123456',
        randomizeQuestions: s.randomizeQuestions ?? true,
        randomizeOptions: s.randomizeOptions ?? true,
        passScore: 75,
        maxViolations: 3,
        enableGracePeriod: true,
        gracePeriodSeconds: 4,
        enableWatermark: true,
        questions: (s.questions || []).map((q, idx) => ({
          id: q.id,
          number: idx + 1,
          type: q.type,
          prompt: q.prompt,
          imageUrl: (q as any).imageUrl || undefined,
          imageCaption: (q as any).imageCaption || undefined,
          points: q.points,
          subjectId: s.subjectId,
          options: 'options' in q && Array.isArray((q as any).options)
            ? (q as any).options.map((opt: any) => ({
                id: opt.id,
                text: opt.text,
                code: opt.id,
                isCorrect: opt.id === (q as any).correctOptionId,
              }))
            : [],
          correctOptionId: 'correctOptionId' in q ? (q as any).correctOptionId : '',
          pairs: 'pairs' in q && Array.isArray((q as any).pairs) ? (q as any).pairs : [],
          acceptableAnswers: 'acceptableAnswers' in q && Array.isArray((q as any).acceptableAnswers) ? (q as any).acceptableAnswers : [],
          rubric: (q as any).rubric || undefined,
        })),
      })),
    };
  }
}

export async function createExamScheduleAction(input: ExamScheduleInput) {
  try {
    const school = await prisma.school.findFirst();
    if (!school) {
      throw new Error('Data Master Sekolah belum ada.');
    }

    // Default teacher jika tidak dispesifikasikan
    let teacherId = input.teacherId;
    if (!teacherId) {
      const firstTeacher = await prisma.teacher.findFirst();
      if (!firstTeacher) throw new Error('Data Guru belum ada.');
      teacherId = firstTeacher.id;
    }

    const examDate = input.examDate ? new Date(input.examDate) : new Date();

    const schedule = await prisma.examSchedule.create({
      data: {
        schoolId: school.id,
        code: input.code || `EXAM-${Date.now().toString(36).toUpperCase()}`,
        title: input.title,
        subjectId: input.subjectId,
        teacherId,
        examDate,
        startTime: input.startTime,
        endTime: input.endTime,
        durationMinutes: input.durationMinutes || 90,
        sessionNumber: input.sessionNumber || 1,
        tokenRequired: input.tokenRequired ?? true,
        activeToken: input.activeToken || '36S7KS',
        randomizeQuestions: input.randomizeQuestions ?? true,
        randomizeOptions: input.randomizeOptions ?? true,
        passScore: input.passScore || 75.0,
        maxViolations: input.maxViolations || 3,
        status: input.status || 'SCHEDULED',
        targetClasses: input.targetClassIds && input.targetClassIds.length > 0
          ? {
              create: input.targetClassIds.map((cId) => ({
                classId: cId,
              })),
            }
          : undefined,
      },
      include: {
        targetClasses: true,
      },
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true, data: schedule };
  } catch (error: any) {
    console.error('createExamScheduleAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateExamScheduleAction(scheduleId: string, input: Partial<ExamScheduleInput>) {
  try {
    const dataUpdate: any = {};
    if (input.code) dataUpdate.code = input.code;
    if (input.title) dataUpdate.title = input.title;
    if (input.subjectId) dataUpdate.subjectId = input.subjectId;
    if (input.teacherId) dataUpdate.teacherId = input.teacherId;
    if (input.examDate) dataUpdate.examDate = new Date(input.examDate);
    if (input.startTime) dataUpdate.startTime = input.startTime;
    if (input.endTime) dataUpdate.endTime = input.endTime;
    if (input.durationMinutes !== undefined) dataUpdate.durationMinutes = input.durationMinutes;
    if (input.sessionNumber !== undefined) dataUpdate.sessionNumber = input.sessionNumber;
    if (input.tokenRequired !== undefined) dataUpdate.tokenRequired = input.tokenRequired;
    if (input.activeToken !== undefined) dataUpdate.activeToken = input.activeToken;
    if (input.randomizeQuestions !== undefined) dataUpdate.randomizeQuestions = input.randomizeQuestions;
    if (input.randomizeOptions !== undefined) dataUpdate.randomizeOptions = input.randomizeOptions;
    if (input.passScore !== undefined) dataUpdate.passScore = input.passScore;
    if (input.status) dataUpdate.status = input.status;

    if (input.targetClassIds !== undefined) {
      await prisma.examClassTarget.deleteMany({
        where: { examId: scheduleId },
      });
      if (input.targetClassIds.length > 0) {
        await prisma.examClassTarget.createMany({
          data: input.targetClassIds.map((cId) => ({
            examId: scheduleId,
            classId: cId,
          })),
        });
      }
    }

    await prisma.examSchedule.update({
      where: { id: scheduleId },
      data: dataUpdate,
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true };
  } catch (error: any) {
    console.error('updateExamScheduleAction error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteExamScheduleAction(scheduleId: string) {
  try {
    await prisma.examSchedule.delete({
      where: { id: scheduleId },
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true };
  } catch (error: any) {
    console.error('deleteExamScheduleAction error:', error);
    return { success: false, error: error.message };
  }
}
