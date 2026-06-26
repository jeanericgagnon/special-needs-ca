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
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch409_arizona_admin_pdf_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch409-arizona-admin-pdf-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const BATCH = 'batch409_arizona_admin_pdf_truth_refresh_v1';
const REVIEWED_DATE = '2026-06-26';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_greenlee_zip_only_and_ahcccs_admin_pdfs_are_pima_support_letters_not_county_contracts';
const SPED_REASON =
  'Reviewed 2026-06-26 the current live official U.S. Department of Education IDEA-by-State page for Arizona at `https://sites.ed.gov/idea/state/arizona/` after the older Arizona Department of Education special-education lane failed live probes behind a Cloudflare 403 shell. The current official federal page is reviewable and Arizona-specific: it preserves the exact state heading `Arizona - Individuals with Disabilities Education Act` and publishes current IDEA Part B materials, including `2025 SPP/APR and State Determination Letters, Part B — Arizona` and `2024 SPP/APR and State Determination Letters, Part B — Arizona`, on the same official host. That is enough to keep statewide IDEA Part B authority evidence current while district-grade routing remains proved separately from reviewed Arizona district-owned leaves.';
const COUNTY_STATUS =
  'blocked_des_salesforce_locator_greenlee_zip_only_and_ahcccs_admin_pdfs_prove_no_county_contract';
const FAILURE_CODE =
  'official_greenlee_county_assignment_still_missing_after_live_admin_pdf_review';
const NEXT_ACTION =
  'hold_blocked_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_new_reviewable_county_to_office_contract';
const COUNTY_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live Arizona county-local pass across the exact remaining official DES and AHCCCS lanes. The official DES wrapper roots \`https://des.az.gov/office-locator\` and \`https://des.az.gov/find-your-local-office\` still return HTTP 403 \`Just a moment...\` shells. The linked public Salesforce-hosted DES office-locator app at \`https://azdes-community.my.salesforce-sites.com/EOL/\` is still live and remains the only reviewable official DES county-local lane, but it still exposes Greenlee only through locality ZIP coverage rather than an explicit county assignment. The official AHCCCS fallback lane is now clearer than in the older packet. The current official PDFs linked from the public \`UniversityFamilyCare.html\` oversight page are live and reviewable: \`CountyAdminOffice.pdf\` and \`PimaCountyAdmin.pdf\` both return HTTP 200 application/pdf and are readable after rendering, but they are just 2014 Pima County Administrator support letters about the University Family Care merger, not county-to-office routing contracts. The current official ALTCS county-map PDF at \`https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf\` is also live and text-extractable, but it only preserves county enrollment counts and contractor names, not office assignment. The live \`ALTCSlocations.html\` page still stops at named office cards and still does not explicitly assign Greenlee County to an office. The official Greenlee County health page plus first-party Clifton, Duncan, and Morenci town surfaces remain live, but they still do not name any DES or AHCCCS office assignment for Greenlee County. Arizona therefore still lacks one reviewed public official artifact that explicitly binds Greenlee County itself to a DES or AHCCCS office.`;

const LESSON_HEADING =
  '### Readable Official PDFs Still Fail If They Are The Wrong Artifact';
const LESSON_BODY =
  '*   **Lesson:** Clearing a format blocker is not enough. Arizona’s final AHCCCS admin PDFs were live and readable once rendered, but they turned out to be 2014 Pima support letters about the University Family Care merger rather than county-to-office routing contracts. A newly readable official document should still be tested against the exact public contract before it reopens a state.';

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

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
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
    '## Completion decision',
    '',
    '- Arizona remains BLOCKED and not index-safe.',
    '- County-local routing is still blocked on one exact unresolved contract: a reviewed public DES or AHCCCS artifact that explicitly assigns Greenlee County to an office.',
    '- The last AHCCCS admin-PDF lane is now exhausted truthfully: those official PDFs are readable, but they are Pima support letters rather than county-routing artifacts.',
  ].join('\n') + '\n';
}

