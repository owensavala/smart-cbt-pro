'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { evaluateEssay } from '@/lib/essay-evaluator';
import { ViolationType } from '@prisma/client';
import { MOCK_EXAM_SCHEDULES } from '@/lib/mock-data';

export interface MockAttemptState {
  attemptId: string;
  examId: string;
  studentId: string;
  status: 'IN_PROGRESS' | 'LOCKED' | 'SUBMITTED';
  violationsCount: number;
  isLocked: boolean;
  maxViolationsAllowed: number;
  proctorPin: string;
  remainingSeconds: number;
  currentQuestionIndex: number;
  savedAnswers: Record<string, any>;
  flaggedQuestions: Record<string, boolean>;
}

const globalForAttempts = globalThis as unknown as {
  mockAttemptStore?: Map<string, MockAttemptState>;
};

const mockAttemptStore =
  globalForAttempts.mockAttemptStore || new Map<string, MockAttemptState>();

if (process.env.NODE_ENV !== 'production') {
  globalForAttempts.mockAttemptStore = mockAttemptStore;
}

export async function getMockAttemptStateAction(attemptId: string) {
  return mockAttemptStore.get(attemptId);
}

export interface StartAttemptInput {
  examId: string;
  studentId: string;
  enteredToken?: string;
}

export interface BackgroundSyncAnswerInput {
  attemptId: string;
  questionId: string;
  questionType: 'PG' | 'PGK' | 'MATCHING' | 'SHORT' | 'ESSAY';
  answerValue: any;
  isDoubtful: boolean;
  remainingSeconds?: number;
  currentQuestionIndex?: number;
}

export interface RecordViolationInput {
  attemptId: string;
  examId: string;
  studentId: string;
  violationType: ViolationType;
  durationMs?: number;
  details?: string;
}

/**
 * 1. INISIASI ATAU RESTORE SESI UJIAN SISWA (TOKEN GATE & RESUME)
 */
