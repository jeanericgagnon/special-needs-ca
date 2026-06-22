import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  driHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-56-734Z', 'pages', '00002-idaho-nonprofit-support-disabilityrightsidaho-org.html'),
  ipulAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-56-734Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  ipulHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-56-734Z', 'pages', '00003-idaho-nonprofit-support-ipulidaho-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch65_idaho_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch65-idaho-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
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
        query_basis: 'Reviewed first-party Disability Rights Idaho evidence on disk explicitly preserves Idaho Protection and Advocacy designation text plus statewide help-routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Idaho',
            source_url: 'https://disabilityrightsidaho.org/',
            final_url: 'https://www.disabilityrightsidaho.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:45:04.958Z',
            evidence_snippet: 'As the Protection and Advocacy agency for Idaho, DRI serves the whole state. We offer information and referrals to residents with disabilities.',
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
        query_basis: 'Reviewed first-party Idaho Parents Unlimited evidence on disk proves real statewide family-support, training, and disability-navigation scope, but the saved artifact does not preserve explicit PTI / Parent Training and Information designation text.',
        blocker_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        blocker_evidence: 'The reviewed Idaho Parents Unlimited artifact preserves statewide training, information, support, and direct contact routing, but not explicit PTI / Parent Training and Information Center designation text.',
        samples: [
          {
            sample_name: 'Idaho Parents Unlimited',
            source_url: 'https://ipulidaho.org/',
            final_url: 'https://ipulidaho.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:45:05.058Z',
            evidence_snippet: 'We help families of children and youth with disabilities thrive by providing training, information, and support with a focus on special education, health information, and children’s behavioral health. Phone: (208) 342-5884. Email: parents@ipulidaho.org.',
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
        query_basis: 'Reviewed first-party Disability Rights Idaho evidence on disk explicitly preserves free legal services, attorneys, and statewide disability-rights representation routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Idaho',
            source_url: 'https://disabilityrightsidaho.org/',
            final_url: 'https://www.disabilityrightsidaho.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:45:04.958Z',
            evidence_snippet: 'We also offer free legal services. DRI’s attorneys can provide representation to individuals with disabilities in negotiations, mediations, or by filing complaints or a lawsuit.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Batch 65 Report v1',
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
    '- Idaho no longer belongs in UNSTARTED. Reviewed first-party Disability Rights Idaho and Idaho Parents Unlimited evidence already on disk now truthfully repairs the statewide support families that were previously left as missing or inventory-only.',
    '- Disability Rights Idaho is explicit enough for Protection and Advocacy because the reviewed first-party page preserves that DRI is the Protection and Advocacy agency for Idaho and serves the whole state.',
    '- Disability Rights Idaho is also explicit enough for statewide legal aid because the same reviewed first-party page preserves free legal services plus attorney and representation language for Idahoans with disabilities.',
    '- Idaho Parents Unlimited is preserved as real reviewed statewide family-support, training, and special-education help evidence, but the saved first-party artifact still does not preserve explicit PTI / Parent Training and Information designation text, so PTI remains blocked rather than being upgraded by assumption.',
    '- Idaho still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, county/local disability resources still depend on a generic statewide locator root rather than reviewed county leaves, and PTI remains below the explicit designation bar.',
    '- Idaho is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch65IdahoStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const ipulAccepted = findAcceptedRow(INPUTS.ipulAccepted, 'idaho', 'ipulidaho');
  const driHtml = readText(INPUTS.driHtml);
  const ipulHtml = readText(INPUTS.ipulHtml);

  if (!ipulAccepted) {
    throw new Error('Missing Idaho Parents Unlimited accepted artifact.');
  }

  assertIncludes(driHtml, 'As the Protection and Advocacy agency for Idaho, DRI serves the whole state.', 'Idaho Disability Rights Idaho artifact');
  assertIncludes(driHtml, 'We also offer free legal services.', 'Idaho Disability Rights Idaho artifact');
  assertIncludes(driHtml, 'DRI’s attorneys can provide representation to individuals with disabilities', 'Idaho Disability Rights Idaho artifact');

  assertIncludes(ipulHtml, 'We help families of children and youth with disabilities thrive', 'Idaho Parents Unlimited artifact');
  assertIncludes(ipulHtml, 'providing training, information, and support', 'Idaho Parents Unlimited artifact');
  assertIncludes(ipulHtml, 'Phone: (208) 342-5884', 'Idaho Parents Unlimited artifact');
  assertIncludes(ipulHtml, 'parents@ipulidaho.org', 'Idaho Parents Unlimited artifact');

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
        evidence: 'Reviewed Idaho Parents Unlimited evidence proves statewide family-support and training scope, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.',
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
    state: 'idaho',
    state_code: 'ID',
    priority_rank: 2,
    family: 'parent_training_information_center',
    severity: 'major',
    failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
    next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
    evidence: 'Reviewed Idaho Parents Unlimited evidence preserves Idaho family-support and training scope, but the saved first-party artifact does not preserve explicit PTI designation text.',
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
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'Reviewed Idaho packet evidence still routes district or county education through statewide Idaho SDE fallback pages rather than county- or district-owned leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'parent_training_information_center',
        severity: 'major',
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        evidence: 'Reviewed Idaho Parents Unlimited evidence proves statewide family-support and training scope, but the saved first-party artifact does not preserve explicit PTI designation text.',
        next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'County/local disability resources still depend on the generic statewide DHHS locations root instead of reviewed county-specific local-office leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch_65_idaho_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'idaho',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'legal_aid',
      'parent_training_information_center',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      disabilityRightsIdaho: {
        sourceUrl: 'https://disabilityrightsidaho.org/',
        finalUrl: 'https://www.disabilityrightsidaho.org/',
      },
      idahoParentsUnlimited: {
        sourceUrl: 'https://ipulidaho.org/',
        finalUrl: 'https://ipulidaho.org/',
        pageTitle: ipulAccepted.pageTitle || '',
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
    '# Batch 65 Idaho Statewide Family Truth Refresh',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- Disability Rights Idaho: ${batchSummary.evidence_checks.disabilityRightsIdaho.sourceUrl}`,
    `- Idaho Parents Unlimited: ${batchSummary.evidence_checks.idahoParentsUnlimited.sourceUrl}`,
  ].join('\n') + '\n');

  return {
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: batchSummary.updated_families,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch65IdahoStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
