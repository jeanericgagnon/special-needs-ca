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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch387_north_dakota_global_sync_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch387-north-dakota-global-sync-report-v1.md'),
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

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function replaceLine(lines, startsWith, nextLine) {
  const index = lines.findIndex((line) => line.startsWith(startsWith));
  if (index >= 0) lines[index] = nextLine;
}

function buildAllStateReport(currentText, updatedAudit) {
  const completeStates = updatedAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedStates = updatedAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));

  const ndNote = '- North Dakota is now COMPLETE/index-safe from the live HHS Developmental Disabilities Regional Offices county contracts, the reviewed DPI district-list PDF, and refreshed first-party Legal Services of North Dakota routing evidence.';
  const filtered = currentText
    .split('\n')
    .filter((line) =>
      !line.startsWith('- North Dakota remains blocked') &&
      !line.startsWith('- North Dakota is now COMPLETE/index-safe')
    );

  replaceLine(filtered, '- COMPLETE:', `- COMPLETE: ${updatedAudit.classifications.COMPLETE}`);
  replaceLine(filtered, '- BLOCKED:', `- BLOCKED: ${updatedAudit.classifications.BLOCKED}`);
  replaceLine(filtered, '- index-safe states:', `- index-safe states: ${updatedAudit.indexSafeCount}`);
  replaceLine(filtered, '- complete states:', `- complete states: ${completeStates.join(', ')}`);
  replaceLine(filtered, '- blocked states:', `- blocked states: ${blockedStates.join(', ')}`);

  return `${filtered.join('\n').trimEnd()}\n${ndNote}\n`;
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
    '# Batch 387 North Dakota Global Sync v1',
    '',
    `- COMPLETE: ${updatedAudit.classifications.COMPLETE}`,
    `- BLOCKED: ${updatedAudit.classifications.BLOCKED}`,
    `- indexSafeCount: ${updatedAudit.indexSafeCount}`,
    `- incorrectlyIndexSafeStates: ${JSON.stringify(updatedAudit.incorrectlyIndexSafeStates)}`,
    '',
    '## Change',
    '',
    '- Integrated the reviewed North Dakota completion into the global audit, priority queue, all-state report, and Gemini handoff.',
    '- Preserved the current focus state section while moving North Dakota from BLOCKED to COMPLETE/index-safe in the statewide control plane.',
  ].join('\n') + '\n';
}

export function generateBatch387NorthDakotaGlobalSyncV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');

  const familyStatuses = Object.fromEntries(gapRows.map((row) => [row.family, row.family_status]));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'north-dakota'
      ? {
          ...row,
          classification: 'COMPLETE',
          index_safe: true,
          completeness_pct: 100,
          missing_critical_families: 0,
          weak_critical_families: 0,
          primary_gap_reason: 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence',
          recommended_batch: 'complete_maintain',
          status: 'COMPLETE',
          repair_lane: 'maintain_truth_only',
        }
      : row
  ));

  const updatedStates = allStateAudit.states.map((row) => (
    row.stateId === 'north-dakota'
      ? {
          ...row,
          classification: 'COMPLETE',
          indexSafe: true,
          incorrectlyIndexSafe: false,
          strongCriticalFamilies: summary.strong_critical_families,
          weakCriticalFamilies: summary.weak_critical_families,
          missingCriticalFamilies: summary.missing_critical_families,
          totalCriticalFamilies: summary.total_critical_families,
          completenessPct: summary.completeness_pct,
          familyStatuses,
          packetGenerated: true,
          packetBatch: summary.batch,
          packetPrimaryGapReason: summary.primary_gap_reason,
          packetRecommendedBatch: summary.recommended_batch,
        }
      : row
  ));

  const classifications = updatedStates.reduce((acc, row) => {
    acc[row.classification] = (acc[row.classification] || 0) + 1;
    return acc;
  }, {});
  const indexSafeCount = updatedStates.filter((row) => row.indexSafe).length;
  const incorrectlyIndexSafeStates = updatedStates
    .filter((row) => row.classification !== 'COMPLETE' && row.indexSafe)
    .map((row) => row.stateId);

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    classifications,
    indexSafeCount,
    incorrectlyIndexSafeStates,
    states: updatedStates,
  };

  const nextAllStateReport = buildAllStateReport(allStateReport, updatedAudit);
  const nextHandoff = buildHandoff(handoff, updatedAudit);
  const batchSummary = {
    batch: 'batch387_north_dakota_global_sync_v1',
    generated_at: new Date().toISOString(),
    north_dakota_classification: 'COMPLETE',
    complete_count: updatedAudit.classifications.COMPLETE,
    blocked_count: updatedAudit.classifications.BLOCKED,
    index_safe_count: updatedAudit.indexSafeCount,
    incorrectly_index_safe_states: updatedAudit.incorrectlyIndexSafeStates,
  };

  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.allStateReport, nextAllStateReport);
  fs.writeFileSync(INPUTS.handoff, nextHandoff);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(updatedAudit));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch387NorthDakotaGlobalSyncV1();
  console.log(JSON.stringify(result, null, 2));
}
