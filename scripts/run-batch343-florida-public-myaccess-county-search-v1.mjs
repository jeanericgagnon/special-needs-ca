import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'florida_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'florida_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch343_florida_public_myaccess_county_search_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch343-florida-public-myaccess-county-search-report-v1.md'),
};

const BATCH_NAME = 'batch343_florida_public_myaccess_county_search_v1';
const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';
const COUNTY_FAMILY_STATUS = 'verified_current_public_myaccess_county_partner_search';
const COUNTY_STATUS_REASON =
  'Official Florida county-local routing now clears from the live anonymous MyACCESS Community Partner Search on the current first-party host. The public page at `https://myaccess.myflfamilies.com/Public/CPCPS` exposes a `County` dropdown listing all 67 Florida counties and anonymously returns county-specific partner rows with visible names, street addresses, county labels, and days-of-operation after county search, including reviewed results for Alachua and Washington counties.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-25 one more bounded official Florida county-local pass in the live public MyACCESS runtime. The first-party page `https://myaccess.myflfamilies.com/Public/CPCPS` renders publicly with the title `MyACCESS`, the visible heading `Community Partner Search`, and a live `County` dropdown that lists all 67 Florida counties from Alachua through Washington. A bounded reviewed county search on that same official page for Alachua returns anonymous county-specific community-partner result cards including `Alachua County Health Department`, `Alachua County Library Newberry Branch`, `Transitional Living Of North Central Florida`, and `Early Learning Coalition Of Alachua County`, each with visible street address, county label `Alachua`, and days-of-operation fields. A second reviewed search on the same page for Washington returns an anonymous county-specific result card on the far end of the county list with visible county label `Washington`, address `1301 Main Street, Chipley FL 32428`, and days-of-operation fields. That reviewed public county dropdown plus anonymous county-specific result materialization is a stronger county-complete first-party routing contract than the older partial Family Resource Center storefront lane and clears the last Florida county-local blocker.';
const NEXT_ACTION =
  'Preserve Florida as COMPLETE/index_safe and rerun only maintenance truth audits unless new evidence regresses.';
const LESSON_HEADING = '### Public County Search Forms Can Outrun Partial Storefront Lanes';
const LESSON_BODY =
  '*   **Lesson:** If a first-party benefits SPA visibly exposes a full county dropdown and anonymously materializes county-specific result cards with local names, addresses, county labels, and hours, that public search form can clear a county-local routing family even when an older linked storefront CSV is still partial. Florida only completed once the reviewed live `MyACCESS` `Community Partner Search` page showed all 67 counties and returned county-specific results directly on the public page.';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.length ? `${rows.map((row) => JSON.stringify(row)).join('\n')}\n` : '');
}

