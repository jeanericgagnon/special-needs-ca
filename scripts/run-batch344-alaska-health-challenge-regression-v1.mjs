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
  failures: path.join(generatedDir, 'alaska_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'alaska_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'alaska_next_action_queue_v2.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  stateReport: path.join(docsGeneratedDir, 'alaska-california-grade-audit-report-v2.md'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  stateLessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch344_alaska_health_challenge_regression_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch344-alaska-health-challenge-regression-report-v1.md'),
};

const BATCH_NAME = 'batch344_alaska_health_challenge_regression_v1';
const PRIMARY_GAP_REASON =
  'health_alaska_dpa_service_family_now_returns_cloudflare_challenge_shells_while_dfcs_successor_surfaces_still_add_no_borough_or_census_area_assignment_contract';
const FAILURE_CODE =
  'health_alaska_dpa_service_family_cloudflare_challenge_and_dfcs_successor_surfaces_still_no_county_equivalent_mapping_contract';
const FAMILY_STATUS =
  'blocked_health_alaska_dpa_challenge_shells_and_dfcs_successor_surfaces_still_no_borough_or_census_area_assignment_contract';
const NEXT_ACTION =
  'hold_blocked_until_alaska_publishes_reviewable_public_borough_or_census_area_to_dpa_office_assignment_or_the_health_dpa_family_reopens_without_challenge_shells';

const REVIEWED_PROBE = {
  fetchedDate: '2026-06-25',
  generatedAt: new Date().toISOString(),
  dpaLanding: {
    url: 'https://health.alaska.gov/dpa',
    rawStatus: 403,
    browserFinalUrl:
      'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/?__cf_chl_rt_tk=bOJ2kczqITNweDV0RE3ZllwafGUavDJ31C1nETMplVE-1782371485-1.0.1.1-WWPqRTlC3Ya1vqmw5z3FH7hdtJO5FC7hnKbVsy1dYv8',
    browserTitle: 'Just a moment...',
    browserHeading: 'Performing security verification',
  },
  dpaOffices: {
    url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
    rawStatus: 403,
    browserFinalUrl:
      'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/?__cf_chl_rt_tk=bOJ2kczqITNweDV0RE3ZllwafGUavDJ31C1nETMplVE-1782371485-1.0.1.1-WWPqRTlC3Ya1vqmw5z3FH7hdtJO5FC7hnKbVsy1dYv8',
    browserTitle: 'Just a moment...',
    browserHeading: 'Performing security verification',
  },
  adultPublicAssistance: {
    url: 'https://health.alaska.gov/en/services/adult-public-assistance-apa/',
    rawStatus: 403,
    browserFinalUrl:
      'https://health.alaska.gov/en/services/adult-public-assistance-apa/?__cf_chl_rt_tk=.49SEckMqKEqXroTlbxSAfkxRxHmvvpH6ikM3_dkGGk-1782371565-1.0.1.1-._XHOoskKYPwFGfPr3.uVhrRW4eUuu.ZM68HLNPuz_A',
    browserTitle: 'Just a moment...',
  },
  applyForMedicaid: {
    url: 'https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/',
    rawStatus: 403,
    browserFinalUrl:
      'https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/?__cf_chl_rt_tk=n_UwVEJzijZJZSfCNqxI05Tt.dxs8OiTSEEfmZ.W71k-1782371565-1.0.1.1-5EwPw7NldCAejqbsm3uE.Mi08OMrJ_J_eV2tC__B7Ak',
    browserTitle: 'Just a moment...',
  },
  dpaDashboard: {
    url: 'https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf',
    rawStatus: 403,
  },
  medicaidSnapshot: {
    url: 'https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf',
    rawStatus: 403,
  },
  dfcsServices: {
    url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
    rawStatus: 200,
  },
  dfcsPublications: {
    url: 'https://dfcs.alaska.gov/Pages/Publications.aspx',
    rawStatus: 200,
  },
  dfcsSiteMap: {
    url: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
    rawStatus: 200,
  },
};

