import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'california_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'california_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'california_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'california_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'california_next_action_queue_v2.jsonl'),
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch96_california_blocker_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch96-california-blocker-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'california-california-grade-audit-report-v2.md'),
};

const PTI_STATUS_REASON = 'Reviewed official DDS Family Resource Centers pages now preserve statewide California equivalent parent-center coverage: the statewide FRC mission page names the Family Resource Center Network of California and its statewide support mission, and the regional-center intake / family-resource-center directory enumerates county-by-county California FRC routing. This satisfies the statewide equivalent parent-center requirement even though the older /rc/frcn URL still 404s.';
const PTI_EVIDENCE = 'Reviewed 2026-06-22 live California DDS Family Resource Centers pages. The legacy Family Resource Centers Network URL https://www.dds.ca.gov/rc/frcn still returns 404, but the live statewide FRC page https://www.dds.ca.gov/services/early-start/family-resource-center/ now preserves the Family Resource Center Network of California mission to support families of children with disabilities and promote family-centered, parent-directed family resource centers, and the live directory https://www.dds.ca.gov/services/early-start/family-resource-center/regional-center-early-start-intake-and-family-resource-centers/ enumerates county-by-county California FRC routing. This now supplies an official statewide equivalent parent-center source on disk.';
const EDUCATION_EVIDENCE = 'Reviewed the existing bounded California district packet after the statewide CDE SELPA directory root https://www.cde.ca.gov/sp/se/as/caselpas.asp returned a Radware bot challenge. Exact district/county leaves now verify across OUSD, Amador, and Berkeley: OUSD special-education, school-directory, and ECE contact pages; Amador SELPA, special-education, and district-office-directory pages; and Berkeley special-education, student-services, and directory pages. However, AlpineCOE, ButteCOE, CalaverasCOE, and ColusaCOE SELPA roots fail DNS on both www and bare-domain checks, and Fremont USD still fails SSL handshake in the current lane. Even with 9 reviewed exact leaves, county-grade district routing still cannot be proven statewide across all 58 California counties.';
const LESSON_HEADING = '### On California DDS, The Replacement FRC Paths Matter More Than The Dead Legacy Root';
const LESSON_BODY = '*   **Lesson:** If `https://www.dds.ca.gov/rc/frcn` is dead, do not stop there. Check the live DDS replacements under `/services/early-start/family-resource-center/` and `/services/early-start/family-resource-center/regional-center-early-start-intake-and-family-resource-centers/`; together they can preserve statewide equivalent parent-center mission text plus county-by-county FRC routing.';

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

