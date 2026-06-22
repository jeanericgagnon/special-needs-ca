import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'indiana_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'indiana_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'indiana_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'indiana_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'indiana_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch126_indiana_county_map_and_pti_repair_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch126-indiana-county-map-and-pti-repair-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'indiana-california-grade-audit-report-v2.md'),
};

const INSOURCE_HOME = 'https://insource.org/';
const INSOURCE_CONTACT = 'https://insource.org/contact-us/';
const PCH_INDIANA = 'https://www.parentcenterhub.org/findurcenter/indiana/';
const DFR_HOME = 'https://www.in.gov/fssa/dfr/';
const DFR_COUNTY_MAP = 'https://www.in.gov/fssa/dfr/ebt-hoosier-works-card/find-my-local-dfr-office/';
const DOE_SPECIAL_ED = 'https://www.in.gov/doe/students/special-education/';
const DOE_DATA = 'https://www.in.gov/doe/it/data-center-and-reports/';

const EDUCATION_BLOCKER = 'official_special_education_contact_list_link_410_and_school_directory_not_role_specific';
const EDUCATION_REASON = 'Reviewed current official Indiana DOE special-education and data-center pages. The special-education page still advertises a Special Education Director and Local Administrator Contact List that now resolves to a dead Google Sheets target, while the live 2025-2026 Indiana School Directory artifact on the data-center page is a generic school/corporation directory rather than a special-education routing source.';
const COUNTY_REASON = 'Reviewed current official Indiana DFR county-map page now preserves county-by-county office details directly in the fetched HTML for all 92 counties. Although the embedded county href paths currently 404, the live official county-map surface itself contains the address, phone, office hours, and zip-routing details needed for county-grade local-office proof.';
const PTI_REASON = 'Reviewed authoritative Parent Center Hub Indiana state leaf plus current INSOURCE first-party pages now preserve both the PTI designation and statewide Indiana family-support routing.';
const LESSON_HEADING = '### Embedded County-Map Content Can Still Count Even When The Child County Hrefs 404';
const LESSON_BODY = '*   **Lesson:** If an official county-office map page renders one fetched HTML document that already embeds county-by-county office details, do not fail it just because the decorative county hrefs 404. Indiana’s DFR county map preserved addresses, hours, phone, and ZIP routing for all 92 counties directly in the source HTML, so the family could be upgraded without re-fetching every broken child link.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Indiana California-Grade Audit Report v2',
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
    '- Parent training information center is now repaired: Parent Center Hub’s Indiana state leaf explicitly identifies IN*SOURCE as the Indiana PTI, and current INSOURCE first-party pages still preserve statewide Indiana special-education training and contact routing.',
    '- County/local disability resources are now repaired from the live official Indiana DFR county-map surface because the fetched HTML itself embeds county-by-county office details, office hours, phone, and ZIP routing for all 92 counties.',
    '- Indiana still cannot reach California-grade or become index-safe because district-or-county education routing remains unresolved: the advertised Special Education Director and Local Administrator Contact List now resolves to a dead Google Sheets target, and the live Indiana School Directory artifact is generic school/corporation metadata rather than special-education routing proof.',
    '- Indiana therefore remains BLOCKED and not index-safe until a reviewed district-grade education routing source replaces the dead contact-list lane.',
  ].join('\n') + '\n';
}

