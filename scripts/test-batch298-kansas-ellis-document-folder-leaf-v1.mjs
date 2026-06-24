import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch298KansasEllisDocumentFolderLeafV1 } from './run-batch298-kansas-ellis-document-folder-leaf-v1.mjs';

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

const result = generateBatch298KansasEllisDocumentFolderLeafV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const leaves = readJsonl('data/generated/kansas_reviewed_district_owned_special_education_leaves_v1.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch298_kansas_ellis_document_folder_leaf_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch298-kansas-ellis-document-folder-leaf-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'reviewed_kansas_district_and_district_owned_leaves_now_cover_16_counties_but_export_backed_county_grade_coverage_is_still_incomplete');

const gapRow = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gapRow.family_status, 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade');
assert.match(gapRow.status_reason, /16\/105 counties/);
assert.match(gapRow.status_reason, /Abilene USD 435/);

assert.equal(failureRows.length, 1);
assert.equal(failureRows[0].failure_code, 'reviewed_kansas_district_and_district_owned_leaves_now_cover_16_counties_but_export_backed_county_grade_coverage_is_still_incomplete');
assert.match(failureRows[0].evidence, /Hays USD 489 sitemap/);
assert.match(failureRows[0].evidence, /WEBKIDSS Handbook/);
assert.match(failureRows[0].evidence, /SPED Resources/);

const verifiedRow = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(verifiedRow.query_basis, /document-folder route/);
assert.match(verifiedRow.blocker_evidence, /district-owned document-folder route/);
assert.ok(verifiedRow.samples.some((sample) => sample.sample_name === 'ellis district-owned leaf'));
const ellis = verifiedRow.samples.find((sample) => sample.sample_name === 'ellis district-owned leaf');
assert.equal(ellis.source_url, 'https://www.usd489.com/documents/about-usd-489/special-education/81796');
assert.match(ellis.evidence_snippet, /WEBKIDSS Handbook/);

assert.equal(nextRows.length, 1);
assert.match(nextRows[0].evidence, /Ellis now clears/);

assert.equal(packet.current_problem_metrics.authoredExactLeafCount, 16);
assert.equal(packet.current_problem_metrics.reviewedDistrictOwnedLeafCount, 16);
assert.ok(packet.reviewed_local_leaf_counties.includes('ellis-ks'));
assert.equal(leaves.length, 16);
assert.ok(leaves.some((row) => row.county_id === 'ellis-ks' && row.source_url === 'https://www.usd489.com/documents/about-usd-489/special-education/81796'));

const kansasQueue = queueRows.find((row) => row.state === 'kansas');
assert.equal(kansasQueue.primary_gap_reason, 'reviewed_kansas_district_and_district_owned_leaves_now_cover_16_counties_but_export_backed_county_grade_coverage_is_still_incomplete');

const kansasAudit = allStateAudit.states.find((row) => row.stateId === 'kansas');
assert.equal(kansasAudit.packetBatch, 'batch298_kansas_ellis_document_folder_leaf_v1');
assert.equal(kansasAudit.packetPrimaryGapReason, 'reviewed_kansas_district_and_district_owned_leaves_now_cover_16_counties_but_export_backed_county_grade_coverage_is_still_incomplete');

assert.ok(stateReport.includes('Ellis now clears from a district-owned Hays USD 489 Special Education document-folder route'));
assert.ok(handoff.includes('## Current Focus State: Kansas'));
assert.ok(handoff.includes('https://www.usd489.com/documents/about-usd-489/special-education/81796'));
assert.ok(handoff.includes('## Next State Order After Kansas'));
assert.ok(!handoff.includes('10. Maine10. Maine10. Maine'));
assert.ok(allStateReport.includes('Kansas education routing is now explicitly sharpened to 16 reviewed counties'));
assert.ok(lessons.includes('### District-Owned Document Folders Can Preserve Role-Exact Routing Even When The Page Title Is Generic'));
assert.equal(batchSummary.newly_verified_county, 'ellis-ks');
assert.equal(batchSummary.reviewed_leaf_count, 16);
assert.ok(batchReport.includes('Ellis now clears from the district-owned Hays USD 489 Special Education document-folder route'));

console.log('test-batch298-kansas-ellis-document-folder-leaf-v1: ok');
