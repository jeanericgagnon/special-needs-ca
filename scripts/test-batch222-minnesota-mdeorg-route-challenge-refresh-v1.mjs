import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch222MinnesotaMdeorgRouteChallengeRefreshV1 } from './run-batch222-minnesota-mdeorg-route-challenge-refresh-v1.mjs';

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

const result = generateBatch222MinnesotaMdeorgRouteChallengeRefreshV1();
const summary = readJson('data/generated/minnesota_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/minnesota_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/minnesota_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/minnesota_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/minnesota_next_action_queue_v2.jsonl');
const packet = readJson('data/generated/minnesota_district_or_county_education_routing_directory_contract_packet_v1.json');
const batchSummary = readJson('data/generated/batch222_minnesota_mdeorg_route_challenge_refresh_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/minnesota-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(result.classification, 'BLOCKED');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_live_mdeorg_glossary_root_with_radware_protected_child_routes');
assert.match(gap.status_reason, /glossary root at `\/MdeOrgView\/` is live/i);
assert.match(gap.status_reason, /reference\/county/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'official_mdeorg_glossary_root_is_live_but_all_actionable_routes_are_radware_challenged');
assert.match(failure.evidence, /MDE Organization Reference Glossary/i);
assert.match(failure.evidence, /search\/index/i);
assert.match(failure.evidence, /Radware Captcha Page/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.family_status, 'blocked_live_mdeorg_glossary_root_with_radware_protected_child_routes');
assert.equal(verified.sample_count, 4);
assert.ok(verified.samples.some((sample) => /glossary root/i.test(sample.sample_name)));
assert.ok(verified.samples.some((sample) => /county route challenge/i.test(sample.sample_name)));

const next = nextRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(next.next_action, 'hold_blocked_until_reviewed_first_party_mdeorg_route_capture_or_export_contract_exists');

assert.equal(packet.current_problem_metrics.liveGlossaryRootAccessible, true);
assert.equal(packet.current_problem_metrics.directChildRoutesRadwareProtected, true);
assert.equal(packet.current_problem_metrics.staticChildRouteLinksVisible, true);
assert.ok(packet.representative_sources.includes('https://pub.education.mn.gov/MdeOrgView/reference/county'));

assert.equal(batchSummary.live_glossary_root_accessible, true);
assert.equal(batchSummary.direct_child_routes_radware_protected, true);
assert.ok(report.includes('MDE-ORG glossary root is live, but every actionable'));
assert.ok(report.includes('Radware-protected'));
assert.ok(lessons.includes('### A Live Glossary Root Does Not Mean The Directory Routes Are Reachable'));
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);

console.log('test-batch222-minnesota-mdeorg-route-challenge-refresh-v1: ok');
