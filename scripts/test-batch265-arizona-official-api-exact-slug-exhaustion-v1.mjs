import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch265ArizonaOfficialApiExactSlugExhaustionV1 } from './run-batch265-arizona-official-api-exact-slug-exhaustion-v1.mjs';

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

const result = generateBatch265ArizonaOfficialApiExactSlugExhaustionV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const priorityRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch265_arizona_official_api_exact_slug_exhaustion_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments');
assert.equal(summary.final_blockers[0].failure_code, 'three_reviewed_public_district_domains_exhaust_sitemaps_wp_api_and_exact_slug_replays_without_role_leafs');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_three_reviewed_public_domains_official_api_and_exact_slug_exhausted_without_role_leafs');
assert.match(gap.status_reason, /WordPress JSON search/i);
assert.match(gap.status_reason, /\/page\/contact-us\//i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'three_reviewed_public_district_domains_exhaust_sitemaps_wp_api_and_exact_slug_replays_without_role_leafs');
assert.match(failure.evidence, /wp-json/i);
assert.match(failure.evidence, /Governing Board and staff/i);
assert.match(failure.evidence, /\/fs\/pages\/504/i);
assert.match(failure.evidence, /\/page\/contact-us\//i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.sample_count, 8);
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.mohavelearning.org/fs/pages/504'));
assert.ok(verified.samples.some((sample) => sample.source_url === 'https://www.yavapaicountyhighschool.com/page/contact-us/'));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.failure_code, 'three_reviewed_public_district_domains_exhaust_sitemaps_wp_api_and_exact_slug_replays_without_role_leafs');
assert.equal(next.next_action, 'hold_three_reviewed_public_domains_until_role_bearing_special_education_or_student_services_leaves_exist');

const queueRow = priorityRows.find((row) => (row.state_name || row.state) === 'Arizona');
assert.equal(queueRow.classification, 'BLOCKED');
assert.equal(queueRow.index_safe, false);
assert.equal(queueRow.primary_gap_reason, 'three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments');

assert.equal(batchSummary.reviewed_public_domain_count, 3);
assert.equal(batchSummary.education_blocker_code, 'three_reviewed_public_district_domains_exhaust_sitemaps_wp_api_and_exact_slug_replays_without_role_leafs');
assert.match(report, /official WordPress API, sitemap, and exact-slug replay/i);
assert.ok(handoff.includes('## Current Focus State: Arizona'));
assert.ok(handoff.includes('three_public_district_domains_official_api_and_exact_slug_sweeps_still_lack_role_leafs_and_altcs_office_cards_still_lack_county_assignments'));

console.log('test-batch265-arizona-official-api-exact-slug-exhaustion-v1: ok');
