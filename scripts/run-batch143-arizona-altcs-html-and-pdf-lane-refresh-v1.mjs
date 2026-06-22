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
  summary: path.join(generatedDir, 'batch143_arizona_altcs_html_and_pdf_lane_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch143-arizona-altcs-html-and-pdf-lane-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const STATE_PRIMARY_GAP = 'azed_host_challenged_and_ahcccs_county_mapping_still_requires_pdf_extraction_or_reviewed_county_admin_leaves';
const COUNTY_FAILURE_CODE = 'ahcccs_html_office_lane_is_live_but_county_mapping_remains_trapped_in_image_pdfs';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live official Arizona AHCCCS county-local artifacts after the earlier DES/AHCCCS host split. The live ALTCS Offices HTML leaf now proves seven named official offices on the accessible AHCCCS host: Chinle, Flagstaff, Kingman, Phoenix, Prescott, Tucson, and Yuma. But the fetched HTML does not preserve counties served or a county-to-office contract. The remaining county-specific official artifacts are the AHCCCS ALTCS County Map PDF and county-admin PDFs such as CountyAdminOffice.pdf and PimaCountyAdmin.pdf, and both fetched as image-heavy PDFs in the current local toolchain with no usable county/admin text extraction. DES remains fully challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves, so Arizona still has no reviewable DES county-office lane. That leaves the county-local family blocked not by a total source void but by unparsed official county-mapping PDFs and unreviewed county-admin leaves on the accessible AHCCCS host.';
const COUNTY_STATUS_REASON = 'Arizona county-local routing is blocked on evidence extraction, not on source discovery alone. The accessible AHCCCS HTML lane already preserves seven named ALTCS offices, but it does not name the counties they serve, while the remaining official county-map and county-admin artifacts are image-heavy PDFs that the current local toolchain does not extract into reviewable county text.';
const COUNTY_NEXT_ACTION = 'parse_or_manually_review_ahcccs_county_map_and_county_admin_pdfs_before_rewriting_arizona_county_rows';
const LESSON_HEADING = '### Image-Heavy Official PDFs Are Not County Contracts Until The County Text Is Reviewable';
const LESSON_BODY = '*   **Lesson:** When the official HTML lane proves real local offices but the county mapping lives only in image-heavy PDFs, do not upgrade the county family yet. Record a parser or manual-review blocker explicitly; Arizona AHCCCS exposed seven real ALTCS offices, but county-grade routing still depended on PDFs whose county/admin text was not extractable in the current toolchain.';

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
    '- Education is still a district-owned leaf authoring problem because the AZED host blocks the statewide root, robots.txt, sitemap.xml, and the obvious statewide replacement leaves.',
    '- County-local is now sharper than a generic “partial official artifact” blocker: the accessible AHCCCS HTML lane already proves seven named ALTCS offices, but county mapping still sits in image-heavy PDFs and unreviewed county-admin leaves.',
    '- Arizona should only reopen when district-owned education leaves and a reviewable county-to-office contract are attached from these exact official surfaces rather than from statewide placeholders.',
  ].join('\n') + '\n';
}

export function generateBatch143ArizonaAltcsHtmlAndPdfLaneRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_html_offices_verified_but_county_pdf_contract_unparsed',
          status_reason: COUNTY_STATUS_REASON,
        }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_html_offices_verified_but_county_pdf_contract_unparsed',
          query_basis: 'Reviewed Arizona county-local blocker artifacts, the live AHCCCS ALTCS offices HTML leaf, and the remaining AHCCCS county-map and county-admin PDFs to determine whether Arizona now has a reviewable county-to-office contract.',
          blocker_code: COUNTY_FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          sample_count: 8,
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
              evidence_snippet: 'The live official AHCCCS contacts page is reviewable and preserves applicant contact and ALTCS application routing on the accessible AHCCCS host.',
            },
            {
              sample_name: 'ALTCS Offices',
              source_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
              final_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
              verification_status: 'verified',
              source_type: 'official_office_directory_leaf',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T21:30:00.000Z',
              evidence_snippet: 'The live official ALTCS Offices page preserves seven named official offices: Chinle, Flagstaff, Kingman, Phoenix, Prescott, Tucson, and Yuma.',
            },
            {
              sample_name: 'ALTCS Member Resource Page',
              source_url: 'https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html',
              final_url: 'https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html',
              verification_status: 'verified',
              source_type: 'official_altcs_context_leaf',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T21:30:00.000Z',
              evidence_snippet: 'The official ALTCS member resource page preserves ALTCS context and application phone routing but does not enumerate counties served by each office.',
            },
            {
              sample_name: 'ALTCS County Map PDF',
              source_url: 'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
              final_url: 'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
              verification_status: 'blocked',
              source_type: 'official_pdf_candidate_image_only',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T21:28:00.000Z',
              evidence_snippet: 'The official ALTCS county map PDF fetched successfully, but the current local toolchain could not extract reviewable county-to-office text from the image-heavy document.',
            },
            {
              sample_name: 'County Admin Office PDF',
              source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
              final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
              verification_status: 'blocked',
              source_type: 'official_county_admin_pdf_candidate_image_only',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T21:28:30.000Z',
              evidence_snippet: 'The official CountyAdminOffice PDF fetched successfully, but the current local toolchain surfaced only PDF structure and image streams rather than reviewable county/admin text.',
            },
            {
              sample_name: 'Pima County Admin PDF',
              source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
              final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
              verification_status: 'blocked',
              source_type: 'official_county_admin_pdf_candidate_image_only',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T21:28:45.000Z',
              evidence_snippet: 'The official PimaCountyAdmin PDF fetched successfully, but the current local toolchain did not extract usable county-admin text from the image-heavy file.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: COUNTY_FAILURE_CODE, next_action: COUNTY_NEXT_ACTION, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: STATE_PRIMARY_GAP,
    final_blockers: summary.final_blockers.map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE }
        : row
    )),
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  const lessonAdded = updateLessonsFile(INPUTS.lessons);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_143_arizona_altcs_html_and_pdf_lane_refresh_v1',
    generated_at: '2026-06-22T21:31:00.000Z',
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_families: ['county_local_disability_resources'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    altcs_html_office_count: 7,
    county_pdf_text_extractable: false,
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Arizona ALTCS HTML And PDF Lane Refresh Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- refined_family: county_local_disability_resources',
      `- failure_code: ${COUNTY_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${COUNTY_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch143ArizonaAltcsHtmlAndPdfLaneRefreshV1();
}
