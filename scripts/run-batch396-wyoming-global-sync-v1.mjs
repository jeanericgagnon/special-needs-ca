import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'wyoming_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'wyoming_gap_matrix_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch396_wyoming_global_sync_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch396-wyoming-global-sync-report-v1.md'),
};

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

  const wyNote = '- Wyoming is now COMPLETE/index-safe from the reviewed public WDE `Special Education Director` directory lane, which returns district-specific local routing contacts for all 23 counties on the official host.';
  const filtered = currentText
    .split('\n')
    .filter((line) =>
      !line.startsWith('- Wyoming remains blocked') &&
      !line.startsWith('- Wyoming is now COMPLETE/index-safe')
    );

  replaceLine(filtered, '- COMPLETE:', `- COMPLETE: ${updatedAudit.classifications.COMPLETE}`);
  replaceLine(filtered, '- BLOCKED:', `- BLOCKED: ${updatedAudit.classifications.BLOCKED}`);
  replaceLine(filtered, '- index-safe states:', `- index-safe states: ${updatedAudit.indexSafeCount}`);
  replaceLine(filtered, '- complete states:', `- complete states: ${completeStates.join(', ')}`);
  replaceLine(filtered, '- blocked states:', `- blocked states: ${blockedStates.join(', ')}`);

  return `${filtered.join('\n').trimEnd()}\n${wyNote}\n`;
}

function buildHandoff(currentText, updatedAudit) {
  const completeStates = updatedAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = updatedAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  const focusIndex = currentText.indexOf('## Current Focus State:');
  const focusPart = focusIndex >= 0 ? currentText.slice(focusIndex) : '';

  return [
    '# Gemini Source Scout Handoff',
    '',
    `Updated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    focusPart.trim(),
  ].join('\n').trimEnd() + '\n';
}

function buildBatchReport(updatedAudit) {
  return [
    '# Batch 396 Wyoming Global Sync v1',
    '',
    `- COMPLETE: ${updatedAudit.classifications.COMPLETE}`,
    `- BLOCKED: ${updatedAudit.classifications.BLOCKED}`,
    `- indexSafeCount: ${updatedAudit.indexSafeCount}`,
    `- incorrectlyIndexSafeStates: ${JSON.stringify(updatedAudit.incorrectlyIndexSafeStates)}`,
    '',
    '## Change',
    '',
    '- Integrated the reviewed Wyoming completion into the global audit, priority queue, all-state report, and Gemini handoff.',
    '- Rebuilt the complete/blocked state lists from the current audit truth so the handoff no longer carries stale Rhode Island or Massachusetts blocker lines.',
  ].join('\n') + '\n';
}

export function generateBatch396WyomingGlobalSyncV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');

  const familyStatuses = Object.fromEntries(gapRows.map((row) => [row.family, row.family_status]));

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'wyoming'
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
    row.stateId === 'wyoming'
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
          packetRecommendedBatch: 'complete_maintain',
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

  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport, updatedAudit));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(handoff, updatedAudit));
  writeJson(OUTPUTS.summary, {
    batch: 'batch396_wyoming_global_sync_v1',
    generated_at: new Date().toISOString(),
    wyoming_classification: 'COMPLETE',
    complete_count: updatedAudit.classifications.COMPLETE,
    blocked_count: updatedAudit.classifications.BLOCKED,
    index_safe_count: updatedAudit.indexSafeCount,
    incorrectly_index_safe_states: updatedAudit.incorrectlyIndexSafeStates,
  });
  fs.writeFileSync(OUTPUTS.report, buildBatchReport(updatedAudit));

  return {
    complete_count: updatedAudit.classifications.COMPLETE,
    blocked_count: updatedAudit.classifications.BLOCKED,
    index_safe_count: updatedAudit.indexSafeCount,
    incorrectly_index_safe_states: updatedAudit.incorrectlyIndexSafeStates,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch396WyomingGlobalSyncV1();
  console.log(JSON.stringify(result, null, 2));
}
