import assert from 'assert';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generateBatch376TennesseeIndependentReauditV1 } from './run-batch376-tennessee-independent-reaudit-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const evidencePath = path.join(repoRoot, 'data', 'generated', 'tennessee_independent_reaudit_evidence_v1.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));

function fetchText(url) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return execFileSync('curl', ['-sS', '-L', '--http1.1', '--max-time', '30', url], {
        encoding: 'utf8',
        maxBuffer: 16 * 1024 * 1024,
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

const { summary, batchSummary } = generateBatch376TennesseeIndependentReauditV1();

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
assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.index_safe, true);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'tennessee_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const gapRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'tennessee_gap_matrix_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const failureText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'tennessee_failure_ledger_v2.jsonl'), 'utf8');
const nextText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'tennessee_next_action_queue_v2.jsonl'), 'utf8');

for (const familyEvidence of evidence.families) {
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
  if (familyEvidence.test.url) {
    const html = fetchText(familyEvidence.test.url);
    for (const snippet of familyEvidence.test.must_include) {
      assert(html.includes(snippet), `Expected ${familyEvidence.family} source ${familyEvidence.test.url} to include: ${snippet}`);
    }
    continue;
  }

  if (familyEvidence.test.urls) {
    for (const page of familyEvidence.test.urls) {
      const html = fetchText(page.url);
      for (const snippet of page.must_include) {
        assert(html.includes(snippet), `Expected ${familyEvidence.family} source ${page.url} to include: ${snippet}`);
      }
    }
  }
}

assert.equal(failureText, '');
assert.equal(nextText, '');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'tennessee-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Tennessee remains `COMPLETE` and `index_safe=true` after an independent re-audit of all 12 critical families\./);
assert.match(report, /fake `dhhs\.tennessee\.gov` placeholders/);
assert.match(report, /dead 404 special-education URL/);

console.log('test-batch376-tennessee-independent-reaudit-v1: ok');
