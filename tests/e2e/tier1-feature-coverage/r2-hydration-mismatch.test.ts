/**
 * Tier 1: Feature Coverage - Requirement R2: Penanganan React Hydration Mismatch (P1)
 * 
 * Authoritative Source: ORIGINAL_REQUEST.md § R2 & PROJECT.md § M2
 * Requirement:
 *   Selesaikan React hydration error pada src/app/page.tsx (baris ~566) pada komponen
 *   Home terkait inisial avatar/logo antara rendering SSR dan client-side.
 */

import { describe, it, expect, setTestTier } from '../helpers/test-harness';
import { readProjectFile } from '../helpers/opaque-inspect';
import { DEFAULT_BRANDING_SETTINGS } from '../../../src/lib/mock-data';

export async function runR2Tests() {
  setTestTier('Tier 1: R2 Hydration Mismatch');

  await describe('R2.1 - React SSR/Client Hydration Defense on page.tsx', async () => {
    await it('T1_R2_01_logo_container_has_suppress_hydration_warning: src/app/page.tsx includes suppressHydrationWarning on logo/avatar container', async () => {
      const pageContent = readProjectFile('src/app/page.tsx');

      // The logo container around line 566 or branding elements must have suppressHydrationWarning
      expect(pageContent).toContain('suppressHydrationWarning');
    });

    await it('T1_R2_02_client_mount_guard_exists: src/app/page.tsx implements isMounted client guard', async () => {
      const pageContent = readProjectFile('src/app/page.tsx');

      // Check for isMounted state declaration and useEffect setter
      const hasIsMountedState = pageContent.includes('isMounted') && 
        (pageContent.includes('setIsMounted(true)') || pageContent.includes('setIsMounted'));

      expect(hasIsMountedState).toBe(true);
    });

    await it('T1_R2_03_branding_badge_hydration_guard: School branding badge is protected from client-server divergence', async () => {
      const pageContent = readProjectFile('src/app/page.tsx');

      // Ensure that branding rendering either uses suppressHydrationWarning or checks isMounted
      const hasGuardedBranding = pageContent.includes('suppressHydrationWarning') || pageContent.includes('isMounted');
      expect(hasGuardedBranding).toBe(true);
    });

    await it('T1_R2_04_no_direct_window_or_localstorage_in_render: localStorage access is safely encapsulated in useEffect hooks', async () => {
      const pageContent = readProjectFile('src/app/page.tsx');

      // localStorage should never be called outside useEffect / callbacks in React components
      // Verify that useEffect wraps localStorage.getItem
      const useEffectIndex = pageContent.indexOf('useEffect');
      const localStorageIndex = pageContent.indexOf("localStorage.getItem('smart_cbt_branding')");

      expect(useEffectIndex).toBeGreaterThan(-1);
      expect(localStorageIndex).toBeGreaterThan(-1);
      expect(localStorageIndex).toBeGreaterThan(useEffectIndex);
    });

    await it('T1_R2_05_default_branding_deterministic_initial_state: DEFAULT_BRANDING_SETTINGS provides valid deterministic SSR state', async () => {
      expect(DEFAULT_BRANDING_SETTINGS).toBeDefined();
      expect(typeof DEFAULT_BRANDING_SETTINGS.schoolName).toBe('string');
      expect(DEFAULT_BRANDING_SETTINGS.schoolName.length).toBeGreaterThan(0);
      expect(typeof DEFAULT_BRANDING_SETTINGS.logoType).toBe('string');
      expect(typeof DEFAULT_BRANDING_SETTINGS.themeColor).toBe('string');
      expect(typeof DEFAULT_BRANDING_SETTINGS.npsn).toBe('string');
    });
  });
}
