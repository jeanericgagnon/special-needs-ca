import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  auditV3: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  priorityV3: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  txSummaryV10: path.join(generatedDir, 'tx_verification_summary_v10.json'),
};

const COHORT_SIZE = 5;

const STATE_LABEL = {
  california: 'California',
  pennsylvania: 'Pennsylvania',
  florida: 'Florida',
  georgia: 'Georgia',
  ohio: 'Ohio',
};

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
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function repairLaneForAction(action) {
  switch (action) {
    case 'author_county_or_district_exact_targets':
      return 'county_district_leaf_repair';
    case 'author_verified_state_manifest':
      return 'state_manifest_repair';
    case 'author_or_verify_statewide_source_family':
      return 'statewide_family_repair';
    case 'keep_noindex_and_run_state_repair_lane':
      return 'launch_gate_hold';
    default:
      return 'manual_truth_review';
  }
}

function buildRepairQueue(stateRow, failures, gaps) {
  const gapMap = new Map(gaps.map((row) => [row.family, row]));
  return failures.map((failure, index) => {
    const gap = gapMap.get(failure.family) || null;
    const countyGradeRequired = Boolean(gap?.county_grade_required);
    const familyStatus = gap?.family_status || 'unknown';
    return {
      state: stateRow.state,
      state_code: stateRow.state_code,
      state_name: stateRow.state_name,
      repair_priority_rank: index + 1,
      family: failure.family,
      severity: failure.severity,
      failure_code: failure.failure_code,
      family_status: familyStatus,
      county_grade_required: countyGradeRequired,
      repair_lane: repairLaneForAction(failure.next_action),
      next_action: failure.next_action,
      truth_risk: countyGradeRequired || failure.severity === 'critical' ? 'high' : 'medium',
      evidence: failure.evidence,
    };
  });
}

function buildRepairManifest(stateRow, repairQueue) {
  const criticalRows = repairQueue.filter((row) => row.severity === 'critical');
  const laneCounts = repairQueue.reduce((acc, row) => {
    acc[row.repair_lane] = (acc[row.repair_lane] || 0) + 1;
    return acc;
  }, {});
  return {
    state: stateRow.state,
    state_code: stateRow.state_code,
    state_name: stateRow.state_name,
    batch: 'batch_18_failure_class_repair_states_v1',
    classification: stateRow.classification,
    index_safe: stateRow.index_safe,
    completeness_pct: stateRow.completeness_pct,
    repair_queue_count: repairQueue.length,
    critical_repair_count: criticalRows.length,
    primary_repair_lane: repairQueue[0]?.repair_lane || null,
    lane_counts: laneCounts,
    critical_families: criticalRows.map((row) => row.family),
    ready_for_completion_claim: false,
    texas_v10_rule_basis: [
      'Preserve noindex until all critical families are verified',
      'District-grade routing must use direct local or district-owned evidence, not generic or statewide fallback',
      'Legacy/inventory-only evidence does not satisfy California-grade completeness',
    ],
  };
}

function buildStateRepairReport(stateRow, manifest, repairQueue) {
  return [
    `# ${stateRow.state_name} Batch 18 Failure-Class Repair Report v1`,
    '',
    `- classification: ${manifest.classification}`,
    `- index_safe: ${manifest.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${manifest.completeness_pct}`,
    `- repair_queue_count: ${manifest.repair_queue_count}`,
    `- primary_repair_lane: ${manifest.primary_repair_lane || 'none'}`,
    '',
    '## Repair queue',
    '',
    ...repairQueue.map((row) => `- [${row.severity}] ${row.family}: lane=${row.repair_lane}; next_action=${row.next_action}; family_status=${row.family_status}`),
    '',
    '## Completion decision',
    '',
    `- ${stateRow.state_name} remains ${manifest.classification} and not index-safe. Batch 18 only converts packet evidence into repair lanes; it does not weaken the California-grade gate.`,
  ].join('\n');
}

