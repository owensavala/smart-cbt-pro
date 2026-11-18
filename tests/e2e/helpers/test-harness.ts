/**
 * SmartCBT Pro - End-to-End Test Harness & Assertion Framework
 * Self-contained, zero-dependency test framework for TypeScript / Node.js
 */

export interface TestResult {
  tier: string;
  suite: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIPPED';
  durationMs: number;
  error?: string;
  expected?: any;
  actual?: any;
}

export interface SuiteStats {
  tier: string;
  suite: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
}

class TestRegistry {
  private currentTier: string = 'General';
  private currentSuite: string = 'Default';
  public results: TestResult[] = [];
  public startTime: number = Date.now();

  setTier(tier: string) {
    this.currentTier = tier;
  }

  setSuite(suite: string) {
    this.currentSuite = suite;
  }

  getTier(): string {
    return this.currentTier;
  }

  getSuite(): string {
    return this.currentSuite;
  }

  addResult(result: TestResult) {
    this.results.push(result);
  }

  reset() {
    this.results = [];
    this.startTime = Date.now();
  }
}

export const registry = new TestRegistry();

export function setTestTier(tier: string) {
  registry.setTier(tier);
}

export function describe(suiteName: string, fn: () => void | Promise<void>) {
  registry.setSuite(suiteName);
  return fn();
}

export async function it(testName: string, fn: () => void | Promise<void>) {
  const tier = registry.getTier();
  const suite = registry.getSuite();
  const start = Date.now();

  try {
    await fn();
    const durationMs = Date.now() - start;
    registry.addResult({
      tier,
      suite,
      name: testName,
      status: 'PASS',
      durationMs,
    });
    console.log(`  \x1b[32m✔\x1b[0m [${tier}] ${testName} (${durationMs}ms)`);
  } catch (err: any) {
    const durationMs = Date.now() - start;
    const errorMessage = err?.message || String(err);
    registry.addResult({
      tier,
      suite,
      name: testName,
      status: 'FAIL',
      durationMs,
      error: errorMessage,
      expected: err?.expected,
      actual: err?.actual,
    });
    console.log(`  \x1b[31m✖\x1b[0m [${tier}] ${testName} (${durationMs}ms)`);
    console.log(`    \x1b[31mError:\x1b[0m ${errorMessage}`);
  }
}

// Alias for it
export const test = it;

