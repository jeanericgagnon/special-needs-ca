import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'alaska_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'alaska_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'alaska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'alaska_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'alaska_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
  dlcakAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-23-447Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  dlcakHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-23-447Z', 'pages', '00006-alaska-nonprofit-support-dlcak-org.html'),
  stoneAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-04-17-699Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  stoneHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-04-17-699Z', 'pages', '00019-alaska-nonprofit-support-stone-soup-group-pti.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch58_alaska_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch58-alaska-statewide-family-truth-refresh-report-v1.md'),
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
        family_status: 'blocked_reviewed_statewide_legal_advocacy_source_not_explicit_pa',
        evidence_strength: 'weak',
        sample_count: 1,
        query_basis: 'Reviewed first-party DLCAK evidence on disk proves statewide legal advocacy and intake routing, but the saved artifact does not preserve explicit Protection and Advocacy / P&A designation text.',
        blocker_code: 'reviewed_statewide_legal_advocacy_source_not_explicit_pa',
        blocker_evidence: 'The reviewed DLCAK artifact says it is an independent non-profit law firm providing legal advocacy for people with disabilities anywhere in Alaska, but the saved body does not preserve explicit Protection and Advocacy designation text.',
        samples: [
          {
            sample_name: 'Disability Law Center of Alaska',
            source_url: 'http://www.dlcak.org/',
            final_url: 'https://www.dlcak.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:45:32.471Z',
            evidence_snippet: 'The Disability Law Center of Alaska is an independent non-profit law firm providing legal advocacy for people with disabilities anywhere in Alaska. Intake, Information, and Referral. Grievance Procedure.',
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
        query_basis: 'Reviewed first-party Stone Soup Group evidence on disk proves statewide parent-support and training scope, but the saved artifact does not preserve explicit PTI / Parent Training and Information designation text.',
        blocker_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        blocker_evidence: 'The reviewed Stone Soup Group artifact proves statewide family-support, training, and intake scope, but the saved body does not preserve explicit PTI / Parent Training and Information Center designation text.',
        samples: [
          {
            sample_name: 'Stone Soup Group',
            source_url: 'https://stonesoupgroup.org/',
            final_url: 'https://www.stonesoupgroup.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:07:56.336Z',
            evidence_snippet: 'Stone Soup Group is a statewide 501(c)(3) non-profit that provides information, support, training and resources to assist families caring for children with special needs.',
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
        query_basis: 'Reviewed first-party DLCAK artifact on disk explicitly proves statewide disability legal advocacy plus intake and grievance routes, which truthfully satisfies the statewide legal-aid family.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Law Center of Alaska',
            source_url: 'http://www.dlcak.org/',
            final_url: 'https://www.dlcak.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:45:32.471Z',
            evidence_snippet: 'The Disability Law Center of Alaska is an independent non-profit law firm providing legal advocacy for people with disabilities anywhere in Alaska. Online intake form. Grievance Procedure.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Alaska California-Grade Batch 13 Report v1',
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
    '- Alaska no longer belongs in UNSTARTED. Reviewed first-party DLCAK evidence on disk now truthfully upgrades statewide legal aid, and the remaining statewide support blockers are more exact than the old missing/inventory-only packet labels.',
    '- Disability Law Center of Alaska clearly proves statewide disability legal advocacy plus intake routing, but the saved artifact does not preserve explicit Protection and Advocacy designation text, so protection_and_advocacy remains blocked on evidence precision rather than missing-source absence.',
    '- Stone Soup Group is preserved as real reviewed statewide parent-support evidence, but the saved artifact still lacks explicit PTI / Parent Training and Information designation text, so the PTI family remains blocked rather than promoted by assumption.',
    '- Alaska still cannot reach California-grade or become index-safe because district or county education routing and county/local disability resources remain county-grade weak, and the statewide support families are not all fully proven at the required designation level.',
    '- Alaska is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch58AlaskaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const dlcakAccepted = findAcceptedRow(INPUTS.dlcakAccepted, 'alaska', 'dlcak.org');
  const stoneAccepted = findAcceptedRow(INPUTS.stoneAccepted, 'alaska', 'stonesoupgroup');
  const dlcakHtml = readText(INPUTS.dlcakHtml);
  const stoneHtml = readText(INPUTS.stoneHtml);

  if (!dlcakAccepted) {
    throw new Error('Missing Alaska DLCAK accepted artifact.');
  }
  if (!stoneAccepted) {
    throw new Error('Missing Alaska Stone Soup accepted artifact.');
  }

  assertIncludes(dlcakHtml, 'independent non-profit law firm providing legal advocacy for people with disabilities anywhere in Alaska', 'Alaska DLCAK first-party artifact');
  assertIncludes(dlcakHtml, 'Online intake form', 'Alaska DLCAK first-party artifact');
  assertIncludes(dlcakHtml, 'Grievance Procedure', 'Alaska DLCAK first-party artifact');

  assertIncludes(stoneHtml, 'statewide 501(c)3 non-profit that provides information, support, training and resources', 'Alaska Stone Soup first-party artifact');
  assertIncludes(stoneHtml, 'Supporting Alaskan families', 'Alaska Stone Soup first-party artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'blocked_reviewed_statewide_legal_advocacy_source_not_explicit_pa',
        status_reason: 'reviewed first-party statewide legal-advocacy evidence exists, but the saved artifact does not preserve explicit Protection and Advocacy designation text',
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
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        failure_code: 'reviewed_statewide_legal_advocacy_source_not_explicit_pa',
        evidence: 'Reviewed DLCAK evidence proves statewide disability legal advocacy plus intake routing, but the saved first-party artifact does not preserve explicit Protection and Advocacy designation text.',
        next_action: 'hold_blocked_until_explicit_pa_designation_is_preserved_from_reviewed_first_party_source',
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        evidence: 'Reviewed Stone Soup Group evidence proves statewide family-support, training, and intake scope, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.',
        next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
      };
    }
    return row;
  }).filter((row) => row.family !== 'legal_aid');

  const updatedVerifiedRows = buildVerifiedSourceRows(verifiedRows);

  const nextRowsByFamily = new Map();
  for (const row of nextRows) {
    if (!['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'].includes(row.family)) {
      nextRowsByFamily.set(row.family, row);
    }
  }
  nextRowsByFamily.set('protection_and_advocacy', {
      state: 'alaska',
      state_code: 'AK',
      family: 'protection_and_advocacy',
      severity: 'major',
      failure_code: 'reviewed_statewide_legal_advocacy_source_not_explicit_pa',
      next_action: 'hold_blocked_until_explicit_pa_designation_is_preserved_from_reviewed_first_party_source',
      evidence: 'Reviewed DLCAK evidence proves statewide disability legal advocacy plus intake routing, but the saved first-party artifact does not preserve explicit Protection and Advocacy designation text.',
    });
  nextRowsByFamily.set('parent_training_information_center', {
      state: 'alaska',
      state_code: 'AK',
      family: 'parent_training_information_center',
      severity: 'major',
      failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
      next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
      evidence: 'Reviewed Stone Soup Group evidence proves statewide family-support, training, and intake scope, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.',
    });

  const nextFamilyOrder = [
    'district_or_county_education_routing',
    'protection_and_advocacy',
    'parent_training_information_center',
    'county_local_disability_resources',
  ];
  const updatedNextRows = nextFamilyOrder
    .map((family) => nextRowsByFamily.get(family))
    .filter(Boolean)
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 67,
    strong_critical_families: 8,
    weak_critical_families: 3,
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
    batch: 'batch_58_alaska_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'alaska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'legal_aid',
      'protection_and_advocacy',
      'parent_training_information_center',
    ],
    remaining_blockers: updatedFailureRows.map((row) => row.family),
    evidence_checks: {
      dlcak: {
        sourceUrl: dlcakAccepted.sourceUrl,
        finalUrl: dlcakAccepted.finalUrl,
        pageTitle: dlcakAccepted.pageTitle,
      },
      stoneSoup: {
        sourceUrl: stoneAccepted.sourceUrl,
        finalUrl: stoneAccepted.finalUrl,
        pageTitle: stoneAccepted.pageTitle,
      },
    },
  };

  const batchReport = [
    '# Batch 58 Alaska Statewide Family Truth Refresh Report v1',
    '',
    '- state: alaska',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- updated_families: legal_aid, protection_and_advocacy, parent_training_information_center',
    '',
    '## Decision',
    '',
    '- Alaska had enough reviewed first-party evidence on disk to leave UNSTARTED and become truthfully terminal BLOCKED.',
    '- DLCAK now upgrades legal aid because the saved first-party artifact explicitly proves statewide disability legal advocacy plus intake and grievance routes.',
    '- DLCAK does not yet upgrade protection_and_advocacy because the saved artifact still lacks explicit Protection and Advocacy designation text.',
    '- Stone Soup Group is preserved as real statewide reviewed family-support evidence, but it does not yet upgrade PTI because the saved artifact lacks explicit PTI designation text.',
    '- County-grade education routing and county/local disability resources remain the final critical county-grade blockers.',
  ].join('\n') + '\n';

  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.report, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = generateBatch58AlaskaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(summary, null, 2));
}
