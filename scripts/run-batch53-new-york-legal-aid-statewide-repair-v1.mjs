import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-york_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-york_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-york_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-york_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-york_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'new-york-california-grade-audit-report-v2.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch53_new-york_legal_aid_statewide_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch53-new-york-legal-aid-statewide-repair-report-v1.md'),
};

const LAWHELP_NY_URL = 'https://www.lawhelpny.org/';

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
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#039;/g, "'")
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
      headers: { 'user-agent': 'Ablefull Codex New York statewide repair' },
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

export function extractLawHelpNyEvidence(html) {
  const text = htmlToText(html);
  const textNeedles = [
    'Free Legal Help in New York State',
    'Find a Lawyer',
    'Legal Directory',
    'Search for free legal services in New York',
    'Setting your location helps us find resources in your county',
  ];
  for (const needle of textNeedles) {
    if (!text.toLowerCase().includes(needle.toLowerCase())) {
      throw new Error(`LawHelpNY no longer proves the statewide legal-aid routing role: missing "${needle}"`);
    }
  }
  return {
    titleSnippet: 'Free Legal Help in New York State | LawHelpNY',
    routingSnippet: 'Find a Lawyer Legal Directory Search for free legal services in New York. Setting your location helps us find resources in your county.',
  };
}

function recalcSummary(summary, gapRows, failureRows, verifiedRows) {
  const criticalRows = gapRows.filter((row) => row.critical);
  const strong = criticalRows.filter((row) => String(row.family_status || '').startsWith('verified_')).length;
  const missing = criticalRows.filter((row) => row.family_status === 'missing').length;
  const weak = criticalRows.length - strong - missing;
  return {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: Math.floor((strong / criticalRows.length) * 100),
    strong_critical_families: strong,
    weak_critical_families: weak,
    missing_critical_families: missing,
    primary_gap_reason: 'official_county_directory_returns_http_403',
    recommended_batch: 'batch_2_repair_blocked',
    critical_gap_families: failureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: failureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    verified_source_families_with_samples: verifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: failureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows, facts) {
  return [
    '# New York California-Grade Audit Report v2',
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
    '## New York final blocker decision',
    '',
    `- County-local disability resources remain blocked because the official New York LDSS county directory at ${facts.countyDirectoryUrl} returned HTTP 403 during bounded live verification, and no replacement live county-grade official locator is attached to the packet evidence chain.`,
    `- District or county education routing remains blocked because only ${facts.educationLeafCount} reviewed BOCES-owned exact leaves have been verified; that is not enough to truthfully prove district-grade routing across all ${summary.county_count} New York counties without reopening broader district authoring.`,
    `- Parent training information center remains below California-grade because the reviewed Parent Network of WNY evidence at ${facts.ptiUrl} is still explicitly scoped to Western New York support, not a truthful statewide PTI route.`,
    '- Legal aid is now verified at the statewide support layer because LawHelpNY is a reviewed New York statewide legal-help portal with county-based resource routing and a free legal-services directory.',
    '- New York remains blocked and not index-safe until a live official county-office directory or county-owned locator is verified, district-grade education leaves expand beyond the current bounded BOCES set, and a statewide PTI route is proven beyond Western New York scope.',
  ].join('\n') + '\n';
}

export async function generateBatch53NewYorkLegalAidStatewideRepairV1(customFetch = fetchHtml) {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const legalFetch = await customFetch(LAWHELP_NY_URL);
  if (legalFetch.status !== 200) {
    throw new Error(`LawHelpNY fetch failed with status ${legalFetch.status}`);
  }
  const evidence = extractLawHelpNyEvidence(legalFetch.html);
  const fetchedAt = new Date().toISOString();

  const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
  const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
  const ptiVerified = verifiedRows.find((row) => row.family === 'parent_training_information_center');
  const countyDirectoryUrl = countyVerified?.samples?.[0]?.source_url || 'https://www.health.ny.gov/health_care/medicaid/ldss.htm';
  const ptiUrl = ptiVerified?.samples?.[0]?.source_url || 'http://parentnetworkwny.org/';

  const updatedGapRows = gapRows.map((row) => row.family === 'legal_aid'
    ? {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'LawHelpNY now provides reviewed New York statewide legal-help routing from a first-party portal with county-based resource lookup.',
      }
    : row);

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'legal_aid');
  const updatedNextRows = nextRows.filter((row) => row.family !== 'legal_aid');

  const updatedVerifiedRows = verifiedRows.map((row) => row.family === 'legal_aid'
    ? {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        blocker_code: null,
        blocker_evidence: null,
        query_basis: 'Reviewed first-party New York legal-help portal with county-based legal-services directory and lawyer routing.',
        samples: [
          {
            sample_name: 'LawHelpNY',
            source_url: LAWHELP_NY_URL,
            final_url: legalFetch.finalUrl,
            verification_status: 'verified',
            source_type: 'first_party',
            source_table: 'batch53_new_york_legal_aid_reviewed_sources',
            fetched_at: fetchedAt,
            evidence_snippet: `${evidence.titleSnippet} ${evidence.routingSnippet}`,
          },
        ],
      }
    : row);

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const facts = {
    countyDirectoryUrl,
    educationLeafCount: districtVerified?.sample_count || 0,
    ptiUrl,
  };
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, facts);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    batch: 'batch_53_new-york_legal_aid_statewide_repair_v1',
    generated_at: fetchedAt,
    state: 'new-york',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    legal_aid_source: LAWHELP_NY_URL,
    remaining_failure_families: updatedFailureRows.map((row) => row.family),
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 53 New York Legal Aid Statewide Repair Report v1',
    '',
    'This pass repairs only the New York statewide legal-aid family from reviewed first-party evidence and leaves the county-local, education, and PTI blockers intact.',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${updatedSummary.completeness_pct}`,
    `- legal_aid_source: ${LAWHELP_NY_URL}`,
    `- remaining_failure_families: ${updatedFailureRows.map((row) => row.family).join(', ')}`,
  ].join('\n') + '\n');

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch53NewYorkLegalAidStatewideRepairV1().then((summary) => {
    console.log(JSON.stringify(summary, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
