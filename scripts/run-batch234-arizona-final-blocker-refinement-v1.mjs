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
  educationPacket: path.join(generatedDir, 'arizona_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  countyPacket: path.join(generatedDir, 'arizona_county_local_disability_resources_leaf_authoring_packet_v1.json'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch234_arizona_final_blocker_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch234-arizona-final-blocker-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'three_public_district_domains_sitemap_exhausted_and_altcs_office_cards_still_lack_county_assignments';

const EDUCATION = {
  familyStatus: 'blocked_three_reviewed_public_domains_sitemap_exhausted_without_role_leafs',
  failureCode: 'three_reviewed_public_district_domains_exhaust_robots_and_sitemaps_without_role_leafs',
  statusReason: 'Arizona education is now blocked only on 3/15 counties whose public district domains are live but role-exhausted. Bounded 2026-06-23 root, robots.txt, sitemap, and one-hop sitemap checks on ccasdaz.org, mohavelearning.org, and yavapaicountyhighschool.com found no special-education, exceptional-student-services, student-services, or 504/IEP leaf URLs. The only sitemap hits were generic student handbook, outing, or student-portal pages on Mohave and Yavapai, while Coconino\'s root, robots, sitemap index, page sitemap, and post sitemap exposed zero role-bearing paths.',
  evidence: 'Reviewed 2026-06-23 bounded Arizona district-owned public domains for the final three unresolved education counties. https://www.ccasdaz.org/ returned HTTP 200 and its robots.txt pointed to sitemap_index.xml, but the official sitemap index plus page-sitemap.xml and post-sitemap.xml exposed zero URLs containing special-education, student-services, exceptional-student-services, 504, or IEP role terms. https://www.mohavelearning.org/ returned HTTP 200 and robots.txt exposed the official /fs/pages/sitemap inventory, but that inventory only yielded generic student-facing pages such as student council, StudentVUE, student handbooks, and portal links, with no role-verifiable special-education or student-services leaf. https://www.yavapaicountyhighschool.com/ returned HTTP 200 and its sitemap.xml only exposed student-handbook and outing-form documents, not a special-education or student-services leaf. So the remaining Arizona education blocker is now source-final on three reviewed public domains that still lack role-bearing local leaves.',
  nextAction: 'hold_three_reviewed_public_domains_until_role_bearing_special_education_or_student_services_leaves_exist',
  sampleCount: 5,
  samples: [
    {
      sample_name: 'Coconino County Accommodation School District root',
      source_url: 'https://www.ccasdaz.org/',
      final_url: 'https://www.ccasdaz.org/',
      verification_status: 'blocked',
      source_type: 'reviewed_public_district_root_without_role_leaf',
      source_table: 'batch234_arizona_final_blocker_refinement',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The live district root is public and role-relevant, but it exposes no special-education, student-services, exceptional-student-services, 504, or IEP leaf in the rendered homepage HTML.',
    },
    {
      sample_name: 'Coconino County Accommodation School District sitemap inventory',
      source_url: 'https://www.ccasdaz.org/sitemap_index.xml',
      final_url: 'https://www.ccasdaz.org/sitemap_index.xml',
      verification_status: 'blocked',
      source_type: 'reviewed_public_district_sitemap_without_role_leaf',
      source_table: 'batch234_arizona_final_blocker_refinement',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The official sitemap index, page sitemap, and post sitemap exposed zero URLs with role-bearing special-education or student-services terms.',
    },
    {
      sample_name: 'Mohave Accelerated Learning Center sitemap page',
      source_url: 'https://www.mohavelearning.org/fs/pages/sitemap',
      final_url: 'https://www.mohavelearning.org/fs/pages/sitemap',
      verification_status: 'blocked',
      source_type: 'reviewed_public_district_sitemap_without_role_leaf',
      source_table: 'batch234_arizona_final_blocker_refinement',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The official site-map inventory exposed student council, StudentVUE, student handbook, and portal URLs, but no special-education, exceptional-student-services, or student-services leaf.',
    },
    {
      sample_name: 'Yavapai County High School sitemap',
      source_url: 'https://www.yavapaicountyhighschool.com/sitemap.xml',
      final_url: 'https://www.yavapaicountyhighschool.com/sitemap.xml',
      verification_status: 'blocked',
      source_type: 'reviewed_public_district_sitemap_without_role_leaf',
      source_table: 'batch234_arizona_final_blocker_refinement',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The official sitemap only exposed student-handbook and student-outing-form documents, not a special-education or student-services routing page.',
    },
    {
      sample_name: 'Resolved no-website counties remain closed',
      source_url: 'https://azreportcards.azed.gov/districts/Detail/4177',
      final_url: 'https://azreportcards.azed.gov/districts/Detail/4177',
      verification_status: 'verified',
      source_type: 'official_state_district_detail_root',
      source_table: 'reviewed_first_party_artifact',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The four counties that previously lacked public district websites remain covered by reviewed county-owned leaves, so the remaining blocker is limited to the three public domains above.',
    },
  ],
};

const COUNTY = {
  familyStatus: 'blocked_des_challenge_plus_altcs_html_and_county_map_without_county_contract',
  failureCode: 'des_roots_still_challenged_and_ahcccs_altcs_html_plus_county_map_still_lack_county_to_office_contract',
  statusReason: 'Reviewed 2026-06-23 the live Arizona county-local fallback pages more tightly. The DES root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap lanes are still Cloudflare 403 shells. The accessible AHCCCS fallback lane is public and preserves seven named ALTCS office cards in raw HTML for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma, and the official ALTCS county map PDF is partly parseable for county names, but neither artifact provides a county-to-office table or county assignment contract. Arizona therefore still lacks county-grade official office routing.',
  evidence: 'Reviewed 2026-06-23 bounded Arizona county-local fallback pages after the earlier DES challenge findings and the official AHCCCS PDF lane. The DES host family remains challenge-blocked on the known office-locator and benefits roots. The accessible AHCCCS fallback lane is live and stronger than previously recorded: https://www.azahcccs.gov/members/ALTCSlocations.html returned HTTP 200 and its raw HTML preserved seven named ALTCS office cards for Chinle, Flagstaff, Kingman, Phoenix, Prescott Valley, Tucson, and Yuma. The official ALTCS County Map PDF is also partially parseable and preserves Arizona county names, but it still does not attach those counties to office addresses, phones, or a repeatable county-to-office assignment contract. https://www.azahcccs.gov/shared/AHCCCScontacts.html and https://www.azahcccs.gov/Members/AlreadyCovered/MemberResources/ALTCS.html remain statewide contact and program-guidance leaves rather than county-specific office assignments. Arizona therefore still lacks a reviewable official county-to-office routing contract.',
  nextAction: 'hold_blocked_until_des_clears_or_ahcccs_publishes_county_to_office_assignments_in_reviewable_html_or_parseable_admin_artifacts',
  sampleCount: 3,
  samples: [
    {
      sample_name: 'Arizona DES root family',
      source_url: 'https://des.az.gov/',
      final_url: 'https://des.az.gov/',
      verification_status: 'blocked',
      source_type: 'official_des_root_challenge_shell',
      source_table: 'reviewed_live_probe',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The DES office-routing host family remains Cloudflare-challenged on the root and the known office-locator/FAA discovery lanes, so the public DES lane still cannot seed county-office leaves in the low-token path.',
    },
    {
      sample_name: 'AHCCCS ALTCS Offices page',
      source_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
      final_url: 'https://www.azahcccs.gov/members/ALTCSlocations.html',
      verification_status: 'blocked',
      source_type: 'official_statewide_altcs_page_without_county_contract',
      source_table: 'batch234_arizona_final_blocker_refinement',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The raw HTML preserves seven named ALTCS office cards, but no statewide county-to-office table or repeatable county listing appears in the public HTML.',
    },
    {
      sample_name: 'AHCCCS Contacts page',
      source_url: 'https://www.azahcccs.gov/shared/AHCCCScontacts.html',
      final_url: 'https://www.azahcccs.gov/shared/AHCCCScontacts.html',
      verification_status: 'blocked',
      source_type: 'official_statewide_contacts_without_county_assignment',
      source_table: 'batch234_arizona_final_blocker_refinement',
      fetched_at: '2026-06-23T00:00:00.000Z',
      evidence_snippet: 'The contacts page preserves statewide phone, HEAplus, and issue-reporting routes, but no county office list, county table, or county-specific assignment fields.',
    },
  ],
};

const LESSON = '*   **Lesson:** If a public district or office host is live, spend one bounded robots/sitemap or raw-HTML pass before guessing more leaves. Arizona\'s last three district domains exhausted into generic student pages and handbooks, and AHCCCS\'s public ALTCS lane proved seven office cards plus a partial county map but still no county-to-office contract, so neither family could be upgraded without a real local assignment surface.';

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

function updateLessonFile(filePath) {
  const current = fs.readFileSync(filePath, 'utf8');
  if (current.includes(LESSON)) {
    return;
  }
  const lines = current.split('\n');
  lines.splice(16, 0, LESSON);
  fs.writeFileSync(filePath, `${lines.join('\n').replace(/\n*$/, '\n')}`);
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Arizona California-Grade Audit Report v2',
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
    '- Arizona remains BLOCKED and not index-safe.',
    '- Education is now source-final for low-token work on exactly three live public district domains: their homepages plus robots/sitemap inventories expose no role-bearing special-education or student-services leafs.',
    '- County/local disability resources remain blocked separately because the DES host family is still challenge-blocked and the accessible AHCCCS fallback only exposes a single visible Yuma ALTCS office in raw HTML rather than a statewide county-to-office contract.',
  ].join('\n') + '\n';
}

