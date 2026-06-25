import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'idaho_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'idaho_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'idaho_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'idaho_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'idaho_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'idaho_district_or_county_education_routing_leaf_authoring_packet_v1.json'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  allStateAudit: path.join(generatedDir, 'all_state_california_grade_audit_v3.json'),
  allStateReport: path.join(docsGeneratedDir, 'all-state-california-grade-audit-report-v3.md'),
  handoff: path.join(docsGeneratedDir, 'gemini-source-scout-handoff.md'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch335_idaho_bear_lake_reviewed_district_leaf_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch335-idaho-bear-lake-reviewed-district-leaf-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'idaho-california-grade-audit-report-v2.md'),
};

const PRIMARY_GAP_REASON = 'reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_still_lack_role_evidence';

const EDUCATION_STATUS = 'blocked_reviewed_local_district_leaves_exist_but_not_statewide_county_grade';
const EDUCATION_FAILURE_CODE = 'reviewed_district_special_services_leaves_hold_at_13_counties_after_live_bear_lake_leaf_and_remaining_county_bearing_roots_still_lack_role_leaf';
const EDUCATION_REASON = 'Idaho education is still blocked, but the reviewed district-owned leaf set is stronger than the last packet claimed. On 2026-06-24 the live Bear Lake School District root exposed an embedded district-owned `Special Education` page object, and the exact district leaf resolved publicly at `https://www.blsd.net/en-US/special-education-e92c299d` with district-specific special-education text, director contact, and IDEA/FAPE/LRE language. That raises Idaho to thirteen reviewed county-grade district-owned education leaves. But the remaining county-bearing district roots still do not expose a reusable role-bearing special-education or special-services leaf in bounded public root/sitemap HTML, so statewide county-grade education routing is still incomplete.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-24 the live official Idaho district root https://www.blsd.net/ and the exact district-owned leaf https://www.blsd.net/en-US/special-education-e92c299d. The Bear Lake root publicly exposes an embedded `Special Education` page object with relative route `/pages/e92c299d-8559-433e-b16e-b40882764e60`, and that route resolves to the public final URL `https://www.blsd.net/en-US/special-education-e92c299d`. The exact leaf returned HTTP 200 with title `Special Education - Bear Lake School District` and visible district-owned text including `Special Education Director Holly Tanner`, `Welcome to Special Education`, and IDEA/FAPE/LRE language about students who meet eligibility requirements. Idaho therefore now holds at thirteen reviewed county-grade district-owned education leaves, not twelve. But the remaining county-bearing district roots in Camas, Clark, Fremont, Jefferson, Oneida, and Shoshone still expose no exact reusable role-bearing leaf in bounded public HTML or sitemap review, so the family remains blocked.';
const EDUCATION_NEXT_ACTION = 'continue_exact_district_leaf_expansion_only_when_uncovered_idaho_district_hosts_expose_role_bearing_special_education_or_special_services_leaves';

const COUNTY_STATUS = 'blocked_split_between_clean_exact_office_leaves_and_legacy_counties_without_public_contract';
const COUNTY_REASON = 'The Idaho DHW office lane remains an explicit split, not a generic local-office blocker. The live official office root and sitemap still expose no county terms or county-served fields, so they do not prove county-grade routing by themselves. But the existing deterministic office packet safely materializes 17 clean county-to-exact-office leaf matches plus one Canyon split, while 27 counties remain blocked on the dead legacy locator because no public county-to-office contract exists for them.';
const COUNTY_FAILURE_CODE = 'official_dhw_office_stack_supports_17_clean_leaf_matches_but_27_legacy_counties_still_lack_public_contract';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded live Idaho DHW confirmation on the official root plus the existing office-leaf packet. The public root at https://healthandwelfare.idaho.gov/offices is live with title `Find a Service Location` and still preserves exact city office cards like Caldwell Office in HTML, but it exposes zero county terms or county-served fields. The exact office leaf https://healthandwelfare.idaho.gov/dhw/caldwell-office is live with title `Caldwell Office`, confirming that the packet is grounded in real reviewable DHW office leaves. Idaho county-local routing therefore splits cleanly into 17 safe county-to-exact-office replacements plus one Canyon split that still rejects Nampa as SWITC-only, while 27 counties remain blocked because the public DHW stack still exposes no truthful county-to-office contract for them.';
const COUNTY_NEXT_ACTION = 'retain_17_clean_exact_office_replacements_keep_canyon_split_explicit_and_leave_27_legacy_counties_blocked_until_idaho_publishes_county_contract';

