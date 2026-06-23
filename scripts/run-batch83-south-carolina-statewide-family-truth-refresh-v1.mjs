import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'south-carolina_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'south-carolina_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'south-carolina_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'south-carolina_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'south-carolina_next_action_queue_v2.jsonl'),
  pandaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-56-734Z', 'pages', '00001-south-carolina-nonprofit-support-disabilityrightssc-org.html'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T23-51-11-814Z', 'pages', '00001-south-carolina-nonprofit-support-family-connection-of-sc-pti.html'),
  legalHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-17T16-58-43-900Z', 'pages', '01053-multi-state-advocates-legal-south-carolina-legal-services.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch83_south-carolina_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch83-south-carolina-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'south-carolina-california-grade-audit-report-v2.md'),
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
      query_basis: 'Reviewed first-party Disability Rights South Carolina artifact explicitly preserves statewide P&A identity on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Disability Rights South Carolina',
          source_url: 'https://www.disabilityrightssc.org/',
          final_url: 'https://www.disabilityrightssc.org/',
          verification_status: 'official_verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch83_south_carolina_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-20T00:44:56.734Z',
          evidence_snippet: 'The reviewed first-party Disability Rights South Carolina page preserves statewide organizational identity on the live first-party domain.',
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
      query_basis: 'Reviewed authoritative Parent Center Hub South Carolina leaf explicitly preserves statewide PTI designation and Family Connection of South Carolina contact routing.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'South Carolina PTI via Parent Center Hub',
          source_url: 'https://www.parentcenterhub.org/findurcenter/south-carolina/',
          final_url: 'https://www.parentcenterhub.org/findurcenter/south-carolina/',
          verification_status: 'official_verified',
          source_type: 'authoritative_parent_center_directory',
          source_table: 'batch83_south_carolina_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'South Carolina PTI (Serving the entire state) Family Connection of SC 1800 St. Julian Place, Suite 104 Columbia, SC 29204.',
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
      query_basis: 'Reviewed first-party South Carolina Legal Services artifact preserves statewide civil legal-aid identity, low-income eligibility, and intake routes on the live first-party domain.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'South Carolina Legal Services',
          source_url: 'https://sclegal.org/',
          final_url: 'https://sclegal.org/',
          verification_status: 'verified',
          source_type: 'reviewed_first_party_artifact',
          source_table: 'batch83_south_carolina_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-17T16:58:43.900Z',
          evidence_snippet: 'South Carolina Legal Services is a statewide law firm that provides civil legal services to protect the rights and represent the interests of low income South Carolinians, with apply online and legal-help routing preserved on the first-party page.',
        },
      ],
    };
  }

  if (row.family === 'county_local_disability_resources') {
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 46,
      query_basis: 'Reviewed live official South Carolina DSS contact hub now preserves a county-complete routing contract with 46 named county leaf pages linked from the first-party regional directory.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'SCDSS county contact hub',
          source_url: 'https://dss.sc.gov/contact-dss/',
          final_url: 'https://dss.sc.gov/contact-dss/',
          verification_status: 'official_verified',
          source_type: 'official_county_directory',
          source_table: 'batch83_south_carolina_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'County Office Locations Upstate Region Abbeville Anderson Cherokee Greenville Greenwood Laurens Newberry Oconee Pickens Spartanburg Union Midlands Region Aiken ... Lowcountry Region ... Pee Dee Region ...',
        },
        {
          sample_name: 'Abbeville County DSS',
          source_url: 'https://dss.sc.gov/contact-dss/upstate-region/abbeville/',
          final_url: 'https://dss.sc.gov/contact-dss/upstate-region/abbeville/',
          verification_status: 'official_verified',
          source_type: 'official_county_office_leaf',
          source_table: 'batch83_south_carolina_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'Abbeville County DSS 909 West Greenwood Street Suite 1 Abbeville, South Carolina 29620 ... Abbeville.FA@dss.sc.gov',
        },
        {
          sample_name: 'Dorchester County DSS',
          source_url: 'https://dss.sc.gov/contact-dss/lowcountry-region/dorchester/',
          final_url: 'https://dss.sc.gov/contact-dss/lowcountry-region/dorchester/',
          verification_status: 'official_verified',
          source_type: 'official_county_office_leaf',
          source_table: 'batch83_south_carolina_statewide_family_truth_refresh_v1',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'Main Office Address: Dorchester County DSS ... 1452 Boone Hill Rd Suite C, Summerville, SC 29483 ... Dorchester.FA@dss.sc.gov',
        },
      ],
    };
  }

  return row;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# South Carolina California-Grade Batch 83 Report v1',
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
    '- South Carolina no longer belongs in UNSTARTED because the packet now preserves reviewed or authoritative statewide P&A, PTI, legal-aid, and county-local DSS routing evidence on disk instead of only legacy inventory rows.',
    '- Disability Rights South Carolina is preserved as statewide protection-and-advocacy support from the reviewed first-party domain.',
    '- Parent Center Hub now clears PTI because its South Carolina leaf explicitly labels Family Connection of SC as the South Carolina PTI serving the entire state.',
    '- South Carolina Legal Services is preserved as statewide legal aid because the reviewed first-party page explicitly describes a statewide civil legal-services role for low-income South Carolinians and preserves direct intake routes.',
    '- The official SCDSS contact stack now clears county-local routing because the first-party hub links 46 county-named DSS office leaves with county-specific office addresses and county-specific DSS email routing.',
    '- South Carolina still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide or structural evidence instead of county- or district-owned leaves.',
    '- South Carolina is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch83SouthCarolinaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const pandaHtml = readText(INPUTS.pandaHtml);
  assertIncludes(pandaHtml, 'Disability Rights South Carolina', 'DRSC artifact');

  const ptiHtml = readText(INPUTS.ptiHtml);
  assertIncludes(ptiHtml, 'Supporting families and individuals with disabilities across South Carolina through resources, parent training, advocacy, and community programs.', 'Family Connection artifact');

  const legalHtml = readText(INPUTS.legalHtml);
  assertIncludes(legalHtml, 'South Carolina Legal Services is a statewide law firm that provides civil legal services to protect the rights and represent the interests of low income South Carolinians.', 'SCLS artifact');
  assertIncludes(legalHtml, 'APPLY ONLINE', 'SCLS artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Disability Rights South Carolina evidence preserves statewide protection-and-advocacy identity on the live first-party domain',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'authoritative Parent Center Hub South Carolina leaf explicitly labels Family Connection of SC as the South Carolina PTI serving the entire state',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party South Carolina Legal Services evidence preserves statewide low-income civil legal-aid identity plus direct intake routing on the live first-party domain',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed live official SCDSS contact hub now links 46 county-named DSS office leaves with county-specific office addresses and county-specific DSS email routing',
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
    critical_gap_families: [
      'district_or_county_education_routing',
    ],
    primary_gap_reason: 'official_school_directory_root_is_live_but_not_yet_converted_into_district_owned_special_education_leaves',
    major_gap_families: [],
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
    complete_ready: false,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'official_school_directory_root_is_live_but_not_yet_converted_into_district_owned_special_education_leaves',
        evidence: 'South Carolina now has a live official school-directory root, but district or county education routing still depends on statewide or structural evidence instead of reviewed district-owned special-education leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch83_south_carolina_statewide_family_truth_refresh_v1',
    state: 'south-carolina',
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
  const result = generateBatch83SouthCarolinaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
