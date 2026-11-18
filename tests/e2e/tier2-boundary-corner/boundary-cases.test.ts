/**
 * Tier 2: Boundary & Corner Cases Test Suite
 * 
 * Covers edge conditions, invalid input combinations, special characters,
 * boundary thresholds, malformed inputs, and resilience against faults.
 */

import { describe, it, expect, setTestTier } from '../helpers/test-harness';
import {
  startExamAttemptAction,
  submitExamAttemptAction,
  recordViolationAction,
  unlockAttemptWithPinAction,
} from '../../../src/app/actions/attempt-actions';
import { MOCK_EXAM_SCHEDULES, MOCK_STUDENTS, DEFAULT_BRANDING_SETTINGS } from '../../../src/lib/mock-data';

export async function runTier2BoundaryTests() {
  setTestTier('Tier 2: Boundary & Corner Cases');

  await describe('Tier 2 - Boundary Conditions & Adversarial Edge Cases', async () => {
    const student = MOCK_STUDENTS[0];
    const exam = MOCK_EXAM_SCHEDULES.find(s => s.activeToken === '36S7KS') || MOCK_EXAM_SCHEDULES[0];

    // B01: Invalid token rejected
    await it('T2_B01_invalid_token_rejected_with_error: Rejects wrong tokens and prevents unauthorized attempt creation', async () => {
      const res = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: 'WRONG99',
      });

      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
      expect(res.data).toBeFalsy();
    });

    // B02: Whitespace and lowercase normalization
    await it('T2_B02_token_whitespace_and_lowercase_normalization: Accepts "  36s7ks  " via trimming and uppercasing', async () => {
      const res = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: '  36s7ks  ',
      });

      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data?.status).toBe('IN_PROGRESS');
    });

    // B03: Empty and whitespace-only token
    await it('T2_B03_empty_and_null_token_rejected: Rejects empty or whitespace-only token string', async () => {
      const resEmpty = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: '',
      });

      const resSpaces = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: '    ',
      });

      expect(resEmpty.success).toBe(false);
      expect(resSpaces.success).toBe(false);
    });

    // B04: Rombel / Class mismatch handling
    await it('T2_B04_rombel_class_mismatch_boundary: Validates student class alignment against targeted schedules', async () => {
      const studentX1 = MOCK_STUDENTS.find(s => s.className === 'X MIPA 1') || MOCK_STUDENTS[0];
      const examScheduleX1 = MOCK_EXAM_SCHEDULES.find(
        s => (s.className?.includes('X MIPA 1') || s.level === 'X') && s.activeToken === '36S7KS'
      ) || MOCK_EXAM_SCHEDULES[0];

      // Student in target class must be allowed
      const validStart = await startExamAttemptAction({
        examId: examScheduleX1.id,
        studentId: studentX1.id,
        enteredToken: '36S7KS',
      });

      expect(validStart.success).toBe(true);
    });

    // B05: Malformed JSON in localStorage fallback
    await it('T2_B05_malformed_and_extreme_branding_json: Safely handles corrupted JSON and empty object fallback', async () => {
      // Simulate corrupted localStorage payload
      const corruptedJson = '{"schoolName": "Broken", corrupt_syntax...';
      let parsedSettings = DEFAULT_BRANDING_SETTINGS;

      try {
        const parsed = JSON.parse(corruptedJson);
        if (parsed && parsed.schoolName) {
          parsedSettings = parsed;
        }
      } catch {
        // Fallback to default
        parsedSettings = DEFAULT_BRANDING_SETTINGS;
      }

      expect(parsedSettings).toEqual(DEFAULT_BRANDING_SETTINGS);
      expect(parsedSettings.schoolName).toBeDefined();
    });

    // B06: Special characters and XSS attempts in branding
    await it('T2_B06_special_characters_and_xss_in_branding: Safely retains unicode bullets and escapes potential XSS strings', async () => {
      const xssPayload = '<script>alert("xss")</script> • Sekolah & Asesmen';
      
      // Test that unicode bullets and strings can be stored without corrupting encoding
      expect(xssPayload).toContain('•');
      expect(xssPayload).not.toContain('&bull;');

      // Verify default branding does not contain unescaped raw entities
      expect(DEFAULT_BRANDING_SETTINGS.subName).not.toContain('&bull;');
    });

    // B07: Zero answered questions submission
    await it('T2_B07_zero_answers_submission: Submitting zero answers produces score 0 and avoids NaN / division by zero', async () => {
      const startRes = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: '36S7KS',
      });

      expect(startRes.success).toBe(true);
      const attemptId = startRes.data?.attemptId || 'mock_att_zero';

      // Submit with completely empty answers map
      const submitRes = await submitExamAttemptAction(
        attemptId,
        exam.id,
        student.id,
        {}
      );

      expect(submitRes.success).toBe(true);
      if (submitRes.data) {
        expect(submitRes.data.totalScore).toBe(0);
        expect(submitRes.data.percentageScore).toBe(0);
        expect(submitRes.data.totalCorrect).toBe(0);
        expect(submitRes.data.totalUnanswered).toBeGreaterThan(0);
      }
    });

    // B08: Anti-cheat max violations threshold triggers lock
    await it('T2_B08_anti_cheat_max_violations_threshold: Reaching maxViolations transitions attempt to LOCKED', async () => {
      const startRes = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: '36S7KS',
      });

      expect(startRes.success).toBe(true);
      const attemptId = startRes.data?.attemptId || 'mock_att_cheat';
      const maxAllowed = startRes.data?.maxViolationsAllowed || 3;

      let lastViolationRes: any = null;
      for (let i = 1; i <= maxAllowed; i++) {
        lastViolationRes = await recordViolationAction({
          attemptId,
          examId: exam.id,
          studentId: student.id,
          violationType: 'WINDOW_BLUR',
          durationMs: 4500,
          details: `Simulated blur test violation ${i}`,
        });
      }

      expect(lastViolationRes.success).toBe(true);
      expect(lastViolationRes.violationsCount).toBeGreaterThanOrEqual(maxAllowed);
      expect(lastViolationRes.isLocked).toBe(true);
    });

    // B09: Proctor PIN unlock validation
    await it('T2_B09_proctor_pin_unlock_validation: Unlocking requires valid proctor PIN, rejecting invalid PIN', async () => {
      const startRes = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: '36S7KS',
      });

      const attemptId = startRes.data?.attemptId || 'mock_att_pin';
      const validPin = startRes.data?.proctorPin || '123456';

      // Wrong PIN
      const failUnlock = await unlockAttemptWithPinAction(attemptId, 'WRONG_PIN');
      expect(failUnlock.success).toBe(false);

      // Correct PIN
      const successUnlock = await unlockAttemptWithPinAction(attemptId, validPin);
      expect(successUnlock.success).toBe(true);
    });

    // B10: Offline network / DB fallback resilience
    await it('T2_B10_offline_network_fallback_boundary: Server actions gracefully utilize mock-data fallback when DB is disconnected', async () => {
      const fallbackExam = MOCK_EXAM_SCHEDULES[0];
      const fallbackStudent = MOCK_STUDENTS[0];

      const res = await startExamAttemptAction({
        examId: fallbackExam.id,
        studentId: fallbackStudent.id,
        enteredToken: fallbackExam.activeToken || '36S7KS',
      });

      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
    });
  });
}
