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
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch352_alaska_dfcs_search_root_finality_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch352-alaska-dfcs-search-root-finality-report-v1.md'),
};

const BATCH_NAME = 'batch352_alaska_dfcs_search_root_finality_v1';
const HOLD_BATCH = 'hold_for_new_official_borough_assignment_contract';
const HOLD_REPAIR_LANE = 'blocked_until_new_official_public_county_contract';
const PRIMARY_GAP_REASON =
  'raw_health_host_challenge_persists_while_browser_reviewed_dpa_offices_page_still_lacks_borough_assignment_and_dfcs_root_sitemap_contacts_search_add_no_dpa_contract';
const FAILURE_CODE =
  'raw_health_host_challenge_persists_and_dfcs_root_sitemap_contacts_plus_search_guesses_expose_no_dpa_borough_or_census_area_contract';
const FAMILY_STATUS =
  'blocked_raw_health_host_challenge_plus_region_only_dpa_page_and_dfcs_root_sitemap_contacts_search_without_county_equivalent_contract';
const NEXT_ACTION =
  'hold_blocked_until_alaska_publishes_borough_or_census_area_to_dpa_office_assignment_on_reviewable_public_page_export_api_or_directory';
const UPDATED_AT = '2026-06-25';

const DFCS_PROBE = {
  generatedAt: new Date().toISOString(),
  fetchedDate: UPDATED_AT,
  dfcsRoot: {
    url: 'https://dfcs.alaska.gov/Pages/default.aspx',
    status: 200,
    finalUrl: 'https://dfcs.alaska.gov/Pages/default.aspx',
    title: 'Department of Family and Community Services',
  },
  dfcsServices: {
    url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
    status: 200,
    finalUrl: 'https://dfcs.alaska.gov/Pages/Services.aspx',
    title: 'Services',
  },
  dfcsSiteMap: {
    url: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
    status: 200,
    finalUrl: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
    title: 'Site Map',
  },
  dfcsContacts: {
    url: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
    status: 200,
    finalUrl: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
    title: 'Department Contacts',
  },
  publicAssistanceSearchGuess: {
    url: 'https://dfcs.alaska.gov/Pages/search-results.aspx?k=public%20assistance',
    status: 404,
    finalUrl: 'https://dfcs.alaska.gov/Pages/search-results.aspx?k=public%20assistance',
  },
  officeSearchGuess: {
    url: 'https://dfcs.alaska.gov/Pages/search-results.aspx?k=office',
    status: 404,
    finalUrl: 'https://dfcs.alaska.gov/Pages/search-results.aspx?k=office',
  },
  medicaidSearchGuess: {
    url: 'https://dfcs.alaska.gov/Pages/search-results.aspx?k=medicaid',
    status: 404,
    finalUrl: 'https://dfcs.alaska.gov/Pages/search-results.aspx?k=medicaid',
  },
  adultPublicAssistanceSearchGuess: {
    url: 'https://dfcs.alaska.gov/Pages/search-results.aspx?k=adult%20public%20assistance',
    status: 404,
    finalUrl: 'https://dfcs.alaska.gov/Pages/search-results.aspx?k=adult%20public%20assistance',
  },
};

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

function buildStatusReason() {
  return `The live Alaska county-local blocker tightened again after one more bounded official DFCS-surface pass on ${UPDATED_AT}. The health-host DPA family still fails closed in the raw low-token lane: the exact DPA landing page, DPA offices page, and two health-host PDFs still return HTTP 403 Cloudflare challenge shells. The earlier browser-reviewed DPA offices page is still the strongest positive evidence on that host, but it still only groups offices by broad regions and still does not assign Alaska boroughs or census areas to those offices. The DFCS successor host now also looks source-final in a more explicit way. The DFCS root page still only routes into the Commissioner and Office of Children's Services branches, not public assistance or DPA office routing. The public Services page still only relays statewide phone routing for Adult Public Assistance and Apply for Medicaid back onto the challenge-blocked health host. The public Site Map still surfaces OCS offices, OCS grievance, Pioneer Homes payment assistance, and other wrong-role branches but no DPA/public-assistance office directory. The Commissioner Department Contacts page still exposes only Commissioner and OCS sections. Finally, bounded search-result guesses at \`/Pages/search-results.aspx?k=public%20assistance\`, \`office\`, \`medicaid\`, and \`adult%20public%20assistance\` all return 404, so the DFCS host does not expose a recoverable public search lane for this family either. Alaska therefore still lacks any public official borough- or census-area-to-office assignment contract.`;
}

