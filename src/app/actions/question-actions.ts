'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { QuestionType, PgkSubtype, DifficultyLevel } from '@prisma/client';

export interface QuestionBankInput {
  title: string;
  code: string;
  level: string;
  subjectId: string;
  teacherId?: string;
}

export interface QuestionInput {
  questionBankId?: string;
  subjectId: string;
  type: QuestionType;
  prompt: string;
  passage?: string;
  imageUrl?: string;
  imageCaption?: string;
  points?: number;
  difficulty?: DifficultyLevel;
  randomizeOptions?: boolean;

  // Khusus PG (Pilihan Ganda Biasa)
  options?: {
    code: string;
    text: string;
    isCorrect: boolean;
  }[];

  // Khusus PGK (Pilihan Ganda Kompleks)
  pgkSubtype?: PgkSubtype;
  pgkOptions?: {
    code: string;
    text: string;
    isCorrect: boolean;
    scoreWeight?: number;
    statement?: string; // Khusus matriks Benar/Salah
  }[];

  // Khusus MATCHING (Menjodohkan)
  matchingPairs?: {
    premise: string;
    target: string;
  }[];

  // Khusus SHORT_ANSWER (Isian Singkat)
  acceptableAnswers?: string[];

  // Khusus ESSAY (Uraian / Esai AI)
  idealAnswer?: string;
  essayRubric?: {
    maxScore: number;
    keyPoints: {
      concept: string;
      weight: number;
      mandatoryKeywords: string[];
      synonyms?: string[][];
    }[];
    strictness?: 'lenient' | 'standard' | 'strict';
    negationDetection?: boolean;
  };
}

// 1. GET ALL QUESTION BANKS
export async function getQuestionBanksAction() {
  try {
    const banks = await prisma.questionBank.findMany({
      include: {
        subject: true,
        teacher: {
          include: {
            user: true,
          },
        },
        questions: {
          include: {
            options: { orderBy: { order: 'asc' } },
            matchingPairs: { orderBy: { order: 'asc' } },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return {
      success: true,
      data: banks.map((b) => ({
        id: b.id,
        code: b.code,
        title: b.title,
        level: b.level,
        subjectId: b.subjectId,
        subjectName: b.subject.name,
        teacherId: b.teacherId,
        teacherName: b.teacher?.user?.name || 'Guru Pengampu',
        totalQuestions: b.questions.length,
        questions: b.questions.map((q, idx) => ({
          id: q.id,
          number: idx + 1,
          type: q.type,
          prompt: q.prompt,
          passage: q.passage || '',
          imageUrl: q.imageUrl || undefined,
          imageCaption: q.imageCaption || undefined,
          points: q.points,
          difficulty: q.difficulty,
          pgkSubtype: q.pgkSubtype,
          options: q.options.map((o) => ({
            id: o.id,
            code: o.code,
            text: o.text,
            isCorrect: o.isCorrect,
            statement: o.statement || '',
          })),
          correctOptionId: q.options.find((o) => o.isCorrect)?.id || '',
          matchingPairs: q.matchingPairs.map((m) => ({
            id: m.id,
            premise: m.premise,
            target: m.target,
          })),
          acceptableAnswers: (q.acceptableAnswers as string[]) || [],
          idealAnswer: q.idealAnswer || '',
          essayRubric: q.essayRubric,
        })),
      })),
    };
  } catch (error: any) {
    console.error('getQuestionBanksAction error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

// 2. CREATE QUESTION BANK
export async function createQuestionBankAction(input: QuestionBankInput) {
  try {
    const school = await prisma.school.findFirst();
    if (!school) throw new Error('Data Master Sekolah belum ada.');

    let teacherId = input.teacherId;
    if (!teacherId) {
      const teacher = await prisma.teacher.findFirst();
      if (!teacher) throw new Error('Data Guru belum ada.');
      teacherId = teacher.id;
    }

    const bank = await prisma.questionBank.create({
      data: {
        schoolId: school.id,
        subjectId: input.subjectId,
        teacherId,
        code: input.code,
        title: input.title,
        level: input.level,
      },
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true, data: bank };
  } catch (error: any) {
    console.error('createQuestionBankAction error:', error);
    return { success: false, error: error.message };
  }
}

// 3. CREATE QUESTION (MENDUKUNG 5 TIPE ANBK)
export async function createQuestionAction(input: QuestionInput) {
  try {
    const question = await prisma.question.create({
      data: {
        questionBankId: input.questionBankId || null,
        type: input.type,
        pgkSubtype: input.type === 'PGK' ? input.pgkSubtype || 'MULTI_SELECT' : null,
        prompt: input.prompt,
        passage: input.passage || null,
        imageUrl: input.imageUrl || null,
        imageCaption: input.imageCaption || null,
        points: input.points || (input.type === 'ESSAY' ? 10.0 : 2.0),
        difficulty: input.difficulty || 'MEDIUM',
        randomizeOptions: input.randomizeOptions ?? true,
        idealAnswer: input.type === 'ESSAY' ? input.idealAnswer || null : null,
        essayRubric: input.type === 'ESSAY' ? (input.essayRubric as any) || null : null,
        acceptableAnswers: input.type === 'SHORT_ANSWER' ? (input.acceptableAnswers as any) || null : null,
        // Opsi untuk PG & PGK
        options:
          input.type === 'PG' && input.options && input.options.length > 0
            ? {
                create: input.options.map((opt, idx) => ({
                  code: opt.code || String.fromCharCode(65 + idx),
                  text: opt.text,
                  isCorrect: opt.isCorrect,
                  order: idx + 1,
                })),
              }
            : input.type === 'PGK' && input.pgkOptions && input.pgkOptions.length > 0
            ? {
                create: input.pgkOptions.map((opt, idx) => ({
                  code: opt.code || String.fromCharCode(65 + idx),
                  text: opt.text,
                  isCorrect: opt.isCorrect,
                  statement: opt.statement || null,
                  scoreWeight: opt.scoreWeight || 1.0,
                  order: idx + 1,
                })),
              }
            : undefined,
        // Pasangan untuk MATCHING
        matchingPairs:
          input.type === 'MATCHING' && input.matchingPairs && input.matchingPairs.length > 0
            ? {
                create: input.matchingPairs.map((pair, idx) => ({
                  premise: pair.premise,
                  target: pair.target,
                  order: idx + 1,
                })),
              }
            : undefined,
      },
      include: {
        options: true,
        matchingPairs: true,
      },
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true, data: question };
  } catch (error: any) {
    console.error('createQuestionAction error:', error);
    return { success: false, error: error.message };
  }
}

// 4. DELETE QUESTION
export async function deleteQuestionAction(questionId: string) {
  try {
    await prisma.question.delete({
      where: { id: questionId },
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true };
  } catch (error: any) {
    console.error('deleteQuestionAction error:', error);
    return { success: false, error: error.message };
  }
}
