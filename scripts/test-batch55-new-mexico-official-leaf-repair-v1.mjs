import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch55NewMexicoOfficialLeafRepairV1 } from './run-batch55-new-mexico-official-leaf-repair-v1.mjs';

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

const htmlByUrl = new Map([
  ['https://www.hca.nm.gov/lookingforassistance/apply-for-benefits/', `
    <html><head><title>Apply For Benefits</title></head>
    <body><h1>Apply For Benefits</h1><p>New Mexico Health Care Authority</p></body></html>`],
  ['https://www.hca.nm.gov/turquoise-care/', `
    <html><head><title>Turquoise Care Overview</title></head>
    <body><h1>Turquoise Care Overview</h1><p>Turquoise Care is the New Mexico Medicaid Managed Care program that began on July 1, 2024. Most Medicaid members are enrolled in managed care.</p></body></html>`],
  ['https://www.nmececd.org/family-infant-toddler-fit-program/', `
    <html><head><title>Family Infant Toddler (FIT) Program</title></head>
    <body><h1>Family Infant Toddler (FIT) Program</h1><p>FIT provides early intervention services to children from birth to age three.</p><p>Make a Referral</p></body></html>`],
]);

async function mockFetch(url) {
  const html = htmlByUrl.get(url);
  assert.ok(html, `Unexpected fetch URL: ${url}`);
  return {
    status: 200,
    finalUrl: url,
    contentType: 'text/html',
    html,
  };
}

const result = await generateBatch55NewMexicoOfficialLeafRepairV1(mockFetch);
const summary = readJson('data/generated/new-mexico_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/new-mexico_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-mexico_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/new-mexico_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/new-mexico_verified_sources_v1.jsonl');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-mexico-california-grade-audit-report-v2.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 50, 'New Mexico should now have six strong critical families.');
assert.equal(summary.strong_critical_families, 6);
assert.equal(summary.weak_critical_families, 4);
assert.equal(summary.missing_critical_families, 2);
assert.equal(summary.primary_gap_reason, 'county_grade_leaf_proof_still_missing_after_official_statewide_repairs');

const byFamily = new Map(gapRows.map((row) => [row.family, row]));
assert.equal(byFamily.get('medicaid_state_health_coverage').family_status, 'verified_state_grade');
assert.equal(byFamily.get('early_intervention_part_c').family_status, 'blocked_county_grade_fit_local_routing_unverified');
assert.equal(byFamily.get('district_or_county_education_routing').family_status, 'blocked_exact_district_or_county_leafs_unverified');
assert.equal(byFamily.get('legal_aid').family_status, 'missing_reviewed_statewide_legal_aid_source');

assert.ok(!failureRows.some((row) => row.family === 'medicaid_state_health_coverage'), 'Medicaid state coverage should be removed from the failure ledger.');
assert.equal(failureRows.find((row) => row.family === 'early_intervention_part_c').failure_code, 'statewide_fit_program_verified_but_county_grade_local_routing_missing');

assert.equal(nextRows[0].family, 'early_intervention_part_c', 'Early intervention should become the leading critical blocker after statewide source repair.');
assert.ok(!nextRows.some((row) => row.family === 'medicaid_state_health_coverage'));

const verifiedByFamily = new Map(verifiedRows.map((row) => [row.family, row]));
assert.equal(verifiedByFamily.get('medicaid_state_health_coverage').sample_count, 2);
assert.equal(verifiedByFamily.get('medicaid_state_health_coverage').samples[0].source_url, 'https://www.hca.nm.gov/turquoise-care/');
assert.equal(verifiedByFamily.get('early_intervention_part_c').sample_count, 1);
assert.equal(verifiedByFamily.get('early_intervention_part_c').samples[0].source_url, 'https://www.nmececd.org/family-infant-toddler-fit-program/');
assert.equal(verifiedByFamily.get('early_intervention_part_c').family_status, 'blocked_county_grade_fit_local_routing_unverified');

assert.ok(report.includes('Medicaid state health coverage is now repaired from reviewed live HCA leaves'));
assert.ok(report.includes('official ECECD Family Infant Toddler (FIT) page is live and explicitly proves New Mexico’s early-intervention program'));
assert.ok(report.includes('Early intervention still does not clear California-grade county gating'));
assert.ok(report.includes('New Mexico therefore remains truthfully BLOCKED and not index-safe'));

console.log('test-batch55-new-mexico-official-leaf-repair-v1: ok');
