import { spawnSync } from 'node:child_process';

const mode = process.argv[2] || 'audit';

const suites = {
  audit: [
    'audit:launch-scrape-link-inventory',
    'audit:launch-scraper-contract',
    'audit:launch-scraper-field-contract',
    'audit:launch-scraper-fixture-matrix',
    'audit:launch-scraper-false-positive-taxonomy',
    'audit:launch-scraper-queue-false-positive-risk',
    'audit:launch-scraper-runbook',
    'audit:launch-scraper-artifact-contract',
    'audit:launch-scraper-provenance-contract',
    'audit:launch-scraper-queue-governance',
    'audit:launch-scraper-lifecycle-contract',
    'audit:launch-scraper-staging-support-matrix',
    'audit:launch-scraper-qa-pack',
    'audit:launch-scraper-fixture-coverage-audit',
    'audit:launch-scraper-negative-fixture-plan',
    'audit:launch-scraper-negative-fixture-capture-packet',
    'audit:launch-scraper-negative-fixture-closure-status',
    'audit:launch-scraper-readiness-board',
    'audit:launch-scraper-gap-registry',
    'audit:launch-scraper-meta-audit',
  ],
  test: [
    'test:launch-scrape-link-inventory',
    'test:launch-scraper-contract',
    'test:launch-scraper-field-contract',
    'test:launch-scraper-fixture-matrix',
    'test:launch-scraper-false-positive-taxonomy',
    'test:launch-scraper-queue-false-positive-risk',
    'test:launch-scraper-runbook',
    'test:launch-scraper-artifact-contract',
    'test:launch-scraper-provenance-contract',
    'test:launch-scraper-queue-governance',
    'test:launch-scraper-lifecycle-contract',
    'test:launch-scraper-staging-support-matrix',
    'test:launch-scraper-qa-pack',
    'test:launch-scraper-fixture-coverage-audit',
    'test:launch-scraper-negative-fixture-plan',
    'test:launch-scraper-negative-fixture-capture-packet',
    'test:launch-scraper-negative-fixture-closure-status',
    'test:launch-scraper-readiness-board',
    'test:launch-scraper-gap-registry',
    'test:launch-scraper-real-fixtures',
    'test:launch-scraper-meta-audit',
  ],
};

if (!suites[mode]) {
  throw new Error(`Unknown launch scraper suite mode "${mode}". Use "audit" or "test".`);
}

for (const scriptName of suites[mode]) {
  const result = spawnSync('npm', ['run', scriptName], {
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log(`launch scraper suite ${mode} passed`);
