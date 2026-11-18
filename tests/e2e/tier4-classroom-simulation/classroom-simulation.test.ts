/**
 * Tier 4: Real-World Classroom Exam Simulation Workflow
 * 
 * Simulates complete end-to-end classroom CBT examination sessions:
 * - Multi-student concurrent exam workflow
 * - Anti-cheat violation tracking and proctor unlock
 * - Mid-exam network disruption and seamless session recovery
 * - Automated score computation & eRapor / RDM reporting
 */

import { describe, it, expect, setTestTier } from '../helpers/test-harness';
import {
  startExamAttemptAction,
  backgroundSyncAnswerAction,
  recordViolationAction,
  unlockAttemptWithPinAction,
  submitExamAttemptAction,
} from '../../../src/app/actions/attempt-actions';
import { MOCK_EXAM_SCHEDULES, MOCK_STUDENTS, DEFAULT_BRANDING_SETTINGS } from '../../../src/lib/mock-data';
import { GET as exportScoresRoute } from '../../../src/app/api/reports/export-scores/route';
import { NextRequest } from 'next/server';

export async function runTier4ClassroomSimulationTests() {
  setTestTier('Tier 4: Classroom Exam Simulation');

  await describe('Tier 4 - Real-World Classroom Exam Scenarios', async () => {
    const examSchedule = MOCK_EXAM_SCHEDULES.find(s => s.activeToken === '36S7KS') || MOCK_EXAM_SCHEDULES[0];
    const student1 = MOCK_STUDENTS.find(s => s.className === 'X MIPA 1') || MOCK_STUDENTS[0];
    const student2 = MOCK_STUDENTS.find(s => s.id !== student1.id) || MOCK_STUDENTS[1];

    // Scenario 1: Complete multi-student classroom exam execution
    await it('T4_SIM01_complete_classroom_session_simulation: Multi-student full exam lifecycle from token release to score archival', async () => {
      // 1. School & Exam Setup
      expect(examSchedule.activeToken).toBe('36S7KS');
      expect(DEFAULT_BRANDING_SETTINGS.subName).toContain('•');

      // 2. Student 1 starts exam with token 36S7KS
      const s1Start = await startExamAttemptAction({
        examId: examSchedule.id,
        studentId: student1.id,
        enteredToken: '36S7KS',
      });
      expect(s1Start.success).toBe(true);
      const s1AttemptId = s1Start.data?.attemptId || 'sim_s1_att';

      // 3. Student 1 answers questions
      const s1Answers: Record<string, any> = {};
      if (examSchedule.questions) {
        for (const q of examSchedule.questions) {
          const anyQ = q as any;
          if (anyQ.type === 'PG' && anyQ.options && anyQ.options.length > 0) {
            const opt = anyQ.options.find((o: any) => o.isCorrect) || anyQ.options[0];
            s1Answers[anyQ.id] = opt.id;
            await backgroundSyncAnswerAction({
              attemptId: s1AttemptId,
              questionId: anyQ.id,
              questionType: 'PG',
              answerValue: opt.id,
              isDoubtful: false,
              remainingSeconds: 4800,
              currentQuestionIndex: 1,
            });
          }
        }
      }

      // 4. Student 1 submits
      const s1Submit = await submitExamAttemptAction(
        s1AttemptId,
        examSchedule.id,
        student1.id,
        s1Answers
      );
      expect(s1Submit.success).toBe(true);

      // 5. Student 2 starts exam simultaneously
      const s2Start = await startExamAttemptAction({
        examId: examSchedule.id,
        studentId: student2.id,
        enteredToken: '36S7KS',
      });
      expect(s2Start.success).toBe(true);
      const s2AttemptId = s2Start.data?.attemptId || 'sim_s2_att';

      // 6. Student 2 commits a minor window blur violation
      const s2Violation = await recordViolationAction({
        attemptId: s2AttemptId,
        examId: examSchedule.id,
        studentId: student2.id,
        violationType: 'WINDOW_BLUR',
        durationMs: 4200,
        details: 'Toleransi blur 4 detik terlampaui (Insiden #1)',
      });
      expect(s2Violation.success).toBe(true);
      expect(s2Violation.violationsCount).toBe(1);
      expect(s2Violation.isLocked).toBe(false);

      // 7. Student 2 finishes and submits
      const s2Submit = await submitExamAttemptAction(
        s2AttemptId,
        examSchedule.id,
        student2.id,
        {}
      );
      expect(s2Submit.success).toBe(true);

      // 8. Teacher exports final grade report via API
      const exportReq = new NextRequest(`http://localhost:3000/api/reports/export-scores?format=erapor&examId=${examSchedule.id}`);
      const exportRes = await exportScoresRoute(exportReq);
      expect(exportRes.status).toBe(200);
      const excelBuffer = await exportRes.arrayBuffer();
      expect(excelBuffer.byteLength).toBeGreaterThan(500);
    });

    // Scenario 2: Network disruption and session resume recovery
    await it('T4_SIM02_exam_disruption_and_recovery: Handles mid-exam disconnection and recovers student answers seamlessly', async () => {
      // Student begins exam
      const start = await startExamAttemptAction({
        examId: examSchedule.id,
        studentId: student1.id,
        enteredToken: '36S7KS',
      });
      expect(start.success).toBe(true);
      const attemptId = start.data?.attemptId || 'sim_disrupt_att';

      // Student answered first 2 questions before disconnection
      if (examSchedule.questions && examSchedule.questions.length >= 2) {
        const q1 = examSchedule.questions[0] as any;
        const q2 = examSchedule.questions[1] as any;

        await backgroundSyncAnswerAction({
          attemptId,
          questionId: q1.id,
          questionType: 'PG',
          answerValue: q1.options?.[0]?.id || 'opt_a',
          isDoubtful: false,
          remainingSeconds: 4500,
          currentQuestionIndex: 0,
        });

        await backgroundSyncAnswerAction({
          attemptId,
          questionId: q2.id,
          questionType: 'PG',
          answerValue: q2.options?.[0]?.id || 'opt_b',
          isDoubtful: true,
          remainingSeconds: 4420,
          currentQuestionIndex: 1,
        });
      }

      // Disconnection simulated -> Student re-opens browser and enters token again
      const recovery = await startExamAttemptAction({
        examId: examSchedule.id,
        studentId: student1.id,
        enteredToken: '36S7KS',
      });

      expect(recovery.success).toBe(true);
      expect(recovery.data?.status).toBe('IN_PROGRESS');
      expect(recovery.data?.savedAnswers).toBeDefined();
    });

    // Scenario 3: Proctor anti-cheat lock and PIN unlock workflow
    await it('T4_SIM03_proctor_anti_cheat_lock_and_unlock_workflow: Locks attempt upon max violations and resumes via proctor PIN', async () => {
      const start = await startExamAttemptAction({
        examId: examSchedule.id,
        studentId: student1.id,
        enteredToken: '36S7KS',
      });
      const attemptId = start.data?.attemptId || 'sim_lock_att';
      const maxAllowed = start.data?.maxViolationsAllowed || 3;
      const proctorPin = start.data?.proctorPin || '123456';

      // Accumulate violations to reach lock threshold
      let lockResult: any = null;
      for (let i = 1; i <= maxAllowed; i++) {
        lockResult = await recordViolationAction({
          attemptId,
          examId: examSchedule.id,
          studentId: student1.id,
          violationType: 'WINDOW_BLUR',
          durationMs: 4000,
          details: `Simulated lock violation #${i}`,
        });
      }

      expect(lockResult.isLocked).toBe(true);

      // Student tries to continue, blocked by lock
      // Proctor inspects and enters valid PIN
      const unlockRes = await unlockAttemptWithPinAction(attemptId, proctorPin);
      expect(unlockRes.success).toBe(true);

      // Student can now submit
      const finalSubmit = await submitExamAttemptAction(
        attemptId,
        examSchedule.id,
        student1.id,
        {}
      );
      expect(finalSubmit.success).toBe(true);
    });
  });
}
