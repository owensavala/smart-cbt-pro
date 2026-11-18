/**
 * Tier 1: Feature Coverage - Requirement R1: Validasi Jadwal Ujian (P0 Blocker)
 * 
 * Authoritative Source: ORIGINAL_REQUEST.md § R1 & PROJECT.md § M1
 * Requirement:
 *   Siswa simulasi dengan rombel 'X MIPA 1' dapat langsung memulai ujian
 *   menggunakan token '36S7KS' tanpa memunculkan pesan kesalahan 'Jadwal ujian tidak ditemukan'.
 */

import { describe, it, expect, setTestTier } from '../helpers/test-harness';
import { readProjectFile } from '../helpers/opaque-inspect';
import { MOCK_EXAM_SCHEDULES, MOCK_STUDENTS } from '../../../src/lib/mock-data';
import { startExamAttemptAction } from '../../../src/app/actions/attempt-actions';
import { getExamSchedulesAction } from '../../../src/app/actions/exam-actions';

export async function runR1Tests() {
  setTestTier('Tier 1: R1 Exam Validation');

  await describe('R1.1 - Exam Schedule Token Gate & Attempt Action', async () => {
    await it('T1_R1_01_student_x_mipa_1_token_36s7ks_start_attempt: Student in X MIPA 1 starts exam with token 36S7KS without "Jadwal ujian tidak ditemukan"', async () => {
      // Find or construct student and schedule for X MIPA 1
      const studentX1 = MOCK_STUDENTS.find(s => s.className === 'X MIPA 1') || {
        id: 'std_aditya_x1',
        name: 'Muhammad Aditya Pratama',
        className: 'X MIPA 1',
        level: 'X',
        noPeserta: 'U-2026-001',
        nisn: '0081234567',
      };

      const examScheduleX1 = MOCK_EXAM_SCHEDULES.find(
        s => (s.className?.includes('X MIPA 1') || s.level === 'X' || s.activeToken === '36S7KS') && s.isActive
      ) || MOCK_EXAM_SCHEDULES[0];

      expect(examScheduleX1).toBeDefined();

      const res = await startExamAttemptAction({
        examId: examScheduleX1?.id || 'sch_mat_x',
        studentId: studentX1.id,
        enteredToken: '36S7KS',
      });

      // Must succeed and NOT produce "Jadwal ujian tidak ditemukan."
      expect(res.error).not.toBe('Jadwal ujian tidak ditemukan.');
      expect(res.error).not.toBe('Jadwal ujian tidak ditemukan');
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data?.attemptId).toBeDefined();
      expect(res.data?.status).toBe('IN_PROGRESS');
    });

    await it('T1_R1_02_database_seed_contains_x_mipa_1_active_schedule: prisma/seed.ts defines active ExamSchedule for X MIPA 1 with token 36S7KS', async () => {
      const seedContent = readProjectFile('prisma/seed.ts');

      // Verify that seed.ts references '36S7KS' and 'X MIPA 1'
      expect(seedContent).toContain('36S7KS');
      expect(seedContent).toContain('X MIPA 1');
      
      // Verify ExamSchedule creation in seed.ts
      const hasExamScheduleSeed = seedContent.includes('examSchedule.create') ||
        seedContent.includes('examSchedule.upsert') ||
        seedContent.includes('ExamSchedule');
      expect(hasExamScheduleSeed).toBe(true);
    });

    await it('T1_R1_03_mock_exam_schedules_contains_x_mipa_1: MOCK_EXAM_SCHEDULES contains an active schedule for X MIPA 1 with token 36S7KS', async () => {
      const targetSchedule = MOCK_EXAM_SCHEDULES.find(
        s => (s.className?.includes('X MIPA 1') || s.level === 'X') && s.activeToken === '36S7KS'
      );

      expect(targetSchedule).toBeDefined();
      expect(targetSchedule?.activeToken).toBe('36S7KS');
      expect(targetSchedule?.tokenRequired).toBe(true);
      expect(targetSchedule?.isActive).toBe(true);
    });

    await it('T1_R1_04_mock_students_contains_x_mipa_1_student: MOCK_STUDENTS contains at least 1 student belonging to X MIPA 1', async () => {
      const x1Student = MOCK_STUDENTS.find(s => s.className === 'X MIPA 1');
      expect(x1Student).toBeDefined();
      expect(x1Student?.className).toBe('X MIPA 1');
      expect(x1Student?.id).toBeDefined();
    });

    await it('T1_R1_05_exam_actions_day_of_week_mapping: getExamSchedulesAction provides valid dayOfWeek string', async () => {
      const schedulesRes = await getExamSchedulesAction();
      expect(schedulesRes.success).toBe(true);
      expect(schedulesRes.data).toBeDefined();
      expect(Array.isArray(schedulesRes.data)).toBe(true);

      const validDays = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'];
      if (schedulesRes.data && schedulesRes.data.length > 0) {
        for (const schedule of schedulesRes.data) {
          const day = (schedule as any).dayOfWeek;
          expect(day).toBeDefined();
          expect(validDays).toContain(day);
        }
      }
    });

    await it('T1_R1_06_attempt_initialization_sets_in_progress_and_timer: Exam attempt returns valid duration and status IN_PROGRESS', async () => {
      const student = MOCK_STUDENTS[0];
      const exam = MOCK_EXAM_SCHEDULES.find(s => s.activeToken === '36S7KS') || MOCK_EXAM_SCHEDULES[0];

      const res = await startExamAttemptAction({
        examId: exam.id,
        studentId: student.id,
        enteredToken: '36S7KS',
      });

      expect(res.success).toBe(true);
      if (res.data) {
        expect(res.data.status).toBe('IN_PROGRESS');
        expect(res.data.remainingSeconds).toBeGreaterThan(0);
        expect(res.data.currentQuestionIndex).toBe(0);
        expect(res.data.isLocked).toBe(false);
      }
    });
  });
}
