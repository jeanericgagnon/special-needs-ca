import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'connecticut_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'connecticut_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'connecticut_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'connecticut_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'connecticut_next_action_queue_v2.jsonl'),
  drctAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-55-533Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  drctHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-55-533Z', 'pages', '00004-connecticut-nonprofit-support-disrightsct-org.html'),
  cpacAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-49-018Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  cpacHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-49-018Z', 'pages', '00009-connecticut-nonprofit-support-cpacinc-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch62_connecticut_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch62-connecticut-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'connecticut-california-grade-audit-report-v2.md'),
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
        query_basis: 'Reviewed first-party Disability Rights Connecticut evidence on disk explicitly preserves Connecticut Protection and Advocacy designation text.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Connecticut',
            source_url: 'https://www.disrightsct.org/',
            final_url: 'https://www.disrightsct.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:46:02.907Z',
            evidence_snippet: "DRCT is Connecticut's designated Protection & Advocacy System for individuals with disabilities in Connecticut.",
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        evidence_strength: 'weak',
        sample_count: 1,
        query_basis: 'Reviewed first-party CPAC evidence on disk proves real statewide family-support, training, and IDEA advocacy scope, but the saved artifact does not preserve explicit PTI / Parent Training and Information designation text.',
        blocker_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        blocker_evidence: 'The reviewed CPAC artifact preserves Connecticut statewide family-support and training evidence, but not explicit PTI / Parent Training and Information Center designation text.',
        samples: [
          {
            sample_name: 'Connecticut Parent Advocacy Center',
            source_url: 'https://cpacinc.org/',
            final_url: 'https://cpacinc.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:45:55.007Z',
            evidence_snippet: "The mission of the Connecticut Parent Advocacy Center is to educate, support, and empower Connecticut's families of children and youth with any disability or chronic conditions, ages birth to 26.",
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
        query_basis: 'Reviewed first-party Disability Rights Connecticut evidence on disk explicitly preserves statewide legally based advocacy services plus direct help-routing pages.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Connecticut',
            source_url: 'https://www.disrightsct.org/',
            final_url: 'https://www.disrightsct.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:46:02.907Z',
            evidence_snippet: 'DRCT, together with other state Protection & Advocacy agencies, make up the nation’s largest provider of legally based advocacy services for people with disabilities.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Connecticut California-Grade Batch 62 Report v1',
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
    '- Connecticut no longer belongs in UNSTARTED. Reviewed first-party Disability Rights Connecticut evidence on disk now truthfully upgrades Protection and Advocacy and statewide disability legal aid from stale missing packet states.',
    "- Disability Rights Connecticut is explicit enough for Protection and Advocacy because the saved first-party artifact preserves that DRCT is Connecticut's designated Protection & Advocacy System, and it is explicit enough for statewide legal aid because the same reviewed artifact preserves legally based advocacy services language plus live request-accommodation and education-rights help routes.",
    '- CPAC is preserved as real reviewed statewide family-support and IDEA-training evidence for Connecticut, but the saved artifact still does not preserve explicit PTI / Parent Training and Information designation text, so the PTI family remains blocked rather than being upgraded by assumption.',
    '- Connecticut still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or statewide locator-style evidence, and PTI remains below the explicit designation bar.',
    '- Connecticut is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch62ConnecticutStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const drctAccepted = findAcceptedRow(INPUTS.drctAccepted, 'connecticut', 'disrightsct');
  const cpacAccepted = findAcceptedRow(INPUTS.cpacAccepted, 'connecticut', 'cpacinc');
  const drctHtml = readText(INPUTS.drctHtml);
  const cpacHtml = readText(INPUTS.cpacHtml);

  if (!drctAccepted) {
    throw new Error('Missing Connecticut Disability Rights Connecticut accepted artifact.');
  }
  if (!cpacAccepted) {
    throw new Error('Missing Connecticut CPAC accepted artifact.');
  }

  assertIncludes(drctHtml, "DRCT is Connecticut's designated Protection &amp; Advocacy System for individuals with disabilities in Connecticut.", 'Connecticut DRCT artifact');
  assertIncludes(drctHtml, 'largest provider of legally based advocacy services for people with disabilities', 'Connecticut DRCT artifact');
  assertIncludes(drctHtml, 'Request for Accommodation', 'Connecticut DRCT artifact');

  assertIncludes(cpacHtml, 'The mission of the Connecticut Parent Advocacy Center is to educate, support, and empower Connecticut', 'Connecticut CPAC artifact');
  assertIncludes(cpacHtml, 'rights under the Individuals with Disabilities Education Act (IDEA)', 'Connecticut CPAC artifact');
  assertIncludes(cpacHtml, 'CPAC is not a legal firm or a legal service agency', 'Connecticut CPAC artifact');

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
        family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        status_reason: 'reviewed first-party statewide family-support evidence exists, but the saved artifact does not preserve explicit PTI designation text',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party statewide legal-aid evidence is present at the required authority level',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        evidence: 'Reviewed CPAC evidence proves Connecticut statewide family-support and training scope, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.',
        next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
      };
    }
    return row;
  }).filter((row) => !['protection_and_advocacy', 'legal_aid'].includes(row.family));

  const updatedVerifiedRows = buildVerifiedRows(verifiedRows);

  const nextRowsByFamily = new Map();
  for (const row of nextRows) {
    if (!['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'].includes(row.family)) {
      nextRowsByFamily.set(row.family, row);
    }
  }
  nextRowsByFamily.set('parent_training_information_center', {
    state: 'connecticut',
    state_code: 'CT',
    priority_rank: 2,
    family: 'parent_training_information_center',
    severity: 'major',
    failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
    next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
    evidence: 'Reviewed CPAC evidence preserves Connecticut parent-support and training scope, but the saved first-party artifact does not preserve explicit PTI designation text.',
  });
  const updatedNextRows = Array.from(nextRowsByFamily.values())
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
      'parent_training_information_center',
    ],
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch_62_connecticut_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'connecticut',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'legal_aid',
      'parent_training_information_center',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      disabilityRightsConnecticut: {
        sourceUrl: 'https://www.disrightsct.org/',
        finalUrl: 'https://www.disrightsct.org/',
        pageTitle: drctAccepted.pageTitle || '',
      },
      cpac: {
        sourceUrl: 'https://cpacinc.org/',
        finalUrl: 'https://cpacinc.org/',
        pageTitle: cpacAccepted.pageTitle || '',
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
    '# Batch 62 Connecticut Statewide Family Truth Refresh',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- Disability Rights Connecticut: ${batchSummary.evidence_checks.disabilityRightsConnecticut.sourceUrl}`,
    `- CPAC: ${batchSummary.evidence_checks.cpac.sourceUrl}`,
  ].join('\n') + '\n');

  return {
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: batchSummary.updated_families,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch62ConnecticutStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
