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
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch410_new_hampshire_federal_idea_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch410-new-hampshire-federal-idea-repair-report-v1.md'),
};

const BATCH = 'batch410_new_hampshire_federal_idea_repair_v1';
const REVIEWED_DATE = '2026-06-26';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON =
  'federal_part_b_now_clears_but_live_nh_dhhs_nhes_and_local_education_hosts_still_block_public_contracts';

const SPED_REASON =
  `Reviewed ${REVIEWED_DATE} the current live official U.S. Department of Education IDEA-by-State page for New Hampshire at ` +
  '`https://sites.ed.gov/idea/state/new-hampshire/` after the saved New Hampshire DOE host family remained blocked behind public HTTP 403 `Access Denied` shells. ' +
  'The current official federal page is reviewable and New Hampshire-specific: it preserves the exact state heading `New Hampshire - Individuals with Disabilities Education Act` and publishes current IDEA Part B materials, including `2025 SPP/APR and State Determination Letters, Part B — New Hampshire` and prior New Hampshire Part B determination materials on the same official host. That is enough to keep statewide IDEA Part B authority evidence current while district-grade routing remains a separate blocked family until New Hampshire exposes a reviewable local education-routing contract.';

const DISTRICT_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live New Hampshire education host-family pass. ` +
  '`https://education.nh.gov/`, `https://www.education.nh.gov/`, `https://www.nh.gov/education/`, and `https://my.doe.nh.gov/ehb/` all still return the same public HTTP 403 `Access Denied` shell rather than any reviewable statewide or local education-routing content. ' +
  'The live federal IDEA-by-State page now rescues statewide Part B authority, but it does not provide county-, district-, or SAU-grade routing. New Hampshire therefore still lacks a reviewable public DOE lane for district_or_county_education_routing.';

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
    '- Statewide IDEA Part B authority now clears from the live official U.S. Department of Education IDEA-by-State New Hampshire page and its New Hampshire-specific Part B materials after the saved DOE host family stayed blocked.',
    '- The remaining blockers still require live reviewable New Hampshire DHHS, NHES, or local education-routing contracts that are not yet publicly preserved.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 410 New Hampshire Federal IDEA Repair v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: cleared only statewide IDEA Part B from the live official federal IDEA-by-State New Hampshire host while preserving the remaining NH blocked families',
    '',
    '## Evidence',
    '',
    `- ${SPED_REASON}`,
    `- ${DISTRICT_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch410NewHampshireFederalIdeaRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 42,
    strong_critical_families: 5,
    weak_critical_families: 7,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_live_nh_dhhs_nhes_or_local_education_contract_recovery',
    critical_gap_families: (summary.critical_gap_families || []).filter((family) => family !== 'special_education_idea_part_b'),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      special_education_idea_part_b: 'verified_state_grade',
      district_or_county_education_routing: 'blocked_live_education_roots_still_403_without_local_routing_contract',
    },
    final_blockers: (summary.final_blockers || []).filter((row) => row.family !== 'special_education_idea_part_b'),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: SPED_REASON,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_education_roots_still_403_without_local_routing_contract',
        status_reason: DISTRICT_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => row.family !== 'special_education_idea_part_b')
    .map((row) =>
      row.family === 'district_or_county_education_routing'
        ? {
            ...row,
            evidence: DISTRICT_REASON,
          }
        : row,
    );

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-26 official IDEA-by-State New Hampshire materials on the current U.S. Department of Education host after the saved NH DOE host family stayed blocked.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'IDEA-by-State New Hampshire',
            source_url: 'https://sites.ed.gov/idea/state/new-hampshire/',
            final_url: 'https://sites.ed.gov/idea/state/new-hampshire/',
            verification_status: 'official_verified',
            source_type: 'official_federal_state_specific_idea_page',
            source_table: BATCH,
            fetched_at: REVIEWED_AT,
            evidence_snippet: 'The live official page heading is `New Hampshire - Individuals with Disabilities Education Act` and it serves as the current state-specific IDEA authority page for New Hampshire.',
          },
          {
            sample_name: '2025 SPP/APR and State Determination Letters, Part B — New Hampshire',
            source_url: 'https://sites.ed.gov/idea/idea-files/2025-spp-apr-and-state-determination-letters-part-b-new-hampshire/',
            final_url: 'https://sites.ed.gov/idea/idea-files/2025-spp-apr-and-state-determination-letters-part-b-new-hampshire/',
            verification_status: 'official_verified',
            source_type: 'official_federal_state_specific_idea_material',
            source_table: BATCH,
            fetched_at: REVIEWED_AT,
            evidence_snippet: 'The live official page title is `2025 SPP/APR and State Determination Letters, Part B — New Hampshire - Individuals with Disabilities Education Act`.',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_education_roots_still_403_without_local_routing_contract',
        blocker_evidence: DISTRICT_REASON,
      };
    }
    return row;
  });

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'new-hampshire'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
        }
      : row,
  );

  const updatedNextRows = nextRows.filter((row) => row.family !== 'special_education_idea_part_b');

  const updatedAudit = {
    ...audit,
    states: audit.states.map((row) =>
      row.stateId === 'new-hampshire'
        ? {
            ...row,
            strongCriticalFamilies: 5,
            weakCriticalFamilies: 7,
            completenessPct: 42,
            familyStatuses: {
              ...(row.familyStatuses || {}),
              special_education_idea_part_b: 'verified_state_grade',
              district_or_county_education_routing: 'blocked_live_education_roots_still_403_without_local_routing_contract',
            },
            packetBatch: BATCH,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'hold_for_live_nh_dhhs_nhes_or_local_education_contract_recovery',
          }
        : row,
    ),
  };

  const nhNote =
    '- New Hampshire remains blocked after a 2026-06-26 bounded live repair pass: statewide IDEA Part B now clears from the official federal IDEA-by-State New Hampshire pages, but DHHS roots, NHES roots, and live local education-routing surfaces still do not expose a reviewable New Hampshire public contract.';
  const updatedAllStateReport = /- New Hampshire remains blocked after[^\n]*/.test(allStateReport)
    ? allStateReport.replace(/- New Hampshire remains blocked after[^\n]*/, nhNote)
    : allStateReport.replace(/(## Notes\s*\n\s*)/, `$1${nhNote}\n`);

  const updatedHandoff = handoff.replace(
    /- New Hampshire: `[^`]+`/,
    '- New Hampshire: `federal_part_b_now_clears_but_live_nh_dhhs_nhes_and_local_education_hosts_still_block_public_contracts`',
  );

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  writeText(INPUTS.allStateReport, updatedAllStateReport);
  writeText(INPUTS.handoff, updatedHandoff);
  writeText(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    generated_at: new Date().toISOString(),
    classification: 'BLOCKED',
    special_education_cleared_from_federal_idea: true,
    remaining_blocked_families: updatedSummary.critical_gap_families.length,
    counts_unchanged: { complete: 43, blocked: 7, indexSafe: 43 },
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch410NewHampshireFederalIdeaRepairV1();
  console.log(JSON.stringify(result, null, 2));
}
