import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch174NevadaWelfareOfficeBlockerRefreshV1 } from './run-batch174-nevada-welfare-office-blocker-refresh-v1.mjs';

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

const result = generateBatch174NevadaWelfareOfficeBlockerRefreshV1();
const summary = readJson('data/generated/nevada_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/nevada_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/nevada_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/nevada_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/nevada_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch174_nevada_welfare_office_blocker_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/nevada-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'live_welfare_office_pages_without_county_contract');
assert.equal(summary.final_blockers.length, 1);
assert.equal(summary.final_blockers[0].failure_code, 'official_welfare_district_office_pages_live_but_no_county_coverage_contract');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_live_welfare_office_pages_without_county_contract');
assert.match(countyGap.status_reason, /Welfare District Offices-North/i);
assert.match(countyGap.status_reason, /do not map counties served/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'official_welfare_district_office_pages_live_but_no_county_coverage_contract');
assert.match(countyFailure.evidence, /city or district name only/i);

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.family_status, 'blocked_live_welfare_office_pages_without_county_contract');
assert.equal(countyVerified.sample_count, 4);
assert.match(countyVerified.samples[1].source_url, /dss\.nv\.gov\/contact\/$/);
assert.match(countyVerified.samples[2].evidence_snippet, /Carson City, Elko \/ Winnemucca, Ely, Fallon, Hawthorne, Reno, Sparks, and Yerington/i);
assert.match(countyVerified.samples[3].evidence_snippet, /Belrose, Cambridge, Decatur, Eastern, Henderson, Nellis, Owens, Pahrump, Spring Mountain, and Flamingo/i);

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.next_action, 'hold_blocked_until_official_county_to_welfare_office_contract_is_reviewed');

assert.equal(batchSummary.office_pages_reviewed, 2);
assert.equal(batchSummary.county_total, 17);

assert.ok(report.includes('exact North/South welfare office pages with real office details'));
assert.ok(report.includes('do not preserve a county-to-office contract for all 17 counties'));
assert.ok(lessons.includes('### Live Office Leaves Still Need County Coverage Evidence'));

console.log('test-batch174-nevada-welfare-office-blocker-refresh-v1: ok');
