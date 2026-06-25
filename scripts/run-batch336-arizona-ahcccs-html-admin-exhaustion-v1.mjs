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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch336_arizona_ahcccs_html_admin_exhaustion_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch336-arizona-ahcccs-html-admin-exhaustion-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves';

const EDUCATION_STATUS = 'blocked_three_reviewed_public_domains_official_api_and_exact_slug_exhausted_without_role_leafs';
const EDUCATION_REASON = 'Arizona education remains blocked only on 3/15 counties whose public district domains are live but fully exhausted even after one more official API and exact-slug pass. Coconino County Accommodation School District returned HTTP 200 on the district root and official WordPress JSON search, but the wp-json search for `special education` only replayed false-positive Governing Board and staff records while the official page/post sitemaps still exposed zero role-bearing paths. Mohave Accelerated Schools stayed live on the district-owned root, but exact Finalsite-style role candidates such as `/fs/pages/504`, `/fs/pages/special-education`, `/fs/pages/student-services`, and `/fs/pages/special-services` all returned 404. Yavapai Accommodation School District proved its `/page/` namespace is live because `/page/contact-us/` returned HTTP 200, but `/page/special-education/`, `/page/student-services/`, and `/page/504/` all returned 404. The remaining Arizona education blocker is therefore source-final on three reviewed public domains that still lack role-bearing local leaves.';
const EDUCATION_FAILURE_CODE = 'three_reviewed_public_district_domains_exhaust_sitemaps_wp_api_and_exact_slug_replays_without_role_leafs';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 one more bounded Arizona district-owned official API and exact-slug pass for the final three unresolved education counties. https://www.ccasdaz.org/ stayed live, and https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10 returned HTTP 200, but the official WordPress search only replayed false-positive Governing Board and staff records rather than a role-bearing special-education or student-services leaf; the official page-sitemap.xml and post-sitemap.xml still exposed zero matching role paths. https://www.mohavelearning.org/ stayed live, but exact Finalsite-style role candidates at /fs/pages/504, /fs/pages/special-education, /fs/pages/student-services, and /fs/pages/special-services all returned 404. https://www.yavapaicountyhighschool.com/ stayed live and its /page/contact-us/ route returned HTTP 200, proving the public page namespace is real, but /page/special-education/, /page/student-services/, and /page/504/ all returned 404. The remaining Arizona education blocker is now source-final on three reviewed public domains that still lack role-bearing local leaves even after sitemap, API, and exact-slug replay.';
const EDUCATION_NEXT_ACTION = 'hold_three_reviewed_public_domains_until_role_bearing_special_education_or_student_services_leaves_exist';

const COUNTY_STATUS = 'blocked_ahcccs_html_lane_replays_only_pdf_admin_artifacts_without_county_contract';
const COUNTY_REASON = 'Arizona county-local routing is now blocked on a fully bounded official artifact contract, not on an undiscovered HTML lane. The public AHCCCS UniversityFamilyCare oversight page is live and reviewable, but its county-relevant links only replay the same PDF artifacts already in the blocker set: `Pima.pdf`, `PimaCountyAdmin.pdf`, and `CountyAdminOffice.pdf`. Those PDFs still do not yield reviewable county/admin office text in the current repo/runtime, and the current toolchain still lacks `tesseract`, `pdftotext`, `pdftoppm`, `pypdf`, `PyPDF2`, `pdfplumber`, `fitz`, `pdfminer`, `PIL`, and `pdf2image`. DES remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves. Arizona therefore still lacks a truthful county-to-office contract, and the AHCCCS HTML lane itself is now exhausted into PDFs rather than hidden admin leaves.';
const COUNTY_FAILURE_CODE = 'ahcccs_university_familycare_html_page_replays_only_pdf_admin_artifacts_without_html_county_contract';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-24 bounded official Arizona AHCCCS county-local artifacts plus the live HTML oversight family. The public AHCCCS page https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html returned HTTP 200 and explicitly linked `Pima Community Access Program`, `Pima County Administrator\'s Office`, and `County Administrator\'s Office`. But those exact county-relevant links only replay to the same PDF artifacts already in the blocker set: https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/Pima.pdf, https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf, and https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf. The current repo/runtime still has no installed OCR or reviewable PDF text stack for those files: tesseract, pdftotext, pdftoppm, pypdf, PyPDF2, pdfplumber, fitz, pdfminer, PIL, and pdf2image are absent or not importable. DES also remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves. Arizona county-local routing therefore now narrows to a committed OCR artifact or a new official HTML county-admin surface, not to more AHCCCS HTML discovery.';
const COUNTY_NEXT_ACTION = 'keep_county_local_blocked_until_committed_ocr_artifact_or_new_official_html_county_admin_surface_exists';

