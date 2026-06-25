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
  summary: path.join(generatedDir, 'batch145_arizona_ocr_lane_gate_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch145-arizona-ocr-lane-gate-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const STATE_PRIMARY_GAP = 'azed_host_challenged_and_ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact';
const COUNTY_FAILURE_CODE = 'ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact';
const COUNTY_STATUS_REASON = 'Arizona county-local routing is now blocked on the missing admin-mapping artifact itself, not on generic source discovery. The official ALTCS county map PDF is partially text-extractable and the AHCCCS host still exposes named ALTCS office leaves, but the county-to-office contract remains trapped in CountyAdminOffice and PimaCountyAdmin PDFs that the current repo/runtime cannot OCR or rasterize. Without reviewed AHCCCS admin HTML leaves or a committed OCR artifact, county-grade office routing cannot be truthfully rewritten.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded official Arizona AHCCCS county-local artifacts plus the current local parser toolchain. The live ALTCS Offices HTML leaf still proves seven named official offices on the accessible AHCCCS host, and the official ALTCS County Map PDF still yields machine-readable county names in the bounded extraction lane. But the remaining CountyAdminOffice.pdf and PimaCountyAdmin.pdf artifacts still do not yield reviewable county/admin office text, and the current repo/runtime has no installed OCR or PDF raster tools for a deterministic low-token rescue lane: tesseract, pdftotext, and pdftoppm are absent on PATH, and pytesseract, pdf2image, and PIL are not importable. DES also remains challenge-blocked at root, robots.txt, sitemap.xml, and office-locator leaves. Arizona county-local routing therefore now narrows to reviewed AHCCCS admin HTML leaves or a separately committed OCR artifact, not to more pypdf retries or generic source discovery.';
const COUNTY_NEXT_ACTION = 'attach_reviewed_ahcccs_admin_html_leaves_or_committed_ocr_artifact_before_rewriting_arizona_county_rows';
const LESSON_HEADING = '### Check OCR Tooling Before Looping On Official Image PDFs';
const LESSON_BODY = '*   **Lesson:** If a county-office family depends on image-heavy official PDFs, verify the local OCR and PDF-raster toolchain before retrying the same files. Arizona’s AHCCCS lane had partial county text, but with no `tesseract`, `pdftotext`, `pdftoppm`, `PIL`, or `pdf2image` available, the honest next step was reviewed HTML admin leaves or a committed OCR artifact, not another parser loop.';

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
    '- County-local is now a tighter artifact-contract blocker: the official AHCCCS surfaces are partly readable, but the county-to-office assignment still depends on admin PDFs that the current repo/runtime cannot OCR or rasterize.',
    '- Arizona should only reopen when district-owned education leaves and either reviewed AHCCCS admin HTML leaves or a committed OCR artifact supply the county-to-office contract.',
  ].join('\n') + '\n';
}

export function generateBatch145ArizonaOcrLaneGateRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_admin_mapping_artifact_missing',
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
          family_status: 'blocked_admin_mapping_artifact_missing',
          query_basis: 'Reviewed Arizona county-local blocker artifacts, AHCCCS partial-PDF results, and the current local OCR/PDF toolchain to distinguish source discovery from artifact-lane failure.',
          blocker_code: COUNTY_FAILURE_CODE,
          blocker_evidence: COUNTY_EVIDENCE,
          sample_count: row.samples.length,
          samples: row.samples.map((sample) => {
            if (sample.sample_name === 'County Admin Office PDF' || sample.sample_name === 'Pima County Admin PDF') {
              return {
                ...sample,
                evidence_snippet: `${sample.evidence_snippet} The current repo/runtime also lacks local OCR or PDF raster tools for a deterministic rescue pass.`,
              };
            }
            return sample;
          }),
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
    batch: 'batch_145_arizona_ocr_lane_gate_refresh_v1',
    generated_at: '2026-06-22T23:30:00.000Z',
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_family: 'county_local_disability_resources',
    ocr_tools_on_path: {
      tesseract: false,
      pdftotext: false,
      pdftoppm: false,
    },
    python_imports_available: {
      pytesseract: false,
      pdf2image: false,
      PIL: false,
    },
    altcs_county_map_partially_extractable: true,
    reviewed_admin_html_leaves_present: false,
    lesson_added: lessonAdded,
  });

  const batchReport = [
    '# Arizona OCR Lane Gate Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: county_local_disability_resources',
    `- failure_code: ${COUNTY_FAILURE_CODE}`,
    '',
    '## Evidence',
    '',
    '- Re-checked the Arizona AHCCCS county-local lane against the current local toolchain only. The official ALTCS office leaf and partial county-map extraction remain real, but the county-admin PDFs still do not yield reviewable county/admin mappings.',
    '- The current repo/runtime has no deterministic low-token OCR lane available: `tesseract`, `pdftotext`, and `pdftoppm` are absent on PATH, and `pytesseract`, `pdf2image`, and `PIL` are not importable.',
    '- That means more retries against the same PDFs would only churn the same blocker. The honest next lane is reviewed AHCCCS admin HTML leaves or a committed OCR artifact.',
    '',
    '## Repair decision',
    '',
    '- Arizona county-local routing is no longer described as a generic parser problem.',
    '- It is now explicitly blocked on a missing admin-mapping artifact plus no local OCR lane in the current repo/runtime.',
  ].join('\n') + '\n';

  fs.writeFileSync(OUTPUTS.report, batchReport);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch145ArizonaOcrLaneGateRefreshV1();
}
