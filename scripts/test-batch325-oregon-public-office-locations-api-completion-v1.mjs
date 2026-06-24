import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch325OregonPublicOfficeLocationsApiCompletionV1 } from './run-batch325-oregon-public-office-locations-api-completion-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const result = generateBatch325OregonPublicOfficeLocationsApiCompletionV1();
const summary = readJson('data/generated/oregon_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/oregon_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/oregon_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/oregon_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/oregon_next_action_queue_v2.jsonl');
const queueRows = readJsonl('data/generated/all_state_priority_queue_v3.jsonl');
const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const stateReport = fs.readFileSync(
  path.join(repoRoot, 'docs/generated/oregon-california-grade-audit-report-v2.md'),
  'utf8'
);
const allStateReport = fs.readFileSync(
  path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'),
  'utf8'
);
const handoff = fs.readFileSync(
  path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'),
  'utf8'
);
const batchSummary = readJson(
  'data/generated/batch325_oregon_public_office_locations_api_completion_summary_v1.json'
);
const batchReport = fs.readFileSync(
  path.join(
    repoRoot,
    'docs/generated/batch325-oregon-public-office-locations-api-completion-report-v1.md'
  ),
  'utf8'
);
const lessons = fs.readFileSync(
  path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'),
  'utf8'
);

assert.equal(result.classification, 'COMPLETE');
assert.equal(result.index_safe, true);
assert.equal(result.officeFinderRootVerified, true);
assert.equal(result.officeLocationsApiVerified, true);
assert.equal(result.officeLocationRowCount, 269);
assert.equal(result.distinctCountyCount, 36);
assert.equal(result.countyCoverageComplete, true);

assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.completeness_pct, 100);
assert.equal(summary.strong_critical_families, 12);
assert.equal(summary.weak_critical_families, 0);
assert.equal(summary.primary_gap_reason, 'none');
assert.deepEqual(summary.final_blockers, []);
assert.equal(summary.familyStatuses.county_local_disability_resources, 'verified_county_grade');

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyGap.family_status, 'verified_county_grade');
assert.match(countyGap.status_reason, /Office Locations/i);
assert.match(countyGap.status_reason, /269 office rows/i);
assert.match(countyGap.status_reason, /all 36 Oregon counties/i);

assert.equal(failureRows.length, 0);

const countyVerified = verifiedRows.find(
  (row) => row.family === 'county_local_disability_resources'
);
assert.equal(countyVerified.family_status, 'verified_county_grade');
assert.equal(countyVerified.evidence_strength, 'strong');
assert.equal(countyVerified.blocker_code, null);
assert.equal(countyVerified.sample_count, 4);
assert.ok(
  countyVerified.samples.some((row) =>
    String(row.source_url).includes("GetByTitle('Office%20Locations')")
  )
);
assert.ok(
  countyVerified.samples.some((row) =>
    String(row.evidence_snippet).includes('Baker City Aging and People with Disabilities')
  )
);
assert.ok(
  countyVerified.samples.some((row) =>
    String(row.evidence_snippet).includes('all 36 Oregon counties')
  )
);

assert.equal(nextRows.length, 1);
assert.equal(nextRows[0].family, 'maintenance');
assert.match(nextRows[0].next_action, /Preserve Oregon as COMPLETE\/index_safe/i);

const queueRow = queueRows.find((row) => row.state === 'oregon');
assert.equal(queueRow.classification, 'COMPLETE');
assert.equal(queueRow.index_safe, true);
assert.equal(queueRow.primary_gap_reason, 'none');
assert.equal(queueRow.recommended_batch, 'complete_maintain');
assert.equal(queueRow.status, 'COMPLETE');

const auditOregon = allStateAudit.states.find((row) => row.stateId === 'oregon');
assert.equal(auditOregon.classification, 'COMPLETE');
assert.equal(auditOregon.indexSafe, true);
assert.equal(auditOregon.packetBatch, 'batch325_oregon_public_office_locations_api_completion_v1');
assert.equal(auditOregon.packetPrimaryGapReason, 'none');
assert.equal(
  auditOregon.familyStatuses.county_local_disability_resources,
  'verified_county_grade'
);
assert.equal(allStateAudit.classifications.COMPLETE, 26);
assert.equal(allStateAudit.classifications.BLOCKED, 24);
assert.equal(allStateAudit.indexSafeCount, 26);

assert.doesNotMatch(
  JSON.stringify(verifiedRows),
  /dhhs\.oregon\.gov/
);
assert.match(JSON.stringify(verifiedRows), /odhs\/idd\/pages\/default\.aspx/);
assert.match(JSON.stringify(verifiedRows), /SpecialEducation\/earlyintervention\/Pages\/default\.aspx/);
assert.match(JSON.stringify(verifiedRows), /odhs\/vr\/Pages\/default\.aspx/);
assert.match(JSON.stringify(verifiedRows), /Oregon Health Plan \(Oregon Medicaid\)/);

assert.match(stateReport, /Oregon is now `COMPLETE` and `index_safe=true`/);
assert.match(stateReport, /Office Locations/);
assert.match(stateReport, /269 public office rows/);
assert.match(allStateReport, /Oregon is now COMPLETE\/index-safe/i);
assert.match(allStateReport, /COMPLETE: 26/);
assert.match(handoff, /## Current Focus State: Ohio/);
assert.match(handoff, /Ohio JFS root/);
assert.doesNotMatch(handoff, /## Current Focus State: Oregon/);

assert.equal(batchSummary.countyCoverageComplete, true);
assert.equal(batchSummary.distinctCountyCount, 36);
assert.match(batchReport, /verified public `Office Locations` SharePoint list contract/i);

assert.match(
  lessons,
  /Public SharePoint Lists Behind Custom Components Can Be County-Grade Contracts/
);

console.log('test-batch325-oregon-public-office-locations-api-completion-v1: ok');
