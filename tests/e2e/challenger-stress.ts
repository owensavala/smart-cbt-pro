import { startExamAttemptAction, recordViolationAction, unlockAttemptWithPinAction, submitExamAttemptAction } from '../../src/app/actions/attempt-actions';
import { prisma } from '../../src/lib/prisma';

async function main() {
  console.log('=== STARTING EMPIRICAL ADVERSARIAL STRESS TEST ===\n');

  // ---------------------------------------------------------
  // 1. TOKEN HIJACKING & MISSING EXAMS
  // ---------------------------------------------------------
  console.log('--- 1. Token Hijacking & Missing Exams ---');
  const resMissingWith36 = await startExamAttemptAction({
    examId: 'non_existent_exam_xyz',
    studentId: 'std_aditya',
    enteredToken: '36S7KS',
  });
  console.log('Missing exam with 36S7KS:', {
    success: resMissingWith36.success,
    error: resMissingWith36.error,
  });

  const resMissingWithRandom = await startExamAttemptAction({
    examId: 'non_existent_exam_xyz',
    studentId: 'std_aditya',
    enteredToken: 'RANDOM99',
  });
  console.log('Missing exam with RANDOM99:', {
    success: resMissingWithRandom.success,
    error: resMissingWithRandom.error,
  });

  const resValidWhitespace = await startExamAttemptAction({
    examId: 'sch_mat_x',
    studentId: 'std_siti',
    enteredToken: '   36s7ks   ',
  });
  console.log('Valid exam with whitespace & lowercase:', {
    success: resValidWhitespace.success,
    examTitle: resValidWhitespace.data?.examTitle,
    attemptId: resValidWhitespace.data?.attemptId,
  });

  const resValidWrongToken = await startExamAttemptAction({
    examId: 'sch_mat_x',
    studentId: 'std_siti',
    enteredToken: 'WRONG_TOKEN',
  });
  console.log('Valid exam with wrong token:', {
    success: resValidWrongToken.success,
    error: resValidWrongToken.error,
  });

  // ---------------------------------------------------------
  // 2. CROSS-EXAM TOKEN REJECTION
  // ---------------------------------------------------------
  console.log('\n--- 2. Cross-Exam Token Rejection ---');
  // Attempting to unlock sch_fkh (which requires FKH77A) with token 36S7KS
  const resCrossExam = await startExamAttemptAction({
    examId: 'sch_fkh',
    studentId: 'std_aditya',
    enteredToken: '36S7KS',
  });
  console.log('Cross-exam (sch_fkh with 36S7KS):', {
    success: resCrossExam.success,
    error: resCrossExam.error,
  });

  // ---------------------------------------------------------
  // 3. MULTI-STUDENT ISOLATION & MOCK / UNEXPECTED STUDENT IDS
  // ---------------------------------------------------------
  console.log('\n--- 3. Multi-Student Isolation & Student IDs ---');
  const student1 = await startExamAttemptAction({
    examId: 'sch_mat_x',
    studentId: 'std_aditya',
    enteredToken: '36S7KS',
  });
  const student2 = await startExamAttemptAction({
    examId: 'sch_mat_x',
    studentId: 'std_siti',
    enteredToken: '36S7KS',
  });
  const studentMockUnexpected = await startExamAttemptAction({
    examId: 'sch_mat_x',
    studentId: 'mock_student_stranger_99',
    enteredToken: '36S7KS',
  });

  console.log('Student 1 (std_aditya) attempt:', student1.data?.attemptId);
  console.log('Student 2 (std_siti) attempt:', student2.data?.attemptId);
  console.log('Student 3 (unexpected ID) attempt:', studentMockUnexpected.data?.attemptId);

  const areDistinct =
    student1.data?.attemptId !== student2.data?.attemptId &&
    student2.data?.attemptId !== studentMockUnexpected.data?.attemptId &&
    student1.data?.attemptId !== studentMockUnexpected.data?.attemptId;
  console.log('All 3 attempts distinct and isolated?:', areDistinct);

  // ---------------------------------------------------------
  // 4. ANTI-CHEAT VIOLATION LOGGING & LOCKOUT
  // ---------------------------------------------------------
  console.log('\n--- 4. Anti-Cheat Violation Logging & Lockout ---');
  // Use student2 attempt for clean violation tracking
  const targetAttemptId = student2.data?.attemptId || '';
  console.log('Target attempt ID for anti-cheat test:', targetAttemptId);

  let vRes1 = await recordViolationAction({
    attemptId: targetAttemptId,
    examId: 'sch_mat_x',
    studentId: 'std_siti',
    violationType: 'WINDOW_BLUR',
    durationMs: 4500,
    details: 'Challenger stress test blur 1',
  });
  console.log('Violation 1 result:', { success: vRes1.success, count: vRes1.violationsCount, isLocked: vRes1.isLocked });

  let vRes2 = await recordViolationAction({
    attemptId: targetAttemptId,
    examId: 'sch_mat_x',
    studentId: 'std_siti',
    violationType: 'TAB_SWITCH',
    durationMs: 5000,
    details: 'Challenger stress test tab switch 2',
  });
  console.log('Violation 2 result:', { success: vRes2.success, count: vRes2.violationsCount, isLocked: vRes2.isLocked });

  let vRes3 = await recordViolationAction({
    attemptId: targetAttemptId,
    examId: 'sch_mat_x',
    studentId: 'std_siti',
    violationType: 'FULLSCREEN_EXIT',
    durationMs: 6000,
    details: 'Challenger stress test fullscreen exit 3',
  });
  console.log('Violation 3 result (Expect isLocked: true):', {
    success: vRes3.success,
    count: vRes3.violationsCount,
    isLocked: vRes3.isLocked,
    error: vRes3.error,
  });

  // Verify in PostgreSQL or memory
  let checkAttempt = await prisma.studentExamAttempt.findUnique({
    where: { id: targetAttemptId },
  }).catch(() => null);
  if (checkAttempt) {
    console.log('DB Attempt State after 3 violations:', {
      status: checkAttempt.status,
      violationsCount: checkAttempt.violationsCount,
      isLocked: checkAttempt.isLocked,
    });
  }

  // ---------------------------------------------------------
  // 5. PROCTOR PIN UNLOCK
  // ---------------------------------------------------------
  console.log('\n--- 5. Proctor PIN Unlock Validation ---');
  const wrongPinRes = await unlockAttemptWithPinAction(targetAttemptId, 'BAD_PIN_999');
  console.log('Unlock with bad PIN:', { success: wrongPinRes.success, error: wrongPinRes.error });

  const validPin = student2.data?.proctorPin || '123456';
  const rightPinRes = await unlockAttemptWithPinAction(targetAttemptId, validPin);
  console.log('Unlock with valid PIN (' + validPin + '):', { success: rightPinRes.success, error: rightPinRes.error });

  checkAttempt = await prisma.studentExamAttempt.findUnique({
    where: { id: targetAttemptId },
  }).catch(() => null);
  if (checkAttempt) {
    console.log('DB Attempt State after proctor unlock:', {
      status: checkAttempt.status,
      violationsCount: checkAttempt.violationsCount,
      isLocked: checkAttempt.isLocked,
    });
  }

  // ---------------------------------------------------------
  // 6. ZERO-ANSWER SUBMISSION
  // ---------------------------------------------------------
  console.log('\n--- 6. Zero-Answer Submission Test ---');
  // Submit target attempt with completely empty answers
  const zeroSubRes = await submitExamAttemptAction(
    targetAttemptId,
    'sch_mat_x',
    'std_siti',
    {}
  );
  console.log('Zero-answer submission result:', {
    success: zeroSubRes.success,
    totalScore: zeroSubRes.data?.totalScore,
    percentageScore: zeroSubRes.data?.percentageScore,
    totalCorrect: zeroSubRes.data?.totalCorrect,
    totalWrong: zeroSubRes.data?.totalWrong,
    totalUnanswered: zeroSubRes.data?.totalUnanswered,
    isScoreNaN: Number.isNaN(zeroSubRes.data?.totalScore),
    isPercentNaN: Number.isNaN(zeroSubRes.data?.percentageScore),
    status: zeroSubRes.data?.status,
  });

  console.log('\n=== EMPIRICAL ADVERSARIAL STRESS TEST COMPLETE ===');
  process.exit(0);
}

main().catch((err) => {
  console.error('Stress test fatal error:', err);
  process.exit(1);
});
