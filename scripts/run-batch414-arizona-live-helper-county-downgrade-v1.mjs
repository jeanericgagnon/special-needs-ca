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
  audit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch414_arizona_live_helper_county_downgrade_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch414-arizona-live-helper-county-downgrade-report-v1.md'),
};

const BATCH = 'batch414_arizona_live_helper_county_downgrade_v1';
const PRIMARY_GAP_REASON =
  'bounded_2026_06_26_live_des_in_page_helper_confirms_only_11_explicit_counties_and_no_literal_greenlee_la_paz_mohave_or_yuma_assignment';
const FAILURE_CODE =
  'official_des_live_helper_exposes_only_11_explicit_counties_and_no_greenlee_la_paz_mohave_or_yuma_county_assignment';
const NEXT_ACTION =
  'hold_blocked_until_des_or_ahcccs_publish_explicit_county_assignment_for_greenlee_la_paz_mohave_and_yuma_or_new_reviewable_county_to_office_contract';
const COUNTY_STATUS =
  'blocked_live_des_helper_only_proves_11_explicit_counties_with_no_greenlee_la_paz_mohave_or_yuma_assignment';
const REVIEWED_DATE = '2026-06-26';
const COUNTY_REASON =
  `Reviewed ${REVIEWED_DATE} one more bounded live Arizona county-local pass using the public DES locator's own in-page helper functions instead of relying only on older replay assumptions. The public wrapper roots \`https://des.az.gov/office-locator\` and \`https://des.az.gov/find-your-local-office\` still stay challenge-blocked as raw HTML, but the public Salesforce-hosted locator app at \`https://azdes-community.my.salesforce-sites.com/EOL/\` remains reviewable in browser context. The live frame still exposes the official service controls \`svcpickerDDS\`, \`svcpickerMA\`, \`svcpickerVR\`, and the current service lookup map through \`LoadSvcDropDown\`, \`xrefSvcCodeJSON\`, and \`geoSearchRadius\`. Re-running the app's own helper at Greenlee-area coordinates (33.0509, -109.3059) with a 250-mile search radius now produces a stricter official result than the older packet claimed. Across every public service code on the live app, explicit office \`county\` values appear for only 11 counties overall: Apache, Cochise, Coconino, Gila, Graham, Maricopa, Navajo, Pima, Pinal, Santa Cruz, and Yavapai. No reviewed live helper result for any service code contains a literal \`Greenlee\`, \`La Paz\`, \`Mohave\`, or \`Yuma\` county assignment. Some services still preserve locality ZIP coverage without county assignment: the live DDS and Child Care helper results include \`85533\`, \`85534\`, and \`85540\`, but still only on office rows whose explicit county fields remain other counties such as Graham or Pima. The accessible AHCCCS fallback lane remains live but still non-closing: \`https://www.azahcccs.gov/Members/ALTCSlocations.html\` names office cards such as Kingman and Yuma, \`https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf\` is text-extractable as county enrollment counts, and the reviewed AHCCCS admin PDFs are still only 2014 Pima support letters. None of those reviewed AHCCCS artifacts publishes a county-to-office assignment contract. Arizona therefore still lacks reviewed public official office-routing proof for at least Greenlee, La Paz, Mohave, and Yuma counties, so the county-local blocker is broader than the prior single-Greenlee packet implied.`;

const LESSON_HEADING =
  '### Prefer Live In-Page Helper Results Over Stale Replay Assumptions';
const LESSON_BODY =
  '*   **Lesson:** If a public locator app stays reviewable in browser context, trust the app’s current in-page helper results over an older replay assumption. Arizona’s DES Salesforce app still exposes public helper functions and service controls, but the live helper now yields explicit county fields for only 11 counties and no literal Greenlee, La Paz, Mohave, or Yuma assignment. That current public surface is stronger evidence than a stale replay narrative.';

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

function writeText(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value);
}

