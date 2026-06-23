import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'mississippi_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'mississippi_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'mississippi_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'mississippi_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'mississippi_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch162_mississippi_first-party_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch162-mississippi-first-party-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'mississippi-california-grade-audit-report-v2.md'),
};

const EDUCATION_BLOCKER = 'mdek12_local_directory_paths_return_403';
const PA_REASON = 'Reviewed 2026-06-22 the dedicated first-party DRMS about page over the live HTTP endpoint. It explicitly identifies Disability Rights Mississippi as Mississippi’s Protection & Advocacy agency, says it has a federal mandate to protect and advocate for people with disabilities across Mississippi, and explains that every state has a congressionally mandated P&A agency. That is enough to verify protection_and_advocacy at statewide grade.';
const COUNTY_REASON = 'Reviewed 2026-06-22 the official Mississippi DHS contact page. The live page embeds a county-office table directly in HTML with 82 unique Mississippi county names plus office addresses, emails, and client phone numbers, so county_local_disability_resources now passes at county grade from the first-party contact root itself.';

const PA_SAMPLES = [
  {
    sample_name: 'Disability Rights Mississippi About DRMS',
    source_url: 'http://www.drms.ms/about',
    final_url: 'http://www.drms.ms/about',
    verification_status: 'official_verified',
    source_type: 'first_party_p_and_a_designation_page',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The About DRMS page says Disability Rights Mississippi is Mississippi’s Protection & Advocacy agency and has a federal mandate to protect and advocate for the rights of individuals with disabilities across Mississippi.',
  },
  {
    sample_name: 'Disability Rights Mississippi homepage',
    source_url: 'http://www.drms.ms/',
    final_url: 'http://www.drms.ms/',
    verification_status: 'official_verified',
    source_type: 'first_party_disability_rights_homepage',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The live first-party DRMS homepage proves the likely P&A domain is reachable over HTTP even though HTTPS bounded fetches failed TLS handshake.',
  },
];

const COUNTY_SAMPLES = [
  {
    sample_name: 'Mississippi DHS Contact Root',
    source_url: 'https://www.mdhs.ms.gov/contact/',
    final_url: 'https://www.mdhs.ms.gov/contact/',
    verification_status: 'official_verified',
    source_type: 'official_contact_root_with_county_table',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The live MDHS contact page embeds a County Offices table directly in HTML with site name, physical address, contact email, and client contact phone number columns.',
  },
  {
    sample_name: 'Mississippi DHS county table coverage',
    source_url: 'https://www.mdhs.ms.gov/contact/',
    final_url: 'https://www.mdhs.ms.gov/contact/',
    verification_status: 'official_verified',
    source_type: 'official_county_coverage_summary',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'Bounded review of the first-party county-office table preserved 82 unique county names, with branch duplicates such as Bolivar and Monroe but statewide county coverage intact.',
  },
  {
    sample_name: 'Mississippi DHS county table examples',
    source_url: 'https://www.mdhs.ms.gov/contact/',
    final_url: 'https://www.mdhs.ms.gov/contact/',
    verification_status: 'official_verified',
    source_type: 'official_county_examples',
    source_table: 'reviewed_live_probe',
    fetched_at: '2026-06-22T00:00:00.000Z',
    evidence_snippet: 'The first-party county table visibly lists county offices ranging from Adams County Office and Alcorn County Office through Washington County Office, Wilkinson County Office, and Yazoo County Office.',
  },
];

const LESSON_HEADING_HTTP = '### If HTTPS Fails On A First-Party Rights Site, Try The Same Host Over Plain HTTP Before Giving Up';
const LESSON_BODY_HTTP = '*   **Lesson:** If a likely first-party disability-rights domain dies at TLS handshake, probe the same host over plain `http://` before treating the organization as unavailable. Mississippi’s DRMS site failed HTTPS in bounded fetches but the first-party HTTP about page preserved the explicit Protection & Advocacy designation text we needed.';