const LESSON_HEADING = '### Challenge Regression Beats Stale Browser-Readable Assumptions';
const LESSON_BODY =
  '*   **Lesson:** If a previously browser-readable official local-routing page regresses into a Cloudflare or bot-verification shell, tighten the packet back to the current live contract instead of carrying forward the older readable assumption. Alaska’s DPA office family had to fall back to a stricter blocker once the health.alaska.gov pages and PDFs returned raw 403s and browser `Just a moment...` shells, while the still-readable DFCS successor pages still offered no borough or census-area assignment contract.';

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

function replaceSample(samples, sampleName, replacement) {
  const index = samples.findIndex((sample) => sample.sample_name === sampleName);
  if (index >= 0) {
    samples[index] = replacement;
  } else {
    samples.push(replacement);
  }
}

function appendLessonIfMissing() {
  const current = fs.readFileSync(INPUTS.stateLessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.stateLessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

function buildStatusReason(probe) {
  return `The live Alaska county-local blocker tightened again after one more bounded official recheck on ${probe.fetchedDate}. The current Department of Health DPA family no longer stays browser-readable: raw fetches to \`https://health.alaska.gov/dpa\`, the exact DPA offices page, the Adult Public Assistance page, the Apply for Medicaid page, and the public DPA dashboard / Medicaid snapshot PDFs now return HTTP 403 on the official health host. In the reviewed browser lane, the exact DPA offices page and the successor Adult Public Assistance / Apply for Medicaid pages now land on Cloudflare \`Just a moment...\` challenge shells with the visible heading \`Performing security verification\` instead of materializing office or service content. The still-readable DFCS successor surfaces remain negative at the same time: \`Services.aspx\` still only points users to statewide Adult Public Assistance and Apply for Medicaid successor pages, \`Publications.aspx\` still exposes no DPA office-routing material, and \`Site-Map.aspx\` still only adds wrong-role OCS / Pioneer Homes branches rather than a borough or census-area assignment contract. Alaska therefore remains blocked because the public health host is challenge-shelled again and the readable successor host still adds no county-equivalent routing contract.`;
}

function buildEvidence(probe) {
  return `Reviewed ${probe.fetchedDate} official Alaska surfaces across the current Department of Health DPA host plus the DFCS successor host. Raw fetches to \`https://health.alaska.gov/dpa\`, \`https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/\`, \`https://health.alaska.gov/en/services/adult-public-assistance-apa/\`, \`https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/\`, \`https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf\`, and \`https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf\` now all return HTTP 403 on the official health host. In the reviewed browser lane, the DPA offices page now lands on a Cloudflare \`Just a moment...\` shell with the visible heading \`Performing security verification\`, and the successor Adult Public Assistance and Apply for Medicaid pages also land on \`Just a moment...\` shells on the same host instead of materializing office or service content. The still-readable DFCS successor surfaces remain negative: \`https://dfcs.alaska.gov/Pages/Services.aspx\` still only points users to statewide Adult Public Assistance and Apply for Medicaid successor pages, \`https://dfcs.alaska.gov/Pages/Publications.aspx\` still exposes no DPA office-routing material, and \`https://dfcs.alaska.gov/Pages/Site-Map.aspx\` still only adds wrong-role OCS offices plus Pioneer Homes payment-assistance branches. Alaska therefore still lacks any reviewable borough- or census-area-to-office assignment contract on a public official surface, and the previously readable DPA office family is now challenge-shelled again.`;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
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
    '- Alaska remains BLOCKED and not index-safe.',
    '- The current health.alaska.gov DPA family is no longer reliably browser-readable for this lane.',
    '- The DPA landing page, exact DPA offices page, Adult Public Assistance page, Apply for Medicaid page, and the public DPA dashboard / Medicaid snapshot PDFs now return raw HTTP 403 on the official health host.',
    '- In the reviewed browser lane, the DPA offices page and successor service pages land on `Just a moment...` / `Performing security verification` challenge shells instead of materializing reviewable office content.',
    '- The DFCS successor pages are still public, but they still do not add any borough- or census-area assignment contract for DPA routing.',
    '- Alaska therefore still lacks any reviewable county-equivalent routing contract on a public official surface.',
  ].join('\n') + '\n';
}

function replaceAllStateAlaskaNote(text) {
  const priorNotes = [
    '- Alaska county-local routing is still blocked, but the blocker sharpened: the official DPA landing page and exact DPA offices page are now browser-readable on `health.alaska.gov`, yet the offices page still groups only regional offices and addresses without any borough- or census-area assignment contract, while DFCS successor pages still add no county-equivalent mapping.',
    '- Alaska county-local routing is still blocked: the official DPA landing page and exact DPA offices page are now browser-readable on `health.alaska.gov`, yet the offices page still groups only regional offices and addresses without any borough- or census-area assignment contract, while DFCS successor pages still add no county-equivalent mapping.',
  ];
  let output = text;
  for (const note of priorNotes) {
    output = output.replace(`${note}\n`, '');
  }
  const replacement = '- Alaska county-local routing is still blocked, and the live contract regressed again: the health.alaska.gov DPA family now returns raw 403s and browser `Just a moment...` challenge shells, while the still-readable DFCS successor pages still add no borough- or census-area assignment contract.';
  if (!output.includes(replacement)) {
    output = `${output.trimEnd()}\n${replacement}\n`;
  }
  return output;
}

function buildHandoff(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedRows = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .sort((a, b) => a.stateName.localeCompare(b.stateName));

  return [
    '# Gemini Source Scout Handoff',
    '',
    'Updated: 2026-06-25',
    '',
    'Use Gemini findings only as leads, never as authority. Every lead still needs official or first-party verification in the repo workflow.',
    '',
    '## Current Complete States',
    '',
    completeStates.join(', '),
    '',
    '## Current Blocked States',
    '',
    ...blockedRows.map((row) => `- ${row.stateName}: \`${row.packetPrimaryGapReason}\``),
    '',
    '## Current Focus State: Alaska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Alaska critical blocker. The current Department of Health DPA family has regressed from the older browser-readable assumption: raw fetches to `https://health.alaska.gov/dpa`, the exact DPA offices page, the Adult Public Assistance page, the Apply for Medicaid page, and the public DPA dashboard / Medicaid snapshot PDFs now return HTTP 403 on the official health host. In the reviewed browser lane, the exact DPA offices page and the successor Adult Public Assistance / Apply for Medicaid pages now land on Cloudflare `Just a moment...` shells with the visible heading `Performing security verification` instead of materializing office or service content. The still-readable DFCS successor surfaces remain negative: `Services.aspx` still only points users to statewide successor pages, `Publications.aspx` still exposes no DPA office-routing material, and `Site-Map.aspx` still only adds wrong-role OCS and Pioneer Homes branches. Alaska therefore remains BLOCKED and not index-safe because the official health host is challenge-shelled and the readable successor host still adds no borough- or census-area assignment contract.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A reviewable public official page, export, PDF, or API that maps Alaska boroughs or census areas to DPA offices.',
    '- A reopened non-challenged DPA office family on health.alaska.gov that materially exposes service-area or county-equivalent assignment fields.',
    '- Any county-equivalent routing contract on a DFCS or successor host that outruns the current statewide-only service references.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Alaska DPA landing page](https://health.alaska.gov/dpa)',
    '- [Alaska DPA offices page](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)',
    '- [Adult Public Assistance page](https://health.alaska.gov/en/services/adult-public-assistance-apa/)',
    '- [Apply for Medicaid page](https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/)',
    '- [Alaska DPA dashboard PDF](https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf)',
    '- [Alaska Medicaid enrollment monthly snapshot PDF](https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf)',
    '- [DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)',
    '- [DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)',
    '- [DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official Alaska public-assistance office export with borough or census-area assignments.',
    '- Any reopened health.alaska.gov DPA surface that sheds the current challenge shell and exposes office/service-area fields.',
    '- Any official DFCS successor routing surface that names boroughs or census areas alongside DPA offices.',
    '',
    '## Next State Order After Alaska',
    '',
    '1. Oklahoma',
    '2. Ohio',
    '3. Minnesota',
    '4. Maine',
    '5. Idaho',
    '6. Arizona',
    '7. Massachusetts',
    '8. New Mexico',
    '9. South Dakota',
    '10. Rhode Island',
    '',
  ].join('\n');
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 344 Alaska Health Challenge Regression v1',
    '',
    `- state: ${batchSummary.state}`,
    `- classification: ${batchSummary.classification}`,
    `- blocker_family: ${batchSummary.blocker_family}`,
    '',
    '## What changed',
    '',
    '- The current health.alaska.gov DPA family no longer holds the older browser-readable contract used by the prior packet.',
    '- Raw fetches to the DPA landing page, exact offices page, Adult Public Assistance page, Apply for Medicaid page, and the public DPA dashboard / Medicaid snapshot PDFs now all return HTTP 403.',
    '- In the reviewed browser lane, the offices and successor service pages now land on `Just a moment...` / `Performing security verification` shells instead of materializing office or service content.',
    '- The still-readable DFCS successor pages remain public, but they still do not expose borough- or census-area office assignment fields.',
    '',
    '## Final blocker',
    '',
    '- Alaska remains blocked because the official health host is challenge-shelled and the readable successor host still offers no county-equivalent routing contract.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch344AlaskaHealthChallengeRegressionV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: 'batch_3_procedure_hardening',
    critical_gap_families: ['county_local_disability_resources'],
    major_gap_families: [],
    complete_ready: false,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: FAILURE_CODE,
        evidence: buildEvidence(REVIEWED_PROBE),
        next_action: NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      county_local_disability_resources: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: FAMILY_STATUS,
          status_reason: buildStatusReason(REVIEWED_PROBE),
          failure_code: FAILURE_CODE,
          next_action: NEXT_ACTION,
        }
      : row
  );

  const updatedFailureRows = failureRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          failure_code: FAILURE_CODE,
          evidence: buildEvidence(REVIEWED_PROBE),
          next_action: NEXT_ACTION,
        }
      : row
  );

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    const samples = Array.isArray(row.samples) ? [...row.samples] : [];
    replaceSample(samples, 'Alaska DPA offices directory', {
      sample_name: 'Alaska DPA offices directory challenge shell',
      source_url: REVIEWED_PROBE.dpaOffices.url,
      final_url: REVIEWED_PROBE.dpaOffices.browserFinalUrl,
      verification_status: 'blocked',
      source_type: 'official_browser_challenge_shell',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The reviewed browser lane now lands on `Just a moment...` with the visible heading `Performing security verification`, while raw fetch returns HTTP 403 on the official host.'
    });
    replaceSample(samples, 'Adult Public Assistance leaf target', {
      sample_name: 'Adult Public Assistance successor page challenge shell',
      source_url: REVIEWED_PROBE.adultPublicAssistance.url,
      final_url: REVIEWED_PROBE.adultPublicAssistance.browserFinalUrl,
      verification_status: 'blocked',
      source_type: 'official_browser_challenge_shell',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The reviewed successor Adult Public Assistance page also lands on `Just a moment...` on the official health host instead of materializing service content.'
    });
    replaceSample(samples, 'Alaska DPA Dashboard PDF', {
      sample_name: 'Alaska DPA dashboard PDF challenge regression',
      source_url: REVIEWED_PROBE.dpaDashboard.url,
      final_url: REVIEWED_PROBE.dpaDashboard.url,
      verification_status: 'blocked',
      source_type: 'official_raw_403_pdf',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The official DPA dashboard PDF now returns raw HTTP 403 on the health host, so its older region-only evidence can no longer be treated as currently reviewable.'
    });
    replaceSample(samples, 'Alaska Medicaid enrollment snapshot PDF', {
      sample_name: 'Alaska Medicaid enrollment snapshot PDF challenge regression',
      source_url: REVIEWED_PROBE.medicaidSnapshot.url,
      final_url: REVIEWED_PROBE.medicaidSnapshot.url,
      verification_status: 'blocked',
      source_type: 'official_raw_403_pdf',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The official Medicaid enrollment monthly snapshot PDF now returns raw HTTP 403 on the health host, so it no longer provides a currently reviewable public geography lane.'
    });
    return {
      ...row,
      family_status: FAMILY_STATUS,
      blocker_code: FAILURE_CODE,
      blocker_evidence: buildEvidence(REVIEWED_PROBE),
      query_basis:
        'Reviewed 2026-06-25 the current Alaska health.alaska.gov DPA service family and the still-readable DFCS successor surfaces. The health host now returns raw 403s plus browser `Just a moment...` challenge shells, while DFCS still adds no borough or census-area assignment contract.',
      samples,
    };
  });

  const updatedNextRows = [
    {
      state: 'alaska',
      state_code: 'AK',
      priority_rank: 1,
      family: 'county_local_disability_resources',
      severity: 'critical',
      failure_code: FAILURE_CODE,
      next_action: NEXT_ACTION,
      evidence: buildEvidence(REVIEWED_PROBE),
    },
  ];

  const updatedAudit = {
    ...allStateAudit,
    lessonsUpdate: 'Alaska health DPA family now challenge-shelled again while DFCS still adds no county-equivalent routing.',
    states: allStateAudit.states.map((row) =>
      row.stateId === 'alaska'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            incorrectlyIndexSafe: false,
            strongCriticalFamilies: 11,
            weakCriticalFamilies: 1,
            missingCriticalFamilies: 0,
            completenessPct: 91,
            familyStatuses: {
              ...row.familyStatuses,
              county_local_disability_resources: FAMILY_STATUS,
            },
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            packetRecommendedBatch: 'batch_3_procedure_hardening',
          }
        : row
    ),
  };

  const updatedQueueRows = allStateQueue.map((row) =>
    row.state === 'alaska'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 91,
          missing_critical_families: 0,
          weak_critical_families: 1,
          primary_gap_reason: PRIMARY_GAP_REASON,
          recommended_batch: 'batch_3_procedure_hardening',
          status: 'BLOCKED',
        }
      : row
  );

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.allStateAudit, updatedAudit);
  writeJsonl(INPUTS.allStateQueue, updatedQueueRows);
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.allStateReport, replaceAllStateAlaskaNote(fs.readFileSync(INPUTS.allStateReport, 'utf8')));
  fs.writeFileSync(INPUTS.handoff, `${buildHandoff(updatedAudit).trimEnd()}\n`);
  appendLessonIfMissing();

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'alaska',
    classification: 'BLOCKED',
    blocker_family: 'county_local_disability_resources',
    dpa_landing_raw_status: REVIEWED_PROBE.dpaLanding.rawStatus,
    dpa_offices_raw_status: REVIEWED_PROBE.dpaOffices.rawStatus,
    adult_public_assistance_raw_status: REVIEWED_PROBE.adultPublicAssistance.rawStatus,
    apply_for_medicaid_raw_status: REVIEWED_PROBE.applyForMedicaid.rawStatus,
    dpa_dashboard_raw_status: REVIEWED_PROBE.dpaDashboard.rawStatus,
    medicaid_snapshot_raw_status: REVIEWED_PROBE.medicaidSnapshot.rawStatus,
    dpa_offices_browser_title: REVIEWED_PROBE.dpaOffices.browserTitle,
    adult_public_assistance_browser_title: REVIEWED_PROBE.adultPublicAssistance.browserTitle,
    dfcs_services_raw_status: REVIEWED_PROBE.dfcsServices.rawStatus,
    dfcs_publications_raw_status: REVIEWED_PROBE.dfcsPublications.rawStatus,
    dfcs_sitemap_raw_status: REVIEWED_PROBE.dfcsSiteMap.rawStatus,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch344AlaskaHealthChallengeRegressionV1();
  console.log(JSON.stringify(result, null, 2));
}
