import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'minnesota_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'minnesota_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'minnesota_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'minnesota_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'minnesota_next_action_queue_v2.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch186_minnesota_browser_contract_refinement_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch186-minnesota-browser-contract-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'minnesota-california-grade-audit-report-v2.md'),
};

const EDUCATION_REASON = 'The Minnesota education blocker is now sharper: the official MDE-ORG root is live, clearly describes a searchable directory that can generate files from search parameters, and exposes exact child surfaces including `MDEAnalytics/Data.jsp`, `MDEAnalytics/Summary.jsp`, `MDEAnalytics/Sleds.jsp`, and `MdeOrgView/`. But the exact embedded front-end it points to is not a usable public directory contract. In bounded review, `/mdeprod/groups/communications/documents/unzip/048426/index.html` renders as an unrelated slide-style course shell instead of district or organization search results, while the public analytics and org-view children land on live Radware captcha pages. Minnesota therefore still lacks a reviewed county-mapped district-routing artifact on exact first-party surfaces.';

const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 bounded browser and exact-root HTML checks on the live official Minnesota education lane. The root page at https://education.mn.gov/MDE/about/SchOrg/ is live, titled `Schools and Organizations (MDE-ORG)`, explicitly says MDE-ORG is a searchable database that includes school, district, and education-related organization directories and can generate files from search parameters, and exposes exact child surfaces `https://pub.education.mn.gov/MDEAnalytics/Data.jsp`, `https://pub.education.mn.gov/MDEAnalytics/DataSecure.jsp`, `https://pub.education.mn.gov/MDEAnalytics/Sleds.jsp`, `https://pub.education.mn.gov/MDEAnalytics/Summary.jsp`, and `https://pub.education.mn.gov/MdeOrgView/`. But the exact embedded front-end it points to at https://education.mn.gov/mdeprod/groups/communications/documents/unzip/048426/index.html does not render a directory in browser mode either; it opens as a slide-style course shell with text like `This course is designed to be accessible...` and `Progress, Slide 1 of 25`. The public analytics and org-view children land on live Radware captcha pages rather than a public search or export contract. Minnesota therefore still lacks a reviewed first-party county-to-district routing artifact, but the blocker is now correctly narrowed to a live directory root whose exact linked child surfaces are either miswired or challenge-protected.';

const COUNTY_REASON = 'The Minnesota county-local blocker is now sharper: the legacy `.jsp` path is stale, and the modern DHS replacements do not merely redirect vaguely. In browser review, the exact county-and-tribal and county-tribal-directory replacements land on live `validate.perfdrive.com` / Radware Bot Manager captcha pages that demand human validation before any county-grade content is exposed. That means the replatformed official family exists, but the current low-token lane still cannot reach a reviewable county-or-tribal office contract.';

const COUNTY_EVIDENCE = 'Reviewed 2026-06-23 bounded browser checks on the exact Minnesota DHS county-and-tribal routing replacements. The legacy `county-and-tribal-offices.jsp` path remains stale, but the slash replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/ now lands on a live `validate.perfdrive.com` Radware Bot Manager captcha page titled `Radware Bot Manager Captcha` with body text `Please validate your request` and `Complete this task to confirm you are a human generating this request.` The adjacent replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/ also resolves into the same validate.perfdrive.com captcha family. Minnesota therefore still lacks a reviewed county-grade local office contract in bounded low-token mode, but the blocker is now precisely a live replatformed DHS family fronted by Radware captcha rather than one bad redirect guess.';

