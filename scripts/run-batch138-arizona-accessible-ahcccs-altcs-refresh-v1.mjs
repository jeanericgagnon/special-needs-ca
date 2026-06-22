import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'arizona_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'arizona_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch138_arizona_accessible_ahcccs_altcs_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch138-arizona-accessible-ahcccs-altcs-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const EDUCATION_FAILURE_CODE = 'azed_host_blocks_root_robots_and_sitemap_so_district_leafs_must_come_from_district_sites';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 bounded live official Arizona education probes across the existing statewide root https://www.azed.gov/specialeducation plus host-level discovery surfaces https://www.azed.gov/robots.txt and https://www.azed.gov/sitemap.xml. All three returned HTTP 403 with the Cloudflare "Just a moment..." challenge shell, and the previously checked likely replacement leaves https://www.azed.gov/school-district-web-sites/, https://www.azed.gov/asd/school-district-web-sites/, https://www.azed.gov/exceptionalstudentservices/, and https://www.azed.gov/ess did the same. The current DB inventory remains placeholder-only at 15/15 statewide AZED fallback rows, so Arizona education cannot reopen on AZED-host discovery and now requires district-owned leaf authoring.';
const EDUCATION_STATUS_REASON = 'Arizona education remains blocked because the official AZED host challenges not only the statewide special-education root but also robots.txt and sitemap.xml, leaving 15/15 current district rows stuck on one statewide fallback URL. Exact district-routing proof must now come from district-owned leaves, not from further AZED-host probing.';
const EDUCATION_NEXT_ACTION = 'author_district_owned_special_education_or_student_services_leaves_from_local_district_sites_not_azed';

const COUNTY_FAILURE_CODE = 'des_host_challenged_but_ahcccs_sitemap_exposes_partial_altcs_office_and_county_map_artifacts';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live official Arizona county-local probes across DES and AHCCCS hosts. The DES root and discovery surfaces https://des.az.gov/, https://des.az.gov/robots.txt, https://des.az.gov/sitemap.xml, https://des.az.gov/office-locator, https://des.az.gov/services/basic-needs/apply-for-benefits/where-to-apply, and https://des.az.gov/find-your-local-office all returned HTTP 403 with the Cloudflare "Just a moment..." challenge shell, so DES cannot currently seed exact office leaves. In contrast, the official AHCCCS host kept discovery open: https://www.azahcccs.gov/sitemap.xml and robots.txt returned 200, and the sitemap exposed live exact artifacts including https://www.azahcccs.gov/shared/AHCCCScontacts.html, https://www.azahcccs.gov/members/ALTCSlocations.html, https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf, and county-admin PDFs such as https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf. The ALTCS Offices page preserves named official offices in Phoenix, Tucson, and Yuma, but the current lane still lacks parsed county-to-office mapping for all 15 counties, so the stale DOI and legacy-placeholder county rows cannot yet be replaced truthfully.';
const COUNTY_STATUS_REASON = 'Arizona county-local routing is no longer blocked on a total absence of official candidates: DES remains challenge-blocked even at robots.txt and sitemap.xml, but accessible AHCCCS artifacts now provide a partial official office lane through live AHCCCS contacts, ALTCS Offices, and county-map/admin PDFs. The family remains blocked because those official AHCCCS artifacts have not yet been translated into full county-grade office mapping for all 15 counties.';
const COUNTY_NEXT_ACTION = 'extract_county_to_altcs_admin_mapping_from_accessible_ahcccs_office_and_county_map_artifacts_before_rewriting_county_rows';

const LESSON_HEADING = '### When One Official Host Is Challenge-Blocked, Check Sibling Official Sitemaps Before Declaring The Whole Family Exhausted';
const LESSON_BODY = '*   **Lesson:** If a state office host blocks even its root, `robots.txt`, and `sitemap.xml`, pivot once to sibling official domains in the same program family before stopping. In Arizona, `des.az.gov` and `azed.gov` stayed fully challenged, but `azahcccs.gov/sitemap.xml` remained open and exposed live office and county-admin artifacts that the blocked DES host never revealed.';

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

function updateLessonsFile(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Arizona California-Grade Audit Report v2',
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
    '- Arizona remains BLOCKED and not index-safe.',
    '- Education is now a cleaner district-leaf authoring problem: the AZED host blocks the statewide root, robots.txt, and sitemap.xml, so further AZED-host discovery is not a useful lane.',
    '- County-local is no longer a total-candidate void: DES remains blocked, but AHCCCS exposes live ALTCS office and county-map artifacts that can seed a narrower official county-mapping lane once parsed and attached to counties.',
    '- Arizona should only reopen when district-owned education leaves and county-grade office mappings are attached from these exact official surfaces rather than from statewide placeholders.',
  ].join('\n') + '\n';
}