const LESSON_HEADING = '### Embedded District Menu Data Can Expose A Safe Exact Leaf';
const LESSON_BODY = '*   **Lesson:** If a district-owned root exposes a structured menu object for `Special Education`, follow that exact district route even when sitemap review was previously empty. Idaho Bear Lake School District kept its special-education page only in embedded menu data, but the exact route still resolved cleanly to a public district-owned leaf with director contact and IDEA/FAPE/LRE text.';

const REVIEWED_LEAVES = [
  {
    county_id: 'cassia-id',
    district_name: 'Cassia County School District',
    exact_leaf_url: 'https://www.cassiaschools.org/page/special-services/',
    evidence_terms: ['special education', 'special services', '504', 'procedural safeguards'],
    title: 'Special Services | Cassia County School District',
  },
  {
    county_id: 'payette-id',
    district_name: 'Payette Joint District',
    exact_leaf_url: 'https://www.payetteschools.org/our-district/departments/special-education',
    evidence_terms: ['special education', 'special services'],
    title: 'Special Services - Payette Joint District',
  },
  {
    county_id: 'bannock-id',
    district_name: 'Pocatello-Chubbuck School District 25',
    exact_leaf_url: 'https://www.sd25.us/departments/special-services',
    evidence_terms: ['special education', 'special services', '504', 'procedural safeguards'],
    title: 'Special Services - Pocatello-Chubbuck School District 25',
  },
  {
    county_id: 'boundary-id',
    district_name: 'Boundary County School District 101',
    exact_leaf_url: 'https://www.bcsd101.com/page/special-services/',
    evidence_terms: ['special services'],
    title: 'Special Services | Boundary County School District 101',
  },
  {
    county_id: 'butte-id',
    district_name: 'Butte County Joint District',
    exact_leaf_url: 'https://www.butteschooldistrict.org/departments/special_education',
    evidence_terms: ['special education'],
    title: 'Special Education - buttecountyschools',
  },
  {
    county_id: 'bonneville-id',
    district_name: 'Bonneville Joint District #93',
    exact_leaf_url: 'https://www.d93schools.org/special-education-programs-home',
    evidence_terms: ['special education', 'exceptional'],
    title: 'Special Education Programs',
  },
  {
    county_id: 'jerome-id',
    district_name: 'Jerome SD #261',
    exact_leaf_url: 'https://www.jeromeschools.org/specialserviceshome',
    evidence_terms: ['special education', 'special services'],
    title: 'Special Services | Jerome SD #261',
  },
  {
    county_id: 'minidoka-id',
    district_name: 'Minidoka School District',
    exact_leaf_url: 'https://www.minidokaschools.org/page/special-services/',
    evidence_terms: ['special services', '504'],
    title: 'Special Services | We are Minidoka',
  },
  {
    county_id: 'blaine-id',
    district_name: 'Blaine County District #61',
    exact_leaf_url: 'https://www.blaineschools.org/teaching-and-learning/teaching-learning/educational-programs/special-education',
    evidence_terms: ['special education', 'procedural safeguards'],
    title: 'Special Education',
  },
  {
    county_id: 'teton-id',
    district_name: 'Teton County District #401',
    exact_leaf_url: 'https://www.tsd401.org/apps/pages/?type=d&uREC_ID=595525&pREC_ID=1147857',
    evidence_terms: ['special education'],
    title: 'Staff Links - Special Education - Teton School District 401',
  },
  {
    county_id: 'gooding-id',
    district_name: 'Gooding Joint District #231',
    exact_leaf_url: 'https://gsd231.org/special-education/',
    evidence_terms: ['special education', 'special services'],
    title: 'Special Education — Gooding School District',
  },
  {
    county_id: 'gem-id',
    district_name: 'Emmett Independent School District',
    exact_leaf_url: 'https://www.emmettschools.org/departments/special-education',
    evidence_terms: ['special education', 'procedural safeguards'],
    title: 'Special Education - Emmett Independent School District',
  },
  {
    county_id: 'bear-lake-id',
    district_name: 'Bear Lake School District',
    exact_leaf_url: 'https://www.blsd.net/en-US/special-education-e92c299d',
    evidence_terms: ['special education director', 'IDEA', 'FAPE', 'LRE'],
    title: 'Special Education - Bear Lake School District',
  },
];

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
  if (current.includes(LESSON_HEADING)) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Idaho California-Grade Audit Report v2',
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
    '- Idaho remains BLOCKED and not index-safe.',
    '- Education is stronger than the prior packet claimed because Bear Lake now has a reviewed district-owned Special Education leaf, raising Idaho to thirteen reviewed county-grade district-owned education leaves.',
    '- Idaho still does not clear because the remaining county-bearing district roots still lack exact reusable role-bearing leaves in bounded public review, and county-local remains separately blocked on missing public county-to-office contract evidence.',
    '- County-local remains the same explicit split: 17 clean office replacements plus the Canyon split are preserved, and 27 counties stay blocked until Idaho publishes a public county-to-office contract.',
  ].join('\n') + '\n';
}