function buildEvidence() {
  return `Reviewed ${UPDATED_AT} exact official Alaska county-local surfaces again with one more bounded DFCS-root pass. The raw health-host lane still fails closed: \`https://health.alaska.gov/en/division-of-public-assistance/\`, \`https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/\`, \`https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf\`, and \`https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf\` still return HTTP 403 with the Cloudflare title "Just a moment...". The prior browser-reviewed DPA offices page remains the strongest positive evidence on the same host, but it still only groups offices by broad regions and still does not map Alaska boroughs or census areas to those offices. On the DFCS successor host, \`https://dfcs.alaska.gov/Pages/default.aspx\` still only routes into Commissioner and OCS branches rather than any DPA/public-assistance office directory. \`https://dfcs.alaska.gov/Pages/Services.aspx\` still only links Adult Public Assistance and Apply for Medicaid back to the challenge-blocked health host plus statewide phone routing. \`https://dfcs.alaska.gov/Pages/Site-Map.aspx\` still only exposes wrong-role branches such as OCS offices, OCS grievance, and Pioneer Homes payment assistance. \`https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx\` still exposes only Commissioner and OCS sections rather than any DPA/public-assistance office directory or borough-assignment text. Bounded search-result guesses at \`https://dfcs.alaska.gov/Pages/search-results.aspx?k=public%20assistance\`, \`office\`, \`medicaid\`, and \`adult%20public%20assistance\` all returned 404. Alaska therefore still lacks any public official borough- or census-area-to-office assignment surface that can satisfy county-equivalent local routing.`;
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
    '- The raw low-token lane still gets Cloudflare `Just a moment...` 403 shells across the health-host DPA family.',
    '- The earlier reviewed browser DPA offices page still exists but still only groups offices by broad regions, not boroughs or census areas.',
    '- The DFCS root, Services, Site Map, and Department Contacts pages still expose no DPA/public-assistance office directory or borough-assignment contract.',
    '- The bounded DFCS search-result guesses for `public assistance`, `office`, `medicaid`, and `adult public assistance` all returned 404, so there is no recoverable public search lane on that host for this family.',
    '- Alaska therefore still lacks any public official borough- or census-area office-routing contract on a reviewable surface.',
  ].join('\n') + '\n';
}

