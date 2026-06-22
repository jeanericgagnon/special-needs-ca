import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'delaware_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'delaware_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'delaware_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'delaware_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'delaware_next_action_queue_v2.jsonl'),
  clasiAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-46-11-439Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  clasiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-46-11-439Z', 'pages', '00009-delaware-nonprofit-support-declasi-org.html'),
  picAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-46-11-439Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  picHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-46-11-439Z', 'pages', '00010-delaware-nonprofit-support-picofdel-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch63_delaware_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch63-delaware-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'delaware-california-grade-audit-report-v2.md'),
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
        query_basis: 'Reviewed first-party CLASI evidence on disk explicitly preserves Disability Rights Delaware as Delaware’s designated Protection and Advocacy system.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Delaware / CLASI',
            source_url: 'http://www.declasi.org/',
            final_url: 'https://www.declasi.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:46:18.472Z',
            evidence_snippet: 'Disability Rights Delaware – Delaware’s designated Protection & Advocacy system for people with disabilities.',
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
        query_basis: 'Reviewed first-party PIC of Delaware evidence on disk explicitly preserves PTI designation, statewide mission, and consultation routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'PIC of Delaware',
            source_url: 'https://picofdel.org/',
            final_url: 'https://picofdel.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:46:18.472Z',
            evidence_snippet: 'Parent Training and Information Center (PTI) Project. PIC staff are available to assist by phone, email or virtual meeting.',
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
        query_basis: 'Reviewed first-party CLASI evidence on disk explicitly preserves statewide free legal-services language plus disability-rights routing and help intake.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Community Legal Aid Society, Inc.',
            source_url: 'http://www.declasi.org/',
            final_url: 'https://www.declasi.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:46:18.472Z',
            evidence_snippet: 'CLASI provides free legal services to Delawareans in need, helping to ensure equal access to justice. Get Help.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Delaware California-Grade Batch 63 Report v1',
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
    '- Delaware no longer belongs in UNSTARTED. Reviewed first-party CLASI and PIC of Delaware evidence on disk now truthfully upgrades all three statewide support families from stale missing or inventory-only packet states.',
    '- CLASI is explicit enough for Protection and Advocacy because the saved first-party artifact preserves Disability Rights Delaware as Delaware’s designated Protection & Advocacy system, and it is explicit enough for statewide legal aid because the same reviewed artifact preserves free legal-services language plus direct disability-rights and Get Help routing.',
    '- PIC of Delaware is explicit enough for PTI because the saved first-party artifact preserves the Parent Training and Information Center (PTI) Project designation plus direct consultation routing for Delaware families.',
    '- Delaware still cannot reach California-grade or become index-safe because statewide special-education authority remains legacy-only, district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, and county/local disability resources still depend on generic or statewide locator-style evidence.',
    '- Delaware is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch63DelawareStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const clasiAccepted = findAcceptedRow(INPUTS.clasiAccepted, 'delaware', 'declasi');
  const picAccepted = findAcceptedRow(INPUTS.picAccepted, 'delaware', 'picofdel');
  const clasiHtml = readText(INPUTS.clasiHtml);
  const picHtml = readText(INPUTS.picHtml);

  if (!clasiAccepted) {
    throw new Error('Missing Delaware CLASI accepted artifact.');
  }
  if (!picAccepted) {
    throw new Error('Missing Delaware PIC of Delaware accepted artifact.');
  }

  assertIncludes(clasiHtml, 'Disability Rights Delaware', 'Delaware CLASI artifact');
  assertIncludes(clasiHtml, 'Delaware’s designated Protection &amp; Advocacy system for people with disabilities', 'Delaware CLASI artifact');
  assertIncludes(clasiHtml, 'free legal services', 'Delaware CLASI artifact');
  assertIncludes(clasiHtml, 'Delawareans in need', 'Delaware CLASI artifact');
  assertIncludes(clasiHtml, 'Get Help', 'Delaware CLASI artifact');

  assertIncludes(picHtml, 'Parent Training and Information Center (PTI) Project', 'Delaware PIC artifact');
  assertIncludes(picHtml, "PIC's mission is to improve health and educational outcomes for children and youth by empowering them, their families and the professionals who serve them.", 'Delaware PIC artifact');
  assertIncludes(picHtml, 'PIC staff are available to assist by phone, email or virtual meeting', 'Delaware PIC artifact');

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
    completeness_pct: 75,
    strong_critical_families: 9,
    weak_critical_families: 3,
    missing_critical_families: 0,
    major_gap_families: [
      'special_education_idea_part_b',
    ],
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch_63_delaware_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'delaware',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
      'legal_aid',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      clasi: {
        sourceUrl: 'http://www.declasi.org/',
        finalUrl: 'https://www.declasi.org/',
        pageTitle: clasiAccepted.pageTitle || '',
      },
      picOfDelaware: {
        sourceUrl: 'https://picofdel.org/',
        finalUrl: 'https://picofdel.org/',
        pageTitle: picAccepted.pageTitle || '',
      },
    },
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, updatedReport);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, [
    '# Batch 63 Delaware Statewide Family Truth Refresh',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- CLASI: ${batchSummary.evidence_checks.clasi.sourceUrl}`,
    `- PIC of Delaware: ${batchSummary.evidence_checks.picOfDelaware.sourceUrl}`,
  ].join('\n') + '\n');

  return {
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: batchSummary.updated_families,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch63DelawareStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
