import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'florida_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'florida_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
  batch23Summary: path.join(generatedDir, 'batch23_florida_exact_repair_summary_v1.json'),
  batch23Leafs: path.join(generatedDir, 'batch23_florida_verified_leaf_targets_v1.jsonl'),
  batch23Blockers: path.join(generatedDir, 'batch23_florida_blockers_v1.jsonl'),
  districtPacket: path.join(generatedDir, 'florida_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'florida_county_local_disability_resources_leaf_authoring_packet_v1.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch36_florida_final_blocker_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch36-florida-final-blocker-refresh-report-v1.md'),
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
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function recalcSummary(summary, gapRows, failureRows, verifiedRows) {
  const criticalRows = gapRows.filter((row) => row.critical);
  const strong = criticalRows.filter((row) => String(row.family_status || '').startsWith('verified_')).length;
  const missing = criticalRows.filter((row) => row.family_status === 'missing').length;
  const weak = criticalRows.length - strong - missing;
  return {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    recommended_batch: 'batch_2_repair_blocked',
    primary_gap_reason: 'bounded_official_leaf_packets_exhausted_without_county_grade_closure',
    strong_critical_families: strong,
    weak_critical_families: weak,
    missing_critical_families: missing,
    critical_gap_families: failureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: failureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    verified_source_families_with_samples: verifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: failureRows.filter((row) => row.severity === 'critical').map((row) => ({
      family: row.family,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows, facts) {
  return [
    '# Florida California-Grade Audit Report v2',
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
    '## Florida final blocker decision',
    '',
    `- Florida remains not index-safe because ${facts.educationLeafCount} reviewed district-owned leaves across ${facts.educationRootCount} bounded district packet roots still do not prove county-grade education routing statewide.`,
    `- Florida county-local disability resources remain blocked because the only reviewed DCF root packet (${facts.countyPacketRoot}) still collapses to a dead legacy map plus community-partner and statewide-customer-center replacements, not a county-grade official locator.`,
    '- No further bounded official/static repair is currently available from the reviewed Florida packet roots, so the state is now treated as truthfully final-blocked until new exact official targets are authored or the missing official locator is restored.',
  ].join('\n') + '\n';
}

export function generateBatch36FloridaFinalBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const batch23Summary = readJson(INPUTS.batch23Summary);
  const batch23Leafs = readJsonl(INPUTS.batch23Leafs);
  const batch23Blockers = readJsonl(INPUTS.batch23Blockers);
  const districtPacket = readJson(INPUTS.districtPacket);
  const countyPacket = readJson(INPUTS.countyPacket);

  const districtLeafs = batch23Leafs.filter((row) => row.family === 'district_or_county_education_routing');
  const countyBlocker = batch23Blockers.find((row) => row.family === 'county_local_disability_resources');
  if (!countyBlocker) {
    throw new Error('Florida county-local blocker must exist before final-blocker refresh.');
  }
  if (!batch23Summary.special_education_repaired || batch23Summary.county_local_disability_resources_repaired) {
    throw new Error('Florida batch23 summary no longer matches the expected bounded-repair baseline.');
  }

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_leaf_repair_exhausted',
        status_reason: `Reviewed district-owned education exact leaves verified (${districtLeafs.length}) across ${districtPacket.root_domains_to_review.length} bounded Florida packet roots, but county-grade coverage still cannot be proven for all 67 counties from the authored exact targets.`,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_missing_official_locator',
        status_reason: countyBlocker.reason,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'bounded_official_district_leaf_packet_exhausted_before_county_grade_coverage',
        evidence: `Verified exact leaf targets remain limited to ${districtLeafs.length} reviewed district-owned leaves across ${districtPacket.root_domains_to_review.length} bounded Florida packet roots (${districtPacket.root_domains_to_review.map((entry) => entry.source_domain).join(', ')}); this does not truthfully prove county-grade district routing statewide.`,
        next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: countyBlocker.blocker_code,
        evidence: countyBlocker.reason,
        next_action: 'hold_blocked_until_official_county_locator_is_restored_or_new_official_root_is_authored',
      };
    }
    return row;
  });

  const failureByFamily = new Map(updatedFailureRows.map((row) => [row.family, row]));
  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing' && row.family !== 'county_local_disability_resources') {
      return row;
    }
    const failure = failureByFamily.get(row.family);
    return {
      ...row,
      family_status: updatedGapRows.find((gapRow) => gapRow.family === row.family)?.family_status || row.family_status,
      evidence_strength: 'weak',
      blocker_code: failure?.failure_code || row.blocker_code,
      blocker_evidence: failure?.evidence || row.blocker_evidence,
    };
  });

  const updatedNextRows = [
    {
      state: 'florida',
      state_code: 'FL',
      priority_rank: 1,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'bounded_official_district_leaf_packet_exhausted_before_county_grade_coverage',
      next_action: 'hold_blocked_until_new_exact_district_targets_are_authored',
      evidence: `Bounded Florida district packet roots produced ${districtLeafs.length} reviewed exact leaves but still no county-grade routing closure for all 67 counties.`,
    },
    {
      state: 'florida',
      state_code: 'FL',
      priority_rank: 2,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: countyBlocker.blocker_code,
      next_action: 'hold_blocked_until_official_county_locator_is_restored_or_new_official_root_is_authored',
      evidence: countyBlocker.reason,
    },
  ];

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const facts = {
    educationLeafCount: districtLeafs.length,
    educationRootCount: districtPacket.root_domains_to_review.length,
    countyPacketRoot: countyPacket.root_domains_to_review[0]?.source_domain || 'unknown',
  };
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, facts);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    batch: 'batch_36_florida_final_blocker_refresh_v1',
    generated_at: new Date().toISOString(),
    state: 'florida',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    education_leaf_count: districtLeafs.length,
    education_root_count: districtPacket.root_domains_to_review.length,
    county_local_blocker_code: countyBlocker.blocker_code,
    final_blocker_count: updatedFailureRows.filter((row) => row.severity === 'critical').length,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 36 Florida Final Blocker Refresh Report v1',
    '',
    'This pass does not reopen scraping. It converts Florida’s remaining bounded packet evidence into explicit terminal blocker states so the state no longer sits in a misleading fast-finish partial bucket.',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- education_leaf_count: ${districtLeafs.length}`,
    `- education_root_count: ${districtPacket.root_domains_to_review.length}`,
    `- county_local_blocker_code: ${countyBlocker.blocker_code}`,
    '- Florida remains blocked until new exact district targets are authored and an official county-grade DCF locator or replacement root exists.',
  ].join('\n') + '\n');

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch36FloridaFinalBlockerRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
