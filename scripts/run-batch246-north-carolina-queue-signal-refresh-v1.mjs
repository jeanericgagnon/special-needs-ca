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
  educationPacket: path.join(generatedDir, 'north-carolina_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'north-carolina_county_local_disability_resources_local_office_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch246_north_carolina_queue_signal_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch246-north-carolina-queue-signal-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'north-carolina-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'generic_or_statewide_evidence_used_where_local_required';

const EDUCATION_REASON =
  'Reviewed 2026-06-23 the current North Carolina education-routing packet plus the live queue audit summary. The state still preserves one real district-owned exact leaf at Charlotte-Mecklenburg Schools, but the remaining education lane is visibly contaminated before fetch: 4 inventory rows use DB-field agency labels, 49 rows show federal/state mismatch, and 12 generic roots still need exact leaf verification. Many counties therefore still collapse to the statewide DPI Exceptional Children root or other generic/non-district leaves. The blocker is an exact district-leaf authoring and queue-cleanup gap, not a missing statewide education authority gap.';
const COUNTY_REASON =
  'Reviewed 2026-06-23 the current North Carolina county-local packet plus the live queue audit summary. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned DSS or local assistance directories, and the same weak-signal queue contamination is still present upstream: 4 inventory rows use DB-field agency labels, 49 rows show federal/state mismatch, and 12 generic roots still need exact leaf verification. The blocker is now explicitly a county-owned local office replacement and queue-cleanup packet, not a generic local-resource shortage.';

const LESSON_HEADING =
  '### Shared Weak-Signal Counts Across Two Local Families Usually Mean One Queue-Cleanup Problem';
const LESSON_BODY =
  '*   **Lesson:** When district-routing and county-local blockers show the same weak-signal counts, treat that as one shared queue-shape problem instead of two unrelated source failures. North Carolina had the same `4 DB-field labels / 49 federal-state mismatches / 12 generic roots` signature on both families, so the next lane should clean exact local targets, not rescrape statewide roots twice.';

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
    '# North Carolina Blocker Packets v4',
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
    '## Statewide support repair',
    '',
    '- `protection_and_advocacy` is now verified from the authoritative NDRN member-agencies directory plus the live DRNC first-party host.',
    '- `parent_training_information_center` is now verified from the authoritative Parent Center Hub North Carolina leaf, which explicitly says `North Carolina PTI (Serving all North Carolina)` and names ECAC.',
    '- `legal_aid` is now verified from the live Legal Aid of North Carolina first-party host and its get-help / about-us leaves.',
    '',
    '## Completion decision',
    '',
    '- North Carolina remains `BLOCKED` and `index_safe=false`.',
    '- Education remains blocked on missing district-owned local leaves beyond the single Charlotte-Mecklenburg anchor, with queue contamination counts now preserved explicitly.',
    '- County-local remains blocked on DOI-backed non-county-owned rows, with the same shared queue contamination counts preserved explicitly.',
    '- Statewide support families are no longer blockers.',
  ].join('\n') + '\n';
}

export function generateBatch246NorthCarolinaQueueSignalRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const educationPacket = readJson(INPUTS.educationPacket);
  const countyPacket = readJson(INPUTS.countyPacket);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'legacy_state_grade', status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'legacy_state_grade', status_reason: COUNTY_REASON };
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
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'legacy_state_grade',
        query_basis: 'Reviewed 2026-06-23 the North Carolina district-routing packet plus the shared queue-signal audit.',
        blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
        blocker_evidence: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'legacy_state_grade',
        query_basis: 'Reviewed 2026-06-23 the North Carolina county-local packet plus the shared queue-signal audit.',
        blocker_code: 'generic_or_statewide_evidence_used_where_local_required',
        blocker_evidence: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, evidence: '4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 12 generic roots need leaf verification' };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, evidence: '4 inventory rows use DB-field agency labels; 49 inventory rows show federal/state mismatch; 12 generic roots need leaf verification' };
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
        return { ...row, failure_code: 'generic_or_statewide_evidence_used_where_local_required', evidence: EDUCATION_REASON, next_action: 'author_county_or_district_exact_targets' };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, failure_code: 'generic_or_statewide_evidence_used_where_local_required', evidence: COUNTY_REASON, next_action: 'author_county_or_district_exact_targets' };
      }
      return row;
    }),
  };

  const updatedEducationPacket = {
    ...educationPacket,
    current_metrics: {
      ...(educationPacket.current_metrics || {}),
      reviewedDistrictOwnedLeaves: 1,
      dbFieldAgencyRows: 4,
      federalStateMismatchRows: 49,
      genericRootsNeedingLeafVerification: 12,
    },
    shared_queue_contamination_signature: '4_db_field_labels__49_federal_state_mismatches__12_generic_roots',
  };

  const updatedCountyPacket = {
    ...countyPacket,
    current_metrics: {
      ...(countyPacket.current_metrics || {}),
      doiBackedSampleRows: 3,
      dbFieldAgencyRows: 4,
      federalStateMismatchRows: 49,
      genericRootsNeedingLeafVerification: 12,
    },
    shared_queue_contamination_signature: '4_db_field_labels__49_federal_state_mismatches__12_generic_roots',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  writeJson(INPUTS.countyPacket, updatedCountyPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch246_north_carolina_queue_signal_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'north-carolina',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    reviewedDistrictOwnedLeaves: updatedEducationPacket.current_metrics.reviewedDistrictOwnedLeaves,
    doiBackedSampleRows: updatedCountyPacket.current_metrics.doiBackedSampleRows,
    dbFieldAgencyRows: 4,
    federalStateMismatchRows: 49,
    genericRootsNeedingLeafVerification: 12,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 246 North Carolina Queue Signal Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened the North Carolina local-family blockers with shared queue-contamination counts',
    '',
    '## Evidence',
    '',
    `- ${EDUCATION_REASON}`,
    `- ${COUNTY_REASON}`,
    '',
    '## Repair decision',
    '',
    '- Kept North Carolina BLOCKED.',
    '- Preserved that the same weak-signal inventory signature is hitting both district-routing and county-local lanes.',
    '- Kept the next lane on exact district/county leaf authoring rather than more statewide retries.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch246NorthCarolinaQueueSignalRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
