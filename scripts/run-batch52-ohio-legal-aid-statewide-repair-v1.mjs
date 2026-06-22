import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'ohio_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'ohio_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'ohio_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'ohio_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'ohio_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'ohio-california-grade-audit-report-v2.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch52_ohio_legal_aid_statewide_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch52-ohio-legal-aid-statewide-repair-report-v1.md'),
};

const OHIO_LEGAL_HELP_URL = 'https://www.ohiolegalhelp.org/';

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
      headers: { 'user-agent': 'Ablefull Codex Ohio statewide repair' },
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

export function extractOhioLegalAidEvidence(html) {
  const text = htmlToText(html);
  const textNeedles = [
    'Need legal information, forms or a lawyer?',
    'Ohio Legal Help',
    'Find a Lawyer',
  ];
  for (const needle of textNeedles) {
    if (!text.toLowerCase().includes(needle.toLowerCase())) {
      throw new Error(`Ohio Legal Help no longer proves the statewide legal-aid routing role: missing "${needle}"`);
    }
  }
  const htmlNeedles = [
    'connections to organizations that offer legal advice and representation',
  ];
  for (const needle of htmlNeedles) {
    if (!html.toLowerCase().includes(needle.toLowerCase())) {
      throw new Error(`Ohio Legal Help no longer proves the statewide legal-aid routing role: missing "${needle}"`);
    }
  }

  const titleSnippet = 'Need legal information, forms or a lawyer? | Ohio Legal Help';
  const routingSnippet = 'Ohio Legal Help offers free legal information, basic legal how-to\'s, court forms and connections to organizations that offer legal advice and representation.';
  return { titleSnippet, routingSnippet };
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
    primary_gap_reason: 'official_county_directory_targets_unresolved_after_bounded_live_check',
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
    '# Ohio California-Grade Audit Report v2',
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
    '## Ohio final blocker decision',
    '',
    `- County-local disability resources remain blocked because the bounded live Ohio JFS county-directory roots all failed or returned 404, and the remaining fallback packet evidence is only a DOI-hosted dataset mirror (${facts.countyDatasetUrl}), not live official county-grade office proof.`,
    `- District or county education routing remains blocked because only ${facts.educationLeafCount} reviewed ESC-owned exact leaves across ${facts.educationRootCount} bounded Ohio packet roots have been verified; that is not enough to truthfully prove district-grade routing across all ${summary.county_count} Ohio counties without reopening broader district authoring.`,
    '- Legal aid is now verified at the statewide support layer because Ohio Legal Help is a reviewed Ohio-specific first-party legal-help portal that explicitly offers legal information, forms, and lawyer connections.',
    '- Ohio remains blocked and not index-safe until the county-local and district-grade education families have county-grade proof.',
  ].join('\n') + '\n';
}

export async function generateBatch52OhioLegalAidStatewideRepairV1(customFetch = fetchHtml) {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const legalFetch = await customFetch(OHIO_LEGAL_HELP_URL);
  if (legalFetch.status !== 200) {
    throw new Error(`Ohio Legal Help fetch failed with status ${legalFetch.status}`);
  }
  const evidence = extractOhioLegalAidEvidence(legalFetch.html);
  const fetchedAt = new Date().toISOString();

  const countyVerified = verifiedRows.find((row) => row.family === 'county_local_disability_resources');
  const districtVerified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
  const countyDatasetUrl = countyVerified?.samples?.[0]?.source_url || 'https://doi.org/';

  const updatedGapRows = gapRows.map((row) => row.family === 'legal_aid'
    ? {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Ohio Legal Help now provides reviewed Ohio-specific statewide legal-help routing from a first-party portal.',
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
        query_basis: 'Reviewed first-party Ohio statewide legal-help portal with explicit lawyer-routing and legal-help language.',
        samples: [
          {
            sample_name: 'Ohio Legal Help',
            source_url: OHIO_LEGAL_HELP_URL,
            final_url: legalFetch.finalUrl,
            verification_status: 'verified',
            source_type: 'first_party',
            source_table: 'batch52_ohio_legal_aid_reviewed_sources',
            fetched_at: fetchedAt,
            evidence_snippet: `${evidence.titleSnippet} ${evidence.routingSnippet}`,
          },
        ],
      }
    : row);

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const facts = {
    countyDatasetUrl,
    educationLeafCount: districtVerified?.sample_count || 0,
    educationRootCount: 8,
  };
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, facts);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    batch: 'batch_52_ohio_legal_aid_statewide_repair_v1',
    generated_at: fetchedAt,
    state: 'ohio',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    legal_aid_source: OHIO_LEGAL_HELP_URL,
    remaining_failure_families: updatedFailureRows.map((row) => row.family),
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 52 Ohio Legal Aid Statewide Repair Report v1',
    '',
    'This pass repairs only the Ohio statewide legal-aid family from reviewed first-party evidence and leaves the county-local and district-grade blockers intact.',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${updatedSummary.completeness_pct}`,
    `- legal_aid_source: ${OHIO_LEGAL_HELP_URL}`,
    `- remaining_failure_families: ${updatedFailureRows.map((row) => row.family).join(', ')}`,
  ].join('\n') + '\n');

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch52OhioLegalAidStatewideRepairV1().then((summary) => {
    console.log(JSON.stringify(summary, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
