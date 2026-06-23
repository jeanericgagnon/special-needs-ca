import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'ohio_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'ohio_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'ohio_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'ohio_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'ohio_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'ohio-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch261_ohio_county_search_surface_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch261-ohio-county-search-surface-refinement-report-v1.md'),
};

const COUNTY_FAILURE_CODE = 'retired_official_county_family_and_public_search_surfaces_still_dead';
const COUNTY_FAMILY_STATUS = 'blocked_retired_official_county_family_and_dead_public_search_surfaces';
const COUNTY_STATUS_REASON = 'The retired Ohio JFS county-office family still has no live official successor on the legacy JFS host, guessed JFS child locator path, Medicaid-host guesses, Ohio.gov resident-resource guess, or obvious public search/sitemap surfaces.';
const COUNTY_NEXT_ACTION = 'hold_blocked_until_new_live_official_ohio_county_directory_locator_or_search_index_is_verified';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded live official successor-path checks after the earlier JFS retirement finding. Legacy and guessed successor pages still resolve to dead families: https://jfs.ohio.gov/home/local-agencies-directory => HTTP 404; https://jfs.ohio.gov/home/local-agencies-directory/ => HTTP 404; https://medicaid.ohio.gov/families-and-individuals/county-agencies => HTTP 404; https://medicaid.ohio.gov/families-and-individuals/county-agencies/ => HTTP 404; https://medicaid.ohio.gov/resources/county-agencies => HTTP 404; https://medicaid.ohio.gov/resources/county-agencies/ => HTTP 404; https://ohio.gov/residents/resources/job-family-services-directory => HTTP 404; https://ohio.gov/residents/resources/job-family-services-directory/ => HTTP 404. A final bounded public-discovery pass also found no live search or sitemap successor on the official hosts: https://ohio.gov/search?query=job%20and%20family%20services => HTTP 404; https://ohio.gov/search?query=county%20agencies => HTTP 404; https://ohio.gov/search?query=county%20job%20and%20family%20services => HTTP 404; https://medicaid.ohio.gov/sitemap.xml => HTTP 404; https://medicaid.ohio.gov/search?query=county%20agencies => HTTP 404; https://jfs.ohio.gov/search?query=county%20agencies => HTTP 404. This leaves the DOI-hosted county dataset as planning evidence only and no live official county-office directory, locator, search index, or sitemap contract is verified.';

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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Ohio California-Grade Audit Report v2',
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
    '## Ohio final blocker decision',
    '',
    '- County-local disability resources remain blocked because the retired Ohio JFS family still has no live official successor: the legacy root/path failures remain in place, the guessed JFS child locator path returns 404, the guessed Medicaid-host county-agency paths return 404, the Ohio.gov resident-resource guess returns 404, and the obvious Ohio.gov / JFS / Medicaid public search and sitemap surfaces also return 404.',
    '- District or county education routing remains blocked because only 4 distinct Ohio school-district source URLs on disk preserve path-level leaf signal, covering just 8 county rows, while 49 distinct URLs remain root-only.',
    '- Ohio is still truthfully BLOCKED and not index-safe.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  const current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const replacement = current
    .replace('- Ohio: `retired_official_county_family_no_live_successor_and_education_inventory_still_root_only`', '- Ohio: `retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only`')
    .replace('## Current Focus State: Alaska', '## Current Focus State: Ohio')
    .replace(
      '`county_local_disability_resources` is still the only critical blocker. Alaska now has a live, reviewable DFCS Services page that preserves statewide phone routing for Adult Public Assistance and Apply for Medicaid through `888-804-6330`, but it still does not provide borough or census-area office mapping. Its exact service links still land on `health.alaska.gov` leaves that remain challenge-blocked in the low-token lane, and the DFCS contacts surface still exposes no county-equivalent office contract.',
      '`county_local_disability_resources` remains the top Ohio blocker in the state queue. The legacy JFS county-office family is still retired, the obvious Medicaid and Ohio.gov successor guesses still return 404, and a final bounded public-discovery pass found the same result on the obvious Ohio.gov, Medicaid, and JFS search/sitemap surfaces. Ohio still has no live public county-office directory, locator, search index, or sitemap contract to reopen this family.'
    )
    .replace(
      '- Any first-party Alaska borough- or census-area-to-DPA office mapping contract on a public, reviewable official page.\n- Or, a live official DPA office directory leaf on `health.alaska.gov` that is reviewable without the challenge shell and explicitly maps local office coverage.\n- Or, a DFCS successor page that turns the current statewide phone relay into a true local office locator.\n- Generic statewide program phones and department contact hubs are still not enough.',
      '- Any first-party Ohio county office directory, locator, sitemap contract, or search index that is live on an official Ohio/JFS/Medicaid host.\n- Or, a reviewed public successor page that maps county departments of job and family services without relying on the retired JFS family.\n- Or, exact district or ESC-owned education leaves that materially expand county-grade education routing beyond the current root-only inventory.\n- Generic statewide program pages, DOI-hosted planning datasets, and root-only ESC homepages are still not enough.'
    )
    .replace(
      '- [Alaska DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)\n- [Alaska DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)\n- [Alaska DPA Offices directory](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)\n- [Alaska legacy office locations](https://health.alaska.gov/dpa/Pages/office-locations.aspx)\n- [Alaska Adult Public Assistance leaf](https://health.alaska.gov/en/services/adult-public-assistance-apa/)\n- [Alaska Apply for Medicaid leaf](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)\n- [Alaska health host sitemap](https://health.alaska.gov/sitemap.xml)',
      '- [Legacy Ohio JFS child locator guess](https://jfs.ohio.gov/home/local-agencies-directory)\n- [Legacy Ohio JFS child locator guess with slash](https://jfs.ohio.gov/home/local-agencies-directory/)\n- [Ohio Medicaid county agencies guess](https://medicaid.ohio.gov/families-and-individuals/county-agencies)\n- [Ohio Medicaid resources county agencies guess](https://medicaid.ohio.gov/resources/county-agencies)\n- [Ohio.gov resident resource guess](https://ohio.gov/residents/resources/job-family-services-directory)\n- [Ohio.gov search guess for job and family services](https://ohio.gov/search?query=job%20and%20family%20services)\n- [Ohio.gov search guess for county agencies](https://ohio.gov/search?query=county%20agencies)\n- [Ohio Medicaid sitemap guess](https://medicaid.ohio.gov/sitemap.xml)\n- [JFS search guess](https://jfs.ohio.gov/search?query=county%20agencies)'
    )
    .replace(
      '- Any official Alaska borough/census-area office directory or office-location table that is live and reviewable.\n- Any first-party DFCS or health-host leaf that ties specific boroughs or census areas to local Public Assistance routing.\n- Any official successor to the challenged health-host office directory that preserves county-equivalent local office mapping rather than statewide phone relay only.',
      '- Any live official Ohio county-office directory, locator, public sitemap, or public search result surface on Ohio/JFS/Medicaid hosts.\n- Any official successor domain for county departments of job and family services that is publicly reviewable and county-bearing.\n- Any exact Ohio district or ESC-owned leaf pages that materially expand county-grade education routing beyond the current 8-county leaf coverage.'
    )
    .replace(
      '## Next State Order After Alaska\n\n1. Ohio\n2. Minnesota\n3. Maine\n4. Idaho\n5. Arizona\n6. Massachusetts\n7. Oregon\n8. Oklahoma\n9. Utah\n10. New Hampshire',
      '## Next State Order After Ohio\n\n1. Minnesota\n2. Maine\n3. Idaho\n4. Arizona\n5. Massachusetts\n6. Oregon\n7. Oklahoma\n8. Utah\n9. New Hampshire\n10. New Mexico'
    );

  fs.writeFileSync(INPUTS.handoff, replacement);
}

export function generateBatch261OhioCountySearchSurfaceRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: 'retired_official_county_family_and_public_search_surfaces_still_dead_plus_education_inventory_root_only',
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'county_local_disability_resources'
        ? {
            ...blocker,
            failure_code: COUNTY_FAILURE_CODE,
            evidence: COUNTY_EVIDENCE,
            next_action: COUNTY_NEXT_ACTION,
          }
        : blocker
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_FAMILY_STATUS, status_reason: COUNTY_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: COUNTY_FAMILY_STATUS,
          query_basis: 'Reviewed bounded live official JFS, Medicaid, Ohio.gov, search, and sitemap successor-path checks for the Ohio county-office family.',
          blocker_code: COUNTY_FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();

  writeJson(OUTPUTS.summary, {
    batch: 'batch261_ohio_county_search_surface_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'ohio',
    classification: 'BLOCKED',
    index_safe: false,
    additional_public_surface_404s: 6,
    primary_gap_reason: updatedSummary.primary_gap_reason,
  });

  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 261 Ohio County Search Surface Refinement Report v1',
      '',
      '- classification: BLOCKED',
      '- index_safe: false',
      '- refined_family: county_local_disability_resources',
      `- failure_code: ${COUNTY_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${COUNTY_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Ohio remains blocked and not index-safe.',
      '- The legacy county-office family is still retired.',
      '- The obvious public Ohio.gov, Medicaid, and JFS search/sitemap surfaces are also dead, so there is still no live official county-office successor contract.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch261OhioCountySearchSurfaceRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
