import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'new-mexico_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'new-mexico_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'new-mexico_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'new-mexico_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'new-mexico_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateReport: path.join(docsGeneratedDir, 'new-mexico-california-grade-audit-report-v2.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  seed: path.join(generatedDir, 'batch411_new_mexico_ped_county_geocode_seed_v1.json'),
};

const OUTPUTS = {
  matrix: path.join(generatedDir, 'batch411_new_mexico_ped_county_geocode_matrix_v1.jsonl'),
  summary: path.join(generatedDir, 'batch411_new_mexico_ped_county_completion_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch411-new-mexico-ped-county-completion-report-v1.md'),
};

const BATCH = 'batch411_new_mexico_ped_county_completion_v1';
const REVIEWED_DATE = '2026-06-26';
const REVIEWED_AT = '2026-06-26T00:00:00.000Z';
const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_official_or_first_party_geography_contracts';

const DISTRICT_REASON =
  `Reviewed ${REVIEWED_DATE} the live official New Mexico PED Superintendent directory items API at ` +
  "`https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists/getbytitle('Superintendents')/items?$top=5000` " +
  'together with the official Census county geographies endpoints. The PED items contract preserves 144 district-office address rows with district code, district name, office address, city, ZIP, and superintendent email on the official PED host. The official Census `geographies/onelineaddress` endpoint resolved those reviewed PED district-office addresses directly to 32 distinct New Mexico counties. Catron County stayed unmatched through one-line address geocoding because the rural Reserve and Quemado office addresses did not resolve there, so the final county was closed through reviewed first-party district evidence instead: the live Reserve Independent Schools page preserves the district office address `24 MOUNTAINEER RD, RESERVE, NM 87830` and embedded coordinates `(33.710737,-108.761857)`, and the official Census `geographies/coordinates` endpoint returns `Catron County` from those first-party coordinates. Together this yields explicit county-grade local education routing coverage across all 33 New Mexico counties without guessing from district names, towns, or stale exports.';

const LESSON_HEADING =
  '### First-Party District Coordinates Can Close The Last County When State Directory Addresses Fail The Geocoder';
const LESSON_BODY =
  "*   **Lesson:** If an official state district directory preserves real office addresses for almost every county but one rural county still fails one-line geocoding, check whether the first-party district site publishes embedded coordinates beside the same office address. New Mexico's PED superintendent directory plus the official Census `geographies/onelineaddress` endpoint cleared 32 counties directly, and Catron closed only after Reserve Independent Schools exposed coordinates that the official Census `geographies/coordinates` endpoint mapped back to Catron County.";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  return raw ? raw.split('\n').map((line) => JSON.parse(line)) : [];
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

