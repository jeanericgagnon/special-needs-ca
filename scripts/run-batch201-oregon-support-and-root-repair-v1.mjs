import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'oregon_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'oregon_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'oregon_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'oregon_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'oregon_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'oregon-california-grade-audit-report-v2.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch201_oregon_support_and_root_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch201-oregon-support-and-root-repair-report-v1.md'),
};

const PTI_EVIDENCE =
  'Reviewed 2026-06-23 authoritative Parent Center Hub Oregon leaf plus matching FACT Oregon first-party host. `https://www.parentcenterhub.org/findurcenter/oregon/` returns HTTP 200 and explicitly preserves `Oregon PTI Family and Community Together (FACT)` with Clackamas address, phone, email, and `http://factoregon.org/`. FACT Oregon itself also returns HTTP 200 on `https://factoregon.org/`, so statewide PTI designation is now preserved by an authoritative statewide leaf tied to the live first-party domain.';

const LEGAL_AID_EVIDENCE =
  'Reviewed 2026-06-23 first-party Oregon legal-aid host. `https://oregonlawcenter.org/` returns HTTP 200 and preserves `Oregon Law Center (OLC) provides free legal help to people struggling to make ends meet` plus a statewide hotline/office structure, which is sufficient authoritative statewide legal-aid proof.';

const EDUCATION_EVIDENCE =
  'Reviewed 2026-06-23 bounded live Oregon education checks plus current DB inventory. `https://www.oregon.gov/ode/students-and-family/specialeducation/pages/default.aspx` is live and role-pure for statewide Special Education, but it remains a generic state page. A bounded DB check still shows all 36 Oregon school_district rows sharing the same root source URL `https://www.oregon.gov/ode` and no district-owned or county-grade special-education leaves on disk. Oregon therefore still lacks a district routing contract.';

const COUNTY_EVIDENCE =
  'Reviewed 2026-06-23 bounded live Oregon county-local checks. The old `https://dhhs.oregon.gov/locations` host now fails DNS resolution, but the live successor root `https://www.oregon.gov/odhs/pages/office-finder.aspx` returns HTTP 200 only as a generic `Find an Office` page with no preserved county list or office extract in static HTML. A bounded DB check also shows current Oregon county-office rows split between 61 DOI-backed planning rows and only 3 dead `dhhs.oregon.gov/locations` rows. No reviewed county-grade office contract is preserved on disk.';

const LESSON_HEADING =
  '### A Live Successor Office-Finder Root Still Fails Closed Without A County Contract';
const LESSON_BODY =
  '*   **Lesson:** If a dead legacy county-office host has a live successor root on the official state domain, verify whether the replacement actually preserves a county list or office extract before upgrading the family. Oregon ODHS had a live `Find an Office` page, but its static HTML still exposed no county contract, so the county-local family stayed blocked.';

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
    '# Oregon California-Grade Audit Report v2',
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
    '- Oregon no longer lacks statewide PTI or statewide legal-aid evidence on disk.',
    '- Oregon still cannot reach California-grade or become index-safe because district or county education routing still has no district-owned routing contract, and county/local disability resources still have no preserved county-grade office contract from the live ODHS office-finder root.',
    '- Oregon therefore remains BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch201OregonSupportAndRootRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'authoritative Oregon PTI designation is preserved on the Parent Center Hub Oregon leaf and tied to the live FACT Oregon first-party host',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party Oregon Law Center evidence preserves statewide legal-aid identity and help scope',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_state_special_education_root_without_district_contract',
        status_reason: 'the live Oregon special-education stack is role-pure but still exposes only statewide state pages, while all 36 school_district rows still share the same statewide ODE root',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_office_finder_root_without_county_extract',
        status_reason: 'the live ODHS office-finder root exists, but static evidence still exposes no county list or office extract and current county rows remain DOI-backed or dead-host placeholders',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => !['parent_training_information_center', 'legal_aid'].includes(row.family))
    .map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return {
          ...row,
          failure_code: 'live_state_special_education_root_without_district_contract',
          evidence: EDUCATION_EVIDENCE,
          next_action: 'hold_blocked_until_district_owned_or_county_grade_education_leaves_are_authored',
        };
      }
      if (row.family === 'county_local_disability_resources') {
        return {
          ...row,
          failure_code: 'live_office_finder_root_without_county_extract',
          evidence: COUNTY_EVIDENCE,
          next_action: 'hold_blocked_until_county_grade_office_contract_is_extracted_from_live_office_finder_or_county_owned_leaves',
        };
      }
      return row;
    });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed authoritative Parent Center Hub Oregon leaf and matching FACT Oregon first-party host.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Parent Center Hub Oregon PTI listing',
            source_url: 'https://www.parentcenterhub.org/findurcenter/oregon/',
            final_url: 'https://www.parentcenterhub.org/findurcenter/oregon/',
            verification_status: 'reviewed',
            source_type: 'authoritative_state_leaf',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'Oregon PTI. Family and Community Together (FACT). 13455 SE 97th Avenue Clackamas, OR 97015. (503) 786-6082 | (888) 988-3228. info@factoregon.org. http://factoregon.org/.',
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
        query_basis: 'Reviewed first-party Oregon legal-aid host with statewide help scope and office structure.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Oregon Law Center',
            source_url: 'https://oregonlawcenter.org/',
            final_url: 'https://oregonlawcenter.org/',
            verification_status: 'reviewed',
            source_type: 'first_party',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'Oregon Law Center (OLC) provides free legal help to people struggling to make ends meet and preserves statewide hotline and office help structure.',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_state_special_education_root_without_district_contract',
        query_basis: 'Reviewed live Oregon ODE special-education page and bounded school_district root inventory.',
        blocker_code: 'live_state_special_education_root_without_district_contract',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_office_finder_root_without_county_extract',
        query_basis: 'Reviewed live ODHS office-finder successor root against current county-office source split.',
        blocker_code: 'live_office_finder_root_without_county_extract',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows
    .filter((row) => !['parent_training_information_center', 'legal_aid'].includes(row.family))
    .map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return {
          ...row,
          failure_code: 'live_state_special_education_root_without_district_contract',
          next_action: 'hold_blocked_until_district_owned_or_county_grade_education_leaves_are_authored',
          evidence: EDUCATION_EVIDENCE,
        };
      }
      if (row.family === 'county_local_disability_resources') {
        return {
          ...row,
          failure_code: 'live_office_finder_root_without_county_extract',
          next_action: 'hold_blocked_until_county_grade_office_contract_is_extracted_from_live_office_finder_or_county_owned_leaves',
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
    primary_gap_reason: 'live_state_special_education_root_without_district_contract_and_live_office_finder_root_without_county_extract',
    critical_gap_families: ['district_or_county_education_routing', 'county_local_disability_resources'],
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

  const updatedQueueRows = queueRows.map((row) => row.state === 'oregon'
    ? {
        ...row,
        classification: 'BLOCKED',
        index_safe: false,
        completeness_pct: 83,
        missing_critical_families: 0,
        weak_critical_families: 2,
        primary_gap_reason: 'live_state_special_education_root_without_district_contract_and_live_office_finder_root_without_county_extract',
      }
    : row);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  const batchSummary = {
    batch: 'batch201_oregon_support_and_root_repair_v1',
    state: 'oregon',
    classification_after: updatedSummary.classification,
    index_safe_after: updatedSummary.index_safe,
    pti_promoted: true,
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
  generateBatch201OregonSupportAndRootRepairV1();
}
