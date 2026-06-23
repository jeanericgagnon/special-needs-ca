import fs from 'fs';
import path from 'path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch164MinnesotaMovedShellAndRadwarePatternV1 } from './run-batch164-minnesota-moved-shell-and-radware-pattern-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

generateBatch164MinnesotaMovedShellAndRadwarePatternV1();

const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/minnesota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/minnesota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch164_minnesota_moved_shell_and_radware_pattern_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_mde_directory_family_now_only_resolves_to_moved_shell_or_dead_guesses_and_mn_dhs_local_office_family_is_stale_or_radware_challenged');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_official_mde_directory_family_moved_without_live_replacement');
assert.match(eduGap.status_reason, /`\/MDE\/SchSup\/` and `\/MDE\/SchSup\/SchDir\/` only 302 into the generic `SchSupHasMoved\.html` shell/i);
assert.match(eduGap.status_reason, /404/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_mn_dhs_replatform_family_stale_or_radware_challenged');
assert.match(countyGap.status_reason, /old `\.jsp` county-and-tribal-offices path is simply stale 404/i);
assert.match(countyGap.status_reason, /302 into the same Radware validation host/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'official_school_directory_family_only_returns_moved_shell_or_dead_guesses');
assert.match(eduFailure.evidence, /SchSupHasMoved\.html/);
assert.match(eduFailure.evidence, /MDEpages\/Directories\/ and .*about\/adv\/dirs\/ return HTTP 404/i);
assert.match(eduFailure.evidence, /Analytics\/ timed out/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'minnesota_dhs_local_office_family_is_stale_jsp_plus_radware_replatform');
assert.match(countyFailure.evidence, /county-and-tribal-offices\.jsp path now returns HTTP 404/i);
assert.match(countyFailure.evidence, /validate\.perfdrive\.com/i);
assert.match(countyFailure.evidence, /county-tribal-nation-directory/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.blocker_code, 'official_school_directory_family_only_returns_moved_shell_or_dead_guesses');
assert.match(eduVerified.query_basis, /bounded MDE moved-shell roots plus a small set of guessed replacement directory roots/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'minnesota_dhs_local_office_family_is_stale_jsp_plus_radware_replatform');
assert.match(countyVerified.query_basis, /bounded DHS county\/tribal office family variants/i);

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'hold_blocked_until_live_official_mde_directory_replacement_or_county_mapped_contract_is_reviewed');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'browser_assisted_or_cached_capture_only_for_replatformed_mn_dhs_county_tribal_family');

assert.equal(batchSummary.education_blocker_sharpened, true);
assert.equal(batchSummary.county_blocker_sharpened, true);
assert.match(report, /moved-shell and dead-guess patterns/i);
assert.match(report, /stale-legacy plus Radware-replatform pattern/i);
assert.match(lessons, /Mixed 404-Legacy And Bot-Challenged Replatforms Should Become One Family-Level Blocker Pattern/);

console.log('test-batch164-minnesota-moved-shell-and-radware-pattern-v1: ok');
