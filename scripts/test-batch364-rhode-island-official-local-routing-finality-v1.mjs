import assert from 'assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch364RhodeIslandOfficialLocalRoutingFinalityV1 } from './run-batch364-rhode-island-official-local-routing-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

generateBatch364RhodeIslandOfficialLocalRoutingFinalityV1();

const summary = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_california_grade_summary_v2.json'), 'utf8')
);
assert.equal(summary.classification, 'COMPLETE');
assert.equal(summary.index_safe, true);
assert.equal(summary.primary_gap_reason, 'all_critical_families_verified');
assert.equal(summary.completeness_pct, 100);
assert.deepEqual(summary.critical_gap_families, []);
assert.deepEqual(summary.final_blockers, []);

const verifiedRows = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_verified_sources_v1.jsonl'), 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const education = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(education.family_status, 'verified_state_grade');
assert.equal(education.evidence_strength, 'strong');
assert.equal(education.sample_count, 7);
assert.equal(education.blocker_code, null);
assert.match(education.query_basis, /Reviewed 2026-06-26/i);
assert.match(education.samples[0].source_url, /LEADetail\?orgid=57/);
assert.match(education.samples[1].source_url, /LEADetail\?orgid=88/);
assert.match(education.samples[2].source_url, /LEADetail\?orgid=81/);
assert.match(education.samples[4].source_url, /highlandercharter\.org\/our-programs\/academics\/special-education/);
assert.match(education.samples[5].source_url, /internationalcharterschool\.org\/special-education/);
assert.match(education.samples[6].source_url, /nowellacademy\.org\/s\/Nowell-Student-Family-Handbook-2024-2025\.pdf/);
assert.match(education.samples[5].evidence_snippet, /Student Services Director/);
assert.match(education.samples[6].evidence_snippet, /Special Education Administrator/);

const county = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(county.family_status, 'verified_state_grade');
assert.match(county.samples[0].source_url, /dhs\.ri\.gov\/office-locator-tool/);
assert.match(county.samples[0].evidence_snippet, /city\/town/i);

const failureText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_failure_ledger_v2.jsonl'), 'utf8').trim();
assert.equal(failureText, '', 'Rhode Island failure ledger must be empty once the state clears.');

const nextText = fs.readFileSync(path.join(repoRoot, 'data', 'generated', 'rhode-island_next_action_queue_v2.jsonl'), 'utf8').trim();
assert.equal(nextText, '', 'Rhode Island next-action queue must be empty once the state clears.');

const report = fs.readFileSync(path.join(repoRoot, 'docs', 'generated', 'rhode-island-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /Rhode Island is now COMPLETE and index-safe\./);
assert.match(report, /public RIDE LEA detail pages and exact district-owned \/ first-party special-education leaves/i);
assert.match(report, /do not count as Rhode Island public LEA routing entities/i);

console.log('Rhode Island official local routing finality test passed.');
