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
  report: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch189_kansas_dd_browser_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch189-kansas-dd-browser-repair-report-v1.md'),
};

const DD_QUERY_BASIS = 'Reviewed browser-readable official KDADS leaves on 2026-06-23 after the prior raw-fetch transport blocker proved too pessimistic. The official KDADS root, Intellectual / Developmentally Disabled Information page, Community Support Waiver page, HCBS Waiver Programs page, and HCBS Leadership & Staff page all rendered with role-bearing content and current statewide routing signals.';
const DD_REASON = 'Kansas DD authority now clears at state grade from reviewed first-party KDADS leaves. The live KDADS root renders HCBS and disability program navigation, the official Intellectual / Developmentally Disabled Information page is public, the Community Support Waiver page explicitly serves Kansans with intellectual and developmental disabilities, and the HCBS Leadership & Staff page names I/DD and waiver staff roles on the same official host. The old host-wide 403 claim is no longer accurate for browser-readable review.';
const EDUCATION_REASON = 'Kansas now has only one remaining critical blocker. The live KSDE Directories page publishes current annual Kansas Educational Directory PDFs, and the public Directory Reports app exposes an `***ALL DISTRICTS***` selector plus named USD options such as Abilene USD 435, Andover USD 385, and Atchison Public Schools USD 409. That means the official stack preserves a concrete first-party district inventory lane. But the DB still shows all 105 school_district rows pointing at the same statewide KSDE placeholder, and no reviewed county-to-district join or district-owned special-education contact leaves are preserved on disk. Kansas therefore remains blocked until that public district inventory is turned into reviewed district-owned local leaves.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded live official Kansas education probes on https://uapps.ksde.gov/Directory_Rpts/default.aspx, https://datacentral.ksde.gov/default.aspx, and https://www.ksde.gov/data-and-reporting/directories, in addition to the existing live KSDE Special Education and School District Maps roots already preserved on disk. The public Directory Reports app is not just an empty root: its HTML preserves a real `Kansas Educational Directory Reports` home page with `Organizational Directory Reports`, `Educator Directory Reports`, a `Complete Directory` link, and a public district selector that includes `***ALL DISTRICTS***` plus specific district IDs and names such as `D0435 :: ABILENE USD 435`, `D0385 :: ANDOVER USD 385`, and `D0409 :: ATCHISON PUBLIC SCHOOLS USD 409`. The official KSDE Directories page also publishes current annual Kansas Educational Directory PDFs. But a live DB reconciliation still shows all 105 Kansas school_district rows pointing at the same statewide placeholder website and no reviewed district-owned special-education or student-services leaves are preserved on disk.';

const DD_SAMPLES = [
  {
    sample_name: 'KDADS home page',
    source_url: 'https://www.kdads.ks.gov/',
    final_url: 'https://www.kdads.ks.gov/',
    verification_status: 'official_verified',
    source_type: 'official_first_party_reviewed_page',
    source_table: 'batch189_kansas_dd_browser_repair',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_snippet: 'The live official KDADS home page renders public HCBS and disability program navigation, including Home and Community Based Services, Intellectual / Developmentally Disabled Information, and Community Support Waiver links.',
  },
  {
    sample_name: 'Intellectual / Developmentally Disabled Information',
    source_url: 'https://www.kdads.ks.gov/partners-providers/home-and-community-based-services-information/intellectual-developmentally-disabled-information',
    final_url: 'https://www.kdads.ks.gov/partners-providers/home-and-community-based-services-information/intellectual-developmentally-disabled-information',
    verification_status: 'official_verified',
    source_type: 'official_first_party_reviewed_page',
    source_table: 'batch189_kansas_dd_browser_repair',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_snippet: 'The official KDADS page is a public first-party I/DD information leaf under Home and Community Based Services Information.',
  },
  {
    sample_name: 'Community Support Waiver',
    source_url: 'https://www.kdads.ks.gov/services-programs/long-term-services-supports/community-support-waiver',
    final_url: 'https://www.kdads.ks.gov/services-programs/long-term-services-supports/community-support-waiver',
    verification_status: 'official_verified',
    source_type: 'official_first_party_reviewed_page',
    source_table: 'batch189_kansas_dd_browser_repair',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_snippet: 'The Community Support Waiver page says the waiver will assist Kansans with intellectual and developmental disabilities (I/DD) who do not need continuous, 24-hour support and preserves a public questions/comments contact.',
  },
  {
    sample_name: 'HCBS Leadership & Staff',
    source_url: 'https://www.kdads.ks.gov/services-programs/long-term-services-supports/home-and-community-based-services-hcbs-programs/hcbs-leadership-staff',
    final_url: 'https://www.kdads.ks.gov/services-programs/long-term-services-supports/home-and-community-based-services-hcbs-programs/hcbs-leadership-staff',
    verification_status: 'official_verified',
    source_type: 'official_first_party_staff_directory',
    source_table: 'batch189_kansas_dd_browser_repair',
    fetched_at: '2026-06-23T00:00:00.000Z',
    evidence_snippet: 'The official HCBS Leadership & Staff page names I/DD-specific statewide roles including I/DD Waiver Program Manager, Assistant I/DD Director, and PD/IDD Waitlist and TCM Study Coordinator, plus the KDADS main office phone.',
  },
];

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Audit Report v2',
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
    '## Repair decision',
    '',
    '- Kansas remains BLOCKED and not index-safe.',
    '- Developmental-disability authority now clears from reviewed first-party KDADS pages, so the old host-wide 403 blocker is retired.',
    '- Education is now the only remaining critical blocker: Kansas has a real public district inventory, but it is still not converted into reviewed district-owned special-education or student-services leaves.',
  ].join('\n') + '\n';
}