function replaceAllStateAlaskaNote(text) {
  const lines = text.split('\n').filter((line) => !line.startsWith('- Alaska county-local routing is still blocked'));
  lines.push('- Alaska county-local routing is still blocked: the raw low-token lane still gets Cloudflare `Just a moment...` 403 shells across the health-host DPA family, the earlier browser-reviewed DPA offices page still only groups regional offices without borough or census-area assignments, and DFCS root, site-map, contacts, and bounded search-result checks still expose no DPA office contract or public search recovery lane.');
  return `${lines.join('\n').replace(/\n+$/, '')}\n`;
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
    `Updated: ${UPDATED_AT}`,
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
    '`county_local_disability_resources` is still the only remaining Alaska blocker. One more bounded official DFCS pass confirmed the raw health-host DPA family remains challenge-blocked, and it also closed off the DFCS host more tightly. The reviewed browser DPA offices page still only groups offices by broad regions rather than boroughs or census areas. The DFCS root still only routes into Commissioner and OCS branches, the public Services page still only relays statewide phone routing back to challenge-blocked health-host leaves, the public Site Map still only exposes wrong-role branches like OCS offices and Pioneer Homes payment assistance, and the Commissioner Department Contacts page still exposes only Commissioner and OCS sections. Bounded search-result guesses for `public assistance`, `office`, `medicaid`, and `adult public assistance` all returned 404, so DFCS does not expose a recoverable public search lane either. Alaska remains BLOCKED because there is still no public official borough- or census-area office assignment surface.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Any official Alaska page, table, export, PDF, API, or directory that explicitly maps boroughs or census areas to DPA office locations.',
    '- Any official DFCS or Department of Health directory leaf that directly names borough/census-area coverage for public-assistance offices.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Alaska DPA landing page](https://health.alaska.gov/en/division-of-public-assistance/)',
    '- [Alaska DPA offices page](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)',
    '- [Alaska DPA dashboard PDF](https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf)',
    '- [Alaska Medicaid enrollment snapshot PDF](https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf)',
    '- [DFCS root](https://dfcs.alaska.gov/Pages/default.aspx)',
    '- [DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)',
    '- [DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)',
    '- [DFCS Department Contacts](https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx)',
    '- [DFCS search guess: public assistance](https://dfcs.alaska.gov/Pages/search-results.aspx?k=public%20assistance)',
    '- [DFCS search guess: office](https://dfcs.alaska.gov/Pages/search-results.aspx?k=office)',
    '- [DFCS search guess: medicaid](https://dfcs.alaska.gov/Pages/search-results.aspx?k=medicaid)',
    '- [DFCS search guess: adult public assistance](https://dfcs.alaska.gov/Pages/search-results.aspx?k=adult%20public%20assistance)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any public official borough- or census-area-to-office assignment table on Alaska Department of Health or DFCS.',
    '- Any public official DPA office directory export, API, or PDF that lists explicit borough/census-area coverage.',
    '',
    '## Next State Order After Alaska',
    '',
    '1. Maine',
    '2. Idaho',
    '3. Arizona',
    '4. Massachusetts',
    '5. New Mexico',
    '6. South Dakota',
    '7. Rhode Island',
    '8. Virginia',
    '9. West Virginia',
    '10. North Dakota',
    '',
  ].join('\n');
}

function buildBatchReport() {
  return [
    '# Batch 352 Alaska DFCS Search And Root Finality v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- change: tightened the Alaska county-local blocker by proving the DFCS root, site map, contacts, and bounded search-result lane still expose no DPA/public-assistance office contract',
    '',
    '## Evidence',
    '',
    `- ${buildStatusReason()}`,
  ].join('\n') + '\n';
}

