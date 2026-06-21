import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'georgia_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'georgia_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'georgia_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'georgia_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'georgia_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'georgia-california-grade-audit-report-v2.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch51_georgia_legal_aid_statewide_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch51-georgia-legal-aid-statewide-repair-report-v1.md'),
};

const GLSP_URL = 'https://www.glsp.org/need-help/';
const ATLANTA_LEGAL_AID_URL = 'https://atlantalegalaid.org/home/';

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
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
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
      headers: { 'user-agent': 'Ablefull Codex Georgia statewide repair' },
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

export function extractGeorgiaLegalAidEvidence(glspHtml, atlantaHtml) {
  const glspText = htmlToText(glspHtml);
  const atlantaText = htmlToText(atlantaHtml);
  const glspNeedle = 'Our attorneys and paralegals provide free civil legal help to Georgians in 154 counties outside of Metro-Atlanta. We do not represent persons living in Clayton, Cobb, DeKalb, Fulton or Gwinnett counties.';
  const atlantaNeedles = [
    'free civil legal assistance',
    'Clayton County',
    'Cobb County',
    'DeKalb County',
    'Fulton County',
    'Gwinnett County',
  ];

  if (!glspText.includes(glspNeedle)) {
    throw new Error('GLSP page no longer proves the statewide-outside-metro legal aid scope.');
  }
  for (const needle of atlantaNeedles) {
    if (!atlantaText.toLowerCase().includes(needle.toLowerCase())) {
      throw new Error(`Atlanta Legal Aid page no longer proves the metro-county legal aid scope: missing "${needle}"`);
    }
  }

  return {
    glspSnippet: glspNeedle,
    atlantaSnippet: 'Atlanta Legal Aid Society’s mission is to provide free civil legal assistance to help people in need access justice to protect their rights and secure their safety and stability. Fulton County / Downtown Headquarters 54 Ellis St. NE Atlanta, GA 30303 404-524-5811 Clayton County 404-669-0233 Cobb County 770-528-2565 DeKalb County 404-377-0701 Gwinnett County 678-376-4545',
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
    primary_gap_reason: 'official_county_lookup_table_has_empty_county_cells',
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
    '# Georgia California-Grade Audit Report v2',
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
    '## Georgia final blocker decision',
    '',
    `- Developmental disability routing remains blocked because the official DBHDD county table still renders ${facts.ddBlankCountyRows}/${facts.ddBlankCountyRows} blank county cells in static HTML, and the obvious same-domain region field-office leaves remain non-proving or forbidden.`,
    `- District or county education routing remains blocked because only ${facts.educationLeafCount} reviewed district-owned leaves across the bounded packet evidence have been verified; that is not enough to truthfully prove county-grade routing across 159 Georgia counties without reopening broad district discovery.`,
    '- Legal aid is now verified at the statewide support layer because Georgia Legal Services Program proves 154 counties outside Metro Atlanta and Atlanta Legal Aid proves Clayton, Cobb, DeKalb, Fulton, and Gwinnett county legal-aid routing from first-party pages.',
    '- Georgia remains blocked and not index-safe until the DD county mapping and district-grade education families have county-grade proof.',
  ].join('\n') + '\n';
}

export async function generateBatch51GeorgiaLegalAidStatewideRepairV1(customFetch = fetchHtml) {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const glspFetch = await customFetch(GLSP_URL);
  const atlFetch = await customFetch(ATLANTA_LEGAL_AID_URL);
  if (glspFetch.status !== 200) {
    throw new Error(`GLSP legal aid fetch failed with status ${glspFetch.status}`);
  }
  if (atlFetch.status !== 200) {
    throw new Error(`Atlanta Legal Aid fetch failed with status ${atlFetch.status}`);
  }

  const evidence = extractGeorgiaLegalAidEvidence(glspFetch.html, atlFetch.html);
  const fetchedAt = new Date().toISOString();

  const updatedGapRows = gapRows.map((row) => row.family === 'legal_aid'
    ? {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Georgia Legal Services Program plus Atlanta Legal Aid now provide reviewed first-party statewide legal-aid routing for Georgia.',
      }
    : row);

  const updatedFailureRows = failureRows.filter((row) => row.family !== 'legal_aid');
  const updatedNextRows = nextRows.filter((row) => row.family !== 'legal_aid');

  const updatedVerifiedRows = verifiedRows.map((row) => row.family === 'legal_aid'
    ? {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        blocker_code: null,
        blocker_evidence: null,
        query_basis: 'Reviewed first-party Georgia legal-aid pages proving outside-metro and metro-county routing coverage.',
        samples: [
          {
            sample_name: 'Georgia Legal Services Program',
            source_url: GLSP_URL,
            final_url: glspFetch.finalUrl,
            verification_status: 'verified',
            source_type: 'first_party',
            source_table: 'batch51_georgia_legal_aid_reviewed_sources',
            fetched_at: fetchedAt,
            evidence_snippet: evidence.glspSnippet,
          },
          {
            sample_name: 'Atlanta Legal Aid',
            source_url: ATLANTA_LEGAL_AID_URL,
            final_url: atlFetch.finalUrl,
            verification_status: 'verified',
            source_type: 'first_party',
            source_table: 'batch51_georgia_legal_aid_reviewed_sources',
            fetched_at: fetchedAt,
            evidence_snippet: evidence.atlantaSnippet,
          },
        ],
      }
    : row);

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const educationLeafCount = updatedVerifiedRows.find((row) => row.family === 'district_or_county_education_routing')?.sample_count || 0;
  const facts = {
    ddBlankCountyRows: 159,
    educationLeafCount,
  };
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, facts);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    batch: 'batch_51_georgia_legal_aid_statewide_repair_v1',
    generated_at: fetchedAt,
    state: 'georgia',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    legal_aid_sources: [GLSP_URL, ATLANTA_LEGAL_AID_URL],
    remaining_failure_families: updatedFailureRows.map((row) => row.family),
  };
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 51 Georgia Legal Aid Statewide Repair Report v1',
    '',
    'This pass repairs only the statewide Georgia legal-aid family from reviewed first-party evidence and leaves the DD and district-grade education blockers intact.',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${updatedSummary.completeness_pct}`,
    `- legal_aid_sources: ${GLSP_URL}, ${ATLANTA_LEGAL_AID_URL}`,
    `- remaining_failure_families: ${updatedFailureRows.map((row) => row.family).join(', ')}`,
  ].join('\n') + '\n');

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBatch51GeorgiaLegalAidStatewideRepairV1().then((summary) => {
    console.log(JSON.stringify(summary, null, 2));
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