const LESSON_HEADING = '### Embedded Official Front-Ends Can Resolve To The Wrong Product Entirely';
const LESSON_BODY = "*   **Lesson:** If a live official directory landing page promises searchable exports, open the exact linked front-end once in browser mode before assuming it is just a JS shell. Minnesota's MDE-ORG root looked promising, but its linked child loaded as an unrelated slide-style course shell, which is a different blocker than a hidden directory app.";
const CHILD_SURFACES_LESSON_HEADING = '### Official Directory Roots Can Leak Exact Child Endpoints Even When Public Access Stays Blocked';
const CHILD_SURFACES_LESSON_BODY = "*   **Lesson:** If an official directory root advertises exports, inspect the root HTML for exact child endpoints before guessing new paths. Minnesota's live MDE-ORG page exposed `MDEAnalytics/Data.jsp`, `Summary.jsp`, `Sleds.jsp`, `DataSecure.jsp`, and `MdeOrgView/`, which proved the right first-party child family even though the public children still collapsed into Radware captcha or a miswired shell.";

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
  const additions = [];
  if (!current.includes(LESSON_HEADING)) additions.push(`${LESSON_HEADING}\n${LESSON_BODY}`);
  if (!current.includes(CHILD_SURFACES_LESSON_HEADING)) additions.push(`${CHILD_SURFACES_LESSON_HEADING}\n${CHILD_SURFACES_LESSON_BODY}`);
  if (!additions.length) return false;
  fs.writeFileSync(filePath, `${current.trimEnd()}\n\n${additions.join('\n\n')}\n`);
  return true;
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Minnesota California-Grade Audit Report v2',
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
    '- Minnesota remains BLOCKED and index_safe=false.',
    '- Education is still blocked because the live MDE-ORG root points to exact child surfaces that are either miswired into unrelated course content or challenge-protected instead of exposing a county-grade routing contract.',
    '- County-local is still blocked because the replatformed DHS county-and-tribal family now resolves to a live Radware captcha gate before any local office content appears.',
    '- PTI remains blocked on missing live first-party PTI designation text.',
  ].join('\n') + '\n';
}

export function generateBatch186MinnesotaBrowserContractRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_mdeorg_root_with_miswired_or_challenged_child_contracts',
        status_reason: EDUCATION_REASON,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_replatformed_mn_dhs_family_on_live_radware_captcha',
        status_reason: COUNTY_REASON,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'official_mdeorg_root_live_but_child_contract_is_miswired_or_challenged',
        evidence: EDUCATION_EVIDENCE,
        next_action: 'hold_blocked_until_reviewed_first_party_mdeorg_query_or_export_contract_exists',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'replatformed_mn_dhs_county_tribal_family_lands_on_live_radware_captcha',
        evidence: COUNTY_EVIDENCE,
        next_action: 'hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_contract_exists',
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_live_mdeorg_root_with_miswired_or_challenged_child_contracts',
        blocker_code: 'official_mdeorg_root_live_but_child_contract_is_miswired_or_challenged',
        blocker_evidence: EDUCATION_EVIDENCE,
        query_basis: 'Reviewed the live MDE-ORG root, its exact linked embedded child, and the adjacent official MDEAnalytics summary surface in browser mode.',
        samples: [
          {
            sample_name: 'Schools and Organizations (MDE-ORG)',
            source_url: 'https://education.mn.gov/MDE/about/SchOrg/',
            final_url: 'https://education.mn.gov/MDE/about/SchOrg/',
            verification_status: 'verified',
            source_type: 'official_directory_root',
            source_table: 'batch186_minnesota_browser_contract_refinement',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The live MDE-ORG root explicitly says the database includes school, district, and education-related organization directories, can generate files from search parameters, and exposes exact first-party child endpoints including Data.jsp, Summary.jsp, Sleds.jsp, DataSecure.jsp, and MdeOrgView.',
          },
          {
            sample_name: 'MDE-ORG linked embedded child',
            source_url: 'https://education.mn.gov/mdeprod/groups/communications/documents/unzip/048426/index.html',
            final_url: 'https://education.mn.gov/mdeprod/groups/communications/documents/unzip/048426/index.html',
            verification_status: 'blocked',
            source_type: 'official_miswired_child_shell',
            source_table: 'batch186_minnesota_browser_contract_refinement',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The exact child does not render a directory in browser mode; it opens as a slide-style course shell with text like `This course is designed to be accessible...` and `Progress, Slide 1 of 25`.',
          },
          {
            sample_name: 'MDEAnalytics and OrgView child family',
            source_url: 'https://pub.education.mn.gov/MDEAnalytics/Summary.jsp',
            final_url: 'https://validate.perfdrive.com/?...MDEAnalytics/Summary.jsp',
            verification_status: 'blocked',
            source_type: 'official_search_surface_radware_captcha',
            source_table: 'batch186_minnesota_browser_contract_refinement',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The official child family exposed by the root includes Summary.jsp, Data.jsp, Sleds.jsp, and MdeOrgView, but the public analytics and org-view surfaces still land on live Radware captcha pages instead of a public search or export contract.',
          },
        ],
        sample_count: 3,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_replatformed_mn_dhs_family_on_live_radware_captcha',
        blocker_code: 'replatformed_mn_dhs_county_tribal_family_lands_on_live_radware_captcha',
        blocker_evidence: COUNTY_EVIDENCE,
        query_basis: 'Reviewed the replatformed DHS county-and-tribal replacement pages in browser mode after the stale legacy `.jsp` path failed.',
        samples: [
          {
            sample_name: 'County and Tribal Offices replacement',
            source_url: 'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/',
            final_url: 'http://validate.perfdrive.com/...county-and-tribal-offices/',
            verification_status: 'blocked',
            source_type: 'official_replatformed_surface_radware_captcha',
            source_table: 'batch186_minnesota_browser_contract_refinement',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The replacement page lands on a live Radware Bot Manager captcha with text `Please validate your request` before any county-or-tribal office content appears.',
          },
          {
            sample_name: 'County Tribal Nation Directory replacement',
            source_url: 'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/',
            final_url: 'http://validate.perfdrive.com/...county-tribal-nation-directory/',
            verification_status: 'blocked',
            source_type: 'official_replatformed_surface_radware_captcha',
            source_table: 'batch186_minnesota_browser_contract_refinement',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The adjacent replacement resolves into the same validate.perfdrive.com captcha family rather than a public county/tribal directory.',
          },
          {
            sample_name: 'Legacy county-and-tribal-offices path family',
            source_url: 'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices.jsp',
            final_url: 'https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices.jsp',
            verification_status: 'blocked',
            source_type: 'official_stale_legacy_path',
            source_table: 'batch178_minnesota_mdeorg_directory_root_refresh',
            fetched_at: '2026-06-23T00:00:00.000Z',
            evidence_snippet: 'The old `.jsp` county-and-tribal-offices path is stale and no longer preserves the reviewed local-office contract.',
          },
        ],
        sample_count: 3,
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'official_mdeorg_root_live_but_child_contract_is_miswired_or_challenged',
        next_action: 'hold_blocked_until_reviewed_first_party_mdeorg_query_or_export_contract_exists',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'replatformed_mn_dhs_county_tribal_family_lands_on_live_radware_captcha',
        next_action: 'hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_contract_exists',
        evidence: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedSummary = {
    ...summary,
    primary_gap_reason: 'official_mdeorg_directory_root_is_live_but_linked_child_is_miswired_or_challenged_and_mn_dhs_county_tribal_replatform_lands_on_live_radware_captcha',
    final_blockers: (summary.final_blockers || []).map((row) => {
      if (row.family === 'district_or_county_education_routing') {
        return {
          ...row,
          failure_code: 'official_mdeorg_root_live_but_child_contract_is_miswired_or_challenged',
          evidence: EDUCATION_EVIDENCE,
          next_action: 'hold_blocked_until_reviewed_first_party_mdeorg_query_or_export_contract_exists',
        };
      }
      if (row.family === 'county_local_disability_resources') {
        return {
          ...row,
          failure_code: 'replatformed_mn_dhs_county_tribal_family_lands_on_live_radware_captcha',
          evidence: COUNTY_EVIDENCE,
          next_action: 'hold_blocked_until_reviewed_first_party_mn_dhs_county_tribal_contract_exists',
        };
      }
      return row;
    }),
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch_186_minnesota_browser_contract_refinement_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'minnesota',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    mdeorg_root_live: true,
    embedded_child_miswired_course_shell: true,
    mdeanalytics_radware_captcha: true,
    mndhs_replatform_radware_captcha: true,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 186 Minnesota Browser Contract Refinement Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_families: district_or_county_education_routing, county_local_disability_resources',
    '',
    '## Education evidence',
    '',
    `- ${EDUCATION_EVIDENCE}`,
    '',
    '## County-local evidence',
    '',
    `- ${COUNTY_EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Minnesota remains blocked and not index-safe.',
    '- The MDE-ORG root is live, but its exact linked child is miswired into an unrelated course shell and the adjacent official summary surface is challenge-protected.',
    '- The DHS county-and-tribal replacement family is also live, but browser review lands on a Radware captcha before any county-grade contract appears.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch186MinnesotaBrowserContractRefinementV1();
  console.log(JSON.stringify(result, null, 2));
}
