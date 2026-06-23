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
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch152_idaho_leaf_authoring_packets_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch152-idaho-leaf-authoring-packets-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
  educationPacket: path.join(generatedDir, 'idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'idaho_county_local_disability_resources_leaf_authoring_packet_v1.json'),
};

const EDUCATION_STATUS_REASON = 'The Idaho education packet now has a deterministic district-owned leaf authoring lane, but the family remains blocked because 44/44 current county rows still point at statewide SDE fallbacks rather than reviewed district-owned special-education leaves. The official Idaho SDE district directory proves 116 exact outbound district website links exist, but the public directory itself still exposes no county labels and no district special-education contact fields, so county-grade education routing still depends on reviewed district-owned authoring targets.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho SDE pages plus the live school_district DB rows. The official School Districts directory at https://www.sde.idaho.gov/school-districts/ still proves 116 exact outbound district website links, but the public directory page itself still exposes no county labels and no district special-education contact fields. A live DB reconciliation shows all 44 Idaho county rows still point at statewide SDE fallback URLs instead of district-owned leaves: 42 rows use https://www.sde.idaho.gov/sped/ and 2 rows (Ada and Canyon) still use the generic SDE root https://www.sde.idaho.gov/. Idaho therefore still needs district-owned leaf authoring, but the next lane can now work from a deterministic packet instead of rereading the statewide directory.';

const COUNTY_STATUS_REASON = 'The Idaho county-local packet now has a deterministic exact-office authoring lane, but the family remains blocked because the public DHW office stack still does not expose county-to-office mapping. Eighteen county rows now name-match reviewed official office leaves, 27 rows still rely on the dead legacy locator, and Canyon County still has a duplicated Caldwell/Nampa split where the only reviewed Nampa mention is Southwest Idaho Treatment Center rather than a county-benefits office leaf.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho DHW office routing pages plus the live county_offices DB rows. The paginated official directory and sitemap still prove exact office leaves such as Boise, Caldwell, Pocatello, Blackfoot, Idaho Falls, Rexburg, Moscow, Payette, and Sandpoint-Ponderay. A live DB reconciliation shows 18 DOI-backed county rows already name-match reviewed official office leaves, 27 county rows still use the dead legacy locator https://dhhs.idaho.gov/locations, and Canyon County remains duplicated across Caldwell and Nampa. The bounded Nampa follow-up still resolves only to Southwest Idaho Treatment Center (SWITC) at 1660 11th Ave N, Nampa, ID 83687, not to a county office or benefits office leaf. Idaho therefore still lacks a public county-to-office contract, but the next lane can now work from a deterministic office-leaf packet instead of rereading the statewide directory.';

const LESSON_HEADING = '### Turn A Sharpened Blocker Into A Deterministic Packet Before Rechecking The Same Statewide Directory';
const LESSON_BODY = '*   **Lesson:** If a blocker is already sharp and the only remaining work is exact local leaf authoring, persist a state-specific packet from the current DB plus reviewed statewide directory evidence instead of re-reading the same statewide pages again. Idaho’s next honest step was not another pass on `school-districts/` or `/offices`, but a deterministic district/office packet that captures the fallback rows, exact leaf names, and unresolved county splits on disk.';

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
    '# Idaho California-Grade Audit Report v2',
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
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education is still blocked on county-keyed or reviewed district special-education routing, but the next lane now has a dedicated Idaho district-owned leaf packet instead of only a statewide directory blocker.',
    '- County-local is still blocked because the public office directory does not map exact office leaves back to counties, but the next lane now has a dedicated Idaho office-leaf packet that captures the 18 exact matches, 27 legacy rows, and the unresolved Canyon/Nampa split.',
  ].join('\n') + '\n';
}

function getEducationPacket(db) {
  const districtRows = db.prepare(`
    select county_id, website, source_url, name
    from school_districts
    where county_id like '%-id'
    order by county_id
  `).all();

  const affectedCounties = districtRows.map((row) => row.county_id);
  const genericRootRows = districtRows.filter((row) => row.source_url === 'https://www.sde.idaho.gov/').length;
  const statewideFallbackRows = districtRows.filter((row) => row.source_url === 'https://www.sde.idaho.gov/sped/').length;

  return {
    state: 'idaho',
    state_code: 'ID',
    family: 'district_or_county_education_routing',
    repair_lane: 'county_district_leaf_repair',
    purpose: 'Deterministic authoring packet for replacing statewide Idaho SDE fallback rows with reviewed district-owned special-education or student-services leaves.',
    current_problem_metrics: {
      statewideFallbackRows,
      genericRootRows,
      authoredExactLeafCount: 0,
      officialDistrictLinks: 116,
    },
    exact_target_goals: [
      'district special education page',
      'district student services or exceptional student services page',
      'district special education contact or department page',
    ],
    exact_target_terms: [
      'special education',
      'student services',
      'special services',
      'exceptional student services',
      'parent rights',
      'procedural safeguards',
      'special education contact',
    ],
    representative_sources: [
      'https://www.sde.idaho.gov/school-districts/',
      'https://www.sde.idaho.gov/about-us/departments/special-education/',
    ],
    root_domains_to_review: [
      'district-owned Idaho K-12 domains reached from the official Idaho School Districts directory',
      'https://www.sde.idaho.gov/school-districts/',
    ],
    affected_counties: affectedCounties,
    packet_complete_when: 'At least one reviewed district-owned education-routing leaf is authored for every Idaho county without relying on the statewide SDE fallback URLs.',
  };
}