export async function startExamAttemptAction(input: StartAttemptInput) {
  try {
    const entered = (input.enteredToken || '').trim().toUpperCase();

    // 1. Coba lookup jadwal ujian dari PostgreSQL berdasarkan ID
    let exam: any = null;
    try {
      exam = await prisma.examSchedule.findUnique({
        where: { id: input.examId },
        include: {
          targetClasses: { include: { class: true } },
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
      });
    } catch (err) {
      console.warn('Prisma lookup by id failed:', err);
    }

    // 2. Fallback pencocokan kode atau token aktif di DB
    if (!exam) {
      try {
        exam = await prisma.examSchedule.findUnique({
          where: { code: input.examId },
          include: {
            targetClasses: { include: { class: true } },
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
        });
      } catch (err) {
        console.warn('Prisma secondary lookup failed:', err);
      }
    }

    // 3. Fallback ke MOCK_EXAM_SCHEDULES jika tidak ditemukan di database
    if (!exam) {
      const mockExam =
        MOCK_EXAM_SCHEDULES.find((m) => m.id === input.examId) ||
        MOCK_EXAM_SCHEDULES.find((m) => m.code === input.examId);

      if (mockExam) {
        if (mockExam.tokenRequired) {
          const activeTok = (mockExam.activeToken || '').trim().toUpperCase();
          if (!entered || entered !== activeTok) {
            return {
              success: false,
              error: 'Token ujian tidak valid! Pastikan sesuai dengan token yang dirilis pengawas.',
            };
          }
        }

        const attemptId = `mock_attempt_${Date.now()}`;
        const targetPin = mockExam.proctorPin || '123456';
        const maxAllowed = 3;

        let existingAttempt: MockAttemptState | undefined;
        for (const state of mockAttemptStore.values()) {
          if (state.examId === mockExam.id && state.studentId === input.studentId && state.status !== 'SUBMITTED') {
            existingAttempt = state;
            break;
          }
        }

        if (!existingAttempt) {
          existingAttempt = {
            attemptId,
            examId: mockExam.id,
            studentId: input.studentId,
            status: 'IN_PROGRESS',
            violationsCount: 0,
            isLocked: false,
            maxViolationsAllowed: maxAllowed,
            proctorPin: targetPin,
            remainingSeconds: mockExam.durationMinutes * 60,
            currentQuestionIndex: 0,
            savedAnswers: {},
            flaggedQuestions: {},
          };
          mockAttemptStore.set(attemptId, existingAttempt);
        }

        return {
          success: true,
          data: {
            attemptId: existingAttempt.attemptId,
            examId: mockExam.id,
            examTitle: mockExam.title,
            status: existingAttempt.status,
            remainingSeconds: existingAttempt.remainingSeconds,
            currentQuestionIndex: existingAttempt.currentQuestionIndex,
            violationsCount: existingAttempt.violationsCount,
            isLocked: existingAttempt.isLocked,
            savedAnswers: existingAttempt.savedAnswers,
            flaggedQuestions: existingAttempt.flaggedQuestions,
            maxViolationsAllowed: existingAttempt.maxViolationsAllowed,
            proctorPin: existingAttempt.proctorPin,
            randomizeQuestions: mockExam.randomizeQuestions ?? true,
            randomizeOptions: mockExam.randomizeOptions ?? true,
          },
        };
      }

      return { success: false, error: 'Jadwal ujian tidak ditemukan.' };
    }

    // Validasi Token Ujian jika diwajibkan
    if (exam.tokenRequired) {
      const activeTok = (exam.activeToken || '').trim().toUpperCase();
      if (!entered || entered !== activeTok) {
        return {
          success: false,
          error: 'Token ujian tidak valid! Pastikan sesuai dengan token yang dirilis pengawas.',
        };
      }
    }

    // Resolve Student di DB
    let effectiveStudentId = input.studentId;
    try {
      const existingStudent = await prisma.student.findUnique({
        where: { id: input.studentId },
      });

      if (existingStudent) {
        effectiveStudentId = existingStudent.id;
      } else {
        const studentMatch = await prisma.student.findFirst({
          where: {
            OR: [
              { user: { username: input.studentId } },
              { noPeserta: input.studentId },
            ],
          },
        });

        if (studentMatch) {
          effectiveStudentId = studentMatch.id;
        }
      }
    } catch (stdErr) {
      console.warn('Student lookup error:', stdErr);
    }

    // Cari atau buat StudentExamAttempt
    let attempt: any = null;
    try {
      attempt = await prisma.studentExamAttempt.findUnique({
        where: {
          examId_studentId: {
            examId: exam.id,
            studentId: effectiveStudentId,
          },
        },
        include: {
          answers: true,
          violationLogs: {
            orderBy: { timestamp: 'desc' },
          },
        },
      });

      if (!attempt) {
        attempt = await prisma.studentExamAttempt.create({
          data: {
            examId: exam.id,
            studentId: effectiveStudentId,
            status: 'IN_PROGRESS',
            tokenUsed: input.enteredToken || exam.activeToken,
            startTime: new Date(),
            remainingSeconds: exam.durationMinutes * 60,
            currentQuestionIndex: 0,
            violationsCount: 0,
            isLocked: false,
            maxPossibleScore:
              exam.examQuestions?.reduce((acc: number, eq: any) => acc + (eq.question?.points || 0), 0) || 100,
          },
          include: {
            answers: true,
            violationLogs: true,
          },
        });
      }
    } catch (attemptErr) {
      console.warn('StudentExamAttempt DB creation error, returning simulated attempt:', attemptErr);
      const simAttemptId = `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const simAttemptState: MockAttemptState = {
        attemptId: simAttemptId,
        examId: exam.id,
        studentId: effectiveStudentId,
        status: 'IN_PROGRESS',
        remainingSeconds: exam.durationMinutes * 60,
        currentQuestionIndex: 0,
        violationsCount: 0,
        isLocked: false,
        maxViolationsAllowed: exam.maxViolations || 3,
        proctorPin: exam.proctorPin || '123456',
        savedAnswers: {},
        flaggedQuestions: {},
      };
      mockAttemptStore.set(simAttemptId, simAttemptState);
      return {
        success: true,
        data: {
          attemptId: simAttemptId,
          examId: exam.id,
          examTitle: exam.title,
          status: 'IN_PROGRESS',
          remainingSeconds: exam.durationMinutes * 60,
          currentQuestionIndex: 0,
          violationsCount: 0,
          isLocked: false,
          savedAnswers: {},
          flaggedQuestions: {},
          maxViolationsAllowed: exam.maxViolations || 3,
          proctorPin: exam.proctorPin || '123456',
          randomizeQuestions: exam.randomizeQuestions,
          randomizeOptions: exam.randomizeOptions,
        },
      };
    }

    // Format jawaban yang sudah tersimpan di database
    const savedAnswersMap: Record<string, any> = {};
    const flaggedMap: Record<string, boolean> = {};

    if (attempt?.answers) {
      for (const a of attempt.answers) {
        if (a.selectedOptionId) savedAnswersMap[a.questionId] = a.selectedOptionId;
        else if (a.selectedOptionIds) savedAnswersMap[a.questionId] = a.selectedOptionIds;
        else if (a.matchingAnswers) savedAnswersMap[a.questionId] = a.matchingAnswers;
        else if (a.shortAnswer) savedAnswersMap[a.questionId] = a.shortAnswer;
        else if (a.essayAnswer) savedAnswersMap[a.questionId] = a.essayAnswer;

        if (a.isDoubtful) flaggedMap[a.questionId] = true;
      }
    }

    return {
      success: true,
      data: {
        attemptId: attempt.id,
        examId: exam.id,
        examTitle: exam.title,
        status: attempt.status,
        remainingSeconds: attempt.remainingSeconds ?? exam.durationMinutes * 60,
        currentQuestionIndex: attempt.currentQuestionIndex,
        violationsCount: attempt.violationsCount,
        isLocked: attempt.isLocked,
        savedAnswers: savedAnswersMap,
        flaggedQuestions: flaggedMap,
        maxViolationsAllowed: exam.maxViolations || 3,
        proctorPin: exam.proctorPin || '123456',
        randomizeQuestions: exam.randomizeQuestions,
        randomizeOptions: exam.randomizeOptions,
      },
    };
  } catch (error: any) {
    console.error('startExamAttemptAction error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 2. BACKGROUND SYNC JAWABAN SISWA KE POSTGRESQL
 * Dipanggil setiap kali siswa berpindah nomor soal atau jeda berkala
 */
export async function backgroundSyncAnswerAction(input: BackgroundSyncAnswerInput) {
  try {
    const { attemptId, questionId, questionType, answerValue, isDoubtful, remainingSeconds, currentQuestionIndex } = input;

    if (attemptId.startsWith('mock_') || attemptId.startsWith('fallback_')) {
      const state = mockAttemptStore.get(attemptId);
      if (state) {
        state.savedAnswers[questionId] = answerValue;
        if (isDoubtful) state.flaggedQuestions[questionId] = true;
        else delete state.flaggedQuestions[questionId];
        if (remainingSeconds !== undefined) state.remainingSeconds = remainingSeconds;
        if (currentQuestionIndex !== undefined) state.currentQuestionIndex = currentQuestionIndex;
      }
      return { success: true, timestamp: Date.now() };
    }

    // Siapkan kolom sesuai tipe soal
    let selectedOptionId: string | null = null;
    let selectedOptionIds: any = null;
    let matchingAnswers: any = null;
    let shortAnswer: string | null = null;
    let essayAnswer: string | null = null;

    if (questionType === 'PG') {
      selectedOptionId = typeof answerValue === 'string' ? answerValue : null;
    } else if (questionType === 'PGK') {
      selectedOptionIds = Array.isArray(answerValue) ? answerValue : [];
    } else if (questionType === 'MATCHING') {
      matchingAnswers = answerValue || {};
    } else if (questionType === 'SHORT') {
      shortAnswer = typeof answerValue === 'string' ? answerValue : '';
    } else if (questionType === 'ESSAY') {
      essayAnswer = typeof answerValue === 'string' ? answerValue : '';
    }

    // Upsert StudentAnswer
    await prisma.studentAnswer.upsert({
      where: {
        attemptId_questionId: {
          attemptId,
          questionId,
        },
      },
      create: {
        attemptId,
        questionId,
        isDoubtful,
        selectedOptionId,
        selectedOptionIds,
        matchingAnswers,
        shortAnswer,
        essayAnswer,
        syncSource: 'INDEXED_DB',
        answeredAt: new Date(),
      },
      update: {
        isDoubtful,
        selectedOptionId,
        selectedOptionIds,
        matchingAnswers,
        shortAnswer,
        essayAnswer,
        syncSource: 'INDEXED_DB',
        updatedAt: new Date(),
      },
    });

    // Update attempt progress
    const updateData: any = {
      lastActive: new Date(),
    };
    if (remainingSeconds !== undefined) updateData.remainingSeconds = remainingSeconds;
    if (currentQuestionIndex !== undefined) updateData.currentQuestionIndex = currentQuestionIndex;

    await prisma.studentExamAttempt.update({
      where: { id: attemptId },
      data: updateData,
    });

    return { success: true, timestamp: Date.now() };
  } catch (error: any) {
    console.error('backgroundSyncAnswerAction error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 3. LOG PELANGGARAN ANTI-CHEAT KE DATABASE (SETELAH GRACE PERIOD 4 DETIK GAGAL)
 */
export async function recordViolationAction(input: RecordViolationInput) {
  try {
    if (input.attemptId.startsWith('mock_') || input.attemptId.startsWith('fallback_')) {
      let state = mockAttemptStore.get(input.attemptId);
      if (!state) {
        const mockExam =
          MOCK_EXAM_SCHEDULES.find((m) => m.id === input.examId || m.code === input.examId) ||
          MOCK_EXAM_SCHEDULES[0];
        state = {
          attemptId: input.attemptId,
          examId: input.examId,
          studentId: input.studentId,
          status: 'IN_PROGRESS',
          violationsCount: 0,
          isLocked: false,
          maxViolationsAllowed: 3,
          proctorPin: mockExam?.proctorPin || '123456',
          remainingSeconds: 3600,
          currentQuestionIndex: 0,
          savedAnswers: {},
          flaggedQuestions: {},
        };
        mockAttemptStore.set(input.attemptId, state);
      }

      state.violationsCount += 1;
      const maxViolations = state.maxViolationsAllowed || 3;
      const isLocked = state.violationsCount >= maxViolations;
      state.isLocked = isLocked;
      if (isLocked) {
        state.status = 'LOCKED';
      }

      return {
        success: true,
        violationsCount: state.violationsCount,
        isLocked: state.isLocked,
        maxViolations,
      };
    }

    let attempt: any = null;
    try {
      attempt = await prisma.studentExamAttempt.findUnique({
        where: { id: input.attemptId },
        include: { exam: true },
      });
    } catch (dbErr) {
      console.warn('DB lookup failed in recordViolationAction, falling back to in-memory:', dbErr);
    }

    if (!attempt) {
      const state = mockAttemptStore.get(input.attemptId);
      if (state) {
        state.violationsCount += 1;
        const maxViolations = state.maxViolationsAllowed || 3;
        const isLocked = state.violationsCount >= maxViolations;
        state.isLocked = isLocked;
        if (isLocked) state.status = 'LOCKED';
        return {
          success: true,
          violationsCount: state.violationsCount,
          isLocked: state.isLocked,
          maxViolations,
        };
      }
      return { success: false, error: 'Sesi ujian tidak ditemukan' };
    }

    const nextCount = attempt.violationsCount + 1;
    const maxViolations = attempt.exam.maxViolations || 3;
    const isLocked = nextCount >= maxViolations;

    // Catat log pelanggaran
    await prisma.examViolationLog.create({
      data: {
        attemptId: input.attemptId,
        studentId: attempt.studentId || input.studentId,
        examId: attempt.examId || input.examId,
        violationType: input.violationType,
        durationMs: input.durationMs || 4000,
        details: input.details || `Pelanggaran blur layar melebihi batas toleransi 4 detik (Ke-${nextCount}/${maxViolations})`,
        timestamp: new Date(),
      },
    });

    // Update StudentExamAttempt
    await prisma.studentExamAttempt.update({
      where: { id: input.attemptId },
      data: {
        violationsCount: nextCount,
        isLocked,
        status: isLocked ? 'LOCKED' : attempt.status,
      },
    });

    try {
      revalidatePath('/');
    } catch {}

    return {
      success: true,
      violationsCount: nextCount,
      isLocked,
      maxViolations,
    };
  } catch (error: any) {
    console.error('recordViolationAction error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 4. BUKA KUNCI UJIAN DENGAN PIN PROKTOR / PENGAWAS
 */
export async function unlockAttemptWithPinAction(attemptId: string, proctorPin: string) {
  try {
    if (attemptId.startsWith('mock_') || attemptId.startsWith('fallback_')) {
      const state = mockAttemptStore.get(attemptId);
      let expectedPin = state?.proctorPin;
      if (!expectedPin) {
        const mockExam = MOCK_EXAM_SCHEDULES.find((m) => m.id === state?.examId) || MOCK_EXAM_SCHEDULES[0];
        expectedPin = mockExam.proctorPin || '123456';
      }

      if (!proctorPin || proctorPin.trim() !== expectedPin.trim()) {
        return { success: false, error: 'PIN Pengawas tidak valid!' };
      }

      if (state) {
        state.isLocked = false;
        state.status = 'IN_PROGRESS';
        state.violationsCount = 0;
      }
      return { success: true };
    }

    let attempt: any = null;
    try {
      attempt = await prisma.studentExamAttempt.findUnique({
        where: { id: attemptId },
        include: { exam: true },
      });
    } catch (dbErr) {
      console.warn('DB lookup failed in unlockAttemptWithPinAction:', dbErr);
    }

    if (!attempt) {
      const state = mockAttemptStore.get(attemptId);
      if (state) {
        const expectedPin = state.proctorPin || '123456';
        if (!proctorPin || proctorPin.trim() !== expectedPin.trim()) {
          return { success: false, error: 'PIN Pengawas tidak valid!' };
        }
        state.isLocked = false;
        state.status = 'IN_PROGRESS';
        state.violationsCount = 0;
        return { success: true };
      }
      return { success: false, error: 'Sesi ujian tidak ditemukan.' };
    }

    const validPin = attempt.exam.proctorPin || '123456';
    if (proctorPin.trim() !== validPin.trim()) {
      return { success: false, error: 'PIN Pengawas tidak valid!' };
    }

    await prisma.studentExamAttempt.update({
      where: { id: attemptId },
      data: {
        isLocked: false,
        status: 'IN_PROGRESS',
        resetCount: { increment: 1 },
        violationsCount: 0, // Reset pelanggaran agar siswa dapat melanjutkan
      },
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true };
  } catch (error: any) {
    console.error('unlockAttemptWithPinAction error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 4.1. BUKA KUNCI JARAK JAUH / REMOTE OLEH PENGAWAS / OPERATOR (TANPA HARUS KE MEJA SISWA)
 */
export async function remoteUnlockAttemptAction(attemptId: string, operatorNotes?: string) {
  try {
    if (attemptId.startsWith('mock_') || attemptId.startsWith('fallback_')) {
      const state = mockAttemptStore.get(attemptId);
      if (state) {
        state.isLocked = false;
        state.status = 'IN_PROGRESS';
        state.violationsCount = 0;
        return { success: true, message: 'Ujian berhasil dibuka kunci jarak jauh.' };
      }
      return { success: false, error: 'Sesi ujian tidak ditemukan di memori.' };
    }

    let attempt: any = null;
    try {
      attempt = await prisma.studentExamAttempt.findUnique({
        where: { id: attemptId },
      });
    } catch (dbErr) {
      console.warn('DB lookup failed in remoteUnlockAttemptAction:', dbErr);
    }

    if (!attempt) {
      const state = mockAttemptStore.get(attemptId);
      if (state) {
        state.isLocked = false;
        state.status = 'IN_PROGRESS';
        state.violationsCount = 0;
        return { success: true, message: 'Ujian berhasil dibuka kunci jarak jauh.' };
      }
      return { success: false, error: 'Sesi ujian tidak ditemukan.' };
    }

    await prisma.studentExamAttempt.update({
      where: { id: attemptId },
      data: {
        isLocked: false,
        status: 'IN_PROGRESS',
        resetCount: { increment: 1 },
        violationsCount: 0,
        resetReason: operatorNotes || 'Dibuka jarak jauh oleh Pengawas Ruangan',
      },
    });

    try {
      revalidatePath('/');
    } catch {}

    return { success: true, message: 'Ujian berhasil dibuka kunci jarak jauh.' };
  } catch (error: any) {
    console.error('remoteUnlockAttemptAction error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 4.2. CEK STATUS TERKINI ATTEMPT (POLLING SISWA TERKUNCI)
 */
export async function getAttemptStatusAction(attemptId: string) {
  try {
    if (attemptId.startsWith('mock_') || attemptId.startsWith('fallback_')) {
      const state = mockAttemptStore.get(attemptId);
      if (state) {
        return {
          success: true,
          isLocked: state.isLocked,
          status: state.status,
          violationsCount: state.violationsCount,
        };
      }
      return { success: false, error: 'Sesi tidak ditemukan' };
    }

    let attempt: any = null;
    try {
      attempt = await prisma.studentExamAttempt.findUnique({
        where: { id: attemptId },
        select: {
          id: true,
          isLocked: true,
          status: true,
          violationsCount: true,
        },
      });
    } catch (dbErr) {
      console.warn('DB lookup failed in getAttemptStatusAction:', dbErr);
    }

    if (!attempt) {
      const state = mockAttemptStore.get(attemptId);
      if (state) {
        return {
          success: true,
          isLocked: state.isLocked,
          status: state.status,
          violationsCount: state.violationsCount,
        };
      }
      return { success: false, error: 'Sesi tidak ditemukan' };
    }

    return {
      success: true,
      isLocked: attempt.isLocked,
      status: attempt.status,
      violationsCount: attempt.violationsCount,
    };
  } catch (error: any) {
    console.error('getAttemptStatusAction error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 5. SUBMIT FINAL JAWABAN UJIAN & PERHITUNGAN NILAI OTOMATIS (TERMASUK ESAI AI NLP)
 */
export async function submitExamAttemptAction(
  attemptId: string,
  examId: string,
  studentId: string,
  allAnswers: Record<string, any>
) {
  try {
    let exam: any = null;
    try {
      exam = await prisma.examSchedule.findUnique({
        where: { id: examId },
        include: {
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
      });
    } catch (dbErr) {
      console.warn('DB lookup failed in submitExamAttemptAction, falling back to mock data:', dbErr);
    }

    if (!exam) {
      const mockExam =
        MOCK_EXAM_SCHEDULES.find((m) => m.id === examId) ||
        MOCK_EXAM_SCHEDULES.find((m) => m.code === examId) ||
        MOCK_EXAM_SCHEDULES[0];

      if (mockExam) {
        let totalScore = 0;
        let maxPossibleScore = 0;
        let totalCorrect = 0;
        let totalWrong = 0;
        let totalUnanswered = 0;
        const essayEvaluations: Record<string, any> = {};

        for (const q of mockExam.questions) {
          maxPossibleScore += q.points;
          const ans = allAnswers[q.id];

          if (ans === undefined || ans === null || ans === '') {
            totalUnanswered++;
            continue;
          }

          if (q.type === 'PG') {
            const correctOptId =
              (q as any).correctOptionId ||
              (q as any).options?.find((o: any) => o.isCorrect)?.id;
            if (correctOptId && ans === correctOptId) {
              totalScore += q.points;
              totalCorrect++;
            } else {
              totalWrong++;
            }
          } else if (q.type === 'PGK') {
            const anyQ = q as any;
            if (anyQ.subtype === 'true_false' && Array.isArray(anyQ.trueFalseRows)) {
              const rows = anyQ.trueFalseRows;
              let correctRows = 0;
              const studentRows: Record<string, boolean> = typeof ans === 'object' && ans !== null ? ans : {};
              for (const row of rows) {
                if (studentRows[row.id] === row.isTrue) {
                  correctRows++;
                }
              }
              const ratio = rows.length > 0 ? correctRows / rows.length : 0;
              const earned = Math.round(q.points * ratio * 10) / 10;
              totalScore += earned;
              if (ratio >= 0.8) totalCorrect++;
              else if (earned === 0) totalWrong++;
              else totalCorrect++;
            } else {
              const correctOptionIds: string[] = anyQ.correctOptionIds || [];
              const studentSelected: string[] = Array.isArray(ans) ? ans : [];
              const isExact =
                correctOptionIds.length === studentSelected.length &&
                correctOptionIds.every((id) => studentSelected.includes(id));

              if (isExact) {
                totalScore += q.points;
                totalCorrect++;
              } else {
                const correctlySelected = studentSelected.filter((id) => correctOptionIds.includes(id)).length;
                const wrongSelected = studentSelected.filter((id) => !correctOptionIds.includes(id)).length;
                const ratio = Math.max(0, (correctlySelected - wrongSelected) / (correctOptionIds.length || 1));
                const earned = Math.round(q.points * ratio * 10) / 10;
                totalScore += earned;
                if (earned > 0) totalCorrect++;
                else totalWrong++;
              }
            }
          } else if (q.type === 'MATCHING') {
            const pairs = (q as any).pairs || [];
            const studentPairs: Record<string, string> = typeof ans === 'object' && ans !== null ? ans : {};
            let matchingCorrect = 0;

            for (const p of pairs) {
              if (studentPairs[p.id] === p.target) {
                matchingCorrect++;
              }
            }

            const ratio = pairs.length > 0 ? matchingCorrect / pairs.length : 0;
            const earned = Math.round(q.points * ratio * 10) / 10;
            totalScore += earned;
            if (ratio >= 0.8) totalCorrect++;
            else if (earned === 0) totalWrong++;
            else totalCorrect++;
          } else if (q.type === 'SHORT' || (q as any).type === 'SHORT_ANSWER') {
            const acceptableList: string[] = Array.isArray((q as any).acceptableAnswers)
              ? ((q as any).acceptableAnswers as string[])
              : [];
            const normAns = String(ans).toLowerCase().trim();
            const isMatch = acceptableList.some((acc) => normAns === acc.toLowerCase().trim());

            if (isMatch) {
              totalScore += q.points;
              totalCorrect++;
            } else {
              totalWrong++;
            }
          } else if (q.type === 'ESSAY') {
            const rubric = (q as any).rubric || (q as any).essayRubric;
            if (rubric && typeof rubric === 'object') {
              const evalResult = evaluateEssay(String(ans), rubric as any);
              totalScore += evalResult.totalScore;
              essayEvaluations[q.id] = evalResult;
              if (evalResult.totalScore >= q.points * 0.7) totalCorrect++;
              else totalWrong++;
            } else {
              totalWrong++;
            }
          }
        }

        const percentageScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

        const state = mockAttemptStore.get(attemptId);
        if (state) {
          state.status = 'SUBMITTED';
          state.remainingSeconds = 0;
        }

        return {
          success: true,
          data: {
            attemptId,
            totalScore,
            maxPossibleScore,
            percentageScore,
            totalCorrect,
            totalWrong,
            totalUnanswered,
            essayEvaluations,
            status: 'SUBMITTED',
          },
        };
      }

      return { success: false, error: 'Jadwal ujian tidak ditemukan' };
    }

    let totalScore = 0;
    let maxPossibleScore = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalUnanswered = 0;
    const essayEvaluations: Record<string, any> = {};

    for (const eq of exam.examQuestions) {
      const q = eq.question;
      maxPossibleScore += q.points;
      const ans = allAnswers[q.id];

      if (ans === undefined || ans === null || ans === '') {
        totalUnanswered++;
        continue;
      }

      if (q.type === 'PG') {
        const correctOpt = (q.options as any[])?.find((o: any) => o.isCorrect);
        if (correctOpt && ans === correctOpt.id) {
          totalScore += q.points;
          totalCorrect++;
        } else {
          totalWrong++;
        }
      } else if (q.type === 'PGK') {
        const correctOptionIds: string[] = (q.options as any[])?.filter((o: any) => o.isCorrect).map((o: any) => o.id) || [];
        const studentSelected: string[] = Array.isArray(ans) ? ans : [];

        // Hitung proporsional atau kecocokan tepat
        const isExact =
          correctOptionIds.length === studentSelected.length &&
          correctOptionIds.every((id: string) => studentSelected.includes(id));

        if (isExact) {
          totalScore += q.points;
          totalCorrect++;
        } else {
          // Proporsional parsial
          const correctlySelected = studentSelected.filter((id: string) => correctOptionIds.includes(id)).length;
          const wrongSelected = studentSelected.filter((id: string) => !correctOptionIds.includes(id)).length;
          const ratio = Math.max(0, (correctlySelected - wrongSelected) / (correctOptionIds.length || 1));
          const earned = Math.round(q.points * ratio * 10) / 10;
          totalScore += earned;
          if (earned > 0) totalCorrect++;
          else totalWrong++;
        }
      } else if (q.type === 'MATCHING') {
        const pairs = q.matchingPairs;
        const studentPairs: Record<string, string> = typeof ans === 'object' ? ans : {};
        let matchingCorrect = 0;

        for (const p of pairs) {
          if (studentPairs[p.id] === p.target) {
            matchingCorrect++;
          }
        }

        const ratio = pairs.length > 0 ? matchingCorrect / pairs.length : 0;
        const earned = Math.round(q.points * ratio * 10) / 10;
        totalScore += earned;
        if (ratio >= 0.8) totalCorrect++;
        else totalWrong++;
      } else if (q.type === 'SHORT_ANSWER') {
        const acceptableList: string[] = Array.isArray(q.acceptableAnswers)
          ? (q.acceptableAnswers as string[])
          : [];
        const normAns = String(ans).toLowerCase().trim();
        const isMatch = acceptableList.some((acc) => normAns === acc.toLowerCase().trim());

        if (isMatch) {
          totalScore += q.points;
          totalCorrect++;
        } else {
          totalWrong++;
        }
      } else if (q.type === 'ESSAY') {
        if (q.essayRubric && typeof q.essayRubric === 'object') {
          const evalResult = evaluateEssay(String(ans), q.essayRubric as any);
          totalScore += evalResult.totalScore;
          essayEvaluations[q.id] = evalResult;
          if (evalResult.totalScore >= q.points * 0.7) totalCorrect++;
          else totalWrong++;
        } else {
          // Jika tidak ada rubrik khusus, beri nilai dasar
          totalScore += q.points * 0.5;
        }
      }
    }

    const percentageScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

    if (!attemptId.startsWith('mock_') && !attemptId.startsWith('fallback_')) {
      try {
        await prisma.studentExamAttempt.update({
          where: { id: attemptId },
          data: {
            status: 'SUBMITTED',
            submitTime: new Date(),
            totalScore,
            maxPossibleScore,
            percentageScore,
            totalCorrect,
            totalWrong,
            totalUnanswered,
            remainingSeconds: 0,
          },
        });
      } catch (err) {
        console.warn('Could not update StudentExamAttempt in DB:', err);
      }
    }

    try {
      revalidatePath('/');
    } catch {}

    return {
      success: true,
      data: {
        totalScore,
        maxPossibleScore,
        percentageScore,
        totalCorrect,
        totalWrong,
        totalUnanswered,
        essayEvaluations,
      },
    };
  } catch (error: any) {
    console.error('submitExamAttemptAction error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 6. AMBIL SEMUA ATTEMPT & REKAPITULASI NILAI UJIAN DARI POSTGRESQL
 */
export async function getExamAttemptsAction(examId?: string) {
  try {
    const attempts = await prisma.studentExamAttempt.findMany({
      where: examId ? { examId } : undefined,
      include: {
        student: {
          include: {
            user: true,
            class: true,
            room: true,
            session: true,
          },
        },
        exam: {
          include: {
            subject: true,
          },
        },
        answers: true,
        violationLogs: {
          orderBy: { timestamp: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: attempts.map((att) => ({
        attemptId: att.id,
        studentId: att.studentId,
        studentName: att.student.user.name,
        nisn: att.student.nisn,
        nis: att.student.nis || '-',
        className: att.student.class?.name || '-',
        subjectName: att.exam.title || att.exam.subject.name,
        status: att.status,
        totalScore: att.totalScore,
        maxPossibleScore: att.maxPossibleScore,
        percentageScore: att.percentageScore,
        totalCorrect: att.totalCorrect,
        totalWrong: att.totalWrong,
        totalUnanswered: att.totalUnanswered,
        violationCount: att.violationsCount,
        durationSeconds:
          att.startTime && att.submitTime
            ? Math.round((att.submitTime.getTime() - att.startTime.getTime()) / 1000)
            : 0,
        startTime: att.startTime?.toISOString() || null,
        submitTime: att.submitTime?.toISOString() || null,
        answersCount: att.answers.length,
      })),
    };
  } catch (error: any) {
    console.error('getExamAttemptsAction error:', error);
    return { success: false, error: error.message, data: [] };
  }
}

