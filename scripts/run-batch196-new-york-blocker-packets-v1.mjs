import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-york_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-york_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-york_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-york_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-york_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  countyPacket: path.join(generatedDir, 'new-york_county_local_disability_resources_health_host_packet_v1.json'),
  educationPacket: path.join(generatedDir, 'new-york_district_or_county_education_routing_boces_packet_v1.json'),
  ptiPacket: path.join(generatedDir, 'new-york_parent_training_information_center_scope_packet_v1.json'),
  batchSummary: path.join(generatedDir, 'batch196_new_york_blocker_packets_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch196-new-york-blocker-packets-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement';

const COUNTY_REASON =
  'Reviewed 2026-06-23 the current New York county-local blocker surfaces. The official health.ny.gov Medicaid lane is blocked host-wide, not just at one LDSS page: `ldss.htm`, `robots.txt`, `sitemap.xml`, `/health_care/medicaid/`, and `/health_care/medicaid/redesign/` all returned HTTP 403 in the bounded lane. The old county rows that still point at `ldss.htm` therefore cannot remain as sample proof; only the blocked official host family can truthfully anchor this blocker until a public replacement locator or county-owned directory is verified.';
const EDUCATION_REASON =
  'Reviewed 2026-06-23 the current New York education blocker packet. Verified exact leaves still stop at only three BOCES-owned pages on CA BOCES, Capital Region BOCES, and Broome-Tioga BOCES. That bounded exact-leaf set is useful, but it is still far short of county-grade routing across all 62 New York counties, so the family remains blocked on broader local-leaf authoring rather than on statewide evidence.';
const PTI_REASON =
  'Reviewed 2026-06-23 the saved New York PTI evidence. The only reviewed first-party PTI candidate still on disk is Parent Network of WNY, and its scope language is explicitly Western New York rather than statewide. New York therefore remains blocked on statewide PTI scope proof, not on generic parent-support discovery.';

const LESSON_HEADING =
  '### Regional Parent-Center Scope Cannot Satisfy A Statewide PTI Gate';
const LESSON_BODY =
  '*   **Lesson:** If a reviewed first-party parent-center page clearly limits its reach to one region, keep it as blocker evidence but do not stretch it into statewide PTI proof. New York’s Parent Network of WNY was a valid reviewed source, but its Western New York scope meant the right next step was statewide-scope proof, not another pass over the same regional page.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
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

function buildCountyPacket() {
  return {
    state: 'new-york',
    family: 'county_local_disability_resources',
    repair_lane: 'official_replacement_locator_or_county_owned_directory_only',
    packet_complete_when:
      'A public same-host replacement LDSS locator or reviewed county-owned office directory is attached; reusing the blocked `ldss.htm` host family alone is not enough.',
    current_metrics: {
      countyTotal: 62,
      blockedHealthNySurfaces: 5,
      reviewedReplacementLocatorCount: 0,
    },
    blocked_surfaces: [
      'https://www.health.ny.gov/health_care/medicaid/ldss.htm',
      'https://www.health.ny.gov/robots.txt',
      'https://www.health.ny.gov/sitemap.xml',
      'https://www.health.ny.gov/health_care/medicaid/',
      'https://www.health.ny.gov/health_care/medicaid/redesign/',
    ],
  };
}

function buildEducationPacket() {
  return {
    state: 'new-york',
    family: 'district_or_county_education_routing',
    repair_lane: 'exact_local_leaf_authoring_only',
    packet_complete_when:
      'A materially broader county-grade or district-grade leaf set replaces the current three exact BOCES leaves.',
    current_metrics: {
      countyTotal: 62,
      exactLeafCount: 3,
      bocesDomainsCovered: 3,
    },
    verified_exact_leaves: [
      'https://caboces.org/education/exceptional-education/',
      'https://www.capitalregionboces.org/special-education-2/',
      'https://www.btboces.org/OurServices.aspx',
    ],
  };
}

function buildPtiPacket() {
  return {
    state: 'new-york',
    family: 'parent_training_information_center',
    repair_lane: 'statewide_scope_proof_only',
    packet_complete_when:
      'A reviewed first-party New York PTI source explicitly preserves statewide scope or statewide designation.',
    current_metrics: {
      reviewedRegionalSources: 1,
      reviewedStatewideSources: 0,
    },
    regional_blocker_source: 'http://parentnetworkwny.org/',
    blocker_basis: 'reviewed scope language is Western New York, not statewide',
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New York Blocker Packets v3',
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
    '## Packetized blockers',
    '',
    '- `county_local_disability_resources` now preserves the blocked `health.ny.gov` host family itself instead of reusing stale `ldss.htm` county rows as if they were live proof.',
    '- `district_or_county_education_routing` now preserves the exact three-leaf BOCES ceiling as an authoring packet rather than implying broader county coverage.',
    '- `parent_training_information_center` now preserves the regional-scope PTI blocker as a scope packet rather than a generic source gap.',
    '',
    '## Completion decision',
    '',
    '- New York remains `BLOCKED` and `index_safe=false`.',
    '- County-local remains blocked on a host-wide official 403 plus zero reviewed replacement locators.',
    '- Education remains blocked because three exact BOCES leaves are not enough for 62-county coverage.',
    '- PTI remains blocked because the reviewed first-party source is regional, not statewide.',
  ].join('\n') + '\n';
}

export function generateBatch196NewYorkBlockerPacketsV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'blocked_health_hostwide_403', status_reason: COUNTY_REASON };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_exact_leaf_repair_exhausted', status_reason: EDUCATION_REASON };
    }
    if (row.family === 'parent_training_information_center') {
      return { ...row, family_status: 'blocked_reviewed_regional_source_not_statewide', status_reason: PTI_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'county_local_disability_resources') return { ...row, evidence: COUNTY_REASON };
    if (row.family === 'district_or_county_education_routing') return { ...row, evidence: EDUCATION_REASON };
    if (row.family === 'parent_training_information_center') return { ...row, evidence: PTI_REASON };
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_health_hostwide_403',
        query_basis: 'Reviewed 2026-06-23 the blocked official health.ny.gov Medicaid host family directly.',
        blocker_code: 'bounded_health_ny_medicaid_host_returns_403_without_public_ldss_replacement',
        blocker_evidence: COUNTY_REASON,
        evidence_strength: 'weak',
        sample_count: 5,
        samples: [
          { sample_name: 'LDSS directory', source_url: 'https://www.health.ny.gov/health_care/medicaid/ldss.htm', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
          { sample_name: 'robots.txt', source_url: 'https://www.health.ny.gov/robots.txt', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
          { sample_name: 'sitemap.xml', source_url: 'https://www.health.ny.gov/sitemap.xml', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
          { sample_name: 'Medicaid root', source_url: 'https://www.health.ny.gov/health_care/medicaid/', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
          { sample_name: 'Medicaid redesign', source_url: 'https://www.health.ny.gov/health_care/medicaid/redesign/', verification_status: 'blocked', source_type: 'official_host_403', source_table: 'reviewed_live_probe' },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_repair_exhausted',
        query_basis: 'Reviewed 2026-06-23 the bounded New York BOCES exact-leaf packet already on disk.',
        blocker_code: 'bounded_boces_leaf_packet_exhausted_before_county_grade_coverage',
        blocker_evidence: EDUCATION_REASON,
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'blocked_reviewed_regional_source_not_statewide',
        query_basis: 'Reviewed 2026-06-23 the saved Parent Network of WNY first-party source for scope only.',
        blocker_code: 'reviewed_western_new_york_pti_source_not_statewide',
        blocker_evidence: PTI_REASON,
        evidence_strength: 'weak',
        sample_count: 1,
        samples: [
          {
            sample_name: 'Parent Network of WNY',
            source_url: 'http://parentnetworkwny.org/',
            verification_status: 'reviewed_first_party_regional',
            source_type: 'regional_scope_only',
            source_table: 'source_acquisition_parsed',
          },
        ],
      };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
  };

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch196_new_york_blocker_packets_v1',
    state: 'new-york',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    countyPacketWritten: true,
    educationPacketWritten: true,
    ptiPacketWritten: true,
    healthNyBlockedSurfaceCount: 5,
    exactBocesLeafCount: 3,
    reviewedStatewidePtiSources: 0,
    lesson_added: lessonAdded,
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, nextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, nextRows);
  writeJson(OUTPUTS.countyPacket, buildCountyPacket());
  writeJson(OUTPUTS.educationPacket, buildEducationPacket());
  writeJson(OUTPUTS.ptiPacket, buildPtiPacket());
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch196NewYorkBlockerPacketsV1();
}
