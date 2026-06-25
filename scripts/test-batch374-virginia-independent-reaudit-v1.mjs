import assert from 'assert';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generateBatch374VirginiaIndependentReauditV1 } from './run-batch374-virginia-independent-reaudit-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const evidencePath = path.join(repoRoot, 'data', 'generated', 'virginia_independent_reaudit_evidence_v1.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));

function fetchText(url) {
  return execFileSync('curl', ['-sS', '-L', '--max-time', '20', url], {
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  });
}

function parseCountySectionCount(html) {
  const match = html.match(/<h3 class="wp-block-heading">Counties<\/h3>([\s\S]*?)<h3 class="wp-block-heading">Cities<\/h3>/i);
  assert(match, 'Expected counties section on ITCVA central directory page.');
  return [...match[1].matchAll(/target="_blank" rel="noreferrer noopener">([^<]+)/g)].length;
}

const { summary, batchSummary } = generateBatch374VirginiaIndependentReauditV1();

assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.major_gap_families, []);
assert.equal(summary.complete_ready, true);
assert.equal(summary.final_blockers, null);
assert.deepEqual(batchSummary.browser_reviewed_families.sort(), ['special_education_idea_part_b', 'vocational_rehabilitation_pre_ets']);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'virginia_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const gapRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'virginia_gap_matrix_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

for (const familyEvidence of evidence.families.filter((row) => row.critical)) {
  const verifiedRow = verifiedRows.find((row) => row.family === familyEvidence.family);
  assert(verifiedRow, `Missing verified row for ${familyEvidence.family}`);
  assert.equal(verifiedRow.family_status, 'verified_state_grade');
  assert.equal(verifiedRow.samples.length, familyEvidence.samples.length);
  const gapRow = gapRows.find((row) => row.family === familyEvidence.family);
  assert(gapRow, `Missing gap row for ${familyEvidence.family}`);
  assert.equal(gapRow.family_status, 'verified_state_grade');
  assert.equal(gapRow.status_reason, familyEvidence.status_reason);
}

for (const familyEvidence of evidence.families) {
  if (familyEvidence.review_mode === 'browser_reviewed') {
    const sample = familyEvidence.samples[0];
    assert(sample.review_date, `${familyEvidence.family} is missing review_date`);
    assert(sample.source_url.startsWith('https://'), `${familyEvidence.family} is missing an https source`);
    assert(sample.evidence_snippet.length > 30, `${familyEvidence.family} browser-reviewed snippet is too short`);
    continue;
  }

  const testConfig = familyEvidence.test;
  if (testConfig.url) {
    const html = fetchText(testConfig.url);
    for (const snippet of testConfig.must_include) {
      assert(html.includes(snippet), `Expected ${familyEvidence.family} source ${testConfig.url} to include: ${snippet}`);
    }
    if (familyEvidence.family === 'county_local_disability_resources') {
      assert(html.includes('Results 1 - 10                            of 121') || html.includes('Results 1 - 10 of 121'));
    }
    if (familyEvidence.family === 'district_or_county_education_routing') {
      assert(html.includes('Showing 1 to 30 of 133 results'));
    }
    continue;
  }

  if (testConfig.urls) {
    for (const page of testConfig.urls) {
      const html = fetchText(page.url);
      for (const snippet of page.must_include) {
        assert(html.includes(snippet), `Expected ${familyEvidence.family} source ${page.url} to include: ${snippet}`);
      }
      if (familyEvidence.family === 'early_intervention_part_c' && page.url.endsWith('/central-directory/')) {
        assert(parseCountySectionCount(html) >= testConfig.minimum_county_links);
      }
      if (familyEvidence.family === 'early_intervention_part_c' && page.url.endsWith('/local-system-managers/')) {
        const matchCount = [...html.matchAll(/Counties &amp; Cities — /g)].length;
        assert.equal(matchCount, testConfig.expected_local_system_manager_count);
      }
    }
  }
}

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'virginia-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Virginia remains `COMPLETE` and `index_safe=true` after an independent re-audit of all 12 critical families\./);
assert.match(report, /fake `dhhs\.virginia\.gov` placeholders/);
assert.match(report, /browser-reviewed official exceptions/);

console.log('test-batch374-virginia-independent-reaudit-v1: ok');
