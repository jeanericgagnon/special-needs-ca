import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'massachusetts_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'massachusetts_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'massachusetts_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'massachusetts_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'massachusetts_next_action_queue_v2.jsonl'),
  priorityQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  report: path.join(docsGeneratedDir, 'massachusetts-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch266_massachusetts_city_town_finder_no_county_contract_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch266-massachusetts-city-town-finder-no-county-contract-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export';
const EDUCATION_FAILURE_CODE = 'exact_dese_hidden_postback_replay_and_live_city_town_finder_still_do_not_expose_county_grade_local_rows';
const EDUCATION_NEXT_ACTION = 'hold_massachusetts_education_until_official_county_to_district_contract_or_reviewed_browser_capture_exists';
const EDUCATION_STATUS_REASON = 'Massachusetts education is now source-final for the low-token lane with one more official public surface checked. The public `search_link.aspx` hidden bridge still no longer materializes district rows in this lane, and the official `get_closest_orgs.aspx` School Finder is live but explicitly address/city/town based rather than county based. The finder exposes superintendent and address-oriented local search fields, but it preserves no county label, no county selector, no county occurrences, and no export lane. Massachusetts therefore still lacks county-grade education routing evidence, and the low-token lane cannot truthfully bridge DESE public surfaces to county rows without a reviewed browser/cached capture or a new official county-keyed contract.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 one more bounded official Massachusetts DESE surface after the hidden-postback replay failed. https://profiles.doe.mass.edu/search/get_closest_orgs.aspx returned HTTP 200 as a live official School Finder page. Its rendered HTML explicitly asks users to enter an address, city or town, and distance, and it preserves superintendent and address-oriented local search behavior. But the raw page contains zero `county` or `Counties` occurrences, no county selector, and no export or mailing-label lane. Combined with the earlier finding that https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238 now only replays to the generic `Profiles Search` shell with zero local rows, Massachusetts still lacks any reusable official county-grade DESE route in the low-token lane.';
const LESSON_HEADING = '### A Live Official School Finder That Only Accepts Address, City, Or Town Still Does Not Clear County-Grade Routing';
const LESSON_BODY = '*   **Lesson:** If an official education finder is live but its contract is only address/city/town based and exposes no county field or export lane, do not promote it into county-grade routing. Massachusetts `get_closest_orgs.aspx` stayed public and local-looking, but it still had zero county labels and no export path, so it could not replace a missing county-to-district contract.';

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
    '# Massachusetts California-Grade Audit Report v2',
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
    '## Completion decision',
    '',
    '- Massachusetts remains BLOCKED and index_safe=false.',
    '- Education is stricter than before: the DESE hidden bridge no longer materializes local rows, and the live School Finder is only address/city/town based with no county contract or export lane.',
    '- County-local is still source-final for low-token raw work because the live DDS locations and interactive-map pages remain raw-403 and still expose no county contract.',
    '- Future Massachusetts work should only reopen on an official county contract or on reviewed browser/cached locality capture that can be truthfully bridged to county rows.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  const current = fs.readFileSync(INPUTS.handoff, 'utf8');
  const replacement = current
    .replace('- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_dds_locations_lane_still_lacks_county_export`', '- Massachusetts: `exact_dese_hidden_postback_replay_no_longer_materializes_local_rows_and_live_city_town_finder_still_has_no_county_contract_plus_dds_locations_lane_lacks_county_export`')
    .replace('## Current Focus State: Arizona', '## Current Focus State: Massachusetts')
    .replace(
      '`district_or_county_education_routing` remains the top Arizona blocker in the state queue. The final three public district domains are now fully exhausted: Coconino\'s live WordPress root plus wp-json search only replay false-positive board and staff pages, Mohave\'s live Finalsite root returns 404 on exact role slugs, and Yavapai\'s live `/page/` namespace returns 404 on role slugs even though `/page/contact-us/` is public.',
      '`district_or_county_education_routing` remains the top Massachusetts blocker in the state queue. The hidden DESE district-directory replay still no longer materializes local rows, and the live official School Finder at `get_closest_orgs.aspx` only accepts address, city, or town inputs. It exposes superintendent and address-oriented local search behavior, but no county field, no county selector, and no export lane that can be truthfully bridged to county rows.'
    )
    .replace(
      '- Any public role-bearing special-education or student-services leaf on ccasdaz.org, mohavelearning.org, or yavapaicountyhighschool.com.\n- Or, a new official Arizona state or county export that maps those three counties to reviewed district routing.\n- Or, an official AHCCCS or DES county-to-office assignment artifact for county-local routing.\n- The live district roots, the live AHCCCS ALTCS page, and the partial county map are still not enough without county-grade routing fields.',
      '- Any official Massachusetts DESE county-to-district contract, county selector, or county-keyed export.\n- Or, a reviewed browser/cached DESE or DDS locality capture that can be truthfully bridged to counties.\n- Or, an official DDS county crosswalk or county-served export.\n- The live School Finder, the non-materializing hidden replay, and the DDS raw-403 location pages are still not enough without county-grade routing fields.'
    )
    .replace(
      '- [Coconino County Accommodation School District root](https://www.ccasdaz.org/)\n- [Coconino wp-json search for special education](https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10)\n- [Coconino page sitemap](https://www.ccasdaz.org/page-sitemap.xml)\n- [Mohave Accelerated Schools root](https://www.mohavelearning.org/)\n- [Mohave exact 504 candidate](https://www.mohavelearning.org/fs/pages/504)\n- [Yavapai Accommodation School District root](https://www.yavapaicountyhighschool.com/)\n- [Yavapai contact page](https://www.yavapaicountyhighschool.com/page/contact-us/)\n- [Yavapai exact special-education candidate](https://www.yavapaicountyhighschool.com/page/special-education/)\n- [AHCCCS ALTCS Offices](https://www.azahcccs.gov/members/ALTCSlocations.html)\n- [AHCCCS Contacts](https://www.azahcccs.gov/shared/AHCCCScontacts.html)',
      '- [DESE district-directory bridge](https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238)\n- [DESE Profiles Search](https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238)\n- [DESE School Finder](https://profiles.doe.mass.edu/search/get_closest_orgs.aspx)\n- [DESE Search, Export and Mailing Labels help](https://profiles.doe.mass.edu/help/search.aspx?leftNavId=12104)\n- [DDS org page](https://www.mass.gov/orgs/department-of-developmental-services)\n- [DDS locations index](https://www.mass.gov/orgs/department-of-developmental-services/locations)\n- [DDS interactive regional map](https://www.mass.gov/info-details/interactive-dds-regional-map)'
    )
    .replace(
      '- Any public role-bearing special-education or student-services leaf on the remaining three Arizona district domains.\n- Any official Arizona district export or report-card successor artifact that maps Coconino, Mohave, and Yavapai to reviewed local education routing.\n- Any official AHCCCS or DES county-to-office assignment artifact for Arizona county-local disability resources.',
      '- Any official Massachusetts DESE county-keyed export, selector, or district crosswalk.\n- Any official DDS county crosswalk or county-served locality export.\n- Any reviewed browser/cached locality capture from DESE or DDS that can be truthfully bridged to counties.'
    )
    .replace(
      '## Next State Order After Arizona\n\n1. Massachusetts\n2. Oregon\n3. Oklahoma\n4. Utah\n5. New Hampshire\n6. New Mexico\n7. New York\n8. North Carolina\n9. North Dakota\n10. Rhode Island',
      '## Next State Order After Massachusetts\n\n1. Oregon\n2. Oklahoma\n3. Utah\n4. New Hampshire\n5. New Mexico\n6. New York\n7. North Carolina\n8. North Dakota\n9. Rhode Island\n10. South Carolina'
    );
  fs.writeFileSync(INPUTS.handoff, replacement);
}

