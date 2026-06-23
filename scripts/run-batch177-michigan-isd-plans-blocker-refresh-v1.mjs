import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'michigan_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'michigan_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'michigan_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'michigan_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'michigan_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch177_michigan_isd_plans_blocker_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch177-michigan-isd-plans-blocker-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'michigan-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON =
  'official_mde_isd_plans_page_is_guidance_only_and_arcgis_layers_still_lack_local_routing_contract';

const STATUS_REASON =
  'Reviewed 2026-06-22/2026-06-23 the official Michigan MDE education lane more tightly: the live Special Education page and sitemap surface an exact ISD Plans leaf, but that page only publishes statewide planning guidance, a webinar link, and the generic school-district ArcGIS map. It does not enumerate district-owned special-education leaves, county-to-ISD routing, ISD contact directories, or a local education routing contract. The public ArcGIS district and ISD layers still expose geometry and identifier fields only, and the DB still carries 83 generic county fallback rows cloned from the statewide MDE Office of Special Education root, so Michigan remains blocked on district_or_county_education_routing.';

const BLOCKER_EVIDENCE =
  'Reviewed 2026-06-22/2026-06-23 the official Michigan MDE Special Education page, sitemap, ISD Plans leaf, and public ArcGIS district/ISD map stack. The exact leaf https://www.michigan.gov/mde/services/special-education/program-planning/isd-plans is live, titled "ISD Plans," and links only to statewide guidance PDF, a webinar, and the generic School District Maps app. It does not publish an ISD-by-ISD directory, county-to-ISD contract, district-owned special-education routing leaves, or local routing contacts. The public ArcGIS district and ISD layers still expose geometry and identifiers like FIPSCODE, DCODE, and ISD/ISDCode without routing contacts or local special-education evidence. A bounded DB check also shows 83 `official_verified` Michigan school_district rows named `Michigan Department of Education - Office of Special Education (<County> County fallback)` that all reuse the same statewide source URL `https://www.michigan.gov/mde/services/special-education`; those cloned statewide fallback rows do not satisfy county-grade routing evidence. Michigan therefore cannot pass county-grade education routing.';

const LESSON_HEADING =
  '### Guidance-Only ISD Planning Pages Do Not Satisfy Local Education Routing';
const LESSON_BODY =
  '*   **Lesson:** If a state special-education sitemap surfaces an exact ISD or district-planning leaf, inspect whether it actually enumerates local contacts or just publishes statewide guidance. Michigan’s live `ISD Plans` page only linked a guidance PDF, webinar, and generic map app, so it sharpened the blocker but still did not count as county-grade routing evidence.';

const FALLBACK_LESSON_HEADING =
  '### Cloned Statewide Education Fallback Rows Do Not Count As Local Routing Coverage';
const FALLBACK_LESSON_BODY =
  '*   **Lesson:** If a state packet still carries county-tagged district rows that all point to the same statewide special-education root, treat them as stale fallback inventory, not local routing progress. Michigan still had 83 `official_verified` county fallback rows cloned from the statewide MDE special-education page, and none of them counted toward county-grade education coverage.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  const additions = [];
  if (!current.includes(LESSON_HEADING)) additions.push(`${LESSON_HEADING}\n${LESSON_BODY}`);
  if (!current.includes(FALLBACK_LESSON_HEADING)) additions.push(`${FALLBACK_LESSON_HEADING}\n${FALLBACK_LESSON_BODY}`);
  if (!additions.length) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${additions.join('\n\n')}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Michigan California-Grade Audit Report v2',
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
    '- County-local disability resources still pass at county grade from the reviewed MDHHS county-office leaves.',
    '- District or county education routing remains blocked because the live MDE education lane now proves only statewide ISD-planning guidance plus a generic ArcGIS district/ISD map, not a county-grade local routing contract.',
    '- A bounded DB check also confirms the remaining 83 Michigan school-district rows are cloned `County fallback` records pointing at the statewide MDE special-education root, so they cannot be treated as local-routing coverage.',
    '- Michigan therefore remains `BLOCKED` and `index_safe=false` until the education-routing blocker is replaced with county-grade official routing evidence.',
  ].join('\n') + '\n';
}

export function generateBatch177MichiganIsdPlansBlockerRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, status_reason: STATUS_REASON }
      : row
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, evidence: BLOCKER_EVIDENCE }
      : row
  );

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          query_basis: 'Reviewed 2026-06-22/2026-06-23 the official Michigan MDE Special Education sitemap, ISD Plans leaf, the public district/ISD ArcGIS contract, and a bounded DB sample of cloned county fallback rows.',
          blocker_evidence: BLOCKER_EVIDENCE,
          sample_count: 5,
          samples: [
            ...(row.samples || []).slice(0, 4),
            {
              sample_name: 'Michigan county fallback school_district row sample',
              source_url: 'https://www.michigan.gov/mde/services/special-education',
              verification_status: 'blocked',
              source_type: 'generic_statewide_county_fallback_row',
              source_table: 'bounded_db_check',
              evidence_snippet: 'A bounded DB check found 83 Michigan school_district rows named `Michigan Department of Education - Office of Special Education (<County> County fallback)` that all reuse the statewide MDE special-education root with blank local contact fields.'
            }
          ]
        }
      : row
  );

  const updatedNextRows = nextRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? { ...row, evidence: BLOCKER_EVIDENCE }
      : row
  );

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'official_mde_isd_plans_guidance_only_and_arcgis_layers_lack_local_routing_contract',
        evidence: BLOCKER_EVIDENCE,
        next_action: 'hold_blocked_until_official_district_or_isd_routing_contract_exists',
      },
    ],
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const report = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, report);

  const batchSummary = {
    state: 'michigan',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    education_blocker_sharpened: true,
    lessons_updated: lessonsUpdated,
    blocker_basis: 'official_isd_plans_leaf_plus_arcgis_contract_audit',
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, `${report}\n`);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch177MichiganIsdPlansBlockerRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