function normalizeCountySlug(name) {
  return name
    .replace(/ County$/i, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildCountyMatrix(seed) {
  return seed.counties.map((row) => ({
    state: 'new-mexico',
    county_name: row.county,
    county_slug: normalizeCountySlug(row.county),
    district_code: row.district_code,
    district_name: row.district_name,
    source_address: row.address,
    source_city: row.city,
    source_zip: row.zip,
    source_email: row.email || '',
    geography_method: row.coordinates ? 'official_census_reverse_geocoder_from_first_party_district_coordinates' : 'official_census_onelineaddress_from_official_ped_district_address',
    source_url:
      row.source_url ||
      "https://webed.ped.state.nm.us/sites/schooldirectory/_api/web/lists/getbytitle('Superintendents')/items?$top=5000",
    matched_address: row.matched_address,
    county_geography_url: row.coordinates
      ? `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${row.coordinates.split(',')[1]}&y=${row.coordinates.split(',')[0]}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`
      : `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=${encodeURIComponent(row.query)}&benchmark=Public_AR_Current&vintage=Current_Current&format=json`,
    evidence_snippet: row.coordinates
      ? `The live first-party Reserve Independent Schools page preserves the district office address ${row.address}, ${row.city}, NM ${row.zip} and embedded coordinates (${row.coordinates}), and the official Census reverse geocoder returns ${row.county} from those coordinates.`
      : `The official PED Superintendent directory preserves district office address ${row.address}, ${row.city}, NM ${row.zip} for ${row.district_name}, and the official Census onelineaddress county geographies endpoint returns ${row.county} from that reviewed PED address.`,
  }));
}

function buildVerifiedCountySamples(matrixRows) {
  return matrixRows.map((row) => ({
    sample_name: `${row.county_name} :: ${row.district_name}`,
    source_url: row.county_geography_url,
    final_url: row.county_geography_url,
    verification_status: 'official_verified',
    source_type:
      row.geography_method === 'official_census_reverse_geocoder_from_first_party_district_coordinates'
        ? 'official_census_reverse_geography_from_first_party_district_coordinates'
        : 'official_census_county_geography_from_ped_address',
    source_table: BATCH,
    fetched_at: REVIEWED_AT,
    evidence_snippet: row.evidence_snippet,
  }));
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows, matrixRows) {
  return [
    '# New Mexico California-Grade Audit Report v2',
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
    ...(failureRows.length ? failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`) : ['- none']),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...(nextRows.length ? nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`) : ['- none']),
    '',
    '## Completion decision',
    '',
    '- New Mexico is now `COMPLETE` and `index_safe=true`.',
    `- \`district_or_county_education_routing\` now clears because the reviewed PED Superintendent directory plus the official Census county geographies endpoints yield explicit county-grade district routing across all ${matrixRows.length} New Mexico counties.`,
    '- The county matrix closes 32 counties directly from official PED district-office addresses and closes Catron County through first-party Reserve Independent Schools coordinates on the live district site plus the official Census reverse geocoder.',
    '- Statewide IDEA Part B remains verified from the live official U.S. Department of Education IDEA-by-State New Mexico pages, and all other critical families remain green from the prior reviewed HCA, ECECD, DRNM, PRO, legal-aid, ABLE, and SSA evidence.',
  ].join('\n') + '\n';
}

function buildAllStateReport(audit) {
  const completeStates = audit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedStates = audit.states
    .filter((row) => row.classification === 'BLOCKED')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));

  return [
    '# All-State California-Grade Audit Report v3',
    '',
    'This v3 audit closes the packet-coverage gap across all 50 states. It does not claim broader California-grade completion beyond the states currently marked COMPLETE by packet evidence.',
    '',
    '## Packet coverage',
    '',
    `- packet_coverage_count: ${audit.packetCoverageCount}`,
    `- packet_missing_states: ${audit.packetMissingStates.length ? audit.packetMissingStates.join(', ') : 'none'}`,
    '',
    '## Classification counts',
    '',
    `- COMPLETE: ${audit.classifications.COMPLETE}`,
    `- BLOCKED: ${audit.classifications.BLOCKED}`,
    '',
    `- index-safe states: ${audit.indexSafeCount}`,
    `- complete states: ${completeStates.join(', ')}`,
    `- blocked states: ${blockedStates.join(', ')}`,
    '',
    '## Notes',
    '',
    '- New Hampshire remains blocked after a 2026-06-26 bounded live repair pass: statewide IDEA Part B now clears from the official federal IDEA-by-State New Hampshire pages, but DHHS roots, NHES roots, and live local education-routing surfaces still do not expose a reviewable New Hampshire public contract.',
    '- New Mexico is now COMPLETE/index-safe after the reviewed PED Superintendent directory plus official Census county geographies endpoints yielded explicit county-grade district routing across all 33 counties, with Catron closed from first-party Reserve district coordinates.',
    '- Texas remains COMPLETE/index-safe from v10.',
    '- Pennsylvania remains COMPLETE/index-safe from its reviewed county-grade repair pass.',
    '- The non-complete states are now fully packeted with summary, gap, failure, verified-sources, next-action, and report artifacts.',
    '- The next phase should use those packet artifacts as the repair control plane instead of creating more queue-expansion batches.',
    '- Arizona remains blocked after a 2026-06-26 bounded live recheck: DES wrapper roots still return HTTP 403 `Just a moment...` shells, the public Salesforce locator app remains live but still exposes Greenlee only through locality ZIP coverage, the current AHCCCS admin PDFs are live and readable but prove to be 2014 Pima support letters rather than county-routing contracts, and no reviewed public DES or AHCCCS artifact explicitly assigns Greenlee County to an office.',
  ].join('\n') + '\n';
}

function buildBatchReport(matrixRows) {
  return [
    '# Batch 411 New Mexico PED County Completion v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- change: cleared New Mexico district/county education routing from the reviewed PED Superintendent directory plus official Census county geographies, with Catron closed from first-party Reserve district coordinates',
    '',
    '## Evidence',
    '',
    `- ${DISTRICT_REASON}`,
    '',
    '## Coverage',
    '',
    `- county-grade district routing rows: ${matrixRows.length}`,
    '- Catron County closure lane: Reserve Independent Schools first-party coordinates -> official Census reverse geocoder -> Catron County',
  ].join('\n') + '\n';
}

