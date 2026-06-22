import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'louisiana_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'louisiana_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'louisiana_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'louisiana_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'louisiana_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  legal: path.join(generatedDir, 'louisiana_legal_aid_reviewed_source_v1.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch149_louisiana_legal_aid_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch149-louisiana-legal-aid-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'louisiana-california-grade-audit-report-v2.md'),
};

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

function assertIncludes(text, pattern, label) {
  if (!text.includes(pattern)) {
    throw new Error(`Expected ${label} to include "${pattern}".`);
  }
}

function buildVerifiedRows(existingRows, legalSource) {
  return existingRows.map((row) => {
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed LouisianaLawHelp legal-help directory now provides a statewide parish-searchable legal-aid route.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'LouisianaLawHelp Find Legal Help',
            source_url: legalSource.source_url,
            final_url: legalSource.final_url,
            verification_status: legalSource.verification_status,
            source_type: legalSource.source_type,
            source_table: legalSource.source_table,
            fetched_at: legalSource.fetched_at,
            evidence_snippet: legalSource.evidence_snippet,
          }
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Louisiana California-Grade Batch 67 Report v1',
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
    '- Louisiana district/county education routing remains blocked because district rows still depend on generic statewide fallback pages instead of parish- or district-owned leaves.',
    '- Louisiana county/local disability resources remain blocked because packet rows still depend on a generic statewide locations root instead of reviewed parish-grade local-office leaves.',
    '- Louisiana legal aid upgrades because LouisianaLawHelp now provides a statewide parish-searchable legal-help route with named legal-aid organizations.',
    '- Louisiana is therefore still truthfully BLOCKED and not index-safe. The only remaining blockers are the two parish-grade local-routing families.',
  ].join('\n') + '\n';
}

export function generateBatch149LouisianaLegalAidRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);
  const legalSource = readJson(INPUTS.legal);

  assertIncludes(legalSource.page_title, 'Find Legal Help Here', 'Louisiana legal-aid reviewed source title');
  assertIncludes(legalSource.evidence_snippet, 'parish', 'Louisiana legal-aid reviewed source snippet');
  assertIncludes(legalSource.evidence_snippet, 'legal-aid', 'Louisiana legal-aid reviewed source snippet');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed LouisianaLawHelp now provides a statewide parish-searchable legal-help route with named legal-aid organizations.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'legal_aid');
  const updatedVerifiedRows = buildVerifiedRows(verifiedRows, legalSource);
  const updatedNextRows = [
    {
      state: 'louisiana',
      state_code: 'LA',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      next_action: 'author_county_or_district_exact_targets',
      evidence: 'Louisiana district routing still depends on generic statewide LDOE fallback pages; no reviewed parish- or district-owned special-education leaves are on disk.',
    },
    {
      state: 'louisiana',
      state_code: 'LA',
      priority_rank: 2,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      next_action: 'author_county_or_district_exact_targets',
      evidence: 'County-local packet rows still rely on a generic statewide locations root instead of reviewed parish-grade local-office leaves.',
    }
  ];

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    primary_gap_reason: 'generic_or_statewide_evidence_used_where_local_required',
    critical_gap_families: [
      'district_or_county_education_routing',
      'county_local_disability_resources',
    ],
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: updatedNextRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'louisiana'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 83,
          weak_critical_families: 2,
          missing_critical_families: 0,
          primary_gap_reason: 'generic_or_statewide_evidence_used_where_local_required',
        }
      : row
  ));

  const updatedAudit = {
    ...audit,
    states: audit.states.map((row) => (
      row.stateId === 'louisiana'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            incorrectlyIndexSafe: false,
            strongCriticalFamilies: 10,
            weakCriticalFamilies: 2,
            missingCriticalFamilies: 0,
            completenessPct: 83,
            familyStatuses: {
              ...row.familyStatuses,
              legal_aid: 'verified_state_grade',
            },
            packetBatch: 'batch_149_louisiana_legal_aid_repair_v1',
            packetPrimaryGapReason: 'generic_or_statewide_evidence_used_where_local_required',
            packetRecommendedBatch: 'batch_3_procedure_hardening',
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    state: 'louisiana',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    upgraded_families: ['legal_aid'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    lesson_added: true,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 149 Louisiana Legal Aid Repair Report v1',
      '',
      'This pass repairs only the missing statewide Louisiana legal-aid family. The parish-grade education and local-office blockers remain untouched.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      `- upgraded_families: ${batchSummary.upgraded_families.join(', ')}`,
      `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch149LouisianaLegalAidRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
