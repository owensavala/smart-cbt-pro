/**
 * Tier 1: Feature Coverage - Requirement R4: Encoding Karakter Branding (P2)
 * 
 * Authoritative Source: ORIGINAL_REQUEST.md § R4 & PROJECT.md § M2
 * Requirement:
 *   Ganti raw entity &bull; pada input branding ('Kota Ternate &bull; CBT & Asesmen Digital')
 *   menjadi simbol unicode bullet '•'.
 *   Teks branding menampilkan karakter bullet unicode '•' tanpa muncul entitas teks mentah &bull;.
 */

import { describe, it, expect, setTestTier } from '../helpers/test-harness';
import { readProjectFile, countOccurrences, findFilesWithSubstring } from '../helpers/opaque-inspect';
import { DEFAULT_BRANDING_SETTINGS } from '../../../src/lib/mock-data';

export async function runR4Tests() {
  setTestTier('Tier 1: R4 Branding Encoding');

  await describe('R4.1 - Character Entity &bull; Replacement with Unicode Bullet •', async () => {
    await it('T1_R4_01_default_branding_subname_uses_unicode_bullet: DEFAULT_BRANDING_SETTINGS.subName uses unicode "•" instead of "&bull;"', async () => {
      expect(DEFAULT_BRANDING_SETTINGS.subName).toBeDefined();
      expect(DEFAULT_BRANDING_SETTINGS.subName).not.toContain('&bull;');
      expect(DEFAULT_BRANDING_SETTINGS.subName).toContain('•');
    });

    await it('T1_R4_02_mock_data_free_from_raw_bull: src/lib/mock-data.ts contains 0 instances of &bull;', async () => {
      const content = readProjectFile('src/lib/mock-data.ts');
      const count = countOccurrences(content, '&bull;');
      expect(count).toBe(0);
    });

    await it('T1_R4_03_branding_modal_free_from_raw_bull: src/components/BrandingSettingsModal.tsx contains 0 instances of &bull;', async () => {
      const content = readProjectFile('src/components/BrandingSettingsModal.tsx');
      const count = countOccurrences(content, '&bull;');
      expect(count).toBe(0);
    });

    await it('T1_R4_04_page_tsx_free_from_raw_bull: src/app/page.tsx contains 0 instances of &bull;', async () => {
      const content = readProjectFile('src/app/page.tsx');
      const count = countOccurrences(content, '&bull;');
      expect(count).toBe(0);
    });

    await it('T1_R4_05_login_view_free_from_raw_bull: src/components/LoginView.tsx contains 0 instances of &bull;', async () => {
      const content = readProjectFile('src/components/LoginView.tsx');
      const count = countOccurrences(content, '&bull;');
      expect(count).toBe(0);
    });

    await it('T1_R4_06_entire_src_directory_free_from_raw_bull: Entire src/ codebase has zero occurrences of &bull;', async () => {
      const filesWithBull = findFilesWithSubstring('src', '&bull;');
      if (filesWithBull.length > 0) {
        throw new Error(
          `Found raw &bull; in ${filesWithBull.length} files:\n  ${filesWithBull.join('\n  ')}`
        );
      }
      expect(filesWithBull.length).toBe(0);
    });
  });
}
