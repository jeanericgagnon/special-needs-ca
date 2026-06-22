import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kentucky_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kentucky_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'kentucky_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kentucky_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kentucky_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  vr: path.join(generatedDir, 'kentucky_vr_reviewed_source_v1.json'),
  pti: path.join(generatedDir, 'kentucky_pti_reviewed_source_v1.json'),
  legal: path.join(generatedDir, 'kentucky_legal_aid_reviewed_source_v1.json'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch148_kentucky_statewide_source_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch148-kentucky-statewide-source-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kentucky-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP = 'dbhdid_js_shell_and_county_grade_local_leafs_remain_unverified';

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
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function assertIncludes(text, pattern, label) {
  if (!text.includes(pattern)) {
    throw new Error(`Expected ${label} to include "${pattern}".`);
  }
}

function buildVerifiedRows(existingRows, vrSource, ptiSource, legalSource) {
  return existingRows.map((row) => {
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed live Kentucky Career Center Vocational Rehabilitation leaf now provides role-pure statewide VR routing and application entry evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Kentucky Office of Vocational Rehabilitation',
            source_url: vrSource.source_url,
            final_url: vrSource.final_url,
            verification_status: vrSource.verification_status,
            source_type: vrSource.source_type,
            source_table: vrSource.source_table,
            fetched_at: vrSource.fetched_at,
            evidence_snippet: vrSource.evidence_snippet,
          }
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed first-party KY-SPIN About page now explicitly preserves PTI grant designation and statewide center language.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'KY-SPIN PTI About',
            source_url: ptiSource.source_url,
            final_url: ptiSource.final_url,
            verification_status: ptiSource.verification_status,
            source_type: ptiSource.source_type,
            source_table: ptiSource.source_table,
            fetched_at: ptiSource.fetched_at,
            evidence_snippet: ptiSource.evidence_snippet,
          }
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed Kentucky Justice Online now provides a statewide free legal-help route for Kentuckians plus named legal-aid organizations.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Kentucky Justice Online',
            source_url: legalSource.source_url,
            final_url: legalSource.final_url,
            verification_status: legalSource.verification_status,
            source_type: legalSource.source_type,
            source_table: legalSource.source_table,
            fetched_at: legalSource.fetched_at,
            evidence_snippet: legalSource.evidence_snippet,
          }
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kentucky California-Grade Audit Report v2',
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
    '## Kentucky truth refresh decision',
    '',
    '- Kentucky DD authority remains blocked because the reviewed exact DBHDID replacement still returns only a loading shell with no headings, contact signals, or role-aligned DD routing content.',
    '- Kentucky district/county education routing remains blocked because no reviewed county- or district-owned special-education leaves replace the generic statewide KDE fallback rows.',
    '- Kentucky county-local disability resources remain blocked because the packet still depends on stale fake-domain locator evidence or DOI mirror rows instead of reviewed county-grade office leaves.',
    '- Kentucky vocational rehabilitation upgrades because the reviewed Kentucky Career Center Vocational Rehabilitation leaf now provides a role-pure statewide VR route and direct application path.',
    '- Kentucky PTI upgrades because the first-party KY-SPIN About page explicitly preserves Parent Training and Information (PTI) grant history and statewide center language.',
    '- Kentucky legal aid upgrades because Kentucky Justice Online provides a statewide free legal-help route for Kentuckians and names the participating regional legal-aid organizations.',
    '- Kentucky is therefore still truthfully BLOCKED and not index-safe. The statewide packet now carries repaired VR, PTI, and legal-aid evidence, but California-grade completion still requires DD authority, district-grade education routing, and county-grade local disability routing.',
  ].join('\n') + '\n';
}

export function generateBatch148KentuckyStatewideSourceRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);
  const vrSource = readJson(INPUTS.vr);
  const ptiSource = readJson(INPUTS.pti);
  const legalSource = readJson(INPUTS.legal);

  assertIncludes(vrSource.page_title, 'Vocational Rehabilitation', 'Kentucky VR reviewed source title');
  assertIncludes(vrSource.evidence_snippet, 'Kentucky Office of Vocational Rehabilitation', 'Kentucky VR reviewed source snippet');
  assertIncludes(ptiSource.evidence_snippet, 'Parent Training and Information (PTI) grant', 'Kentucky PTI reviewed source snippet');
  assertIncludes(legalSource.evidence_snippet, 'free legal help for Kentuckians', 'Kentucky legal-aid reviewed source snippet');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'vocational_rehabilitation_pre_ets') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed live Kentucky Career Center Vocational Rehabilitation leaf now provides role-pure statewide VR routing and application entry evidence.',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed first-party KY-SPIN About page explicitly preserves PTI grant designation and statewide center language.',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed Kentucky Justice Online now provides a statewide free legal-help route for Kentuckians and names the participating legal-aid organizations.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => ![
    'vocational_rehabilitation_pre_ets',
    'parent_training_information_center',
    'legal_aid',
  ].includes(row.family));

  const updatedVerifiedRows = buildVerifiedRows(verifiedRows, vrSource, ptiSource, legalSource);

  const updatedNextRows = [
    {
      state: 'kentucky',
      state_code: 'KY',
      priority_rank: 1,
      family: 'developmental_disability_idd_authority',
      severity: 'critical',
      failure_code: 'reviewed_exact_target_only_returns_js_loading_shell',
      next_action: 'browser_assisted_or_api_backed_dbhdid_dd_capture',
      evidence: 'Reviewed 2026-06-21 Playwright render returned only "Loading to Department for Behavioral Health page." with no headings, contact signals, or role-aligned DD routing content.',
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      priority_rank: 2,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      next_action: 'author_county_or_district_exact_targets',
      evidence: 'Kentucky district routing still depends on generic statewide KDE fallback rows; no reviewed county- or district-owned special-education leaves are on disk.',
    },
    {
      state: 'kentucky',
      state_code: 'KY',
      priority_rank: 3,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'generic_or_statewide_evidence_used_where_local_required',
      next_action: 'author_county_local_exact_targets',
      evidence: 'County-local packet rows still rely on stale fake-domain locator evidence or DOI mirror rows instead of reviewed county-grade official office leaves.',
    }
  ];

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 75,
    strong_critical_families: 9,
    weak_critical_families: 3,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP,
    critical_gap_families: [
      'developmental_disability_idd_authority',
      'district_or_county_education_routing',
      'county_local_disability_resources',
    ],
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: updatedNextRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'kentucky'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 75,
          weak_critical_families: 3,
          missing_critical_families: 0,
          primary_gap_reason: PRIMARY_GAP,
        }
      : row
  ));

  const updatedAudit = {
    ...audit,
    states: audit.states.map((row) => (
      row.stateId === 'kentucky'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            incorrectlyIndexSafe: false,
            strongCriticalFamilies: 9,
            weakCriticalFamilies: 3,
            missingCriticalFamilies: 0,
            completenessPct: 75,
            familyStatuses: {
              ...row.familyStatuses,
              vocational_rehabilitation_pre_ets: 'verified_state_grade',
              parent_training_information_center: 'verified_state_grade',
              legal_aid: 'verified_state_grade',
            },
            packetBatch: 'batch_148_kentucky_statewide_source_repair_v1',
            packetPrimaryGapReason: PRIMARY_GAP,
            packetRecommendedBatch: 'batch_2_repair_blocked',
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    state: 'kentucky',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    upgraded_families: [
      'vocational_rehabilitation_pre_ets',
      'parent_training_information_center',
      'legal_aid',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    lesson_added: true,
  };

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Batch 148 Kentucky Statewide Source Repair Report v1',
      '',
      'This pass repairs only the cheaper statewide Kentucky source-family blockers. It upgrades VR, PTI, and legal aid from first-party reviewed evidence and leaves the DD, district-grade education, and county-local blockers untouched.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      `- upgraded_families: ${batchSummary.upgraded_families.join(', ')}`,
      `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch148KentuckyStatewideSourceRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
