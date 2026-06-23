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
  educationPacket: path.join(generatedDir, 'north-dakota_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'north-dakota_county_local_disability_resources_local_office_packet_v1.json'),
  legalAidPacket: path.join(generatedDir, 'north-dakota_legal_aid_source_family_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch247_north_dakota_queue_signal_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch247-north-dakota-queue-signal-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'north-dakota-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'generic_or_statewide_evidence_used_where_local_required';

const EDUCATION_REASON =
  'Reviewed 2026-06-23 the current North Dakota education-routing packet plus the live queue audit summary. The current district or county education-routing labels are still state-root-backed district labels that collapse to the statewide `https://www.nd.gov/` surface, including rows labeled as Burleigh and Cass special education, and the local queue remains visibly contaminated before fetch: 4 inventory rows use DB-field agency labels, 49 rows show federal/state mismatch, and 9 generic roots still need exact leaf verification. The blocker is a district-owned local-leaf authoring and queue-cleanup gap with no trustworthy local leaves yet preserved on disk.';
const COUNTY_REASON =
  'Reviewed 2026-06-23 the current North Dakota county-local packet plus the live queue audit summary. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned Human Service Zone or local assistance directories, and the same upstream weak-signal queue contamination is still present: 4 inventory rows use DB-field agency labels, 49 rows show federal/state mismatch, and 9 generic roots still need exact leaf verification. The blocker is explicitly a county-owned replacement and queue-cleanup packet, not a discovery-only gap.';
const LEGAL_AID_REASON =
  'Reviewed 2026-06-23 the current North Dakota statewide-support set. P&A and PTI are now covered by reviewed first-party sources, but statewide legal-aid support still has no reviewed first-party or authoritative statewide artifact on disk. The remaining legal-aid work is still a standalone source-family packet, not part of county or district leaf repair.';

const LESSON_HEADING =
  '### Reuse The Same Queue Signature Across States, But Keep The Generic-Root Count State-Specific';
const LESSON_BODY =
  '*   **Lesson:** When two states share the same weak-signal pattern, copy the blocker shape but not the exact root count. North Dakota matched North Carolina on `4 DB-field labels` and `49 federal-state mismatches`, but its local queues only had `9 generic roots` instead of `12`, so the state packet should preserve its own exact contamination count.';

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
    '# North Dakota Blocker Packets v3',
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
    '- `district_or_county_education_routing` is now an exact local-leaf authoring packet with preserved weak-signal queue counts, and the current state-root-backed district labels remain blocker evidence only.',
    '- `county_local_disability_resources` is now a county-owned directory replacement packet with the same preserved weak-signal queue counts, and DOI mirror rows remain blocker evidence only.',
    '- `legal_aid` remains a standalone statewide source-family packet.',
    '',
    '## Completion decision',
    '',
    '- North Dakota remains `BLOCKED` and `index_safe=false`.',
    '- Education remains blocked on missing district-owned local leaves and preserved queue contamination counts.',
    '- County-local remains blocked on DOI-backed non-local proof and preserved queue contamination counts.',
    '- Legal aid remains blocked on missing statewide source-family evidence.',
  ].join('\n') + '\n';
}

export function generateBatch247NorthDakotaQueueSignalRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const educationPacket = readJson(INPUTS.educationPacket);
  const countyPacket = readJson(INPUTS.countyPacket);
  const legalAidPacket = readJson(INPUTS.legalAidPacket);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'legacy_state_grade', status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'legacy_state_grade', status_reason: COUNTY_REASON };
    }
    if (row.family === 'legal_aid') {
      return { ...row, family_status: 'missing', status_reason: LEGAL_AID_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: EDUCATION_REASON, next_action: 'author_county_or_district_exact_targets' };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: COUNTY_REASON, next_action: 'author_county_or_district_exact_targets' };
    }
    if (row.family === 'legal_aid') {
      return { ...row, evidence: LEGAL_AID_REASON, next_action: 'author_or_verify_statewide_source_family' };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'legacy_state_grade',
        query_basis: 'Reviewed 2026-06-23 the North Dakota local-routing packet plus the shared queue-signal audit.',
        blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
        blocker_evidence: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'legacy_state_grade',
        query_basis: 'Reviewed 2026-06-23 the North Dakota county-local packet plus the shared queue-signal audit.',
        blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
        blocker_evidence: COUNTY_REASON,
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'missing',
        query_basis: 'Reviewed statewide-support rows for reviewed first-party or authoritative North Dakota legal-aid evidence.',
        blocker_code: 'missing_required_source_family',
        blocker_evidence: LEGAL_AID_REASON,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: '4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification' };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: '4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 9 generic roots need leaf verification' };
    }
    if (row.family === 'legal_aid') {
      return { ...row, evidence: 'Legal aid has no reviewed first-party or authoritative statewide North Dakota artifact on disk.' };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, evidence: EDUCATION_REASON, next_action: 'author_county_or_district_exact_targets' };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, evidence: COUNTY_REASON, next_action: 'author_county_or_district_exact_targets' };
      }
      if (row.family === 'legal_aid') {
        return { ...row, evidence: LEGAL_AID_REASON, next_action: 'author_or_verify_statewide_source_family' };
      }
      return row;
    }),
  };

  const updatedEducationPacket = {
    ...educationPacket,
    current_metrics: {
      ...(educationPacket.current_metrics || {}),
      dbFieldAgencyRows: 4,
      federalStateMismatchRows: 49,
      genericRootsNeedingLeafVerification: 9,
    },
    shared_queue_contamination_signature: '4_db_field_labels__49_federal_state_mismatches__9_generic_roots',
  };

  const updatedCountyPacket = {
    ...countyPacket,
    current_metrics: {
      ...(countyPacket.current_metrics || {}),
      dbFieldAgencyRows: 4,
      federalStateMismatchRows: 49,
      genericRootsNeedingLeafVerification: 9,
    },
    shared_queue_contamination_signature: '4_db_field_labels__49_federal_state_mismatches__9_generic_roots',
  };

  const updatedLegalAidPacket = {
    ...legalAidPacket,
    current_metrics: {
      ...(legalAidPacket.current_metrics || {}),
      reviewedStatewideSources: 0,
      authoritativeStatewideSources: 0,
    },
    blocker_basis: 'No reviewed first-party or authoritative statewide North Dakota legal-aid artifact is preserved on disk yet.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  writeJson(INPUTS.countyPacket, updatedCountyPacket);
  writeJson(INPUTS.legalAidPacket, updatedLegalAidPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch247_north_dakota_queue_signal_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'north-dakota',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    dbFieldAgencyRows: 4,
    federalStateMismatchRows: 49,
    genericRootsNeedingLeafVerification: 9,
    legalAidReviewedStatewideSources: 0,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 247 North Dakota Queue Signal Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened the North Dakota local-family blockers with shared queue-contamination counts and preserved the legal-aid source-family blocker',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${COUNTY_REASON}`,
    `- ${LEGAL_AID_REASON}`,
    '',
    '## Repair decision',
    '',
    '- Kept North Dakota BLOCKED.',
    '- Preserved the shared weak-signal inventory signature on both local families so later work can clean exact leaves instead of statewide roots.',
    '- Kept legal aid isolated as a missing statewide source-family blocker.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch247NorthDakotaQueueSignalRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
