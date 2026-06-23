import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch194NewHampshireHostFamilyPacketV1 } from './run-batch194-new-hampshire-host-family-packet-v1.mjs';

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

const result = generateBatch194NewHampshireHostFamilyPacketV1();
const summary = readJson('data/generated/new-hampshire_california_grade_summary_v2.json');
const packet = readJson('data/generated/new-hampshire_host_family_blocker_packet_v1.json');
const batchSummary = readJson('data/generated/batch194_new_hampshire_host_family_packet_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/new-hampshire-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const gapRows = readJsonl('data/generated/new-hampshire_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/new-hampshire_failure_ledger_v2.jsonl');

assert.equal(result.classification, 'BLOCKED');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable');

assert.equal(packet.state, 'new-hampshire');
assert.equal(packet.blocker_classes.length, 3);
assert.equal(packet.blocker_classes[0].blocker_class, 'successor_host_unresolvable');
assert.equal(packet.blocker_classes[0].exact_paths.length, 4);
assert.ok(packet.blocker_classes[1].host_families.includes('www.education.nh.gov'));
assert.ok(packet.blocker_classes[1].host_families.includes('www.dhhs.nh.gov'));
assert.ok(packet.blocker_classes[1].host_families.includes('www.nhes.nh.gov'));
assert.equal(packet.blocker_classes[2].host_family, 'www.nheasy.nh.gov');

assert.equal(batchSummary.packet_written, true);
assert.equal(batchSummary.successor_host_unresolvable_paths, 4);
assert.equal(batchSummary.access_denied_host_paths, 9);
assert.ok(batchSummary.blocker_classes.includes('successor_host_unresolvable'));
assert.ok(batchSummary.blocker_classes.includes('public_host_access_denied_shell'));

assert.ok(report.includes('Host-family packet saved at `data/generated/new-hampshire_host_family_blocker_packet_v1.json`'));
assert.ok(report.includes('separates dead successor-host assumptions from live-but-access-denied official host families'));
assert.ok(lessons.includes('### Split Dead Successor Hosts From Live Access-Denied Host Families'));

assert.equal(gapRows.find((row) => row.family === 'medicaid_state_health_coverage').family_status, 'blocked_current_nh_dhhs_replacement_host_unresolvable');
assert.equal(failureRows.find((row) => row.family === 'district_or_county_education_routing').failure_code, 'official_nh_doe_host_family_returns_access_denied_shell');

console.log('test-batch194-new-hampshire-host-family-packet-v1: ok');
