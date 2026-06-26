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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch392_arizona_des_locator_greenlee_finality_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch392-arizona-des-locator-greenlee-finality-report-v1.md'),
};

const BATCH = 'batch392_arizona_des_locator_greenlee_finality_v1';
const PRIMARY_GAP_REASON =
  'official_des_locator_returns_14_explicit_counties_and_greenlee_zip_served_localities_but_no_reviewed_greenlee_county_contract';
const RECOMMENDED_BATCH =
  'hold_county_local_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_full_county_contract';
const COUNTY_LOCAL_STATUS =
  'blocked_des_locator_explicit_for_14_counties_with_greenlee_locality_zip_coverage_but_no_county_level_contract';
const FAILURE_CODE =
  'official_des_locator_now_proves_14_counties_and_greenlee_locality_zips_but_still_no_explicit_greenlee_county_assignment';
const NEXT_ACTION =
  'hold_blocked_until_des_or_ahcccs_publish_explicit_greenlee_county_assignment_or_reviewable_county_to_office_contract';
const COUNTY_LOCAL_REASON =
  'Reviewed 2026-06-26 and rechecked 2026-06-25 the live official Arizona DES office-locator application more deeply after the earlier AHCCCS fallback work. The public DES locator root is still challenge-blocked as raw HTML, but the exact public Salesforce-hosted office-locator application at `https://azdes-community.my.salesforce-sites.com/EOL/` is reviewable and its first-party bundle at `EOLSalesforceScript.js` exposes the live search contract `srchParms = {srchradmiles, ctrlat, ctrlng, schsvccode}` for `EOLEmbedController.getEOLOfficeData`. Replaying that exact official contract confirms the county-local blocker directly from live data. A Greenlee-area replay at `ctrlat 33.0509`, `ctrlng -109.3059`, and `schsvccode DDS` returns one Safford row at 50 miles, 4 rows at 100 miles, 15 rows at 150 miles, and 28 rows at 250 miles. Across those live responses, the public `Developmental Disability Services` lane still exposes explicit office `county` values for only 14 Arizona counties overall, with Greenlee never named directly in any returned office `county` field. The returned DDS rows still only expose office `county` values such as `Cochise`, `Gila`, `Graham`, `Navajo`, and `Pima`; the Tucson DDS row still carries Greenlee locality ZIPs `85533`, `85534`, and `85540` inside `zipCodesServed`; the Safford DDS row remains explicitly `county: Graham`; and no returned row contains literal `Greenlee`, `Clifton`, `Duncan`, or `Morenci` in `county`, `serviceDirections`, `specialInstructions`, or other reviewed payload fields. Those ZIPs still match first-party Greenlee locality surfaces preserved on the official Greenlee County and town-host family: Greenlee County keeps useful links for Town of Clifton, Town of Duncan, and Town of Morenci; the Town of Clifton site preserves `Clifton, Arizona 85533`; the Town of Duncan site preserves `Duncan, Arizona 85534`; and the Morenci townsite preserves `Morenci, AZ 85540`. That is strong locality-level evidence, but Arizona still lacks one reviewed public official artifact that names Greenlee County itself inside the DES or AHCCCS county-local routing contract. Arizona therefore remains blocked only on the final Greenlee county-level attachment, not on the earlier statewide absence of office-routing evidence.';
