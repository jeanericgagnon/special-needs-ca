import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch124_idaho_exact_blocker_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch124-idaho-exact-blocker-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const IPUL_ABOUT = 'https://ipulidaho.org/about_ipul/';
const IPUL_CONTACT = 'https://ipulidaho.org/connect-with-us/';
const SDE_SCHOOLS = 'https://www.sde.idaho.gov/about-us/idaho-schools/';
const SDE_SPED_STAFF = 'https://www.sde.idaho.gov/about-us/our-staff/special-education/';
const SDE_SPED_PARENT = 'https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/';
const DHW_OFFICES = 'https://healthandwelfare.idaho.gov/offices';
const DHW_CONTACT = 'https://healthandwelfare.idaho.gov/contact-us';

const EDUCATION_BLOCKER = 'official_sde_special_education_stack_has_no_district_directory_or_local_leaves';
const COUNTY_BLOCKER = 'official_dhw_offices_directory_repairs_named_offices_but_27_counties_still_use_storefront_placeholders';
const EDUCATION_REASON = 'Reviewed live Idaho SDE special-education authority, staff, parent-resources, and Idaho Schools pages. The current official stack preserves statewide authority and staff support, but the Idaho Schools page exposes no district entries and all 44 current district rows still reuse statewide SDE URLs instead of district-owned or county-mapped routing leaves.';
const COUNTY_REASON = 'Reviewed live Idaho DHW Contact Us and /offices pages plus sitemap office leaves. The exact official directory now preserves named office pages such as Boise, Caldwell, Burley, Blackfoot, Idaho Falls, Sandpoint-Ponderay, and Lewiston, but current county routing still splits into 18 named-office rows and 27 storefront placeholders with no reviewed county-to-office mapping for the placeholder counties.';
const PTI_REASON = 'Reviewed Idaho Parents Unlimited About page now preserves explicit Idaho Parent Training and Information Center designation text, while the Connect With Us page preserves statewide contact routing and Boise office details.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho SDE pages: https://www.sde.idaho.gov/about-us/departments/special-education/, https://www.sde.idaho.gov/about-us/our-staff/special-education/, https://www.sde.idaho.gov/about-us/departments/special-education/parent-resources/, and https://www.sde.idaho.gov/about-us/idaho-schools/. These leaves preserve statewide authority, staff contacts, and parent resources, but the Idaho Schools page exposes no district entries or county mapping and current DB rows still use statewide SDE URLs for all 44 counties.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 current official Idaho DHW office routing pages: https://healthandwelfare.idaho.gov/contact-us and https://healthandwelfare.idaho.gov/offices, plus DHW sitemap office leaves such as Boise, Caldwell, Pocatello, Idaho Falls, Rexburg, Mountain Home, Grangeville, Moscow, Lewiston, and Sandpoint-Ponderay. This exact office stack repairs named office proof for many rows, but current county routing still includes 27 storefront placeholders with no reviewed county-to-office coverage.';
const LESSON_HEADING = '### Idaho-Type Pattern: Official Sitemaps Can Expose Exact Office Leaves Even When The Visible Directory Only Looks Like One Generic Locator';
const LESSON_BODY = '*   **Lesson:** When a state packet is blocked on a generic statewide office locator, check the official sitemap before reopening discovery. Idaho’s visible DHW `/offices` directory looked like one statewide page, but the sitemap exposed exact office leaves such as Boise, Caldwell, Pocatello, and Idaho Falls. That was enough to sharpen county-local blockers and separate real office coverage from placeholder county rows without broad crawling.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Audit Report v2',
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
    '- Idaho Parents Unlimited now clears the PTI family because the reviewed first-party About page explicitly says the organization houses the Idaho Parent Training and Information Center, and the Connect With Us page preserves current statewide contact routing.',
    '- Idaho still cannot reach California-grade or become index-safe because district-or-county education routing remains statewide-only: the official SDE special-education, staff, parent-resources, and Idaho Schools pages preserve statewide authority and contacts, but not district-owned or county-mapped routing leaves.',
    '- County/local disability resources are sharper but still blocked: Idaho DHW now exposes an exact /offices directory and sitemap-backed office leaves for named offices, but the state packet still contains 27 storefront placeholders without reviewed county-to-office coverage.',
    '- Idaho therefore remains BLOCKED and not index-safe until district-routing and county-local families move from statewide or placeholder evidence to reviewed local routing proof.',
  ].join('\n') + '\n';
}