export function generateBatch138ArizonaAccessibleAhcccsAltcsRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, status_reason: EDUCATION_STATUS_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, status_reason: COUNTY_STATUS_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        query_basis: 'Reviewed Arizona education blocker artifacts plus new host-level AZED probes on the statewide root, robots.txt, and sitemap.xml to determine whether any exact official discovery lane remains on the AZED host.',
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
        sample_count: 4,
        samples: [
          {
            sample_name: 'Arizona Department of Education Special Education Challenge Shell',
            source_url: 'https://www.azed.gov/specialeducation',
            final_url: 'https://www.azed.gov/specialeducation',
            verification_status: 'blocked',
            source_type: 'official_browser_challenge',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The official AZED special-education leaf returned only a Cloudflare "Just a moment..." shell instead of routing content.',
          },
          {
            sample_name: 'Arizona Education Sitemap',
            source_url: 'https://www.azed.gov/sitemap.xml',
            final_url: 'https://www.azed.gov/sitemap.xml',
            verification_status: 'blocked',
            source_type: 'official_host_level_challenge',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The AZED sitemap also returned the same challenge shell, so the official host does not currently expose a reviewable discovery surface for district routing.',
          },
          {
            sample_name: 'Arizona Education Robots',
            source_url: 'https://www.azed.gov/robots.txt',
            final_url: 'https://www.azed.gov/robots.txt',
            verification_status: 'blocked',
            source_type: 'official_host_level_challenge',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The AZED robots.txt endpoint returned the same challenge shell, confirming the block is host-wide in the current lane.',
          },
          {
            sample_name: 'Apache County School District Fallback Row',
            source_url: 'https://www.azed.gov/specialeducation',
            verification_status: 'verified',
            source_type: 'official_directory',
            source_table: 'school_districts',
            evidence_snippet: 'Current Arizona district coverage still points to one statewide AZED fallback URL rather than a district-owned leaf.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed Arizona county-local blocker artifacts, DES challenge probes, and newly accessible AHCCCS sitemap/contact/office artifacts to determine whether any exact official local-office lane can be seeded.',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        sample_count: 6,
        samples: [
          {
            sample_name: 'Arizona DES Root Challenge Shell',
            source_url: 'https://des.az.gov/',
            final_url: 'https://des.az.gov/',
            verification_status: 'blocked',
            source_type: 'official_browser_challenge',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The official DES root returned only a Cloudflare "Just a moment..." shell instead of office-routing content.',
          },
          {
            sample_name: 'Arizona DES Sitemap Challenge Shell',
            source_url: 'https://des.az.gov/sitemap.xml',
            final_url: 'https://des.az.gov/sitemap.xml',
            verification_status: 'blocked',
            source_type: 'official_host_level_challenge',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The DES sitemap returned the same challenge shell, so the current DES host does not expose a reviewable office-discovery surface.',
          },
          {
            sample_name: 'AHCCCS Contacts',
            source_url: 'https://www.azahcccs.gov/shared/AHCCCScontacts.html',
            final_url: 'https://www.azahcccs.gov/shared/AHCCCScontacts.html',
            verification_status: 'verified',
            source_type: 'official_contact_leaf',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The live official AHCCCS contacts page is reviewable and preserves applicant contact and help routing on the accessible AHCCCS host.',
          },
          {
            sample_name: 'ALTCS Offices',
            source_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
            final_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
            verification_status: 'verified',
            source_type: 'official_office_directory_leaf',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The live official ALTCS Offices page preserves named official offices in Phoenix, Tucson, and Yuma on the accessible AHCCCS host.',
          },
          {
            sample_name: 'ALTCS County Map PDF',
            source_url: 'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
            final_url: 'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
            verification_status: 'verified',
            source_type: 'official_pdf_candidate',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The official AHCCCS ALTCS county map PDF is live and accessible, indicating a real county-mapping artifact exists even though this lane has not yet parsed it.',
          },
          {
            sample_name: 'Pima County Admin PDF',
            source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
            final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
            verification_status: 'verified',
            source_type: 'official_county_admin_pdf_candidate',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The accessible AHCCCS host serves county-admin PDFs such as PimaCountyAdmin.pdf, proving county-specific official artifacts exist even though they are not yet attached to all county rows.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE_CODE, next_action: EDUCATION_NEXT_ACTION, evidence: EDUCATION_EVIDENCE };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'azed_and_des_hosts_challenged_but_ahcccs_exposes_partial_official_local_artifacts',
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        failure_code: EDUCATION_FAILURE_CODE,
        evidence: EDUCATION_EVIDENCE,
      },
      {
        family: 'county_local_disability_resources',
        failure_code: COUNTY_FAILURE_CODE,
        evidence: COUNTY_EVIDENCE,
      },
    ],
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  const lessonAdded = updateLessonsFile(INPUTS.lessons);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_138_arizona_accessible_ahcccs_altcs_refresh_v1',
    generated_at: '2026-06-22T00:00:00.000Z',
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_families: ['district_or_county_education_routing', 'county_local_disability_resources'],
    azed_host_discovery_blocked: true,
    des_host_discovery_blocked: true,
    ahcccs_accessible_local_artifacts_found: true,
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Arizona Accessible AHCCCS / ALTCS Refresh Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- primary_gap_reason: ${updatedSummary.primary_gap_reason}`,
      '',
      '## Evidence',
      '',
      `- education: ${EDUCATION_EVIDENCE}`,
      `- county_local: ${COUNTY_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch138ArizonaAccessibleAhcccsAltcsRefreshV1();
}
