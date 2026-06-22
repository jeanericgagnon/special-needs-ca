import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  partCSource: path.join(generatedDir, 'kansas_part_c_reviewed_source_v1.json'),
  specialEdSource: path.join(generatedDir, 'kansas_special_education_reviewed_source_v1.json'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch147_kansas_ksde_leaf_rehydration_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch147-kansas-ksde-leaf-rehydration-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP = 'kancare_kdads_access_blocked_and_no_county_or_district_education_contract_preserved';
const DISTRICT_BLOCKER = 'official_statewide_education_leaves_live_but_no_county_or_district_contract_preserved';
const DISTRICT_REASON = 'The live KSDE Special Education, Dispute Resolution, Parent Rights, Data Central Special Education Reports, and School District Maps leaves are again reachable, but the current packet still preserves no extracted county-to-district routing contract or district-owned special-education local-contact source, so county-grade education routing remains blocked.';

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

function buildVerifiedRows(existingRows, partCSource, specialEdSource) {
  return existingRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed live KSDE Early Childhood Special Education leaf now again provides Kansas birth-to-three, Part C, KDHE administration, and local ITS referral context.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Kansas Early Childhood Special Education',
            source_url: partCSource.source_url,
            final_url: partCSource.final_url,
            verification_status: partCSource.verification_status,
            source_type: partCSource.source_type,
            source_table: partCSource.source_table,
            fetched_at: partCSource.fetched_at,
            evidence_snippet: partCSource.evidence_snippet,
          }
        ]
      };
    }
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed live KSDE Special Education leaf now again preserves a role-pure IDEA Part B root with direct dispute-resolution and parent-rights leaves on the same official path.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Kansas Special Education',
            source_url: specialEdSource.source_url,
            final_url: specialEdSource.final_url,
            verification_status: specialEdSource.verification_status,
            source_type: specialEdSource.source_type,
            source_table: specialEdSource.source_table,
            fetched_at: specialEdSource.fetched_at,
            evidence_snippet: specialEdSource.evidence_snippet,
          }
        ]
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_district_or_county_leafs_unverified',
        evidence_strength: 'weak',
        blocker_code: DISTRICT_BLOCKER,
        blocker_evidence: DISTRICT_REASON,
        sample_count: 0,
        samples: [],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Education Leaf Rehydration v1',
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
    '- Kansas early intervention and statewide special education are no longer blocked because the exact KSDE Early Childhood Special Education and Special Education leaves are live again and preserve role-pure Part C / IDEA evidence.',
    '- Kansas remains BLOCKED and not index-safe because the KanCare and KDADS stacks still return access-denied responses, and county-grade education routing still lacks a preserved county-to-district or district-owned local-contact contract.',
  ].join('\n') + '\n';
}

