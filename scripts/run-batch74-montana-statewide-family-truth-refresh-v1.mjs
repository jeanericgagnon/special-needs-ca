import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'montana_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'montana_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'montana_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'montana_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'montana_next_action_queue_v2.jsonl'),
  drmHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-42-022Z', 'pages', '00009-montana-nonprofit-support-disabilityrightsmt-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch74_montana_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch74-montana-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'montana-california-grade-audit-report-v2.md'),
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
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(text, pattern, label) {
  if (!text.includes(pattern)) {
    throw new Error(`Expected ${label} to include "${pattern}".`);
  }
}

function buildVerifiedRows(existingRows) {
  return existingRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'blocked_reviewed_first_party_support_without_explicit_statewide_panda_designation',
        evidence_strength: 'weak',
        sample_count: 1,
        query_basis: 'Reviewed first-party Disability Rights Montana evidence on disk proves a real statewide disability-rights organization with direct Montana contact routing and protection-and-advocacy framing, but the saved artifact does not preserve the exact statewide P&A system designation text required for upgrade.',
        blocker_code: 'reviewed_first_party_support_source_lacks_explicit_statewide_panda_designation',
        blocker_evidence: 'The reviewed Disability Rights Montana artifact preserves disability-rights branding, protection-and-advocacy history navigation, and Montana contact information, but not explicit statewide P&A system designation text.',
        samples: [
          {
            sample_name: 'Disability Rights Montana',
            source_url: 'https://www.disabilityrightsmt.org/',
            final_url: 'https://disabilityrightsmt.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:48.000Z',
            evidence_snippet: 'Disability Rights Montana – Protecting and advocating for the rights of people with disabilities. Protection & Advocacy History. Contact Us. 1022 Chestnut Street, Helena, MT 59601.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Montana California-Grade Batch 74 Report v1',
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
    '- Montana no longer belongs in UNSTARTED. The packet already has enough reviewed on-disk evidence to terminalize the real blockers without pretending the state is closer to California-grade than the evidence supports.',
    '- Disability Rights Montana is preserved as real reviewed statewide support evidence because the first-party page explicitly preserves disability-rights branding, protection-and-advocacy framing, and a Montana contact location.',
    '- That reviewed Disability Rights Montana artifact still does not preserve the exact statewide Protection and Advocacy system designation text required for upgrade, so P&A remains blocked rather than being promoted by inference.',
    '- Montana still has no reviewed PLUK or other first-party PTI artifact on disk, so PTI stays blocked on inventory-only evidence.',
    '- Montana still cannot reach California-grade or become index-safe because district or county education routing still depends on generic statewide fallback pages instead of county- or district-owned leaves, county/local disability resources still depend on mixed statewide/structural sources instead of reviewed county-owned local routing, and statewide legal-aid proof is still missing on disk.',
    '- Montana is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch74MontanaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const drmHtml = readText(INPUTS.drmHtml);
  assertIncludes(drmHtml, 'Disability Rights Montana &#8211; Protecting and advocating for the rights of people with disabilities.', 'Disability Rights Montana artifact');
  assertIncludes(drmHtml, 'Protection &#038; Advocacy History', 'Disability Rights Montana artifact');
  assertIncludes(drmHtml, 'Contact Us', 'Disability Rights Montana artifact');
  assertIncludes(drmHtml, 'Helena, MT 59601', 'Disability Rights Montana artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'blocked_reviewed_first_party_support_without_explicit_statewide_panda_designation',
        status_reason: 'reviewed first-party statewide disability-rights evidence exists, but the saved artifact does not preserve explicit statewide P&A system designation text',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_statewide_panda_designation',
        evidence: 'Reviewed Disability Rights Montana evidence preserves disability-rights branding, protection-and-advocacy framing, and Montana contact routing, but the saved first-party artifact does not preserve explicit statewide P&A system designation text.',
        next_action: 'hold_blocked_until_explicit_statewide_panda_designation_is_preserved_from_reviewed_first_party_source',
      };
    }
    return row;
  });

  const updatedVerifiedRows = buildVerifiedRows(verifiedRows);

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_statewide_panda_designation',
        next_action: 'hold_blocked_until_explicit_statewide_panda_designation_is_preserved_from_reviewed_first_party_source',
        evidence: 'Reviewed Disability Rights Montana evidence preserves disability-rights branding and Montana contact routing, but the saved first-party artifact does not preserve explicit statewide P&A system designation text.',
      };
    }
    return row;
  }).sort((a, b) => a.priority_rank - b.priority_rank);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 58,
    strong_critical_families: 7,
    weak_critical_families: 4,
    missing_critical_families: 1,
    major_gap_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
      'legal_aid',
    ],
    verified_source_families_with_samples: [
      'medicaid_state_health_coverage',
      'medicaid_waiver_hcbs_disability_services',
      'developmental_disability_idd_authority',
      'early_intervention_part_c',
      'special_education_idea_part_b',
      'district_or_county_education_routing',
      'vocational_rehabilitation_pre_ets',
      'protection_and_advocacy',
      'parent_training_information_center',
      'able_program',
      'ssi_ssa_federal_reference',
      'county_local_disability_resources',
    ],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Reviewed Montana packet evidence still routes district or county education through generic statewide OPI pages rather than county- or district-owned leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'protection_and_advocacy',
        severity: 'major',
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_statewide_panda_designation',
        evidence: 'Reviewed Disability Rights Montana evidence proves real statewide disability-rights support, but the saved first-party artifact does not preserve explicit statewide P&A system designation text.',
        next_action: 'hold_blocked_until_explicit_statewide_panda_designation_is_preserved_from_reviewed_first_party_source',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'Montana still has no reviewed first-party PLUK or other statewide PTI artifact on disk; the current packet only preserves inventory-only hints.',
        next_action: 'author_verified_state_manifest',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Montana still lacks reviewed first-party or authoritative statewide legal-aid evidence on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'County/local disability resources still depend on mixed statewide locator or structural dataset-derived rows instead of reviewed county-owned local routing evidence.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch_74_montana_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'montana',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
    ],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      drm: {
        sourceUrl: 'https://www.disabilityrightsmt.org/',
        finalUrl: 'https://disabilityrightsmt.org/',
      },
    },
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.mkdirSync(path.dirname(OUTPUTS.report), { recursive: true });
  fs.writeFileSync(OUTPUTS.report, [
    '# Montana Statewide Family Truth Refresh Summary v1',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- drm: ${batchSummary.evidence_checks.drm.sourceUrl} -> ${batchSummary.evidence_checks.drm.finalUrl}`,
    '',
    '## Decision',
    '',
    '- Disability Rights Montana was preserved as reviewed statewide support evidence but remained blocked for P&A because the saved artifact does not preserve explicit statewide designation text.',
    '- Montana remains terminal BLOCKED because district routing, county-local routing, PTI, and statewide legal aid are still unresolved.',
    '',
  ].join('\n'));
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    updatedFamilies: batchSummary.updated_families,
    remainingBlockers: batchSummary.remaining_blockers,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch74MontanaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
