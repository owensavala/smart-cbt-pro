# SmartCBT Pro - Comprehensive E2E Test Suite Specification & Runner Guide

**Document Version**: 1.0.0  
**Target Environment**: Next.js 16.4.5 + React 19 + TypeScript + Prisma 7  
**Test Suite Path**: `tests/e2e/`  
**Execution Command**: `npx tsx tests/e2e/run-all.ts` or `npm test`  

---

## 1. Quick Start & Test Commands

The automated test runner is fully self-contained and requires no external testing harness dependencies. It can run the full suite or target individual tiers selectively:

```bash
# 1. Run Complete 4-Tier Test Suite
npx tsx tests/e2e/run-all.ts
# or
npm test

# 2. Run Tier 1: Feature Coverage (R1 - R5)
npx tsx tests/e2e/run-all.ts --tier 1

# 3. Run Tier 2: Boundary & Corner Cases
npx tsx tests/e2e/run-all.ts --tier 2

# 4. Run Tier 3: Cross-Feature Interactions
npx tsx tests/e2e/run-all.ts --tier 3

# 5. Run Tier 4: Real-World Classroom Exam Simulation
npx tsx tests/e2e/run-all.ts --tier 4
```

### Exit Code Semantics
- **Exit Code `0`**: All tests passed successfully.
- **Exit Code `1`**: One or more assertions failed (with detailed failure report and stack traces).

---

## 2. Test Coverage Summary Table

| Tier | Scope / Objective | Test File | Test Count | Requirement Mapping | Status |
|---|---|---|---|---|---|
| **Tier 1: Feature Coverage** | R1: Validasi Jadwal Ujian | `tests/e2e/tier1-feature-coverage/r1-exam-validation.test.ts` | 6 tests | R1 (Seed, Mock Data, Actions) | Ready |
| **Tier 1: Feature Coverage** | R2: Hydration Mismatch | `tests/e2e/tier1-feature-coverage/r2-hydration-mismatch.test.ts` | 5 tests | R2 (`page.tsx:566` Avatar/Logo) | Ready |
| **Tier 1: Feature Coverage** | R3: Metadata Title | `tests/e2e/tier1-feature-coverage/r3-metadata-title.test.ts` | 5 tests | R3 (`layout.tsx` Title & Lang) | Ready |
| **Tier 1: Feature Coverage** | R4: Branding Encoding | `tests/e2e/tier1-feature-coverage/r4-branding-encoding.test.ts` | 6 tests | R4 (`&bull;` -> `•`) | Ready |
| **Tier 1: Feature Coverage** | R5: A11y & UI Quality | `tests/e2e/tier1-feature-coverage/r5-accessibility-ui.test.ts` | 7 tests | R5 (Labels, Radios, Contrast, Build) | Ready |
| **Tier 2: Boundary & Corner** | Invalid inputs, edge conditions & thresholds | `tests/e2e/tier2-boundary-corner/boundary-cases.test.ts` | 10 tests | R1-R5 Boundary Limits | Ready |
| **Tier 3: Cross-Feature** | Pairwise integration flows | `tests/e2e/tier3-cross-feature/cross-feature.test.ts` | 5 tests | Integration (Token + Player + Export) | Ready |
| **Tier 4: Classroom Simulation**| Multi-student realistic CBT exam session | `tests/e2e/tier4-classroom-simulation/classroom-simulation.test.ts` | 3 scenarios | End-to-End Classroom Workflow | Ready |
| **TOTAL** | **Full E2E Verification Suite** | **8 Test Suites** | **47 Tests** | **Comprehensive R1-R5 Coverage** | **PUBLISHED** |

---

## 3. Requirement Verification Checklist

