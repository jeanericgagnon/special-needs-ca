import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-jersey_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-jersey_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'new-jersey_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-jersey_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'new-jersey_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch176_new_jersey_county_directory_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch176-new-jersey-county-directory-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'new-jersey-california-grade-audit-report-v2.md'),
};

const PANDA_FAILURE =
  'official_drnj_first_party_domains_unknown_or_challenge_blocked';
const PANDA_REASON =
  'Reviewed 2026-06-23 bounded first-party probes for New Jersey protection and advocacy. `drnj.org` and `www.drnj.org` return Flywheel `Unknown Domain`, while `disabilityrightsnj.org` serves a Cloudflare `Just a moment...` challenge in bounded fetch. New Jersey therefore still lacks a publicly reviewable first-party DRNJ artifact on disk.';
const PANDA_NEXT =
  'hold_blocked_until_public_drnj_first_party_page_is_reviewable';

const LESSON_HEADING =
  '### One Official State Directory Page Can Clear Every County';
const LESSON_BODY =
  '*   **Lesson:** If the official state root links one maintained county directory page that explicitly enumerates every county and preserves county-owned leaves or county contact details in the HTML, use that page as the county-grade contract. New Jersey cleared both education routing and county social-services routing from two reviewed official state pages without county-by-county rediscovery.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# New Jersey California-Grade County Directory Repair v2',
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
    '- New Jersey remains `BLOCKED` and `index_safe=false`.',
    '- The critical county-grade blockers are repaired: the official NJDOE County Offices of Education page and the official DHS County Social Service Agencies page both preserve all 21 counties with county-specific routing evidence on disk.',
    '- Statewide legal aid is now verified from live first-party LSNJ pages, including the free statewide hotline.',
    '- New Jersey still cannot become index-safe because the statewide protection-and-advocacy lane lacks a publicly reviewable first-party DRNJ page: the legacy domains fail and the current disabilityrightsnj.org host serves a challenge shell in bounded fetch.',
  ].join('\n') + '\n';
}

