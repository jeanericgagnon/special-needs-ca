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
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch183_kansas_uniform_serve_403_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch183-kansas-uniform-serve-403-refinement-report-v1.md'),
};

const DD_STATUS_REASON = 'Kansas now has a transport-final DD blocker. A browser-style client still gets the same tiny official `Access Denied` shell on the KDADS root, the exact developmental-disabilities leaf, robots.txt, the KanCare root, and the exact KanCare HCBS fact-sheet leaf. The blocker is no longer a discovery problem; it is a uniform host-stack denial pattern with no public raw-fetch opening on the official DD surfaces.';

const DD_EVIDENCE = 'Reviewed 2026-06-23 bounded live official Kansas DD probes with a browser-style client on https://www.kdads.ks.gov/, https://www.kdads.ks.gov/services/developmental-disabilities, https://www.kdads.ks.gov/robots.txt, https://www.kancare.ks.gov/, and https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000. Every exact official root and leaf still returned HTTP 403 with the same tiny `Access Denied` HTML shell (roughly 412-476 bytes) and a pseudo-path containing `$(SERVE_403)` rather than role-bearing content. That same denial pattern now holds on the site root, the exact DD leaf, robots.txt, the KanCare root, and the HCBS fact-sheet leaf even under a browser-style fetch contract. Kansas therefore still lacks any publicly raw-fetch-reviewable official DD authority surface, and the blocker should stay classified as a uniform transport denial rather than a content-discovery gap.';

const LESSON_HEADING = '### Tiny Access-Denied Shells Across Root, Leaf, And Robots Mean Host-Stack Blocking';
const LESSON_BODY = '*   **Lesson:** If the official root, exact role leaf, and `robots.txt` all return the same tiny `Access Denied` HTML with a `$(SERVE_403)` pseudo-path, treat the host as uniformly transport-blocked and stop probing sibling content URLs. Kansas’ KDADS and KanCare DD stack stayed blocked even with a browser-style client, so more low-token content discovery on those hosts would just churn.';

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
    '- County-local routing is already complete on the official ombudsman county directory, but the DD authority stack is now proven to be uniformly transport-blocked rather than merely under-discovered.',
    '- Education still lacks a county-to-district or district-owned special-education contract on disk, so Kansas cannot become COMPLETE yet.',
  ].join('\n') + '\n';
}

export function generateBatch183KansasUniformServe403RefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? { ...row, status_reason: DD_STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
          ...row,
          failure_code: 'uniform_tiny_serve_403_shell_on_kdads_and_kancare_dd_stack',
          evidence: DD_EVIDENCE,
          next_action: 'keep_kansas_dd_blocked_until_browser_review_or_alternate_official_dd_leaf_exists_outside_uniform_serve_403_hosts',
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'developmental_disability_idd_authority') return row;
    return {
      ...row,
      family_status: 'blocked_uniform_tiny_serve_403_shell_on_dd_stack',
      blocker_code: 'uniform_tiny_serve_403_shell_on_kdads_and_kancare_dd_stack',
      blocker_evidence: DD_EVIDENCE,
      query_basis: 'Reviewed bounded live official Kansas DD probes with a browser-style client across root, exact leaf, robots.txt, and the KanCare companion host.',
      samples: [
        {
          sample_name: 'KDADS root access-denied shell',
          source_url: 'https://www.kdads.ks.gov/',
          final_url: 'https://www.kdads.ks.gov/',
          verification_status: 'blocked',
          source_type: 'official_uniform_access_denied_shell',
          source_table: 'batch183_kansas_uniform_serve_403_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The official KDADS root returned HTTP 403 with a tiny `Access Denied` shell whose body points to a `$(SERVE_403)` pseudo-path instead of role-bearing content.',
        },
        {
          sample_name: 'KDADS developmental-disabilities leaf access-denied shell',
          source_url: 'https://www.kdads.ks.gov/services/developmental-disabilities',
          final_url: 'https://www.kdads.ks.gov/services/developmental-disabilities',
          verification_status: 'blocked',
          source_type: 'official_uniform_access_denied_shell',
          source_table: 'batch183_kansas_uniform_serve_403_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The exact developmental-disabilities leaf returned the same tiny `Access Denied` shell and `$(SERVE_403)` pseudo-path as the KDADS root.',
        },
        {
          sample_name: 'KanCare HCBS fact-sheet leaf access-denied shell',
          source_url: 'https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000',
          final_url: 'https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000',
          verification_status: 'blocked',
          source_type: 'official_uniform_access_denied_shell',
          source_table: 'batch183_kansas_uniform_serve_403_refinement',
          fetched_at: '2026-06-23T00:00:00.000Z',
          evidence_snippet: 'The exact KanCare DD fact-sheet leaf also returned HTTP 403 with the same tiny `Access Denied` shell, showing the denial pattern is uniform across both official hosts.',
        },
      ],
      sample_count: 3,
    };
  });

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'developmental_disability_idd_authority'
      ? {
          ...row,
          failure_code: 'uniform_tiny_serve_403_shell_on_kdads_and_kancare_dd_stack',
          next_action: 'keep_kansas_dd_blocked_until_browser_review_or_alternate_official_dd_leaf_exists_outside_uniform_serve_403_hosts',
          evidence: DD_EVIDENCE,
        }
      : row
  ));

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'kansas_dd_stack_is_uniformly_transport_blocked_and_live_ksde_directory_roots_still_lack_local_contract',
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'developmental_disability_idd_authority'
        ? {
            ...row,
            failure_code: 'uniform_tiny_serve_403_shell_on_kdads_and_kancare_dd_stack',
            evidence: DD_EVIDENCE,
            next_action: 'keep_kansas_dd_blocked_until_browser_review_or_alternate_official_dd_leaf_exists_outside_uniform_serve_403_hosts',
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_183_kansas_uniform_serve_403_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    kdads_root_status: 403,
    dd_leaf_status: 403,
    robots_status: 403,
    kancare_root_status: 403,
    kancare_leaf_status: 403,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 183 Kansas Uniform SERVE_403 Refinement Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: developmental_disability_idd_authority',
    '- failure_code: uniform_tiny_serve_403_shell_on_kdads_and_kancare_dd_stack',
    '',
    '## Evidence',
    '',
    `- ${DD_EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Kansas remains blocked and not index-safe.',
    '- The DD lane is now sharper in a reusable way: both official hosts return the same tiny `Access Denied` shell across root, exact leaf, and robots.',
    '- The blocker should stay classified as transport-blocked until browser review or an alternate official DD surface exists outside those hosts.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch183KansasUniformServe403RefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
