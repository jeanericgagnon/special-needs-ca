import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'maryland_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'maryland_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'maryland_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'maryland_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'maryland_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  pti: path.join(generatedDir, 'maryland_pti_reviewed_source_v1.json'),
  pa: path.join(generatedDir, 'maryland_pa_reviewed_source_v1.json'),
  legal: path.join(generatedDir, 'maryland_legal_aid_reviewed_source_v1.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch151_maryland_statewide_source_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch151-maryland-statewide-source-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'maryland-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP = 'generic_or_statewide_evidence_used_where_local_required';

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

function buildVerifiedRows(existingRows, ptiSource, paSource, legalSource) {
  return existingRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed Parents’ Place of Maryland About page now preserves explicit PTI designation text.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Parents’ Place of Maryland About',
            source_url: ptiSource.source_url,
            final_url: ptiSource.final_url,
            verification_status: ptiSource.verification_status,
            source_type: ptiSource.source_type,
            source_table: ptiSource.source_table,
            fetched_at: ptiSource.fetched_at,
            evidence_snippet: ptiSource.evidence_snippet,
          }
        ],
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed Disability Rights Maryland About page now preserves designated Protection & Advocacy language.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Maryland About',
            source_url: paSource.source_url,
            final_url: paSource.final_url,
            verification_status: paSource.verification_status,
            source_type: paSource.source_type,
            source_table: paSource.source_table,
            fetched_at: paSource.fetched_at,
            evidence_snippet: paSource.evidence_snippet,
          }
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed Maryland Legal Aid homepage now preserves direct statewide free civil legal services evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Maryland Legal Aid',
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
    '# Maryland California-Grade Batch 69 Report v1',
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
    '- Maryland Parents’ Place of Maryland now clears PTI because the reviewed About page explicitly says it serves as Maryland’s Parent Training and Information Center.',
    '- Maryland Disability Rights now clears protection and advocacy because the reviewed About page preserves Maryland’s designated Protection & Advocacy language.',
    '- Maryland Legal Aid now clears legal aid because the reviewed homepage explicitly states free civil legal services and statewide intake.',
    '- Maryland district/county education routing remains blocked because district rows still depend on generic statewide fallback pages instead of county- or district-owned leaves.',
    '- Maryland county/local disability resources remain blocked because packet rows still depend on generic statewide or structural sources instead of reviewed county-owned local routing.',
    '- Maryland is therefore still truthfully BLOCKED and not index-safe. The only remaining blockers are the two county-grade local-routing families.',
  ].join('\n') + '\n';
}

export function generateBatch151MarylandStatewideSourceRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);
  const ptiSource = readJson(INPUTS.pti);
  const paSource = readJson(INPUTS.pa);
  const legalSource = readJson(INPUTS.legal);

  assertIncludes(ptiSource.evidence_snippet, 'Parent Training and Information Center', 'Maryland PTI reviewed source snippet');
  assertIncludes(paSource.evidence_snippet, 'designated Protection & Advocacy agency', 'Maryland P&A reviewed source snippet');
  assertIncludes(legalSource.evidence_snippet, 'free civil legal services', 'Maryland legal-aid reviewed source snippet');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed Parents’ Place of Maryland About page explicitly preserves PTI designation.',
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed Disability Rights Maryland About page explicitly preserves designated Protection & Advocacy language.',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed Maryland Legal Aid homepage now provides direct statewide free civil legal services evidence.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => ![
    'parent_training_information_center',
    'protection_and_advocacy',
    'legal_aid',
  ].includes(row.family));

  const updatedVerifiedRows = buildVerifiedRows(verifiedRows, ptiSource, paSource, legalSource);
  const updatedNextRows = [
    {
      state: 'maryland',
      state_code: 'MD',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      next_action: 'author_county_or_district_exact_targets',
      evidence: 'Reviewed Maryland packet evidence still routes district or county education through generic statewide Maryland special-education pages rather than county- or district-owned leaves.',
    },
    {
      state: 'maryland',
      state_code: 'MD',
      priority_rank: 2,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      next_action: 'author_county_or_district_exact_targets',
      evidence: 'County/local disability resources still depend on generic statewide location pages or structural dataset-derived rows instead of reviewed county-owned local routing evidence.',
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
    primary_gap_reason: PRIMARY_GAP,
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
    row.state === 'maryland'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 83,
          weak_critical_families: 2,
          missing_critical_families: 0,
          primary_gap_reason: PRIMARY_GAP,
        }
      : row
  ));

  const updatedAudit = {
    ...audit,
    states: audit.states.map((row) => (
      row.stateId === 'maryland'
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
              protection_and_advocacy: 'verified_state_grade',
              parent_training_information_center: 'verified_state_grade',
              legal_aid: 'verified_state_grade',
            },
            packetPrimaryGapReason: PRIMARY_GAP,
            packetRecommendedBatch: 'batch_3_procedure_hardening',
            packetBatch: 'batch_151_maryland_statewide_source_repair_v1',
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
    state: 'maryland',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    upgraded_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
      'legal_aid',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    lesson_added: false,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 151 Maryland Statewide Source Repair Report v1',
      '',
      'This pass repairs only the statewide Maryland support-family blockers. The county-grade education and local-office blockers remain untouched.',
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
  const summary = generateBatch151MarylandStatewideSourceRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
