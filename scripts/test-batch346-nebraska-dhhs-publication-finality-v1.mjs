import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateBatch346NebraskaDhhsPublicationFinalityV1 } from './run-batch346-nebraska-dhhs-publication-finality-v1.mjs';

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

const result = generateBatch346NebraskaDhhsPublicationFinalityV1();
const summary = readJson('data/generated/nebraska_california_grade_summary_v2.json');
const gap = readJsonl('data/generated/nebraska_gap_matrix_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const failure = readJsonl('data/generated/nebraska_failure_ledger_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const verified = readJsonl('data/generated/nebraska_verified_sources_v1.jsonl').find((row) => row.family === 'county_local_disability_resources');
const next = readJsonl('data/generated/nebraska_next_action_queue_v2.jsonl').find((row) => row.family === 'county_local_disability_resources');
const queue = readJsonl('data/generated/all_state_priority_queue_v3.jsonl').find((row) => row.state === 'nebraska');
const audit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
const batchSummary = readJson('data/generated/batch346_nebraska_dhhs_publication_finality_summary_v1.json');
const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch346-nebraska-dhhs-publication-finality-report-v1.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.batch, 'batch346_nebraska_dhhs_publication_finality_v1');
assert.equal(summary.primary_gap_reason, 'official_nebraska_dhhs_site_has_no_public_sitemap_or_search_recovery_and_portal_search_still_returns_only_the_same_web_map_feature_service_and_map_service_without_any_county_assignment_item_or_directory_leaf');

assert.equal(gap.family_status, 'blocked_official_dhhs_publication_layer_and_portal_search_both_fail_to_materialize_county_assignment_contract');
assert.match(gap.status_reason, /dhhs\.ne\.gov\/robots\.txt` is live/i);
assert.match(gap.status_reason, /dhhs\.ne\.gov\/sitemap\.xml` returns 404/i);
assert.match(gap.status_reason, /SharePoint search API queries/i);

assert.equal(failure.failure_code, summary.primary_gap_reason);
assert.match(failure.evidence, /dhhs\.ne\.gov\/robots\.txt/);
assert.match(failure.evidence, /dhhs\.ne\.gov\/sitemap\.xml/);
assert.match(failure.evidence, /_api\/search\/query/);
assert.match(failure.evidence, /4bdbf8e8703743b0b2ff290f98737825/);

assert.equal(verified.family_status, gap.family_status);
assert.equal(verified.blocker_code, summary.primary_gap_reason);
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Nebraska DHHS robots.txt is live but sitemap.xml is 404'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'DHHS SharePoint search queries fail closed'));
assert.ok(verified.samples.some((sample) => sample.sample_name === 'Official portal search returns only locator trilogy'));

assert.equal(next.next_action, 'hold_blocked_until_official_service_area_table_county_assignment_artifact_new_public_county_leaf_or_searchable_dhhs_publication_index_is_published');
assert.match(next.evidence, /live robots but no public sitemap/i);

assert.equal(queue.primary_gap_reason, summary.primary_gap_reason);

const nebraskaAudit = audit.states.find((row) => row.stateId === 'nebraska');
assert.ok(nebraskaAudit);
assert.equal(nebraskaAudit.packetBatch, 'batch346_nebraska_dhhs_publication_finality_v1');
assert.equal(nebraskaAudit.packetPrimaryGapReason, summary.primary_gap_reason);
assert.equal(nebraskaAudit.familyStatuses.county_local_disability_resources, 'blocked_official_dhhs_publication_layer_and_portal_search_both_fail_to_materialize_county_assignment_contract');

assert.equal(batchSummary.robots_status, 200);
assert.equal(batchSummary.sitemap_status, 404);
assert.deepEqual(batchSummary.sharepoint_search_statuses, [500, 400]);
assert.equal(batchSummary.official_portal_result_count, 3);
assert.deepEqual(batchSummary.official_portal_result_types, ['Web Map', 'Feature Service', 'Map Service']);

assert.match(handoff, /## Current Focus State: Nebraska/);
assert.match(handoff, /dhhs\.ne\.gov\/robots\.txt` is live/i);
assert.match(handoff, /dhhs\.ne\.gov\/sitemap\.xml` returns 404/i);
assert.match(handoff, /SharePoint search API queries do not produce a searchable county office leaf/i);
assert.match(allStateReport, /both official publication lanes now fail closed/i);
assert.match(batchReport, /does not expose a public office sitemap/i);
assert.match(lessons, /SharePoint publication host has a live `robots\.txt` but no public sitemap or searchable office result/i);

const completeCount = audit.states.filter((row) => row.classification === 'COMPLETE').length;
const blockedCount = audit.states.filter((row) => row.classification === 'BLOCKED').length;
assert.equal(completeCount, 27);
assert.equal(blockedCount, 23);

console.log('test-batch346-nebraska-dhhs-publication-finality-v1: ok');