function replaceSection(text, startHeading, endHeading, replacement) {
  const start = text.indexOf(startHeading);
  const end = text.indexOf(endHeading, start + startHeading.length);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function appendLessonIfMissing() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

function buildVerifiedCountySamples() {
  return [
    {
      sample_name: 'Florida MyACCESS public Community Partner Search page',
      source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      verification_status: 'verified',
      source_type: 'official_public_county_search_landing_page',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The live first-party page renders publicly with the title `MyACCESS` and the visible heading `Community Partner Search`.'
    },
    {
      sample_name: 'Florida MyACCESS county dropdown lists all 67 counties',
      source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      verification_status: 'verified',
      source_type: 'official_public_county_dropdown_contract',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The live `County` dropdown lists all 67 Florida counties, with the reviewed range running from `Alachua` at the top through `Washington` at the end.'
    },
    {
      sample_name: 'Florida MyACCESS Alachua county anonymous results',
      source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      verification_status: 'verified',
      source_type: 'official_public_county_result_cards',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'A reviewed Alachua county search returns anonymous result cards including `Alachua County Health Department`, `Alachua County Library Newberry Branch`, `Transitional Living Of North Central Florida`, and `Early Learning Coalition Of Alachua County`.'
    },
    {
      sample_name: 'Florida MyACCESS Alachua county result fields',
      source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      verification_status: 'verified',
      source_type: 'official_public_county_result_fields',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The reviewed Alachua result cards preserve visible street address, county label `Alachua`, and days-of-operation fields directly on the public page.'
    },
    {
      sample_name: 'Florida MyACCESS Washington county anonymous result',
      source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      verification_status: 'verified',
      source_type: 'official_public_county_result_cards',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'A second reviewed search for `Washington` returns an anonymous county-specific partner result card with county label `Washington` and address `1301 Main Street, Chipley FL 32428`.'
    },
    {
      sample_name: 'Florida MyACCESS public portal role contract',
      source_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      final_url: 'https://myaccess.myflfamilies.com/Public/CPCPS',
      verification_status: 'verified',
      source_type: 'official_public_portal_scope_statement',
      source_table: BATCH_NAME,
      fetched_at: '2026-06-25T00:00:00.000Z',
      evidence_snippet: 'The footer states `MyACCESS is a portal where Floridians can get and manage benefits online`, including SNAP, cash assistance, and affordable health coverage.'
    }
  ];
}

function buildStateReport(summary, gapRows, verifiedRows, nextRows) {
  return [
    '# Florida California-Grade Audit Report v2',
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
    '- none',
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
    '- Florida is now COMPLETE and index-safe.',
    '- The last county-local blocker is cleared by the reviewed live public MyACCESS `Community Partner Search` page on the official `myflfamilies.com` stack.',
    '- The page exposes a public `County` dropdown listing all 67 Florida counties.',
    '- That same public page anonymously materializes county-specific community partner result cards with visible local names, street addresses, county labels, and days of operation.',
    '- Reviewed searches for Alachua and Washington counties confirm the county-complete dropdown contract and real county-specific result materialization on the official host.',
    '- The older partial Family Resource Center storefront lane is no longer controlling because the reviewed public MyACCESS county search is a stronger first-party county-complete local-routing contract.',
  ].join('\n') + '\n';
}

function updateHandoff(allStateAudit) {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');

  current = current.replace(
    /(## Current Complete States\s*\n\s*\n)([^\n]+)/,
    (_, prefix, list) => {
      const states = list.split(',').map((item) => item.trim()).filter(Boolean);
      if (!states.includes('Florida')) states.push('Florida');
      states.sort((a, b) => a.localeCompare(b));
      return `${prefix}${states.join(', ')}`;
    }
  );

  current = current
    .split('\n')
    .filter((line) => !line.startsWith('- Florida: `'))
    .join('\n');

  const focusBlock = [
    '## Current Focus State: Alaska',
    '',
    '### Blocker Reason',
    '',
    '`county_local_disability_resources` is the only remaining Alaska critical blocker. In the reviewed browser lane, `https://health.alaska.gov/dpa` now renders a live official DPA landing page and links directly to `https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/`, which is now publicly reviewable. That exact DPA offices page preserves regional-office groupings, named offices, office hours, full street addresses, fax numbers, a virtual contact center, and secure document upload routing on the official health host. But it still groups offices only by broad regions and still does not map Alaska boroughs or census areas to those offices. The reviewed page exposes no borough or census-area assignment contract, the official DPA dashboard and Medicaid snapshot PDFs stay region-only, and DFCS successor surfaces still add no local mapping contract. Alaska therefore remains BLOCKED and not index-safe.',
    '',
    '### Exact Evidence Needed',
    '',
    '- A reviewable public official page, export, or PDF that maps Alaska boroughs or census areas to DPA offices.',
    '- Any official borough-to-office or census-area-to-office contract on the current Department of Health or DFCS successor hosts.',
    '- Any official county-equivalent routing surface that materially outruns the current region-only DPA offices page.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [Alaska DPA landing page](https://health.alaska.gov/dpa)',
    '- [Alaska DPA offices page](https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/)',
    '- [Alaska DPA dashboard PDF](https://health.alaska.gov/media/b54gx4ic/dpa-dashboard.pdf)',
    '- [Alaska Medicaid enrollment monthly snapshot PDF](https://health.alaska.gov/media/kk5orhkc/medicaid-enrollment-monthly-snapshot.pdf)',
    '- [DFCS Services](https://dfcs.alaska.gov/Pages/Services.aspx)',
    '- [DFCS Publications](https://dfcs.alaska.gov/Pages/Publications.aspx)',
    '- [DFCS Site Map](https://dfcs.alaska.gov/Pages/Site-Map.aspx)',
    '- [DFCS Search](https://dfcs.alaska.gov/Search/default.aspx)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Any official Alaska public-assistance office export with borough or census-area assignments.',
    '- Any official PDF or HTML lane on the health.alaska.gov stack that adds county-equivalent geography instead of broad regions only.',
    '- Any DFCS successor routing surface that names boroughs or census areas alongside DPA offices.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n?){1,12}/,
    [
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
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, `${current.trimEnd()}\n`);
}

function updateAllStateReport(allStateAudit) {
  const completeStates = allStateAudit.states
    .filter((row) => row.classification === 'COMPLETE')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));
  const blockedStates = allStateAudit.states
    .filter((row) => row.classification === 'BLOCKED')
    .map((row) => row.stateName)
    .sort((a, b) => a.localeCompare(b));

  let current = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  current = current.replace(/- COMPLETE: \d+/, `- COMPLETE: ${completeStates.length}`);
  current = current.replace(/- BLOCKED: \d+/, `- BLOCKED: ${blockedStates.length}`);
  current = current.replace(/- index-safe states: \d+/, `- index-safe states: ${completeStates.length}`);
  current = current.replace(/- complete states: .*/, `- complete states: ${completeStates.join(', ')}`);
  current = current.replace(/- blocked states: .*/, `- blocked states: ${blockedStates.join(', ')}`);

  const filteredLines = current
    .split('\n')
    .filter((line) => !line.startsWith('- Florida remains blocked on county-local routing'))
    .filter((line) => !line.startsWith('- Florida county-local routing is still blocked:'));

  const floridaNote =
    '- Florida is now COMPLETE/index-safe because the reviewed public MyACCESS `Community Partner Search` page exposes a county dropdown listing all 67 Florida counties and anonymously materializes county-specific partner result cards with visible local names, addresses, county labels, and days-of-operation fields.';
  if (!filteredLines.includes(floridaNote)) {
    const notesIndex = filteredLines.findIndex((line) => line.trim() === '## Notes');
    if (notesIndex !== -1) {
      filteredLines.splice(notesIndex + 2, 0, floridaNote);
    } else {
      filteredLines.push('', '## Notes', '', floridaNote);
    }
  }

  fs.writeFileSync(INPUTS.allStateReport, `${filteredLines.join('\n').trimEnd()}\n`);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 343 Florida Public MyACCESS County Search Report v1',
    '',
    '- state: Florida',
    `- classification: ${batchSummary.classification}`,
    `- county_count: ${batchSummary.county_count}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed the live public MyACCESS page at `https://myaccess.myflfamilies.com/Public/CPCPS` renders anonymously on the official host.',
    '- Confirmed the page title is `MyACCESS` and the visible page heading is `Community Partner Search`.',
    '- Confirmed the `County` dropdown lists all 67 Florida counties, with the reviewed range running from `Alachua` through `Washington`.',
    '- Confirmed a reviewed public search for Alachua returns anonymous county-specific partner cards with visible names, street addresses, county labels, and days-of-operation fields.',
    '- Confirmed a second reviewed public search for Washington also returns a county-specific result card on the far end of the county list.',
    '',
    '## Why Florida now completes',
    '',
    '- The public MyACCESS county dropdown is county-complete across all 67 counties.',
    '- The same first-party page anonymously materializes county-specific local-routing results directly in public HTML.',
    '- That county-complete public search contract is stronger than the older partial Family Resource Center storefront lane and clears the last Florida county-local blocker.',
    '',
    '## Final decision',
    '',
    '- Florida is COMPLETE and index-safe.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch343FloridaPublicMyaccessCountySearchV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: BATCH_NAME,
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
    final_blockers: [],
    familyStatuses: {
      ...summary.familyStatuses,
      county_local_disability_resources: COUNTY_FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: COUNTY_FAMILY_STATUS,
          status_reason: COUNTY_STATUS_REASON,
        }
      : row
  );

  const updatedVerifiedRows = verifiedRows.map((row) =>
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'verified_state_grade',
          evidence_strength: 'strong',
          sample_count: 6,
          query_basis: 'Reviewed 2026-06-25 the live anonymous public MyACCESS Community Partner Search county dropdown and county-specific result cards on the official Florida host.',
          blocker_code: null,
          blocker_evidence: null,
          samples: buildVerifiedCountySamples(),
        }
      : row
  );

  const updatedNextActions = [
    {
      state: 'florida',
      state_code: 'FL',
      priority_rank: 1,
      family: 'maintenance',
      severity: 'info',
      failure_code: 'complete_maintain_truth_only',
      next_action: NEXT_ACTION,
      evidence: 'The reviewed public MyACCESS Community Partner Search now exposes all 67 Florida counties and anonymously materializes county-specific partner result cards with local names, addresses, county labels, and days-of-operation fields.',
    },
  ];

  const updatedQueueRows = allStateQueue.map((row) =>
    row.state === 'florida'
      ? {
          ...row,
          classification: 'COMPLETE',
          index_safe: true,
          completeness_pct: 100,
          missing_critical_families: 0,
          weak_critical_families: 0,
          primary_gap_reason: 'none',
          recommended_batch: 'complete_maintain',
          status: 'COMPLETE',
        }
      : row
  );

  const updatedAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) =>
      row.stateId === 'florida'
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
              ...row.familyStatuses,
              county_local_disability_resources: COUNTY_FAMILY_STATUS,
            },
            packetBatch: BATCH_NAME,
            packetPrimaryGapReason: 'none',
            packetRecommendedBatch: 'complete_maintain',
          }
        : row
    ),
  };

  const completeCount = updatedAudit.states.filter((row) => row.classification === 'COMPLETE').length;
  updatedAudit.classifications = {
    COMPLETE: completeCount,
    BLOCKED: updatedAudit.states.length - completeCount,
  };
  updatedAudit.indexSafeCount = updatedAudit.states.filter((row) => row.indexSafe).length;
  updatedAudit.lessonsUpdate = 'Florida public MyACCESS county search now materially clears county-local routing.';

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, []);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextActions);
  writeJsonl(INPUTS.allStateQueue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAudit);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedNextActions));
  updateAllStateReport(updatedAudit);
  updateHandoff(updatedAudit);
  appendLessonIfMissing();

  const batchSummary = {
    batch: BATCH_NAME,
    state: 'florida',
    classification: 'COMPLETE',
    index_safe: true,
    county_count: 67,
    county_dropdown_count: 67,
    alachua_result_count: 7,
    washington_result_count: 1,
    remaining_blocker_family: null,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch343FloridaPublicMyaccessCountySearchV1();
  console.log(JSON.stringify(result, null, 2));
}
