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
  failure: path.join(generatedDir, 'wyoming_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'wyoming_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'wyoming_next_action_queue_v2.jsonl'),
  pandaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-13-847Z', 'pages', '00010-wyoming-nonprofit-support-wypanda-com.html'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-13-847Z', 'pages', '00008-wyoming-nonprofit-support-wpic-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch92_wyoming_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch92-wyoming-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'wyoming-california-grade-audit-report-v2.md'),
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

function updateVerifiedRow(row) {
  if (row.family === 'protection_and_advocacy') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Protection and Advocacy System, Inc. artifact on disk explicitly preserves Wyoming statewide P&A identity on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Protection and Advocacy System, Inc.',
          source_url: 'https://www.wypanda.com/',
          final_url: 'https://www.wypanda.com/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch92_wyoming_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:45:13.847Z',
          evidence_snippet: 'Protection and Advocacy System, Inc. | Protecting the Rights of Persons with Disabilities in Wyoming. The Protection and Advocacy System for the State of Wyoming.',
        },
      ],
    };
  }

  if (row.family === 'parent_training_information_center') {
    return {
      ...row,
      family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
      evidence_strength: 'weak',
      sample_count: 1,
      query_basis: 'Reviewed first-party Parents Information Center of Wyoming artifact on disk proves real statewide parent-support and special-education guidance scope, but the saved artifact does not preserve explicit PTI / Parent Training and Information Center designation text.',
      blocker_code: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
      blocker_evidence: 'Parents Information Center of Wyoming is a real first-party Wyoming support source, but the reviewed homepage only proves special-education help and advocacy scope, not explicit PTI designation.',
      samples: [
        {
          sample_name: 'Parents Information Center of Wyoming',
          source_url: 'https://wpic.org/',
          final_url: 'https://wpic.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch92_wyoming_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:45:13.847Z',
          evidence_snippet: 'Find support and resources for special education children at Parents Helping Parents of Wyoming. We offer parent help and guidance for navigating the special education system.',
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Wyoming California-Grade Batch 92 Report v1',
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
    '- Wyoming no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide nonprofit evidence on disk and its remaining gaps are now explicit terminal blockers.',
    '- Protection and Advocacy System, Inc. now truthfully satisfies statewide protection and advocacy because the reviewed first-party artifact explicitly preserves Wyoming P&A identity on the live domain.',
    '- Parents Information Center of Wyoming no longer stays vague inventory-only evidence. The reviewed first-party artifact proves real Wyoming special-education support and parent-help scope, but it still does not preserve explicit PTI designation text, so PTI remains blocked rather than being upgraded by assumption.',
    '- Wyoming still cannot reach California-grade or become index-safe because statewide special-education evidence remains legacy rather than reviewed state-grade, district or county education routing still depends on generic district roots instead of county- or district-owned leaves, county/local disability resources still depend on generic statewide locator evidence instead of reviewed county-grade local-office proof, statewide PTI designation is still not explicit in the saved artifact, and statewide legal-aid proof is still missing on disk.',
    '- Wyoming is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch92WyomingStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const pandaHtml = readText(INPUTS.pandaHtml);
  const ptiHtml = readText(INPUTS.ptiHtml);
  assertIncludes(pandaHtml, 'Protection and Advocacy System, Inc. | Protecting the Rights of Persons with Disabilities in Wyoming', 'Wyoming P&A artifact');
  assertIncludes(pandaHtml, 'The Protection and Advocacy System for the State of Wyoming', 'Wyoming P&A artifact');
  assertIncludes(ptiHtml, 'Parents Information Center of Wyoming', 'Wyoming PIC artifact');
  assertIncludes(ptiHtml, 'support and resources for special education children', 'Wyoming PIC artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party protection-and-advocacy evidence is present at the required authority level',
      };
    }

    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        status_reason: 'reviewed first-party statewide family-support evidence exists, but the saved artifact does not preserve explicit PTI designation text',
      };
    }

    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        failure_code: 'resolved_reviewed_first_party_protection_and_advocacy_evidence',
        evidence: 'Protection and Advocacy System, Inc. preserves Wyoming-specific P&A identity on the live first-party domain.',
        next_action: 'none_terminal_resolved',
      };
    }

    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        evidence: 'Parents Information Center of Wyoming is reviewed and statewide, but the saved first-party artifact proves special-education help scope rather than explicit PTI designation.',
        next_action: 'author_verified_state_manifest',
      };
    }

    return row;
  }).filter((row) => row.family !== 'protection_and_advocacy');

  const updatedVerifiedRows = verifiedRows.map(updateVerifiedRow);
  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'protection_and_advocacy')
    .map((row) => {
      if (row.family === 'parent_training_information_center') {
        return {
          ...row,
          failure_code: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
          evidence: 'Parents Information Center of Wyoming is reviewed and statewide, but the saved first-party artifact proves special-education help scope rather than explicit PTI designation.',
        };
      }
      return row;
    })
    .sort((a, b) => a.priority_rank - b.priority_rank)
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 58,
    strong_critical_families: 7,
    weak_critical_families: 4,
    missing_critical_families: 1,
    major_gap_families: [
      'special_education_idea_part_b',
      'parent_training_information_center',
      'legal_aid',
    ],
    complete_ready: false,
    final_blockers: [
      {
        family: 'special_education_idea_part_b',
        severity: 'major',
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'Wyoming special-education statewide evidence is still legacy or structural rather than reviewed state-grade proof.',
        next_action: 'author_verified_state_manifest',
      },
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Wyoming still depends on generic district roots instead of reviewed county- or district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Wyoming county/local disability resources still depend on a statewide locations root instead of reviewed county-grade local-office proof.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        evidence: 'Parents Information Center of Wyoming is reviewed and statewide, but the saved first-party artifact proves special-education help scope rather than explicit PTI designation.',
        next_action: 'author_verified_state_manifest',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'Wyoming still lacks any reviewed first-party or authoritative statewide legal-aid artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch92_wyoming_statewide_family_truth_refresh_v1',
    state: 'wyoming',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: ['protection_and_advocacy'],
    clarified_blockers: ['parent_training_information_center'],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    summary: updatedSummary,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch92WyomingStatewideFamilyTruthRefreshV1();
}
