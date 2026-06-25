import assert from 'assert';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generateBatch375WestVirginiaIndependentReauditV1 } from './run-batch375-west-virginia-independent-reaudit-v1.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const evidencePath = path.join(repoRoot, 'data', 'generated', 'west_virginia_independent_reaudit_evidence_v1.json');
const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));

function fetchText(url) {
  return execFileSync('curl', ['-sS', '-L', '--max-time', '20', url], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
}

function fetchHead(url) {
  return execFileSync('curl', ['-sSI', '--max-time', '20', url], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  });
}

const { summary, batchSummary } = generateBatch375WestVirginiaIndependentReauditV1();

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 92);
assert.equal(summary.strong_critical_families, 11);
assert.equal(summary.missing_critical_families, 1);
assert.deepEqual(summary.critical_gap_families, ['parent_training_information_center']);
assert.equal(summary.complete_ready, false);
assert.equal(batchSummary.blocker_family, 'parent_training_information_center');

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'west-virginia_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const gapRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'west-virginia_gap_matrix_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const failureRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'west-virginia_failure_ledger_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const nextRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'west-virginia_next_action_queue_v2.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

for (const familyEvidence of evidence.families) {
  const verifiedRow = verifiedRows.find((row) => row.family === familyEvidence.family);
  assert(verifiedRow, `Missing verified row for ${familyEvidence.family}`);
  const gapRow = gapRows.find((row) => row.family === familyEvidence.family);
  assert(gapRow, `Missing gap row for ${familyEvidence.family}`);

  if (familyEvidence.family === 'parent_training_information_center') {
    assert.equal(verifiedRow.family_status, 'blocked_first_party_pti_domain_redirects_unrelated');
    assert.equal(gapRow.family_status, 'blocked_first_party_pti_domain_redirects_unrelated');
  } else {
    assert.equal(verifiedRow.family_status, 'verified_state_grade');
    assert.equal(gapRow.family_status, 'verified_state_grade');
  }
}

for (const familyEvidence of evidence.families) {
  if (familyEvidence.review_mode === 'browser_reviewed') {
    const sample = familyEvidence.samples[0];
    assert(sample.review_date, `${familyEvidence.family} missing review_date`);
    assert(sample.evidence_snippet.length > 40, `${familyEvidence.family} browser-reviewed snippet too short`);
    continue;
  }

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
    continue;
  }

  if (familyEvidence.test.head_url) {
    const headers = fetchHead(familyEvidence.test.head_url);
    for (const snippet of familyEvidence.test.must_include) {
      assert(headers.includes(snippet), `Expected ${familyEvidence.family} head ${familyEvidence.test.head_url} to include: ${snippet}`);
    }
  }
}

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].family, 'parent_training_information_center');
assert.equal(failureRows[0].failure_code, 'legacy_wvpti_domain_redirects_unrelated_and_no_current_first_party_pti_designation_preserved');
assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'parent_training_information_center');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'west-virginia-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /The single remaining critical blocker is `parent_training_information_center`/);
assert.match(report, /old `wvpti\.org` first-party domain now returns HTTP 301 to an unrelated body-shop site/);
assert.match(report, /must be frozen back to `BLOCKED`/);

console.log('test-batch375-west-virginia-independent-reaudit-v1: ok');
