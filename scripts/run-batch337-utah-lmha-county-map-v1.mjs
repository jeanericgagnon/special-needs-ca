import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'utah_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'utah_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'utah_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'utah_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'utah_next_action_queue_v2.jsonl'),
  report: path.join(docsGeneratedDir, 'utah-california-grade-audit-report-v2.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
  allStateQueue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch337_utah_lmha_county_map_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch337-utah-lmha-county-map-report-v1.md'),
};

const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_reviewed_first_party_or_official_evidence';
const COUNTY_FAMILY_STATUS = 'verified_current_official_lmha_county_map';
const COUNTY_STATUS_REASON =
  'Utah county-local disability resources now clear from reviewed first-party SUMH evidence on the current official DHHS stack. The official `Local Mental Health Authority Location Map` page on `sumh.utah.gov` explicitly says `Click on your county to find your Local Mental Health Authority (LMHA)` and names all 29 Utah counties on the live page, while the companion official `Mental Health` page says Utah county LMHAs provide mental health services to residents of all ages, including those with Medicaid and those who are unfunded.';
const COUNTY_EVIDENCE =
  'Reviewed 2026-06-24 one more bounded official Utah county-local pass and found a complete first-party county-grade local routing surface on the current DHHS stack. `https://sumh.utah.gov/contact/location-map/` returns HTTP 200 with the title `Local Mental Health Authority Location Map | Substance Use and Mental Health | Utah Department of Health and Human Services`, explicitly says `Click on your county to find your Local Mental Health Authority (LMHA)`, and names all 29 Utah counties on the live page. County-specific blocks on that same official page preserve local authority names, phones, addresses, websites, and prevention-contact details, including explicit rows for Daggett County, Morgan County, and the Rich County lane. The companion official `https://sumh.utah.gov/mental-health/` page also returns HTTP 200 and says `In Utah, the county local mental health authorities (LMHAs) provide mental health services to their residents of all ages, including those with Medicaid and to those who are unfunded` and tells users `To find the LMHAs review the location map.` That first-party pair replaces the weaker DWS inventory lane and clears the last Utah county-local blocker with county-complete official routing evidence.';
const NEXT_ACTION =
  'Preserve Utah as COMPLETE/index_safe and rerun only maintenance truth audits unless new evidence regresses.';
const LESSON_HEADING = '### Official County LMHA Maps Can Clear The Last Local-Resource Blocker';
const LESSON_BODY =
  '*   **Lesson:** If an official state mental-health authority page explicitly says `Click on your county to find your Local Mental Health Authority` and the same first-party page names every county with local authority contact blocks, that can clear a county-local disability-resource family even when earlier generic office-search lanes failed. Utah only completed once the reviewed `sumh.utah.gov/contact/location-map/` LMHA map replaced the weaker DWS and generic DHHS contact surfaces.';

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
  const end = text.indexOf(endHeading);
  if (start === -1 || end === -1 || end <= start) return text;
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}

function appendLessonIfMissing() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

function buildStateReport(summary, gapRows, verifiedRows, nextRows) {
  return [
    '# Utah California-Grade Audit Report v2',
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
    '- Utah is now COMPLETE and index-safe.',
    '- The official Utah Schools Directory still clears district-grade education routing.',
    '- The last county-local blocker is now cleared by the reviewed first-party SUMH local mental health authority map on the current official DHHS host.',
    '- The official `Local Mental Health Authority Location Map` page explicitly says `Click on your county to find your Local Mental Health Authority (LMHA)` and names all 29 Utah counties on the live page.',
    '- The companion official `Mental Health` page explicitly says Utah county LMHAs provide mental health services to residents of all ages, including those with Medicaid and those who are unfunded, and points families back to the location map.',
    '- That county-complete first-party LMHA routing surface is stronger than the older DWS office-search inventory lane and closes the final Utah county-local gap.',
  ].join('\n') + '\n';
}