export function generateBatch176NewJerseyCountyDirectoryRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'the official NJDOE County Offices of Education page enumerates all 21 counties and links county-owned office leaves with county superintendent routing details',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party LSNJ pages preserve statewide free civil legal aid and the LSNJLAW hotline for New Jersey residents',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'the official DHS County Social Service Agencies page enumerates all 21 counties and preserves county agency addresses, phones, hours, and county-owned leaves',
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'blocked_first_party_drnj_domains_not_publicly_reviewable',
        status_reason: PANDA_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => !['district_or_county_education_routing', 'legal_aid', 'county_local_disability_resources'].includes(row.family))
    .map((row) => {
      if (row.family !== 'protection_and_advocacy') return row;
      return {
        ...row,
        severity: 'critical',
        failure_code: PANDA_FAILURE,
        evidence: PANDA_REASON,
        next_action: PANDA_NEXT,
      };
    });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        query_basis: 'Reviewed 2026-06-23 the official New Jersey DOE home page plus the County Offices of Education directory page.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 4,
        samples: [
          {
            sample_name: 'NJDOE home page',
            source_url: 'https://www.nj.gov/education/',
            final_url: 'https://www.nj.gov/education/',
            verification_status: 'reviewed',
            source_type: 'official_state_root_linking_county_directory',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official NJDOE home page links County Offices of Education and the New Jersey School Directory.',
          },
          {
            sample_name: 'County Offices of Education',
            source_url: 'https://www.nj.gov/education/about/counties',
            final_url: 'https://www.nj.gov/education/about/counties/',
            verification_status: 'reviewed',
            source_type: 'official_county_directory',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official County Offices of Education page explicitly names all 21 New Jersey counties and preserves executive county superintendent routing details.',
          },
          {
            sample_name: 'Atlantic County Office of Education',
            source_url: 'https://www.atlantic-county.org/education/',
            verification_status: 'reviewed',
            source_type: 'county_owned_superintendent_leaf',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'Atlantic County Office of Education is linked directly from the official NJDOE county directory.',
          },
          {
            sample_name: 'Middlesex County Office of Education',
            source_url: 'https://www.middlesexcountynj.gov/government/departments/department-of-economic-development/superintendent-of-schools',
            verification_status: 'reviewed',
            source_type: 'county_owned_superintendent_leaf',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'Middlesex County Office of Education appears as one of the county-specific superintendent leaves on the official NJDOE directory page.',
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        query_basis: 'Reviewed 2026-06-23 first-party Legal Services of New Jersey pages for statewide civil legal aid and hotline intake.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 2,
        samples: [
          {
            sample_name: 'Legal Services of New Jersey',
            source_url: 'https://www.lsnj.org/',
            final_url: 'https://www.lsnj.org/',
            verification_status: 'reviewed',
            source_type: 'first_party_statewide_legal_aid_home',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'Legal Services of New Jersey provides free legal help to low-income New Jerseyans and publishes legal education resources.',
          },
          {
            sample_name: 'LSNJ Statewide Hotline',
            source_url: 'https://www.lsnj.org/get-legal-help/free-lsnjlaw-hotline',
            final_url: 'https://www.lsnj.org/get-legal-help/free-lsnjlaw-hotline',
            verification_status: 'reviewed',
            source_type: 'first_party_statewide_hotline',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The free LSNJLAW Hotline provides free legal advice, information, and referrals to low-income New Jersey residents in civil legal matters.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        query_basis: 'Reviewed 2026-06-23 the official DHS Division of Family Development page plus the County Social Service Agencies directory page.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 4,
        samples: [
          {
            sample_name: 'Division of Family Development',
            source_url: 'https://www.nj.gov/humanservices/dfd/',
            final_url: 'https://www.nj.gov/humanservices/dfd/',
            verification_status: 'reviewed',
            source_type: 'official_state_root_linking_county_directory',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official Division of Family Development page links County Social Service Agencies from the statewide Social Services landing page.',
          },
          {
            sample_name: 'County Social Service Agencies',
            source_url: 'https://www.nj.gov/humanservices/dfd/counties',
            final_url: 'https://www.nj.gov/humanservices/dfd/counties/',
            verification_status: 'reviewed',
            source_type: 'official_county_directory',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official County Social Service Agencies page explicitly names all 21 New Jersey counties and preserves county agency addresses, phones, hours, and county-owned leaves.',
          },
          {
            sample_name: 'Bergen County Board of Social Services',
            source_url: 'https://bcbss.com/',
            verification_status: 'reviewed',
            source_type: 'county_owned_social_services_leaf',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'Bergen County Board of Social Services appears on the official county agencies page as the county-owned local routing leaf.',
          },
          {
            sample_name: 'Cape May County Department of Social Services',
            source_url: 'https://capemaycountynj.gov/984/Cape-May-County-Social-Services',
            verification_status: 'reviewed',
            source_type: 'county_owned_social_services_leaf',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'Cape May County Department of Social Services appears on the official county agencies page with county-specific address and phone routing.',
          },
        ],
      };
    }
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'blocked_first_party_drnj_domains_not_publicly_reviewable',
        evidence_strength: 'weak',
        query_basis: 'Reviewed 2026-06-23 first-party Disability Rights New Jersey domain variants and the current disabilityrightsnj.org host.',
        blocker_code: PANDA_FAILURE,
        blocker_evidence: PANDA_REASON,
        sample_count: 3,
        samples: [
          {
            sample_name: 'drnj.org',
            source_url: 'http://drnj.org/',
            final_url: 'http://drnj.org/',
            verification_status: 'blocked',
            source_type: 'first_party_unknown_domain',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The legacy DRNJ root returns a Flywheel Unknown Domain page instead of Disability Rights New Jersey content.',
          },
          {
            sample_name: 'www.drnj.org',
            source_url: 'http://www.drnj.org/',
            final_url: 'http://www.drnj.org/',
            verification_status: 'blocked',
            source_type: 'first_party_unknown_domain',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The www.drnj.org variant also returns a Flywheel Unknown Domain page.',
          },
          {
            sample_name: 'disabilityrightsnj.org',
            source_url: 'https://disabilityrightsnj.org/',
            final_url: 'https://disabilityrightsnj.org/',
            verification_status: 'blocked',
            source_type: 'first_party_challenge_shell',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The current Disability Rights New Jersey host serves a Cloudflare Just a moment challenge shell in bounded fetch, so no reviewable first-party P&A evidence is preserved on disk yet.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows
    .filter((row) => !['district_or_county_education_routing', 'legal_aid', 'county_local_disability_resources'].includes(row.family))
    .map((row) => {
      if (row.family !== 'protection_and_advocacy') return row;
      return {
        ...row,
        priority_rank: 1,
        severity: 'critical',
        failure_code: PANDA_FAILURE,
        next_action: PANDA_NEXT,
        evidence: PANDA_REASON,
      };
    });

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: 'first_party_drnj_domains_not_publicly_reviewable',
    critical_gap_families: ['protection_and_advocacy'],
    major_gap_families: [],
    complete_ready: false,
    final_blockers: [
      {
        family: 'protection_and_advocacy',
        severity: 'critical',
        failure_code: PANDA_FAILURE,
        evidence: PANDA_REASON,
        next_action: PANDA_NEXT,
      },
    ],
  };

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch176_new_jersey_county_directory_repair_v1',
    state: 'new-jersey',
    classification_before: summary.classification,
    classification_after: updatedSummary.classification,
    repaired_families: ['district_or_county_education_routing', 'legal_aid', 'county_local_disability_resources'],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    county_directory_count: 21,
    lesson_added: lessonAdded,
  };

  const report = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, report);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  return {
    classification: updatedSummary.classification,
    batchSummary,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch176NewJerseyCountyDirectoryRepairV1();
}
