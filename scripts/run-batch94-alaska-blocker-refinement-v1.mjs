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
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch94_alaska_blocker_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch94-alaska-blocker-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
};

const PTI_EVIDENCE = 'Reviewed 2026-06-22 Stone Soup Group sitemap plus exact history/mission, parent-navigation, FAQ, and family-resource-guide leaves. The live sitemap exposes real support/history/navigation pages, but no role-pure PTI leaf, while guessed PTI-style roots and generic About roots return 404. No fetched live first-party page preserves explicit PTI / Parent Training and Information Center designation text.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 official Alaska DPA and SDS office-directory candidates plus health.alaska.gov robots.txt and sitemap endpoints. The office leaves, robots.txt, and sitemap URLs all returned Cloudflare security-verification or 403 shells, so the local-office blocker is domain-wide in the current fetch lane rather than one broken page.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Alaska California-Grade Audit Report v2',
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
    '## Repair decision',
    '',
    '- District or county education routing is verified from the official Alaska DEED district-profiles directory, district map, and district detail leaves.',
    '- Protection and advocacy remains verified from the DLCAK first-party funding and statewide advocacy pages.',
    `- Parent training and information center remains blocked because ${PTI_EVIDENCE.toLowerCase()}`,
    `- County-local disability resources remain blocked because ${COUNTY_EVIDENCE.toLowerCase()}`,
    '- Alaska is therefore still BLOCKED and not index-safe, but the remaining blockers are now narrower and more exact.',
  ].join('\n') + '\n';
}

export function generateBatch94AlaskaBlockerRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        status_reason: 'Reviewed Stone Soup sitemap and exact live support/history/navigation leaves preserve statewide support scope, but no fetched first-party page preserves explicit PTI designation text and guessed PTI-style roots are absent or 404.',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        status_reason: 'Official Alaska DPA/SDS office leaves plus health.alaska.gov robots.txt and sitemap endpoints all return Cloudflare or 403 shells in the current lane, so county-grade local-office evidence remains unreviewed.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        evidence: PTI_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        query_basis: 'Reviewed 2026-06-22 Stone Soup sitemap and exact live support/history/navigation leaves preserve statewide support scope, but no fetched live first-party page preserves explicit PTI designation text.',
        blocker_evidence: PTI_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed official Alaska DPA/SDS office leaves plus health.alaska.gov robots.txt and sitemap endpoints; all returned Cloudflare or 403 shells in the current lane.',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        evidence: PTI_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: 'official_local_directory_challenge_blocks_reviewed_county_grade_evidence',
        evidence: COUNTY_EVIDENCE,
      },
      {
        family: 'parent_training_information_center',
        failure_code: 'reviewed_first_party_support_source_lacks_explicit_pti_designation',
        evidence: PTI_EVIDENCE,
      },
    ],
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_94_alaska_blocker_refinement_v1',
    generated_at: '2026-06-22T15:15:00.000Z',
    state: 'alaska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    refined_families: ['parent_training_information_center', 'county_local_disability_resources'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      pti: PTI_EVIDENCE,
      countyLocal: COUNTY_EVIDENCE,
    },
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Alaska Blocker Refinement Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- refined_families: parent_training_information_center, county_local_disability_resources',
      '',
      '## Evidence checks',
      '',
      `- pti: ${PTI_EVIDENCE}`,
      `- county_local: ${COUNTY_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch94AlaskaBlockerRefinementV1();
}