export function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        const err: any = new Error(`Expected strictly === ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
        err.expected = expected;
        err.actual = actual;
        throw err;
      }
    },
    toEqual(expected: any) {
      const actStr = JSON.stringify(actual);
      const expStr = JSON.stringify(expected);
      if (actStr !== expStr) {
        const err: any = new Error(`Expected deep equal:\nExpected: ${expStr}\nReceived: ${actStr}`);
        err.expected = expected;
        err.actual = actual;
        throw err;
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, received: ${JSON.stringify(actual)}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value, received: ${JSON.stringify(actual)}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected value to be defined, but was undefined`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected value to be null, but was: ${JSON.stringify(actual)}`);
      }
    },
    toContain(expectedSub: string | any) {
      if (typeof actual === 'string') {
        if (!actual.includes(expectedSub)) {
          throw new Error(`Expected string to contain "${expectedSub}", but was: "${actual.slice(0, 150)}..."`);
        }
      } else if (Array.isArray(actual)) {
        const found = actual.some(item => JSON.stringify(item) === JSON.stringify(expectedSub) || item === expectedSub);
        if (!found) {
          throw new Error(`Expected array to contain element, but was not found`);
        }
      } else {
        throw new Error(`Cannot perform toContain on type ${typeof actual}`);
      }
    },
    toMatch(regex: RegExp) {
      if (typeof actual !== 'string' || !regex.test(actual)) {
        throw new Error(`Expected "${String(actual).slice(0, 100)}" to match pattern ${regex}`);
      }
    },
    toBeGreaterThan(num: number) {
      if (typeof actual !== 'number' || actual <= num) {
        throw new Error(`Expected ${actual} > ${num}`);
      }
    },
    toBeGreaterThanOrEqual(num: number) {
      if (typeof actual !== 'number' || actual < num) {
        throw new Error(`Expected ${actual} >= ${num}`);
      }
    },
    toBeLessThan(num: number) {
      if (typeof actual !== 'number' || actual >= num) {
        throw new Error(`Expected ${actual} < ${num}`);
      }
    },
    toBeLessThanOrEqual(num: number) {
      if (typeof actual !== 'number' || actual > num) {
        throw new Error(`Expected ${actual} <= ${num}`);
      }
    },
    not: {
      toBe(expected: any) {
        if (actual === expected) {
          throw new Error(`Expected NOT === ${JSON.stringify(expected)}, but was identical`);
        }
      },
      toEqual(expected: any) {
        if (JSON.stringify(actual) === JSON.stringify(expected)) {
          throw new Error(`Expected NOT equal, but was equal`);
        }
      },
      toContain(sub: string | any) {
        if (typeof actual === 'string' && actual.includes(sub)) {
          throw new Error(`Expected string NOT to contain "${sub}", but it was found!`);
        }
        if (Array.isArray(actual) && actual.includes(sub)) {
          throw new Error(`Expected array NOT to contain element, but it was found!`);
        }
      },
      toMatch(regex: RegExp) {
        if (typeof actual === 'string' && regex.test(actual)) {
          throw new Error(`Expected string NOT to match pattern ${regex}, but it did`);
        }
      },
    },
  };
}

export function printSummaryReport(): { success: boolean; total: number; passed: number; failed: number } {
  const results = registry.results;
  const total = results.length;
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const skipped = results.filter(r => r.status === 'SKIPPED').length;
  const totalDuration = Date.now() - registry.startTime;

  console.log('\n======================================================================');
  console.log('         SMARTCBT PRO - E2E COMPREHENSIVE TEST SUITE SUMMARY          ');
  console.log('======================================================================');

  // Breakdown by Tier
  const tiers = Array.from(new Set(results.map(r => r.tier)));
  console.log('\n--- COVERAGE BY TIER ---');
  for (const tier of tiers) {
    const tierResults = results.filter(r => r.tier === tier);
    const tierPass = tierResults.filter(r => r.status === 'PASS').length;
    const tierFail = tierResults.filter(r => r.status === 'FAIL').length;
    const tierDuration = tierResults.reduce((acc, r) => acc + r.durationMs, 0);
    const passRate = tierResults.length > 0 ? Math.round((tierPass / tierResults.length) * 100) : 0;
    const statusSymbol = tierFail === 0 ? '\x1b[32m✔ PASS\x1b[0m' : '\x1b[31m✖ FAIL\x1b[0m';

    console.log(`  ${tier.padEnd(30)} : ${statusSymbol} (${tierPass}/${tierResults.length} passed, ${passRate}%) [${tierDuration}ms]`);
  }

  // Failures detailed list
  if (failed > 0) {
    console.log('\n--- DETAILED FAILURES (FOR IMPLEMENTATION ESCALATION) ---');
    results
      .filter(r => r.status === 'FAIL')
      .forEach((f, idx) => {
        console.log(`\n  ${idx + 1}. [${f.tier}] ${f.suite} > ${f.name}`);
        console.log(`     \x1b[31m${f.error}\x1b[0m`);
      });
  }

  console.log('\n======================================================================');
  console.log(`Total Tests Run : ${total}`);
  console.log(`Passed          : \x1b[32m${passed}\x1b[0m`);
  console.log(`Failed          : ${failed > 0 ? `\x1b[31m${failed}\x1b[0m` : '0'}`);
  console.log(`Skipped         : ${skipped}`);
  console.log(`Total Duration  : ${totalDuration}ms`);
  console.log(`Overall Status  : ${failed === 0 ? '\x1b[32mALL TESTS PASSED (EXIT 0)\x1b[0m' : '\x1b[31mTESTS FAILED (EXIT 1)\x1b[0m'}`);
  console.log('======================================================================\n');

  return {
    success: failed === 0,
    total,
    passed,
    failed,
  };
}
