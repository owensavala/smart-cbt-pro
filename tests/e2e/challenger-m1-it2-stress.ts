/**
 * Milestone 1 Iteration 2 - Empirical Challenger Comprehensive Stress & Anti-Cheat Suite
 * 
 * Verifies:
 * 1. Token Gate master-key bypass rejection across all non-36S7KS exams
 * 2. Case and whitespace normalization on valid tokens
 * 3. Invalid tokens rejection across all exams
 * 4. Non-existent exam IDs rejection ('Jadwal ujian tidak ditemukan.')
 * 5. Anti-cheat violation tracking, real increments, and lockout at threshold (T2_B08)
 * 6. Proctor PIN validation, bad PIN rejection, unlock reset (T2_B09), and re-lock
 * 7. Session isolation between students (no cross-talk in mockAttemptStore)
 * 8. Grading integrity (no false score inflation, zero answers handled safely)
 */

import {
  startExamAttemptAction,
  recordViolationAction,
  unlockAttemptWithPinAction,
  submitExamAttemptAction,
  mockAttemptStore,
} from '../../src/app/actions/attempt-actions';
import { MOCK_EXAM_SCHEDULES, MOCK_STUDENTS } from '../../src/lib/mock-data';

interface CheckResult {
  name: string;
  category: string;
  passed: boolean;
  actual?: any;
  error?: string;
}

const checks: CheckResult[] = [];

function recordCheck(name: string, category: string, passed: boolean, actual?: any, error?: string) {
  checks.push({ name, category, passed, actual, error });
  const icon = passed ? '✔' : '✖';
  console.log(`  ${icon} [${category}] ${name}`);
  if (!passed && error) {
    console.log(`     Error / Details: ${error}`);
  }
}

