import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch314NebraskaExportFormatFinalityV1 } from './run-batch314-nebraska-export-format-finality-v1.mjs';

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

const result = generateBatch314NebraskaExportFormatFinalityV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch314_nebraska_export_format_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch314-nebraska-export-format-finality-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_public_office_feature_service_supports_export_formats_but_schema_and_distinct_county_values_still_expose_no_statewide_assignment_contract');

const gap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(gap);
assert.equal(gap.family_status, 'blocked_public_office_service_exportable_but_without_assignment_contract');
assert.match(gap.status_reason, /supportedExportFormats/i);
assert.match(gap.status_reason, /37 county names/i);

const failure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(failure);
assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /supportedExportFormats: sqlite,filegdb,shapefile,csv,geojson/i);
assert.match(failure.evidence, /only 37 county values/i);

const verified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(verified);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska public FeatureServer export formats'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska distinct county query remains partial'));

const next = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.ok(next);
assert.equal(next.next_action, 'hold_blocked_until_official_service_area_table_county_assignment_artifact_or_new_public_resource_is_published');

const queue = queueRows.find((row) => row.state === 'nebraska');
assert.ok(queue);
assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

const neAudit = allStateAudit.states.find((row) => row.stateId === 'nebraska');
assert.ok(neAudit);
assert.equal(neAudit.packetBatch, 'batch314_nebraska_export_format_finality_v1');
assert.equal(neAudit.packetPrimaryGapReason, summary.primary_gap_reason);

assert.deepEqual(batchSummary.supported_export_formats, ['sqlite', 'filegdb', 'shapefile', 'csv', 'geojson']);
assert.equal(batchSummary.distinct_county_values, 37);
assert.equal(batchSummary.multi_county_strings_present, false);

assert.match(stateReport, /exportable, but its schema still has no assignment fields/i);
assert.match(handoff, /Current Focus State: Nebraska/);
assert.match(handoff, /export formats including CSV, GeoJSON, shapefile, and FileGDB/i);
assert.match(lessons, /### Exportable ArcGIS Layers Still Fail If The Exportable Fields Lack Assignment Semantics/);
assert.match(allStateReport, /Nebraska county-local routing is now frozen even past the export theory/i);
assert.match(batchReport, /public FeatureServer root is live and advertises export formats/i);

const completeCount = allStateAudit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = allStateAudit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 24);
assert.equal(blockedCount, 26);

console.log('test-batch314-nebraska-export-format-finality-v1: ok');
