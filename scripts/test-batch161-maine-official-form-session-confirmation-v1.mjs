import fs from 'fs';
import path from 'path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch161MaineOfficialFormSessionConfirmationV1 } from './run-batch161-maine-official-form-session-confirmation-v1.mjs';

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

generateBatch161MaineOfficialFormSessionConfirmationV1();

const summary = readJson('data/generated/maine_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/maine_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/maine_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/maine_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/maine_next_action_queue_v2.jsonl');
const educationPacket = readJson('data/generated/maine_district_or_county_education_routing_manual_export_packet_v1.json');
const countyPacket = readJson('data/generated/maine_county_local_disability_resources_mapping_packet_v1.json');
const batchSummary = readJson('data/generated/batch161_maine_official_form_session_confirmation_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/maine-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_live_org_selector_posts_return_500_and_dhhs_office_directory_lacks_county_or_town_mapping');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_live_public_org_selector_with_session_post_500');
assert.match(educationGap.status_reason, /CSRF token/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'official_live_org_selector_and_session_post_return_500');
assert.match(educationFailure.evidence, /OrgId 364/);
assert.match(educationFailure.evidence, /HTTP 500/);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyFailure.evidence, /For Long Term Care questions: see Machias Office/);
assert.match(countyFailure.evidence, /does not expose county labels, town lists, or service-area boundaries/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'blocked_live_public_org_selector_with_session_post_500');
assert.equal(educationVerified.blocker_code, 'official_live_org_selector_and_session_post_return_500');

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'use_live_public_org_selector_packet_for_reviewed_browser_capture_or_manual_export');

assert.equal(educationPacket.current_problem_metrics.publicOrgSelectorEmbedded, true);
assert.equal(educationPacket.current_problem_metrics.csrfTokenExposed, true);
assert.equal(educationPacket.current_problem_metrics.sessionedPost500Confirmed, true);
assert.equal(educationPacket.current_problem_metrics.sessionedOrgIdTested, 364);
assert.equal(countyPacket.current_problem_metrics.districtOfficeCountyLabelsVisible, false);
assert.equal(countyPacket.current_problem_metrics.districtOfficeTownLookupVisible, false);
assert.equal(countyPacket.current_problem_metrics.programCrossOfficeNotesVisible, true);

assert.equal(batchSummary.education_blocker_sharpened, true);
assert.equal(batchSummary.county_blocker_sharpened, true);
assert.match(report, /sessioned submit against the real form still returns HTTP 500/i);
assert.match(report, /office-grade and program-aware/i);
assert.match(lessons, /Public Org Selectors And Program Cross-Office Notes Still Do Not Equal County-Grade Coverage/);

console.log('test-batch161-maine-official-form-session-confirmation-v1: ok');
