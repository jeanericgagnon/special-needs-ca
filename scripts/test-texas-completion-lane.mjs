import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const manifestRows = readJsonl(path.join(repoRoot, 'data/source_targets/tx_role_target_manifest_v1.jsonl'));
const countyBaselineRows = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v1.jsonl'));
const verificationSummary = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v1.json'));
const programSourceRows = readJsonl(path.join(repoRoot, 'data/generated/tx_official_program_source_pack_v1.jsonl'));

assert.ok(manifestRows.length >= 20, 'Texas role target manifest should contain the reviewed Texas source families.');
assert.equal(countyBaselineRows.length, 254, 'Texas county baseline must contain exactly 254 counties.');
assert.equal(verificationSummary.total_counties, 254, 'Verification summary must report all 254 Texas counties.');

const passRows = countyBaselineRows.filter((row) => row.verification_status === 'pass');
for (const row of passRows) {
  assert.ok(Array.isArray(row.source_urls) && row.source_urls.length > 0, `PASS county ${row.county_slug} must have source URLs.`);
  assert.ok(row.lidda_routing, `PASS county ${row.county_slug} must have LIDDA routing.`);
  assert.ok(row.eci_routing || row.missing_roles.includes('ECI routing') === false, `PASS county ${row.county_slug} must have ECI routing or explicit fallback.`);
}

for (const row of programSourceRows) {
  assert.ok(row.source_url, `Program source row ${row.role_id} must keep source_url.`);
  assert.ok(row.final_url, `Program source row ${row.role_id} must keep final_url.`);
  assert.ok(row.evidence_snippet, `Program source row ${row.role_id} must keep evidence_snippet.`);
  assert.equal(row.verification_status, 'verified', `Program source row ${row.role_id} should only be marked verified with evidence.`);
}

console.log('test-texas-completion-lane: ok');
