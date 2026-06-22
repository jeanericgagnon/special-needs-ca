import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'california_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'california_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'california_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'california_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'california_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch96_california_blocker_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch96-california-blocker-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'california-california-grade-audit-report-v2.md'),
};

const PTI_EVIDENCE = 'Reviewed 2026-06-22 bounded statewide-equivalent parent-center candidate set. Matrix Parents still preserves explicit PTI/FEC/FRC designation text, but its own scope stays limited to Marin, Napa, Solano, and Sonoma Counties; the official DDS Family Resource Centers Network URL https://www.dds.ca.gov/rc/frcn now returns 404; frcnca.org fails TLS protocol negotiation in the current lane; and supportforfamilies.org returns 403. No live fetched statewide California PTI or equivalent parent-center source is currently verified on disk.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# California California-Grade Audit Report v2',
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
    '## California final blocker decision',
    '',
    '- Parent training information center remains blocked because the bounded statewide-equivalent candidate set is now exhausted more precisely: Matrix Parents is explicit but regional, the official DDS FRCN root returns 404, frcnca.org fails TLS in the current lane, and Support for Families returns 403.',
    '- District or county education routing remains blocked because only 3 reviewed exact district leaves have been verified and county-grade district routing still cannot be proven statewide from the bounded authored packet.',
    '- County-local disability resources remain blocked because the reviewed CDSS IHSS county directory still points to many county roots, but the packet verifies only sample county-owned leaves plus BenefitsCal rather than statewide reviewed county-grade office coverage.',
    '- California is therefore still truthfully BLOCKED and not index-safe.',
  ].join('\n') + '\n';
}

export function generateBatch96CaliforniaBlockerRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        status_reason: PTI_EVIDENCE,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        evidence: PTI_EVIDENCE,
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        query_basis: 'Reviewed 2026-06-22 bounded statewide-equivalent parent-center candidate set after the existing Matrix Parents regional proof failed the statewide gate.',
        blocker_evidence: PTI_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        evidence: PTI_EVIDENCE,
      };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'parent_training_information_center'
        ? { ...row, evidence: PTI_EVIDENCE }
        : row
    )),
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_96_california_blocker_refinement_v1',
    generated_at: '2026-06-22T18:20:00.000Z',
    state: 'california',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_family: 'parent_training_information_center',
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      pti: PTI_EVIDENCE,
    },
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# California Blocker Refinement Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      '- refined_family: parent_training_information_center',
      '',
      '## Evidence checks',
      '',
      `- pti: ${PTI_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch96CaliforniaBlockerRefinementV1();
}
