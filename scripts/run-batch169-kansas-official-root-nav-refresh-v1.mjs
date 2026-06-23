import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'kansas_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'kansas_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'kansas_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'kansas_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'kansas_next_action_queue_v2.jsonl'),
  ddPacket: path.join(generatedDir, 'kansas_developmental_disability_idd_authority_repair_packet_v1.json'),
  educationPacket: path.join(generatedDir, 'kansas_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch169_kansas_official_root_nav_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch169-kansas-official-root-nav-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'kansas-california-grade-audit-report-v2.md'),
};

const DD_FAILURE_CODE = 'kdads_and_kancare_roots_and_dd_surfaces_now_return_uniform_http_403';
const DD_STATUS = 'blocked_uniform_http_403_dd_stack';
const DD_REASON = 'Kansas now has a stricter DD blocker: the live KDADS root, the exact KDADS developmental-disabilities leaf, the KDADS robots file, the KanCare root, and the KanCare HCBS fact-sheet leaf all return HTTP 403 / access denied in bounded raw fetches. There is no longer even a public robots exception to justify same-host retries, so the only honest next lane is browser-assisted review or an alternate official DD leaf outside the blocked hosts.';
const DD_EVIDENCE = 'Reviewed 2026-06-23 bounded live official Kansas DD probes on https://www.kdads.ks.gov/, https://www.kdads.ks.gov/services/developmental-disabilities, https://www.kdads.ks.gov/robots.txt, https://www.kancare.ks.gov/, and https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000. Every one of those exact official roots and leaves now returns HTTP 403 Forbidden / access denied under the same low-token fetch contract. Kansas therefore still lacks any raw-fetch-reviewable official DD authority leaf, and the blocker is now a uniform 403 host-stack pattern rather than a content-discovery problem.';
const DD_NEXT_ACTION = 'browser_assisted_or_alternate_official_dd_leaf_after_uniform_403_confirmation';

const EDU_FAILURE_CODE = 'live_ksde_directory_roots_preserved_but_no_county_or_district_special_education_contract_on_disk';
const EDU_STATUS = 'blocked_live_ksde_directory_roots_without_local_contract';
const EDU_REASON = 'Kansas now has a better education authoring packet but not county-grade proof. The live KSDE Special Education root links to current official School District Maps, Directories, Dispute Resolution, and Parents Rights leaves, and Data Central redirects to a live datacentral.ksde.gov root that links the public Directory Reports app. But all 105 Kansas school_district rows still point at the same statewide KSDE placeholder, and no reviewed county-to-district join or district-owned special-education contact leaf is preserved on disk.';
const EDU_EVIDENCE = 'Reviewed 2026-06-23 bounded live official Kansas education probes on https://www.ksde.gov/, https://www.ksde.gov/policy-and-funding/special-education, https://www.ksde.gov/policy-and-funding/school-transportation/school-district-maps, https://www.ksde.gov/data-and-reporting/directories, https://www.ksde.gov/data-and-reporting/data-central, https://datacentral.ksde.gov/default.aspx, https://uapps.ksde.gov/Directory_Rpts/default.aspx, https://www.ksde.gov/policy-and-funding/special-education/special-education-law/dispute-resolution, https://www.ksde.gov/policy-and-funding/special-education/special-education-law/notices-and-forms/parents-rights, and the live USD county map PDF at https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5. The current KSDE roots are live and preserve better statewide authoring surfaces than the older stale paths, including a live Data Central root and a linked public Directory Reports app. But a live DB reconciliation still shows all 105 Kansas school_district rows pointing at the same statewide placeholder website https://www.ksde.org/Default.aspx?tabid=101, and the refreshed official roots still do not preserve a county-to-district join or district-owned special-education routing leaf on disk.';
const EDU_NEXT_ACTION = 'author_reviewed_district_owned_special_education_leaves_from_uapps_directory_reports_or_keep_kansas_blocked';

const LESSON_HEADING = '### Live Section Roots Can Replace Dead Deep Links Without Clearing The Local Contract';
const LESSON_BODY = '*   **Lesson:** If a stale official deep link 404s or drifts, re-open the live section root before guessing new paths. Kansas KSDE still exposed current `School District Maps`, `Directories`, `Data Central`, and `uapps.ksde.gov/Directory_Rpts/default.aspx` roots from the live Special Education section, which made a better authoring packet even though none of those roots yet supplied county-to-district or district-owned special-education proof.';

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

function appendLessonIfMissing(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Kansas California-Grade Audit Report v2',
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
    '- Kansas remains BLOCKED and not index-safe.',
    '- The DD blocker is now stricter and simpler: KDADS root, DD leaf, and the supporting KanCare root and HCBS leaf all return HTTP 403, so no same-host low-token lane remains honest.',
    '- The KSDE statewide stack is healthier than the old packet implied: current Special Education navigation exposes live School District Maps, Directories, Data Central, and Directory Reports roots.',
    '- That still does not clear county-grade education routing because all 105 district rows remain statewide placeholders and no district-owned special-education leaves are preserved yet.',
  ].join('\n') + '\n';
}

