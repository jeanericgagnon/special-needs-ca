import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'rhode-island_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'rhode-island_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'rhode-island_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'rhode-island_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'rhode-island_next_action_queue_v2.jsonl'),
  drriHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-46-11-439Z', 'pages', '00005-rhode-island-nonprofit-support-drri-org.html'),
  ripinHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-46-03-905Z', 'pages', '00009-rhode-island-nonprofit-support-ripin-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch82_rhode-island_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch82-rhode-island-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'rhode-island-california-grade-audit-report-v2.md'),
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
      query_basis: 'Reviewed first-party Disability Rights Rhode Island artifact explicitly preserves federally mandated statewide P&A designation on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights Rhode Island',
          source_url: 'https://www.drri.org/',
          final_url: 'https://drri.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch82_rhode_island_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:46:11.439Z',
          evidence_snippet: 'Disability Rights Rhode Island (DRRI) is the independent federally mandated Protection and Advocacy (P&A) System for the state of Rhode Island.',
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
      query_basis: 'Reviewed authoritative Parent Center Hub Rhode Island leaf explicitly preserves Rhode Island PTI designation plus RIPIN statewide contact routing even though ripin.org itself does not negotiate cleanly in the current low-token TLS lane.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Rhode Island PTI via Parent Center Hub',
          source_url: 'https://www.parentcenterhub.org/findurcenter/rhode-island/',
          final_url: 'https://www.parentcenterhub.org/findurcenter/rhode-island/',
          verification_status: 'official_verified',
          source_type: 'authoritative_parent_center_directory',
          source_table: 'batch82_rhode_island_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'Rhode Island PTI Rhode Island Parent Info Network (RIPIN) 1210 Pontiac Avenue Cranston, RI 02920 (800) 464-3399 (in RI) | (401) 270-0101 info@ripin.org http://www.ripin.org',
        },
      ],
    };
  }
  if (row.family === 'legal_aid') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 1,
      query_basis: 'Reviewed first-party Rhode Island legal-aid pages now preserve explicit statewide low-income legal-help routing on the live Rhode Island Legal Services / Help RI Law stack.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Help RI Law',
          source_url: 'https://www.helprilaw.org/',
          final_url: 'https://www.helprilaw.org/',
          verification_status: 'official_verified',
          source_type: 'first_party_legal_aid',
          source_table: 'batch82_rhode_island_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'Help RI Law: Rhode Island Legal Services. Legal help and representation for low-income individuals in Rhode Island.',
        },
      ],
    };
  }
  if (row.family === 'county_local_disability_resources') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 5,
      query_basis: 'Reviewed 2026-06-25 the live first-party Rhode Island DHS Office Locator Tool plus bounded official office leaves. The official lookup now exposes an explicit city/town lookup covering Rhode Island municipalities and returns a home-office assignment on the public DHS host.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'DHS Office Locator Tool',
          source_url: 'https://dhs.ri.gov/office-locator-tool',
          final_url: 'https://dhs.ri.gov/office-locator-tool',
          verification_status: 'official_verified',
          source_type: 'official_city_town_office_locator',
          source_table: 'batch82_rhode_island_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The official DHS Office Locator Tool says a customer can select a city/town to find their home office and publicly lists Rhode Island city/town options across the state.',
        },
        {
          sample_name: 'Bristol lookup to DHS Middletown Office',
          source_url: 'https://dhs.ri.gov/office-locator-tool?tid%5B%5D=36&op=Apply',
          final_url: 'https://dhs.ri.gov/office-locator-tool?tid%5B%5D=36&op=Apply',
          verification_status: 'official_verified',
          source_type: 'official_city_town_to_office_assignment',
          source_table: 'batch82_rhode_island_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'Submitting the official city/town lookup for Bristol returns the DHS Middletown Office with the office title, address, phone, and hours on the official DHS host.',
        },
        {
          sample_name: 'South Kingstown lookup to DHS South County Office',
          source_url: 'https://dhs.ri.gov/office-locator-tool?tid%5B%5D=131&op=Apply',
          final_url: 'https://dhs.ri.gov/office-locator-tool?tid%5B%5D=131&op=Apply',
          verification_status: 'official_verified',
          source_type: 'official_city_town_to_office_assignment',
          source_table: 'batch82_rhode_island_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'Submitting the official city/town lookup for South Kingstown returns the DHS South County Office with a reviewable home-office assignment on the official host.',
        },
        {
          sample_name: 'Warwick lookup to DHS Providence Office',
          source_url: 'https://dhs.ri.gov/office-locator-tool?tid%5B%5D=156&op=Apply',
          final_url: 'https://dhs.ri.gov/office-locator-tool?tid%5B%5D=156&op=Apply',
          verification_status: 'official_verified',
          source_type: 'official_city_town_to_office_assignment',
          source_table: 'batch82_rhode_island_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'Submitting the official city/town lookup for Warwick returns the DHS Providence Office (125 Holden Street) as the assigned home office.',
        },
        {
          sample_name: 'Woonsocket lookup to DHS Woonsocket Office',
          source_url: 'https://dhs.ri.gov/office-locator-tool?tid%5B%5D=176&op=Apply',
          final_url: 'https://dhs.ri.gov/office-locator-tool?tid%5B%5D=176&op=Apply',
          verification_status: 'official_verified',
          source_type: 'official_city_town_to_office_assignment',
          source_table: 'batch82_rhode_island_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'Submitting the official city/town lookup for Woonsocket returns the DHS Woonsocket Office with a direct local office assignment on the public DHS host.',
        },
      ],
    };
  }
  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Rhode Island California-Grade Batch 82 Report v1',
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
    ...(failureRows.length ? failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`) : ['- none']),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...(nextRows.length ? nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`) : ['- none']),
    '',
    '## Completion decision',
    '',
    '- Rhode Island no longer belongs in UNSTARTED because the packet already preserves reviewed first-party statewide protection-and-advocacy evidence on disk instead of only legacy nonprofit inventory rows.',
    '- Disability Rights Rhode Island is preserved as strong statewide protection-and-advocacy support because the reviewed first-party page explicitly says it is the independent federally mandated Protection and Advocacy (P&A) System for the state of Rhode Island.',
    '- Rhode Island now has a truthful official local-office routing lane because the live DHS Office Locator exposes a city/town lookup that returns assigned home offices on the official host.',
    '- Rhode Island still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of reviewed county- or district-owned leaves.',
    '- Rhode Island is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch82RhodeIslandStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const drriHtml = readText(INPUTS.drriHtml);
  assertIncludes(drriHtml, 'Home | Disability Rights Rhode Island', 'DRRI artifact');
  assertIncludes(drriHtml, 'Disability Rights Rhode Island (DRRI) is the independent federally mandated Protection and Advocacy (P&A) System for the state of Rhode Island.', 'DRRI artifact');

  const ripinHtml = readText(INPUTS.ripinHtml);
  assertIncludes(ripinHtml, 'RIPIN: Help with Special education, Health Insurance & More', 'RIPIN artifact');
  assertIncludes(ripinHtml, 'RIPIN empowers Rhode Islanders by providing guidance in healthcare, special education, and healthy aging.', 'RIPIN artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Disability Rights Rhode Island evidence preserves explicit federally mandated statewide P&A designation on the live first-party domain',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'authoritative Parent Center Hub Rhode Island leaf explicitly labels RIPIN as the Rhode Island PTI and preserves statewide Rhode Island contact routing',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Help RI Law / Rhode Island Legal Services pages preserve explicit statewide low-income legal-help routing',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed official DHS Office Locator now exposes a public city/town lookup that returns assigned home offices on the official host, supplying explicit local-routing coverage',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => !['protection_and_advocacy', 'parent_training_information_center', 'legal_aid', 'county_local_disability_resources'].includes(row.family));
  const updatedVerifiedRows = verifiedRows.map(updatedVerifiedRow);
  const updatedNextRows = nextRows
    .filter((row) => !['protection_and_advocacy', 'parent_training_information_center', 'legal_aid', 'county_local_disability_resources'].includes(row.family))
    .sort((a, b) => a.priority_rank - b.priority_rank)
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    critical_gap_families: ['district_or_county_education_routing'],
    major_gap_families: [],
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'public_ride_directory_exposes_district_inventory_but_zero_public_county_or_special_education_routing_contract',
        evidence: 'Reviewed 2026-06-25 bounded first-party Rhode Island education surfaces. The live RIDE Special Education page remains statewide guidance only and links families to the public school directory stack instead of exposing district-owned special-education leaves. The public School Directory page explicitly says families can use the Search tool, Frequently Requested Lists, and Directory Reports for contact information, then routes into the public Data Center directory. On the public Data Center host, the Schools Directory explicitly says it provides only LEA, school, location, and contact information, while additional directory information is available only to authenticated users in the RIDE portal. The public table and search lanes expose LEA, school, school type, and school subtype, including special-education categories, but no county field and no public district special-education routing contract. The separate RI School Districts page lists 66 LEAs and district websites, but it also exposes no county column and no special-education contact routing. Rhode Island therefore still lacks a public county-grade or district-owned special-education routing contract.',
        next_action: 'hold_blocked_until_public_ride_or_district_owned_special_education_surface_exposes_county_or_district_routing',
      },
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
      'legal_aid',
      'able_program',
      'ssi_ssa_federal_reference',
      'county_local_disability_resources',
    ],
  };

  const batchSummary = {
    batch: 'batch82_rhode_island_statewide_family_truth_refresh_v1',
    state: 'rhode-island',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    resolved_families: ['protection_and_advocacy', 'parent_training_information_center', 'legal_aid', 'county_local_disability_resources'],
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
  const result = generateBatch82RhodeIslandStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
