import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'arkansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'arkansas_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'arkansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arkansas_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'arkansas_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'arkansas-california-grade-audit-report-v2.md'),
  drazAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-08-435Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  drazHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-08-435Z', 'pages', '00008-arkansas-nonprofit-support-disabilityrightsar-org.html'),
  ptiAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T23-35-28-298Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T23-35-28-298Z', 'pages', '00001-arkansas-nonprofit-support-center-for-exceptional-families-pti.html'),
  stalePtiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-08-435Z', 'pages', '00006-arkansas-nonprofit-support-adcpti-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch60_arkansas_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch60-arkansas-statewide-family-truth-refresh-report-v1.md'),
};

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

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(text, pattern, label) {
  if (!text.includes(pattern)) {
    throw new Error(`Expected ${label} to include "${pattern}".`);
  }
}

function findAcceptedRow(filePath, stateId, sourceUrlFragment) {
  return readJsonl(filePath).find((row) => (
    row.stateId === stateId
      && String(row.sourceUrl || '').includes(sourceUrlFragment)
  )) || null;
}

function buildVerifiedRows(existingRows) {
  return existingRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed first-party Disability Rights Arkansas evidence on disk explicitly preserves Arkansas Protection and Advocacy designation text.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Arkansas',
            source_url: 'https://disabilityrightsar.org/',
            final_url: 'https://disabilityrightsar.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:16.766Z',
            evidence_snippet: 'Disability Rights Arkansas is the independent, private, nonprofit organization designated by the Governor of Arkansas to implement the federally funded and authorized Protection and Advocacy systems throughout the state.',
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed first-party Center for Exceptional Families evidence on disk explicitly preserves Arkansas PTI scope and request-services routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'The Center for Exceptional Families',
            source_url: 'http://thecenterforexceptionalfamilies.org/',
            final_url: 'https://thecenterforexceptionalfamilies.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-19T23:35:36.718Z',
            evidence_snippet: 'Parent training and information centers ensure that parents receive adequate training and information to improve educational results for their children. Request Services.',
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
        query_basis: 'Reviewed first-party Disability Rights Arkansas evidence on disk explicitly preserves free legal representation and statewide assistance scope.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Arkansas',
            source_url: 'https://disabilityrightsar.org/',
            final_url: 'https://disabilityrightsar.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:16.766Z',
            evidence_snippet: 'DRA services include information and referral, short-term assistance, technical assistance, legal representation, systemic advocacy, monitoring, and training. DRA services are provided free-of-charge.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Arkansas California-Grade Batch 6 Report v1',
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
    '- Arkansas no longer belongs in UNSTARTED. Reviewed first-party Disability Rights Arkansas and Center for Exceptional Families evidence on disk now truthfully upgrades all three statewide support families from stale missing or inventory-only packet states.',
    '- Disability Rights Arkansas is explicit enough for Protection and Advocacy because the saved first-party artifact preserves that it is designated by the Governor of Arkansas to implement the federally funded Protection and Advocacy systems throughout the state, and it is explicit enough for statewide legal aid because the same saved artifact preserves free legal representation and statewide assistance language.',
    '- The Center for Exceptional Families is explicit enough for PTI because the saved first-party Arkansas artifact preserves parent-training-and-information language plus a live Request Services route, while the older adcpti.org candidate has clearly drifted into unrelated non-Arkansas investment content and cannot count as reviewed disability evidence.',
    '- Arkansas still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, and county/local disability resources still depend on generic or statewide locator-style evidence.',
    '- Arkansas is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch60ArkansasStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const drazAccepted = findAcceptedRow(INPUTS.drazAccepted, 'arkansas', 'disabilityrightsar');
  const ptiAccepted = findAcceptedRow(INPUTS.ptiAccepted, 'arkansas', 'thecenterforexceptionalfamilies');
  const drazHtml = readText(INPUTS.drazHtml);
  const ptiHtml = readText(INPUTS.ptiHtml);
  const stalePtiHtml = readText(INPUTS.stalePtiHtml);

  if (!drazAccepted) {
    throw new Error('Missing Arkansas Disability Rights Arkansas accepted artifact.');
  }
  if (!ptiAccepted) {
    throw new Error('Missing Arkansas Center for Exceptional Families accepted artifact.');
  }

  assertIncludes(drazHtml, 'designated by the Governor of Arkansas to implement the federally funded and authorized Protection and Advocacy systems throughout the state', 'Arkansas Disability Rights Arkansas artifact');
  assertIncludes(drazHtml, 'legal representation', 'Arkansas Disability Rights Arkansas artifact');
  assertIncludes(drazHtml, 'DRA services are provided free-of-charge', 'Arkansas Disability Rights Arkansas artifact');

  assertIncludes(ptiHtml, 'Parent training and information centers ensure that parents receive adequate training and information to improve educational results for their children.', 'Arkansas PTI artifact');
  assertIncludes(ptiHtml, 'Request Services', 'Arkansas PTI artifact');
  assertIncludes(ptiHtml, 'Assist Arkansans with disabilities', 'Arkansas PTI artifact');

  assertIncludes(stalePtiHtml, '국제 배당률 분석', 'Arkansas stale PTI candidate');
  assertIncludes(stalePtiHtml, '먹튀사이트', 'Arkansas stale PTI candidate');

  const updatedGapRows = gapRows.map((row) => {
    if (['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'].includes(row.family)) {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party statewide support evidence is present at the required authority level',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => !['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'].includes(row.family));
  const updatedVerifiedRows = buildVerifiedRows(verifiedRows);

  const updatedNextRows = nextRows
    .filter((row) => !['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'].includes(row.family))
    .sort((a, b) => a.priority_rank - b.priority_rank);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    missing_critical_families: 0,
    major_gap_families: [],
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch_60_arkansas_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'arkansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
      'legal_aid',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      disabilityRightsArkansas: {
        sourceUrl: 'https://disabilityrightsar.org/',
        finalUrl: 'https://disabilityrightsar.org/',
        pageTitle: drazAccepted.pageTitle || '',
      },
      centerForExceptionalFamilies: {
        sourceUrl: 'http://thecenterforexceptionalfamilies.org/',
        finalUrl: 'https://thecenterforexceptionalfamilies.org/',
        pageTitle: ptiAccepted.pageTitle || '',
      },
      stalePtiCandidate: {
        sourceUrl: 'https://adcpti.org/',
        finalUrl: 'https://adcpti.org/',
        driftDetected: true,
      },
    },
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 60 Arkansas Statewide Family Truth Refresh Report v1',
    '',
    '- state: arkansas',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- updated_families: protection_and_advocacy, parent_training_information_center, legal_aid',
    '',
    '## Decision',
    '',
    '- Arkansas had enough reviewed first-party evidence on disk to leave UNSTARTED and become truthfully terminal BLOCKED.',
    '- Disability Rights Arkansas now upgrades protection_and_advocacy because the saved first-party artifact explicitly preserves that it is the Governor-designated Protection and Advocacy system for Arkansas.',
    '- Disability Rights Arkansas also upgrades legal_aid because the saved first-party artifact explicitly preserves free legal representation and statewide assistance scope.',
    '- The Center for Exceptional Families upgrades PTI because the saved first-party artifact preserves parent-training-and-information language plus a live Request Services route for Arkansas families.',
    '- The old adcpti.org candidate is explicitly rejected as stale drift because the reviewed page is unrelated Korean investment content and cannot count as Arkansas disability evidence.',
    '- County-grade education routing and county/local disability resources remain the final critical county-grade blockers.',
    '',
  ].join('\n'));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch60ArkansasStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