const LESSON_HEADING_CONTACT = '### Contact Pages Can Hide Full County-Office Tables In Plain HTML';
const LESSON_BODY_CONTACT = '*   **Lesson:** If guessed `/locations/` or county-office subpaths 404, inspect the official contact page itself before assuming the county contract is missing. Mississippi MDHS published all 82 county offices directly in the contact-page HTML table with address, email, and phone fields, which was enough for county-grade routing without any deeper directory path.';

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

function appendLessonIfMissing(filePath, heading, body) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(heading)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${heading}\n${body}\n`);
  return true;
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Mississippi California-Grade Audit Report v2',
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
    '- Protection and advocacy is now repaired through the first-party DRMS about page, which explicitly preserves Mississippi’s Protection & Advocacy designation and federal mandate language.',
    '- County/local disability resources now pass at county grade because the official MDHS contact root itself publishes the statewide county-office table directly in HTML.',
    '- Legal aid remains verified through Mississippi Center for Justice and is no longer carried as a summary-only blocker.',
    '- Mississippi remains `BLOCKED` and `index_safe=false` because district or county education routing still depends on statewide fallback evidence while the likely local MDEK12 directory lanes return HTTP 403 in bounded low-token mode.',
  ].join('\n') + '\n';
}

export function generateBatch162MississippiFirstPartyRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return { ...row, family_status: 'verified_state_grade', status_reason: PA_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'verified_county_grade', status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => !['protection_and_advocacy', 'county_local_disability_resources'].includes(row.family));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: PA_SAMPLES.length,
        query_basis: 'Reviewed 2026-06-22 the live first-party DRMS about page over HTTP plus the homepage fallback.',
        blocker_code: null,
        blocker_evidence: null,
        samples: PA_SAMPLES,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        evidence_strength: 'strong',
        sample_count: COUNTY_SAMPLES.length,
        query_basis: 'Reviewed 2026-06-22 the official Mississippi DHS contact page and its embedded county-office table.',
        blocker_code: null,
        blocker_evidence: null,
        samples: COUNTY_SAMPLES,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows
    .filter((row) => !['protection_and_advocacy', 'county_local_disability_resources'].includes(row.family))
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: EDUCATION_BLOCKER,
    critical_gap_families: ['district_or_county_education_routing'],
    major_gap_families: [],
    verified_source_families_with_samples: Array.from(new Set([
      ...summary.verified_source_families_with_samples,
      'protection_and_advocacy',
      'legal_aid',
      'county_local_disability_resources',
    ])),
    final_blockers: summary.final_blockers.filter((row) => !['protection_and_advocacy', 'county_local_disability_resources', 'legal_aid'].includes(row.family)),
    complete_ready: false,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonAddedHttp = appendLessonIfMissing(INPUTS.lessons, LESSON_HEADING_HTTP, LESSON_BODY_HTTP);
  const lessonAddedContact = appendLessonIfMissing(INPUTS.lessons, LESSON_HEADING_CONTACT, LESSON_BODY_CONTACT);
  const batchSummary = {
    state: 'mississippi',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_families: ['protection_and_advocacy', 'county_local_disability_resources'],
    removed_summary_only_blocker: 'legal_aid',
    remaining_final_blockers: updatedSummary.final_blockers.map((row) => row.family),
    lesson_added_http: lessonAddedHttp,
    lesson_added_contact: lessonAddedContact,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 162 Mississippi First-Party Repair Report v1',
      '',
      'This pass does not broaden Mississippi discovery. It repairs two families directly from first-party evidence: DRMS over HTTP for the statewide Protection & Advocacy designation, and the MDHS contact root for the full county-office contract.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- repaired_families: protection_and_advocacy, county_local_disability_resources',
      '- removed_summary_only_blocker: legal_aid',
      `- remaining_final_blockers: ${updatedSummary.final_blockers.map((row) => row.family).join(', ')}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch162MississippiFirstPartyRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
