import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'south-dakota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'south-dakota_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'south-dakota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'south-dakota_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'south-dakota_next_action_queue_v2.jsonl'),
  pandaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-29-008Z', 'pages', '00008-south-dakota-nonprofit-support-drsdlaw-org.html'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-29-008Z', 'pages', '00009-south-dakota-nonprofit-support-sdparent-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch84_south-dakota_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch84-south-dakota-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'south-dakota-california-grade-audit-report-v2.md'),
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

function updatedVerifiedRow(row) {
  if (row.family === 'protection_and_advocacy') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Disability Rights South Dakota artifact preserves statewide first-party organizational identity on the live domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights South Dakota',
          source_url: 'https://drsdlaw.org/',
          final_url: 'https://drsdlaw.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch84_south_dakota_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:44:29.008Z',
          evidence_snippet: 'The reviewed first-party Disability Rights South Dakota page preserves statewide organizational identity and DRSD branding on the live domain.',
        },
      ],
    };
  }
  if (row.family === 'parent_training_information_center') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed authoritative Parent Center Hub South Dakota leaf explicitly preserves statewide PTI designation and South Dakota Parent Connection contact routing.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'South Dakota PTI via Parent Center Hub',
          source_url: 'https://www.parentcenterhub.org/findurcenter/south-dakota/',
          final_url: 'https://www.parentcenterhub.org/findurcenter/south-dakota/',
          verification_status: 'official_verified',
          source_type: 'authoritative_parent_center_directory',
          source_table: 'batch84_south_dakota_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'South Dakota PTI South Dakota Parent Connection 3701 W 49th St, Ste 102 Sioux Falls, SD 57106.',
        },
      ],
    };
  }
  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# South Dakota California-Grade Batch 84 Report v1',
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
    '- South Dakota no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide protection-and-advocacy evidence on disk instead of only legacy nonprofit inventory rows.',
    '- Disability Rights South Dakota is preserved as statewide protection-and-advocacy support from the reviewed first-party domain.',
    '- South Dakota still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves, county/local disability resources still lack a public county-grade office contract, and statewide legal aid is still missing on disk.',
    '- South Dakota is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch84SouthDakotaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const pandaHtml = readText(INPUTS.pandaHtml);
  assertIncludes(pandaHtml, 'Home - Disability Rights South Dakota', 'DRSD artifact');
  assertIncludes(pandaHtml, 'Disability Rights South Dakota', 'DRSD artifact');

  const ptiHtml = readText(INPUTS.ptiHtml);
  assertIncludes(ptiHtml, 'South Dakota Parent Connection provides training and information to parents and families caring for individuals with disabilities.', 'SD Parent Connection artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Disability Rights South Dakota evidence preserves statewide protection-and-advocacy identity on the live first-party domain',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'authoritative Parent Center Hub South Dakota leaf explicitly labels South Dakota Parent Connection as the South Dakota PTI',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_educational_directory_root_without_local_leaves',
        status_reason: 'the live official South Dakota Educational Directory root lists public school districts on a first-party page, but no district-owned special-education leaves are yet attached county by county',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_local_offices_shell_without_public_county_contract',
        status_reason: 'the legacy dhhs.south-dakota.gov locator is unresolvable, contact/default.aspx is 404, and the live localoffices root currently serves only a JS loading shell with no county contract in public HTML',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family))
    .map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return {
          ...row,
          failure_code: 'official_educational_directory_root_is_live_but_not_converted_into_local_district_leaves',
          evidence: 'Reviewed 2026-06-23 live official South Dakota DOE sources at https://doe.sd.gov/ofm/edudir.aspx and https://doe.sd.gov/ofm/districts.aspx. The public South Dakota Educational Directory root is live and its HTML already lists Public School Districts such as Aberdeen 06-1, Agar-Blunt-Onida 58-3, and Bennett County 03-1, while the district maps root is also public. But no district-owned special-education leaves are preserved on disk, so district routing still relies on statewide or structural evidence.',
          next_action: 'author_county_or_district_exact_targets',
        };
      }
      if (row.family === 'county_local_disability_resources') {
        return {
          ...row,
          failure_code: 'legacy_locator_dead_and_live_localoffices_root_is_loading_shell',
          evidence: 'Reviewed 2026-06-23 live official South Dakota human-services probes at https://dhhs.south-dakota.gov/locations, https://dhs.sd.gov/contact/default.aspx, and https://dhs.sd.gov/en/localoffices. The legacy dhhs host is unresolvable, contact/default.aspx returns a real 404, and the live localoffices root currently serves only a JS Loading shell with no county, office, or locality contract in public HTML.',
          next_action: 'hold_blocked_until_a_public_county_or_local_office_contract_is_exposed',
        };
      }
      return row;
    });
  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);
  const updatedNextRows = nextRows
    .filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family))
    .map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return {
          ...row,
          evidence: 'The live South Dakota Educational Directory root already exposes a public district inventory, but no district-owned special-education leaves are yet preserved on disk.',
        };
      }
      if (row.family === 'county_local_disability_resources') {
        return {
          ...row,
          next_action: 'hold_blocked_until_a_public_county_or_local_office_contract_is_exposed',
          evidence: 'The legacy locator is dead and the live localoffices root currently exposes only a JS loading shell with no public county contract.',
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
    completeness_pct: 75,
    strong_critical_families: 9,
    weak_critical_families: 2,
    missing_critical_families: 1,
    primary_gap_reason: 'live_sd_educational_directory_exists_but_local_district_leaves_are_unauthored_and_localoffices_root_has_no_public_county_contract',
    major_gap_families: [
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
        failure_code: 'official_educational_directory_root_is_live_but_not_converted_into_local_district_leaves',
        evidence: 'South Dakota now has a live official educational-directory root, but district or county education routing still depends on statewide or structural evidence instead of reviewed district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'legacy_locator_dead_and_live_localoffices_root_is_loading_shell',
        evidence: 'South Dakota county/local disability resources still lack a public county-grade office contract: the legacy locator is dead and the live localoffices root is only a loading shell in the current lane.',
        next_action: 'hold_blocked_until_a_public_county_or_local_office_contract_is_exposed',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'missing_required_source_family',
        evidence: 'South Dakota still lacks any reviewed first-party or authoritative statewide legal-aid artifact on disk.',
        next_action: 'author_or_verify_statewide_source_family',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch84_south_dakota_statewide_family_truth_refresh_v1',
    state: 'south-dakota',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: ['protection_and_advocacy', 'parent_training_information_center'],
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
  const result = generateBatch84SouthDakotaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