const LESSON_HEADING = '### Treat Official HTML Pages That Only Replay PDFs As Exhausted';
const LESSON_BODY = '*   **Lesson:** If a live official HTML oversight page only points back to the same image-heavy PDF artifacts already in the blocker set, count the HTML lane as exhausted rather than leaving a fake “reviewed HTML leaves” hope open. Arizona AHCCCS kept `UniversityFamilyCare.html` public, but its county-relevant links only replayed `Pima.pdf`, `PimaCountyAdmin.pdf`, and `CountyAdminOffice.pdf`.';

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
    '- Education remains source-final on three reviewed public district domains that still lack role-bearing local leaves.',
    '- County-local is now stricter than before: the official AHCCCS HTML oversight lane is public, but it only replays the same PDF county-admin artifacts and still does not supply a reviewable county-to-office contract in HTML.',
    '- Arizona should only reopen when a committed OCR artifact or a new official HTML county-admin surface exists, alongside any newly published district-owned education leaves.',
  ].join('\n') + '\n';
}

function updateAllStateReport() {
  let text = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const bullet = '- Arizona remains blocked on a sharper county-local truth: the official AHCCCS `UniversityFamilyCare.html` oversight page is live, but its county-relevant links only replay `Pima.pdf`, `PimaCountyAdmin.pdf`, and `CountyAdminOffice.pdf`, while the current repo/runtime still has no reviewable OCR/PDF text stack; education remains source-final on the three remaining public district domains.';
  if (!text.includes(bullet)) {
    text = `${text.trimEnd()}\n${bullet}\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, text);
}

function updateHandoff() {
  let text = fs.readFileSync(INPUTS.handoff, 'utf8');
  text = text.replace(
    '- Arizona: `azed_host_challenged_and_ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact`',
    '- Arizona: `ahcccs_university_familycare_html_lane_replays_only_pdf_admin_artifacts_and_azed_remaining_three_public_domains_still_lack_role_leaves`',
  );

  const focusSection = `## Current Focus State: Arizona

### Blocker Reason

Arizona still has two critical blockers, and the county-local blocker is now the sharper one. The official AHCCCS oversight page \`https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html\` is public and reviewable, but its county-relevant links only replay the same PDF artifacts already in the blocker lane: \`Pima.pdf\`, \`PimaCountyAdmin.pdf\`, and \`CountyAdminOffice.pdf\`. The current repo/runtime still has no reviewable OCR or PDF text stack for those files. DES remains challenge-blocked on the public office-locator family. Education remains separately blocked, but it is already source-final on the last three public district domains: Coconino, Mohave, and Yavapai still expose no role-bearing local leaves after sitemap, API, and exact-slug replay.

### Exact Evidence Needed

- A committed OCR artifact or other reviewable text extraction for the official AHCCCS county-admin PDFs that truthfully yields county-to-office assignment evidence.
- Or, a new official AHCCCS or DES HTML page that directly exposes county-admin or county-to-office assignment fields in public HTML.
- Separately, any newly published district-owned special-education, special-services, student-services, or 504 leaf on the remaining three Arizona district domains.

### Useful Official URLs Already Tried

- [AHCCCS UniversityFamilyCare oversight page](https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html)
- [AHCCCS ALTCS Offices page](https://www.azahcccs.gov/members/ALTCSlocations.html)
- [AHCCCS Contacts page](https://www.azahcccs.gov/shared/AHCCCScontacts.html)
- [AHCCCS ALTCS Member Resources page](https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html)
- [AHCCCS CountyAdminOffice PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf)
- [AHCCCS PimaCountyAdmin PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf)
- [AHCCCS Pima Community Access Program PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/Pima.pdf)
- [Coconino County Accommodation School District](https://www.ccasdaz.org/)
- [Mohave Accelerated Schools](https://www.mohavelearning.org/)
- [Yavapai County High School](https://www.yavapaicountyhighschool.com/)

### Top Remaining Source-Scouting Targets

- Any official AHCCCS or DES HTML page that exposes county-admin, county office, counties served, or county-to-office assignment fields directly in public HTML.
- Any committed OCR artifact for the existing official AHCCCS county-admin PDFs.
- Any exact district-owned local leaf on the remaining Coconino, Mohave, or Yavapai district hosts that explicitly carries special-education, special-services, student-services, or 504 role text.

## Next State Order After Arizona

1. Massachusetts
2. New Mexico
3. South Dakota
4. Rhode Island
5. Virginia
6. West Virginia
7. North Dakota
8. Wisconsin
9. Washington
10. Tennessee`;

  text = text.replace(/## Current Focus State:[\s\S]*$/m, focusSection);
  fs.writeFileSync(INPUTS.handoff, `${text.trimEnd()}\n`);
}

function buildBatchReport() {
  return [
    '# Batch 336 Arizona AHCCCS HTML Admin Exhaustion Report v1',
    '',
    '- state: arizona',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: county_local_disability_resources',
    '',
    '## What changed',
    '',
    '- Rechecked the live official AHCCCS UniversityFamilyCare oversight page on 2026-06-24.',
    '- Confirmed the page is public and reviewable, but its county-relevant links only replay the same PDF artifacts already in the blocker lane.',
    '- Confirmed the local runtime still lacks reviewable OCR/PDF text libraries and tools for those PDFs.',
    '- Arizona remains blocked and not index-safe.',
  ].join('\n') + '\n';
}

export function generateBatch336ArizonaAhcccsHtmlAdminExhaustionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch336_arizona_ahcccs_html_admin_exhaustion_v1',
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => {
      if (blocker.family === 'district_or_county_education_routing') {
        return {
          ...blocker,
          failure_code: EDUCATION_FAILURE_CODE,
          evidence: EDUCATION_EVIDENCE,
          next_action: EDUCATION_NEXT_ACTION,
        };
      }
      if (blocker.family === 'county_local_disability_resources') {
        return {
          ...blocker,
          failure_code: COUNTY_FAILURE_CODE,
          evidence: COUNTY_EVIDENCE,
          next_action: COUNTY_NEXT_ACTION,
        };
      }
      return blocker;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: EDUCATION_STATUS, status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON };
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
        family_status: EDUCATION_STATUS,
        blocker_code: EDUCATION_FAILURE_CODE,
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      const samples = [
        {
          sample_name: 'AHCCCS UniversityFamilyCare oversight page',
          source_url: 'https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html',
          final_url: 'https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html',
          verification_status: 'blocked',
          source_type: 'official_html_page_that_only_replays_pdf_admin_artifacts',
          source_table: 'batch336_arizona_ahcccs_html_admin_exhaustion',
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The public AHCCCS UniversityFamilyCare page links Pima Community Access Program, Pima County Administrator\'s Office, and County Administrator\'s Office only as PDFs, not as HTML county-admin leaves.',
        },
        {
          sample_name: 'AHCCCS ALTCS Offices page',
          source_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
          final_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
          verification_status: 'blocked',
          source_type: 'official_statewide_altcs_page_without_county_contract',
          source_table: 'batch234_arizona_final_blocker_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The raw HTML preserves seven named ALTCS office cards, but no statewide county-to-office table or repeatable county listing appears in the public HTML.',
        },
        {
          sample_name: 'AHCCCS Pima County Administrator PDF',
          source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
          final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
          verification_status: 'blocked',
          source_type: 'official_pdf_without_reviewable_text_in_current_runtime',
          source_table: 'batch336_arizona_ahcccs_html_admin_exhaustion',
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The PDF is official and fetchable, but the current runtime still has no OCR/PDF text stack that yields reviewable county-admin office text.',
        },
        {
          sample_name: 'AHCCCS County Administrator Office PDF',
          source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
          final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
          verification_status: 'blocked',
          source_type: 'official_pdf_without_reviewable_text_in_current_runtime',
          source_table: 'batch336_arizona_ahcccs_html_admin_exhaustion',
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The PDF is official and fetchable, but the current runtime still has no OCR/PDF text stack that yields reviewable county-admin office text.',
        },
      ];

      return {
        ...row,
        family_status: COUNTY_STATUS,
        query_basis: 'Reviewed 2026-06-24 the live AHCCCS UniversityFamilyCare oversight page, the linked county-admin PDFs, and the currently installed local PDF/OCR toolchain.',
        blocker_code: COUNTY_FAILURE_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        sample_count: samples.length,
        samples,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION };
    }
    return row;
  });

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'arizona'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'arizona'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            packetBatch: 'batch336_arizona_ahcccs_html_admin_exhaustion_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: EDUCATION_STATUS,
              county_local_disability_resources: COUNTY_STATUS,
            },
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateAllStateReport();
  updateHandoff();
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);

  writeJson(OUTPUTS.summary, {
    batch: 'batch336_arizona_ahcccs_html_admin_exhaustion_v1',
    generated_at: '2026-06-24T00:00:00.000Z',
    state: 'arizona',
    classification: 'BLOCKED',
    index_safe: false,
    html_admin_lane_live: true,
    html_admin_lane_replays_only_pdf_artifacts: true,
    linked_pdf_artifacts: [
      'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/Pima.pdf',
      'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
      'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
    ],
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return {
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch336ArizonaAhcccsHtmlAdminExhaustionV1();
}
