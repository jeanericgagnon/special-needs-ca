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
  report: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch350_arizona_pdf_support_letter_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch350-arizona-pdf-support-letter-finality-report-v1.md'),
};

const BATCH_NAME = 'batch350_arizona_pdf_support_letter_finality_v1';
const PRIMARY_GAP_REASON =
  'ahcccs_university_familycare_pdf_bundle_now_proves_non_contract_support_letters_and_azed_remaining_three_public_domains_still_lack_role_leaves';
const COUNTY_STATUS = 'blocked_ahcccs_pdf_bundle_resolves_to_support_letters_without_county_contract';
const FAILURE_CODE =
  'ahcccs_university_familycare_pdf_bundle_is_parseable_but_only_support_letters_not_county_admin_routing_contract';
const NEXT_ACTION =
  'hold_county_local_until_new_official_html_or_pdf_county_contract_exists_not_support_letters';
const COUNTY_REASON =
  'Reviewed 2026-06-25 the exact official Arizona AHCCCS UniversityFamilyCare PDF bundle with the current bundled PDF runtime instead of relying on the older missing-parser assumption. The oversight page https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html still points to three county-relevant PDFs: `Pima.pdf`, `PimaCountyAdmin.pdf`, and `CountyAdminOffice.pdf`. The current bundled runtime can now parse or render those files, and the result is stronger but still blocking: `Pima.pdf` is text-extractable and reads as a support letter from Michal Goforth of Pima Community Access Program backing the University Family Care merger, not as a county office directory or routing contract. `PimaCountyAdmin.pdf` and `CountyAdminOffice.pdf` render as image-based letters on Pima County Administrator letterhead to AHCCCS Director Tom Betlach, dated September 5, 2014, offering support for the University Family Care merger. Those PDFs preserve county and administrator identity, but they still do not expose county-to-office routing, office assignments, service areas, or a county-admin contact contract that can clear county-local disability resources. DES remains challenge-blocked on its office surfaces, so Arizona county-local routing is now source-final on non-contract support letters rather than on a missing PDF toolchain.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-25 exact official Arizona AHCCCS PDF artifacts from https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html using the bundled Codex runtime PDF stack (`pypdf`, `pdfplumber`, `pdfminer`, `pdfinfo`, and `pdftoppm`). `Pima.pdf` returned HTTP 200, extracted cleanly as text, and proved to be a support letter from Michal Goforth, Executive Director of Pima Community Access Program, supporting the University Family Care merger. `PimaCountyAdmin.pdf` and `CountyAdminOffice.pdf` both returned HTTP 200, produced no embedded text via `pypdf`, but rendered cleanly to page images that show Pima County Administrator\'s Office letterhead, county address `130 W. Congress, Floor 10, Tucson, AZ 85701-1317`, phone `(520) 724-8661`, and a support letter to AHCCCS Director Tom Betlach dated September 5, 2014. None of the three official PDFs is a county office directory, county-admin routing table, service-area crosswalk, or county-to-office contract. DES office surfaces remain challenge-blocked. Arizona county-local therefore remains blocked because the reviewed official PDF bundle is non-contract evidence, not because the PDF parser lane is missing.';
const LESSON_HEADING = '### A Working PDF Stack Still Does Not Turn Support Letters Into County Contracts';
const LESSON_BODY =
  '*   **Lesson:** When a blocker says the PDF lane is unavailable, re-check the exact official PDFs once the bundled runtime can parse or render them, but still hold the family closed if the files are only advocacy or support letters. Arizona\'s AHCCCS UniversityFamilyCare bundle became reviewable with `pypdf` and `pdftoppm`, yet the files were still non-contract support letters rather than county-routing evidence.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
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
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
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
    '- Education remains source-final on the remaining three reviewed public district domains that still lack role-bearing local leaves.',
    '- County-local is now blocked for a stronger reason: the exact official AHCCCS PDF bundle is reviewable with the current bundled runtime, but the files are support letters rather than county-routing contracts.',
    '- Arizona should only reopen county-local when a real official county-admin contract, office directory, service-area table, or county-to-office crosswalk exists.',
  ].join('\n') + '\n';
}

