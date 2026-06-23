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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch163_massachusetts_hidden_postback_bridge_audit_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch163-massachusetts-hidden-postback-bridge-audit-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'massachusetts-california-grade-audit-report-v2.md'),
};

const EDUCATION_REASON =
  'Massachusetts education is now narrowed more precisely: the reviewed `search_link.aspx` surface is only a hidden-field auto-post bridge, and the real rendered `search.aspx` result page still has district rows with superintendent contacts, addresses, phones, and grades but no county column, county filter, or county-keyed export contract. All 14 county rows still depend on one statewide DESE fallback, so the family remains blocked until an official county-to-district routing contract exists.';
const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-23 one new live official DESE bridge audit plus the current blocker artifacts. The public URL https://profiles.doe.mass.edu/search/search_link.aspx?orgType=5,12&runOrgSearch=Y&leftNavId=11238 is not the real result surface; it only emits a hidden-field passForm that auto-posts __VIEWSTATE, __EVENTVALIDATION, orgType=5,12, and leftNavId=11238 into /search/search.aspx. Replaying that exact hidden-field POST does render real district rows with superintendent contacts, addresses, phones, and grades served, but the final page still preserves no county column, county filter, or county export contract. County words only appear inside district names such as Bristol County Agricultural, not as a routing key. Massachusetts therefore still lacks county-grade education routing evidence even though the official DESE postback bridge is real.';

const LESSON_HEADING =
  '### Auto-Post Directory Bridges Must Be Audited At The Final Rendered Page';
const LESSON_BODY =
  '*   **Lesson:** If an official directory URL only emits hidden fields and JavaScript submit logic, do not treat that bridge as the evidence surface. Massachusetts DESE required auditing the final rendered `search.aspx` result page to prove the district directory was real while still lacking a county routing contract.';

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
    '- Education is still blocked because the official DESE bridge is real but only as a hidden-field handoff; the final rendered district results still do not provide a county routing contract.',
    '- County-local is still blocked because the Mass.gov DDS lane remains host-wide 403 in the low-token runtime and no reviewed county-grade local office contract is preserved on disk.',
  ].join('\n') + '\n';
}

export function generateBatch163MassachusettsHiddenPostbackBridgeAuditV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, status_reason: EDUCATION_REASON }
      : row
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, evidence: EDUCATION_EVIDENCE }
      : row
  );

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          query_basis: 'Reviewed 2026-06-23 the official DESE auto-post bridge plus the final rendered search.aspx district results page.',
          blocker_evidence: EDUCATION_EVIDENCE,
        }
      : row
  );

  const updatedNextRows = nextRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, evidence: EDUCATION_EVIDENCE }
      : row
  );

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'official_dese_hidden_postback_bridge_renders_real_district_rows_but_no_county_contract_and_mass_gov_dds_lane_is_host_wide_403',
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'official_dese_profiles_postback_results_lack_county_to_district_contract',
        evidence: EDUCATION_EVIDENCE,
        next_action: 'hold_blocked_until_official_county_to_district_contract_exists',
      },
      summary.final_blockers.find((row) => row.family === 'county_local_disability_resources'),
    ].filter(Boolean),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const report = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  const batchSummary = {
    state: 'massachusetts',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    education_blocker_sharpened: true,
    lessons_updated: lessonsUpdated,
    blocker_basis: 'hidden_postback_bridge_audit',
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${report}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch163MassachusettsHiddenPostbackBridgeAuditV1();
  console.log(JSON.stringify(result, null, 2));
}