function updateAllStateReport() {
  let text = fs.readFileSync(INPUTS.allStateReport, 'utf8');
  const bullet = '- Idaho remains blocked, but the education lane improved: the live Bear Lake School District root exposed an embedded district-owned `Special Education` route that resolves to a public exact leaf, raising Idaho to thirteen reviewed county-grade district-owned education leaves; the state still remains not index-safe because the remaining county-bearing district roots lack exact role-bearing leaves and DHW still exposes no public county-to-office contract.';
  if (!text.includes(bullet)) {
    text = `${text.trimEnd()}\n${bullet}\n`;
  }
  fs.writeFileSync(INPUTS.allStateReport, text);
}

function updateHandoff() {
  let text = fs.readFileSync(INPUTS.handoff, 'utf8');
  text = text.replace(
    '- Idaho: `reviewed_idaho_district_leaves_hold_at_12_counties_and_remaining_county_bearing_district_roots_now_have_public_sitemap_exhaustion_evidence`',
    '- Idaho: `reviewed_idaho_district_leaves_hold_at_13_counties_after_live_bear_lake_special_education_leaf_and_remaining_county_bearing_district_roots_still_lack_role_evidence`',
  );

  const focusSection = `## Current Focus State: Idaho

### Blocker Reason

Idaho still has two critical blockers, and the highest-priority one remains \`district_or_county_education_routing\`. The live Bear Lake School District root now exposes an embedded district-owned \`Special Education\` route, and the exact public leaf at \`https://www.blsd.net/en-US/special-education-e92c299d\` carries district-specific special-education text, director contact, and IDEA/FAPE/LRE language. That raises Idaho to thirteen reviewed county-grade district-owned education leaves. But the remaining county-bearing district roots in Camas, Clark, Fremont, Jefferson, Oneida, and Shoshone still do not expose a reusable exact special-education or special-services leaf in bounded public root or sitemap review. The county-local blocker remains separate: Idaho DHW still exposes exact office leaves for 17 clean county replacements plus one Canyon split, but still no public county-to-office contract for the remaining 27 counties.

### Exact Evidence Needed

- Any current official district-owned special-education, special-services, student-services, or procedural-safeguards leaf on the remaining Idaho county-bearing district hosts for Camas, Clark, Fremont, Jefferson, Oneida, or Shoshone.
- Or, any official county-grade Idaho SDE district/export contract that truthfully maps those counties to district-owned education-routing leaves.
- Separately, any official Idaho DHW county-to-office or county-served contract for the 27 counties still blocked on legacy county-local routing.

### Useful Official URLs Already Tried

- [Idaho School Districts directory](https://www.sde.idaho.gov/school-districts/)
- [Bear Lake School District root](https://www.blsd.net/)
- [Bear Lake Special Education leaf](https://www.blsd.net/en-US/special-education-e92c299d)
- [Camas County School District root](https://www.camascountyschools.org)
- [Clark County School District 161 root](http://www.clarkcountyschools161.org/)
- [Fremont County Joint School District #215 root](http://www.sd215.net/)
- [Jefferson School District 251 root](https://www.jeffersonsd251.org/)
- [Oneida School District root](https://oneidaschooldistrict.com/)
- [Shoshone School District root](https://shoshonesd.org/)
- [Idaho DHW office root](https://healthandwelfare.idaho.gov/offices)
- [Idaho DHW sitemap](https://healthandwelfare.idaho.gov/sitemap.xml)

### Top Remaining Source-Scouting Targets

- Any exact district-owned local leaf on the remaining uncovered Idaho district hosts that explicitly carries \`Special Education\`, \`Special Services\`, \`Student Services\`, \`504\`, or procedural-safeguards role text.
- Any official Idaho SDE or district export that yields county-grade education routing without relying on generic statewide fallback.
- Any official Idaho DHW county-to-office contract or county-served metadata on the public office stack.

## Next State Order After Idaho

1. Arizona
2. Massachusetts
3. New Mexico
4. South Dakota
5. Rhode Island
6. Virginia
7. West Virginia
8. North Dakota
9. Wisconsin
10. Washington`;

  text = text.replace(/## Current Focus State:[\s\S]*$/m, focusSection);
  fs.writeFileSync(INPUTS.handoff, `${text.trimEnd()}\n`);
}

function buildBatchReport() {
  return [
    '# Batch 335 Idaho Bear Lake Reviewed District Leaf Report v1',
    '',
    '- state: idaho',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: district_or_county_education_routing',
    '',
    '## What changed',
    '',
    '- Rechecked the live Bear Lake School District root on 2026-06-24.',
    '- Confirmed the district-owned root publicly exposes an embedded `Special Education` route.',
    '- Confirmed the exact public Bear Lake Special Education leaf resolves cleanly and carries district-specific special-education text, director contact, and IDEA/FAPE/LRE language.',
    '- Idaho remains blocked because the remaining county-bearing district roots still lack reusable role-bearing leaves and county-local remains blocked separately.',
  ].join('\n') + '\n';
}

export function generateBatch335IdahoBearLakeReviewedDistrictLeafV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const packet = readJson(INPUTS.packet);
  const queueRows = readJsonl(INPUTS.queue);
  const allStateAudit = readJson(INPUTS.allStateAudit);

  const updatedSummary = {
    ...summary,
    batch: 'batch335_idaho_bear_lake_reviewed_district_leaf_v1',
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    final_blockers: (summary.final_blockers || []).map((blocker) => {
      if (blocker.family === 'district_or_county_education_routing') {
        return {
          ...blocker,
          failure_code: EDUCATION_FAILURE_CODE,
          evidence: EDUCATION_EVIDENCE,
          next_action: EDUCATION_NEXT_ACTION,
        };
      }
      if (blocker.family === 'county_local_disability_resources') {
        return {
          ...blocker,
          failure_code: COUNTY_FAILURE_CODE,
          evidence: COUNTY_EVIDENCE,
          next_action: COUNTY_NEXT_ACTION,
        };
      }
      return blocker;
    }),
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: EDUCATION_STATUS, status_reason: EDUCATION_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: COUNTY_STATUS, status_reason: COUNTY_REASON };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family !== 'district_or_county_education_routing') return row;

    const retainedSamples = (row.samples || []).filter((sample) => !/Bear Lake/i.test(sample.sample_name));
    const bearLakeSample = {
      sample_name: 'Bear Lake School District reviewed district leaf',
      source_url: 'https://www.blsd.net/en-US/special-education-e92c299d',
      final_url: 'https://www.blsd.net/en-US/special-education-e92c299d',
      verification_status: 'verified',
      source_type: 'district_owned_exact_education_leaf',
      source_table: 'batch335_idaho_bear_lake_reviewed_district_leaf',
      fetched_at: '2026-06-24T00:00:00.000Z',
      evidence_snippet: 'Special Education - Bear Lake School District preserves district-owned special-education text, Special Education Director Holly Tanner contact, and IDEA/FAPE/LRE language on the exact public leaf.',
    };

    const samples = [...retainedSamples, bearLakeSample];

    return {
      ...row,
      family_status: EDUCATION_STATUS,
      query_basis: 'Reviewed live official Idaho district-owned special-education leaves already on disk, plus a new Bear Lake district-owned Special Education leaf recovered from embedded menu data on the official district root.',
      blocker_code: EDUCATION_FAILURE_CODE,
      blocker_evidence: EDUCATION_EVIDENCE,
      sample_count: samples.length,
      samples,
    };
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, failure_code: EDUCATION_FAILURE_CODE, evidence: EDUCATION_EVIDENCE, next_action: EDUCATION_NEXT_ACTION };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, failure_code: COUNTY_FAILURE_CODE, evidence: COUNTY_EVIDENCE, next_action: COUNTY_NEXT_ACTION };
    }
    return row;
  });

  const hasEmmett = packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'gem-id');
  const hasBearLake = packet.reviewed_exact_leaves.some((leaf) => leaf.county_id === 'bear-lake-id');
  const updatedPacket = {
    ...packet,
    current_problem_metrics: {
      ...packet.current_problem_metrics,
      authoredExactLeafCount: hasEmmett && hasBearLake ? 13 : 13,
      reviewedExactLeafCount: 13,
    },
    packet_complete_when: 'At least one reviewed district-owned education-routing leaf is attached for every Idaho county without relying on statewide SDE fallbacks or county-name inference alone. The current packet now has reviewed exact leaves for thirteen counties, including Emmett and Bear Lake as newly verified additions to the earlier seed set.',
    reviewed_exact_leaves: REVIEWED_LEAVES,
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'idaho'
      ? { ...row, primary_gap_reason: PRIMARY_GAP_REASON }
      : row
  ));

  const updatedAllStateAudit = {
    ...allStateAudit,
    states: allStateAudit.states.map((row) => (
      row.stateId === 'idaho'
        ? {
            ...row,
            classification: 'BLOCKED',
            indexSafe: false,
            packetBatch: 'batch335_idaho_bear_lake_reviewed_district_leaf_v1',
            packetPrimaryGapReason: PRIMARY_GAP_REASON,
            familyStatuses: {
              ...row.familyStatuses,
              district_or_county_education_routing: EDUCATION_STATUS,
              county_local_disability_resources: COUNTY_STATUS,
            },
          }
        : row
    )),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.allStateAudit, updatedAllStateAudit);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  updateAllStateReport();
  updateHandoff();
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);

  writeJson(OUTPUTS.summary, {
    batch: 'batch335_idaho_bear_lake_reviewed_district_leaf_v1',
    generated_at: '2026-06-24T00:00:00.000Z',
    state: 'idaho',
    classification: 'BLOCKED',
    index_safe: false,
    reviewed_exact_leaf_count: 13,
    new_reviewed_county: 'bear-lake-id',
    exhausted_county_bearing_roots: [
      'camas-id',
      'clark-id',
      'fremont-id',
      'jefferson-id',
      'oneida-id',
      'shoshone-id',
    ],
    lesson_added: lessonAdded,
  });
  fs.writeFileSync(OUTPUTS.report, buildBatchReport());

  return {
    classification: 'BLOCKED',
    index_safe: false,
    primary_gap_reason: PRIMARY_GAP_REASON,
    reviewed_exact_leaf_count: 13,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch335IdahoBearLakeReviewedDistrictLeafV1();
}
