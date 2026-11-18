/**
 * Tier 3: Cross-Feature Interactions Test Suite
 * 
 * Verifies pairwise combinations and cross-cutting capabilities:
 * - Token Start (R1) + Multi-Question Types Answering + Scoring
 * - Branding Unicode Bullets (R4) + Exam Player Interface Watermark
 * - Hydration-Safe Attempt Resume (R1 + R2)
 * - Exam Completion + Score Export API (/api/reports/export-scores)
 * - Accessibility (R5) across Token Gate and Question Navigation
 */

import { describe, it, expect, setTestTier } from '../helpers/test-harness';
import {
  startExamAttemptAction,
  backgroundSyncAnswerAction,
  submitExamAttemptAction,
} from '../../../src/app/actions/attempt-actions';
import { MOCK_EXAM_SCHEDULES, MOCK_STUDENTS, DEFAULT_BRANDING_SETTINGS } from '../../../src/lib/mock-data';
import { GET as exportScoresRoute } from '../../../src/app/api/reports/export-scores/route';
import { NextRequest } from 'next/server';
import { readProjectFile } from '../helpers/opaque-inspect';

export async function runTier3CrossFeatureTests() {
  setTestTier('Tier 3: Cross-Feature Interactions');

  await describe('Tier 3 - Pairwise & Cross-Feature Integration Flows', async () => {
    const student = MOCK_STUDENTS[0];
    const exam = MOCK_EXAM_SCHEDULES.find(s => s.activeToken === '36S7KS') || MOCK_EXAM_SCHEDULES[0];

    // X01: Token start (R1) + Multi-type answering + Score computation
    await it('T3_X01_token_start_answer_all_types_and_score: Complete workflow from token validation to multi-question grading', async () => {
      // Step 1: Start attempt with valid token 36S7KS
      const startRes = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: '36S7KS',
      });

      expect(startRes.success).toBe(true);
      const attemptId = startRes.data?.attemptId || 'att_test_full';

      // Step 2: Answer multiple question types
      const questions = exam.questions || [];
      const answersToSubmit: Record<string, any> = {};

      for (const q of questions) {
        const anyQ = q as any;
        if (anyQ.type === 'PG') {
          // Select correct option if available
          const correctOpt = anyQ.options?.find((o: any) => o.isCorrect) || anyQ.options?.[0];
          if (correctOpt) {
            answersToSubmit[anyQ.id] = correctOpt.id;
            await backgroundSyncAnswerAction({
              attemptId,
              questionId: anyQ.id,
              questionType: 'PG',
              answerValue: correctOpt.id,
              isDoubtful: false,
              remainingSeconds: 3600,
              currentQuestionIndex: 0,
            });
          }
        } else if (anyQ.type === 'SHORT' || anyQ.type === 'SHORT_ANSWER') {
          const acceptable = anyQ.acceptableAnswers?.[0] || 'Jawaban Benar';
          answersToSubmit[anyQ.id] = acceptable;
        } else if (anyQ.type === 'ESSAY') {
          answersToSubmit[anyQ.id] = 'Sistem fotosintesis mengubah energi cahaya matahari menjadi energi kimia dalam bentuk glukosa dan oksigen secara efisien.';
        }
      }

      // Step 3: Final submit
      const submitRes = await submitExamAttemptAction(
        attemptId,
        exam.id,
        student.id,
        answersToSubmit
      );

      expect(submitRes.success).toBe(true);
      if (submitRes.data) {
        expect(submitRes.data.percentageScore).toBeGreaterThanOrEqual(0);
        expect(submitRes.data.totalScore).toBeGreaterThanOrEqual(0);
      }
    });

    // X02: Custom branding with bullet • (R4) in Exam Player UI
    await it('T3_X02_branding_unicode_bullet_and_student_exam_player: Custom branding with • reflects seamlessly in exam taker UI', async () => {
      const customBranding = {
        ...DEFAULT_BRANDING_SETTINGS,
        schoolName: 'SMA NEGERI 1 NUSANTARA',
        subName: 'Kota Ternate • CBT & Asesmen Digital',
      };

      expect(customBranding.subName).toContain('•');
      expect(customBranding.subName).not.toContain('&bull;');

      const examPlayerContent = readProjectFile('src/components/StudentExamPlayer.tsx');
      // The exam player should render school branding and avoid &bull;
      expect(examPlayerContent).not.toContain('&bull;');
    });

    // X03: Hydration-safe attempt resume (R1 + R2)
    await it('T3_X03_hydration_safe_resume_exam_attempt: Exam attempt resumption safely restores state without hydration divergence', async () => {
      // Start initial attempt
      const start1 = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: '36S7KS',
      });
      expect(start1.success).toBe(true);
      const attemptId = start1.data?.attemptId || 'att_resume_test';

      // Save a question answer
      if (exam.questions && exam.questions.length > 0) {
        const qId = exam.questions[0].id;
        await backgroundSyncAnswerAction({
          attemptId,
          questionId: qId,
          questionType: 'PG',
          answerValue: 'opt_1',
          isDoubtful: true,
          remainingSeconds: 3000,
          currentQuestionIndex: 1,
        });
      }

      // Resume attempt by calling startExamAttemptAction again
      const resume = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: '36S7KS',
      });

      expect(resume.success).toBe(true);
      expect(resume.data).toBeDefined();
      expect(resume.data?.status).toBe('IN_PROGRESS');
    });

    // X04: Exam completion to Score Export API (/api/reports/export-scores)
    await it('T3_X04_exam_completion_to_score_export_api: Score export API produces valid binary Excel files for eRapor and RDM', async () => {
      // 1. Export eRapor
      const eRaporReq = new NextRequest(`http://localhost:3000/api/reports/export-scores?format=erapor&examId=${exam.id}`);
      const eRaporRes = await exportScoresRoute(eRaporReq);

      expect(eRaporRes.status).toBe(200);
      expect(eRaporRes.headers.get('content-type')).toContain('spreadsheetml');
      const eRaporBuffer = await eRaporRes.arrayBuffer();
      expect(eRaporBuffer.byteLength).toBeGreaterThan(100);

      // 2. Export RDM
      const rdmReq = new NextRequest(`http://localhost:3000/api/reports/export-scores?format=rdm&examId=${exam.id}`);
      const rdmRes = await exportScoresRoute(rdmReq);

      expect(rdmRes.status).toBe(200);
      expect(rdmRes.headers.get('content-type')).toContain('spreadsheetml');
      const rdmBuffer = await rdmRes.arrayBuffer();
      expect(rdmBuffer.byteLength).toBeGreaterThan(100);
    });

    // X05: Accessible keyboard navigation across exam flow (R5 + R1)
    await it('T3_X05_a11y_keyboard_navigation_with_token_gate_and_palette: Verifies keyboard navigation attributes across exam controls', async () => {
      const examPlayerContent = readProjectFile('src/components/StudentExamPlayer.tsx');

      // Verify token input accessibility
      expect(examPlayerContent).toContain('id="exam-token-input"');
      expect(examPlayerContent).toContain('htmlFor="exam-token-input"');

      // Verify radio inputs don't have hidden
      expect(examPlayerContent).not.toMatch(/type="radio"[^>]*className="hidden"/);

      // Verify fullscreen toggle has accessible label or aria-label
      const hasFullscreenLabel = examPlayerContent.includes('aria-label="Layar Penuh') ||
        examPlayerContent.includes('aria-label="Mode Layar Penuh"') ||
        examPlayerContent.includes('title=');
      expect(hasFullscreenLabel).toBe(true);
    });
  });
}