export function generateBatch189KansasDdBrowserRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedSummary = {
    ...summary,
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: 'kansas_now_has_reviewed_first_party_dd_authority_but_public_district_inventory_is_still_not_converted_into_local_special_education_leaves',
    critical_gap_families: ['district_or_county_education_routing'],
    verified_source_families_with_samples: Array.from(new Set([
      ...(summary.verified_source_families_with_samples || []),
      'developmental_disability_idd_authority',
    ])),
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      developmental_disability_idd_authority: 'verified_state_grade',
      district_or_county_education_routing: 'blocked_live_ksde_directory_roots_without_local_contract',
    },
    final_blockers: (summary.final_blockers || []).filter((row) => row.family !== 'developmental_disability_idd_authority'),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return { ...row, family_status: 'verified_state_grade', status_reason: DD_REASON };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_live_ksde_directory_roots_without_local_contract', status_reason: EDUCATION_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'developmental_disability_idd_authority').map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'public_directory_reports_dropdown_and_annual_directory_pdfs_exist_but_no_reviewed_local_special_education_leaves',
        evidence: EDUCATION_EVIDENCE,
        next_action: 'use_public_directory_dropdown_and_annual_directory_pdfs_to_author_reviewed_district_owned_special_education_leaves',
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        query_basis: DD_QUERY_BASIS,
        blocker_code: null,
        blocker_evidence: null,
        sample_count: DD_SAMPLES.length,
        samples: DD_SAMPLES,
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_ksde_directory_roots_without_local_contract',
        evidence_strength: 'medium',
        blocker_code: 'public_directory_reports_dropdown_and_annual_directory_pdfs_exist_but_no_reviewed_local_special_education_leaves',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'developmental_disability_idd_authority')
    .map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return {
          ...row,
          priority_rank: 1,
          failure_code: 'public_directory_reports_dropdown_and_annual_directory_pdfs_exist_but_no_reviewed_local_special_education_leaves',
          next_action: 'use_public_directory_dropdown_and_annual_directory_pdfs_to_author_reviewed_district_owned_special_education_leaves',
          evidence: EDUCATION_EVIDENCE,
        };
      }
      return row;
    });

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    batch: 'batch_189_kansas_dd_browser_repair_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    dd_promoted_to_verified_state_grade: true,
    remaining_critical_gap_families: updatedSummary.critical_gap_families,
    reviewed_dd_samples: DD_SAMPLES.length,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 189 Kansas DD Browser Repair Report v1',
    '',
    '- Replaced the false host-wide Kansas DD transport blocker with reviewed first-party KDADS evidence.',
    '- Kansas DD now clears from browser-readable official KDADS pages, including I/DD information, waiver, and staff surfaces.',
    '- Kansas remains blocked only on district-or-county education routing.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch189KansasDdBrowserRepairV1();
  console.log(JSON.stringify(result, null, 2));
}