function updateHandoff() {
  let current = fs.readFileSync(INPUTS.handoff, 'utf8');

  current = current.replace(
    /(## Current Complete States\s*\n\s*\n)([^\n]+)/,
    (_, prefix, list) => {
      const states = list.split(',').map((item) => item.trim()).filter(Boolean);
      if (!states.includes('Utah')) states.push('Utah');
      states.sort((a, b) => a.localeCompare(b));
      return `${prefix}${states.join(', ')}`;
    }
  );

  current = current
    .split('\n')
    .filter((line) => !line.startsWith('- Utah: `'))
    .join('\n');

  const focusBlock = [
    '## Current Focus State: Kansas',
    '',
    '### Blocker Reason',
    '',
    '`district_or_county_education_routing` is the only remaining Kansas critical blocker. The current live raw lane still returns the same `Request Rejected` shell for `https://uapps.ksde.gov/Directory_Rpts/default.aspx`, `https://www.ksde.gov/data-and-reporting/directories`, and `https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12`. One fresh exact district-scoped submit replay against the current Directory Reports root also returned the same `Request Rejected` shell instead of a workbook. Kansas now has reviewed local education-routing proof for 24 of 105 counties from preserved district-owned or district-linked leaves, including the district-owned Parsons USD 503 `Tri-County Special Education Cooperative` leaf for Labette County. Kansas remains BLOCKED because county-grade local education proof is still incomplete across the remaining counties, and the only trustworthy next lane is saved district-owned or district-linked local leaf authoring rather than the current flapping KSDE export stack.',
    '',
    '### Exact Evidence Needed',
    '',
    '- Exact district-owned or district-linked special-education, special-services, ESS, or cooperative leaves for unresolved Kansas counties.',
    '- Role-pure district leaves that preserve special-education or Child Find routing on the district-owned host.',
    '- Any new official KSDE export lane only if it becomes reproducibly public again in bounded raw fetches.',
    '',
    '### Useful Official URLs Already Tried',
    '',
    '- [KSDE Directory Reports root](https://uapps.ksde.gov/Directory_Rpts/default.aspx)',
    '- [KSDE Directories page](https://www.ksde.gov/data-and-reporting/directories)',
    '- [Kansas Educational Directory PDF URL](https://www.ksde.gov/docs/default-source/crp/2025-2026-kansas-educational-directory.pdf?sfvrsn=7c81fd62_12)',
    '- [Parsons USD 503 Tri-County Special Education Cooperative](https://www.usd503.org/page/tri-county-special-education-cooperative/)',
    '',
    '### Top Remaining Source-Scouting Targets',
    '',
    '- Saved district-owned or district-linked special-education leaves for unresolved Kansas counties.',
    '- District sitemap-discovered cooperative or ESS leaves that stay on the district-owned host.',
    '- New exact local education leaves only; do not reopen broad KSDE export retries unless the state lane materially changes.',
    '',
  ].join('\n');

  current = replaceSection(current, '## Current Focus State:', '## Next State Order After', focusBlock);
  current = current.replace(
    /## Next State Order After[^\n]*\n\n(?:\d+\..*\n?){1,12}/,
    [
      '## Next State Order After Kansas',
      '',
      '1. Nebraska',
      '2. Nevada',
      '3. Florida',
      '4. Alaska',
      '5. South Carolina',
      '6. North Carolina',
      '7. New York',
      '8. Oklahoma',
      '9. Oregon',
      '10. Ohio',
    ].join('\n')
  );

  fs.writeFileSync(INPUTS.handoff, `${current.trimEnd()}\n`);
}

function updateAllStateReport() {
  const current = fs.readFileSync(INPUTS.allStateReport, 'utf8')
    .replace('- COMPLETE: 26', '- COMPLETE: 27')
    .replace('- BLOCKED: 24', '- BLOCKED: 23')
    .replace('- index-safe states: 26', '- index-safe states: 27')
    .replace(
      'complete states: Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas',
      'complete states: Alabama, Arkansas, California, Colorado, Connecticut, Delaware, Georgia, Hawaii, Illinois, Indiana, Iowa, Kentucky, Louisiana, Maryland, Michigan, Mississippi, Missouri, Montana, Nevada, New Jersey, New York, North Carolina, Oregon, Pennsylvania, South Carolina, Texas, Utah'
    )
    .replace(
      'blocked states: Alaska, Arizona, Florida, Idaho, Kansas, Maine, Massachusetts, Minnesota, Nebraska, New Hampshire, New Mexico, North Dakota, Ohio, Oklahoma, Rhode Island, South Dakota, Tennessee, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming',
      'blocked states: Alaska, Arizona, Florida, Idaho, Kansas, Maine, Massachusetts, Minnesota, Nebraska, New Hampshire, New Mexico, North Dakota, Ohio, Oklahoma, Rhode Island, South Dakota, Tennessee, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming'
    );

  const note = '- Utah is now COMPLETE/index-safe because the reviewed first-party SUMH `Local Mental Health Authority Location Map` explicitly names all 29 Utah counties and the companion official `Mental Health` page defines county LMHAs as the local service authorities for residents of all ages, including Medicaid recipients.';

  const lines = current.split('\n').filter((line) => !line.startsWith('- Utah remains blocked because'));
  if (!lines.includes(note)) {
    const notesIndex = lines.findIndex((line) => line.trim() === '## Notes');
    if (notesIndex !== -1) {
      lines.splice(notesIndex + 2, 0, note);
    } else {
      lines.push('', '## Notes', '', note);
    }
  }

  fs.writeFileSync(INPUTS.allStateReport, `${lines.join('\n').trimEnd()}\n`);
}

function buildBatchReport(batchSummary) {
  return [
    '# Batch 337 Utah LMHA County Map Report v1',
    '',
    '- state: Utah',
    `- classification: ${batchSummary.classification}`,
    `- county_count: ${batchSummary.county_count}`,
    '',
    '## What was confirmed',
    '',
    '- Confirmed `https://sumh.utah.gov/contact/location-map/` returns HTTP 200 on the current official Utah DHHS stack.',
    '- Confirmed the live page title is `Local Mental Health Authority Location Map | Substance Use and Mental Health | Utah Department of Health and Human Services`.',
    '- Confirmed the live page explicitly says `Click on your county to find your Local Mental Health Authority (LMHA)`.',
    '- Confirmed the same first-party page names all 29 Utah counties and preserves county-specific LMHA contact blocks.',
    '- Confirmed the page preserves explicit local authority details for the previously unresolved remainder, including Daggett County, Morgan County, and the Rich County lane.',
    '- Confirmed the companion `https://sumh.utah.gov/mental-health/` page says Utah county LMHAs provide mental health services to residents of all ages, including those with Medicaid and those who are unfunded, and points families back to the location map.',
    '',
    '## Why Utah now completes',
    '',
    '- The official county LMHA map is county-complete on the current first-party Utah DHHS host.',
    '- The official companion mental-health page makes the LMHA role explicit and ties the local-authority contract back to the same first-party map.',
    '- That pair replaces the weaker generic DHHS contacts and DWS office-inventory lanes and closes the last Utah county-local blocker.',
    '',
    '## Final decision',
    '',
    '- Utah is COMPLETE and index-safe.',
    '',
  ].join('\n') + '\n';
}

export function generateBatch337UtahLmhaCountyMapV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const allStateQueue = readJsonl(INPUTS.allStateQueue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch337_utah_lmha_county_map_v1',
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
      ...(summary.familyStatuses || {}),
      county_local_disability_resources: COUNTY_FAMILY_STATUS,
    },
  };

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: COUNTY_FAMILY_STATUS,
          status_reason: COUNTY_STATUS_REASON,
        }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'county_local_disability_resources') return row;
    return {
      ...row,
      family_status: 'verified_state_grade',
      evidence_strength: 'strong',
      sample_count: 4,
      query_basis: 'Reviewed the current official Utah SUMH Local Mental Health Authority county map plus the companion official Mental Health page.',
      blocker_code: null,
      blocker_evidence: null,
      samples: [
        {
          sample_name: 'Official Utah LMHA county map title and host',
          source_url: 'https://sumh.utah.gov/contact/location-map/',
          final_url: 'https://sumh.utah.gov/contact/location-map/',
          verification_status: 'verified',
          source_type: 'official_county_map_landing_page',
          source_table: 'batch337_utah_lmha_county_map_v1',
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The live page title is `Local Mental Health Authority Location Map | Substance Use and Mental Health | Utah Department of Health and Human Services`.'
        },
        {
          sample_name: 'Official county click contract for Utah LMHAs',
          source_url: 'https://sumh.utah.gov/contact/location-map/',
          final_url: 'https://sumh.utah.gov/contact/location-map/',
          verification_status: 'verified',
          source_type: 'official_county_map_contract',
          source_table: 'batch337_utah_lmha_county_map_v1',
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The live first-party page explicitly says `Click on your county to find your Local Mental Health Authority (LMHA)`.'
        },
        {
          sample_name: 'All 29 Utah counties appear on official LMHA map',
          source_url: 'https://sumh.utah.gov/contact/location-map/',
          final_url: 'https://sumh.utah.gov/contact/location-map/',
          verification_status: 'verified',
          source_type: 'official_county_complete_directory',
          source_table: 'batch337_utah_lmha_county_map_v1',
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The live county list names all 29 Utah counties, including Beaver, Box Elder, Cache, Carbon, Daggett, Morgan, Rich, Salt Lake, Utah, Washington, Wayne, and Weber.'
        },
        {
          sample_name: 'Official Mental Health page defines county LMHAs',
          source_url: 'https://sumh.utah.gov/mental-health/',
          final_url: 'https://sumh.utah.gov/mental-health/',
          verification_status: 'verified',
          source_type: 'official_role_definition_page',
          source_table: 'batch337_utah_lmha_county_map_v1',
          fetched_at: '2026-06-24T00:00:00.000Z',
          evidence_snippet: 'The official page says Utah county LMHAs provide mental health services to residents of all ages, including those with Medicaid and those who are unfunded, and tells users to review the location map.'
        }
      ],
    };
  });

  const updatedNextActions = [
    {
      state: 'utah',
      state_code: 'UT',
      priority_rank: 1,
      family: 'maintenance',
      severity: 'info',
      failure_code: 'complete_maintain_truth_only',
      next_action: NEXT_ACTION,
      evidence: 'The reviewed first-party SUMH Local Mental Health Authority county map now names all 29 Utah counties and the companion official Mental Health page explicitly defines those county LMHAs as the local service authorities.'
    }
  ];

  const updatedQueueRows = allStateQueue.map((row) => (
    row.state === 'utah'
      ? {
          ...row,
          classification: 'COMPLETE',
          index_safe: true,
          completeness_pct: 100,
          weak_critical_families: 0,
          primary_gap_reason: 'none',
          recommended_batch: 'complete_maintain',
          status: 'COMPLETE',
          repair_lane: 'maintain_truth_only',
        }
      : row
  ));

  const updatedAudit = {
    ...allStateAudit,
    indexSafeCount: 27,
    states: (allStateAudit.states || []).map((row) => (
      row.stateId === 'utah'
        ? {
            ...row,
            classification: 'COMPLETE',
            indexSafe: true,
            strongCriticalFamilies: 12,
            weakCriticalFamilies: 0,
            missingCriticalFamilies: 0,
            completenessPct: 100,
            familyStatuses: {
              ...(row.familyStatuses || {}),
              county_local_disability_resources: COUNTY_FAMILY_STATUS,
            },
            packetBatch: 'batch337_utah_lmha_county_map_v1',
            packetPrimaryGapReason: 'none',
            packetRecommendedBatch: 'complete_maintain',
          }
        : row
    )),
  };

  const batchSummary = {
    state: 'utah',
    batch: 'batch337_utah_lmha_county_map_v1',
    classification: 'COMPLETE',
    index_safe: true,
    county_count: 29,
    county_lmha_map_url: 'https://sumh.utah.gov/contact/location-map/',
    county_lmha_role_page_url: 'https://sumh.utah.gov/mental-health/',
    all_29_counties_present: true,
    remaining_blocker_family: null,
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, []);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextActions);
  writeJsonl(INPUTS.allStateQueue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAudit);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(INPUTS.report, buildStateReport(updatedSummary, updatedGapRows, updatedVerifiedRows, updatedNextActions));
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(batchSummary));
  updateHandoff();
  updateAllStateReport();
  appendLessonIfMissing();

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch337UtahLmhaCountyMapV1();
  console.log(JSON.stringify(result, null, 2));
}
