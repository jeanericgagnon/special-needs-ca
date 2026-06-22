import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'illinois_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'illinois_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'illinois_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'illinois_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'illinois_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'illinois-california-grade-audit-report-v2.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch54_illinois_legal_aid_statewide_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch54-illinois-legal-aid-statewide-repair-report-v1.md'),
};

const ILLINOIS_LEGAL_AID_URL = 'https://www.illinoislegalaid.org/';

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
      headers: { 'user-agent': 'Ablefull Codex Illinois statewide repair' },
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

export function extractIllinoisLegalAidEvidence(html) {
  const text = htmlToText(html);
  const needles = [
    'Illinois Legal Aid Online',
    'Get Legal Help',
    'Get Legal Help About Us Resources',
    'living with a disability',
    'Form Library',
  ];
  for (const needle of needles) {
    if (!text.toLowerCase().includes(needle.toLowerCase())) {
      throw new Error(`Illinois Legal Aid Online no longer proves the statewide legal-aid routing role: missing "${needle}"`);
    }
  }
  return {
    titleSnippet: 'Illinois Legal Aid Online',
    routingSnippet: 'Get Legal Help About Us Resources ... living with a disability ... Form Library',
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
    primary_gap_reason: 'county_grade_coverage_still_incomplete_after_exact_target_verification',
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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Illinois California-Grade Audit Report v2',
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
    '## Illinois final blocker decision',
    '',
    '- District or county education routing remains blocked because only 3 reviewed ROE-owned exact leaves have been verified; that is not enough to truthfully prove district-grade routing across all 102 Illinois counties without reopening broader district authoring.',
    '- Parent training information center remains below California-grade because the current reviewed sample https://www.fmptic.org is only documented as serving downstate Illinois, and the designated statewide target https://frcd.org now states that Family Matters PTIC became the official PTIC for Illinois as of October 1, 2025. The packet still lacks reviewed statewide PTI proof for the designated family.',
    '- Legal aid is now verified at the statewide support layer because Illinois Legal Aid Online is a reviewed Illinois statewide legal-help portal with direct legal-help routing and legal resources for people with disabilities.',
    '- Illinois remains blocked and not index-safe until district-grade education leaves expand beyond the current bounded ROE set and a reviewed statewide PTI source is verified.',
  ].join('\n') + '\n';
}

export async function generateBatch54IllinoisLegalAidStatewideRepairV1(customFetch = fetchHtml) {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const legalFetch = await customFetch(ILLINOIS_LEGAL_AID_URL);
  if (legalFetch.status !== 200) {
    throw new Error(`Illinois Legal Aid Online fetch failed with status ${legalFetch.status}`);
  }
  const evidence = extractIllinoisLegalAidEvidence(legalFetch.html);
  const fetchedAt = new Date().toISOString();

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Illinois Legal Aid Online now provides reviewed Illinois statewide legal-help routing from a first-party portal.',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'regional_only_reviewed_source',
        status_reason: 'The reviewed Family Matters PTIC sample remains downstate-only, and FRCD now states on its own site that Family Matters PTIC became the official Illinois PTIC as of October 1, 2025. The packet still lacks reviewed statewide PTI proof for the designated family.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => row.family !== 'legal_aid')
    .map((row) => {
      if (row.family === 'parent_training_information_center') {
        return {
          ...row,
          failure_code: 'reviewed_pti_sample_is_regional_and_designated_statewide_target_now_points_to_successor',
          evidence: 'Reviewed PTI evidence currently points to https://www.fmptic.org, which is documented as serving downstate Illinois, while https://frcd.org now states that Family Matters PTIC became the official PTIC for Illinois as of October 1, 2025. The packet still lacks reviewed statewide proof for the designated PTI family.',
          next_action: 'hold_blocked_until_reviewed_statewide_illinois_pti_source_is_verified',
        };
      }
      return row;
    });

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'legal_aid')
    .map((row) => row.family === 'parent_training_information_center'
      ? {
          ...row,
          failure_code: 'reviewed_pti_sample_is_regional_and_designated_statewide_target_now_points_to_successor',
          evidence: 'Reviewed PTI evidence currently points to https://www.fmptic.org, which is documented as serving downstate Illinois, while https://frcd.org now states that Family Matters PTIC became the official PTIC for Illinois as of October 1, 2025. The packet still lacks reviewed statewide proof for the designated PTI family.',
          next_action: 'hold_blocked_until_reviewed_statewide_illinois_pti_source_is_verified',
        }
      : row);

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        blocker_code: null,
        blocker_evidence: null,
        query_basis: 'Reviewed first-party Illinois statewide legal-help portal with direct legal-help routing and disability-relevant resource coverage.',
        samples: [
          {
            sample_name: 'Illinois Legal Aid Online',
            source_url: ILLINOIS_LEGAL_AID_URL,
            final_url: legalFetch.finalUrl,
            verification_status: 'verified',
            source_type: 'first_party',
            source_table: 'batch54_illinois_legal_aid_reviewed_sources',
            fetched_at: fetchedAt,
            evidence_snippet: `${evidence.titleSnippet} ${evidence.routingSnippet}`,
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'regional_only_reviewed_source',
        evidence_strength: 'weak',
        blocker_code: 'reviewed_pti_sample_is_regional_and_designated_statewide_target_now_points_to_successor',
        blocker_evidence: 'Reviewed PTI evidence currently points to https://www.fmptic.org, which is documented as serving downstate Illinois, while https://frcd.org now states that Family Matters PTIC became the official PTIC for Illinois as of October 1, 2025. The packet still lacks reviewed statewide proof for the designated PTI family.',
      };
    }
    return row;
  });

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    batch: 'batch_54_illinois_legal_aid_statewide_repair_v1',
    generated_at: fetchedAt,
    state: 'illinois',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    legal_aid_source: ILLINOIS_LEGAL_AID_URL,
    remaining_failure_families: updatedFailureRows.map((row) => row.family),
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 54 Illinois Legal Aid Statewide Repair Report v1',
    '',
    'This pass repairs only the Illinois statewide legal-aid family from reviewed first-party evidence and leaves the district-grade education and statewide PTI blockers intact.',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${updatedSummary.completeness_pct}`,
    `- legal_aid_source: ${ILLINOIS_LEGAL_AID_URL}`,
    `- remaining_failure_families: ${updatedFailureRows.map((row) => row.family).join(', ')}`,
  ].join('\n') + '\n');

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch54IllinoisLegalAidStatewideRepairV1().then((summary) => {
    console.log(JSON.stringify(summary, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
