import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');
const dbPath = path.join(repoRoot, 'ca_disability_navigator.db');

const INPUTS = {
  summary: path.join(generatedDir, 'maine_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'maine_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'maine_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maine_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'maine_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch155_maine_blocker_packets_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch155-maine-blocker-packets-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maine-california-grade-audit-report-v2.md'),
  educationPacket: path.join(generatedDir, 'maine_district_or_county_education_routing_manual_export_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'maine_county_local_disability_resources_mapping_packet_v1.json'),
};

const EDUCATION_STATUS_REASON = 'Maine now has a deterministic education manual-export packet, but the family remains blocked because the official NEO SAU contact search still returns HTTP 500 on bounded result and export actions. All 16 current county education rows still point at statewide DOE fallbacks, so the next honest lane is reviewed browser-assisted capture or manual export from the live official form, not more blind POST replay.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 current Maine education blocker artifacts plus the live school_districts DB rows. Fourteen county rows still point at the statewide special-education root https://www.maine.gov/doe/learning/specialed and two rows still point at the generic DOE root https://www.maine.gov/doe, while all 16 rows use the statewide special-education page as the website field. The official DOE workbook plus live NEO town and SAU selector pages remain the correct local-routing authoring roots, but bounded POST replays with concrete public organizations such as Portland Public Schools (OrgId 364), York Public Schools (OrgId 542), and RSU 60/MSAD 60 (OrgId 913) still return HTTP 500 before yielding verified local contact rows or an export file. Maine therefore still needs reviewed browser-assisted capture or manual export, but the next lane can now work from a deterministic packet instead of rereading the same statewide selectors.';

const COUNTY_STATUS_REASON = 'Maine now has a deterministic county-office mapping packet, but the family remains blocked because the live DHHS district office directory still lacks a public county or town coverage contract. Sixteen current county-office rows are still DOI mirrors and four still use the dead dhhs.maine.gov/locations storefront fallback, with multi-office ambiguity preserved for Aroostook, Washington, and York counties.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 current Maine county-office blocker artifacts plus the live county_offices DB rows. The official DHHS District Office Locations page is real and preserves district office addresses, phones, and eligibility notes, but it still does not publish county coverage or a public town/county lookup contract. A live DB reconciliation shows 16 Maine county-office rows still depend on the DOI mirror source https://doi.org/10.7910/DVN/AVRHMI and 4 rows still use the dead legacy fallback https://dhhs.maine.gov/locations. The unresolved multi-office counties on the current packet are Aroostook (Caribou, Fort Kent, Houlton), Washington (Calais, Machias), and York (Biddeford, Sanford). Maine therefore still lacks a county-to-office contract, but the next lane can now work from a deterministic mapping packet instead of rereading the same district office directory.';

const EDUCATION_NEXT_ACTION = 'use_maine_education_manual_export_packet_to_capture_reviewed_sau_contacts_and_replace_16_statewide_fallback_rows';
const COUNTY_NEXT_ACTION = 'use_maine_county_office_mapping_packet_to_resolve_doi_and_dead_locator_rows_or_keep_unmapped_counties_blocked';

const LESSON_HEADING = '### If A Real Official Form Exposes CSRF And Public IDs But Every Bounded Submit Returns 500, Packetize It As Manual Export';
const LESSON_BODY = '*   **Lesson:** If an official public form exposes a real CSRF token, public selector IDs, and explicit submit actions but every bounded POST replay still returns 500, stop spending tokens on replay variations and move the lane to a manual-export packet. Maine’s NEO SAU search proved the public contract was real, but the right next step was a deterministic capture packet, not more blind POST attempts.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Maine California-Grade Audit Report v2',
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
    '- Maine remains BLOCKED and not index-safe.',
    '- Education is still blocked because the official NEO SAU contact workflow remains a real public contract that still fails at the result/export stage, but the next lane now has an explicit manual-export packet instead of a generic browser-assisted note.',
    '- County-local is still blocked because the DHHS district office stack still lacks county coverage mapping, but the next lane now has a deterministic county-office mapping packet that captures the DOI mirrors, dead locator rows, and the three multi-office counties.',
  ].join('\n') + '\n';
}

