import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch395WyomingWdeSpecialEdDirectoryCompletionV1 } from './run-batch395-wyoming-wde-special-ed-directory-completion-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

const result = generateBatch395WyomingWdeSpecialEdDirectoryCompletionV1();
assert.equal(result.classification, 'COMPLETE');
assert.equal(result.county_count, 23);

const summary = readJson('data/generated/wyoming_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch395_wyoming_wde_special_ed_directory_completion_v1');
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.equal(summary.missing_critical_families, 0);
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.final_blockers, []);

const gapRows = readJsonl('data/generated/wyoming_gap_matrix_v2.jsonl');
const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'verified_county_grade');
assert.match(educationGap.status_reason, /Special Education Director/i);
assert.match(educationGap.status_reason, /all 23 Wyoming counties/i);
assert.match(educationGap.status_reason, /Weston County School District #1/i);

const failureRows = readJsonl('data/generated/wyoming_failure_ledger_v2.jsonl');
assert.equal(failureRows.length, 0);

const nextRows = readJsonl('data/generated/wyoming_next_action_queue_v2.jsonl');
assert.equal(nextRows.length, 0);

const countyRows = readJsonl('data/generated/batch395_wyoming_wde_special_ed_directory_county_map_v1.jsonl');
assert.equal(countyRows.length, 23);
assert.equal(new Set(countyRows.map((row) => row.county)).size, 23);
assert.ok(countyRows.every((row) => row.source_url === 'https://portals.edu.wyoming.gov/wyedpro/Pages/OnlineDirectory/OnlineDirectoryPeopleSearch.aspx'));
assert.ok(countyRows.every((row) => row.verification_status === 'official_verified'));
assert.ok(countyRows.every((row) => row.contact_count >= 1));
assert.ok(countyRows.every((row) => row.contacts.every((contact) => contact.full_name && contact.phone && contact.email)));

const albany = countyRows.find((row) => row.county === 'Albany');
assert.equal(albany.district_name, 'Albany County School District #1');
assert.equal(albany.contact_count, 2);
assert.match(albany.evidence_snippet, /Special Education Director/);
assert.match(albany.evidence_snippet, /slhamel@acsd1.org/);

const sweetwater = countyRows.find((row) => row.county === 'Sweetwater');
assert.equal(sweetwater.district_name, 'Sweetwater County School District #1');
assert.equal(sweetwater.contacts[0].email, 'arnoldik@sw1.k12.wy.us');

const verifiedRows = readJsonl('data/generated/wyoming_verified_sources_v1.jsonl');
const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.family_status, 'verified_county_grade');
assert.equal(educationVerified.sample_count, 23);
assert.equal(educationVerified.blocker_code, null);
assert.equal(educationVerified.samples.length, 5);
assert.match(JSON.stringify(educationVerified.samples), /Albany County School District #1/);

const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/wyoming-california-grade-audit-report-v2.md'), 'utf8');
assert.match(stateReport, /Wyoming is now COMPLETE and index_safe=true/);
assert.match(stateReport, /counties covered: 23\/23/);

const batchSummary = readJson('data/generated/batch395_wyoming_wde_special_ed_directory_completion_summary_v1.json');
assert.equal(batchSummary.classification, 'COMPLETE');
assert.equal(batchSummary.counties_cleared, 23);
assert.equal(batchSummary.remaining_blockers, 0);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch395-wyoming-wde-special-ed-directory-completion-report-v1.md'), 'utf8');
assert.match(batchReport, /Promoted Wyoming from BLOCKED to COMPLETE/);
assert.match(batchReport, /Special Education Director/);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /Public Role-Filtered State Directories Can Clear County-Grade Education Routing/);

console.log('test-batch395-wyoming-wde-special-ed-directory-completion-v1: ok');
