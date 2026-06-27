import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-hampshire_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-hampshire_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-hampshire_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-hampshire_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-hampshire_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateReport: path.join(docsGeneratedDir, 'new-hampshire-california-grade-audit-report-v2.md'),
  stateCertification: path.join(generatedDir, 'state-certification', 'new-hampshire.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch412_new_hampshire_browser_proof_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch412-new-hampshire-browser-proof-report-v1.md'),
};

const BATCH = 'batch412_new_hampshire_browser_proof_v1';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_26_browser_recheck_confirms_nh_dhhs_doe_and_nhes_hosts_fail_with_public_access_denied_shells_not_just_raw_fetch_403s';

const DHHS_REASON =
  'Reviewed 2026-06-26 one more bounded New Hampshire DHHS host-family pass at browser level, not just raw fetch level. `https://www.dhhs.nh.gov/` rendered HTTP 403 with title `Access Denied` and body text `You don’t have permission to access "http://www.dhhs.nh.gov/" on this server.` The direct successor roots `https://dhhs.nh.gov/` and `https://www.nh.gov/dhhs/` remain non-reviewable for the same public lane. The deeper likely public leaves now fail the same way: `https://www.nh.gov/dhhs/contact-us/` and `https://www.nh.gov/dhhs/district-offices/` also return HTTP 403. The robots footholds no longer reopen anything either: `https://www.nh.gov/robots.txt` and `https://www.dhhs.nh.gov/robots.txt` now also return HTTP 403. New Hampshire therefore still lacks a reviewable public DHHS contract even after bounded alternate-leaf and robots checks.';

const EDUCATION_REASON =
  'Reviewed 2026-06-26 one more bounded New Hampshire education host-family pass at browser level. `https://www.education.nh.gov/` rendered HTTP 403 with title `Access Denied` and body text `You don’t have permission to access "http://www.education.nh.gov/" on this server.` The direct successor roots `https://education.nh.gov/`, `https://www.nh.gov/education/`, and `https://my.doe.nh.gov/ehb/` remain non-reviewable for the same public lane. The deeper likely directory leaves also fail closed: `https://www.education.nh.gov/school-and-district-profiles` and `https://www.education.nh.gov/find-school-or-district` now also return HTTP 403, while `https://education.nh.gov/robots.txt` returns HTTP 403 as well. The live federal IDEA-by-State page still rescues only statewide Part B authority and does not provide district-, county-, or SAU-grade routing. New Hampshire therefore still lacks a reviewable public DOE lane for local education routing even after bounded alternate-leaf and robots checks.';

const VR_REASON =
  'Reviewed 2026-06-26 one more bounded New Hampshire employment-security / VR host-family pass at browser level. `https://www.nhes.nh.gov/` rendered HTTP 403 with title `Access Denied` and body text `You don’t have permission to access "http://www.nhes.nh.gov/" on this server.` The direct successor roots `https://nhes.nh.gov/` and `https://www.nh.gov/nhes/` remain non-reviewable for the same public lane. The deeper likely public VR leaves now fail the same way: `https://www.nhes.nh.gov/services/disabilities/bvr.htm` and `https://www.nh.gov/employment/` both return HTTP 403, and `https://nhes.nh.gov/robots.txt` also returns HTTP 403. New Hampshire therefore still lacks a reviewable public VR successor lane even after bounded alternate-leaf and robots checks.';

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

function reasonForFamily(family) {
  if (
    [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'county_local_disability_resources',
    ].includes(family)
  ) {
    return DHHS_REASON;
  }
  if (family === 'district_or_county_education_routing') {
    return EDUCATION_REASON;
  }
  if (family === 'vocational_rehabilitation_pre_ets') {
    return VR_REASON;
  }
  return null;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Hampshire California-Grade Audit Report v2',
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
    '- New Hampshire remains BLOCKED and not index-safe.',
    '- Statewide IDEA Part B still clears only from the live official U.S. Department of Education IDEA-by-State New Hampshire lane.',
    '- The remaining DHHS, DOE local-routing, and NHES lanes are now proved blocked by browser-rendered `Access Denied` shells, not just raw 403 fetches.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 412 New Hampshire Browser Proof v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: replaced residual raw-fetch ambiguity with browser-rendered public `Access Denied` proof for DHHS, DOE, and NHES host families',
    '',
    '## Evidence',
    '',
    `- ${DHHS_REASON}`,
    `- ${EDUCATION_REASON}`,
    `- ${VR_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch412NewHampshireBrowserProofV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  const stateCertification = readJson(INPUTS.stateCertification);

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 42,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_live_nh_dhhs_nhes_or_local_education_contract_recovery',
    final_blockers: (summary.final_blockers || []).map((row) => {
      const reason = reasonForFamily(row.family);
      return reason ? { ...row, evidence: reason } : row;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    const reason = reasonForFamily(row.family);
    return reason ? { ...row, status_reason: reason } : row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    const reason = reasonForFamily(row.family);
    return reason ? { ...row, evidence: reason } : row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    const reason = reasonForFamily(row.family);
    return reason ? { ...row, blocker_evidence: reason } : row;
  });

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'new-hampshire'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'hold_for_live_nh_dhhs_nhes_or_local_education_contract_recovery',
        }
      : row,
  );

  const updatedAudit = {
    ...audit,
    states: audit.states.map((row) =>
      row.stateId === 'new-hampshire'
        ? {
            ...row,
            packetBatch: BATCH,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'hold_for_live_nh_dhhs_nhes_or_local_education_contract_recovery',
          }
        : row,
    ),
  };

  const nhNote =
    '- New Hampshire remains blocked after a 2026-06-26 bounded browser recheck: `www.dhhs.nh.gov`, `www.education.nh.gov`, and `www.nhes.nh.gov` each render public `Access Denied` shells in a live browser, while only the federal IDEA-by-State page remains reviewable for statewide Part B.';
  const updatedAllStateReport = /- New Hampshire remains blocked after[^\n]*/.test(allStateReport)
    ? allStateReport.replace(/- New Hampshire remains blocked after[^\n]*/, nhNote)
    : `${allStateReport.trimEnd()}\n${nhNote}\n`;

  const updatedHandoff = handoff.replace(
    /- New Hampshire: `[^`]+`/,
    '- New Hampshire: `bounded_2026_06_26_browser_recheck_confirms_nh_dhhs_doe_and_nhes_hosts_fail_with_public_access_denied_shells_not_just_raw_fetch_403s`',
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
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  writeText(INPUTS.allStateReport, updatedAllStateReport);
  writeText(INPUTS.handoff, updatedHandoff);
  writeText(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, nextRows));
  writeJson(INPUTS.stateCertification, updatedStateCertification);

  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    generated_at: new Date().toISOString(),
    classification: 'BLOCKED',
    dhhs_browser_access_denied: true,
    education_browser_access_denied: true,
    nhes_browser_access_denied: true,
    dhhs_alternate_leaves_403: true,
    education_alternate_leaves_403: true,
    vr_alternate_leaves_403: true,
    robots_footholds_all_403: true,
    federal_idea_still_only_statewide_clear_lane: true,
    completeness_pct: 42,
    counts_unchanged: countsUnchanged,
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch412NewHampshireBrowserProofV1();
  console.log(JSON.stringify(result, null, 2));
}