export function generateBatch352AlaskaDfcsSearchRootFinalityV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const allStateAudit = readJson(INPUTS.allStateAudit);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateReport = fs.readFileSync(INPUTS.allStateReport, 'utf8');

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    primary_gap_reason: PRIMARY_GAP_REASON,
    recommended_batch: HOLD_BATCH,
    final_blockers: [
      {
        family: 'county_local_disability_resources',
        failure_code: FAILURE_CODE,
        evidence: buildEvidence(),
        next_action: NEXT_ACTION,
      },
    ],
    familyStatuses: {
      ...summary.familyStatuses,
      county_local_disability_resources: FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: FAMILY_STATUS, status_reason: buildStatusReason() }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: buildEvidence(), next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
        ...row,
        family_status: FAMILY_STATUS,
        sample_count: 7,
        blocker_code: FAILURE_CODE,
        blocker_evidence: buildEvidence(),
        query_basis: 'Reviewed the exact official Alaska health-host DPA surfaces plus one more bounded DFCS root, site-map, contacts, and search-result pass.',
        samples: [
          {
            sample_name: 'Alaska DPA offices raw challenge shell',
            source_url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
            final_url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
            verification_status: 'blocked',
            source_type: 'official_health_host_challenge_shell',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The exact DPA offices page still returned HTTP 403 with the Cloudflare title "Just a moment..." in the raw low-token lane.',
          },
          {
            sample_name: 'Alaska browser-reviewed DPA offices page',
            source_url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
            final_url: 'https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/',
            verification_status: 'reviewed',
            source_type: 'browser_reviewed_official_page_without_borough_assignment',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The reviewed official page still proves real DPA offices exist, but only by broad regions rather than borough or census-area assignments.',
          },
          {
            sample_name: 'Alaska DFCS root page',
            source_url: 'https://dfcs.alaska.gov/Pages/default.aspx',
            final_url: 'https://dfcs.alaska.gov/Pages/default.aspx',
            verification_status: 'reviewed',
            source_type: 'official_root_without_dpa_branch',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The DFCS root still routes only into Commissioner and OCS branches and exposes no DPA/public-assistance office directory branch.',
          },
          {
            sample_name: 'Alaska DFCS Services page',
            source_url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
            final_url: 'https://dfcs.alaska.gov/Pages/Services.aspx',
            verification_status: 'reviewed',
            source_type: 'official_services_page_without_local_contract',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Services page still only relays Adult Public Assistance and Apply for Medicaid back to health-host leaves plus statewide phone routing.',
          },
          {
            sample_name: 'Alaska DFCS Site Map page',
            source_url: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
            final_url: 'https://dfcs.alaska.gov/Pages/Site-Map.aspx',
            verification_status: 'reviewed',
            source_type: 'official_sitemap_without_dpa_directory',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Site Map still exposes wrong-role OCS offices, OCS grievance, and Pioneer Homes payment-assistance branches rather than a DPA/public-assistance office directory.',
          },
          {
            sample_name: 'Alaska DFCS Department Contacts page',
            source_url: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
            final_url: 'https://dfcs.alaska.gov/Commissioner/Pages/Contacts/default.aspx',
            verification_status: 'reviewed',
            source_type: 'official_contacts_page_without_dpa_directory',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'The Department Contacts page still exposes only Commissioner and OCS sections rather than any DPA/public-assistance office directory or borough-assignment text.',
          },
          {
            sample_name: 'Alaska DFCS bounded search-result guesses',
            source_url: 'https://dfcs.alaska.gov/Pages/search-results.aspx?k=public%20assistance',
            final_url: 'https://dfcs.alaska.gov/Pages/search-results.aspx?k=public%20assistance',
            verification_status: 'blocked',
            source_type: 'official_search_lane_missing',
            source_table: BATCH_NAME,
            fetched_at: '2026-06-25T00:00:00.000Z',
            evidence_snippet: 'Bounded search-result guesses for public assistance, office, medicaid, and adult public assistance all returned 404, so DFCS exposes no recoverable public search lane for this family.',
          },
        ],
      }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: buildEvidence() }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    generatedAt: new Date().toISOString(),
    states: allStateAudit.states.map((row) => (
      row.stateId === 'alaska'
        ? {
          ...row,
          classification: 'BLOCKED',
          indexSafe: false,
          completenessPct: 91,
          weakCriticalFamilies: 1,
          familyStatuses: {
            ...row.familyStatuses,
            county_local_disability_resources: FAMILY_STATUS,
          },
          packetBatch: BATCH_NAME,
          packetPrimaryGapReason: PRIMARY_GAP_REASON,
          packetRecommendedBatch: HOLD_BATCH,
        }
        : row
    )),
  };

  const updatedQueue = allStateQueue.map((row) => (
    row.state === 'alaska'
      ? {
        ...row,
        classification: 'BLOCKED',
        index_safe: false,
        completeness_pct: 91,
        primary_gap_reason: PRIMARY_GAP_REASON,
        recommended_batch: HOLD_BATCH,
        status: 'BLOCKED',
        repair_lane: HOLD_REPAIR_LANE,
      }
      : row
  ));

  const batchSummary = {
    batch: BATCH_NAME,
    classification: 'BLOCKED',
    index_safe: false,
    health_host_challenge_persists: true,
    dfcs_root_status: 200,
    dfcs_services_status: 200,
    dfcs_site_map_status: 200,
    dfcs_contacts_status: 200,
    dfcs_search_guess_404s: 4,
    dfcs_public_search_lane_found: false,
    borough_assignment_contract_found: false,
    result: 'dfcs_root_sitemap_contacts_and_search_lane_add_no_dpa_borough_assignment_contract',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.allStateAudit, updatedAudit);
  writeJsonl(INPUTS.allStateQueue, updatedQueue);
  fs.writeFileSync(INPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(INPUTS.allStateReport, replaceAllStateAlaskaNote(allStateReport));
  fs.writeFileSync(INPUTS.handoff, buildHandoff(updatedAudit));
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport());

  return {
    classification: updatedSummary.classification,
    primary_gap_reason: updatedSummary.primary_gap_reason,
    batch: BATCH_NAME,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch352AlaskaDfcsSearchRootFinalityV1();
  console.log(JSON.stringify(result, null, 2));
}
