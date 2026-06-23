import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'north-carolina_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'north-carolina_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'north-carolina_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'north-carolina_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'north-carolina_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  educationPacket: path.join(generatedDir, 'north-carolina_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'north-carolina_county_local_disability_resources_local_office_packet_v1.json'),
  sourceFamilyPacket: path.join(generatedDir, 'north-carolina_statewide_support_source_family_packet_v1.json'),
  batchSummary: path.join(generatedDir, 'batch197_north_carolina_blocker_packets_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch197-north-carolina-blocker-packets-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'north-carolina-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'generic_or_statewide_evidence_used_where_local_required';

const EDUCATION_REASON =
  'Reviewed 2026-06-23 the current North Carolina education-routing packet. The state still preserves one real district-owned exact leaf at Charlotte-Mecklenburg Schools, but many remaining counties still collapse to the statewide DPI Exceptional Children root or other generic/non-district leaves. The blocker is therefore an exact district-leaf authoring gap, not a missing statewide education authority gap.';
const COUNTY_REASON =
  'Reviewed 2026-06-23 the current North Carolina county-local packet. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned DSS or local assistance directories, so those rows cannot remain California-grade local proof. The blocker is now explicitly a county-owned local office replacement packet, not a generic local-resource shortage.';
const SOURCE_FAMILY_REASON =
  'Reviewed 2026-06-23 the current statewide-support blocker set. North Carolina still lacks any reviewed statewide first-party protection-and-advocacy artifact, any reviewed statewide legal-aid artifact, and any fetched PTI leaf that explicitly preserves statewide North Carolina PTI designation. The ECAC homepage is useful support context, but homepage PTI navigation alone is not designation proof.';

const LESSON_HEADING =
  '### PTI Navigation Alone Is Not Statewide PTI Designation Proof';
const LESSON_BODY =
  '*   **Lesson:** If a parent-center homepage only exposes PTI navigation or general special-needs family-support language, do not count it as statewide PTI proof until a fetched first-party leaf explicitly preserves the designation or statewide scope. North Carolina ECAC was useful context, but the packet still needed a designation leaf.';

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

function buildEducationPacket() {
  return {
    state: 'north-carolina',
    family: 'district_or_county_education_routing',
    repair_lane: 'district_owned_leaf_authoring_only',
    packet_complete_when:
      'Generic DPI fallback rows are replaced with reviewed district-owned or county-grade local education-routing leaves across the remaining counties.',
    current_metrics: {
      countyTotal: 100,
      reviewedDistrictOwnedLeaves: 1,
      genericFallbackRowsMentioned: 49,
      genericRootsNeedingLeafVerification: 12,
    },
    reviewed_leaf_anchor: 'https://www.cmsk12.org/Page/213',
    exhausted_statewide_fallback: 'https://www.dpi.nc.gov/districts-schools/classroom-resources/exceptional-children',
  };
}

function buildCountyPacket() {
  return {
    state: 'north-carolina',
    family: 'county_local_disability_resources',
    repair_lane: 'county_owned_directory_replacement_only',
    packet_complete_when:
      'DOI-backed county rows are replaced with reviewed county-owned DSS or local-assistance directories.',
    current_metrics: {
      countyTotal: 100,
      doiBackedSampleRows: 3,
      genericFallbackRowsMentioned: 49,
    },
    rejected_current_sample_root: 'https://doi.org/10.7910/DVN/AVRHMI',
    sample_counties_needing_replacement: [
      'Alamance',
      'Alexander',
      'Alleghany',
    ],
  };
}

function buildSourceFamilyPacket() {
  return {
    state: 'north-carolina',
    family_group: 'statewide_support_families',
    repair_lane: 'reviewed_first_party_source_family_only',
    packet_complete_when:
      'Reviewed statewide first-party artifacts exist for protection and advocacy, legal aid, and PTI designation/scope.',
    missing_families: [
      'protection_and_advocacy',
      'legal_aid',
    ],
    weak_family: 'parent_training_information_center',
    weak_family_current_source: 'https://www.ecac-parentcenter.org/',
    weak_family_issue: 'homepage navigation/support language present, but no explicit statewide PTI designation leaf preserved on disk',
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# North Carolina Blocker Packets v2',
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
    '- `district_or_county_education_routing` is now an exact district-leaf authoring packet: Charlotte-Mecklenburg is the only reviewed local anchor, and the statewide DPI root is explicitly exhausted as county proof.',
    '- `county_local_disability_resources` is now a county-owned directory replacement packet: DOI mirror rows are preserved only as blocker evidence, not as usable local proof.',
    '- `protection_and_advocacy`, `legal_aid`, and `parent_training_information_center` are now separated into a statewide-source-family packet so later work does not mix source-family repair with county/district leaf repair.',
    '',
    '## Completion decision',
    '',
    '- North Carolina remains `BLOCKED` and `index_safe=false`.',
    '- Education remains blocked on missing district-owned local leaves beyond the single Charlotte-Mecklenburg anchor.',
    '- County-local remains blocked on DOI-backed non-county-owned rows.',
    '- Statewide support families remain blocked on missing reviewed first-party artifacts or explicit PTI designation proof.',
  ].join('\n') + '\n';
}

export function generateBatch197NorthCarolinaBlockerPacketsV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'legacy_state_grade', status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'legacy_state_grade', status_reason: COUNTY_REASON };
    }
    if (['protection_and_advocacy', 'legal_aid'].includes(row.family)) {
      return { ...row, family_status: 'missing', status_reason: SOURCE_FAMILY_REASON };
    }
    if (row.family === 'parent_training_information_center') {
      return { ...row, family_status: 'inventory_only', status_reason: SOURCE_FAMILY_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') return { ...row, evidence: EDUCATION_REASON };
    if (row.family === 'county_local_disability_resources') return { ...row, evidence: COUNTY_REASON };
    if (['protection_and_advocacy', 'legal_aid', 'parent_training_information_center'].includes(row.family)) {
      return { ...row, evidence: SOURCE_FAMILY_REASON };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'legacy_state_grade',
        query_basis: 'Reviewed 2026-06-23 the North Carolina district-routing packet: one exact district leaf plus exhausted statewide DPI fallback rows.',
        blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
        blocker_evidence: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'legacy_state_grade',
        query_basis: 'Reviewed 2026-06-23 the North Carolina county-local packet: DOI mirror rows still stand in for county-owned office proof.',
        blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
        blocker_evidence: COUNTY_REASON,
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'inventory_only',
        query_basis: 'Reviewed 2026-06-23 the saved ECAC homepage artifact for designation scope only.',
        blocker_code: 'legacy_or_inventory_only_evidence',
        blocker_evidence: SOURCE_FAMILY_REASON,
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
    batch: 'batch197_north_carolina_blocker_packets_v1',
    state: 'north-carolina',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    educationPacketWritten: true,
    countyPacketWritten: true,
    sourceFamilyPacketWritten: true,
    reviewedDistrictOwnedLeaves: 1,
    doiBackedSampleRows: 3,
    statewideSupportFamiliesStillBlocked: 3,
    lesson_added: lessonAdded,
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, nextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, nextRows);
  writeJson(OUTPUTS.educationPacket, buildEducationPacket());
  writeJson(OUTPUTS.countyPacket, buildCountyPacket());
  writeJson(OUTPUTS.sourceFamilyPacket, buildSourceFamilyPacket());
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch197NorthCarolinaBlockerPacketsV1();
}
