import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch191MichiganArcgisFieldContractAuditV1 } from './run-batch191-michigan-arcgis-field-contract-audit-v1.mjs';

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

generateBatch191MichiganArcgisFieldContractAuditV1();

const summary = readJson('data/generated/michigan_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/michigan_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/michigan_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/michigan_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/michigan_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/michigan_district_or_county_education_routing_arcgis_contract_packet_v1.json');
const batchSummary = readJson('data/generated/batch191_michigan_arcgis_field_contract_audit_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/michigan-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].failure_code, 'official_mde_arcgis_layers_expose_boundaries_and_codes_without_local_contact_contract');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_mde_arcgis_layers_without_local_contact_contract');
assert.match(gap.status_reason, /ISD layer exposes only fields like NAME, LABEL, TYPE, ISD, and ISDCode/i);
assert.match(gap.status_reason, /No phone, website, email, special-education contact, or local routing URL fields are present/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'official_mde_arcgis_layers_expose_boundaries_and_codes_without_local_contact_contract');
assert.match(failure.evidence, /training\.catamaran\.partners\/isd-policy-resources/i);
assert.match(failure.evidence, /ISD layer 1 and district layers 2-5/i);
assert.match(failure.evidence, /no phone, website, email, district-owned special-education leaf, or county-to-ISD routing contact fields/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.blocker_code, 'official_mde_arcgis_layers_expose_boundaries_and_codes_without_local_contact_contract');
assert.equal(verified.sample_count, 4);
assert.ok(verified.samples.find((row) => row.source_url.includes('/isd-plans')));
assert.ok(verified.samples.find((row) => row.source_url.includes('438dc453faf749d786e0c6e8be731cfd/data?f=json')));
assert.ok(verified.samples.find((row) => row.source_url.includes('MapServer/1?f=json')));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'use_michigan_arcgis_contract_packet_and_hold_blocked_until_official_isd_or_district_contact_export_exists');

assert.equal(packet.repair_lane, 'field_contract_audit_only');
assert.equal(packet.current_problem_metrics.countyRowCount, 83);
assert.equal(packet.current_problem_metrics.statewideFallbackRows, 83);
assert.equal(packet.current_problem_metrics.isdLayerHasContacts, false);
assert.equal(packet.current_problem_metrics.districtLayersHaveContacts, false);
assert.equal(packet.layer_contracts[0].fields.includes('ISDCode'), true);
assert.equal(packet.layer_contracts[1].fields.includes('DCODE'), true);

assert.equal(batchSummary.official_arcgis_service_public, true);
assert.equal(batchSummary.isd_layer_has_contacts, false);
assert.equal(batchSummary.district_layers_have_contacts, false);
assert.match(report, /public district and ISD boundary identifiers, but still no local contact/i);
assert.match(lessons, /Boundary Layers Need Routing Fields Before They Count As Local Education Contracts/);

console.log('test-batch191-michigan-arcgis-field-contract-audit-v1: ok');