export function generateBatch414ArizonaLiveHelperCountyDowngradeV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const audit = readJson(INPUTS.audit);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const handoff = fs.readFileSync(INPUTS.handoff, 'utf8');
  const lessons = fs.readFileSync(INPUTS.lessons, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: BATCH,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 92,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'hold_county_local_until_des_or_ahcccs_publish_explicit_county_assignments_for_greenlee_la_paz_mohave_and_yuma',
    critical_gap_families: ['county_local_disability_resources'],
    major_gap_families: [],
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: FAILURE_CODE,
        evidence: COUNTY_REASON,
        next_action: NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: COUNTY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON }
      : row,
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          evidence: COUNTY_REASON,
          next_action: NEXT_ACTION,
        }
      : row,
  );

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: COUNTY_STATUS,
      evidence_strength: 'strong',
      sample_count: 8,
      query_basis:
        'Reviewed 2026-06-26 the live Arizona DES public office-locator frame itself, initialized the current service lookup state with LoadSvcDropDown, and used the app’s own geoSearchRadius helper across all public service codes at Greenlee-area coordinates to measure current explicit county coverage on the reviewable public surface.',
      blocker_code: FAILURE_CODE,
      blocker_evidence: COUNTY_REASON,
      samples: [
        {
          sample_name: 'DES live Office Locator frame',
          source_url: 'https://azdes-community.my.salesforce-sites.com/EOL/resource/1716997032000/EOLEmbedResources/EOLIndex.html',
          final_url: 'https://azdes-community.my.salesforce-sites.com/EOL/resource/1716997032000/EOLEmbedResources/EOLIndex.html',
          verification_status: 'reviewed',
          source_type: 'official_public_locator_frame',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The live reviewable locator frame renders Office Locator controls including service selectors such as svcpickerDDS, svcpickerMA, svcpickerVR, a txtAddress input, and search radius controls.',
        },
        {
          sample_name: 'DES live service lookup map',
          source_url: 'https://azdes-community.my.salesforce-sites.com/EOL/resource/1716997032000/EOLEmbedResources/JS/EOLSalesforceScript.js',
          final_url: 'https://azdes-community.my.salesforce-sites.com/EOL/resource/1716997032000/EOLEmbedResources/JS/EOLSalesforceScript.js',
          verification_status: 'reviewed',
          source_type: 'official_first_party_app_bundle',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The live first-party bundle plus in-page initialization exposes xrefSvcCodeJSON and current public service codes A, AUB, CA, CC, CSS, DDS, DVOP, ES, MA, NA, UI1, UIT, and VR.',
        },
        {
          sample_name: 'DES all-service county coverage set',
          source_url: 'https://azdes-community.my.salesforce-sites.com/EOL/',
          final_url: 'https://azdes-community.my.salesforce-sites.com/EOL/',
          verification_status: 'reviewed',
          source_type: 'official_in_page_helper_county_set',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'Using the live public in-page helper at Greenlee-area coordinates and 250-mile radius across every public service code, explicit office county fields appeared only for Apache, Cochise, Coconino, Gila, Graham, Maricopa, Navajo, Pima, Pinal, Santa Cruz, and Yavapai.',
        },
        {
          sample_name: 'DES DDS live helper ZIP coverage',
          source_url: 'https://azdes-community.my.salesforce-sites.com/EOL/',
          final_url: 'https://azdes-community.my.salesforce-sites.com/EOL/',
          verification_status: 'reviewed',
          source_type: 'official_in_page_helper_zip_only',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The live DDS helper still preserves ZIP values 85533, 85534, and 85540 on returned office rows, but none of those reviewed rows explicitly labels Greenlee County in its county field.',
        },
        {
          sample_name: 'DES Child Care live helper ZIP coverage',
          source_url: 'https://azdes-community.my.salesforce-sites.com/EOL/',
          final_url: 'https://azdes-community.my.salesforce-sites.com/EOL/',
          verification_status: 'reviewed',
          source_type: 'official_in_page_helper_zip_only',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The live Child Care helper also preserves ZIP values 85533, 85534, and 85540 without any explicit Greenlee county assignment in the reviewed office rows.',
        },
        {
          sample_name: 'AHCCCS ALTCS Offices page',
          source_url: 'https://www.azahcccs.gov/Members/ALTCSlocations.html',
          final_url: 'https://www.azahcccs.gov/Members/ALTCSlocations.html',
          verification_status: 'reviewed',
          source_type: 'official_fallback_office_inventory_without_county_contract',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The live official ALTCS Offices page still preserves named office cards such as Kingman and Yuma, but it does not publish county-to-office assignment text.',
        },
        {
          sample_name: 'AHCCCS ALTCS county map PDF',
          source_url: 'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
          final_url: 'https://www.azahcccs.gov/PlansProviders/Downloads/ALTCS_CountyMap.pdf',
          verification_status: 'reviewed',
          source_type: 'official_pdf_county_map_without_office_assignments',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The live ALTCS county-map PDF remains text-extractable as enrollment-by-county content and contractor counts, not a county-to-office assignment contract.',
        },
        {
          sample_name: 'AHCCCS CountyAdminOffice PDF support letter',
          source_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
          final_url: 'https://www.azahcccs.gov/Resources/Downloads/UniversityFamilyCare/CountyAdminOffice.pdf',
          verification_status: 'reviewed',
          source_type: 'official_pdf_non_contract_support_letter',
          source_table: BATCH,
          fetched_at: '2026-06-26T00:00:00.000Z',
          evidence_snippet: 'The live CountyAdminOffice PDF is still a 2014 Pima County Administrator support letter about the University Family Care merger, not a county-to-office routing artifact.',
        },
      ],
    };
  });

  const updatedNextRows = nextRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
          evidence: COUNTY_REASON,
        }
      : row,
  );

  const auditRow = audit.states.find((row) => row.stateId === 'arizona');
  if (auditRow) {
    auditRow.packetBatch = BATCH;
    auditRow.packetPrimaryGapReason = PRIMARY_GAP_REASON;
    auditRow.packetRecommendedBatch = updatedSummary.recommended_batch;
    auditRow.completenessPct = 92;
    auditRow.strongCriticalFamilies = 11;
    auditRow.weakCriticalFamilies = 1;
    auditRow.familyStatuses.county_local_disability_resources = COUNTY_STATUS;
  }

  const updatedStateReport = [
    '# Arizona California-Grade Audit Report v2',
    '',
    `- classification: ${updatedSummary.classification}`,
    `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${updatedSummary.completeness_pct}`,
    `- county_count: ${updatedSummary.county_count}`,
    `- primary_gap_reason: ${updatedSummary.primary_gap_reason}`,
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
    '## Completion decision',
    '',
    '- Arizona remains BLOCKED and not index-safe.',
    '- County-local routing is weaker than the prior packet claimed: the current live DES helper proves explicit office county fields for only 11 counties, not a 14-county-plus-one-locality near-complete contract.',
    '- No reviewed live DES helper result explicitly labels Greenlee, La Paz, Mohave, or Yuma County in a county field.',
    '- The AHCCCS fallback lane remains live but still non-closing because it preserves office inventory, county enrollment counts, and support letters rather than a county-to-office contract.',
  ].join('\n') + '\n';

  const updatedAllStateReport = allStateReport.replace(
    /- Arizona remains blocked[^\n]*/m,
    '- Arizona remains blocked on county-local routing more broadly than the prior packet implied: the current live DES in-page helper exposes explicit county fields for only 11 counties and still does not name Greenlee, La Paz, Mohave, or Yuma in a county-to-office contract, while AHCCCS remains inventory-only.',
  );

  const updatedHandoff = handoff.replace(
    /- Arizona: `[^\n]+`/m,
    `- Arizona: \`${PRIMARY_GAP_REASON}\``,
  );

  let updatedLessons = lessons;
  if (!updatedLessons.includes(LESSON_HEADING)) {
    updatedLessons = `${updatedLessons.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`;
  }

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeText(path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'), updatedStateReport);
  writeJson(INPUTS.audit, audit);
  writeText(INPUTS.allStateReport, updatedAllStateReport.endsWith('\n') ? updatedAllStateReport : `${updatedAllStateReport}\n`);
  writeText(INPUTS.handoff, updatedHandoff.endsWith('\n') ? updatedHandoff : `${updatedHandoff}\n`);
  writeText(INPUTS.lessons, updatedLessons);

  writeJson(OUTPUTS.summary, {
    batch: BATCH,
    state: 'arizona',
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 92,
    explicit_counties_from_live_helper: 11,
    missing_explicit_counties: ['Greenlee', 'La Paz', 'Mohave', 'Yuma'],
    live_helper_service_codes_checked: ['A', 'AUB', 'CA', 'CC', 'CSS', 'DDS', 'DVOP', 'ES', 'MA', 'NA', 'UI1', 'UIT', 'VR'],
    zip_only_services_for_greenlee_localities: ['CC', 'DDS'],
    counts_unchanged: {
      complete: 44,
      blocked: 6,
      indexSafe: 44,
    },
  });

  writeText(
    OUTPUTS.report,
    [
      '# Batch 414 Arizona Live Helper County Downgrade v1',
      '',
      '- classification: BLOCKED',
      '- index_safe: false',
      '- change: corrected Arizona county-local evidence downward to match the current live DES in-page helper instead of the older near-complete replay claim',
      '',
      '## Evidence',
      '',
      `- ${COUNTY_REASON}`,
      '',
    ].join('\n'),
  );

  return {
    classification: updatedSummary.classification,
    primary_gap_reason: updatedSummary.primary_gap_reason,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch414ArizonaLiveHelperCountyDowngradeV1();
}