export function generateBatch126IndianaCountyMapAndPtiRepairV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return { ...row, family_status: 'verified_state_grade', status_reason: PTI_REASON };
    }
    if (row.family === 'county_local_disability_resources') {
      return { ...row, family_status: 'verified_county_grade', status_reason: COUNTY_REASON };
    }
    if (row.family === 'district_or_county_education_routing') {
      return { ...row, family_status: 'blocked_official_contact_list_gone_generic_directory_insufficient', status_reason: EDUCATION_REASON };
    }
    return row;
  });

  const updatedFailureRows = [
    {
      state: 'indiana',
      state_code: 'IN',
      family: 'district_or_county_education_routing',
      severity: 'critical',
      failure_code: EDUCATION_BLOCKER,
      evidence: 'Reviewed 2026-06-22 official Indiana DOE Special Education and Data Center pages. The page still links a Special Education Director and Local Administrator Contact List at https://docs.google.com/spreadsheets/d/1hRtp2zsG3WtdCf2ma69awNDkxTc65jLn/edit#gid=1314039117, but that target now returns HTTP 410 Gone. The live 2025-2026 Indiana School Directory XLSX linked from the data-center page is a generic school/corporation directory and does not itself preserve special-education routing or local special-education contacts.',
      next_action: 'hold_blocked_until_reviewed_district_grade_special_education_contact_source_replaces_dead_google_sheet',
    },
  ];

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        query_basis: 'Reviewed authoritative Parent Center Hub Indiana leaf plus current INSOURCE first-party pages now preserve PTI designation and statewide support routing.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 3,
        samples: [
          {
            sample_name: 'Parent Center Hub Indiana',
            source_url: PCH_INDIANA,
            final_url: PCH_INDIANA,
            verification_status: 'official_verified',
            source_type: 'authoritative_state_leaf',
            source_table: 'batch126_indiana_county_map_and_pti_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Indiana PTI IN*SOURCE 1703 S. Ironwood Drive South Bend, IN 46613 (574) 234-7101 (V/TTY) insource@insource.org http://www.insource.org',
          },
          {
            sample_name: 'INSOURCE home',
            source_url: INSOURCE_HOME,
            final_url: INSOURCE_HOME,
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_artifact',
            source_table: 'batch126_indiana_county_map_and_pti_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'IN*SOURCE exists to help parents of children with disabilities navigate the special education process in the state of Indiana.',
          },
          {
            sample_name: 'INSOURCE contact',
            source_url: INSOURCE_CONTACT,
            final_url: INSOURCE_CONTACT,
            verification_status: 'official_verified',
            source_type: 'reviewed_first_party_artifact',
            source_table: 'batch126_indiana_county_map_and_pti_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Indiana Resource Center for Families with Special Needs. 310 West McKinley Suite 300 Mishawaka, IN 46545. Child School District and County of School contact routing fields are preserved on the live form.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        evidence_strength: 'strong',
        query_basis: 'Reviewed official Indiana DFR county-map page now preserves county-by-county office details directly in the fetched HTML.',
        blocker_code: null,
        blocker_evidence: null,
        sample_count: 3,
        samples: [
          {
            sample_name: 'DFR county map root',
            source_url: DFR_COUNTY_MAP,
            final_url: DFR_COUNTY_MAP,
            verification_status: 'verified',
            source_type: 'official_county_map',
            source_table: 'batch126_indiana_county_map_and_pti_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The live county-map page embeds county-specific office blocks directly in the HTML for all 92 counties and exposes county-labeled hrefs for Adams, Allen, Bartholomew, and every remaining county.',
          },
          {
            sample_name: 'Adams County office block',
            source_url: DFR_COUNTY_MAP,
            final_url: DFR_COUNTY_MAP,
            verification_status: 'verified',
            source_type: 'embedded_county_office_block',
            source_table: 'batch126_indiana_county_map_and_pti_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'county_adams ... 1145 Bollman St. Decatur, IN 46733-2115. Office hours are 8 a.m. – 4:30 p.m. local time. Telephone: 800-403-0864. Fax: 888-436-9199.',
          },
          {
            sample_name: 'Marion County office block',
            source_url: DFR_COUNTY_MAP,
            final_url: DFR_COUNTY_MAP,
            verification_status: 'verified',
            source_type: 'embedded_county_office_block',
            source_table: 'batch126_indiana_county_map_and_pti_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'county_marion ... Select your zip code to jump to your Marion County DFR Office information ... North Office 2620 Kessler Blvd. E. Dr., Ste. 100 Indianapolis, IN 46220-2891 ... Central Office 3400 Lafayette Road, Ste. 100 Indianapolis, IN 46222.',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_contact_list_gone_generic_directory_insufficient',
        evidence_strength: 'weak',
        blocker_code: EDUCATION_BLOCKER,
        blocker_evidence: 'The official Special Education Director and Local Administrator Contact List link is dead (HTTP 410), and the live Indiana School Directory is generic school/corporation metadata rather than special-education routing proof.',
        sample_count: 3,
        samples: [
          {
            sample_name: 'Indiana DOE Special Education',
            source_url: DOE_SPECIAL_ED,
            final_url: DOE_SPECIAL_ED,
            verification_status: 'verified',
            source_type: 'official_statewide_special_education_root',
            source_table: 'batch126_indiana_county_map_and_pti_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The live page still advertises a Special Education Director and Local Administrator Contact List, but the linked Google Sheets target now returns HTTP 410 Gone.',
          },
          {
            sample_name: 'Indiana Data Center & Reports',
            source_url: DOE_DATA,
            final_url: DOE_DATA,
            verification_status: 'verified',
            source_type: 'official_data_directory_root',
            source_table: 'batch126_indiana_county_map_and_pti_repair',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The live data-center page links the 2025-2026 Indiana School Directory XLSX, but that artifact is generic school/corporation directory data and not a special-education routing source.',
          },
          {
            sample_name: 'Current county rows remain statewide fallbacks',
            source_url: DOE_SPECIAL_ED,
            final_url: DOE_SPECIAL_ED,
            verification_status: 'blocked',
            source_type: 'statewide_fallback_only',
            source_table: 'school_districts',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Current county education rows still point to the same statewide Indiana DOE special-education page for Adams, Allen, Bartholomew, and other counties instead of district-owned or county-mapped routing leaves.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = updatedFailureRows.map((row, index) => ({
    state: row.state,
    state_code: row.state_code,
    priority_rank: index + 1,
    family: row.family,
    severity: row.severity,
    failure_code: row.failure_code,
    next_action: row.next_action,
    evidence: row.evidence,
  }));

  const updatedSummary = {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: EDUCATION_BLOCKER,
    critical_gap_families: ['district_or_county_education_routing'],
    major_gap_families: [],
    verified_source_families_with_samples: updatedVerifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: updatedFailureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };

  const updatedQueueRows = queueRows.map((row) => (
    row.state === 'indiana'
      ? {
          ...row,
          classification: 'BLOCKED',
          index_safe: false,
          completeness_pct: 91,
          weak_critical_families: 1,
          missing_critical_families: 0,
          primary_gap_reason: EDUCATION_BLOCKER,
        }
      : row
  ));

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  const lessonAdded = appendLessonIfMissing(INPUTS.lessons);
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const batchSummary = {
    state: 'indiana',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_families: ['parent_training_information_center', 'county_local_disability_resources'],
    remaining_blockers: ['district_or_county_education_routing'],
    lesson_added: lessonAdded,
  };

  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(
    OUTPUTS.batchReport,
    [
      '# Batch 126 Indiana County-Map And PTI Repair Report v1',
      '',
      'This pass repairs Indiana PTI and county-local routing from bounded first-party and official evidence, leaving only the district-grade education blocker.',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      `- repaired_families: ${batchSummary.repaired_families.join(', ')}`,
      `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
    ].join('\n') + '\n',
  );

  return batchSummary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = generateBatch126IndianaCountyMapAndPtiRepairV1();
  console.log(JSON.stringify(summary, null, 2));
}