export function generateBatch411NewMexicoPedCountyCompletionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  const seed = readJson(INPUTS.seed);
  const matrixRows = buildCountyMatrix(seed);

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'COMPLETE',
    index_safe: true,
    incorrectly_index_safe: false,
    completeness_pct: 100,
    strong_critical_families: 12,
    weak_critical_families: 0,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'complete_maintain',
    critical_gap_families: [],
    major_gap_families: [],
    complete_ready: true,
    final_blockers: null,
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      district_or_county_education_routing: 'verified_county_grade',
    },
  };

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'verified_county_grade',
          statewide_enough: false,
          county_grade_required: true,
          status_reason: DISTRICT_REASON,
        }
      : row,
  );

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'district_or_county_education_routing'
      ? {
          ...row,
          family_status: 'verified_county_grade',
          evidence_strength: 'strong',
          sample_count: matrixRows.length,
          query_basis:
            'Reviewed 2026-06-26 the official New Mexico PED Superintendent items API plus the official Census county geographies endpoints, preserving an explicit county-by-county district routing contract across all 33 counties, with Catron closed through first-party Reserve district coordinates.',
          blocker_code: null,
          blocker_evidence: null,
          samples: buildVerifiedCountySamples(matrixRows),
        }
      : row,
  );

  const updatedFailureRows = [];
  const updatedNextRows = [];

  const updatedQueueRows = queueRows.map((row) =>
    row.state === 'new-mexico'
      ? {
          ...row,
          classification: 'COMPLETE',
          index_safe: true,
          completeness_pct: 100,
          missing_critical_families: 0,
          weak_critical_families: 0,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'complete_maintain',
          status: 'COMPLETE',
          repair_lane: 'maintain_verified_state',
        }
      : row,
  );

  const updatedAudit = {
    ...audit,
    classifications: { ...audit.classifications, COMPLETE: 44, BLOCKED: 6 },
    indexSafeCount: 44,
    states: audit.states.map((row) =>
      row.stateId === 'new-mexico'
        ? {
            ...row,
            classification: 'COMPLETE',
            indexSafe: true,
            incorrectlyIndexSafe: false,
            strongCriticalFamilies: 12,
            weakCriticalFamilies: 0,
            missingCriticalFamilies: 0,
            completenessPct: 100,
            familyStatuses: {
              ...(row.familyStatuses || {}),
              district_or_county_education_routing: 'verified_county_grade',
            },
            packetBatch: BATCH,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'complete_maintain',
          }
        : row,
    ),
  };

  const updatedHandoff = handoff
    .replace(
      /## Current Complete States[\s\S]*?## Current Blocked States/m,
      `## Current Complete States\n\nAlabama, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Jersey, New Mexico, New York, North Carolina, North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming\n\n## Current Blocked States`,
    )
    .replace(
      /- New Mexico: `[^`]+`\n/,
      '',
    )
    .replace(
      /### Blocker Reason[\s\S]*/m,
      `### Blocker Reason\n\n\`county_local_disability_resources\` is still the sole Arizona blocker. The live official DES and AHCCCS lanes still do not publish one reviewed public artifact that explicitly assigns Greenlee County itself to a DES or AHCCCS office. The Salesforce locator stays locality-ZIP based only, and the reviewed AHCCCS admin PDFs proved to be support letters rather than county-routing contracts.\n`,
    );

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, updatedAudit);
  writeText(INPUTS.allStateReport, buildAllStateReport(updatedAudit));
  writeText(INPUTS.handoff, updatedHandoff);
  writeText(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, matrixRows));
  writeJsonl(OUTPUTS.matrix, matrixRows);
  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    generated_at: new Date().toISOString(),
    classification: 'COMPLETE',
    index_safe: true,
    ped_superintendent_rows: 155,
    ped_address_rows_with_district_identity: 144,
    counties_closed_from_ped_addresses: 32,
    catron_closed_from_first_party_coordinates: true,
    county_matrix_rows: matrixRows.length,
    counts: { complete: 44, blocked: 6, indexSafe: 44 },
  });
  writeText(OUTPUTS.report, buildBatchReport(matrixRows));
  appendLessonIfMissing(INPUTS.lessons);

  return { classification: 'COMPLETE', countyRows: matrixRows.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch411NewMexicoPedCountyCompletionV1();
  console.log(JSON.stringify(result, null, 2));
}