### R1. Validasi Jadwal Ujian (P0 Blocker)
- [x] **T1_R1_01**: Siswa rombel 'X MIPA 1' memasukkan token '36S7KS' dapat memulai ujian tanpa error `'Jadwal ujian tidak ditemukan.'`.
- [x] **T1_R1_02**: `prisma/seed.ts` mendefinisikan `ExamSchedule` aktif untuk kelas 'X MIPA 1' dengan token '36S7KS'.
- [x] **T1_R1_03**: `src/lib/mock-data.ts` memiliki jadwal aktif untuk 'X MIPA 1' dengan token '36S7KS'.
- [x] **T1_R1_04**: `MOCK_STUDENTS` memiliki profil siswa dengan rombel 'X MIPA 1'.
- [x] **T1_R1_05**: `getExamSchedulesAction` memetakan kolom hari (`dayOfWeek`) ke format hari Indonesia ('SENIN', 'SELASA', dsb.).
- [x] **T1_R1_06**: Inisiasi attempt mengembalikan status `IN_PROGRESS` dan timer durasi yang valid.

### R2. Penanganan React Hydration Mismatch (P1)
- [x] **T1_R2_01**: Elemen container avatar/logo pada `src/app/page.tsx` memiliki atribut `suppressHydrationWarning`.
- [x] **T1_R2_02**: Implementasi state `isMounted` dan `useEffect` untuk menahan render data spesifik klien sebelum mount.
- [x] **T1_R2_03**: Badge branding sekolah terlindung dari perbedaan markup awal SSR vs Virtual DOM klien.
- [x] **T1_R2_04**: Tidak ada pemanggilan langsung ke `localStorage` atau `window` di luar hook `useEffect`.
- [x] **T1_R2_05**: `DEFAULT_BRANDING_SETTINGS` menyediakan data awal deterministik tanpa field undefined.

### R3. Pembaruan Metadata Title (P2)
- [x] **T1_R3_01**: Metadata title pada `src/app/layout.tsx` adalah `'SmartCBT Pro - Platform Ujian Berbasis Komputer'`.
- [x] **T1_R3_02**: Judul halaman tidak lagi bertuliskan `'Create Next App'`.
- [x] **T1_R3_03**: Tag root `<html>` memiliki atribut `lang="id"`.
- [x] **T1_R3_04**: Deskripsi metadata merefleksikan platform SmartCBT Pro.
- [x] **T1_R3_05**: Seluruh file `src/app/layout.tsx` bebas dari teks default Next.js template.

### R4. Encoding Karakter Branding (P2)
- [x] **T1_R4_01**: `DEFAULT_BRANDING_SETTINGS.subName` menggunakan karakter unicode bullet `'•'` (`\u2022`) menggantikan `&bull;`.
- [x] **T1_R4_02**: `src/lib/mock-data.ts` memiliki 0 kemunculan entitas teks mentah `&bull;`.
- [x] **T1_R4_03**: `src/components/BrandingSettingsModal.tsx` memiliki 0 kemunculan entitas teks mentah `&bull;`.
- [x] **T1_R4_04**: `src/app/page.tsx` memiliki 0 kemunculan entitas teks mentah `&bull;`.
- [x] **T1_R4_05**: `src/components/LoginView.tsx` memiliki 0 kemunculan entitas teks mentah `&bull;`.
- [x] **T1_R4_06**: Seluruh direktori `src/` (23 file sumber) diverifikasi memiliki 0 entitas `&bull;`.

### R5. Aksesibilitas (A11y) & Kualitas Antarmuka
- [x] **T1_R5_01**: Input form pada `LoginView.tsx` memiliki asosiasi eksplisit antara `<label htmlFor="...">` dan `id`.
- [x] **T1_R5_02**: Input token ujian pada `StudentExamPlayer.tsx` memiliki label aksesibel dan `id="exam-token-input"`.
- [x] **T1_R5_03**: Pilihan radio soal single-choice menggunakan kelas Tailwind `sr-only` (bukan `hidden`) agar terbaca oleh screen reader dan dapat difokuskan via keyboard.
- [x] **T1_R5_04**: Elemen `<textarea>` esai pada `StudentExamPlayer.tsx` memiliki label aksesibel (`aria-label` / `id`).
- [x] **T1_R5_05**: Seluruh input form pada `BrandingSettingsModal.tsx` memiliki atribut `htmlFor` dan `id`.
- [x] **T1_R5_06**: Kartu statistik pada `TeacherQuestionBank.tsx` mematuhi rasio kontras warna WCAG AA (>= 4.5:1) dengan mengganti `slate-400` menjadi `slate-600` atau `slate-700` pada latar belakang putih.
- [x] **T1_R5_07**: Kompilasi produksi `npm run build` berhasil tanpa error dan tanpa peringatan bailout prerendering.

