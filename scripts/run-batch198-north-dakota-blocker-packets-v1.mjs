import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'north-dakota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'north-dakota_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'north-dakota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'north-dakota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'north-dakota_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  educationPacket: path.join(generatedDir, 'north-dakota_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'north-dakota_county_local_disability_resources_local_office_packet_v1.json'),
  legalAidPacket: path.join(generatedDir, 'north-dakota_legal_aid_source_family_packet_v1.json'),
  batchSummary: path.join(generatedDir, 'batch198_north_dakota_blocker_packets_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch198-north-dakota-blocker-packets-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'north-dakota-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'generic_or_statewide_evidence_used_where_local_required';

const EDUCATION_REASON =
  'Reviewed 2026-06-23 the current North Dakota education-routing packet. The current district or county education-routing labels are still state-root-backed district labels that collapse to the statewide `https://www.nd.gov/` surface, including rows labeled as Burleigh and Cass special education. The blocker is therefore a missing district-owned local leaves authoring gap with no trustworthy local leaves yet preserved on disk.';
const COUNTY_REASON =
  'Reviewed 2026-06-23 the current North Dakota county-local packet. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned Human Service Zone or local assistance directories, so those rows cannot remain California-grade local proof. The blocker is explicitly a county-owned replacement packet, not a discovery-only gap.';
const LEGAL_AID_REASON =
  'Reviewed 2026-06-23 the current North Dakota statewide-support set. P&A and PTI are now covered by reviewed first-party sources, but statewide legal-aid support still has no reviewed first-party or authoritative statewide artifact on disk. The remaining legal-aid work is a standalone source-family packet, not part of county or district leaf repair.';

const LESSON_HEADING =
  '### State-Labeled Local Rows That Resolve To A State Root Still Count As Missing Local Proof';
const LESSON_BODY =
  '*   **Lesson:** If rows are labeled with county or district names but their reviewed source URL still resolves to a generic state root, keep them in the local-leaf blocker lane. North Dakota had rows labeled like Burleigh or Cass special education, but the reviewed source was still just `nd.gov`, so they could not count as local routing proof.';

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
    state: 'north-dakota',
    family: 'district_or_county_education_routing',
    repair_lane: 'district_owned_leaf_authoring_only',
    packet_complete_when:
      'Reviewed district-owned or county-grade local education leaves replace the current state-root-backed rows.',
    current_metrics: {
      countyTotal: 53,
      reviewedLocalLeaves: 0,
      genericRootsNeedingLeafVerification: 9,
      mislabeledStateRootRowsSeen: 3,
    },
    rejected_current_root: 'https://www.nd.gov/',
    mislabeled_examples: [
      'Burleigh Public Schools Special Education',
      'Cass Public Schools Special Education',
      'Adams County County fallback',
    ],
  };
}

function buildCountyPacket() {
  return {
    state: 'north-dakota',
    family: 'county_local_disability_resources',
    repair_lane: 'county_owned_directory_replacement_only',
    packet_complete_when:
      'DOI-backed Human Service Zone rows are replaced with reviewed county-owned or zone-owned first-party local office directories.',
    current_metrics: {
      countyTotal: 53,
      doiBackedSampleRows: 3,
      genericRootsNeedingLeafVerification: 9,
    },
    rejected_current_root: 'https://doi.org/10.7910/DVN/AVRHMI',
    sample_counties_needing_replacement: [
      'Adams',
      'Barnes',
      'Benson',
    ],
  };
}

function buildLegalAidPacket() {
  return {
    state: 'north-dakota',
    family: 'legal_aid',
    repair_lane: 'reviewed_statewide_source_family_only',
    packet_complete_when:
      'A reviewed first-party or authoritative statewide North Dakota legal-aid artifact is attached on disk.',
    current_metrics: {
      reviewedStatewideLegalAidSources: 0,
      statewideSupportFamiliesStillBlocked: 1,
    },
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# North Dakota Blocker Packets v2',
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
    '- `district_or_county_education_routing` is now an exact local-leaf authoring packet: the current state-root-backed district labels are preserved only as blocker evidence.',
    '- `county_local_disability_resources` is now a county-owned directory replacement packet: DOI mirror rows are preserved only as blocker evidence, not as local proof.',
    '- `legal_aid` is now a standalone statewide source-family packet.',
    '',
    '## Completion decision',
    '',
    '- North Dakota remains `BLOCKED` and `index_safe=false`.',
    '- Education remains blocked on missing district-owned local leaves.',
    '- County-local remains blocked on DOI-backed non-local proof.',
    '- Legal aid remains blocked on missing statewide source-family evidence.',
  ].join('\n') + '\n';
}

export function generateBatch198NorthDakotaBlockerPacketsV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') return { ...row, family_status: 'legacy_state_grade', status_reason: EDUCATION_REASON };
    if (row.family === 'county_local_disability_resources') return { ...row, family_status: 'legacy_state_grade', status_reason: COUNTY_REASON };
    if (row.family === 'legal_aid') return { ...row, family_status: 'missing', status_reason: LEGAL_AID_REASON };
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') return { ...row, evidence: EDUCATION_REASON };
    if (row.family === 'county_local_disability_resources') return { ...row, evidence: COUNTY_REASON };
    if (row.family === 'legal_aid') return { ...row, evidence: LEGAL_AID_REASON };
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'legacy_state_grade',
        query_basis: 'Reviewed 2026-06-23 the North Dakota local-routing packet: state-root-backed district labels remain without local leaves.',
        blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
        blocker_evidence: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'legacy_state_grade',
        query_basis: 'Reviewed 2026-06-23 the North Dakota county-local packet: DOI mirror rows still stand in for local office proof.',
        blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
        blocker_evidence: COUNTY_REASON,
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
    batch: 'batch198_north_dakota_blocker_packets_v1',
    state: 'north-dakota',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    educationPacketWritten: true,
    countyPacketWritten: true,
    legalAidPacketWritten: true,
    reviewedLocalLeaves: 0,
    doiBackedSampleRows: 3,
    reviewedStatewideLegalAidSources: 0,
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
  writeJson(OUTPUTS.legalAidPacket, buildLegalAidPacket());
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch198NorthDakotaBlockerPacketsV1();
}
