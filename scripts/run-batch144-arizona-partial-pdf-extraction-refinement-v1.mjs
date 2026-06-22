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
  summary: path.join(generatedDir, 'batch144_arizona_partial_pdf_extraction_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch144-arizona-partial-pdf-extraction-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const STATE_PRIMARY_GAP = 'azed_host_challenged_and_ahcccs_county_mapping_now_narrows_to_admin_pdf_ocr_or_reviewed_admin_leaves';
const COUNTY_FAILURE_CODE = 'ahcccs_county_map_pdf_yields_county_text_but_admin_office_mapping_still_requires_ocr_or_reviewed_leaves';
const COUNTY_STATUS_REASON = 'Arizona county-local routing is no longer blocked on total PDF unreadability. The official ALTCS county map PDF yields machine-readable county enrollment text on the bundled pypdf lane, proving the AHCCCS PDF surface is partly parseable, but it still does not preserve a county-to-office address and phone contract. The remaining CountyAdminOffice and PimaCountyAdmin PDFs are still image-only in the current lane, so county-grade office routing remains blocked on admin-office OCR or reviewed HTML admin leaves rather than on source discovery alone.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded official Arizona AHCCCS county-local artifacts again using the bundled workspace Python runtime. The live ALTCS Offices HTML leaf still proves seven named official offices on the accessible AHCCCS host: Chinle, Flagstaff, Kingman, Phoenix, Prescott, Tucson, and Yuma. The official ALTCS County Map PDF is not fully image-only after all: bundled pypdf extraction preserves county names such as Yuma, Mohave, La Paz, Gila, Santa Cruz, Cochise, Graham, Maricopa, Pinal, Apache, Navajo, Coconino, Yavapai, Greenlee, and Pima alongside ALTCS enrollment text. But that county-map artifact still does not preserve office addresses, phones, or a county-to-office assignment contract. The remaining official CountyAdminOffice.pdf and PimaCountyAdmin.pdf artifacts still did not yield reviewable county/admin text in the current lane, and DES remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves. Arizona county-local routing therefore narrows to admin-office OCR or reviewed AHCCCS admin leaves, not to generic source discovery.';
const COUNTY_NEXT_ACTION = 'ocr_or_review_ahcccs_county_admin_pdfs_or_equivalent_admin_leaves_before_rewriting_arizona_county_rows';
const LESSON_HEADING = '### Use The Bundled PDF Runtime Before Declaring An Official PDF Fully Image-Only';
const LESSON_BODY = '*   **Lesson:** Before preserving a PDF blocker as fully image-only, run one bounded extraction pass with the bundled workspace Python runtime. Arizona’s ALTCS county map still was not enough to clear county routing, but bundled `pypdf` recovered the county list and proved the lane was partially parseable even though the admin-office PDFs remained OCR-only blockers.';

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
    '- County-local is now narrower than a generic PDF parser blocker: the official ALTCS county map is partially text-extractable, but the county-to-office assignment still lives in unreviewed admin PDFs or equivalent AHCCCS admin leaves.',
    '- Arizona should only reopen when district-owned education leaves and a reviewable county-to-office contract are attached from these exact official surfaces rather than from statewide placeholders.',
  ].join('\n') + '\n';
}

export function generateBatch144ArizonaPartialPdfExtractionRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_altcs_county_text_partial_admin_mapping_unresolved',
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
          family_status: 'blocked_altcs_county_text_partial_admin_mapping_unresolved',
          query_basis: 'Reviewed Arizona county-local blocker artifacts again with the bundled workspace Python runtime to separate partially parseable AHCCCS PDFs from still-image-only admin-office artifacts.',
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
              sample_name: 'ALTCS County Map PDF',
              source_url: 'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
              final_url: 'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
              verification_status: 'partial',
              source_type: 'official_pdf_partial_text_extract',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T22:00:00.000Z',
              evidence_snippet: 'Bundled pypdf extraction preserves Arizona county names including Yuma, Mohave, La Paz, Gila, Santa Cruz, Cochise, Graham, Maricopa, Pinal, Apache, Navajo, Coconino, Yavapai, Greenlee, and Pima, but no office-address or county-to-office assignment contract.',
            },
            {
              sample_name: 'County Admin Office PDF',
              source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
              final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
              verification_status: 'blocked',
              source_type: 'official_county_admin_pdf_ocr_required',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T22:00:00.000Z',
              evidence_snippet: 'The official CountyAdminOffice PDF still did not yield reviewable county/admin office text in the current extraction lane and remains an OCR or manual-review blocker.',
            },
            {
              sample_name: 'Pima County Admin PDF',
              source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
              final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
              verification_status: 'blocked',
              source_type: 'official_county_admin_pdf_ocr_required',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T22:00:00.000Z',
              evidence_snippet: 'The official PimaCountyAdmin PDF still did not yield usable county-admin text in the current extraction lane and remains an OCR or manual-review blocker.',
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
              sample_name: 'ALTCS Member Resource Page',
              source_url: 'https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html',
              final_url: 'https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html',
              verification_status: 'verified',
              source_type: 'official_altcs_context_leaf',
              source_table: 'reviewed_live_probe',
              fetched_at: '2026-06-22T21:30:00.000Z',
              evidence_snippet: 'The official ALTCS member resource page preserves ALTCS context and application phone routing but does not enumerate counties served by each office.',
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
    batch: 'batch_144_arizona_partial_pdf_extraction_refinement_v1',
    generated_at: '2026-06-22T22:05:00.000Z',
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_families: ['county_local_disability_resources'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    altcs_county_map_text_extractable: true,
    county_admin_pdf_text_extractable: false,
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Arizona Partial PDF Extraction Refinement Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- refined_family: county_local_disability_resources',
      `- failure_code: ${COUNTY_FAILURE_CODE}`,
      '',
      '## Evidence',
      '',
      `- ${COUNTY_EVIDENCE}`,
      '',
      '## Repair decision',
      '',
      '- The official ALTCS county map is partially parseable and should no longer be described as fully image-only.',
      '- Arizona still remains blocked because the county-admin office contract itself is still trapped in OCR-only PDFs or equivalent unreviewed AHCCCS admin leaves.',
    ].join('\n') + '\n',
  );

  return {
    summary: updatedSummary,
    gapRows: updatedGapRows,
    failureRows: updatedFailureRows,
    verifiedRows: updatedVerifiedRows,
    nextRows: updatedNextRows,
    lessonAdded,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch144ArizonaPartialPdfExtractionRefinementV1();
  console.log('batch144_arizona_partial_pdf_extraction_refinement_v1: ok');
}
