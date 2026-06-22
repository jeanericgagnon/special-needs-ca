import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'hawaii_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'hawaii_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'hawaii_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'hawaii_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'hawaii_next_action_queue_v2.jsonl'),
  hdrcAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-46-03-905Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  hdrcHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-46-03-905Z', 'pages', '00006-hawaii-nonprofit-support-hawaiidisabilityrights-org.html'),
  ldahParsedSamples: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-10-58-145Z', 'parsed', 'nonprofit_support', 'samples.json'),
  ldahRejected: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-10-58-145Z', 'validated', 'nonprofit_support', 'rejected.ndjson'),
  ldahHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-10-58-145Z', 'pages', '00015-hawaii-nonprofit-support-leadership-in-disabilities-achievement-of-hawai-i-pti.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch64_hawaii_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch64-hawaii-statewide-family-truth-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'hawaii-california-grade-audit-report-v2.md'),
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

function findJsonSample(filePath, recordIdFragment) {
  return readJson(filePath).find((row) => String(row.recordId || '').includes(recordIdFragment)) || null;
}

function buildVerifiedRows(existingRows) {
  return existingRows.map((row) => {
    if (row.family === 'protection_and_advocacy') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed first-party Hawaii Disability Rights Center evidence on disk explicitly preserves statewide Hawaii protection-and-advocacy language plus direct assistance routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Hawaii Disability Rights Center',
            source_url: 'http://www.hawaiidisabilityrights.org/',
            final_url: 'https://hawaiidisabilityrights.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:46:10.794Z',
            evidence_snippet: 'The Hawaii Disability Rights Center was created to provide protection and advocacy for people with disabilities through a variety of programs and services. Apply for Assistance.',
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
        query_basis: 'Reviewed first-party LDAH evidence on disk explicitly preserves Hawai’i & Pacific Island Parent Training & Information Center designation text plus direct Hawaiʻi office contact details.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: "Leadership in Disabilities & Achievement of Hawai'i",
            source_url: 'http://www.ldahawaii.org/',
            final_url: 'https://www.ldahawaii.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:11:57.567Z',
            evidence_snippet: "Hawai'i & Pacific Island Parent Training & Information Center — empowering families and children with disabilities. Honolulu Office. rrowe@ldahawaii.org.",
          },
        ],
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'blocked_reviewed_statewide_support_source_not_explicit_legal_aid_route',
        evidence_strength: 'weak',
        sample_count: 1,
        query_basis: 'Reviewed first-party Hawaii Disability Rights Center evidence on disk proves statewide rights-routing and assistance intake, but the saved artifact does not preserve an explicit statewide legal-aid or legal-representation route.',
        blocker_code: 'reviewed_statewide_support_source_not_explicit_legal_aid_route',
        blocker_evidence: 'The reviewed Hawaii Disability Rights Center artifact preserves protection-and-advocacy and apply-for-assistance routing, but not an explicit statewide legal-aid route.',
        samples: [
          {
            sample_name: 'Hawaii Disability Rights Center',
            source_url: 'http://www.hawaiidisabilityrights.org/',
            final_url: 'https://hawaiidisabilityrights.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:46:10.794Z',
            evidence_snippet: 'Our casework includes issues related to abuse and neglect, community integration, education, employment, housing, and individual justice. Apply for Assistance.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Hawaii California-Grade Batch 64 Report v1',
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
    '- Hawaii no longer belongs in UNSTARTED. Reviewed first-party Hawaii Disability Rights Center and LDAH evidence already on disk now truthfully upgrades statewide Protection and Advocacy plus the Parent Training and Information Center from stale missing or inventory-only packet states.',
    '- Hawaii Disability Rights Center is explicit enough for Protection and Advocacy because the saved first-party artifact preserves that the organization was created to provide protection and advocacy for people with disabilities in Hawaii and exposes direct apply-for-assistance routing.',
    "- LDAH is explicit enough for PTI because the saved first-party artifact preserves Hawai'i & Pacific Island Parent Training & Information Center designation text and direct Honolulu office contact details, even though the lightweight parser originally rejected the page after missing contact signals rendered through injected footer markup.",
    '- Hawaii legal aid remains blocked because the reviewed Hawaii Disability Rights Center homepage preserves rights, casework, and assistance-routing language, but it does not preserve an explicit statewide legal-aid or legal-representation route strong enough to satisfy the legal-aid family by itself.',
    '- Hawaii still cannot reach California-grade or become index-safe because statewide special-education authority remains legacy-only, district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or statewide locator-style evidence, and statewide legal aid still lacks a reviewed first-party legal-help route.',
    '- Hawaii is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch64HawaiiStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const hdrcAccepted = findAcceptedRow(INPUTS.hdrcAccepted, 'hawaii', 'hawaiidisabilityrights');
  const ldahRejected = findAcceptedRow(INPUTS.ldahRejected, 'hawaii', 'ldahawaii');
  const ldahParsedSample = findJsonSample(INPUTS.ldahParsedSamples, '00015-hawaii-nonprofit-support-leadership-in-disabilities-achievement-of-hawai-i-pti');
  const hdrcHtml = readText(INPUTS.hdrcHtml);
  const ldahHtml = readText(INPUTS.ldahHtml);

  if (!hdrcAccepted) {
    throw new Error('Missing Hawaii Disability Rights Center accepted artifact.');
  }
  if (!ldahRejected || !ldahParsedSample) {
    throw new Error('Missing Hawaii LDAH parsed or rejected artifact.');
  }

  assertIncludes(hdrcAccepted.paragraphs.join(' '), 'created to provide protection and advocacy for people with disabilities', 'Hawaii HDRC accepted artifact');
  assertIncludes(hdrcAccepted.paragraphs.join(' '), 'APPLY FOR ASSISTANCE', 'Hawaii HDRC accepted artifact');
  assertIncludes(hdrcAccepted.paragraphs.join(' '), '1001 Bishop St, Ste 1110', 'Hawaii HDRC accepted artifact');

  assertIncludes(ldahHtml, 'Parent Training & Information Center', 'Hawaii LDAH artifact');
  assertIncludes(ldahHtml, 'Honolulu Office', 'Hawaii LDAH artifact');
  assertIncludes(ldahHtml, 'rrowe@ldahawaii.org', 'Hawaii LDAH artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy' || row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party statewide support evidence is present at the required authority level',
      };
    }
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'blocked_reviewed_statewide_support_source_not_explicit_legal_aid_route',
        status_reason: 'reviewed first-party statewide support evidence exists, but the saved artifact does not preserve an explicit statewide legal-aid route',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'legal_aid') {
      return {
        ...row,
        failure_code: 'reviewed_statewide_support_source_not_explicit_legal_aid_route',
        evidence: 'Reviewed Hawaii Disability Rights Center evidence proves statewide rights-routing, casework scope, and apply-for-assistance routing, but the saved first-party artifact does not preserve an explicit statewide legal-aid or legal-representation statement strong enough to satisfy the legal-aid family.',
        next_action: 'hold_blocked_until_reviewed_first_party_legal_help_route_is_verified',
      };
    }
    return row;
  }).filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family));

  const updatedVerifiedRows = buildVerifiedRows(verifiedRows);

  const nextRowsByFamily = new Map();
  for (const row of nextRows) {
    if (!['protection_and_advocacy', 'parent_training_information_center', 'legal_aid'].includes(row.family)) {
      nextRowsByFamily.set(row.family, row);
    }
  }
  nextRowsByFamily.set('legal_aid', {
    state: 'hawaii',
    state_code: 'HI',
    priority_rank: 3,
    family: 'legal_aid',
    severity: 'major',
    failure_code: 'reviewed_statewide_support_source_not_explicit_legal_aid_route',
    next_action: 'hold_blocked_until_reviewed_first_party_legal_help_route_is_verified',
    evidence: 'Reviewed Hawaii Disability Rights Center evidence proves statewide rights-routing, casework scope, and apply-for-assistance routing, but the saved first-party artifact does not preserve an explicit statewide legal-aid route.',
  });
  const updatedNextRows = Array.from(nextRowsByFamily.values())
    .sort((a, b) => a.priority_rank - b.priority_rank)
    .map((row, index) => ({ ...row, priority_rank: index + 1 }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 67,
    strong_critical_families: 8,
    weak_critical_families: 3,
    missing_critical_families: 1,
    primary_gap_reason: 'generic_or_statewide_evidence_used_where_local_required',
    major_gap_families: [
      'special_education_idea_part_b',
      'legal_aid',
    ],
    final_blockers: [
      {
        family: 'special_education_idea_part_b',
        severity: 'major',
        failure_code: 'legacy_or_inventory_only_evidence',
        evidence: 'Hawaii still relies on legacy statewide special-education evidence rather than a reviewed exact first-party IDEA Part B authority leaf.',
        next_action: 'author_verified_state_manifest',
      },
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'District or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves for Hawaii’s counties.',
        next_action: 'author_county_or_district_exact_targets',
      },
      {
        family: 'legal_aid',
        severity: 'major',
        failure_code: 'reviewed_statewide_support_source_not_explicit_legal_aid_route',
        evidence: 'Reviewed Hawaii Disability Rights Center evidence proves statewide rights-routing and assistance intake, but it does not preserve an explicit statewide legal-aid route.',
        next_action: 'hold_blocked_until_reviewed_first_party_legal_help_route_is_verified',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'generic_or_statewide_evidence_used_where_local_required',
        evidence: 'County/local disability resources still depend on generic statewide locator-style evidence instead of reviewed county-specific leaves.',
        next_action: 'author_county_or_district_exact_targets',
      },
    ],
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch_64_hawaii_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'hawaii',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
      'legal_aid',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      hdrc: {
        sourceUrl: 'http://www.hawaiidisabilityrights.org/',
        finalUrl: 'https://hawaiidisabilityrights.org/',
        pageTitle: hdrcAccepted.pageTitle || '',
      },
      ldah: {
        sourceUrl: 'http://www.ldahawaii.org/',
        finalUrl: 'https://www.ldahawaii.org/',
        pageTitle: ldahParsedSample.pageTitle || '',
        validationStatus: ldahRejected.validationStatus || '',
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
    '# Batch 64 Hawaii Statewide Family Truth Refresh',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- updated_families: ${batchSummary.updated_families.join(', ')}`,
    `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    '',
    '## Evidence checks',
    '',
    `- Hawaii Disability Rights Center: ${batchSummary.evidence_checks.hdrc.sourceUrl}`,
    `- LDAH: ${batchSummary.evidence_checks.ldah.sourceUrl}`,
  ].join('\n') + '\n');

  return {
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: batchSummary.updated_families,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch64HawaiiStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
