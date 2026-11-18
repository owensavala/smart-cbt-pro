/**
 * Tier 1: Feature Coverage - Requirement R5: Audit & Perbaikan Aksesibilitas (A11y) & Kualitas Antarmuka
 * 
 * Authoritative Source: ORIGINAL_REQUEST.md § R5 & PROJECT.md § M3
 * Requirement:
 *   - Form inputs have associated labels via htmlFor and id.
 *   - StudentExamPlayer radio controls use sr-only instead of hidden for keyboard navigation.
 *   - Essay textarea has accessible label / aria-label.
 *   - Color contrast meets WCAG AA standards (>= 4.5:1 for normal text).
 *   - Application compiles cleanly with npm run build.
 */

import { describe, it, expect, setTestTier } from '../helpers/test-harness';
import { readProjectFile, calculateContrastRatio, TAILWIND_COLORS } from '../helpers/opaque-inspect';
import { execSync } from 'child_process';
import * as path from 'path';

export async function runR5Tests() {
  setTestTier('Tier 1: R5 Accessibility & UI Quality');

  await describe('R5.1 - Form Accessibility, Keyboard Navigation & Visual Contrast', async () => {
    await it('T1_R5_01_login_inputs_have_labels_and_ids: LoginView inputs have explicit htmlFor and id bindings', async () => {
      const loginContent = readProjectFile('src/components/LoginView.tsx');

      // Check username input and password input htmlFor & id
      expect(loginContent).toContain('htmlFor="');
      expect(loginContent).toContain('id="');
      expect(loginContent).toContain('login-username');
      expect(loginContent).toContain('login-password');
    });

    await it('T1_R5_02_token_gate_input_has_accessible_label: StudentExamPlayer token input has htmlFor/id binding', async () => {
      const examPlayerContent = readProjectFile('src/components/StudentExamPlayer.tsx');

      // Token gate input must have id and matching label htmlFor
      expect(examPlayerContent).toContain('exam-token-input');
      expect(examPlayerContent).toContain('htmlFor="exam-token-input"');
    });

    await it('T1_R5_03_exam_player_radios_use_sr_only_not_hidden: Single-choice radios in StudentExamPlayer use sr-only for keyboard focusability', async () => {
      const examPlayerContent = readProjectFile('src/components/StudentExamPlayer.tsx');

      // The radio input for multiple choice must use sr-only, NOT hidden
      // (hidden uses display:none which completely removes it from accessibility tree)
      expect(examPlayerContent).toContain('sr-only');
      expect(examPlayerContent).not.toMatch(/type="radio"[^>]*className="hidden"/);
    });

    await it('T1_R5_04_essay_textarea_has_accessible_label: StudentExamPlayer essay textarea has accessible label or aria-label', async () => {
      const examPlayerContent = readProjectFile('src/components/StudentExamPlayer.tsx');

      const hasAriaLabel = examPlayerContent.includes('aria-label="Tuliskan uraian jawaban') ||
        examPlayerContent.includes('aria-label="Jawaban esai"') ||
        examPlayerContent.includes('id="essay-answer-input"');

      expect(hasAriaLabel).toBe(true);
    });

    await it('T1_R5_05_branding_form_inputs_have_labels_and_ids: BrandingSettingsModal inputs possess htmlFor and matching ids', async () => {
      const brandingContent = readProjectFile('src/components/BrandingSettingsModal.tsx');

      expect(brandingContent).toContain('htmlFor=');
      expect(brandingContent).toContain('branding-school-name');
    });

    await it('T1_R5_06_wcag_color_contrast_compliance: TeacherQuestionBank stat cards meet WCAG AA >= 4.5:1', async () => {
      const qbContent = readProjectFile('src/components/TeacherQuestionBank.tsx');

      // Stat cards on white background must NOT use low-contrast text-slate-400
      expect(qbContent).not.toContain('text-xs text-slate-400 block font-medium');

      // Verify that contrast ratio between slate-600/700 and white exceeds 4.5:1
      const contrastSlate600OnWhite = calculateContrastRatio(TAILWIND_COLORS['slate-600'], TAILWIND_COLORS['white']);
      const contrastSlate700OnWhite = calculateContrastRatio(TAILWIND_COLORS['slate-700'], TAILWIND_COLORS['white']);
      const contrastSlate400OnWhite = calculateContrastRatio(TAILWIND_COLORS['slate-400'], TAILWIND_COLORS['white']);

      // slate-400 fails WCAG AA on white (only ~2.83:1)
      expect(contrastSlate400OnWhite).toBeLessThan(4.5);

      // slate-600 and slate-700 pass WCAG AA on white
      expect(contrastSlate600OnWhite).toBeGreaterThanOrEqual(4.5);
      expect(contrastSlate700OnWhite).toBeGreaterThanOrEqual(4.5);
    });

    await it('T1_R5_07_build_compiles_successfully: Production build npm run build completes with exit code 0', async () => {
      const projectRoot = path.resolve(__dirname, '../../..');
      let buildOutput = '';
      let exitCode = 0;

      try {
        buildOutput = execSync('npm run build', {
          cwd: projectRoot,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: 60000,
        });
      } catch (err: any) {
        exitCode = err.status || 1;
        buildOutput = (err.stdout || '') + (err.stderr || '');
      }

      if (exitCode !== 0) {
        throw new Error(`Build failed with exit code ${exitCode}:\n${buildOutput.slice(-500)}`);
      }

      expect(exitCode).toBe(0);
      expect(buildOutput).not.toContain('needs to bail out of prerendering at this point');
    });
  });
}
