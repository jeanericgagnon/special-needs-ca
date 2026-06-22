import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'arizona_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'arizona_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'arizona_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'arizona_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'arizona_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
  drazAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-33-048Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  drazHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-33-048Z', 'pages', '00009-arizona-nonprofit-support-disabilityrightsaz-org.html'),
  encircleAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-42-308Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  encircleHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-45-42-308Z', 'pages', '00004-arizona-nonprofit-support-raisingspecialkids-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch59_arizona_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch59-arizona-statewide-family-truth-refresh-report-v1.md'),
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
        query_basis: 'Reviewed first-party Disability Rights Arizona evidence on disk explicitly preserves federally mandated Protection and Advocacy designation text for Arizona.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Arizona',
            source_url: 'http://www.disabilityrightsaz.org/',
            final_url: 'https://disabilityrightsaz.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:46:33.381Z',
            evidence_snippet: 'DRAZ is the federally mandated protection and advocacy system for Arizona.',
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
        query_basis: 'Reviewed first-party Encircle Families evidence on disk proves real statewide parent-support and training scope, but the saved artifact does not preserve explicit PTI / Parent Training and Information designation text.',
        blocker_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        blocker_evidence: 'The reviewed Encircle Families artifact preserves Arizona family-support and training evidence, but not explicit PTI / Parent Training and Information Center designation text.',
        samples: [
          {
            sample_name: 'Encircle Families',
            source_url: 'https://raisingspecialkids.org/',
            final_url: 'https://encirclefamilies.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:45:47.808Z',
            evidence_snippet: 'A non-profit dedicated to supporting parents and caregivers raising children with disabilities. We offer resources, advocacy, and a community to help families thrive.',
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
        query_basis: 'Reviewed first-party Disability Rights Arizona evidence on disk explicitly preserves statewide disability legal-services language plus assistance intake routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Rights Arizona',
            source_url: 'http://www.disabilityrightsaz.org/',
            final_url: 'https://disabilityrightsaz.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:46:33.381Z',
            evidence_snippet: 'Disability Rights Arizona offers free legal services for Arizonans with disabilities. Apply for Assistance.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Arizona California-Grade Batch 16 Report v1',
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
    '- Arizona no longer belongs in UNSTARTED. Reviewed first-party Disability Rights Arizona evidence on disk now truthfully upgrades Protection and Advocacy and statewide disability legal aid from stale missing packet states.',
    '- Disability Rights Arizona is explicit enough for Protection and Advocacy because the saved first-party artifact preserves that DRAZ is the federally mandated protection and advocacy system for Arizona, and it is explicit enough for statewide legal aid because the same saved artifact preserves free legal-services language plus a live assistance intake path.',
    '- Encircle Families is preserved as real reviewed statewide parent-support evidence for Arizona, but the saved artifact still lacks explicit PTI / Parent Training and Information designation text, so the PTI family remains blocked rather than upgraded by assumption.',
    '- Arizona still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or statewide locator-style evidence, and PTI is not yet explicitly proven at the required designation level.',
    '- Arizona is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch59ArizonaStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const drazAccepted = findAcceptedRow(INPUTS.drazAccepted, 'arizona', 'disabilityrightsaz');
  const encircleAccepted = findAcceptedRow(INPUTS.encircleAccepted, 'arizona', 'raisingspecialkids');
  const drazHtml = readText(INPUTS.drazHtml);
  const encircleHtml = readText(INPUTS.encircleHtml);

  if (!drazAccepted) {
    throw new Error('Missing Arizona Disability Rights Arizona accepted artifact.');
  }
  if (!encircleAccepted) {
    throw new Error('Missing Arizona Encircle Families accepted artifact.');
  }

  assertIncludes(drazHtml, 'Disability Rights Arizona offers free legal services for Arizonans with disabilities.', 'Arizona Disability Rights Arizona artifact');
  assertIncludes(drazHtml, 'DRAZ is the federally mandated protection and advocacy system for Arizona', 'Arizona Disability Rights Arizona artifact');
  assertIncludes(drazHtml, 'Apply for Assistance', 'Arizona Disability Rights Arizona artifact');

  assertIncludes(encircleHtml, 'supporting parents &amp; caregivers raising children with disabilities', 'Arizona Encircle Families artifact');
  assertIncludes(encircleHtml, 'IEP Training', 'Arizona Encircle Families artifact');
  assertIncludes(encircleHtml, '5025 E Washington St UNIT 204', 'Arizona Encircle Families artifact');

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
        evidence: 'Reviewed Encircle Families evidence proves Arizona parent-support and training scope, but the saved first-party artifact does not preserve explicit PTI / Parent Training and Information designation text.',
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
    state: 'arizona',
    state_code: 'AZ',
    priority_rank: 2,
    family: 'parent_training_information_center',
    severity: 'major',
    failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
    next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
    evidence: 'Reviewed Encircle Families evidence preserves Arizona parent-support and training scope, but the saved first-party artifact does not preserve explicit PTI designation text.',
  });

  const updatedNextRows = [...nextRowsByFamily.values()]
    .sort((a, b) => a.priority_rank - b.priority_rank);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 75,
    strong_critical_families: 9,
    weak_critical_families: 3,
    missing_critical_families: 0,
    major_gap_families: ['parent_training_information_center'],
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch_59_arizona_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'legal_aid',
      'parent_training_information_center',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      disabilityRightsArizona: {
        sourceUrl: 'http://www.disabilityrightsaz.org/',
        finalUrl: 'https://disabilityrightsaz.org/',
        pageTitle: drazAccepted.pageTitle || '',
      },
      encircleFamilies: {
        sourceUrl: 'https://raisingspecialkids.org/',
        finalUrl: 'https://encirclefamilies.org/',
        pageTitle: encircleAccepted.pageTitle || '',
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
    '# Batch 59 Arizona Statewide Family Truth Refresh Report v1',
    '',
    '- state: arizona',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- updated_families: protection_and_advocacy, legal_aid, parent_training_information_center',
    '',
    '## Decision',
    '',
    '- Arizona had enough reviewed first-party evidence on disk to leave UNSTARTED and become truthfully terminal BLOCKED.',
    '- Disability Rights Arizona now upgrades protection_and_advocacy because the saved first-party artifact explicitly preserves that DRAZ is the federally mandated protection and advocacy system for Arizona.',
    '- Disability Rights Arizona also upgrades legal_aid because the saved first-party artifact explicitly preserves statewide free legal-services language plus an Apply for Assistance intake path.',
    '- Encircle Families is preserved as real statewide reviewed parent-support evidence, but it does not yet upgrade PTI because the saved artifact lacks explicit PTI designation text.',
    '- County-grade education routing and county/local disability resources remain the final critical county-grade blockers.',
    '',
  ].join('\n'));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch59ArizonaStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