function getEducationPacket(db) {
  const districtRows = db.prepare(`
    select county_id, name, source_url, website
    from school_districts
    where county_id like '%-me'
    order by county_id
  `).all();

  const affectedCounties = districtRows.map((row) => row.county_id);

  return {
    state: 'maine',
    state_code: 'ME',
    family: 'district_or_county_education_routing',
    repair_lane: 'manual_export_capture',
    purpose: 'Deterministic packet for replacing Maine statewide education fallback rows with reviewed SAU or district contact captures from the live official NEO workflow.',
    current_problem_metrics: {
      statewideSpecialEdSourceRows: districtRows.filter((row) => row.source_url === 'https://www.maine.gov/doe/learning/specialed').length,
      genericDoeSourceRows: districtRows.filter((row) => row.source_url === 'https://www.maine.gov/doe').length,
      statewideWebsiteRows: districtRows.filter((row) => row.website === 'https://www.maine.gov/doe/learning/specialed').length,
      countyRowCount: districtRows.length,
      reviewedSelectorRoots: 4,
      boundedPostReplayFailures: 3,
    },
    exact_target_goals: [
      'reviewed SAU contact export or result capture with local superintendent or district contact rows',
      'reviewed district-owned special education leaf where the official export remains unavailable',
      'replacement of statewide DOE fallback rows with local SAU or district evidence',
    ],
    exact_target_terms: [
      'superintendent',
      'contact',
      'SAU',
      'organization',
      'special education',
      'district office',
    ],
    representative_sources: [
      'https://www.maine.gov/doe/sites/maine.gov.doe/files/inline-files/School%20Finance%20-%202026%20SAU%20by%20Municipality%20-%204.1.2026.xlsx',
      'https://neo.maine.gov/DOE/neo/Supersearch/Supersearch/Town',
      'https://neo.maine.gov/DOE/neo/Supersearch/ContactSearch/ContactSearchBySAU',
      'https://neo.maine.gov/doe/neo/SuperSearch/Home/Index',
    ],
    public_orgids_already_tested: [
      { org_id: 364, org_name: 'Portland Public Schools' },
      { org_id: 542, org_name: 'York Public Schools' },
      { org_id: 913, org_name: 'RSU 60/MSAD 60' },
    ],
    affected_counties: affectedCounties,
    packet_complete_when: 'Every Maine county row either points at reviewed local SAU or district contact evidence or remains explicitly blocked because the official NEO workflow still fails to publish public results.',
  };
}

function getCountyPacket(db) {
  const officeRows = db.prepare(`
    select county_id, office_name, source_url
    from county_offices
    where county_id like '%-me'
    order by county_id, office_name
  `).all();

  const multiOffice = [...new Set(officeRows.map((row) => row.county_id))]
    .map((countyId) => ({
      county_id: countyId,
      office_names: officeRows.filter((row) => row.county_id === countyId).map((row) => row.office_name),
    }))
    .filter((row) => row.office_names.length > 1);

  return {
    state: 'maine',
    state_code: 'ME',
    family: 'county_local_disability_resources',
    repair_lane: 'county_mapping_repair',
    purpose: 'Deterministic packet for replacing Maine DOI and dead-locator county-office rows only where a truthful county-to-office mapping contract can be proven.',
    current_problem_metrics: {
      doiMirrorRows: officeRows.filter((row) => row.source_url === 'https://doi.org/10.7910/DVN/AVRHMI').length,
      deadLocatorRows: officeRows.filter((row) => row.source_url === 'https://dhhs.maine.gov/locations').length,
      countyRowCount: officeRows.length,
      multiOfficeCountyCount: multiOffice.length,
      officialDistrictOfficeRoots: 1,
    },
    exact_target_goals: [
      'county-to-district-office contract if publicly available',
      'truthful office selection for counties with multiple district offices',
      'replacement of DOI and dead-locator fallback rows only where mapping support exists',
    ],
    exact_target_terms: [
      'district office',
      'county',
      'town',
      'service area',
      'locations',
      'eligibility',
    ],
    representative_sources: [
      'https://www.maine.gov/dhhs/about/contact/offices',
      'https://dhhs.maine.gov/locations',
    ],
    affected_counties: [...new Set(officeRows.map((row) => row.county_id))],
    unresolved_multi_office_counties: multiOffice,
    packet_complete_when: 'Every Maine county office row either maps to a reviewed DHHS district office with public county or town coverage support or remains explicitly blocked where no public mapping contract exists.',
  };
}

export function generateBatch155MaineBlockerPacketsV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const db = new Database(dbPath, { readonly: true });

  const educationPacket = getEducationPacket(db);
  const countyPacket = getCountyPacket(db);
  db.close();

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, status_reason: EDUCATION_STATUS_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, status_reason: COUNTY_STATUS_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        query_basis: 'Reviewed current Maine DOE selector roots plus live school_district fallback inventory; generated a manual-export packet from the current blocker state.',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed current Maine DHHS district office directory plus live county_offices fallback inventory; generated a county-mapping packet from the current blocker state.',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, next_action: EDUCATION_NEXT_ACTION, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'official_sau_contact_search_and_export_actions_return_500',
        evidence: EDUCATION_EVIDENCE,
        next_action: EDUCATION_NEXT_ACTION,
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'official_district_office_pages_lack_county_coverage_contract',
        evidence: COUNTY_EVIDENCE,
        next_action: COUNTY_NEXT_ACTION,
      },
    ],
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(OUTPUTS.educationPacket, educationPacket);
  writeJson(OUTPUTS.countyPacket, countyPacket);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const batchSummary = {
    state: 'maine',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    education_packet_created: true,
    county_packet_created: true,
    statewide_education_fallback_rows: educationPacket.current_problem_metrics.statewideSpecialEdSourceRows + educationPacket.current_problem_metrics.genericDoeSourceRows,
    county_office_fallback_rows: countyPacket.current_problem_metrics.doiMirrorRows + countyPacket.current_problem_metrics.deadLocatorRows,
    lessons_updated: lessonsUpdated,
    authored_packets: [
      'data/generated/maine_district_or_county_education_routing_manual_export_packet_v1.json',
      'data/generated/maine_county_local_disability_resources_mapping_packet_v1.json',
    ],
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${stateReport}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch155MaineBlockerPacketsV1();
  console.log(JSON.stringify(result, null, 2));
}