export function generateBatch147KansasKsdeLeafRehydrationV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);
  const partCSource = readJson(INPUTS.partCSource);
  const specialEdSource = readJson(INPUTS.specialEdSource);

  assertIncludes(partCSource.page_title, 'Early Childhood Special Education', 'Kansas Part C reviewed source title');
  assertIncludes(partCSource.evidence_snippet, 'Part C of the Individuals with Disabilities Education Act', 'Kansas Part C reviewed source snippet');
  assertIncludes(partCSource.evidence_snippet, 'www.itsofks.org', 'Kansas Part C reviewed source snippet');
  assertIncludes(specialEdSource.page_title, 'Special Education', 'Kansas special education reviewed source title');
  assertIncludes(specialEdSource.evidence_snippet, 'Dispute Resolution', 'Kansas special education reviewed source snippet');
  assertIncludes(specialEdSource.evidence_snippet, 'Procedural Safeguards', 'Kansas special education reviewed source snippet');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'early_intervention_part_c') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.',
      };
    }
    if (row.family === 'special_education_idea_part_b') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_exact_district_or_county_leafs_unverified',
        status_reason: DISTRICT_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => !['early_intervention_part_c', 'special_education_idea_part_b', 'district_or_county_education_routing'].includes(row.family));

  updatedFailureRows.splice(3, 0, {
    state: 'kansas',
    state_code: 'KS',
    family: 'district_or_county_education_routing',
    severity: 'critical',
    failure_code: DISTRICT_BLOCKER,
    evidence: 'Reviewed 2026-06-22 live probes to the exact KSDE Special Education, Dispute Resolution, Parent Rights, Data Central Special Education Reports, and School District Maps leaves now succeed, but the packet still preserves no extracted county-to-district routing contract or district-owned local special-education contact source.',
    next_action: 'author_exact_district_routing_contract_from_official_datacentral_or_county_map_sources',
  });

  const updatedVerifiedRows = buildVerifiedRows(verifiedRows, partCSource, specialEdSource);

  const updatedNextRows = [
    {
      state: 'kansas',
      state_code: 'KS',
      priority_rank: 1,
      family: 'medicaid_state_health_coverage',
      severity: 'critical',
      failure_code: 'reviewed_exact_medicaid_root_access_blocked',
      next_action: 'browser_assisted_or_reviewed_alt_official_medicaid_leaf',
      evidence: 'Reviewed 2026-06-22 live probe to the exact Kansas Medicaid root https://www.kancare.ks.gov/ still returns HTTP 403 Forbidden / access denied instead of Medicaid content.',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      priority_rank: 2,
      family: 'medicaid_waiver_hcbs_disability_services',
      severity: 'critical',
      failure_code: 'reviewed_exact_waiver_leaf_access_blocked',
      next_action: 'browser_assisted_or_reviewed_alt_official_waiver_leaf',
      evidence: 'Reviewed 2026-06-22 live probe to the exact KDADS waiver and HCBS surfaces still returns HTTP 403 Forbidden / access denied.',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      priority_rank: 3,
      family: 'developmental_disability_idd_authority',
      severity: 'critical',
      failure_code: 'legacy_dd_root_dead_and_reviewed_replacement_access_blocked',
      next_action: 'browser_assisted_or_reviewed_alt_official_dd_leaf',
      evidence: 'The old dhhs.kansas.gov/dd root remains dead, and reviewed 2026-06-22 live probe to the exact KDADS root still returns HTTP 403 Forbidden / access denied instead of DD content.',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      priority_rank: 4,
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: DISTRICT_BLOCKER,
      next_action: 'author_exact_district_routing_contract_from_official_datacentral_or_county_map_sources',
      evidence: 'Reviewed 2026-06-22 live probes to the exact KSDE Special Education, Dispute Resolution, Parent Rights, Data Central Special Education Reports, and School District Maps leaves now succeed, but the packet still preserves no extracted county-to-district routing contract or district-owned local special-education contact source.',
    },
    {
      state: 'kansas',
      state_code: 'KS',
      priority_rank: 5,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: 'legacy_county_locator_dead_and_reviewed_replacement_access_blocked',
      next_action: 'browser_assisted_or_author_county_local_exact_targets',
      evidence: 'The old dhhs.kansas.gov/locations locator remains dead, and reviewed 2026-06-22 live probe to the exact KDADS root still returns HTTP 403 Forbidden / access denied, so no reviewed county-grade replacement is captured.',
    }
  ];

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 58,
    strong_critical_families: 7,
    weak_critical_families: 5,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP,
    critical_gap_families: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
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
    row.state === 'kansas'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 58,
          weak_critical_families: 5,
          missing_critical_families: 0,
          primary_gap_reason: PRIMARY_GAP,
        }
      : row
  ));

  const updatedAudit = {
    ...audit,
    states: audit.states.map((row) => (
      row.stateId === 'kansas'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            incorrectlyIndexSafe: false,
            strongCriticalFamilies: 7,
            weakCriticalFamilies: 5,
            missingCriticalFamilies: 0,
            completenessPct: 58,
            familyStatuses: {
              ...row.familyStatuses,
              early_intervention_part_c: 'verified_state_grade',
              special_education_idea_part_b: 'verified_state_grade',
              district_or_county_education_routing: 'blocked_exact_district_or_county_leafs_unverified',
            },
            packetBatch: 'batch_147_kansas_ksde_leaf_rehydration_v1',
            packetPrimaryGapReason: PRIMARY_GAP,
            packetRecommendedBatch: 'batch_2_repair_blocked',
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    rehydrated_families: ['early_intervention_part_c', 'special_education_idea_part_b'],
    sharpened_blocker: 'district_or_county_education_routing',
    lesson_added: true,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 147 Kansas KSDE Leaf Rehydration Report v1',
      '',
      'This pass repairs only the stale Kansas KSDE blocker. It restores the two statewide education families whose exact official leaves are live again, and it narrows district-grade routing to the remaining missing county-to-district or district-owned local-contact contract.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      `- rehydrated_families: ${batchSummary.rehydrated_families.join(', ')}`,
      `- sharpened_blocker: ${batchSummary.sharpened_blocker}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch147KansasKsdeLeafRehydrationV1();
  console.log(JSON.stringify(summary, null, 2));
}
