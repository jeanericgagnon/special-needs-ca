import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const STATE_IDS = ['north-dakota', 'rhode-island', 'vermont', 'wyoming'];

const INPUTS = {
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch389_review_branch_global_sync_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch389-review-branch-global-sync-report-v1.md'),
};

const STATE_INPUTS = {
  'north-dakota': {
    summary: path.join(generatedDir, 'north-dakota_california_grade_summary_v2.json'),
    gap: path.join(generatedDir, 'north-dakota_gap_matrix_v2.jsonl'),
    note: '- North Dakota is now COMPLETE/index-safe from the live HHS Developmental Disabilities Regional Offices county contracts, the reviewed DPI district-list PDF, and refreshed first-party Legal Services of North Dakota routing evidence.',
  },
  'rhode-island': {
    summary: path.join(generatedDir, 'rhode-island_california_grade_summary_v2.json'),
    gap: path.join(generatedDir, 'rhode-island_gap_matrix_v2.jsonl'),
    note: '- Rhode Island is now COMPLETE/index-safe from the official RIDE district-routing surfaces plus live BHDDH DD provider pages and current provider PDFs with local mailing addresses and phone numbers.',
  },
  vermont: {
    summary: path.join(generatedDir, 'vermont_california_grade_summary_v2.json'),
    gap: path.join(generatedDir, 'vermont_gap_matrix_v2.jsonl'),
    note: '- Vermont is now COMPLETE/index-safe from the current official AHS Field Services ArcGIS map and REST layers plus the reviewed Vermont government school-to-district open-data dataset.',
  },
  wyoming: {
    summary: path.join(generatedDir, 'wyoming_california_grade_summary_v2.json'),
    gap: path.join(generatedDir, 'wyoming_gap_matrix_v2.jsonl'),
    note: '- Wyoming is now COMPLETE/index-safe from the official HCBS Specialists by County lane, the public BES county caseload PDF, reviewed WDE routing pages, and current official legal-aid evidence.',
  },
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

  const filtered = currentText
    .split('\n')
    .filter((line) =>
      !line.startsWith('- North Dakota remains blocked') &&
      !line.startsWith('- Rhode Island remains blocked') &&
      !line.startsWith('- Vermont remains blocked') &&
      !line.startsWith('- Wyoming remains blocked') &&
      !line.startsWith('- North Dakota is now COMPLETE/index-safe') &&
      !line.startsWith('- Rhode Island is now COMPLETE/index-safe') &&
      !line.startsWith('- Vermont is now COMPLETE/index-safe') &&
      !line.startsWith('- Wyoming is now COMPLETE/index-safe')
    );

  replaceLine(filtered, '- COMPLETE:', `- COMPLETE: ${updatedAudit.classifications.COMPLETE}`);
  replaceLine(filtered, '- BLOCKED:', `- BLOCKED: ${updatedAudit.classifications.BLOCKED}`);
  replaceLine(filtered, '- index-safe states:', `- index-safe states: ${updatedAudit.indexSafeCount}`);
  replaceLine(filtered, '- complete states:', `- complete states: ${completeStates.join(', ')}`);
  replaceLine(filtered, '- blocked states:', `- blocked states: ${blockedStates.join(', ')}`);

  const notes = STATE_IDS.map((stateId) => STATE_INPUTS[stateId].note);
  return `${filtered.join('\n').trimEnd()}\n${notes.join('\n')}\n`;
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
    '# Batch 389 Review Branch Global Sync v1',
    '',
    `- COMPLETE: ${updatedAudit.classifications.COMPLETE}`,
    `- BLOCKED: ${updatedAudit.classifications.BLOCKED}`,
    `- indexSafeCount: ${updatedAudit.indexSafeCount}`,
    `- incorrectlyIndexSafeStates: ${JSON.stringify(updatedAudit.incorrectlyIndexSafeStates)}`,
    '',
    '## Change',
    '',
    '- Synced the reviewed North Dakota, Rhode Island, Vermont, and Wyoming completion packets into the B2 branch control plane.',
    '- Updated the statewide priority queue, audit, all-state report, and Gemini handoff to match the branch-local reviewed completion evidence.',
  ].join('\n') + '\n';
}

export function generateBatch389ReviewBranchGlobalSyncV1() {
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');

  const statePackets = Object.fromEntries(
    STATE_IDS.map((stateId) => {
      const summary = readJson(STATE_INPUTS[stateId].summary);
      const gapRows = readJsonl(STATE_INPUTS[stateId].gap);
      const familyStatuses = Object.fromEntries(gapRows.map((row) => [row.family, row.family_status]));
      return [stateId, { summary, familyStatuses }];
    })
  );

  const updatedQueueRows = queueRows.map((row) => {
    const packet = statePackets[row.state];
    if (!packet) return row;
    return {
      ...row,
      classification: 'COMPLETE',
      index_safe: true,
      completeness_pct: packet.summary.completeness_pct,
      missing_critical_families: packet.summary.missing_critical_families,
      weak_critical_families: packet.summary.weak_critical_families,
      primary_gap_reason: packet.summary.primary_gap_reason,
      recommended_batch: packet.summary.recommended_batch,
      status: 'COMPLETE',
      repair_lane: 'maintain_truth_only',
    };
  });

  const updatedStates = allStateAudit.states.map((row) => {
    const packet = statePackets[row.stateId];
    if (!packet) return row;
    return {
      ...row,
      classification: 'COMPLETE',
      indexSafe: true,
      incorrectlyIndexSafe: false,
      strongCriticalFamilies: packet.summary.strong_critical_families,
      weakCriticalFamilies: packet.summary.weak_critical_families,
      missingCriticalFamilies: packet.summary.missing_critical_families,
      totalCriticalFamilies: packet.summary.total_critical_families,
      completenessPct: packet.summary.completeness_pct,
      familyStatuses: packet.familyStatuses,
      packetGenerated: true,
      packetBatch: packet.summary.batch,
      packetPrimaryGapReason: packet.summary.primary_gap_reason,
      packetRecommendedBatch: packet.summary.recommended_batch,
    };
  });

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
    batch: 'batch389_review_branch_global_sync_v1',
    generated_at: new Date().toISOString(),
    synced_states: STATE_IDS,
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
  const result = generateBatch389ReviewBranchGlobalSyncV1();
  console.log(JSON.stringify(result, null, 2));
}
