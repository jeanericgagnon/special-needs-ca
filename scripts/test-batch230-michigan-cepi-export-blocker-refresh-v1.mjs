import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch230MichiganCepiExportBlockerRefreshV1 } from './run-batch230-michigan-cepi-export-blocker-refresh-v1.mjs';

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

const result = generateBatch230MichiganCepiExportBlockerRefreshV1();
const summary = readJson('data/generated/michigan_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/michigan_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/michigan_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/michigan_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/michigan_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/michigan_district_or_county_education_routing_arcgis_contract_packet_v1.json');
const batchSummary = readJson('data/generated/batch230_michigan_cepi_export_blocker_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/michigan-california-grade-audit-report-v2.md'), 'utf8');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch230-michigan-cepi-export-blocker-refresh-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'official_mde_layers_lack_local_routing_fields_and_cepi_public_dataset_export_500s');
assert.equal(summary.index_safe, false);

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_mde_layers_without_local_routing_fields_and_cepi_export_postback_500s');
assert.match(gap.status_reason, /CEPI Educational Entity Master Public Data Sets page/i);
assert.match(gap.status_reason, /viewstate MAC failed/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'official_mde_layers_lack_local_routing_contract_and_cepi_public_dataset_export_500s');
assert.match(failure.evidence, /PublicDatasets\.aspx/i);
assert.match(failure.evidence, /HTTP 500/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_mde_layers_without_local_routing_fields_and_cepi_export_postback_500s');
assert.equal(verified.sample_count, 7);
assert.ok(verified.samples.some((sample) => /CEPI Public Data Sets/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /viewstate MAC failed/i.test(sample.evidence_snippet)));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'hold_blocked_until_official_isd_or_district_contact_directory_or_stable_cepi_export_exists');

assert.equal(packet.current_problem_metrics.cepiPublicDatasetsPageLive, true);
assert.equal(packet.current_problem_metrics.cepiExactDatasetPostbackStable, false);
assert.deepEqual(packet.public_dataset_contract.entity_types_reviewed, ['ISD District', 'LEA District']);
assert.equal(packet.public_dataset_contract.exact_postback_status, 'http_500_viewstate_mac_failed');

assert.equal(batchSummary.cepi_public_datasets_page_live, true);
assert.equal(batchSummary.cepi_exact_dataset_postback_stable, false);
assert.ok(report.includes('viewstate MAC error'));
assert.ok(batchReport.includes('Validation of viewstate MAC failed'));
assert.ok(lessons.includes('### Public ASP.NET Dataset Forms Can Be Real But Still Export-Blocked'));

console.log('test-batch230-michigan-cepi-export-blocker-refresh-v1: ok');
