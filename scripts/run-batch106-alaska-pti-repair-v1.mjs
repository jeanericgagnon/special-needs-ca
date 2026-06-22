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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch106_alaska_pti_repair_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch106-alaska-pti-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
};

const PTI_STATUS_REASON = 'Reviewed authoritative Parent Center Hub Alaska leaf explicitly labels Stone Soup Group as Alaska PTI and preserves statewide Alaska contact evidence, so the PTI family is now verified even though Stone Soup Group’s own first-party pages still emphasize support scope instead of repeating the PTI designation.';
const PTI_EVIDENCE = 'Reviewed 2026-06-22 live authoritative Parent Center Hub Alaska leaf https://www.parentcenterhub.org/findurcenter/alaska/ plus Stone Soup Group first-party pages. The Alaska leaf explicitly labels "Alaska PTI" and names Stone Soup Group with Anchorage address 307 E. Northern Lights Blvd., Suite 100, Anchorage, AK 99503, phone (877) 786-7327 / (907) 561-3701, email info@stonesoupgroup.org, and website http://www.stonesoupgroup.org. This now preserves authoritative explicit Alaska PTI designation text that the Stone Soup first-party pages themselves still do not repeat.';
const COUNTY_STATUS_REASON = 'Official Alaska DPA/SDS office-location, default, contact, and legacy dhss.alaska.gov alias roots all resolve to the same Cloudflare "Just a moment..." HTTP 403 shell in the current lane, so county-grade local-office evidence remains blocked at the domain level.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 live official Alaska DPA and SDS office-directory candidates on health.alaska.gov, including office-locations, default, and contact roots, plus legacy dhss.alaska.gov aliases that now redirect back to the same health.alaska.gov surfaces. Every checked office candidate returned HTTP 403 with the Cloudflare "Just a moment..." shell, so county-grade local-office evidence is blocked at the domain level rather than at one stale page.';
const LESSON_HEADING = '### Parent Center Hub State Leafs Can Close PTI Gaps When First-Party Pages Omit The Label';
const LESSON_BODY = '*   **Lesson:** When a state parent-center organization’s own site preserves real statewide support scope but not the PTI label, check the exact Parent Center Hub state leaf at `/findurcenter/<state>/`. Those reviewed state leaves can preserve the authoritative `State PTI` or `CPRC` designation plus the named organization and contact block without reopening broad directory discovery.';

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

function appendLessonIfMissing() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) {
    return;
  }
  const addition = `\n${LESSON_HEADING}\n${LESSON_BODY}\n`;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n${addition}`);
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
    '- Parent training and information center is now verified from the authoritative Parent Center Hub Alaska leaf, which explicitly labels Stone Soup Group as Alaska PTI and preserves Alaska contact evidence.',
    `- County-local disability resources remain blocked because ${COUNTY_EVIDENCE.toLowerCase()}`,
    '- Alaska is therefore still BLOCKED and not index-safe because one critical county-local family remains unresolved, but the PTI blocker is now cleared.',
  ].join('\n') + '\n';
}

export function generateBatch106AlaskaPtiRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: PTI_STATUS_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        status_reason: COUNTY_STATUS_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => row.family !== 'parent_training_information_center')
    .map((row) => {
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
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed authoritative Parent Center Hub Alaska leaf explicitly labels Stone Soup Group as Alaska PTI and preserves statewide Alaska contact evidence.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Parent Center Hub Alaska PTI listing',
            source_url: 'https://www.parentcenterhub.org/findurcenter/alaska/',
            final_url: 'https://www.parentcenterhub.org/findurcenter/alaska/',
            verification_status: 'verified',
            source_type: 'authoritative_directory',
            source_table: 'reviewed_authoritative_artifact',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Alaska PTI. Stone Soup Group. 307 E. Northern Lights Blvd., Suite 100 Anchorage, AK 99503. (877) 786-7327 (in AK) | (907) 561-3701. info@stonesoupgroup.org. http://www.stonesoupgroup.org.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        query_basis: 'Reviewed live official Alaska DPA/SDS office-location, default, contact, and legacy dhss.alaska.gov alias roots; all resolved to the same Cloudflare "Just a moment..." HTTP 403 shell in the current lane.',
        blocker_evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'parent_training_information_center')
    .map((row) => {
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
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: 'official_local_directory_challenge_blocks_reviewed_county_grade_evidence',
    critical_gap_families: ['county_local_disability_resources'],
    major_gap_families: [],
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: 'official_local_directory_challenge_blocks_reviewed_county_grade_evidence',
        evidence: COUNTY_EVIDENCE,
      },
    ],
  };

  const updatedQueueRows = queueRows.map((row) => {
    if (row.state === 'alaska') {
      return {
        ...row,
        completeness_pct: 91,
        weak_critical_families: 1,
        primary_gap_reason: 'official_local_directory_challenge_blocks_reviewed_county_grade_evidence',
      };
    }
    return row;
  });

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.summary, updatedSummary);
  appendLessonIfMissing();

  writeJson(OUTPUTS.summary, {
    batch: 'batch_106_alaska_pti_repair_v1',
    generated_at: '2026-06-22T19:30:00.000Z',
    state: 'alaska',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    repaired_family: 'parent_training_information_center',
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
      '# Alaska PTI Repair Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- repaired_family: parent_training_information_center',
      '- remaining_blockers: county_local_disability_resources',
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
  generateBatch106AlaskaPtiRepairV1();
}