export function generateBatch124IdahoExactBlockerRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return { ...row, family_status: 'verified_state_grade', status_reason: PTI_REASON };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_no_district_owned_or_county_mapped_leaves', status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'blocked_named_office_leaves_only_partial_county_coverage', status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'idaho',
      state_code: 'ID',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: EDUCATION_BLOCKER,
      evidence: EDUCATION_EVIDENCE,
      next_action: 'hold_blocked_until_reviewed_district_owned_or_state_directory_county_mapping_leaves_exist',
    },
    {
      state: 'idaho',
      state_code: 'ID',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: COUNTY_BLOCKER,
      evidence: COUNTY_EVIDENCE,
      next_action: 'author_exact_office_leaf_mappings_or_hold_counties_blocked',
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        query_basis: 'Reviewed first-party Idaho Parents Unlimited About and Connect With Us pages now preserve explicit PTI designation plus statewide contact routing.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 2,
        samples: [
          {
            sample_name: 'About Idaho Parents Unlimited',
            source_url: IPUL_ABOUT,
            final_url: IPUL_ABOUT,
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_artifact',
            source_table: 'batch124_idaho_exact_blocker_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Founded in 1985, Idaho Parents Unlimited, Inc. (IPUL) is a statewide organization which houses the Idaho Parent Training and Information Center, the Family to Family Health Information Center, Idaho Family Voices and IPUL Arts.',
          },
          {
            sample_name: 'Connect with us',
            source_url: IPUL_CONTACT,
            final_url: IPUL_CONTACT,
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_artifact',
            source_table: 'batch124_idaho_exact_blocker_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Idaho Parents Unlimited, Inc. 4619 W Emerald St, Ste. E Boise, ID 83706 Phone: (208) 342-5884 Email: parents@ipulidaho.org.',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_no_district_owned_or_county_mapped_leaves',
        evidence_strength: 'weak',
        blocker_code: EDUCATION_BLOCKER,
        blocker_evidence: EDUCATION_EVIDENCE,
        sample_count: 3,
        samples: [
          {
            sample_name: 'Idaho Schools',
            source_url: SDE_SCHOOLS,
            final_url: SDE_SCHOOLS,
            verification_status: 'verified',
            source_type: 'official_statewide_directory_root',
            source_table: 'batch124_idaho_exact_blocker_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The current Idaho Schools page preserves statewide school-program navigation, but reviewed live content exposes no district entries or county mapping for local special-education routing.',
          },
          {
            sample_name: 'Special Education Staff',
            source_url: SDE_SPED_STAFF,
            final_url: SDE_SPED_STAFF,
            verification_status: 'verified',
            source_type: 'official_statewide_staff_directory',
            source_table: 'batch124_idaho_exact_blocker_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The current Special Education Staff page preserves statewide SDE staff contacts, but not district-owned or county-mapped routing leaves.',
          },
          {
            sample_name: 'Parent Resources',
            source_url: SDE_SPED_PARENT,
            final_url: SDE_SPED_PARENT,
            verification_status: 'verified',
            source_type: 'official_statewide_parent_resources',
            source_table: 'batch124_idaho_exact_blocker_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The current Parent Resources page preserves statewide special-education support resources, but not district-grade routing proof.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_named_office_leaves_only_partial_county_coverage',
        evidence_strength: 'medium',
        blocker_code: COUNTY_BLOCKER,
        blocker_evidence: COUNTY_EVIDENCE,
        sample_count: 3,
        samples: [
          {
            sample_name: 'Health and Welfare office locations',
            source_url: DHW_OFFICES,
            final_url: DHW_OFFICES,
            verification_status: 'verified',
            source_type: 'official_statewide_office_directory',
            source_table: 'batch124_idaho_exact_blocker_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The live Idaho DHW office directory preserves exact named office entries such as Boise Office - Westgate Building, Blackfoot Office - Blackfoot Services Complex, Burley Office, Caldwell Office, and Idaho Falls Office.',
          },
          {
            sample_name: 'Contact Us',
            source_url: DHW_CONTACT,
            final_url: DHW_CONTACT,
            verification_status: 'verified',
            source_type: 'official_contact_navigation',
            source_table: 'batch124_idaho_exact_blocker_refinement',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The Idaho DHW Contact Us page links the live office locations directory as the current Find an office route.',
          },
          {
            sample_name: 'County-row coverage remains partial',
            source_url: DHW_OFFICES,
            final_url: DHW_OFFICES,
            verification_status: 'blocked',
            source_type: 'reviewed_partial_county_coverage',
            source_table: 'county_offices',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The current Idaho packet still contains 18 named Idaho DHW office rows but 27 storefront placeholder county rows, so local county routing remains partial rather than California-grade.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = updatedFailureRows.map((row, index) => ({
    state: row.state,
    state_code: row.state_code,
    priority_rank: index + 1,
    family: row.family,
    severity: row.severity,
    failure_code: row.failure_code,
    next_action: row.next_action,
    evidence: row.evidence,
  }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    primary_gap_reason: EDUCATION_BLOCKER,
    critical_gap_families: ['district_or_county_education_routing', 'county_local_disability_resources'],
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: updatedFailureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'idaho'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 83,
          weak_critical_families: 2,
          missing_critical_families: 0,
          primary_gap_reason: EDUCATION_BLOCKER,
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_families: ['parent_training_information_center'],
    sharpened_blockers: ['district_or_county_education_routing', 'county_local_disability_resources'],
    officeCoverage: {
      namedOfficeRows: 18,
      storefrontPlaceholderRows: 27,
    },
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 124 Idaho Exact Blocker Refinement Report v1',
      '',
      'This pass repairs Idaho PTI with explicit first-party designation evidence and sharpens the two remaining local-routing blockers from generic statewide placeholders to current official exact-source failures.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      `- repaired_families: ${batchSummary.repaired_families.join(', ')}`,
      `- sharpened_blockers: ${batchSummary.sharpened_blockers.join(', ')}`,
      `- named_office_rows: ${batchSummary.officeCoverage.namedOfficeRows}`,
      `- storefront_placeholder_rows: ${batchSummary.officeCoverage.storefrontPlaceholderRows}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch124IdahoExactBlockerRefinementV1();
  console.log(JSON.stringify(summary, null, 2));
}