function getCountyPacket(db) {
  const officeRows = db.prepare(`
    select county_id, website, source_url, office_name
    from county_offices
    where county_id like '%-id'
    order by county_id, office_name
  `).all();

  const uniqueCounties = [...new Set(officeRows.map((row) => row.county_id))];
  const doiMirrorRows = officeRows.filter((row) => row.source_url === 'https://doi.org/10.7910/DVN/AVRHMI').length;
  const legacyLocatorRows = officeRows.filter((row) => row.source_url === 'https://dhhs.idaho.gov/locations').length;
  const canyonRows = officeRows.filter((row) => row.county_id === 'canyon-id').map((row) => row.office_name);

  return {
    state: 'idaho',
    state_code: 'ID',
    family: 'county_local_disability_resources',
    repair_lane: 'county_district_leaf_repair',
    purpose: 'Deterministic authoring packet for replacing Idaho DOI and dead-locator office fallbacks with reviewed DHW office leaves where county mapping is publicly supportable.',
    current_problem_metrics: {
      doiMirrorRows,
      legacyLocatorRows,
      authoredExactLeafCount: 18,
      officialOfficeLeaves: 27,
      unresolvedDuplicateCountyRows: canyonRows.length,
    },
    exact_target_goals: [
      'exact DHW office leaf with address and phone',
      'county-to-office contract if publicly available',
      'resolved county mapping for duplicated county office guesses',
    ],
    exact_target_terms: [
      'office',
      'service location',
      'medicaid',
      'benefits',
      'address',
      'phone',
      'counties served',
    ],
    representative_sources: [
      'https://healthandwelfare.idaho.gov/offices',
      'https://healthandwelfare.idaho.gov/sitemap.xml',
    ],
    root_domains_to_review: [
      'https://healthandwelfare.idaho.gov/offices',
      'https://healthandwelfare.idaho.gov/sitemap.xml',
    ],
    affected_counties: uniqueCounties,
    unresolved_county_splits: [
      {
        county_id: 'canyon-id',
        competing_office_names: canyonRows,
        reviewed_negative_proof: 'Nampa mention resolves only to Southwest Idaho Treatment Center, not a county benefits office leaf.',
      },
    ],
    packet_complete_when: 'Every Idaho county row either points at a reviewed exact DHW office leaf with truthful county mapping support or remains explicitly blocked where the public office stack exposes no county-to-office contract.',
  };
}

export function generateBatch152IdahoLeafAuthoringPacketsV1() {
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
        query_basis: 'Reviewed Idaho SDE statewide directory plus live DB fallback inventory; generated a district-owned leaf authoring packet from the current blocker state.',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed Idaho DHW office directory, sitemap-exposed office leaves, live DB fallback inventory, and generated an office-leaf authoring packet from the current blocker state.',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        next_action: 'use_idaho_district_leaf_packet_to_attach_reviewed_district_owned_special_education_or_student_services_leaves',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        next_action: 'use_idaho_office_leaf_packet_to_replace_doi_rows_and_keep_unmapped_legacy_counties_blocked',
        evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(OUTPUTS.educationPacket, educationPacket);
  writeJson(OUTPUTS.countyPacket, countyPacket);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    state: 'idaho',
    classification: summary.classification,
    index_safe: summary.index_safe,
    completeness_pct: summary.completeness_pct,
    primary_gap_reason: summary.primary_gap_reason,
    authored_packets: [
      path.relative(repoRoot, OUTPUTS.educationPacket),
      path.relative(repoRoot, OUTPUTS.countyPacket),
    ],
    education_statewide_fallback_rows: educationPacket.current_problem_metrics.statewideFallbackRows,
    education_generic_root_rows: educationPacket.current_problem_metrics.genericRootRows,
    county_doi_mirror_rows: countyPacket.current_problem_metrics.doiMirrorRows,
    county_legacy_locator_rows: countyPacket.current_problem_metrics.legacyLocatorRows,
    county_unresolved_split_rows: countyPacket.current_problem_metrics.unresolvedDuplicateCountyRows,
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 152 Idaho Leaf Authoring Packets Report v1',
      '',
      'This pass does not reopen broad discovery. It turns Idaho’s sharpened statewide blockers into deterministic district and office leaf packets so the next repair lane can work exact local targets from disk.',
      '',
      `- classification: ${summary.classification}`,
      `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
      `- education_statewide_fallback_rows: ${educationPacket.current_problem_metrics.statewideFallbackRows}`,
      `- education_generic_root_rows: ${educationPacket.current_problem_metrics.genericRootRows}`,
      `- county_doi_mirror_rows: ${countyPacket.current_problem_metrics.doiMirrorRows}`,
      `- county_legacy_locator_rows: ${countyPacket.current_problem_metrics.legacyLocatorRows}`,
      `- county_unresolved_split_rows: ${countyPacket.current_problem_metrics.unresolvedDuplicateCountyRows}`,
      '',
      '## Authored packets',
      '',
      `- ${path.relative(repoRoot, OUTPUTS.educationPacket)}`,
      `- ${path.relative(repoRoot, OUTPUTS.countyPacket)}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === __filename || (process.argv[1] && path.resolve(process.argv[1]) === __filename)) {
  const summary = generateBatch152IdahoLeafAuthoringPacketsV1();
  console.log(JSON.stringify(summary, null, 2));
}
