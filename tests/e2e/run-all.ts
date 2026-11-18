/**
 * SmartCBT Pro - Master E2E Automated Test Runner
 * 
 * Usage:
 *   npx tsx tests/e2e/run-all.ts
 *   npx tsx tests/e2e/run-all.ts --tier 1
 *   npx tsx tests/e2e/run-all.ts --tier 2
 *   npx tsx tests/e2e/run-all.ts --tier 3
 *   npx tsx tests/e2e/run-all.ts --tier 4
 * 
 * Exit Code:
 *   0 = All tests passed
 *   1 = One or more tests failed
 */

import { printSummaryReport } from './helpers/test-harness';
import { runR1Tests } from './tier1-feature-coverage/r1-exam-validation.test';
import { runR2Tests } from './tier1-feature-coverage/r2-hydration-mismatch.test';
import { runR3Tests } from './tier1-feature-coverage/r3-metadata-title.test';
import { runR4Tests } from './tier1-feature-coverage/r4-branding-encoding.test';
import { runR5Tests } from './tier1-feature-coverage/r5-accessibility-ui.test';
import { runTier2BoundaryTests } from './tier2-boundary-corner/boundary-cases.test';
import { runTier3CrossFeatureTests } from './tier3-cross-feature/cross-feature.test';
import { runTier4ClassroomSimulationTests } from './tier4-classroom-simulation/classroom-simulation.test';

async function main() {
  const args = process.argv.slice(2);
  const tierArg = args.find((_, i) => args[i - 1] === '--tier');

  console.log('======================================================================');
  console.log('           STARTING SMARTCBT PRO E2E TEST SUITE EXECUTION             ');
  console.log(`           Time: ${new Date().toISOString()}                          `);
  console.log(`           Mode: ${tierArg ? `Selective Tier: ${tierArg}` : 'Full All-Tier Suite (Tiers 1-4)'}`);
  console.log('======================================================================\n');

  try {
    if (!tierArg || tierArg === '1') {
      console.log('\n>>> EXECUTING TIER 1: FEATURE COVERAGE (R1 - R5) <<<');
      await runR1Tests();
      await runR2Tests();
      await runR3Tests();
      await runR4Tests();
      await runR5Tests();
    }

    if (!tierArg || tierArg === '2') {
      console.log('\n>>> EXECUTING TIER 2: BOUNDARY & CORNER CASES <<<');
      await runTier2BoundaryTests();
    }

    if (!tierArg || tierArg === '3') {
      console.log('\n>>> EXECUTING TIER 3: CROSS-FEATURE INTERACTIONS <<<');
      await runTier3CrossFeatureTests();
    }

    if (!tierArg || tierArg === '4') {
      console.log('\n>>> EXECUTING TIER 4: REAL-WORLD CLASSROOM SIMULATION <<<');
      await runTier4ClassroomSimulationTests();
    }
  } catch (fatalError: any) {
    console.error('Fatal unhandled error during test execution:', fatalError);
    process.exit(1);
  }

  const report = printSummaryReport();

  if (report.success) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Master runner exited unexpectedly:', err);
  process.exit(1);
});
