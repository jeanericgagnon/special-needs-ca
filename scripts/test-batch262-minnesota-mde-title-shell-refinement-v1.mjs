import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch262MinnesotaMdeTitleShellRefinementV1 } from './run-batch262-minnesota-mde-title-shell-refinement-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch262MinnesotaMdeTitleShellRefinementV1();
const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/minnesota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/minnesota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch262_minnesota_mde_title_shell_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged');
assert.equal(summary.final_blockers[0].failure_code, 'official_mdeorg_root_is_live_but_child_routes_and_analytics_are_title_only_radware_shells');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_mdeorg_root_live_but_actionable_child_routes_are_title_only_radware_shells');
assert.match(gap.status_reason, /description page and root are live/i);
assert.match(gap.status_reason, /title-bearing Radware shells/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'official_mdeorg_root_is_live_but_child_routes_and_analytics_are_title_only_radware_shells');
assert.match(failure.evidence, /MDE Organization Reference Glossary/i);
assert.match(failure.evidence, /Schools and Districts/i);
assert.match(failure.evidence, /Minnesota Counties/i);
assert.match(failure.evidence, /Data Reports and Analytics/i);
assert.match(failure.evidence, /title-bearing challenge shell/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_mdeorg_root_live_but_actionable_child_routes_are_title_only_radware_shells');
assert.equal(verified.blocker_code, 'official_mdeorg_root_is_live_but_child_routes_and_analytics_are_title_only_radware_shells');
assert.match(verified.query_basis, /description page and root plus exact district, county, contact, and analytics child routes/i);

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.failure_code, 'official_mdeorg_root_is_live_but_child_routes_and_analytics_are_title_only_radware_shells');
assert.equal(next.next_action, 'hold_blocked_until_reviewed_first_party_mdeorg_child_route_capture_or_stable_export_contract_exists');

assert.equal(batchSummary.live_mde_description_page, true);
assert.equal(batchSummary.live_mde_root, true);
assert.equal(batchSummary.actionable_mde_child_routes_still_title_only_shells, true);
assert.ok(report.includes('parent_training_information_center is verified at statewide grade and is not a remaining blocker'));
assert.ok(handoff.includes('## Current Focus State: Minnesota'));
assert.ok(handoff.includes('mdeorg_root_is_live_but_actionable_child_routes_are_title_only_radware_shells_plus_mn_dhs_local_office_family_is_radware_challenged'));
assert.ok(lessons.includes('### A Live Official Root Can Still Fail If Every Actionable Child Route Is Only A Title-Bearing Challenge Shell'));

console.log('test-batch262-minnesota-mde-title-shell-refinement-v1: ok');
