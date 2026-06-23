import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'oklahoma_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'oklahoma_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'oklahoma_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'oklahoma_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'oklahoma_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'oklahoma-california-grade-audit-report-v2.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch200_oklahoma_first_party_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch200-oklahoma-first-party-repair-report-v1.md'),
};

const P_AND_A_EVIDENCE =
  'Reviewed 2026-06-23 first-party Oklahoma P&A candidate. `https://okdlc.org/` and `https://www.okdlc.org/` both return HTTP 200 and canonically redirect to `https://drok.org/`, where the first-party page preserves `Disability Rights Oklahoma (DROK) works statewide to protect and advance the rights of people with disabilities` plus direct contact information. That is sufficient statewide first-party protection-and-advocacy proof.';

const LEGAL_AID_EVIDENCE =
  'Reviewed 2026-06-23 first-party Oklahoma legal-aid candidate. `https://www.legalaidok.org/` returns HTTP 200 and canonically resolves to `https://legalaidok.org/`, where the first-party page preserves `Legal Aid Services of Oklahoma` and `Helping Oklahomans access legal information and representation when they need it most.` That is sufficient statewide first-party legal-aid proof.';

const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-23 bounded live Oklahoma education checks. The only live school-district source URL on disk is the state root `https://sde.ok.gov/`, and `https://sde.ok.gov/special-education` plus in-site search guesses for district directory and special education all return HTTP 200 only by collapsing to the same generic Oklahoma State Department of Education page at `https://oklahoma.gov/education.html?page=543`. No district-owned or county-grade routing leaf is verified from this bounded pass.';

const COUNTY_EVIDENCE =
  'Reviewed 2026-06-23 bounded live Oklahoma county-local checks. The current statewide locator source `https://dhhs.oklahoma.gov/locations` now fails DNS resolution, while the remaining county-office rows still split between that dead locator host and the DOI-hosted planning dataset. No live county-owned or state-maintained county office directory was verified in this bounded pass.';

const LESSON_HEADING =
  '### First-Party Rebrand Redirects Can Still Clear Statewide Support Families';
const LESSON_BODY =
  '*   **Lesson:** If a missing statewide support family uses an older first-party domain that now 301s to a renamed same-organization host, verify the destination page before discarding it. Oklahoma P&A cleared once `okdlc.org` was checked and shown to redirect to `drok.org` with explicit statewide disability-rights language.';

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
    '# Oklahoma California-Grade Audit Report v2',
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
    '- Oklahoma no longer lacks statewide first-party support proof for protection_and_advocacy or legal_aid.',
    '- Oklahoma still cannot reach California-grade or become index-safe because district or county education routing still has no district-owned leaf beyond a generic state page collapse, and county/local disability resources still have no live county-grade directory after the DHHS locator host failed DNS resolution.',
    '- Oklahoma therefore remains BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch200OklahomaFirstPartyRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Disability Rights Oklahoma evidence preserves statewide disability-rights and advocacy identity',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Legal Aid Services of Oklahoma evidence preserves statewide legal-aid identity and Oklahoma-specific help language',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_generic_state_page_collapse',
        status_reason: 'the only live Oklahoma education leaf guess collapses back to a generic state education page instead of a district-owned or county-grade routing leaf',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_dead_statewide_locator_and_planning_rows',
        status_reason: 'the current statewide DHHS locations host fails DNS and the remaining county rows still depend on dead-locator or DOI planning evidence',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => !['protection_and_advocacy', 'legal_aid'].includes(row.family))
    .map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return {
          ...row,
          failure_code: 'education_leaf_guesses_collapse_to_generic_state_page',
          evidence: EDUCATION_EVIDENCE,
          next_action: 'hold_blocked_until_new_exact_district_or_county_education_leaves_are_authored',
        };
      }
      if (row.family === 'county_local_disability_resources') {
        return {
          ...row,
          failure_code: 'dead_dhhs_locator_host_plus_doi_planning_rows',
          evidence: COUNTY_EVIDENCE,
          next_action: 'hold_blocked_until_new_live_county_grade_directory_or_county_owned_leaves_are_verified',
        };
      }
      return row;
    });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed first-party Oklahoma P&A host and redirect path.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Oklahoma (DROK)',
            source_url: 'https://okdlc.org/',
            final_url: 'https://drok.org/',
            verification_status: 'reviewed',
            source_type: 'first_party_redirect_verified',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'Disability Rights Oklahoma (DROK) works statewide to protect and advance the rights of people with disabilities.',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed first-party Oklahoma legal-aid host and canonical destination.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Legal Aid Services of Oklahoma',
            source_url: 'https://www.legalaidok.org/',
            final_url: 'https://legalaidok.org/',
            verification_status: 'reviewed',
            source_type: 'first_party',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'Helping Oklahomans access legal information and representation when they need it most.',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_generic_state_page_collapse',
        query_basis: 'Reviewed live `sde.ok.gov/special-education` and bounded search guesses against the Oklahoma education host.',
        blocker_code: 'education_leaf_guesses_collapse_to_generic_state_page',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_dead_statewide_locator_and_planning_rows',
        query_basis: 'Reviewed live Oklahoma DHHS locations host against the existing county-office source split.',
        blocker_code: 'dead_dhhs_locator_host_plus_doi_planning_rows',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows
    .filter((row) => !['protection_and_advocacy', 'legal_aid'].includes(row.family))
    .map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return {
          ...row,
          failure_code: 'education_leaf_guesses_collapse_to_generic_state_page',
          next_action: 'hold_blocked_until_new_exact_district_or_county_education_leaves_are_authored',
          evidence: EDUCATION_EVIDENCE,
        };
      }
      if (row.family === 'county_local_disability_resources') {
        return {
          ...row,
          failure_code: 'dead_dhhs_locator_host_plus_doi_planning_rows',
          next_action: 'hold_blocked_until_new_live_county_grade_directory_or_county_owned_leaves_are_verified',
          evidence: COUNTY_EVIDENCE,
        };
      }
      return row;
    });

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    primary_gap_reason: 'generic_state_education_page_collapse_and_dead_dhhs_locator_host',
    critical_gap_families: [
      'district_or_county_education_routing',
      'county_local_disability_resources',
    ],
    major_gap_families: [],
    complete_ready: false,
    final_blockers: updatedFailureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };

  const updatedQueueRows = queueRows.map((row) => row.state === 'oklahoma'
    ? {
        ...row,
        classification: 'BLOCKED',
        index_safe: false,
        completeness_pct: 83,
        missing_critical_families: 0,
        weak_critical_families: 2,
        primary_gap_reason: 'generic_state_education_page_collapse_and_dead_dhhs_locator_host',
      }
    : row);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  const batchSummary = {
    batch: 'batch200_oklahoma_first_party_repair_v1',
    state: 'oklahoma',
    classification_after: updatedSummary.classification,
    index_safe_after: updatedSummary.index_safe,
    p_and_a_promoted: true,
    legal_aid_promoted: true,
    remaining_critical_blockers: updatedSummary.critical_gap_families,
    lesson_added: lessonAdded,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  fs.writeFileSync(INPUTS.report, report);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch200OklahomaFirstPartyRepairV1();
}
