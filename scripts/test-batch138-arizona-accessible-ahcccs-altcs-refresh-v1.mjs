import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch138ArizonaAccessibleAhcccsAltcsRefreshV1 } from './run-batch138-arizona-accessible-ahcccs-altcs-refresh-v1.mjs';

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

const result = generateBatch138ArizonaAccessibleAhcccsAltcsRefreshV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const batchSummary = readJson('data/generated/batch138_arizona_accessible_ahcccs_altcs_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'azed_and_des_hosts_challenged_but_ahcccs_exposes_partial_official_local_artifacts');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(educationGap.status_reason, /AZED host challenges not only the statewide special-education root but also robots\.txt and sitemap\.xml/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /accessible AHCCCS artifacts now provide a partial official office lane/i);
assert.match(countyGap.status_reason, /DES remains challenge-blocked even at robots\.txt and sitemap\.xml/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'azed_host_blocks_root_robots_and_sitemap_so_district_leafs_must_come_from_district_sites');
assert.match(educationFailure.evidence, /https:\/\/www\.azed\.gov\/robots\.txt/i);
assert.match(educationFailure.evidence, /https:\/\/www\.azed\.gov\/sitemap\.xml/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'des_host_challenged_but_ahcccs_sitemap_exposes_partial_altcs_office_and_county_map_artifacts');
assert.match(countyFailure.evidence, /https:\/\/www\.azahcccs\.gov\/sitemap\.xml/i);
assert.match(countyFailure.evidence, /ALTCS Offices page preserves named official offices in Phoenix, Tucson, and Yuma/i);
assert.match(countyFailure.evidence, /PimaCountyAdmin\.pdf/i);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.blocker_code, 'azed_host_blocks_root_robots_and_sitemap_so_district_leafs_must_come_from_district_sites');
assert.ok(educationVerified.samples.some((sample) => sample.source_url === 'https://www.azed.gov/sitemap.xml'));
assert.ok(educationVerified.samples.some((sample) => sample.source_url === 'https://www.azed.gov/robots.txt'));

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'des_host_challenged_but_ahcccs_sitemap_exposes_partial_altcs_office_and_county_map_artifacts');
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://www.azahcccs.gov/members/ALTCSlocations.html'));
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf'));
assert.ok(countyVerified.samples.some((sample) => sample.source_url === 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf'));

const countyNext = nextRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyNext.failure_code, 'des_host_challenged_but_ahcccs_sitemap_exposes_partial_altcs_office_and_county_map_artifacts');
assert.match(countyNext.next_action, /extract_county_to_altcs_admin_mapping_from_accessible_ahcccs_office_and_county_map_artifacts/i);

assert.equal(batchSummary.azed_host_discovery_blocked, true);
assert.equal(batchSummary.des_host_discovery_blocked, true);
assert.equal(batchSummary.ahcccs_accessible_local_artifacts_found, true);
assert.ok(report.includes('AHCCCS exposes live ALTCS office and county-map artifacts'));
assert.ok(lessons.includes('When One Official Host Is Challenge-Blocked, Check Sibling Official Sitemaps Before Declaring The Whole Family Exhausted'));

console.log('test-batch138-arizona-accessible-ahcccs-altcs-refresh-v1: ok');