const COUNTY_LOCAL_EVIDENCE =
  'Reviewed 2026-06-26 bounded official Arizona county-local surfaces across the DES public office-locator family, the public Salesforce-hosted locator application, the recovered first-party bundle contract in `EOLSalesforceScript.js`, the official DDS service dataset returned by `EOLEmbedController.getEOLOfficeData`, the official Greenlee County useful-links page, and first-party Clifton, Duncan, and Morenci town surfaces. The official DES public locator roots `https://des.az.gov/office-locator` and `https://des.az.gov/find-your-local-office` still return Cloudflare `Just a moment...` shells in raw fetches, but the linked public Salesforce app at `https://azdes-community.my.salesforce-sites.com/EOL/` is live and reviewable. Its first-party bundle explicitly exposes the search parameter contract `srchParms = {srchradmiles, ctrlat, ctrlng, schsvccode}`, and replaying that exact official contract against Greenlee-area coordinates (`ctrlat 33.0509`, `ctrlng -109.3059`, `schsvccode DDS`) now proves the negative case directly from the payload. At 50 miles the replay returns 1 row, at 100 miles 4 rows, at 150 miles 15 rows, and at 250 miles 28 rows. Across those live results, the public `Developmental Disability Services` lane still exposes explicit office `county` fields for only 14 Arizona counties overall, and the returned DDS rows still only expose office `county` values such as `Cochise`, `Gila`, `Graham`, `Navajo`, and `Pima`; the Tucson DDS row preserves Greenlee locality ZIPs `85533`, `85534`, and `85540` in `zipCodesServed`; the Safford DDS row remains explicitly `county: Graham`; and no returned row contains literal `Greenlee`, `Clifton`, `Duncan`, or `Morenci` in `county`, `serviceDirections`, `specialInstructions`, or other reviewed payload fields. Official county and first-party locality evidence then tightens the remaining geography: Greenlee County preserves useful links for the Town of Clifton, Town of Duncan, and Town of Morenci; the Town of Clifton preserves `Clifton, Arizona 85533`; the Town of Duncan preserves `Duncan, Arizona 85534`; and Morenci preserves `Morenci, AZ 85540`. Arizona has therefore narrowed from a statewide county-local blocker to a single unresolved county-level contract question: no reviewed public DES or AHCCCS artifact explicitly labels Greenlee County itself as assigned to a particular office.';

const LESSON_HEADING =
  '### Public Visualforce Locator APIs Can Become Reviewable Official Evidence';
const LESSON_BODY =
  '*   **Lesson:** A public agency locator app should not be written off just because the wrapper page is dynamic. Arizona DES stayed blocked in raw HTML, but the linked public Salesforce locator exposed a live Visualforce remoting contract with structured office records, explicit county fields, service URLs, phones, and served-ZIP strings. When the app is publicly reachable and the remoting endpoint is stable, review that exact contract before treating the lane as non-reviewable.';

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

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text);
}