function appendLessonIfMissing() {
  const current = fs.readFileSync(INPUTS.lessons, 'utf8');
  if (current.includes(LESSON_HEADING)) {
    return;
  }
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${LESSON_HEADING}\n${LESSON_BODY}\n`);
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# California California-Grade Audit Report v2',
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
    '## California final blocker decision',
    '',
    '- Parent training information center is now verified from the live official DDS Family Resource Centers pages, which preserve statewide California equivalent parent-center mission text plus county-by-county FRC routing.',
    '- District or county education routing remains blocked because the bounded packet now verifies 9 exact leaves across OUSD, Amador, and Berkeley, but several county COE roots are dead on both www and bare domains, Fremont still fails TLS handshake, and county-grade district routing still cannot be proven statewide from those saved packet roots alone.',
    '- County-local disability resources remain verified from the official CDSS IHSS county directory, which exposes county-labeled local-office links across all 58 counties.',
    '- California is therefore still truthfully BLOCKED and not index-safe.',
  ].join('\n') + '\n';
}

export function generateBatch96CaliforniaBlockerRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        status_reason: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: PTI_STATUS_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => row.family !== 'parent_training_information_center')
    .map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        evidence: EDUCATION_EVIDENCE,
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        query_basis: 'Reviewed the bounded California district packet roots after the statewide CDE SELPA directory challenge and verified additional live exact leaves on Amador and Berkeley domains.',
        blocker_evidence: EDUCATION_EVIDENCE,
        sample_count: 9,
        samples: [
          {
            sample_name: 'Special Education - Oakland Unified School District',
            source_url: 'https://www.ousd.org/enroll/enroll-at-ousd/enroll-your-student-tk-12/how-it-works-placement-priorities-special-programs-resources/special-education',
            verification_status: 'verified',
            source_type: 'exact_leaf_target',
            source_table: 'batch20_verified_leaf_targets',
          },
          {
            sample_name: 'School Directory - Oakland Unified School District',
            source_url: 'https://www.ousd.org/our-schools/school-directory',
            verification_status: 'verified',
            source_type: 'exact_leaf_target',
            source_table: 'batch20_verified_leaf_targets',
          },
          {
            sample_name: 'Contact ECE Schools & Office - Oakland Unified School District',
            source_url: 'https://www.ousd.org/enroll/enroll-at-ousd/ece/contact-ece-schools-office',
            verification_status: 'verified',
            source_type: 'exact_leaf_target',
            source_table: 'batch20_verified_leaf_targets',
          },
          {
            sample_name: 'Amador SELPA',
            source_url: 'https://www.amadorcoe.org/selpa',
            verification_status: 'verified',
            source_type: 'exact_leaf_target',
            source_table: 'bounded_live_california_check',
          },
          {
            sample_name: 'Amador Special Education Home',
            source_url: 'https://www.amadorcoe.org/specialeducation',
            verification_status: 'verified',
            source_type: 'exact_leaf_target',
            source_table: 'bounded_live_california_check',
          },
          {
            sample_name: 'Amador District Office Staff Directory',
            source_url: 'https://www.amadorcoe.org/dodirectory',
            verification_status: 'verified',
            source_type: 'exact_leaf_target',
            source_table: 'bounded_live_california_check',
          },
          {
            sample_name: 'Special Education | Berkeley Unified School District',
            source_url: 'https://www.berkeleyschools.net/departments/special-education/',
            verification_status: 'verified',
            source_type: 'exact_leaf_target',
            source_table: 'bounded_live_california_check',
          },
          {
            sample_name: 'Student Services | Berkeley Unified School District',
            source_url: 'https://www.berkeleyschools.net/departments/student-services/',
            verification_status: 'verified',
            source_type: 'exact_leaf_target',
            source_table: 'bounded_live_california_check',
          },
          {
            sample_name: 'Directory | Berkeley Unified School District',
            source_url: 'https://www.berkeleyschools.net/directory/',
            verification_status: 'verified',
            source_type: 'exact_leaf_target',
            source_table: 'bounded_live_california_check',
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 2,
        query_basis: 'Reviewed 2026-06-22 live official DDS Family Resource Centers pages, which now preserve statewide equivalent parent-center mission text plus county-by-county California FRC routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Family Resource Centers',
            source_url: 'https://www.dds.ca.gov/services/early-start/family-resource-center/',
            final_url: 'https://www.dds.ca.gov/services/early-start/family-resource-center/',
            verification_status: 'verified',
            source_type: 'official_fetched_page',
            source_table: 'bounded_live_california_check',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'For more information about FRC contact the Family Resource Center Network of California. Their mission is to support families of children with disabilities, special healthcare needs, and those at risk by ensuring the continuance, expansion, promotion and quality of family-centered, parent-directed, family resource centers.',
          },
          {
            sample_name: 'Regional Center Early Start Intake and Family Resource Centers',
            source_url: 'https://www.dds.ca.gov/services/early-start/family-resource-center/regional-center-early-start-intake-and-family-resource-centers/',
            final_url: 'https://www.dds.ca.gov/services/early-start/family-resource-center/regional-center-early-start-intake-and-family-resource-centers/',
            verification_status: 'verified',
            source_type: 'official_fetched_directory',
            source_table: 'bounded_live_california_check',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Regional Center Early Start Intake and Family Resource Centers. Alameda County ... Family Resource Navigators. Amador County ... Family Resource Network. Alpine County ... Warmline Family Resource Center.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'parent_training_information_center')
    .map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        evidence: EDUCATION_EVIDENCE,
      };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    completeness_pct: 91,
    strong_critical_families: 11,
    weak_critical_families: 1,
    missing_critical_families: 0,
    primary_gap_reason: 'district_grade_leaf_packet_exhausted_after_statewide_equivalent_parent_center_repair',
    major_gap_families: [],
    final_blockers: summary.final_blockers
      .filter((row) => row.family !== 'parent_training_information_center')
      .map((row) => {
        if (row.family === 'district_or_county_education_routing') {
          return { ...row, evidence: EDUCATION_EVIDENCE };
        }
        return row;
      }),
  };

  const updatedQueueRows = queueRows.map((row) => {
    if (row.state === 'california') {
      return {
        ...row,
        completeness_pct: 91,
        weak_critical_families: 1,
        primary_gap_reason: 'district_grade_leaf_packet_exhausted_after_statewide_equivalent_parent_center_repair',
      };
    }
    return row;
  });

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJsonl(INPUTS.queue, updatedQueueRows);
  writeJson(INPUTS.summary, updatedSummary);
  appendLessonIfMissing();
  writeJson(OUTPUTS.summary, {
    batch: 'batch_96_california_blocker_refinement_v1',
    generated_at: '2026-06-22T18:20:00.000Z',
    state: 'california',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    refined_families: ['district_or_county_education_routing', 'parent_training_information_center'],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      education: EDUCATION_EVIDENCE,
      pti: PTI_EVIDENCE,
    },
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# California Blocker Refinement Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      '- refined_families: district_or_county_education_routing, parent_training_information_center',
      '',
      '## Evidence checks',
      '',
      `- education: ${EDUCATION_EVIDENCE}`,
      `- pti: ${PTI_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch96CaliforniaBlockerRefinementV1();
}
