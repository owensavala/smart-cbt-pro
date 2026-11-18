/**
 * Milestone 1 (R1) - Empirical Challenger Stress & Boundary Test Suite
 * 
 * Tests:
 * 1. Token validation: correct token, case insensitivity, leading/trailing whitespace
 * 2. Invalid tokens: empty, whitespace-only, wrong token, special characters, SQL injection strings
 * 3. Student & Class boundaries: valid X MIPA 1, non-existent student, mismatched class
 * 4. Fallback resilience: mock attempt lifecycle (start, backgroundSync, recordViolation, unlock, submit)
 * 5. Exam schedules action behavior: dayOfWeek mapping and failure handling
 */

import { startExamAttemptAction, submitExamAttemptAction, backgroundSyncAnswerAction, recordViolationAction, unlockAttemptWithPinAction } from '../../src/app/actions/attempt-actions';
import { getExamSchedulesAction } from '../../src/app/actions/exam-actions';
import { MOCK_STUDENTS, MOCK_EXAM_SCHEDULES } from '../../src/lib/mock-data';

interface StressResult {
  name: string;
  category: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: StressResult[] = [];

function record(name: string, category: string, passed: boolean, details?: any, error?: string) {
  results.push({ name, category, passed, details, error });
  const symbol = passed ? '✔' : '✖';
  console.log(`  ${symbol} [${category}] ${name}`);
  if (!passed && error) {
    console.log(`     Error: ${error}`);
  }
}

async function runEmpiricalStressSuite() {
  console.log('======================================================================');
  console.log('       TEAMWORK CHALLENGER M1: EMPIRICAL STRESS & BOUNDARY SUITE       ');
  console.log('======================================================================\n');

  const studentX1 = MOCK_STUDENTS.find(s => s.className === 'X MIPA 1') || MOCK_STUDENTS[0];
  const examX1 = MOCK_EXAM_SCHEDULES.find(s => s.activeToken === '36S7KS') || MOCK_EXAM_SCHEDULES[0];

  console.log(`Target Exam: ${examX1.title} (ID: ${examX1.id}, Token: ${examX1.activeToken})`);
  console.log(`Target Student: ${studentX1.name} (ID: ${studentX1.id}, Class: ${studentX1.className})\n`);

  // --- 1. TOKEN VALIDATION: VALID & NORMALIZATION CASES ---
  console.log('>>> 1. TOKEN VALIDATION (HAPPY PATH & NORMALIZATION) <<<');

  // Case 1.1: Exact matching token
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: '36S7KS',
    });
    const ok = res.success === true && !!res.data?.attemptId && res.data.status === 'IN_PROGRESS';
    record('Exact token 36S7KS', 'Token Normalization', ok, res.data, res.error);
  } catch (e: any) {
    record('Exact token 36S7KS', 'Token Normalization', false, null, e.message);
  }

  // Case 1.2: Lowercase token
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: '36s7ks',
    });
    const ok = res.success === true && !!res.data?.attemptId;
    record('Lowercase token 36s7ks', 'Token Normalization', ok, res.data, res.error);
  } catch (e: any) {
    record('Lowercase token 36s7ks', 'Token Normalization', false, null, e.message);
  }

  // Case 1.3: Leading and trailing whitespace with lowercase
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: '   36s7ks   ',
    });
    const ok = res.success === true && !!res.data?.attemptId;
    record('Whitespace trimmed: "   36s7ks   "', 'Token Normalization', ok, res.data, res.error);
  } catch (e: any) {
    record('Whitespace trimmed: "   36s7ks   "', 'Token Normalization', false, null, e.message);
  }

  // Case 1.4: Tab and newline whitespace
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: '\t36S7KS\n',
    });
    const ok = res.success === true && !!res.data?.attemptId;
    record('Whitespace tab/newline: "\\t36S7KS\\n"', 'Token Normalization', ok, res.data, res.error);
  } catch (e: any) {
    record('Whitespace tab/newline: "\\t36S7KS\\n"', 'Token Normalization', false, null, e.message);
  }

  // --- 2. INVALID TOKEN REJECTION & ERROR SAFETY ---
  console.log('\n>>> 2. INVALID TOKEN REJECTION & SAFETY <<<');

  // Case 2.1: Empty string token
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: '',
    });
    const ok = res.success === false && typeof res.error === 'string' && res.error.length > 0;
    record('Empty string token "" rejected gracefully', 'Token Rejection', ok, res, res.error);
  } catch (e: any) {
    record('Empty string token "" rejected gracefully', 'Token Rejection', false, null, `Crashed: ${e.message}`);
  }

  // Case 2.2: Whitespace-only token
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: '     ',
    });
    const ok = res.success === false && typeof res.error === 'string';
    record('Whitespace-only token "     " rejected gracefully', 'Token Rejection', ok, res, res.error);
  } catch (e: any) {
    record('Whitespace-only token "     " rejected gracefully', 'Token Rejection', false, null, `Crashed: ${e.message}`);
  }

  // Case 2.3: Wrong alpha-numeric token
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: 'WRONG1',
    });
    const ok = res.success === false && typeof res.error === 'string';
    record('Invalid token "WRONG1" rejected with clear error', 'Token Rejection', ok, res, res.error);
  } catch (e: any) {
    record('Invalid token "WRONG1" rejected with clear error', 'Token Rejection', false, null, `Crashed: ${e.message}`);
  }

  // Case 2.4: Arbitrary numeric token
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: '123456',
    });
    const ok = res.success === false && typeof res.error === 'string';
    record('Arbitrary numeric token "123456" rejected', 'Token Rejection', ok, res, res.error);
  } catch (e: any) {
    record('Arbitrary numeric token "123456" rejected', 'Token Rejection', false, null, `Crashed: ${e.message}`);
  }

  // Case 2.5: Undefined enteredToken
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: undefined,
    });
    const ok = res.success === false && typeof res.error === 'string';
    record('Undefined token handled safely', 'Token Rejection', ok, res, res.error);
  } catch (e: any) {
    record('Undefined token handled safely', 'Token Rejection', false, null, `Crashed: ${e.message}`);
  }

  // Case 2.6: SQL/Prisma injection attempt in token
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: "' OR '1'='1' --",
    });
    const ok = res.success === false && typeof res.error === 'string';
    record('SQL injection string in token rejected without crash', 'Token Security', ok, res, res.error);
  } catch (e: any) {
    record('SQL injection string in token rejected without crash', 'Token Security', false, null, `Crashed: ${e.message}`);
  }

  // Case 2.7: XSS script string in token
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: '<script>alert("hack")</script>',
    });
    const ok = res.success === false && typeof res.error === 'string';
    record('XSS payload in token rejected safely', 'Token Security', ok, res, res.error);
  } catch (e: any) {
    record('XSS payload in token rejected safely', 'Token Security', false, null, `Crashed: ${e.message}`);
  }

  // --- 3. STUDENT & CLASS BOUNDARY CASES ---
  console.log('\n>>> 3. STUDENT & CLASS BOUNDARY CASES <<<');

  // Case 3.1: Non-existent student ID
  try {
    const res = await startExamAttemptAction({
      examId: examX1.id,
      studentId: 'non_existent_student_999999',
      enteredToken: '36S7KS',
    });
    // In fallback mode, it should still start or return a valid attempt without crash
    const ok = res.success === true && !!res.data?.attemptId;
    record('Non-existent student ID resolves via fallback without crash', 'Student Boundary', ok, res.data, res.error);
  } catch (e: any) {
    record('Non-existent student ID resolves via fallback without crash', 'Student Boundary', false, null, e.message);
  }

  // Case 3.2: Non-existent exam ID with valid token 36S7KS
  try {
    const res = await startExamAttemptAction({
      examId: 'non_existent_exam_xyz',
      studentId: studentX1.id,
      enteredToken: '36S7KS',
    });
    // Should fallback to X MIPA 1 schedule because token is 36S7KS
    const ok = res.success === true && !!res.data?.attemptId;
    record('Non-existent examId with token 36S7KS falls back to active X MIPA 1', 'Resilience Fallback', ok, res.data, res.error);
  } catch (e: any) {
    record('Non-existent examId with token 36S7KS falls back to active X MIPA 1', 'Resilience Fallback', false, null, e.message);
  }

  // Case 3.3: Non-existent exam ID with invalid token
  try {
    const res = await startExamAttemptAction({
      examId: 'non_existent_exam_xyz',
      studentId: studentX1.id,
      enteredToken: 'INVALID_TOK',
    });
    // Must fail safely
    const ok = res.success === false && (res.error?.includes('tidak ditemukan') || res.error?.includes('tidak valid'));
    record('Non-existent examId with invalid token fails with appropriate error', 'Resilience Fallback', ok, res, res.error);
  } catch (e: any) {
    record('Non-existent examId with invalid token fails with appropriate error', 'Resilience Fallback', false, null, `Crashed: ${e.message}`);
  }

  // --- 4. ATTEMPT LIFECYCLE ON FALLBACK / MOCK ATTEMPT ---
  console.log('\n>>> 4. MOCK / FALLBACK ATTEMPT LIFECYCLE <<<');

  let activeAttemptId = '';
  let startRes: any = null;
  try {
    startRes = await startExamAttemptAction({
      examId: examX1.id,
      studentId: studentX1.id,
      enteredToken: '36S7KS',
    });
    activeAttemptId = startRes.data?.attemptId || '';
    record('Attempt creation returns attemptId', 'Lifecycle', !!activeAttemptId, { activeAttemptId });
  } catch (e: any) {
    record('Attempt creation returns attemptId', 'Lifecycle', false, null, e.message);
  }

  if (activeAttemptId) {
    let questionId = 'q_mat_1';
    if (startRes.data?.examId) {
      const examObj = MOCK_EXAM_SCHEDULES.find(m => m.id === startRes.data?.examId);
      if (examObj?.questions?.[0]) questionId = examObj.questions[0].id;
    }

    // Case 4.1: Background sync answer on attempt
    try {
      // If DB attempt, find a real question from DB
      try {
        const { prisma } = await import('../../src/lib/prisma');
        const eq = await prisma.examQuestion.findFirst({
          where: { examId: startRes.data?.examId },
        });
        if (eq) questionId = eq.questionId;
      } catch {}

      const syncRes = await backgroundSyncAnswerAction({
        attemptId: activeAttemptId,
        questionId: questionId,
        questionType: 'PG',
        answerValue: 'opt_1',
        isDoubtful: false,
        remainingSeconds: 5300,
        currentQuestionIndex: 1,
      });
      record('Background sync answer succeeds on attempt', 'Lifecycle', syncRes.success === true, syncRes, syncRes.error);
    } catch (e: any) {
      record('Background sync answer succeeds on attempt', 'Lifecycle', false, null, e.message);
    }

    // Case 4.2: Record violation on attempt
    try {
      const violRes = await recordViolationAction({
        attemptId: activeAttemptId,
        examId: examX1.id,
        studentId: studentX1.id,
        violationType: 'TAB_SWITCH' as any,
        durationMs: 4500,
      });
      record('Record violation succeeds without crash', 'Lifecycle', violRes.success === true, violRes, violRes.error);
    } catch (e: any) {
      record('Record violation succeeds without crash', 'Lifecycle', false, null, e.message);
    }

    // Case 4.3: Unlock attempt with proctor pin
    try {
      const unlockRes = await unlockAttemptWithPinAction(activeAttemptId, '123456');
      record('Unlock attempt with PIN 123456 succeeds', 'Lifecycle', unlockRes.success === true, unlockRes);
    } catch (e: any) {
      record('Unlock attempt with PIN 123456 succeeds', 'Lifecycle', false, null, e.message);
    }

    // Case 4.4: Submit exam attempt
    try {
      const submitRes = await submitExamAttemptAction(
        activeAttemptId,
        startRes.data?.examId || examX1.id,
        studentX1.id,
        { [questionId]: 'opt_1' }
      );
      const ok = submitRes.success === true && typeof submitRes.data?.totalScore === 'number';
      record('Submit exam attempt succeeds with score calculation', 'Lifecycle', ok, submitRes.data, submitRes.error);
    } catch (e: any) {
      record('Submit exam attempt succeeds with score calculation', 'Lifecycle', false, null, e.message);
    }
  }

  // --- 5. EXAM SCHEDULES ACTION DAY OF WEEK AND ERROR RESILIENCE ---
  console.log('\n>>> 5. EXAM SCHEDULES ACTION RESILIENCE <<<');

  try {
    const schedulesRes = await getExamSchedulesAction();
    const isSuccess = schedulesRes.success === true;
    const hasData = Array.isArray(schedulesRes.data);
    record('getExamSchedulesAction execution status', 'Exam Schedules', isSuccess, {
      success: schedulesRes.success,
      dataLength: schedulesRes.data?.length,
      error: schedulesRes.error,
    }, schedulesRes.error);
  } catch (e: any) {
    record('getExamSchedulesAction execution status', 'Exam Schedules', false, null, e.message);
  }

  // --- SUMMARY ---
  console.log('\n======================================================================');
  console.log('                          STRESS SUITE SUMMARY                         ');
  console.log('======================================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`Total Scenarios: ${total}`);
  console.log(`Passed         : ${passed} (${Math.round((passed / total) * 100)}%)`);
  console.log(`Failed         : ${failed}`);

  if (failed > 0) {
    console.log('\nFailed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - [${r.category}] ${r.name}: ${r.error || JSON.stringify(r.details)}`);
    });
  }
  console.log('======================================================================\n');

  return { total, passed, failed, results };
}

runEmpiricalStressSuite().then(res => {
  if (res.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}).catch(err => {
  console.error('Stress suite fatal:', err);
  process.exit(1);
});
