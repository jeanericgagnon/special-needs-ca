import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch207KansasPublicExportContractRefinementV1 } from './run-batch207-kansas-public-export-contract-refinement-v1.mjs';

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

const result = generateBatch207KansasPublicExportContractRefinementV1();
const summary = readJson('data/generated/kansas_california_grade_summary_v2.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const gapRows = readJsonl('data/generated/kansas_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/kansas_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/kansas_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/kansas_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const batchSummary = readJson('data/generated/batch207_kansas_public_export_contract_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/kansas-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'public_ksde_directory_export_contract_exists_but_not_yet_converted_into_reviewed_district_owned_special_education_leaves');
assert.equal(queueRows.find((row) => row.state === 'kansas').primary_gap_reason, 'public_ksde_directory_export_contract_exists_but_not_yet_converted_into_reviewed_district_owned_special_education_leaves');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_public_ksde_export_contract_without_reviewed_local_leaves');
assert.match(gap.status_reason, /Directory\.xls/i);
assert.match(gap.status_reason, /County Name/i);
assert.match(gap.status_reason, /dsprinkle@abileneschools\.org/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'public_ksde_directory_export_contract_exists_but_not_yet_converted_into_reviewed_district_owned_special_education_leaves');
assert.match(failure.evidence, /application\/vnd\.ms-excel/i);
assert.match(failure.evidence, /ctl00\$MainContent\$ddDistricts=D0435/i);
assert.match(failure.evidence, /Abilene/i);
assert.match(failure.evidence, /Dickinson/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_public_ksde_export_contract_without_reviewed_local_leaves');
assert.equal(verified.sample_count, 5);
assert.ok(verified.samples.some((sample) => /Directory\.xls/.test(sample.evidence_snippet)));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'use_public_directory_export_county_join_and_directory_artifacts_to_author_reviewed_district_owned_special_education_leaves');

assert.equal(packet.repair_lane, 'public_export_backed_district_leaf_repair');
assert.equal(packet.current_problem_metrics.publicExportContractVerified, true);
assert.ok(packet.root_domains_to_review[0].includes('KSDE Directory Reports export contract'));

assert.equal(batchSummary.public_export_contract_verified, true);
assert.equal(batchSummary.sample_export_district, 'D0435 Abilene USD 435');
assert.ok(report.includes('returns a real district export with county and district contact fields'));
assert.ok(lessons.includes('### Public ASP.NET Directory Exports Beat Dropdown Scraping When The Submit Contract Is Stable'));

console.log('test-batch207-kansas-public-export-contract-refinement-v1: ok');
