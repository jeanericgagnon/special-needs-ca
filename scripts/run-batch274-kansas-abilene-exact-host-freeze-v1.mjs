import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch274_kansas_abilene_exact_host_freeze_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch274-kansas-abilene-exact-host-freeze-report-v1.md'),
};

const FAILURE_CODE =
  'reviewed_kansas_district_and_district_linked_coop_leaves_now_cover_10_counties_but_export_backed_county_grade_coverage_is_still_incomplete';
const NEXT_ACTION =
  'continue_export_backed_district_and_affiliated_coop_leaf_authoring_county_by_county_and_keep_exact_non_matches_frozen';

const DICKINSON_NON_MATCH_SAMPLE = {
  sample_name: 'dickinson district non-match homepage-and-sitemap',
  source_url: 'https://www.abileneschools.org/',
  final_url: 'https://www.abileneschools.org/',
  verification_status: 'reviewed',
  source_type: 'district_owned_exact_host_non_match',
  source_table: 'reviewed_live_probe',
  fetched_at: '2026-06-23T00:00:00.000Z',
  evidence_snippet:
    'The official Abilene Public Schools host is live at abileneschools.org and its public sitemap.xml is also live, but a bounded same-domain pass found no role-exact special-education, student-services, procedural-safeguards, or parent-rights leaf on the district host.',
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Audit Report v2',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Repair decision',
    '',
    '- Kansas remains BLOCKED and not index-safe.',
    '- Education is the only remaining critical blocker.',
    '- The reviewed local proof count stays at ten counties.',
    '- Dickinson is now frozen more tightly: the export-backed Abilene district host is live and exposes a public sitemap, but the bounded same-domain pass still found no role-exact special-education or student-services leaf to clear the county.',
    '- Kansas still fails closed until more export-backed district-owned or district-linked local education-routing leaves are verified county by county.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const focusBlock = [
    '## Current Focus State: Kansas',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` is the only remaining Kansas critical blocker. Reviewed local education-routing proof still covers 10/105 counties, and the lane now has one more exact non-match freeze: the export-backed Abilene USD 435 / Dickinson County district host is live and its public sitemap is live, but the bounded same-domain pass still found no role-exact special-education or student-services leaf.',
    '',
    '### Exact Evidence Needed',
    '',
    '- More export-backed Kansas district-owned special-education or student-support leaves that stay role-exact on the live district host.',
    '- More district-linked cooperative routes where the district explicitly labels the path as local special-education services and the linked cooperative host clearly states the service scope, parent-rights path, or local IEP routing.',
    '- Exact non-match freezes for districts whose live pages are still generic program hubs, homepage-only, or sitemap-only content so they do not get re-tried loosely.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Kansas KSDE directories root](https://www.ksde.gov/data-and-reporting/directories)',
    '- [Kansas Directory Reports](https://uapps.ksde.gov/Directory_Rpts/default.aspx)',
    '- [Kansas Data Central](https://datacentral.ksde.gov/default.aspx)',
    '- [Kansas district maps PDF](https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5)',
    '- [Wichita USD 259 site map](https://www.usd259.org/site-map)',
    '- [Wichita USD 259 special education search](https://www.usd259.org/search-results?q=special%20education)',
    '- [Salina USD 305 site map](https://www.usd305.com/site-map)',
    '- [Salina USD 305 Administrative & Student Support](https://www.usd305.com/departments/administrative-student-support)',
    '- [CKCIE home](https://www.305ckcie.com/)',
    '- [CKCIE Parents](https://www.305ckcie.com/parents)',
    '- [Abilene Public Schools root](https://www.abileneschools.org/)',
    '- [Abilene Public Schools sitemap](https://www.abileneschools.org/sitemap.xml)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Additional Kansas district-owned `special education`, `student support`, or `special services` leaves on export-backed district hosts for unresolved counties.',
    '- Additional district-linked cooperative hosts that explicitly state they provide special-education services across partner districts and preserve parent-rights or IEP routing on the same local stack.',
    '- Exact county-by-county non-match documentation where a district host is live but only exposes generic or non-role-bearing local pages.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n){1,12}/,
    [
      '## Next State Order After Kansas',
      '',
      '1. Nebraska',
      '2. Nevada',
      '3. Florida',
      '4. Alaska',
      '5. South Carolina',
      '6. North Carolina',
      '7. New York',
      '8. Oklahoma',
      '9. Oregon',
      '10. Ohio',
    ].join('\n')
  );
  fs.writeFileSync(INPUTS.handoff, current);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 274 Kansas Abilene Exact Host Freeze v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- reviewed_leaf_count: ${batchSummary.reviewed_leaf_count}`,
    `- new_exact_non_match_county: ${batchSummary.new_exact_non_match_county}`,
    '',
    '## What was confirmed',
    '',
    '- Abilene USD 435 / Dickinson County remains export-backed from the official KSDE Directory Reports lane.',
    '- The official district host `https://www.abileneschools.org/` is live.',
    '- The official district sitemap `https://www.abileneschools.org/sitemap.xml` is live.',
    '- A bounded same-domain pass still found no role-exact `special education`, `student services`, `special services`, `procedural safeguards`, or `parent rights` leaf on the district host.',
    '',
    '## Repair decision',
    '',
    '- Dickinson stays unresolved, but it is now frozen as an exact host non-match rather than a loose authoring candidate.',
    '- Kansas remains blocked because county-grade local education routing is still incomplete across the state packet.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch274KansasAbileneExactHostFreezeV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const evidence =
    'Reviewed 2026-06-23 one more bounded official Kansas district-routing pass using the KSDE export-backed district lane plus exact same-domain checks. Education routing still has reviewed local proof for 10/105 counties: atchison-ks, butler-ks, douglas-ks, finney-ks, johnson-ks, leavenworth-ks, riley-ks, saline-ks, shawnee-ks, wyandotte-ks. Sedgwick remains correctly frozen because Wichita USD 259 still exposes only generic site-map/search results and a non-role-exact `Special Schools and Programs` page. Dickinson is now frozen more tightly as another exact non-match: the official Abilene Public Schools host at https://www.abileneschools.org/ returned HTTP 200, its public sitemap at https://www.abileneschools.org/sitemap.xml also returned HTTP 200, but the bounded same-domain pass still found no role-exact special-education, student-services, procedural-safeguards, or parent-rights leaf on the district host. Kansas therefore stays blocked because county-grade local education proof is still incomplete across the remaining unresolved counties.';

  const statusReason =
    'Kansas is past a root-only blocker: reviewed district-owned and district-linked cooperative local education-routing leaves now exist for 10/105 counties, but county-grade local education routing is still incomplete across the packet. Export-backed district hosts remain the right lane, and exact non-match districts such as Wichita USD 259 and Abilene USD 435 should stay frozen until a role-exact local leaf appears on the official host stack.';

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade', status_reason: statusReason }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    const filtered = (row.samples || []).filter((sample) => sample.sample_name !== DICKINSON_NON_MATCH_SAMPLE.sample_name);
    const samples = [...filtered, DICKINSON_NON_MATCH_SAMPLE];
    return {
      ...row,
      family_status: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade',
      query_basis: 'Reviewed one bounded Kansas district-routing pass against export-backed district hosts, district-linked cooperative stacks, and exact same-domain non-match freezes.',
      blocker_code: FAILURE_CODE,
      blocker_evidence: evidence,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
      : row
  ));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: summary.primary_gap_reason,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'district_or_county_education_routing'
        ? { ...row, failure_code: FAILURE_CODE, evidence, next_action: NEXT_ACTION }
        : row
    )),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: 'blocked_reviewed_district_owned_and_coop_leads_but_not_statewide_county_grade',
    },
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();

  const batchSummary = {
    state: 'kansas',
    classification: 'BLOCKED',
    reviewed_leaf_count: 10,
    new_exact_non_match_county: 'dickinson-ks',
    exact_non_match_root: 'https://www.abileneschools.org/',
    exact_non_match_sitemap: 'https://www.abileneschools.org/sitemap.xml',
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(batchSummary));
  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch274KansasAbileneExactHostFreezeV1();
  console.log('Generated batch274 Kansas Abilene exact host freeze artifacts.');
}
