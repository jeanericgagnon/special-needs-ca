import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

const result = spawnSync(process.execPath, ['src/db/generate_launch_scraper_meta_audit.js'], {
  cwd: repoRoot,
  env: {
    ...process.env,
    ABLEFULL_REPO_ROOT: repoRoot,
  },
  encoding: 'utf8',
});

if (result.status !== 0) {
  throw new Error(`launch scraper meta audit failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
}

const jsonPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-meta-audit-${generatedDate}.json`);
const mdPath = path.join(repoRoot, 'docs', 'generated', `launch-scraper-meta-audit-${generatedDate}.md`);

assert.ok(fs.existsSync(jsonPath));
assert.ok(fs.existsSync(mdPath));

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const markdown = fs.readFileSync(mdPath, 'utf8');

assert.equal(payload.canonicalFamilies.length, 9);
assert.ok(Array.isArray(payload.checks));
assert.ok(payload.checks.length >= 10);
assert.equal(payload.failedCheckCount, 0);
assert.equal(payload.overallPassed, true);
assert.ok(payload.checks.some((check) => check.id === 'field_contract_family_match' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'lifecycle_contract_family_match' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'staging_support_family_match' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'readiness_board_family_match' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'gap_registry_subset_valid' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'false_positive_taxonomy_covers_launch_families' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'qa_pack_has_real_cases' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'false_positive_taxonomy_has_real_examples' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'readiness_board_matches_fixture_coverage' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'negative_fixture_packet_matches_plan' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'negative_fixture_packet_has_commands' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'negative_fixture_closure_tracks_open_rows' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'lifecycle_contract_has_resume_guarantees' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'staging_support_has_full_launch_family_coverage' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'readiness_board_flags_known_spec_gaps' && check.passed));
assert.ok(payload.checks.some((check) => check.id === 'gap_registry_row_count_matches_known_gaps' && check.passed));
assert.match(markdown, /# Launch Scraper Meta Audit/);
assert.match(markdown, /overallPassed: true/);
assert.match(markdown, /## Checks/);

console.log('launch scraper meta audit tests passed');
