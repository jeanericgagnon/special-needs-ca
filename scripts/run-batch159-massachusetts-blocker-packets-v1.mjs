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
  summary: path.join(generatedDir, 'massachusetts_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'massachusetts_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'massachusetts_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'massachusetts_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'massachusetts_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch159_massachusetts_blocker_packets_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch159-massachusetts-blocker-packets-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'massachusetts-california-grade-audit-report-v2.md'),
  educationPacket: path.join(generatedDir, 'massachusetts_district_or_county_education_routing_postback_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'massachusetts_county_local_disability_resources_host403_packet_v1.json'),
};

const EDUCATION_STATUS_REASON = 'Massachusetts education remains blocked because the official DESE Profiles POST bridge is real but still does not produce any county-keyed routing contract. All 14 county rows still point at one statewide DESE fallback, so the next lane is evidence-only until an official county-to-district export or filter exists.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 current Massachusetts DESE blocker artifacts plus the live school_districts DB rows. All 14 Massachusetts county education rows still point at the same statewide DESE fallback https://www.doe.mass.edu/sped/. The official DESE Profiles bridge does return real district result rows with district names, superintendent contacts, addresses, phones, and grades, but the reviewed result surface still exposes no county column, county filter, or county-to-district export contract. Massachusetts therefore still lacks county-grade education routing evidence, but the next lane can now work from a deterministic postback packet instead of a generic blocker note.';

const COUNTY_STATUS_REASON = 'Massachusetts county-local routing remains blocked because the likely official DDS lane is host-wide 403 in the low-token runtime, while the current county_offices inventory is only a mix of 8 dead legacy storefront placeholders and 7 DOI mirrors. The next lane is browser-or-cached host capture only, not generic discovery.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 current Massachusetts DDS blocker artifacts plus the live county_offices DB rows. Bounded low-token fetches to the Mass.gov DDS org page, the DDS area-offices page, and the Mass.gov sitemap all returned HTTP 403, which means the likely official county-local lane is blocked at the host level in the current runtime. A live DB reconciliation shows the county_offices table still contains only 8 dead legacy storefront placeholders rooted at https://dhhs.massachusetts.gov/locations and 7 DOI mirror rows, with Suffolk County duplicated across Charlestown and Chelsea enrollment center guesses. Massachusetts therefore still lacks a reviewed county-grade local office contract, but the next lane can now work from a deterministic host-403 packet instead of an open-ended browser-assisted note.';

const EDUCATION_NEXT_ACTION = 'use_massachusetts_dese_postback_packet_and_hold_blocked_until_official_county_to_district_contract_exists';
const COUNTY_NEXT_ACTION = 'use_massachusetts_dds_host403_packet_for_browser_or_cached_capture_only';

const LESSON_HEADING = '### When A Stateful Directory POST Is Real But Not County-Keyed, Packetize It As Evidence-Only';
const LESSON_BODY = '*   **Lesson:** If an official directory POSTback returns real local rows but still lacks the county field you need, keep that lane as evidence-only instead of treating it like partial county coverage. Massachusetts DESE Profiles returned real district contacts, but without a county column or export contract it still could not clear county-grade routing.';

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
    '- Education is still blocked because the DESE Profiles result surface is real but not county-keyed, and the next lane now has an explicit postback packet instead of a generic hold note.',
    '- County-local is still blocked because the Mass.gov DDS lane is host-wide 403 in the low-token runtime, and the next lane now has an explicit host-403 packet instead of an open-ended browser-assisted note.',
  ].join('\n') + '\n';
}

function getEducationPacket(db) {
  const districtRows = db.prepare(`
    select county_id, name, source_url, website
    from school_districts
    where county_id like '%-ma'
    order by county_id
  `).all();

  return {
    state: 'massachusetts',
    state_code: 'MA',
    family: 'district_or_county_education_routing',
    repair_lane: 'evidence_only_postback_packet',
    purpose: 'Deterministic packet for Massachusetts DESE Profiles postback evidence while county-to-district routing remains unavailable.',
    current_problem_metrics: {
      statewideFallbackRows: districtRows.filter((row) => row.source_url === 'https://www.doe.mass.edu/sped/').length,
      statewideWebsiteRows: districtRows.filter((row) => row.website === 'https://www.doe.mass.edu/sped/').length,
      countyRowCount: districtRows.length,
      realPostbackResultSurface: true,
      countyMappingFieldsPresent: false,
    },
    exact_target_goals: [
      'official county-to-district export contract',
      'official county filter or county column on DESE result surface',
      'reviewed local district contract only if county keyed by official evidence',
    ],
    representative_sources: [
      'https://profiles.doe.mass.edu/search/search.aspx?leftNavId=11238',
      'https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238',
      'https://www.doe.mass.edu/sped/',
    ],
    root_domains_to_review: [
      'official DESE Profiles search and postback surfaces only',
      'do not infer county mapping from district names like Bristol County Agricultural without an official county-keyed contract',
    ],
    affected_counties: districtRows.map((row) => row.county_id),
    packet_complete_when: 'Massachusetts can reopen education only when an official DESE surface preserves a county-to-district contract rather than just district result rows.',
  };
}

