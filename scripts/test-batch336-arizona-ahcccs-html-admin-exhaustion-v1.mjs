import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch336ArizonaAhcccsHtmlAdminExhaustionV1 } from './run-batch336-arizona-ahcccs-html-admin-exhaustion-v1.mjs';

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

const result = generateBatch336ArizonaAhcccsHtmlAdminExhaustionV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const batchSummary = readJson('data/generated/batch336_arizona_ahcccs_html_admin_exhaustion_summary_v1.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_ahcccs_html_lane_replays_only_pdf_admin_artifacts_without_county_contract');
assert.match(countyGap.status_reason, /UniversityFamilyCare oversight page is live and reviewable/i);
assert.match(countyGap.status_reason, /PimaCountyAdmin\.pdf/i);
assert.match(countyGap.status_reason, /CountyAdminOffice\.pdf/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'ahcccs_university_familycare_html_page_replays_only_pdf_admin_artifacts_without_html_county_contract');
assert.match(countyFailure.evidence, /UniversityFamilyCare\.html/i);
assert.match(countyFailure.evidence, /PimaCountyAdmin\.pdf/i);
assert.match(countyFailure.evidence, /CountyAdminOffice\.pdf/i);
assert.match(countyFailure.evidence, /pypdf, PyPDF2, pdfplumber, fitz, pdfminer, PIL, and pdf2image/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_ahcccs_html_lane_replays_only_pdf_admin_artifacts_without_county_contract');
assert.equal(countyVerified.sample_count, 4);
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html'));
assert.ok(countyVerified.samples.some((sample) => /Pima County Administrator PDF/i.test(sample.sample_name)));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(next.next_action, 'keep_county_local_blocked_until_committed_ocr_artifact_or_new_official_html_county_admin_surface_exists');

const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.primary_gap_reason, 'ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves');

const allStateRow = allStateAudit.states.find((row) => row.stateId === 'arizona');
assert.equal(allStateRow.packetBatch, 'batch336_arizona_ahcccs_html_admin_exhaustion_v1');
assert.equal(allStateRow.packetPrimaryGapReason, 'ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves');
assert.equal(allStateRow.familyStatuses.county_local_disability_resources, 'blocked_ahcccs_html_lane_replays_only_pdf_admin_artifacts_without_county_contract');

assert.equal(batchSummary.html_admin_lane_live, true);
assert.equal(batchSummary.html_admin_lane_replays_only_pdf_artifacts, true);
assert.equal(batchSummary.linked_pdf_artifacts.length, 3);

assert.match(stateReport, /official AHCCCS HTML oversight lane is public, but it only replays the same PDF county-admin artifacts/i);
assert.match(allStateReport, /Arizona remains blocked on a sharper county-local truth/i);
assert.ok(handoff.includes('## Current Focus State: Arizona'));
assert.ok(handoff.includes('ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves'));
assert.ok(lessons.includes('### Treat Official HTML Pages That Only Replay PDFs As Exhausted'));

console.log('test-batch336-arizona-ahcccs-html-admin-exhaustion-v1: ok');
