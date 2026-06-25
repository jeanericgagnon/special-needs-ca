import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  stateSummary: path.join(generatedDir, 'virginia_california_grade_summary_v2.json'),
  stateGap: path.join(generatedDir, 'virginia_gap_matrix_v2.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch382_virginia_global_sync_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch382-virginia-global-sync-report-v1.md'),
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function buildHandoff(currentText, updatedAudit) {
  const completeStates = updatedAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = updatedAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  const beforeFocus = currentText.split('## Current Focus State:')[0];
  const lines = beforeFocus.split('\n');
  const completeHeading = lines.findIndex((line) => line.trim() === '## Current Complete States');

  const prefix = [
    ...lines.slice(0, completeHeading + 2),
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
  ].join('\n');

  const focusPart = currentText.includes('## Current Focus State:')
    ? `## Current Focus State:${currentText.split('## Current Focus State:')[1]}`
    : '';

  return `${prefix}${focusPart}`.trimEnd() + '\n';
}

function buildBatchReport(updatedAudit) {
  return [
    '# Batch 382 Virginia Global Sync v1',
    '',
    `- COMPLETE: ${updatedAudit.classifications.COMPLETE}`,
    `- BLOCKED: ${updatedAudit.classifications.BLOCKED}`,
    `- indexSafeCount: ${updatedAudit.indexSafeCount}`,
    `- incorrectlyIndexSafeStates: ${JSON.stringify(updatedAudit.incorrectlyIndexSafeStates)}`,
    '',
    '## Change',
    '',
    '- Synced Virginia’s independent re-audit packet metadata into the global audit while preserving the current statewide counts and New Hampshire handoff focus.',
  ].join('\n') + '\n';
}

export function generateBatch382VirginiaGlobalSyncV1() {
  const stateSummary = readJson(INPUTS.stateSummary);
  const stateGapRows = readJsonl(INPUTS.stateGap);
  const allStateAudit = readJson(INPUTS.audit);
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');

  const familyStatuses = Object.fromEntries(stateGapRows.map((row) => [row.family, row.family_status]));
  const updatedStates = allStateAudit.states.map((row) => (
    row.stateId === 'virginia'
      ? {
          ...row,
          classification: 'COMPLETE',
          indexSafe: true,
          incorrectlyIndexSafe: false,
          strongCriticalFamilies: stateSummary.strong_critical_families,
          weakCriticalFamilies: stateSummary.weak_critical_families,
          missingCriticalFamilies: stateSummary.missing_critical_families,
          totalCriticalFamilies: stateSummary.total_critical_families,
          completenessPct: stateSummary.completeness_pct,
          familyStatuses,
          packetGenerated: true,
          packetBatch: 'batch374_virginia_independent_reaudit_v1',
          packetPrimaryGapReason: stateSummary.primary_gap_reason,
          packetRecommendedBatch: stateSummary.recommended_batch,
        }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    states: updatedStates,
  };

  const nextHandoff = buildHandoff(handoff, updatedAudit);
  const batchSummary = {
    batch: 'batch382_virginia_global_sync_v1',
    generated_at: new Date().toISOString(),
    virginia_packet_batch: 'batch374_virginia_independent_reaudit_v1',
    complete_count: updatedAudit.classifications.COMPLETE,
    blocked_count: updatedAudit.classifications.BLOCKED,
    index_safe_count: updatedAudit.indexSafeCount,
    incorrectly_index_safe_states: updatedAudit.incorrectlyIndexSafeStates,
  };

  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.handoff, nextHandoff);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(updatedAudit));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch382VirginiaGlobalSyncV1();
  console.log(JSON.stringify(result, null, 2));
}