function buildBatchSummary(cohortRows, txSummaryV10) {
  const laneCounts = {};
  const failureClassCounts = {};
  for (const row of cohortRows) {
    for (const repairRow of row.repairQueue) {
      laneCounts[repairRow.repair_lane] = (laneCounts[repairRow.repair_lane] || 0) + 1;
      failureClassCounts[repairRow.failure_code] = (failureClassCounts[repairRow.failure_code] || 0) + 1;
    }
  }
  return {
    batch: 'batch_18_failure_class_repair_states_v1',
    generated_at: new Date().toISOString(),
    cohort_states: cohortRows.map((row) => ({
      state: row.state,
      classification: row.summary.classification,
      index_safe: row.summary.index_safe,
      completeness_pct: row.summary.completeness_pct,
      repair_queue_count: row.repairQueue.length,
      critical_repair_count: row.repairQueue.filter((entry) => entry.severity === 'critical').length,
      primary_repair_lane: row.manifest.primary_repair_lane,
    })),
    failure_class_counts: failureClassCounts,
    repair_lane_counts: laneCounts,
    complete_states: [],
    generated_all_state_v4: false,
    texas_preserved_complete: Boolean(txSummaryV10.v10.pass_counties === 254 && txSummaryV10.index_safe === true),
  };
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 18 Failure-Class Repair States Report v1',
    '',
    'This pass converts the first five non-COMPLETE states in all-state v3 priority order into explicit family-level repair lanes. It uses the existing California-grade state packets as the control plane and does not relax the Texas v10 gate.',
    '',
    '## Cohort state status',
    '',
    ...batchSummary.cohort_states.map((row) => `- ${STATE_LABEL[row.state] || row.state}: ${row.classification}; index_safe=${row.index_safe}; completeness_pct=${row.completeness_pct}; repair_queue_count=${row.repair_queue_count}; primary_repair_lane=${row.primary_repair_lane}`),
    '',
    '## Repair lane counts',
    '',
    ...Object.entries(batchSummary.repair_lane_counts).map(([lane, count]) => `- ${lane}: ${count}`),
    '',
    '## Failure class counts',
    '',
    ...Object.entries(batchSummary.failure_class_counts).map(([code, count]) => `- ${code}: ${count}`),
    '',
    '## Batch outcome',
    '',
    `- complete_states: ${batchSummary.complete_states.join(', ') || 'none'}`,
    `- generated_all_state_v4: ${batchSummary.generated_all_state_v4 ? 'true' : 'false'}`,
    `- texas_preserved_complete: ${batchSummary.texas_preserved_complete ? 'true' : 'false'}`,
    '',
    '## Lessons learned update',
    '',
    '- After packet coverage reaches 50/50, the next best batch is a shared failure-class repair cohort, not another queue-expansion cohort.',
  ].join('\n');
}

export function generateBatch18FailureClassRepairStatesV1() {
  const auditV3 = readJson(INPUTS.auditV3);
  const priorityV3 = readJsonl(INPUTS.priorityV3);
  const txSummaryV10 = readJson(INPUTS.txSummaryV10);

  if (!auditV3.packetCoverageCount || auditV3.packetCoverageCount !== 50) {
    throw new Error('Batch 18 requires v3 packet coverage count of 50.');
  }
  if (txSummaryV10.v10.pass_counties !== 254 || txSummaryV10.index_safe !== true) {
    throw new Error('Texas v10 must remain 254 PASS and index-safe before Batch 18 can run.');
  }

  const cohortStates = priorityV3.filter((row) => row.classification !== 'COMPLETE').slice(0, COHORT_SIZE);
  const cohortRows = cohortStates.map((priorityRow) => {
    const stateId = priorityRow.state;
    const summary = readJson(path.join(generatedDir, `${stateId}_california_grade_summary_v2.json`));
    const gaps = readJsonl(path.join(generatedDir, `${stateId}_gap_matrix_v2.jsonl`));
    const failures = readJsonl(path.join(generatedDir, `${stateId}_failure_ledger_v2.jsonl`));

    const repairQueue = buildRepairQueue(summary, failures, gaps);
    const manifest = buildRepairManifest(summary, repairQueue);
    const stateReport = buildStateRepairReport(summary, manifest, repairQueue);

    writeJsonl(path.join(generatedDir, `${stateId}_repair_family_queue_v1.jsonl`), repairQueue);
    writeJson(path.join(generatedDir, `${stateId}_repair_manifest_v1.json`), manifest);
    fs.writeFileSync(path.join(docsGeneratedDir, `${stateId}-batch18-failure-class-repair-report-v1.md`), `${stateReport}\n`);

    return {
      state: stateId,
      summary,
      repairQueue,
      manifest,
    };
  });

  const crossStateRepairQueue = cohortRows.flatMap((row) => row.repairQueue);
  const batchSummary = buildBatchSummary(cohortRows, txSummaryV10);
  const batchReport = buildBatchReport(batchSummary);

  writeJson(path.join(generatedDir, 'batch18_failure_class_repair_states_summary_v1.json'), batchSummary);
  writeJsonl(path.join(generatedDir, 'batch18_failure_class_repair_queue_v1.jsonl'), crossStateRepairQueue);
  fs.writeFileSync(path.join(docsGeneratedDir, 'batch18-failure-class-repair-states-report-v1.md'), `${batchReport}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch18FailureClassRepairStatesV1();
  console.log(JSON.stringify({
    ok: true,
    cohortStates: summary.cohort_states.map((row) => row.state),
    repairLaneCounts: summary.repair_lane_counts,
    texasPreservedComplete: summary.texas_preserved_complete,
  }, null, 2));
}