---

## 4. Tier 2-4 Detailed Test Scope

### Tier 2: Boundary & Corner Cases (10 Tests)
1. `T2_B01`: Penolakan token yang salah dengan pesan error deskriptif.
2. `T2_B02`: Normalisasi token huruf kecil dan spasi berlebih (misal: `"  36s7ks  "`).
3. `T2_B03`: Penolakan token kosong atau spasi murni tanpa exception crash.
4. `T2_B04`: Validasi pembatasan jadwal terhadap kelas sasaran siswa.
5. `T2_B05`: Ketahanan terhadap JSON branding yang rusak atau format kosong pada `localStorage`.
6. `T2_B06`: Penanganan karakter khusus dan perlindungan XSS pada teks branding.
7. `T2_B07`: Kalkulasi skor ketika siswa mengosongkan seluruh jawaban ujian (mencegah NaN / division-by-zero).
8. `T2_B08`: Penguncian sesi otomatis (`LOCKED`) ketika batas toleransi pelanggaran (`maxViolations`) terlampaui.
9. `T2_B09`: Verifikasi PIN pengawas/proktor untuk membuka kunci sesi ujian yang terblokir.
10. `T2_B10`: Mekanisme fallback resilien ketika PostgreSQL offline tanpa menyebabkan server action crash.

### Tier 3: Cross-Feature Interactions (5 Tests)
1. `T3_X01`: Alur lengkap dari validasi token (R1) -> pengerjaan berbagai tipe soal (PG, PGK, Matching, Short, Essay) -> auto-grading esai AI NLP -> kalkulasi skor final.
2. `T3_X02`: Penerapan branding unicode bullet `'•'` (R4) yang tampil konsisten pada antarmuka ujian siswa dan watermark layar.
3. `T3_X03`: Pemulihan sesi ujian pasca jeda/reload browser tanpa hydration mismatch (R1 + R2).
4. `T3_X04`: Sinkronisasi hasil ujian siswa ke rute ekspor nilai (`/api/reports/export-scores`) untuk format e-Rapor dan RDM Excel.
5. `T3_X05`: Navigasi aksesibilitas keyboard (R5) dari gerbang token hingga palet navigasi butir soal.

### Tier 4: Real-World Classroom Exam Simulation (3 Scenarios)
1. `T4_SIM01`: Simulasi ujian multi-siswa serentak dalam satu kelas, mencakup rilis token, pengerjaan, pencatatan insiden blur window, submit tepat waktu, dan pengunduhan rekap nilai proktor.
2. `T4_SIM02`: Simulasi pemadaman listrik/koneksi terputus di tengah ujian dan pemulihan jawaban otomatis (auto-save restoration).
3. `T4_SIM03`: Simulasi proctoring anti-cheat: siswa memicu 3x blur layar, layar terkunci otomatis, proktor melakukan bypass PIN, dan siswa menuntaskan ujian.

---

## 5. File Architecture

```
tests/e2e/
├── helpers/
│   ├── test-harness.ts        # Assertion matchers, registry, and formatted summary reporter
│   └── opaque-inspect.ts      # Opaque-box file inspect, AST/regex, and WCAG contrast math
├── tier1-feature-coverage/
│   ├── r1-exam-validation.test.ts      # 6 tests for Requirement R1
│   ├── r2-hydration-mismatch.test.ts   # 5 tests for Requirement R2
│   ├── r3-metadata-title.test.ts       # 5 tests for Requirement R3
│   ├── r4-branding-encoding.test.ts    # 6 tests for Requirement R4
│   └── r5-accessibility-ui.test.ts     # 7 tests for Requirement R5
├── tier2-boundary-corner/
│   └── boundary-cases.test.ts          # 10 tests for boundaries & corner cases
├── tier3-cross-feature/
│   └── cross-feature.test.ts           # 5 tests for cross-feature interactions
├── tier4-classroom-simulation/
│   └── classroom-simulation.test.ts    # 3 multi-student classroom simulations
└── run-all.ts                          # Master automated test runner CLI
```
