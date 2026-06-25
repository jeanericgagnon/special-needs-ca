import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch366ArizonaAltDistrictLeafRecoveryV1 } from './run-batch366-arizona-alt-district-leaf-recovery-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

const result = generateBatch366ArizonaAltDistrictLeafRecoveryV1();
const summary = readJson('data/generated/arizona_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/arizona_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/arizona_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/arizona_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/arizona_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const packet = readJson('data/generated/arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json');
const countyInventory = readJsonl('data/generated/arizona_report_cards_county_keyed_district_inventory_v1.jsonl');
const stateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/arizona-california-grade-audit-report-v2.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const batchSummary = readJson('data/generated/batch366_arizona_alt_district_leaf_recovery_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch366-arizona-alt-district-leaf-recovery-report-v1.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.batch, 'batch366_arizona_alt_district_leaf_recovery_v1');
assert.equal(summary.primary_gap_reason, 'ahcccs_county_local_contract_still_missing_and_arizona_education_now_resolves_coconino_via_caviat_504_but_mohave_alt_leaf_still_needs_official_county_attachment_and_yavapai_still_lacks_role_leaf');
assert.equal(summary.recommended_batch, 'hold_for_mohave_official_county_attachment_yavapai_role_leaf_or_county_local_contract');
assert.equal(summary.familyStatuses.district_or_county_education_routing, 'blocked_coconino_caviat_504_resolved_mohave_alt_leaf_candidate_and_yavapai_public_domain_without_role_leaf');

const educationGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationGap.family_status, 'blocked_coconino_caviat_504_resolved_mohave_alt_leaf_candidate_and_yavapai_public_domain_without_role_leaf');
assert.match(educationGap.status_reason, /CAVIAT/i);
assert.match(educationGap.status_reason, /SPECIAL SERVICES/i);
assert.match(educationGap.status_reason, /Yavapai Accommodation School District remains the only fully source-final local domain/i);

const educationFailure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationFailure.failure_code, 'coconino_caviat_504_verified_mohave_alt_leaf_found_but_unattached_and_yavapai_still_lacks_role_leaf');
assert.match(educationFailure.evidence, /page\/504/);
assert.match(educationFailure.evidence, /mvesd16\.org\/page\/special-services/);
assert.match(educationFailure.evidence, /geocoder still returned no match/i);
assert.match(educationFailure.evidence, /yavapaicountyhighschool\.com\/sitemap\.xml/);

const educationVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationVerified.sample_count, 8);
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Coconino CAVIAT 504 leaf' && row.verification_status === 'verified'));
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Mohave Valley special-services leaf' && row.verification_status === 'candidate'));
assert.ok(educationVerified.samples.some((row) => row.sample_name === 'Yavapai sitemap still without role leaf' && row.verification_status === 'blocked'));

const educationNext = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(educationNext.next_action, 'verify_mohave_alt_leaf_with_official_county_attachment_and_hold_yavapai_until_role_bearing_leaf_exists');

const queueRow = queueRows.find((row) => row.state === 'arizona');
assert.equal(queueRow.primary_gap_reason, 'ahcccs_county_local_contract_still_missing_and_arizona_education_now_resolves_coconino_via_caviat_504_but_mohave_alt_leaf_still_needs_official_county_attachment_and_yavapai_still_lacks_role_leaf');
assert.equal(queueRow.recommended_batch, 'hold_for_mohave_official_county_attachment_yavapai_role_leaf_or_county_local_contract');
assert.equal(queueRow.repair_lane, 'repair_from_state_packet');

const auditRow = allStateAudit.states.find((row) => row.stateId === 'arizona');
assert.equal(auditRow.packetBatch, 'batch366_arizona_alt_district_leaf_recovery_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'ahcccs_county_local_contract_still_missing_and_arizona_education_now_resolves_coconino_via_caviat_504_but_mohave_alt_leaf_still_needs_official_county_attachment_and_yavapai_still_lacks_role_leaf');
assert.equal(auditRow.familyStatuses.district_or_county_education_routing, 'blocked_coconino_caviat_504_resolved_mohave_alt_leaf_candidate_and_yavapai_public_domain_without_role_leaf');

assert.equal(packet.current_problem_metrics.unresolvedDistrictOwnedLeafCount, 2);
assert.equal(packet.current_problem_metrics.unresolvedReviewedPublicDomainWithoutLeafCount, 1);
assert.equal(packet.current_problem_metrics.resolvedAlternativeDistrictLeafCount, 1);
assert.equal(packet.current_problem_metrics.alternativeDistrictLeafCandidateCount, 1);
assert.match(packet.root_domains_to_review.join(' '), /alternate LEAs/);

const coconinoRow = countyInventory.find((row) => row.county_id === 'coconino-az');
assert.equal(coconinoRow.educationOrganizationId, 79381);
assert.equal(coconinoRow.district_website, 'https://www.caviat.org/');

assert.match(stateReport, /Coconino now clears through the official CAVIAT root plus its live 504 leaf/i);
assert.match(stateReport, /Mohave has a stronger alternate district-owned special-services leaf/i);
assert.match(allStateReport, /Coconino now clears through the official CAVIAT root plus a live 504 leaf/i);
assert.match(handoff, /CAVIAT/);
assert.match(handoff, /Mohave Valley School District root/);
assert.match(handoff, /Current Focus State: Arizona/);
assert.match(handoff, /1\. New Hampshire/);
assert.match(lessons, /Alternate LEAs On Official District Inventories Can Replace Dead-End County Roots/);

assert.equal(batchSummary.coconino_caviat_504_verified, true);
assert.equal(batchSummary.coconino_caviat_county_match, true);
assert.equal(batchSummary.mohave_alt_special_services_live, true);
assert.equal(batchSummary.mohave_alt_geocoder_matched, false);
assert.equal(batchSummary.yavapai_role_hits_found, 0);
assert.equal(batchSummary.unresolved_education_counties, 2);
assert.equal(batchSummary.result, 'coconino_caviat_504_verified_mohave_alt_leaf_candidate_only_yavapai_domain_still_empty');
assert.match(batchReport, /resolved alternative root/i);

console.log('test-batch366-arizona-alt-district-leaf-recovery-v1: ok');
