import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateCertification: path.join(generatedDir, 'state-certification', 'idaho.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch413_idaho_attachment_proof_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch413-idaho-attachment-proof-report-v1.md'),
};

const BATCH = 'batch413_idaho_attachment_proof_v1';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_26_attachment_recheck_confirms_camas_board_doc_and_clark_child_find_manual_policy_attachments_still_fail_to_create_local_special_ed_contract';

const DISTRICT_REASON =
  'Reviewed 2026-06-26 one more bounded Idaho attachment pass on the exact residual Camas and Clark district-owned files. The remaining Camas district-linked Google Doc at `https://docs.google.com/document/d/1OHWebOtQk9Wvwy8zMd5eFYwub5xPQ7Pg_nnMT20hOOA/export?format=txt` is live but resolves only to a board-of-trustees zone roster naming Hill City, Corral, Manard, Fairfield, and Blaine board seats, not any special-education, student-services, 504, Child Find, or procedural-safeguards routing. The second Camas district-linked Drive item at `https://drive.google.com/open?id=1NaLaY28erZn5QX6iu97mRSztjMRONciXd6664nVjWJw` still fails to materialize a reviewable public artifact and returned HTTP 500 on bounded review. The remaining Clark district-hosted attachments also stay wrong-role or too generic: the Federal Policy and Procedure Manual PDF is a federal-funds administration manual, not a local special-education routing artifact; the Idaho Child Find English PDF preserves only the statewide `Please join and support 2025-2026 Idaho Child Find` flyer heading; the Spanish Child Find flyer preserves generic statewide language telling families to contact their local district; and the Equal Education / Nondiscrimination PDF routes grievances to Title IX and the uniform grievance procedure rather than to a district special-education or student-services contact. Idaho therefore still lacks any district-owned, role-bearing local special-education routing evidence for the residual Camas and Clark counties.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function deriveCounts(audit) {
  const rows = Array.isArray(audit.states) ? audit.states : [];
  return {
    complete: rows.filter((row) => row.classification === 'COMPLETE').length,
    blocked: rows.filter((row) => row.classification === 'BLOCKED').length,
    indexSafe: rows.filter((row) => row.indexSafe === true).length,
  };
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
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
    '- The residual Camas and Clark attachment lane is now exhausted more directly: the live district-linked files are board, finance, generic Child Find, or generic compliance artifacts rather than local special-education routing.',
    '- County-local remains separately blocked because the official DHW stack still exposes office inventory without a county contract.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 413 Idaho Attachment Proof v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: replaced residual Idaho attachment ambiguity with direct proof that the remaining Camas and Clark district-hosted files still do not create a local special-education routing contract',
    '',
    '## Evidence',
    '',
    `- ${DISTRICT_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch413IdahoAttachmentProofV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const audit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  const stateCertification = readJson(INPUTS.stateCertification);

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 87,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_role_bearing_district_leaf_or_county_contract',
    final_blockers: (summary.final_blockers || []).map((row) =>
      row.family === 'district_or_county_education_routing' ? { ...row, evidence: DISTRICT_REASON } : row,
    ),
  };

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'district_or_county_education_routing' ? { ...row, status_reason: DISTRICT_REASON } : row,
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'district_or_county_education_routing' ? { ...row, evidence: DISTRICT_REASON } : row,
  );

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;
    return {
      ...row,
      blocker_evidence: DISTRICT_REASON,
      sample_count: 45,
      samples: [
        ...(row.samples || []),
        {
          sample_name: 'Camas district-linked Google Doc board roster',
          source_url: 'https://docs.google.com/document/d/1OHWebOtQk9Wvwy8zMd5eFYwub5xPQ7Pg_nnMT20hOOA/export?format=txt',
          final_url: 'https://docs.google.com/document/d/1OHWebOtQk9Wvwy8zMd5eFYwub5xPQ7Pg_nnMT20hOOA/export?format=txt',
          verification_status: 'reviewed',
          source_type: 'district_linked_attachment_wrong_role_board_roster',
          source_table: BATCH,
          fetched_at: REVIEWED_AT,
          evidence_snippet: 'The exported text preserves only board-of-trustees zone assignments for Hill City, Corral, Manard, Fairfield, and Blaine board seats, not any special-education or Child Find routing.',
        },
        {
          sample_name: 'Camas district-linked Drive item HTTP 500',
          source_url: 'https://drive.google.com/open?id=1NaLaY28erZn5QX6iu97mRSztjMRONciXd6664nVjWw',
          final_url: 'https://drive.google.com/open?id=1NaLaY28erZn5QX6iu97mRSztjMRONciXd6664nVjWw',
          verification_status: 'blocked',
          source_type: 'district_linked_attachment_unreviewable_http_500',
          source_table: BATCH,
          fetched_at: REVIEWED_AT,
          evidence_snippet: 'The second Camas district-linked Drive item failed to materialize a reviewable public artifact and returned HTTP 500 during bounded review.',
        },
        {
          sample_name: 'Clark federal policy and procedure manual PDF',
          source_url: 'https://www.clarkcountyschools161.org/fs/resource-manager/view/82b5bf63-07c4-40ae-b0b5-0f46f9c081aa',
          final_url: 'https://www.clarkcountyschools161.org/fs/resource-manager/view/82b5bf63-07c4-40ae-b0b5-0f46f9c081aa',
          verification_status: 'reviewed',
          source_type: 'district_hosted_manual_wrong_role_federal_funds_administration',
          source_table: BATCH,
          fetched_at: REVIEWED_AT,
          evidence_snippet: 'The PDF title is `Policies and Procedures Manual Used By Clark County School District No. 161 To Administer Federal Funds` and the extracted text is a federal-funds administration manual, not local special-education routing.',
        },
        {
          sample_name: 'Clark Idaho Child Find English flyer',
          source_url: 'https://www.clarkcountyschools161.org/fs/resource-manager/view/ec6281bc-62e4-4e6b-ba10-56f825470a5a',
          final_url: 'https://www.clarkcountyschools161.org/fs/resource-manager/view/ec6281bc-62e4-4e6b-ba10-56f825470a5a',
          verification_status: 'reviewed',
          source_type: 'district_hosted_child_find_flyer_generic_statewide',
          source_table: BATCH,
          fetched_at: REVIEWED_AT,
          evidence_snippet: 'The extracted text preserves only the statewide heading `Please join and support 2025-2026 Idaho Child Find`, not a Clark-specific special-education contact or local routing contract.',
        },
        {
          sample_name: 'Clark Idaho Child Find Spanish flyer',
          source_url: 'https://www.clarkcountyschools161.org/fs/resource-manager/view/1ecbdc8c-1fa2-4953-92a6-8362c2596bce',
          final_url: 'https://www.clarkcountyschools161.org/fs/resource-manager/view/1ecbdc8c-1fa2-4953-92a6-8362c2596bce',
          verification_status: 'reviewed',
          source_type: 'district_hosted_child_find_flyer_generic_statewide',
          source_table: BATCH,
          fetched_at: REVIEWED_AT,
          evidence_snippet: 'The extracted text tells families to contact their local school district about the program and services available to those who qualify for special education, but still names no Clark-specific special-education contact or routing path.',
        },
        {
          sample_name: 'Clark Equal Education policy PDF',
          source_url: 'https://www.clarkcountyschools161.org/fs/resource-manager/view/3f4addc9-229f-48dd-bb18-9e2d5260ad56',
          final_url: 'https://www.clarkcountyschools161.org/fs/resource-manager/view/3f4addc9-229f-48dd-bb18-9e2d5260ad56',
          verification_status: 'reviewed',
          source_type: 'district_hosted_compliance_policy_wrong_role',
          source_table: BATCH,
          fetched_at: REVIEWED_AT,
          evidence_snippet: 'The policy routes discrimination complaints to the District Title IX Coordinator and the Uniform Grievance Procedure, not to a local special-education or student-services contact.',
        },
      ],
    };
  });

  const updatedAudit = {
    ...audit,
    states: audit.states.map((row) =>
      row.stateId === 'idaho'
        ? {
            ...row,
            packetBatch: BATCH,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
          }
        : row,
    ),
  };

  const idahoNote =
    '- Idaho remains blocked after a 2026-06-26 residual attachment pass: the last Camas and Clark district-linked files now resolve to a board-zone document, an unreviewable Drive item, a federal-funds manual, generic Idaho Child Find flyers, and generic equal-education compliance policy rather than a local special-education routing contract.';
  const updatedAllStateReport = /- Idaho remains blocked after[^\n]*/.test(allStateReport)
    ? allStateReport.replace(/- Idaho remains blocked after[^\n]*/, idahoNote)
    : `${allStateReport.trimEnd()}\n${idahoNote}\n`;

  const updatedHandoff = handoff.replace(
    /- Idaho: `[^`]+`/,
    '- Idaho: `bounded_2026_06_26_attachment_recheck_confirms_camas_board_doc_and_clark_child_find_manual_policy_attachments_still_fail_to_create_local_special_ed_contract`',
  );

  const updatedStateCertification = {
    ...stateCertification,
    checkedAt: REVIEWED_AT,
    summary: updatedSummary,
    gapRows: updatedGapRows,
    failures: updatedFailureRows,
  };
  const countsUnchanged = deriveCounts(updatedAudit);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJson(INPUTS.audit, updatedAudit);
  writeText(INPUTS.allStateReport, updatedAllStateReport);
  writeText(INPUTS.handoff, updatedHandoff);
  writeText(INPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, nextRows));
  writeJson(INPUTS.stateCertification, updatedStateCertification);

  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    generated_at: new Date().toISOString(),
    classification: 'BLOCKED',
    camas_board_doc_wrong_role: true,
    camas_drive_item_http_500: true,
    clark_manual_wrong_role: true,
    clark_child_find_generic_only: true,
    clark_equal_education_wrong_role: true,
    completeness_pct: 87,
    counts_unchanged: countsUnchanged,
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch413IdahoAttachmentProofV1();
  console.log(JSON.stringify(result, null, 2));
}
