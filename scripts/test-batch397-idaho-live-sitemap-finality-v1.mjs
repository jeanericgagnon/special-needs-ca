import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateBatch397IdahoLiveSitemapFinalityV1 } from './run-batch397-idaho-live-sitemap-finality-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonl(relativePath) {
  const raw = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

const result = generateBatch397IdahoLiveSitemapFinalityV1();
assert.equal(result.classification, 'BLOCKED');

const summary = readJson('data/generated/idaho_california_grade_summary_v2.json');
assert.equal(summary.batch, 'batch397_idaho_live_sitemap_finality_v1');
assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.completeness_pct, 87);
assert.equal(summary.primary_gap_reason, 'remaining_idaho_camas_and_clark_surfaces_still_reduce_to_wrong_role_contact_board_roster_title_ix_general_education_notice_and_image_only_child_find_lanes_while_live_dhw_sitemap_only_confirms_office_inventory_without_county_contract');

const gapRows = readJsonl('data/generated/idaho_gap_matrix_v2.jsonl');
const districtGap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.match(districtGap.status_reason, /camascountyschools\.org.*sitemap\.xml.*HTTP 404/i);
assert.match(districtGap.status_reason, /same-host href scan.*all-resources/i);
assert.match(districtGap.status_reason, /`Food Services` link/i);
assert.match(districtGap.status_reason, /clarkcountyschools161\.org.*sitemap\.xml.*HTTP 404/i);
assert.match(districtGap.status_reason, /same-host anchor-text scan.*Parent Resources/i);
assert.match(districtGap.status_reason, /Idaho Child Find.*English and Spanish flyer PDFs/i);

const countyGap = gapRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyGap.status_reason, /healthandwelfare\.idaho\.gov.*sitemap\.xml.*HTTP 200/i);
assert.match(countyGap.status_reason, /\/offices\?page=0.*\/offices\?page=1.*\/offices\?page=2/i);
assert.match(countyGap.status_reason, /Grangeville Office - Camas Resource Center/i);
assert.match(countyGap.status_reason, /no `county served`, `counties served`, `serves`, or `service area` field/i);
assert.match(countyGap.status_reason, /preserve office inventory only, not county assignment/i);
assert.match(countyGap.status_reason, /adams-county-mobile-pantry-council/i);
assert.match(countyGap.status_reason, /clark-county-mobile-pantry-dubois/i);

const failureRows = readJsonl('data/generated/idaho_failure_ledger_v2.jsonl');
const countyFailure = failureRows.find((row) => row.family === 'county_local_disability_resources');
assert.match(countyFailure.evidence, /paginated office inventory/i);
assert.match(countyFailure.evidence, /sitemap\.xml` now returns HTTP 200/i);
assert.match(countyFailure.evidence, /unrelated food-bank or pantry pages/i);

const verifiedRows = readJsonl('data/generated/idaho_verified_sources_v1.jsonl');
const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
assert.equal(countyVerified.samples.filter((sample) => sample.sample_name === 'Idaho DHW public sitemap office inventory').length, 1);
assert.match(JSON.stringify(countyVerified.samples), /official_public_sitemap_inventory_only/);
assert.equal(countyVerified.sample_count, countyVerified.samples.length);
assert.match(countyVerified.blocker_evidence, /paginated office inventory/i);
assert.match(countyVerified.blocker_evidence, /Reviewed 2026-06-25 one more bounded live Idaho DHW office-contract pass/i);

const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/idaho-california-grade-audit-report-v2.md'), 'utf8');
assert.match(report, /live DHW sitemap confirms office inventory/i);
assert.match(report, /the `all-resources` page still only exposes a `Food Services` link/i);

const batchSummary = readJson('data/generated/batch397_idaho_live_sitemap_finality_summary_v1.json');
assert.equal(batchSummary.idaho_dhw_sitemap_live, true);
assert.equal(batchSummary.idaho_dhw_sitemap_office_inventory_only, true);
assert.equal(batchSummary.camas_sitemap_404, true);
assert.equal(batchSummary.clark_sitemap_404, true);

const batchReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/batch397-idaho-live-sitemap-finality-report-v1.md'), 'utf8');
assert.match(batchReport, /tightened Idaho’s remaining district and county-local blockers/i);

const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
assert.match(lessons, /Public Sitemaps Can Confirm Inventory Without Creating A County Contract/);

const allStateAudit = readJson('data/generated/all_state_california_grade_audit_v3.json');
const auditRow = allStateAudit.states.find((row) => row.stateId === 'idaho');
assert.equal(auditRow.packetBatch, 'batch397_idaho_live_sitemap_finality_v1');
assert.equal(auditRow.packetPrimaryGapReason, 'remaining_idaho_camas_and_clark_surfaces_still_reduce_to_wrong_role_contact_board_roster_title_ix_general_education_notice_and_image_only_child_find_lanes_while_live_dhw_sitemap_only_confirms_office_inventory_without_county_contract');

const allStateReport = fs.readFileSync(path.join(repoRoot, 'docs/generated/all-state-california-grade-audit-report-v3.md'), 'utf8');
assert.match(allStateReport, /final live sitemap pass/i);
assert.match(allStateReport, /live Idaho DHW sitemap confirms office inventory but still no county-to-office contract/i);

const handoff = fs.readFileSync(path.join(repoRoot, 'docs/generated/gemini-source-scout-handoff.md'), 'utf8');
assert.match(handoff, /- Idaho: `remaining_idaho_camas_and_clark_surfaces_still_reduce_to_wrong_role_contact_board_roster_title_ix_general_education_notice_and_image_only_child_find_lanes_while_live_dhw_sitemap_only_confirms_office_inventory_without_county_contract`/);

const stateCertification = readJson('data/generated/state-certification/idaho.json');
assert.equal(stateCertification.summary.batch, 'batch397_idaho_live_sitemap_finality_v1');
assert.equal(stateCertification.checkedAt, '2026-06-25T00:00:00.000Z');
assert.match(JSON.stringify(stateCertification.summary.final_blockers), /Reviewed 2026-06-25 one more bounded live Idaho district pass/);

console.log('test-batch397-idaho-live-sitemap-finality-v1: ok');
