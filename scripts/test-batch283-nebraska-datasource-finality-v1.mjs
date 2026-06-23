import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch283NebraskaDatasourceFinalityV1 } from './run-batch283-nebraska-datasource-finality-v1.mjs';

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

const result = generateBatch283NebraskaDatasourceFinalityV1();
assert.equal(result.classification, 'BLOCKED');
assert.equal(result.datasource_registry_only_has_locator_outputs, true);

const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_public_office_service_root_has_no_tables_and_office_schema_has_no_service_area_fields');
assert.equal(summary.final_blockers[0].failure_code, 'official_public_office_service_root_has_no_tables_no_relationships_and_webmap_datasources_only_materialize_locator_outputs');
assert.match(summary.final_blockers[0].evidence, /ExperienceBuilder datasource registry/);

const gapRows = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl');
const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_public_office_service_root_without_assignment_contract');
assert.match(countyGap.status_reason, /shared web map .* two widget outputs/i);

const failureRows = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_public_office_service_root_has_no_tables_no_relationships_and_webmap_datasources_only_materialize_locator_outputs');
assert.match(countyFailure.evidence, /closest feature\)` widget output|Closest Feature/i);

const verifiedRows = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_public_office_service_root_without_assignment_contract');
assert.ok(countyVerified.samples.some((sample) => sample.sample_name === 'Nebraska ExperienceBuilder datasource registry'));
assert.match(countyVerified.blocker_evidence, /ArcGIS World Geocoding Service/);

const nextRows = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl');
const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_official_service_area_table_or_county_assignment_artifact_exists');
assert.match(countyNext.evidence, /web map .* county boundary layer/i);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nebraska-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /ExperienceBuilder datasource registry proves the office app still materializes only a web map plus locator outputs/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /## Current Focus State: Nebraska/);
assert.doesNotMatch(handoff, /## Current Focus State: Kansas/);
assert.match(handoff, /## Next State Order After Nebraska/);
assert.doesNotMatch(handoff, /10\. Minnesota10\. Minnesota/);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /ExperienceBuilder Datasource Registries Can Prove There Is No Hidden Public County Contract/);

console.log('test-batch283-nebraska-datasource-finality-v1: ok');
