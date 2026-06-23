import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch234ArizonaFinalBlockerRefinementV1 } from './run-batch234-arizona-final-blocker-refinement-v1.mjs';

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

const result = generateBatch234ArizonaFinalBlockerRefinementV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const educationPacket = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyPacket = readJson('data/generated/arizona_county_local_disability_resources_leaf_authoring_packet_v1.json');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const batchSummary = readJson('data/generated/batch234_arizona_final_blocker_refinement_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.primary_gap_reason, 'three_public_district_domains_sitemap_exhausted_and_altcs_office_cards_still_lack_county_assignments');

const eduGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduGap.family_status, 'blocked_three_reviewed_public_domains_sitemap_exhausted_without_role_leafs');
assert.match(eduGap.status_reason, /robots\.txt, sitemap/i);
assert.match(eduGap.status_reason, /student handbook/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract');
assert.match(countyGap.status_reason, /seven named ALTCS office cards/i);
assert.match(countyGap.status_reason, /partly parseable/i);

const eduFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduFailure.failure_code, 'three_reviewed_public_district_domains_exhaust_robots_and_sitemaps_without_role_leafs');
assert.match(eduFailure.evidence, /ccasdaz\.org/i);
assert.match(eduFailure.evidence, /mohavelearning\.org/i);
assert.match(eduFailure.evidence, /yavapaicountyhighschool\.com/i);

const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyFailure.failure_code, 'des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract');
assert.match(countyFailure.evidence, /seven named ALTCS office cards/i);
assert.match(countyFailure.evidence, /partially parseable/i);

const eduVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(eduVerified.blocker_code, 'three_reviewed_public_district_domains_exhaust_robots_and_sitemaps_without_role_leafs');
assert.equal(eduVerified.sample_count, 5);
assert.ok(eduVerified.samples.some((sample) => /mohave/i.test(sample.source_url)));

const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.blocker_code, 'des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract');
assert.equal(countyVerified.sample_count, 3);
assert.ok(countyVerified.samples.some((sample) => /ALTCSlocations\.html/i.test(sample.source_url)));

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'hold_three_reviewed_public_domains_until_role_bearing_special_education_or_student_services_leaves_exist');
assert.equal(nextRows.find((row) => row.family === 'county_local_disability_resources').next_action, 'hold_blocked_until_des_clears_or_ahcccs_publishes_county_to_office_assignments_in_reviewable_html_or_parseable_admin_artifacts');

assert.equal(educationPacket.current_problem_metrics.reviewedPublicDomainSitemapExhaustedCount, 3);
assert.equal(countyPacket.current_problem_metrics.altcsRawHtmlVisibleOfficeCount, 7);
assert.equal(countyPacket.current_problem_metrics.partialCountyMapArtifacts, 1);
assert.equal(queueRows.find((row) => row.state === 'arizona').primary_gap_reason, 'three_public_district_domains_sitemap_exhausted_and_altcs_office_cards_still_lack_county_assignments');
assert.equal(batchSummary.unresolved_public_district_domains, 3);
assert.equal(batchSummary.ahcccs_visible_local_offices_in_raw_html, 7);
assert.match(report, /seven named ALTCS office cards/i);
assert.match(lessons, /public district or office host is live, spend one bounded robots\/sitemap or raw-HTML pass/i);

console.log('test-batch234-arizona-final-blocker-refinement-v1: ok');
