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
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch154_kansas_blocker_packets_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch154-kansas-blocker-packets-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
  ddPacket: path.join(generatedDir, 'kansas_developmental_disability_idd_authority_repair_packet_v1.json'),
  educationPacket: path.join(generatedDir, 'kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
};

const DD_STATUS_REASON = 'Kansas now has a deterministic DD repair packet, but the family remains blocked because the only live state-agency DD row in the DB still points at the dead dhhs.kansas.gov/dd root and the reviewed KDADS replacement remains access denied. The next honest lane is exact alternative-official DD leaf review, not another generic statewide probe.';
const DD_EVIDENCE = 'Reviewed 2026-06-22 current Kansas DD blocker artifacts plus the live state_resource_agencies DB rows. The only Kansas DD authority row still points at the dead legacy root https://dhhs.kansas.gov/dd, while the current reviewed replacement root on the KDADS host remains HTTP 403 Forbidden / access denied instead of serving DD, intake, or eligibility content. Kansas therefore still lacks a reviewed official DD authority leaf, but the next lane can now work from a deterministic DD repair packet that binds the stale DB row, the dead legacy root, and the blocked replacement host together on disk.';

const EDUCATION_STATUS_REASON = 'Kansas now has a deterministic district-routing authoring packet, but the family remains blocked because all 105 current school_district rows still point at statewide KSDE placeholders rather than reviewed district-owned leaves. The live KSDE map/report stack proves official statewide county and district roots exist, but it still does not preserve a reviewable county-to-district join or district-owned special-education contact contract.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 current Kansas education blocker artifacts plus the live school_districts DB rows. All 105 Kansas county rows still point at the statewide KSDE root https://www.ksde.org/ with the same placeholder website https://www.ksde.org/Default.aspx?tabid=101. The official KSDE School District Maps page, Special Education root, Dispute Resolution page, Parent Rights page, Data Central Special Education Reports page, and the live USD county map PDF at https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5 remain the right statewide authoring roots, but the packet still preserves no reviewable county-to-district join and no district-owned special-education contact source. Kansas therefore still needs district-owned leaf authoring, but the next lane can now work from a deterministic packet instead of rereading the same statewide KSDE materials.';

const DD_NEXT_ACTION = 'use_kansas_dd_repair_packet_to_try_reviewed_alt_official_dd_leaves_before_any_new_statewide_probe';
const EDUCATION_NEXT_ACTION = 'use_kansas_district_leaf_packet_to_replace_105_ksde_placeholder_rows_with_reviewed_district_owned_special_education_leaves';

const LESSON_HEADING = '### When A Live Statewide Map Root Exists But All Local Rows Still Point To One Placeholder, Packetize The Placeholder First';
const LESSON_BODY = '*   **Lesson:** If a state already has a live statewide map or directory root but every county or district row in the DB still points at the same placeholder URL, stop retrying the statewide source and write a state packet from the placeholder inventory first. Kansas already had a live KSDE map stack, but the real next step was a packet proving all 105 district rows still used the same KSDE fallback so later authoring can replace them deterministically.';

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
    '# Kansas California-Grade Education Leaf Rehydration v1',
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
    '- Kansas remains BLOCKED and not index-safe.',
    '- The DD family is still blocked because the only DB DD agency row still points at the dead dhhs.kansas.gov root and the reviewed KDADS replacement is still access denied, but the next lane now has an explicit DD repair packet instead of a generic browser-assisted note.',
    '- County-grade education routing is still blocked because all 105 district rows still use one statewide KSDE placeholder, but the next lane now has a deterministic district-owned leaf packet built from the placeholder inventory and the reviewed KSDE statewide roots.',
  ].join('\n') + '\n';
}

function getDdPacket(db) {
  const ddRows = db.prepare(`
    select id, state_id, agency_type, name, website, source_url, verification_status
    from state_resource_agencies
    where state_id = 'kansas' and agency_type = 'dd_intake'
    order by id
  `).all();

  return {
    state: 'kansas',
    state_code: 'KS',
    family: 'developmental_disability_idd_authority',
    repair_lane: 'reviewed_official_leaf_repair',
    purpose: 'Deterministic repair packet for replacing Kansas DD stale-root evidence with a reviewed official DD authority leaf if one exists.',
    current_problem_metrics: {
      staleLegacyDbRows: ddRows.filter((row) => row.source_url === 'https://dhhs.kansas.gov/dd').length,
      deadLegacyRoots: 1,
      reviewedBlockedReplacementRoots: 1,
      authoredExactLeafCount: 0,
    },
    exact_target_goals: [
      'official Kansas DD intake or application leaf',
      'official Kansas DD eligibility or services entry leaf',
      'official Kansas DD appeals or complaint leaf if published',
    ],
    exact_target_terms: [
      'developmental disabilities',
      'intellectual/developmental disability',
      'I/DD',
      'application',
      'eligibility',
      'intake',
      'services',
    ],
    representative_sources: [
      'https://dhhs.kansas.gov/dd',
      'https://www.kdads.ks.gov/',
      'https://www.kancare.ks.gov/',
      'https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000',
    ],
    root_domains_to_review: [
      'https://www.kdads.ks.gov/',
      'browser-assisted reviewed KDADS DD leaves if access permits',
      'KanCare HCBS crossover pages only as supporting context, not completion proof',
    ],
    stale_db_rows: ddRows,
    packet_complete_when: 'Kansas has a reviewed official DD authority leaf that preserves DD intake, eligibility, or entry routing without relying on the dead dhhs.kansas.gov/dd root or a blocked KDADS shell.',
  };
}