function buildBatchReport() {
  return [
    '# Batch 409 Arizona Admin PDF Truth Refresh v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: replaced Arizona’s last AHCCCS admin-PDF ambiguity with direct reviewed evidence that the PDFs are readable but non-closing support letters',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_REASON}`,
  ].join('\n') + '\n';
}

export function generateBatch409ArizonaAdminPdfTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 92,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_county_local_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_full_county_contract',
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: COUNTY_STATUS,
    },
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: NEXT_ACTION,
      },
    ],
  };

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON }
      : row.family === 'special_education_idea_part_b'
        ? { ...row, family_status: 'verified_state_grade', status_reason: SPED_REASON }
        : row,
  );

  const updatedFailureRows = [
    {
      state: 'arizona',
      state_code: 'AZ',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: FAILURE_CODE,
      evidence: COUNTY_REASON,
      next_action: NEXT_ACTION,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: COUNTY_STATUS,
          blocker_code: FAILURE_CODE,
          blocker_evidence: COUNTY_REASON,
          sample_count: 16,
          samples: [
            ...(row.samples || []).filter((sample) => sample.sample_name !== 'AHCCCS CountyAdminOffice PDF support letter' && sample.sample_name !== 'AHCCCS PimaCountyAdmin PDF support letter'),
            {
              sample_name: 'AHCCCS CountyAdminOffice PDF support letter',
              source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
              final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
              verification_status: 'reviewed',
              source_type: 'official_pdf_non_contract_support_letter',
              source_table: BATCH,
              fetched_at: '2026-06-26T00:00:00.000Z',
              evidence_snippet: 'Rendered review shows the PDF is a 2014 Pima County Administrator support letter to AHCCCS Director Tom Betlach about the University Family Care merger, not a county-to-office assignment artifact.',
            },
            {
              sample_name: 'AHCCCS PimaCountyAdmin PDF support letter',
              source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
              final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/PimaCountyAdmin.pdf',
              verification_status: 'reviewed',
              source_type: 'official_pdf_non_contract_support_letter',
              source_table: BATCH,
              fetched_at: '2026-06-26T00:00:00.000Z',
              evidence_snippet: 'Rendered review shows the PDF is also a 2014 Pima County Administrator support letter for University Family Care and does not contain Greenlee County or any office-assignment contract.',
            },
          ],
        }
      : row.family === 'special_education_idea_part_b'
        ? {
            ...row,
            family_status: 'verified_state_grade',
            evidence_strength: 'strong',
            sample_count: 2,
            query_basis: 'Reviewed 2026-06-26 official IDEA-by-State Arizona materials on the current U.S. Department of Education host after the old AZED special-education lane failed live probes.',
            blocker_code: null,
            blocker_evidence: null,
            samples: [
              {
                sample_name: 'IDEA-by-State Arizona',
                source_url: 'https://sites.ed.gov/idea/state/arizona/',
                final_url: 'https://sites.ed.gov/idea/state/arizona/',
                verification_status: 'official_verified',
                source_type: 'official_federal_state_specific_idea_page',
                source_table: BATCH,
                fetched_at: '2026-06-26T00:00:00.000Z',
                evidence_snippet: 'The live official page heading is `Arizona - Individuals with Disabilities Education Act` and it serves as the current state-specific IDEA authority page for Arizona.',
              },
              {
                sample_name: '2025 SPP/APR and State Determination Letters, Part B — Arizona',
                source_url: 'https://sites.ed.gov/idea/idea-files/2025-spp-apr-and-state-determination-letters-part-b-arizona/',
                final_url: 'https://sites.ed.gov/idea/idea-files/2025-spp-apr-and-state-determination-letters-part-b-arizona/',
                verification_status: 'official_verified',
                source_type: 'official_federal_state_specific_idea_material',
                source_table: BATCH,
                fetched_at: '2026-06-26T00:00:00.000Z',
                evidence_snippet: 'The live official page title is `2025 SPP/APR and State Determination Letters, Part B — Arizona - Individuals with Disabilities Education Act`.',
              },
            ],
          }
        : row,
  );

  const updatedNextRows = [
    {
      state: 'arizona',
      state_code: 'AZ',
      family: 'county_local_disability_resources',
      severity: 'critical',
      priority_rank: 1,
      failure_code: FAILURE_CODE,
      next_action: NEXT_ACTION,
    },
  ];

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'arizona'
      ? {
          ...row,
          primary_gap_reason: PRIMARY_GAP_REASON,
          completeness_pct: 92,
          weak_critical_families: 1,
          recommended_batch: 'hold_county_local_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_full_county_contract',
        }
      : row,
  );

  const auditRow = audit.states.find((row) => row.stateId === 'arizona');
  if (auditRow) {
    auditRow.packetBatch = BATCH;
    auditRow.packetPrimaryGapReason = PRIMARY_GAP_REASON;
    auditRow.packetRecommendedBatch = 'hold_county_local_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_full_county_contract';
    auditRow.familyStatuses.county_local_disability_resources = COUNTY_STATUS;
    auditRow.completenessPct = 92;
    auditRow.strongCriticalFamilies = 11;
    auditRow.weakCriticalFamilies = 1;
  }

  const updatedAllStateReportLine =
    '- Arizona remains blocked after a 2026-06-26 bounded live recheck: DES wrapper roots still return HTTP 403 `Just a moment...` shells, the public Salesforce locator app remains live but still exposes Greenlee only through locality ZIP coverage, the current AHCCCS admin PDFs are live and readable but prove to be 2014 Pima support letters rather than county-routing contracts, and no reviewed public DES or AHCCCS artifact explicitly assigns Greenlee County to an office.';
  const finalAllStateReport = /- Arizona remains blocked after[^\n]*/.test(allStateReport)
    ? allStateReport.replace(/- Arizona remains blocked after[^\n]*/, updatedAllStateReportLine)
    : `${allStateReport.trimEnd()}\n${updatedAllStateReportLine}\n`;

  const finalHandoff = handoff
    .replace(/Current Focus State: [^\n]+/, 'Current Focus State: Arizona')
    .replace(
      /- Arizona: `[^`]+`/,
      '- Arizona: `bounded_2026_06_26_live_recheck_confirms_des_wrapper_still_403_salesforce_locator_greenlee_zip_only_and_ahcccs_admin_pdfs_are_pima_support_letters_not_county_contracts`',
    );

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, audit);
  writeText(INPUTS.allStateReport, finalAllStateReport);
  writeText(INPUTS.handoff, `${finalHandoff.trimEnd()}\n`);
  writeText(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    generated_at: new Date().toISOString(),
    classification: 'BLOCKED',
    des_wrapper_403: true,
    des_salesforce_live: true,
    altcs_locations_live: true,
    altcs_county_map_live_and_text_extractable: true,
    county_admin_pdf_live: true,
    county_admin_pdf_is_support_letter: true,
    pima_admin_pdf_live: true,
    pima_admin_pdf_is_support_letter: true,
    lesson_added: lessonAdded,
    counts_unchanged: {
      complete: audit.classifications.COMPLETE,
      blocked: audit.classifications.BLOCKED,
      indexSafe: audit.indexSafeCount,
    },
  });
  writeText(OUTPUTS.report, buildBatchReport());

  return { classification: 'BLOCKED' };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch409ArizonaAdminPdfTruthRefreshV1();
}