function main() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);
  const audit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  const lessons = fs.readFileSync(INPUTS.lessons, 'utf8');

  summary.batch = BATCH;
  summary.classification = 'BLOCKED';
  summary.index_safe = false;
  summary.completeness_pct = 92;
  summary.strong_critical_families = 11;
  summary.weak_critical_families = 1;
  summary.primary_gap_reason = PRIMARY_GAP_REASON;
  summary.recommended_batch = RECOMMENDED_BATCH;
  summary.critical_gap_families = ['county_local_disability_resources'];
  summary.major_gap_families = [];
  summary.final_blockers = [
    {
      family: 'county_local_disability_resources',
      failure_code: FAILURE_CODE,
      evidence: COUNTY_LOCAL_EVIDENCE,
      next_action: NEXT_ACTION,
    },
  ];
  summary.familyStatuses.county_local_disability_resources = COUNTY_LOCAL_STATUS;

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_LOCAL_STATUS, status_reason: COUNTY_LOCAL_REASON }
      : row
  ));

  const updatedFailureRows = [
    {
      state: 'arizona',
      state_code: 'AZ',
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: FAILURE_CODE,
      evidence: COUNTY_LOCAL_EVIDENCE,
      next_action: NEXT_ACTION,
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: COUNTY_LOCAL_STATUS,
      evidence_strength: 'strong',
      sample_count: 10,
      query_basis: 'Reviewed 2026-06-26 and rechecked 2026-06-25 the live DES public Salesforce locator app, its first-party `EOLSalesforceScript.js` bundle, the recovered official DDS remoting contract `srchParms = {srchradmiles, ctrlat, ctrlng, schsvccode}`, the live Greenlee-area DDS replay results, the official Greenlee County useful-links page, and first-party Clifton, Duncan, and Morenci town surfaces to tighten Arizona county-local routing from a statewide blocker to a single Greenlee county-level contract question.',
      blocker_code: FAILURE_CODE,
      blocker_evidence: COUNTY_LOCAL_EVIDENCE,
      samples: [
        {
          sample_name: 'DES public Salesforce locator root',
          source_url: 'https://azdes-community.my.salesforce-sites.com/EOL/',
          final_url: 'https://azdes-community.my.salesforce-sites.com/EOL/',
          verification_status: 'reviewed',
          source_type: 'official_public_locator_app',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The public DES office-locator app is live on an official Salesforce-hosted state surface and exposes a stable Visualforce remoting contract for office data.',
        },
        {
          sample_name: 'DES EOL search contract bundle',
          source_url: 'https://azdes-community.my.salesforce-sites.com/EOL/resource/1716997032000/EOLEmbedResources/JS/EOLSalesforceScript.js',
          final_url: 'https://azdes-community.my.salesforce-sites.com/EOL/resource/1716997032000/EOLEmbedResources/JS/EOLSalesforceScript.js',
          verification_status: 'verified',
          source_type: 'official_first_party_app_bundle',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'The first-party bundle calls `CallRetrieveOfficeData` with `srchParms = {srchradmiles, ctrlat, ctrlng, schsvccode}`, exposing the exact public office-search contract.',
        },
        {
          sample_name: 'DES DDS office-data county set',
          source_url: 'https://azdes-community.my.salesforce-sites.com/EOL/apexremote',
          final_url: 'https://azdes-community.my.salesforce-sites.com/EOL/apexremote',
          verification_status: 'verified',
          source_type: 'official_public_locator_api_with_explicit_county_fields',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The official DDS office-data payload exposes explicit county fields for 14 counties: Apache, Cochise, Coconino, Gila, Graham, La Paz, Maricopa, Mohave, Navajo, Pima, Pinal, Santa Cruz, Yavapai, and Yuma.',
        },
        {
          sample_name: 'DDS Tucson office Greenlee ZIP coverage',
          source_url: 'https://azdes-community.my.salesforce-sites.com/EOL/apexremote',
          final_url: 'https://azdes-community.my.salesforce-sites.com/EOL/apexremote',
          verification_status: 'verified',
          source_type: 'official_public_locator_api_served_zip_contract',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The Tucson DDS office record preserves `zipCodesServed` values including `85533`, `85534`, and `85540`, alongside phone `(520) 628-6800` and service URL `https://des.az.gov/ddd`.',
        },
        {
          sample_name: 'Greenlee-area 250-mile DDS replay',
          source_url: 'https://azdes-community.my.salesforce-sites.com/EOL/apexremote',
          final_url: 'https://azdes-community.my.salesforce-sites.com/EOL/apexremote',
          verification_status: 'verified',
          source_type: 'official_public_locator_api_negative_county_check',
          source_table: BATCH,
          fetched_at: '2026-06-25T00:00:00.000Z',
          evidence_snippet: 'A live replay with `srchradmiles 250`, `ctrlat 33.0509`, `ctrlng -109.3059`, and `schsvccode DDS` returned 28 rows, including Tucson ZIP coverage for `85533`, `85534`, and `85540`, but no literal `Greenlee` county assignment anywhere in the payload.',
        },
        {
          sample_name: 'Greenlee County useful-links page',
          source_url: 'https://greenlee.az.gov/',
          final_url: 'https://greenlee.az.gov/',
          verification_status: 'reviewed',
          source_type: 'official_county_root',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The official Greenlee County site preserves useful links for the Town of Clifton, Town of Duncan, and Town of Morenci and keeps the county government contact address in Clifton.',
        },
        {
          sample_name: 'Town of Clifton first-party ZIP',
          source_url: 'https://cliftonaz.com/',
          final_url: 'https://cliftonaz.com/',
          verification_status: 'reviewed',
          source_type: 'first_party_town_root',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The Town of Clifton first-party site preserves `Clifton, Arizona 85533` in its contact block.',
        },
        {
          sample_name: 'Town of Duncan first-party ZIP',
          source_url: 'https://duncanaz.us/',
          final_url: 'https://duncanaz.us/',
          verification_status: 'reviewed',
          source_type: 'first_party_town_root',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The Town of Duncan first-party site preserves `Duncan, Arizona 85534` in its town-hall contact block.',
        },
        {
          sample_name: 'Town of Morenci first-party ZIP',
          source_url: 'https://www.morencitown.com/',
          final_url: 'https://www.morencitown.com/',
          verification_status: 'reviewed',
          source_type: 'first_party_town_root',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The Morenci townsite preserves `Morenci, AZ 85540` in its footer contact block.',
        },
        {
          sample_name: 'AHCCCS ALTCS offices fallback',
          source_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
          final_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
          verification_status: 'reviewed',
          source_type: 'official_fallback_office_inventory_without_county_contract',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The official ALTCS offices page remains live but still stops at named office cards and does not explicitly assign Greenlee County to an office.',
        },
      ],
    };
  });

  const updatedNextRows = [
    {
      state: 'arizona',
      state_code: 'AZ',
      family: 'county_local_disability_resources',
      severity: 'critical',
      priority_rank: 1,
      next_action: NEXT_ACTION,
    },
  ];

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'arizona'
      ? {
          ...row,
          completeness_pct: 92,
          weak_critical_families: 1,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: RECOMMENDED_BATCH,
        }
      : row
  ));

  const auditRow = audit.states.find((row) => row.stateId === 'arizona');
  if (auditRow) {
    auditRow.packetBatch = BATCH;
    auditRow.packetPrimaryGapReason = PRIMARY_GAP_REASON;
    auditRow.packetRecommendedBatch = RECOMMENDED_BATCH;
    auditRow.familyStatuses.county_local_disability_resources = COUNTY_LOCAL_STATUS;
    auditRow.completenessPct = 92;
    auditRow.strongCriticalFamilies = 11;
    auditRow.weakCriticalFamilies = 1;
  }

  const updatedReport = [
    '# Arizona California-Grade Audit Report v2',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- completeness_pct: 92',
    '- county_count: 15',
    `- primary_gap_reason: ${PRIMARY_GAP_REASON}`,
    '',
    '## Family status',
    '',
    ...updatedGapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...updatedFailureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...updatedVerifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...updatedNextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Repair decision',
    '',
    '- Arizona remains BLOCKED and not index-safe.',
    '- Education still clears at county grade across all 15 counties.',
    '- County-local is now much narrower: the official DES locator app proves explicit county-local routing for 14 counties and preserves disability-specific Greenlee locality ZIP coverage through the DDS service lane.',
    '- Arizona still cannot truthfully complete because no reviewed public DES or AHCCCS artifact explicitly labels Greenlee County itself in a county-to-office contract.',
    '',
  ].join('\n');

  const updatedAllStateReport = allStateReport.replace(
    /- Arizona remains blocked[^\n]*/,
    '- Arizona remains blocked only on the final Greenlee county-local attachment: the official DES locator app now proves 14 counties explicitly and preserves Greenlee locality ZIP coverage in the DDS lane, but no reviewed public DES or AHCCCS artifact explicitly labels Greenlee County in a county-to-office contract.',
  );

  const updatedHandoff = handoff.replace(
    /- Arizona: `[^\n]+`/,
    `- Arizona: \`${PRIMARY_GAP_REASON}\``,
  );

  let updatedLessons = lessons;
  if (!updatedLessons.includes(LESSON_HEADING)) {
    updatedLessons = `${updatedLessons.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`;
  }

  writeJson(INPUTS.summary, summary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeText(INPUTS.report, `${updatedReport}\n`);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.audit, audit);
  writeText(INPUTS.allStateReport, updatedAllStateReport.endsWith('\n') ? updatedAllStateReport : `${updatedAllStateReport}\n`);
  writeText(INPUTS.handoff, updatedHandoff.endsWith('\n') ? updatedHandoff : `${updatedHandoff}\n`);
  writeText(INPUTS.lessons, updatedLessons);

  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    state: 'arizona',
    classification: 'BLOCKED',
    index_safe: false,
    sole_blocker: 'county_local_disability_resources',
    explicit_counties_from_des_locator: 14,
    missing_explicit_county: 'Greenlee',
    greenlee_zip_served_values: ['85533', '85534', '85540'],
    recovered_search_params: ['srchradmiles', 'ctrlat', 'ctrlng', 'schsvccode'],
    greenlee_replay_row_counts_by_radius: {
      '50': 1,
      '100': 4,
      '150': 15,
      '250': 28,
    },
    completeness_pct: 92,
    counts_unchanged: {
      complete: 43,
      blocked: 7,
      indexSafe: 43,
    },
  });

  writeText(OUTPUTS.report, [
    '# Batch 392 Arizona DES Locator Greenlee Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: Arizona county-local routing narrows from a statewide office-contract blocker to a single unresolved Greenlee county attachment',
    '',
    '## Evidence',
    '',
    `- ${COUNTY_LOCAL_EVIDENCE}`,
    '',
  ].join('\n'));
}

main();
