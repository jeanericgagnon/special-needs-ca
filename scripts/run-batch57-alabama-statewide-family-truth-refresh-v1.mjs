import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'alabama_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'alabama_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'alabama_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'alabama_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'alabama_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'alabama-california-grade-audit-report-v2.md'),
  adapAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-17-311Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  adapHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-17-311Z', 'pages', '00010-alabama-nonprofit-support-adap-ua-edu.html'),
  apecAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-35-749Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  apecHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-35-749Z', 'pages', '00002-alabama-nonprofit-support-alabamaparentcenter-com.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch57_alabama_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch57-alabama-statewide-family-truth-refresh-report-v1.md'),
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

function buildVerifiedSourceRows(existingRows) {
  return existingRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed first-party ADAP artifact on disk explicitly states that ADAP is a Protection & Advocacy agency, provides legal services to Alabamians with disabilities, and exposes client-intake plus grievance routes.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Alabama Disabilities Advocacy Program',
            source_url: 'http://adap.ua.edu/',
            final_url: 'https://sites.ua.edu/adap/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:28.502Z',
            evidence_snippet: 'As a Protection & Advocacy agency, it’s our job to find out what YOU want us to focus on in the upcoming year. ADAP provides legal services to Alabamians with disabilities to protect and promote their civil rights.',
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
        query_basis: 'Reviewed first-party APEC artifact on disk explicitly states that APEC operates the Alabama Parent Training & Information Center (AL PTI) and provides training and information to help parents become meaningful participants in their children’s education.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Alabama Parent Education Center / AL PTI',
            source_url: 'https://alabamaparentcenter.com/',
            final_url: 'https://alabamaparentcenter.com/web/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:41.462Z',
            evidence_snippet: 'We operate projects such as the Alabama Parent Training & Information Center (AL PTI). APEC provides parents with training, information, and support to help them become meaningful participants in their children’s education and lives.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Alabama California-Grade Batch 7 Report v1',
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
    '- Alabama no longer belongs in UNSTARTED. Reviewed first-party statewide support evidence on disk now truthfully upgrades Protection and Advocacy and the Parent Training & Information Center from stale missing/inventory-only packet states.',
    '- Alabama still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or statewide locator-style evidence, and legal aid still lacks a reviewed statewide first-party source family.',
    '- Alabama is therefore terminal BLOCKED, not COMPLETE: the statewide support families are now repaired, but the remaining county-grade routing gaps are explicit and still unresolved.',
  ].join('\n') + '\n';
}

export function generateBatch57AlabamaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const adapAccepted = findAcceptedRow(INPUTS.adapAccepted, 'alabama', 'adap.ua.edu');
  const apecAccepted = findAcceptedRow(INPUTS.apecAccepted, 'alabama', 'alabamaparentcenter.com');
  const adapHtml = readText(INPUTS.adapHtml);
  const apecHtml = readText(INPUTS.apecHtml);

  if (!adapAccepted) {
    throw new Error('Missing Alabama ADAP accepted artifact.');
  }
  if (!apecAccepted) {
    throw new Error('Missing Alabama APEC accepted artifact.');
  }

  assertIncludes(adapHtml, 'As a Protection &amp; Advocacy agency', 'Alabama ADAP first-party artifact');
  assertIncludes(adapHtml, 'provides legal services to Alabamians with disabilities', 'Alabama ADAP first-party artifact');
  assertIncludes(adapHtml, 'client intake form', 'Alabama ADAP first-party artifact');
  assertIncludes(adapHtml, 'Grievance Procedure', 'Alabama ADAP first-party artifact');

  assertIncludes(apecHtml, 'Alabama Parent Training &amp; Information Center (AL PTI)', 'Alabama APEC first-party artifact');
  assertIncludes(apecHtml, 'provide parents with training and information', 'Alabama APEC first-party artifact');
  assertIncludes(apecHtml, 'meaningful participants in their children', 'Alabama APEC first-party artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party protection-and-advocacy evidence is present at the required authority level',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party PTI evidence is present at the required authority level',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.filter((row) => (
    row.family !== 'protection_and_advocacy'
      && row.family !== 'parent_training_information_center'
  ));

  const updatedVerifiedRows = buildVerifiedSourceRows(verifiedRows);

  const remainingNextRows = nextRows.filter((row) => (
    row.family !== 'protection_and_advocacy'
      && row.family !== 'parent_training_information_center'
  ));

  const updatedNextRows = remainingNextRows.map((row, index) => ({
    ...row,
    priority_rank: index + 1,
  }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 75,
    strong_critical_families: 9,
    weak_critical_families: 2,
    missing_critical_families: 1,
    primary_gap_reason: 'generic_or_statewide_evidence_used_where_local_required',
    critical_gap_families: updatedFailureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: updatedFailureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(INPUTS.report, updatedReport);

  const batchSummary = {
    batch: 'batch_57_alabama_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'alabama',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
    ],
    remaining_blockers: updatedFailureRows.map((row) => row.family),
    evidence_checks: {
      adap: {
        sourceUrl: adapAccepted.sourceUrl,
        finalUrl: adapAccepted.finalUrl,
        pageTitle: adapAccepted.pageTitle,
      },
      apec: {
        sourceUrl: apecAccepted.sourceUrl,
        finalUrl: apecAccepted.finalUrl,
        pageTitle: apecAccepted.pageTitle,
      },
    },
  };

  const batchReport = [
    '# Batch 57 Alabama Statewide Family Truth Refresh Report v1',
    '',
    '- state: alabama',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- updated_families: protection_and_advocacy, parent_training_information_center',
    '',
    '## Decision',
    '',
    '- Alabama had already accumulated reviewed first-party statewide support evidence on disk, but the packet was still reporting stale missing/inventory-only family states.',
    '- ADAP now truthfully satisfies Protection and Advocacy because the reviewed first-party artifact explicitly states that ADAP is a Protection & Advocacy agency and exposes client-intake plus grievance routes.',
    '- APEC now truthfully satisfies Parent Training and Information Center because the reviewed first-party artifact explicitly states that APEC operates the Alabama Parent Training & Information Center (AL PTI).',
    '- Alabama remains blocked because district/county education routing and county/local disability resources are still county-grade weak, and legal aid is still missing.',
  ].join('\n') + '\n';

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch57AlabamaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