function getCountyPacket(db) {
  const officeRows = db.prepare(`
    select county_id, office_name, source_url
    from county_offices
    where county_id like '%-ma'
    order by county_id, office_name
  `).all();

  const multiOffice = [...new Set(officeRows.map((row) => row.county_id))]
    .map((countyId) => ({
      county_id: countyId,
      office_names: officeRows.filter((row) => row.county_id === countyId).map((row) => row.office_name),
    }))
    .filter((row) => row.office_names.length > 1);

  return {
    state: 'massachusetts',
    state_code: 'MA',
    family: 'county_local_disability_resources',
    repair_lane: 'browser_or_cached_capture_only',
    purpose: 'Deterministic packet for Massachusetts DDS county-local routing while the likely official Mass.gov lane stays host-wide 403 in the low-token runtime.',
    current_problem_metrics: {
      legacyLocatorRows: officeRows.filter((row) => row.source_url === 'https://dhhs.massachusetts.gov/locations').length,
      doiMirrorRows: officeRows.filter((row) => row.source_url === 'https://doi.org/10.7910/DVN/AVRHMI').length,
      countyRowCount: officeRows.length,
      multiOfficeCountyCount: multiOffice.length,
      hostWide403Surfaces: 3,
    },
    exact_target_goals: [
      'reviewed DDS area-office capture from browser or cached artifact',
      'official county-grade local office contract on Mass.gov',
      'replacement of legacy and DOI rows only after host-level capture succeeds',
    ],
    representative_sources: [
      'https://www.mass.gov/orgs/department-of-developmental-services',
      'https://www.mass.gov/info-details/dds-area-offices',
      'https://www.mass.gov/sitemap.xml',
    ],
    root_domains_to_review: [
      'browser-assisted or cached Mass.gov DDS captures only',
      'do not reopen generic county-office discovery until the host-wide 403 lane is bypassed with reviewed evidence',
    ],
    affected_counties: [...new Set(officeRows.map((row) => row.county_id))],
    unresolved_multi_office_counties: multiOffice,
    packet_complete_when: 'Massachusetts can reopen county-local only when a reviewed Mass.gov DDS area-office capture or another official county-grade local office contract is preserved on disk.',
  };
}

export function generateBatch159MassachusettsBlockerPacketsV1() {
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
        query_basis: 'Reviewed Massachusetts DESE postback artifacts plus live school_district fallback inventory; generated an evidence-only postback packet from the current blocker state.',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed Massachusetts DDS host-403 blocker artifacts plus live county_offices fallback inventory; generated a host-403 packet from the current blocker state.',
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

  writeJson(INPUTS.summary, summary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(OUTPUTS.educationPacket, educationPacket);
  writeJson(OUTPUTS.countyPacket, countyPacket);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const stateReport = buildStateReport(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const batchSummary = {
    state: 'massachusetts',
    classification: summary.classification,
    index_safe: summary.index_safe,
    education_packet_created: true,
    county_packet_created: true,
    education_placeholder_rows: educationPacket.current_problem_metrics.statewideFallbackRows,
    county_legacy_rows: countyPacket.current_problem_metrics.legacyLocatorRows,
    county_doi_rows: countyPacket.current_problem_metrics.doiMirrorRows,
    lessons_updated: lessonsUpdated,
    authored_packets: [
      'data/generated/massachusetts_district_or_county_education_routing_postback_packet_v1.json',
      'data/generated/massachusetts_county_local_disability_resources_host403_packet_v1.json',
    ],
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${stateReport}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch159MassachusettsBlockerPacketsV1();
  console.log(JSON.stringify(result, null, 2));
}