function buildAllStateReport(text) {
  const newLine = '- Arizona remains blocked on a stronger county-local finality check: the exact AHCCCS UniversityFamilyCare PDF bundle is now reviewable with the bundled PDF runtime, but the files resolve only to non-contract support letters while the last three education domains still lack role-bearing local leaves.';
  const lines = text.split('\n').filter((line) => !line.startsWith('- Arizona remains blocked on '));
  const notesIndex = lines.findIndex((line) => line.trim() === '## Notes');
  if (notesIndex === -1) return `${lines.join('\n').trimEnd()}\n${newLine}\n`;
  const nextLines = [...lines];
  nextLines.splice(notesIndex + 2, 0, newLine);
  return `${nextLines.join('\n').trimEnd()}\n`;
}

function buildHandoff(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  return [
    '# Gemini Source Scout Handoff',
    '',
    `Updated: ${new Date().toISOString().slice(0, 10)}`,
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Arizona',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is now the sharper Arizona blocker. Reviewed 2026-06-25 the exact official AHCCCS UniversityFamilyCare PDF bundle with the bundled PDF runtime. `Pima.pdf` extracts as a support letter from Pima Community Access Program, and `PimaCountyAdmin.pdf` plus `CountyAdminOffice.pdf` render as Pima County Administrator support letters for the University Family Care merger. Those official PDFs preserve county and administrator identity, but they still do not expose office assignments, service areas, county-admin routing, or a county-to-office contract. Arizona education remains separately blocked on three reviewed public district domains that still lack role-bearing local leaves, so Arizona stays blocked and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Arizona county-admin office directory, office assignment table, service-area crosswalk, or county-to-office contract that is public and reviewable.',
    '- Any newly published district-owned special-education, student-services, 504, or procedural-safeguards leaf on the final three unresolved education domains.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [AHCCCS University Family Care oversight page](https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html)',
    '- [Pima Community Access Program PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/Pima.pdf)',
    '- [Pima County Administrator PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf)',
    '- [County Administrator Office PDF](https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf)',
    '- [Coconino County Accommodation School District root](https://www.ccasdaz.org/)',
    '- [Coconino wp-json search](https://www.ccasdaz.org/wp-json/wp/v2/search?search=special%20education&per_page=10)',
    '- [Mohave Accelerated Schools root](https://www.mohavelearning.org/)',
    '- [Yavapai County High School contact page](https://www.yavapaicountyhighschool.com/page/contact-us/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official AHCCCS, DES, or county-admin surface that exposes real county-to-office routing instead of merger-support letters.',
    '- Any newly published role-bearing local education leaf on Coconino County Accommodation School District, Mohave Accelerated Schools, or Yavapai County High School.',
    '',
    '## Next State Order After Arizona',
    '',
    '1. Massachusetts',
    '2. New Mexico',
    '3. South Dakota',
    '4. Rhode Island',
    '5. Virginia',
    '6. West Virginia',
    '7. North Dakota',
    '8. Wisconsin',
    '9. Washington',
    '10. Tennessee',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 350 Arizona PDF Support Letter Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: replaced the stale “missing PDF stack” county-local blocker with exact official PDF review showing the AHCCCS bundle is support-letter evidence, not a county-routing contract',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch350ArizonaPdfSupportLetterFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_for_new_official_county_contract_or_role_leaf',
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        ...(summary.final_blockers || []).find((row) => row.family === 'district_or_county_education_routing'),
      },
      {
        family: 'county_local_disability_resources',
        failure_code: FAILURE_CODE,
        evidence: COUNTY_EVIDENCE,
        next_action: NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      county_local_disability_resources: COUNTY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
        ...row,
        family_status: COUNTY_STATUS,
        sample_count: 5,
        blocker_code: FAILURE_CODE,
        blocker_evidence: COUNTY_EVIDENCE,
        query_basis: 'Reviewed the exact official Arizona AHCCCS UniversityFamilyCare oversight page and the three linked PDFs with the bundled PDF runtime.',
        samples: [
          {
            sample_name: 'AHCCCS UniversityFamilyCare oversight page',
            source_url: 'https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html',
            final_url: 'https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html',
            verification_status: 'blocked',
            source_type: 'official_html_bundle_root',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The public page stays live and links `Pima Community Access Program`, `Pima County Administrator\'s Office`, and `County Administrator\'s Office`, but those links only replay to the same official PDF artifacts.',
          },
          {
            sample_name: 'Pima Community Access Program support letter PDF',
            source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/Pima.pdf',
            final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/Pima.pdf',
            verification_status: 'blocked',
            source_type: 'official_pdf_support_letter',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The PDF is text-extractable and reads as a support letter from Michal Goforth, Executive Director of Pima Community Access Program, backing the University Family Care merger.',
          },
          {
            sample_name: 'Pima County Administrator support letter PDF',
            source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
            final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
            verification_status: 'blocked',
            source_type: 'official_pdf_support_letter_image_render',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The rendered page shows Pima County Administrator\'s Office letterhead, county address, and a September 5, 2014 support letter to AHCCCS Director Tom Betlach, not a routing contract.',
          },
          {
            sample_name: 'County Administrator Office support letter PDF',
            source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
            final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
            verification_status: 'blocked',
            source_type: 'official_pdf_support_letter_image_render',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The rendered first page again shows Pima County Administrator\'s Office support-letter content for the University Family Care merger rather than county office assignments or service areas.',
          },
          {
            sample_name: 'DES office surfaces remain challenge-blocked',
            source_url: 'https://des.az.gov/office-locator',
            final_url: 'https://des.az.gov/office-locator',
            verification_status: 'blocked',
            source_type: 'challenge_blocked_office_surface',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The DES office lane still does not expose a reviewable county-admin contract, so the AHCCCS PDF bundle remains the exact official county-local surface and it does not clear the family.',
          },
        ],
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: COUNTY_EVIDENCE }
      : row
  ));

  const updatedStateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'arizona'
      ? {
        ...row,
        primary_gap_reason: PRIMARY_GAP_REASON,
        recommended_batch: 'hold_for_new_official_county_contract_or_role_leaf',
        repair_lane: 'blocked_until_real_county_contract_or_role_leaf',
      }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    classifications: updatedQueueRows.reduce((acc, row) => {
      acc[row.classification] = (acc[row.classification] || 0) + 1;
      return acc;
    }, {}),
    indexSafeCount: updatedQueueRows.filter((row) => row.index_safe).length,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'arizona'
        ? {
          ...row,
          classification: 'BLOCKED',
          indexSafe: false,
          completenessPct: 83,
          weakCriticalFamilies: 2,
          familyStatuses: {
            ...row.familyStatuses,
            county_local_disability_resources: COUNTY_STATUS,
          },
          packetBatch: BATCH_NAME,
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          packetRecommendedBatch: 'hold_for_new_official_county_contract_or_role_leaf',
        }
        : row
    )),
  };

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'arizona',
    classification: 'BLOCKED',
    index_safe: false,
    pdf_runtime_available: true,
    text_extractable_support_pdfs: 1,
    rendered_image_support_pdfs: 2,
    county_contract_found: false,
    result: 'official_pdf_bundle_is_non_contract_support_evidence',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedStateReport);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  fs.writeFileSync(INPUTS.allStateReport, buildAllStateReport(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit));
  appendLessonIfMissing(INPUTS.lessons);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return {
    classification: updatedSummary.classification,
    primary_gap_reason: updatedSummary.primary_gap_reason,
    batch: BATCH_NAME,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch350ArizonaPdfSupportLetterFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