export function generateBatch169KansasOfficialRootNavRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const ddPacket = readJson(INPUTS.ddPacket);
  const educationPacket = readJson(INPUTS.educationPacket);

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'kansas_dd_stack_is_uniformly_403_blocked_and_live_ksde_directory_roots_still_lack_local_contract',
    final_blockers: (summary.final_blockers || []).map((row) => {
      if (row.family === 'developmental_disability_idd_authority') {
        return { ...row, failure_code: DD_FAILURE_CODE, evidence: DD_EVIDENCE, next_action: DD_NEXT_ACTION };
      }
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, failure_code: EDU_FAILURE_CODE, evidence: EDU_EVIDENCE, next_action: EDU_NEXT_ACTION };
      }
      return row;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return { ...row, family_status: DD_STATUS, status_reason: DD_REASON };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: EDU_STATUS, status_reason: EDU_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return { ...row, failure_code: DD_FAILURE_CODE, evidence: DD_EVIDENCE, next_action: DD_NEXT_ACTION };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDU_FAILURE_CODE, evidence: EDU_EVIDENCE, next_action: EDU_NEXT_ACTION };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return {
        ...row,
        family_status: DD_STATUS,
        query_basis: 'Reviewed bounded live official Kansas DD roots and exact DD leaves after the older robots-based nuance went stale.',
        blocker_code: DD_FAILURE_CODE,
        blocker_evidence: DD_EVIDENCE,
        sample_count: 3,
        samples: [
          {
            sample_name: 'KDADS root',
            source_url: 'https://www.kdads.ks.gov/',
            final_url: 'https://www.kdads.ks.gov/',
            verification_status: 'blocked',
            source_type: 'official_http_403_root',
            source_table: 'bounded_live_kansas_check',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The live KDADS root now returns HTTP 403 Forbidden / access denied under the same low-token contract as the DD child leaves.',
          },
          {
            sample_name: 'KDADS developmental disabilities leaf',
            source_url: 'https://www.kdads.ks.gov/services/developmental-disabilities',
            final_url: 'https://www.kdads.ks.gov/services/developmental-disabilities',
            verification_status: 'blocked',
            source_type: 'official_http_403_leaf',
            source_table: 'bounded_live_kansas_check',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The exact KDADS developmental-disabilities leaf now returns HTTP 403 Forbidden / access denied instead of DD intake, eligibility, or services content.',
          },
          {
            sample_name: 'KanCare HCBS fact sheet leaf',
            source_url: 'https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000',
            final_url: 'https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000',
            verification_status: 'blocked',
            source_type: 'official_http_403_supporting_leaf',
            source_table: 'bounded_live_kansas_check',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The supporting KanCare HCBS fact-sheet leaf also now returns HTTP 403 Forbidden / access denied, so it cannot carry DD crossover proof for Kansas.',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDU_STATUS,
        query_basis: 'Reviewed current live KSDE Special Education navigation and refreshed the district-routing packet to current official directory roots instead of the older stale deep links.',
        blocker_code: EDU_FAILURE_CODE,
        blocker_evidence: EDU_EVIDENCE,
        sample_count: 3,
        samples: [
          {
            sample_name: 'School District Maps',
            source_url: 'https://www.ksde.gov/policy-and-funding/school-transportation/school-district-maps',
            final_url: 'https://www.ksde.gov/policy-and-funding/school-transportation/school-district-maps',
            verification_status: 'reviewed',
            source_type: 'official_statewide_authoring_root',
            source_table: 'bounded_live_kansas_check',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The current KSDE School District Maps page is live and preserves the official statewide map root, but it still does not itself preserve a county-to-district join or district-owned special-education contact leaf on disk.',
          },
          {
            sample_name: 'KSDE Directories',
            source_url: 'https://www.ksde.gov/data-and-reporting/directories',
            final_url: 'https://www.ksde.gov/data-and-reporting/directories',
            verification_status: 'reviewed',
            source_type: 'official_statewide_directory_root',
            source_table: 'bounded_live_kansas_check',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The current KSDE Directories page is live and points to refreshed statewide directory surfaces, but the DB still preserves only one statewide placeholder URL across all 105 district rows.',
          },
          {
            sample_name: 'Directory Reports app root',
            source_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
            final_url: 'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
            verification_status: 'reviewed',
            source_type: 'official_directory_app_root',
            source_table: 'bounded_live_kansas_check',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The live Data Central root links the public KSDE Directory Reports app, which is a better next authoring root than the older stale special-education leaf guesses, but it is still only a root until district-owned local leaves are reviewed.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'developmental_disability_idd_authority') {
      return { ...row, failure_code: DD_FAILURE_CODE, next_action: DD_NEXT_ACTION, evidence: DD_EVIDENCE };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDU_FAILURE_CODE, next_action: EDU_NEXT_ACTION, evidence: EDU_EVIDENCE };
    }
    return row;
  });

  const updatedDdPacket = {
    ...ddPacket,
    current_problem_metrics: {
      ...ddPacket.current_problem_metrics,
      reviewedBlockedReplacementRoots: 2,
      kdadsExactBlockedLeaves: 2,
      kdadsSitemapBlocked: null,
      kancareSupportingBlockedLeaves: 2,
      kancareSitemapBlocked: null,
      kdadsRobotsReadable: false,
      kdadsRootBlocked: true,
      kancareRootBlocked: true,
    },
    representative_sources: [
      'https://dhhs.kansas.gov/dd',
      'https://www.kdads.ks.gov/',
      'https://www.kdads.ks.gov/services/developmental-disabilities',
      'https://www.kdads.ks.gov/robots.txt',
      'https://www.kancare.ks.gov/',
      'https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000',
    ],
    root_domains_to_review: [
      'browser-assisted reviewed KDADS DD leaves if a rendered session can bypass the uniform 403 shell',
      'alternate-official Kansas DD leaves outside the blocked KDADS and KanCare hosts',
      'do not reopen same-host low-token retries while KDADS root, DD leaf, and KanCare HCBS support leaf all stay 403',
    ],
    packet_complete_when: 'Kansas has a reviewed official DD authority leaf outside the uniformly blocked KDADS and KanCare low-token stack, or a browser-assisted reviewed DD leaf that preserves intake, eligibility, or entry routing.',
  };

  const updatedEducationPacket = {
    ...educationPacket,
    current_problem_metrics: {
      ...educationPacket.current_problem_metrics,
      authoredExactLeafCount: 0,
      officialMapPdfCount: 1,
      officialStatewideAuthoringRoots: 4,
      liveDirectoryRoots: 3,
    },
    representative_sources: [
      'https://www.ksde.gov/policy-and-funding/special-education',
      'https://www.ksde.gov/policy-and-funding/school-transportation/school-district-maps',
      'https://www.ksde.gov/data-and-reporting/directories',
      'https://www.ksde.gov/data-and-reporting/data-central',
      'https://datacentral.ksde.gov/default.aspx',
      'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
      'https://www.ksde.gov/policy-and-funding/special-education/special-education-law/dispute-resolution',
      'https://www.ksde.gov/policy-and-funding/special-education/special-education-law/notices-and-forms/parents-rights',
      'https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5',
    ],
    root_domains_to_review: [
      'district-owned Kansas USD domains reached from the live KSDE School District Maps, Directories, and Directory Reports roots',
      'https://www.ksde.gov/policy-and-funding/school-transportation/school-district-maps',
      'https://www.ksde.gov/data-and-reporting/directories',
      'https://datacentral.ksde.gov/default.aspx',
      'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
    ],
    packet_complete_when: 'Every Kansas county row either points at a reviewed district-owned education-routing leaf authored from the live KSDE directory roots or remains explicitly blocked where no district-owned local contract has been preserved.',
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.ddPacket, updatedDdPacket);
  writeJson(INPUTS.educationPacket, updatedEducationPacket);

  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  const stateReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, stateReport);

  const batchSummary = {
    state: 'kansas',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    kdads_uniform_403: true,
    kancare_uniform_403: true,
    live_ksde_directory_roots: [
      'https://www.ksde.gov/policy-and-funding/school-transportation/school-district-maps',
      'https://www.ksde.gov/data-and-reporting/directories',
      'https://datacentral.ksde.gov/default.aspx',
      'https://uapps.ksde.gov/Directory_Rpts/default.aspx',
    ],
    district_placeholder_rows: updatedEducationPacket.current_problem_metrics.placeholderWebsiteRows,
    lessons_updated: lessonAdded,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Kansas Official Root Navigation Refresh Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      '- refreshed_families: developmental_disability_idd_authority, district_or_county_education_routing',
      '',
      '## DD outcome',
      '',
      `- ${DD_EVIDENCE}`,
      '',
      '## Education outcome',
      '',
      `- ${EDU_EVIDENCE}`,
      '',
      '## Result',
      '',
      '- Kansas remains BLOCKED and not index-safe.',
      '- The Kansas DD stack is now documented as a uniform 403 blocker across the exact official root and child leaves that matter.',
      '- The Kansas education packet now points at current live KSDE authoring roots instead of stale deep links, but the county-grade local contract is still missing.',
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch169KansasOfficialRootNavRefreshV1();
  console.log(JSON.stringify(result, null, 2));
}
