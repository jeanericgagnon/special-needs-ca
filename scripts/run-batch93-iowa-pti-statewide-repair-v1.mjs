import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'iowa_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'iowa_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'iowa_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'iowa_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'iowa_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch93_iowa_pti_statewide_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch93-iowa-pti-statewide-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'iowa-california-grade-audit-report-v2.md'),
};

const IOWA_PTI_URL = 'https://www.askresource.org/about/what-ASK-does-do/parent-training-and-information-center-ptic';

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

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': 'Ablefull Codex Iowa PTI repair' },
      signal: controller.signal,
      redirect: 'follow',
    });
    const html = await response.text();
    return {
      status: response.status,
      finalUrl: response.url,
      contentType: response.headers.get('content-type') || '',
      html,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function assertIncludes(text, pattern, label) {
  if (!text.toLowerCase().includes(pattern.toLowerCase())) {
    throw new Error(`Expected ${label} to include "${pattern}".`);
  }
}

export function extractIowaPtiEvidence(html) {
  const text = htmlToText(html);
  const patterns = [
    /ASK Resource Center has been Iowa.?s Parent.{0,80}\(PTIC or PTI\) since 1998/i,
    /Iowa has only one PTI,? and we operate statewide/i,
    /The PTI is a federally funded project of the U\.S\. Department of Education/i,
  ];
  for (const pattern of patterns) {
    if (!pattern.test(text)) {
      throw new Error(`Expected Iowa ASK PTI leaf to match ${pattern}.`);
    }
  }
  return {
    titleSnippet: 'ASK Resource Center Parent Training and Information Center (PTIC)',
    evidenceSnippet: 'ASK Resource Center has been Iowa’s Parent and Training Information Center (PTIC or PTI) since 1998. Iowa has only one PTI, and we operate statewide. The PTI is a federally funded project of the U.S. Department of Education.',
  };
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Iowa California-Grade Truth Refresh v2',
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
    '- Iowa is no longer UNSTARTED. The statewide packet has been truth-refreshed onto live replatformed Iowa HHS and Education leaves plus reviewed first-party statewide support evidence.',
    '- County-local upgrade: the reviewed Iowa HHS Office Locations page itself preserves structured county coverage directly in HTML, including county office entries like Adair County HHS, Adams County HHS, and Polk County HHS, so one official leaf now truthfully satisfies statewide county-local routing coverage.',
    '- VR upgrade: the legacy `ivrs.iowa.gov` root now redirects to the live Iowa Workforce Development page `workforce.iowa.gov/vr`, which explicitly provides Vocational Rehabilitation Services.',
    '- PTI upgrade: the first-party ASK PTIC leaf now explicitly states that ASK Resource Center has been Iowa’s PTIC since 1998, that Iowa has only one PTI, and that it operates statewide with U.S. Department of Education support.',
    '- Iowa remains BLOCKED and not index-safe because district_or_county_education_routing still lacks any reviewed district-owned or county-grade special-education routing leaf on disk.',
  ].join('\n') + '\n';
}

export async function generateBatch93IowaPtiStatewideRepairV1(customFetch = fetchHtml) {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const ptiFetch = await customFetch(IOWA_PTI_URL);
  if (ptiFetch.status !== 200) {
    throw new Error(`Iowa PTI leaf fetch failed with status ${ptiFetch.status}`);
  }
  const evidence = extractIowaPtiEvidence(ptiFetch.html);
  const fetchedAt = new Date().toISOString();

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Reviewed first-party ASK PTIC leaf explicitly preserves Iowa statewide PTI designation, statewide scope, and U.S. Department of Education support.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'parent_training_information_center');
  const updatedNextRows = nextRows.filter((row) => row.family !== 'parent_training_information_center');

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        query_basis: 'Reviewed first-party ASK PTIC leaf explicitly preserves Iowa statewide Parent Training and Information Center designation text.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 1,
        samples: [
          {
            sample_name: 'ASK Resource Center PTIC',
            source_url: IOWA_PTI_URL,
            final_url: ptiFetch.finalUrl,
            verification_status: 'verified',
            source_type: 'first_party',
            source_table: 'reviewed_live_probe',
            fetched_at: fetchedAt,
            evidence_snippet: evidence.evidenceSnippet,
          },
        ],
      };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: 'district_grade_education_still_unverified',
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Reviewed Iowa special-education, dispute-resolution, district-maps, and AEA pages are statewide or structural only; no district-owned or county-grade special-education routing leaf is preserved on disk.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const batchSummary = {
    batch: 'batch_93_iowa_pti_statewide_repair_v1',
    generated_at: fetchedAt,
    state: 'iowa',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: ['parent_training_information_center'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      pti: {
        sourceUrl: IOWA_PTI_URL,
        finalUrl: ptiFetch.finalUrl,
        status: ptiFetch.status,
        evidenceSnippet: evidence.evidenceSnippet,
      },
    },
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Iowa PTI Statewide Repair Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- updated_families: ${batchSummary.updated_families.join(', ')}`,
      `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
      '',
      '## Evidence checks',
      '',
      `- pti: ${IOWA_PTI_URL} :: ${evidence.evidenceSnippet}`,
      '',
      '## Notes',
      '',
      '- This pass repairs only Iowa PTI from a first-party sitemap-discovered exact leaf.',
      '- District-grade education remains the single Iowa blocker.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch93IowaPtiStatewideRepairV1().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