function updateLessons() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

export function generateBatch266MassachusettsCityTownFinderNoCountyContractV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const priorityRows = readJsonl(INPUTS.priorityQueue);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: 'blocked_exact_dese_hidden_replay_and_city_town_finder_without_county_contract',
    },
    final_blockers: (summary.final_blockers || []).map((blocker) => (
      blocker.family === 'district_or_county_education_routing'
        ? { ...blocker, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
        : blocker
    )),
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, family_status: 'blocked_exact_dese_hidden_replay_and_city_town_finder_without_county_contract', status_reason: EDUCATION_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'blocked_exact_dese_hidden_replay_and_city_town_finder_without_county_contract',
          sample_count: 4,
          query_basis: 'Reviewed the official DESE hidden bridge, one fresh exact hidden-field replay, and the live official School Finder page.',
          blocker_code: EDUCATION_FAILURE_CODE,
          blocker_evidence: EDUCATION_EVIDENCE,
          samples: [
            ...(row.samples || []).filter((sample) => sample.source_url !== 'https://profiles.doe.mass.edu/search/get_closest_orgs.aspx'),
            {
              sample_name: 'DESE School Finder',
              source_url: 'https://profiles.doe.mass.edu/search/get_closest_orgs.aspx',
              final_url: 'https://profiles.doe.mass.edu/search/get_closest_orgs.aspx',
              verification_status: 'blocked',
              source_type: 'official_city_town_school_finder_without_county_contract',
              source_table: 'batch266_massachusetts_city_town_finder_no_county_contract',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live official School Finder asks users to enter an address, city or town, and distance. It exposes superintendent and address-oriented local search behavior, but no county field, county selector, or export lane.'
            }
          ]
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'district_or_county_education_routing'
      ? { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT_ACTION, evidence: EDUCATION_EVIDENCE }
      : row
  ));

  const updatedPriorityRows = priorityRows.map((row) => (
    (row.state_name || row.state) === 'Massachusetts'
      ? { ...row, classification: 'BLOCKED', index_safe: false, primary_gap_reason: PRIMARY_GAP_REASON, status: 'BLOCKED' }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.priorityQueue, updatedPriorityRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateHandoff();
  updateLessons();

  writeJson(OUTPUTS.batchSummary, {
    batch: 'batch266_massachusetts_city_town_finder_no_county_contract_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'massachusetts',
    classification: 'BLOCKED',
    index_safe: false,
    live_school_finder_url: 'https://profiles.doe.mass.edu/search/get_closest_orgs.aspx',
    education_blocker_code: EDUCATION_FAILURE_CODE,
    school_finder_contract: 'address_city_town_only_no_county_no_export'
  });

  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 266 Massachusetts City/Town Finder No County Contract Report v1',
      '',
      '- classification: BLOCKED',
      '- index_safe: false',
      '- refined_family: district_or_county_education_routing',
      `- failure_code: ${EDUCATION_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${EDUCATION_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- Massachusetts remains blocked and not index-safe.',
      '- One more bounded official DESE pass found a live School Finder, but it is only address/city/town based and still does not expose a county contract or export lane.',
      '- The hidden district-directory replay still does not materialize local rows, so the official education lane remains source-final for low-token work.',
    ].join('\n') + '\n'
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch266MassachusettsCityTownFinderNoCountyContractV1();
  console.log(JSON.stringify(result, null, 2));
}