function updateFamilyRows(rows, family, updates) {
  return rows.map((row) => (
    row.family === family
      ? { ...row, ...updates }
      : row
  ));
}

export function generateBatch234ArizonaFinalBlockerRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const educationPacket = readJson(INPUTS.educationPacket);
  const countyPacket = readJson(INPUTS.countyPacket);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: EDUCATION.familyStatus, status_reason: EDUCATION.statusReason };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: COUNTY.familyStatus, status_reason: COUNTY.statusReason };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION.failureCode, evidence: EDUCATION.evidence, next_action: EDUCATION.nextAction };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY.failureCode, evidence: COUNTY.evidence, next_action: COUNTY.nextAction };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: EDUCATION.familyStatus,
        sample_count: EDUCATION.sampleCount,
        blocker_code: EDUCATION.failureCode,
        blocker_evidence: EDUCATION.evidence,
        query_basis: 'Reviewed 2026-06-23 the final three Arizona district-owned public domains plus their robots and sitemap discovery surfaces.',
        samples: EDUCATION.samples,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: COUNTY.familyStatus,
        sample_count: COUNTY.sampleCount,
        blocker_code: COUNTY.failureCode,
        blocker_evidence: COUNTY.evidence,
        query_basis: 'Reviewed 2026-06-23 the live DES challenge lane plus the public AHCCCS ALTCS offices, contacts, and ALTCS member-guidance fallback pages.',
        samples: COUNTY.samples,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION.failureCode, next_action: EDUCATION.nextAction, evidence: EDUCATION.evidence };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY.failureCode, next_action: COUNTY.nextAction, evidence: COUNTY.evidence };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return { ...row, failure_code: EDUCATION.failureCode, evidence: EDUCATION.evidence };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, failure_code: COUNTY.failureCode, evidence: COUNTY.evidence };
      }
      return row;
    }),
  };

  const updatedEducationPacket = {
    ...educationPacket,
    current_problem_metrics: {
      ...(educationPacket.current_problem_metrics || {}),
      unresolvedDistrictOwnedLeafCount: 3,
      unresolvedReviewedPublicDomainWithoutLeafCount: 3,
      reviewedPublicDomainSitemapExhaustedCount: 3,
    },
  };

  const updatedCountyPacket = {
    ...countyPacket,
    current_problem_metrics: {
      ...(countyPacket.current_problem_metrics || {}),
      ahcccsAccessibleFallbackPages: 4,
      altcsRawHtmlVisibleOfficeCount: 7,
      partialCountyMapArtifacts: 1,
    },
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'arizona'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.educationPacket, updatedEducationPacket);
  writeJson(INPUTS.countyPacket, updatedCountyPacket);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  updateLessonFile(INPUTS.lessons);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    batch: 'batch234_arizona_final_blocker_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'arizona',
    classification: 'BLOCKED',
    index_safe: false,
    refined_families: ['district_or_county_education_routing', 'county_local_disability_resources'],
    unresolved_public_district_domains: 3,
    ahcccs_visible_local_offices_in_raw_html: 7,
    lesson_added: true,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 234 Arizona Final Blocker Refinement Report v1',
    '',
    '- state: arizona',
    '- classification: BLOCKED',
    '- index_safe: false',
    '',
    '## What changed',
    '',
    '- Tightened the education blocker from a generic public-domain claim to an exact robots/sitemap exhaustion result on three remaining district-owned public domains.',
    '- Tightened the county-local blocker from a generic AHCCCS fallback claim to the exact live result: DES still challenge-blocked, while public AHCCCS evidence now proves seven named ALTCS office cards plus a partially parseable county map but still no statewide county-to-office contract.',
  ].join('\n') + '\n';

  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch234ArizonaFinalBlockerRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