function getEducationPacket(db) {
  const districtRows = db.prepare(`
    select county_id, name, source_url, website
    from school_districts
    where county_id like '%-ks'
    order by county_id
  `).all();

  const affectedCounties = districtRows.map((row) => row.county_id);
  const statewideSourceRows = districtRows.filter((row) => row.source_url === 'https://www.ksde.org/').length;
  const statewideWebsiteRows = districtRows.filter((row) => row.website === 'https://www.ksde.org/Default.aspx?tabid=101').length;

  return {
    state: 'kansas',
    state_code: 'KS',
    family: 'district_or_county_education_routing',
    repair_lane: 'county_district_leaf_repair',
    purpose: 'Deterministic authoring packet for replacing Kansas statewide KSDE placeholder rows with reviewed district-owned education-routing leaves.',
    current_problem_metrics: {
      placeholderSourceRows: statewideSourceRows,
      placeholderWebsiteRows: statewideWebsiteRows,
      authoredExactLeafCount: 0,
      countyRowCount: districtRows.length,
      officialMapPdfCount: 1,
      officialStatewideAuthoringRoots: 5,
    },
    exact_target_goals: [
      'district-owned special education page',
      'district-owned student services or exceptional education page',
      'district-owned parent rights or procedural safeguards page when used locally',
    ],
    exact_target_terms: [
      'special education',
      'student services',
      'special services',
      'exceptional children',
      'procedural safeguards',
      'parent rights',
      'child find',
    ],
    representative_sources: [
      'https://www.ksde.gov/policy-and-funding/special-education',
      'https://www.ksde.gov/policy-and-funding/special-education/dispute-resolution',
      'https://www.ksde.gov/policy-and-funding/special-education/special-education-in-kansas/procedural-safeguards-parent-rights',
      'https://www.ksde.gov/policy-and-funding/special-education/data-central-special-education-reports',
      'https://www.ksde.gov/policy-and-funding/special-education/school-district-maps',
      'https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5',
    ],
    root_domains_to_review: [
      'district-owned Kansas USD domains derived from official KSDE county and district map roots',
      'https://www.ksde.gov/policy-and-funding/special-education/school-district-maps',
      'https://www.ksde.gov/policy-and-funding/special-education/data-central-special-education-reports',
    ],
    affected_counties: affectedCounties,
    packet_complete_when: 'Every Kansas county row either points at a reviewed district-owned education-routing leaf or remains explicitly blocked where no district-owned local contract has been preserved.',
  };
}

export function generateBatch154KansasBlockerPacketsV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const db = new Database(dbPath, { readonly: true });

  const ddPacket = getDdPacket(db);
  const educationPacket = getEducationPacket(db);
  db.close();

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return { ...row, status_reason: DD_STATUS_REASON };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, status_reason: EDUCATION_STATUS_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return { ...row, evidence: DD_EVIDENCE };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: EDUCATION_EVIDENCE };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        query_basis: 'Reviewed current Kansas DD blocker artifacts plus live state_resource_agencies stale-root inventory; generated a DD repair packet from the dead legacy root and the blocked replacement host.',
        blocker_evidence: DD_EVIDENCE,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        query_basis: 'Reviewed current Kansas KSDE statewide roots plus live school_district placeholder inventory; generated a district-owned leaf authoring packet from the current blocker state.',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return { ...row, next_action: DD_NEXT_ACTION, evidence: DD_EVIDENCE };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, next_action: EDUCATION_NEXT_ACTION, evidence: EDUCATION_EVIDENCE };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    final_blockers: [
      {
        family: 'developmental_disability_idd_authority',
        severity: 'critical',
        failure_code: 'legacy_dd_root_dead_and_reviewed_replacement_access_blocked',
        evidence: DD_EVIDENCE,
        next_action: DD_NEXT_ACTION,
      },
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'official_statewide_education_leaves_live_but_no_county_or_district_contract_preserved',
        evidence: EDUCATION_EVIDENCE,
        next_action: EDUCATION_NEXT_ACTION,
      },
    ],
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(OUTPUTS.ddPacket, ddPacket);
  writeJson(OUTPUTS.educationPacket, educationPacket);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const batchSummary = {
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    dd_packet_created: true,
    education_packet_created: true,
    dd_stale_legacy_rows: ddPacket.current_problem_metrics.staleLegacyDbRows,
    district_placeholder_rows: educationPacket.current_problem_metrics.placeholderSourceRows,
    lessons_updated: lessonsUpdated,
    authored_packets: [
      'data/generated/kansas_developmental_disability_idd_authority_repair_packet_v1.json',
      'data/generated/kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json',
    ],
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${stateReport}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch154KansasBlockerPacketsV1();
  console.log(JSON.stringify(result, null, 2));
}
