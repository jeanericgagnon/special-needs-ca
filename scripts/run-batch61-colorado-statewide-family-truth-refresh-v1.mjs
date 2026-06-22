import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'colorado_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'colorado_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'colorado_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'colorado_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'colorado_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'colorado-california-grade-audit-report-v2.md'),
  pnaHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-35-749Z', 'pages', '00009-colorado-nonprofit-support-disabilitylawco-org.html'),
  ptiAccepted: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-42-022Z', 'validated', 'nonprofit_support', 'accepted.ndjson'),
  ptiHtml: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-20T00-44-42-022Z', 'pages', '00004-colorado-nonprofit-support-peakparent-org.html'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch61_colorado_statewide_family_truth_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch61-colorado-statewide-family-truth-refresh-report-v1.md'),
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
        query_basis: 'Reviewed first-party Disability Justice / Disability Law Colorado evidence on disk explicitly preserves Colorado Protection and Advocacy designation text.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Disability Justice',
            source_url: 'https://disabilitylawco.org/',
            final_url: 'https://disabilityjustice.co/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:36.212Z',
            evidence_snippet: 'Our team of advocates, attorneys, and investigators forms Colorado’s Protection and Advocacy system.',
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
        query_basis: 'Reviewed first-party PEAK Parent Center evidence on disk explicitly preserves Parent Center / PTI scope and statewide Colorado family support.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'PEAK Parent Center',
            source_url: 'https://peakparent.org',
            final_url: 'https://www.peakparent.org/',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-20T00:44:42.403Z',
            evidence_snippet: 'Welcome to PEAK Parent Center. A Parent Center founded in 1986, PEAK offers an array of free and low-cost services to families of children with disabilities and self-advocates across Colorado and beyond.',
          },
        ],
      };
    }
    return row;
  });
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Colorado California-Grade Batch 11 Report v1',
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
    '- Colorado no longer belongs in UNSTARTED. Reviewed first-party Disability Justice and PEAK Parent Center evidence on disk now truthfully upgrades Protection and Advocacy and the Parent Training & Information Center from stale missing or inventory-only packet states.',
    '- Disability Justice is explicit enough for Protection and Advocacy because the saved first-party artifact preserves that its team forms Colorado’s Protection and Advocacy system.',
    '- PEAK Parent Center is explicit enough for PTI because the saved first-party artifact preserves Parent Center identity, Colorado family-support scope, and free or low-cost services for families of children with disabilities across Colorado and beyond.',
    '- Colorado legal aid remains blocked because the reviewed Disability Justice homepage preserves statewide advocacy and a Request Support path, but it does not yet preserve an explicit statewide legal-aid or legal-representation routing statement strongly enough to satisfy the legal-aid family by itself.',
    '- Colorado still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence instead of county- or district-owned leaves, county/local disability resources still depend on generic or statewide locator-style evidence, and statewide legal aid still lacks a reviewed first-party legal-help route.',
    '- Colorado is therefore terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export function generateBatch61ColoradoStatewideFamilyTruthRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const ptiAccepted = findAcceptedRow(INPUTS.ptiAccepted, 'colorado', 'peakparent');
  const pnaHtml = readText(INPUTS.pnaHtml);
  const ptiHtml = readText(INPUTS.ptiHtml);

  if (!ptiAccepted) {
    throw new Error('Missing Colorado PEAK Parent Center accepted artifact.');
  }

  assertIncludes(pnaHtml, 'forms Colorado’s <a href="https://www.ndrn.org/">Protection and Advocacy system</a>', 'Colorado Disability Justice artifact');
  assertIncludes(pnaHtml, 'Request support', 'Colorado Disability Justice artifact');
  assertIncludes(pnaHtml, 'advocates, attorneys, and investigators', 'Colorado Disability Justice artifact');

  assertIncludes(ptiHtml, 'PEAK Parent Center', 'Colorado PEAK Parent Center artifact');
  assertIncludes(ptiHtml, 'A Parent Center founded in 1986', 'Colorado PEAK Parent Center artifact');
  assertIncludes(ptiHtml, 'across Colorado and beyond', 'Colorado PEAK Parent Center artifact');

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'protection_and_advocacy' || row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed first-party statewide support evidence is present at the required authority level',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'legal_aid') {
      return {
        ...row,
        failure_code: 'reviewed_statewide_support_source_not_explicit_legal_aid_route',
        evidence: 'Reviewed Disability Justice evidence proves Colorado P&A scope and a Request Support path, but the saved first-party artifact does not preserve an explicit statewide legal-aid or legal-representation routing statement strong enough to satisfy the legal-aid family.',
        next_action: 'hold_blocked_until_reviewed_first_party_legal_help_route_is_verified',
      };
    }
    return row;
  }).filter((row) => !['protection_and_advocacy', 'parent_training_information_center'].includes(row.family));

  const updatedVerifiedRows = buildVerifiedRows(verifiedRows);

  const nextRowsByFamily = new Map();
  for (const row of nextRows) {
    if (!['protection_and_advocacy', 'parent_training_information_center'].includes(row.family)) {
      nextRowsByFamily.set(row.family, row);
    }
  }
  nextRowsByFamily.set('legal_aid', {
    state: 'colorado',
    state_code: 'CO',
    priority_rank: 3,
    family: 'legal_aid',
    severity: 'major',
    failure_code: 'reviewed_statewide_support_source_not_explicit_legal_aid_route',
    next_action: 'hold_blocked_until_reviewed_first_party_legal_help_route_is_verified',
    evidence: 'Reviewed Disability Justice evidence proves Colorado P&A scope and a Request Support path, but the saved first-party artifact does not preserve an explicit statewide legal-aid or legal-representation routing statement strong enough to satisfy the legal-aid family.',
  });

  const updatedNextRows = [...nextRowsByFamily.values()]
    .sort((a, b) => a.priority_rank - b.priority_rank);

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 75,
    strong_critical_families: 9,
    weak_critical_families: 2,
    missing_critical_families: 1,
    major_gap_families: ['legal_aid'],
  };

  const updatedReport = buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  const batchSummary = {
    batch: 'batch_61_colorado_statewide_family_truth_refresh_v1',
    generated_at: '2026-06-21T00:00:00.000Z',
    state: 'colorado',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: [
      'protection_and_advocacy',
      'parent_training_information_center',
    ],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      disabilityJustice: {
        sourceUrl: 'https://disabilitylawco.org/',
        finalUrl: 'https://disabilityjustice.co/',
        pageTitle: 'Protecting Rights, Advancing Justice | Disability Justice',
      },
      peakParentCenter: {
        sourceUrl: 'https://peakparent.org',
        finalUrl: 'https://www.peakparent.org/',
        pageTitle: ptiAccepted.pageTitle || '',
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
    '# Batch 61 Colorado Statewide Family Truth Refresh Report v1',
    '',
    '- state: colorado',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- updated_families: protection_and_advocacy, parent_training_information_center',
    '',
    '## Decision',
    '',
    '- Colorado had enough reviewed first-party evidence on disk to leave UNSTARTED and become truthfully terminal BLOCKED.',
    '- Disability Justice now upgrades protection_and_advocacy because the saved first-party artifact explicitly preserves that its team forms Colorado’s Protection and Advocacy system.',
    '- PEAK Parent Center now upgrades PTI because the saved first-party artifact explicitly preserves Parent Center identity, Colorado statewide family support, and free or low-cost services.',
    '- Legal aid stays blocked because the reviewed Disability Justice homepage does not yet preserve an explicit statewide legal-aid or legal-representation routing statement strong enough to satisfy that family by itself.',
    '- County-grade education routing and county/local disability resources remain the final critical county-grade blockers.',
    '',
  ].join('\n'));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch61ColoradoStatewideFamilyTruthRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