export async function runAdversarialStressSuite() {
  console.log('======================================================================');
  console.log('    CHALLENGER M1 ITERATION 2: EMPIRICAL STRESS & ANTI-CHEAT SUITE    ');
  console.log('======================================================================\n');

  const student = MOCK_STUDENTS[0];

  // ------------------------------------------------------------------
  // 1. MASTER-KEY BYPASS ELIMINATION (Test '36S7KS' on other exams)
  // ------------------------------------------------------------------
  console.log('>>> 1. MASTER-KEY BYPASS ELIMINATION <<<');
  const otherExams = MOCK_EXAM_SCHEDULES.filter(
    (e) => e.tokenRequired && e.activeToken && e.activeToken !== '36S7KS'
  );

  for (const exam of otherExams) {
    try {
      const res = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: '36S7KS',
      });
      const rejected =
        res.success === false &&
        res.error === 'Token ujian tidak valid! Pastikan sesuai dengan token yang dirilis pengawas.';
      recordCheck(
        `Exam ${exam.id} (${exam.code}) strictly rejects master key '36S7KS'`,
        'Bypass Elimination',
        rejected,
        res,
        rejected ? undefined : `Allowed attempt or wrong error: ${JSON.stringify(res)}`
      );
    } catch (e: any) {
      recordCheck(`Exam ${exam.id} throws on 36S7KS`, 'Bypass Elimination', false, null, e.message);
    }
  }

  // ------------------------------------------------------------------
  // 2. VALID TOKEN NORMALIZATION
  // ------------------------------------------------------------------
  console.log('\n>>> 2. VALID TOKEN NORMALIZATION <<<');
  for (const exam of [MOCK_EXAM_SCHEDULES[0], otherExams[0], otherExams[1]]) {
    const rawToken = exam.activeToken!;
    const lowerToken = rawToken.toLowerCase();
    const spacedToken = `   ${lowerToken}   `;

    try {
      const resSpaced = await startExamAttemptAction({
        examId: exam.id,
        studentId: `std_norm_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        enteredToken: spacedToken,
      });
      const ok = resSpaced.success === true && !!resSpaced.data?.attemptId;
      recordCheck(
        `Exam ${exam.id} accepts trimmed/uppercased token '${spacedToken}'`,
        'Token Normalization',
        ok,
        resSpaced.data,
        resSpaced.error
      );
    } catch (e: any) {
      recordCheck(`Exam ${exam.id} normalization error`, 'Token Normalization', false, null, e.message);
    }
  }

  // ------------------------------------------------------------------
  // 3. INVALID TOKEN REJECTION ACROSS EXAMS
  // ------------------------------------------------------------------
  console.log('\n>>> 3. INVALID TOKEN REJECTION <<<');
  const invalidTokens = ['', '    ', 'WRONG_TOK_99', '123456', "' OR '1'='1", '<script>'];

  for (const token of invalidTokens) {
    const res = await startExamAttemptAction({
      examId: MOCK_EXAM_SCHEDULES[0].id,
      studentId: student.id,
      enteredToken: token,
    });
    const rejected = res.success === false && typeof res.error === 'string' && res.error.length > 0;
    recordCheck(
      `Token '${token}' rejected on ${MOCK_EXAM_SCHEDULES[0].id}`,
      'Token Rejection',
      rejected,
      res,
      rejected ? undefined : `Was accepted: ${JSON.stringify(res)}`
    );
  }

  // ------------------------------------------------------------------
  // 4. NON-EXISTENT EXAM ID REJECTION
  // ------------------------------------------------------------------
  console.log('\n>>> 4. NON-EXISTENT EXAM ID REJECTION <<<');
  const nonExistentIds = [
    'non_existent_exam_xyz',
    'sch_does_not_exist_404',
    '',
    '   ',
    'exam_hack; DROP TABLE',
  ];

  for (const nonId of nonExistentIds) {
    const res = await startExamAttemptAction({
      examId: nonId,
      studentId: student.id,
      enteredToken: '36S7KS',
    });
    const properlyRejected =
      res.success === false && res.error === 'Jadwal ujian tidak ditemukan.';
    recordCheck(
      `Non-existent examId '${nonId}' returns 'Jadwal ujian tidak ditemukan.'`,
      'Non-Existent Exam',
      properlyRejected,
      res,
      properlyRejected ? undefined : `Unexpected response: ${JSON.stringify(res)}`
    );
  }

  // ------------------------------------------------------------------
  // 5. ANTI-CHEAT VIOLATION TRACKING & LOCKOUT THRESHOLD (T2_B08)
  // ------------------------------------------------------------------
  console.log('\n>>> 5. VIOLATION TRACKING & LOCKOUT THRESHOLD <<<');
  const targetExam = otherExams[0]; // e.g. sch_quha (token QUHA99, pin 9988)
  const studentViol = `std_viol_${Date.now()}`;
  const startViolRes = await startExamAttemptAction({
    examId: targetExam.id,
    studentId: studentViol,
    enteredToken: targetExam.activeToken!,
  });

  const violAttemptId = startViolRes.data?.attemptId!;
  recordCheck(
    'Initial attempt created with violationsCount = 0 and isLocked = false',
    'Anti-Cheat',
    startViolRes.success === true &&
      startViolRes.data?.violationsCount === 0 &&
      startViolRes.data?.isLocked === false,
    startViolRes.data
  );

  // Violation 1
  const v1 = await recordViolationAction({
    attemptId: violAttemptId,
    examId: targetExam.id,
    studentId: studentViol,
    violationType: 'WINDOW_BLUR' as any,
  });
  recordCheck(
    'Violation 1 increments count to 1 and remains unlocked',
    'Anti-Cheat',
    v1.success === true && v1.violationsCount === 1 && v1.isLocked === false,
    v1
  );

  // Violation 2
  const v2 = await recordViolationAction({
    attemptId: violAttemptId,
    examId: targetExam.id,
    studentId: studentViol,
    violationType: 'TAB_SWITCH' as any,
  });
  recordCheck(
    'Violation 2 increments count to 2 and remains unlocked',
    'Anti-Cheat',
    v2.success === true && v2.violationsCount === 2 && v2.isLocked === false,
    v2
  );

  // Violation 3 (Threshold reached)
  const v3 = await recordViolationAction({
    attemptId: violAttemptId,
    examId: targetExam.id,
    studentId: studentViol,
    violationType: 'FULLSCREEN_EXIT' as any,
  });
  recordCheck(
    'Violation 3 reaches maxViolations (3) and sets isLocked = true',
    'Anti-Cheat',
    v3.success === true && v3.violationsCount === 3 && v3.isLocked === true,
    v3
  );

  // Violation 4 (Beyond threshold)
  const v4 = await recordViolationAction({
    attemptId: violAttemptId,
    examId: targetExam.id,
    studentId: studentViol,
    violationType: 'WINDOW_BLUR' as any,
  });
  recordCheck(
    'Violation 4 maintains isLocked = true and increments to 4',
    'Anti-Cheat',
    v4.success === true && v4.violationsCount === 4 && v4.isLocked === true,
    v4
  );

  // ------------------------------------------------------------------
  // 6. PROCTOR PIN UNLOCK & RE-LOCK LIFECYCLE (T2_B09)
  // ------------------------------------------------------------------
  console.log('\n>>> 6. PROCTOR PIN UNLOCK & RE-LOCK LIFECYCLE <<<');
  const expectedProctorPin = targetExam.proctorPin || '9988';

  // Bad PINs
  const badPins = ['WRONG_PIN', '123456', '', '   ', '0000'];
  for (const badPin of badPins) {
    const unlockBad = await unlockAttemptWithPinAction(violAttemptId, badPin);
    const rejected =
      unlockBad.success === false && unlockBad.error === 'PIN Pengawas tidak valid!';
    recordCheck(
      `Unlock with invalid PIN '${badPin}' rejected with proper error`,
      'Proctor Unlock',
      rejected,
      unlockBad,
      rejected ? undefined : `Was allowed: ${JSON.stringify(unlockBad)}`
    );
  }

  // Good PIN
  const unlockGood = await unlockAttemptWithPinAction(violAttemptId, expectedProctorPin);
  recordCheck(
    `Unlock with authentic PIN '${expectedProctorPin}' succeeds`,
    'Proctor Unlock',
    unlockGood.success === true,
    unlockGood
  );

  // Verify attempt state after unlock
  const stateAfterUnlock = mockAttemptStore.get(violAttemptId);
  const stateResetCorrect =
    stateAfterUnlock?.isLocked === false &&
    stateAfterUnlock?.status === 'IN_PROGRESS' &&
    stateAfterUnlock?.violationsCount === 0;
  recordCheck(
    'State after unlock is fully reset (isLocked=false, violationsCount=0, status=IN_PROGRESS)',
    'Proctor Unlock',
    stateResetCorrect,
    stateAfterUnlock
  );

  // Re-lock after reset
  for (let i = 1; i <= 3; i++) {
    await recordViolationAction({
      attemptId: violAttemptId,
      examId: targetExam.id,
      studentId: studentViol,
      violationType: 'WINDOW_BLUR' as any,
    });
  }
  const stateRelocked = mockAttemptStore.get(violAttemptId);
  recordCheck(
    'Re-violating 3 times after unlock successfully locks attempt again',
    'Proctor Unlock',
    stateRelocked?.isLocked === true && stateRelocked?.status === 'LOCKED',
    stateRelocked
  );

  // ------------------------------------------------------------------
  // 7. SESSION ISOLATION (No cross-talk between students)
  // ------------------------------------------------------------------
  console.log('\n>>> 7. SESSION ISOLATION BETWEEN STUDENTS <<<');
  const studentA = `std_iso_a_${Date.now()}`;
  const studentB = `std_iso_b_${Date.now()}`;

  const startA = await startExamAttemptAction({
    examId: 'sch_mat_x',
    studentId: studentA,
    enteredToken: '36S7KS',
  });
  const startB = await startExamAttemptAction({
    examId: 'sch_mat_x',
    studentId: studentB,
    enteredToken: '36S7KS',
  });

  const attemptIdA = startA.data?.attemptId!;
  const attemptIdB = startB.data?.attemptId!;

  // Lock out Student A
  for (let i = 0; i < 3; i++) {
    await recordViolationAction({
      attemptId: attemptIdA,
      examId: 'sch_mat_x',
      studentId: studentA,
      violationType: 'WINDOW_BLUR' as any,
    });
  }

  const stateA = mockAttemptStore.get(attemptIdA);
  const stateB = mockAttemptStore.get(attemptIdB);

  recordCheck(
    'Student A is locked (violations=3, isLocked=true)',
    'Isolation',
    stateA?.isLocked === true && stateA?.violationsCount === 3,
    stateA
  );
  recordCheck(
    'Student B remains completely unaffected (violations=0, isLocked=false)',
    'Isolation',
    stateB?.isLocked === false && stateB?.violationsCount === 0,
    stateB
  );

  // ------------------------------------------------------------------
  // 8. GRADING INTEGRITY (T2_B07 & Authentic Scoring)
  // ------------------------------------------------------------------
  console.log('\n>>> 8. GRADING INTEGRITY & SUBMISSION <<<');
  const gradeExam = MOCK_EXAM_SCHEDULES[0];
  const q0 = gradeExam.questions[0];

  // Zero answers submission
  const subZero = await submitExamAttemptAction(
    attemptIdB,
    gradeExam.id,
    studentB,
    {}
  );
  recordCheck(
    'Zero answers submission produces score 0 and no NaN',
    'Grading',
    subZero.success === true &&
      subZero.data?.totalScore === 0 &&
      subZero.data?.percentageScore === 0 &&
      subZero.data?.totalUnanswered > 0,
    subZero.data
  );

  // Correct answer submission on new attempt
  const studentC = `std_grade_c_${Date.now()}`;
  const startC = await startExamAttemptAction({
    examId: gradeExam.id,
    studentId: studentC,
    enteredToken: gradeExam.activeToken!,
  });
  const attemptIdC = startC.data?.attemptId!;

  const correctOptionId = (q0 as any).correctOptionId || (q0 as any).options?.find((o: any) => o.isCorrect)?.id;
  const subCorrect = await submitExamAttemptAction(
    attemptIdC,
    gradeExam.id,
    studentC,
    { [q0.id]: correctOptionId }
  );
  recordCheck(
    'Correct answer awards full question points (authentic grading)',
    'Grading',
    subCorrect.success === true &&
      subCorrect.data?.totalScore === q0.points &&
      subCorrect.data?.totalCorrect === 1,
    subCorrect.data
  );

  // Wrong answer submission: ensure NO distorted 80% points are given
  const studentD = `std_grade_d_${Date.now()}`;
  const startD = await startExamAttemptAction({
    examId: gradeExam.id,
    studentId: studentD,
    enteredToken: gradeExam.activeToken!,
  });
  const attemptIdD = startD.data?.attemptId!;

  const wrongOption = (q0 as any).options?.find((o: any) => o.id !== correctOptionId)?.id || 'wrong_opt_xyz';
  const subWrong = await submitExamAttemptAction(
    attemptIdD,
    gradeExam.id,
    studentD,
    { [q0.id]: wrongOption }
  );
  recordCheck(
    'Wrong answer awards 0 points (no distorted score inflation)',
    'Grading',
    subWrong.success === true &&
      subWrong.data?.totalScore === 0 &&
      subWrong.data?.totalWrong === 1,
    subWrong.data
  );

  // ------------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------------
  console.log('\n======================================================================');
  console.log('                 ADVERSARIAL STRESS SUITE SUMMARY                     ');
  console.log('======================================================================');
  const total = checks.length;
  const passed = checks.filter((c) => c.passed).length;
  const failed = checks.filter((c) => !c.passed).length;

  console.log(`Total Scenarios : ${total}`);
  console.log(`Passed          : ${passed} (${Math.round((passed / total) * 100)}%)`);
  console.log(`Failed          : ${failed}`);

  if (failed > 0) {
    console.log('\nFailures Detected:');
    checks
      .filter((c) => !c.passed)
      .forEach((c) => {
        console.log(`  - [${c.category}] ${c.name}: ${c.error || JSON.stringify(c.actual)}`);
      });
  }
  console.log('======================================================================\n');

  return { total, passed, failed };
}

runAdversarialStressSuite()
  .then((res) => {
    if (res.failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error('Fatal unhandled error in stress suite:', err);
    process.exit(1);
  });
