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
  queue: path.join(generatedDir, 'all_state_priority_queue_v3.jsonl'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch95_arizona_blocker_refinement_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch95-arizona-blocker-refinement-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'arizona-california-grade-audit-report-v2.md'),
};

const PTI_EVIDENCE = 'Reviewed 2026-06-22 live Encircle Families acknowledgements page at https://encirclefamilies.org/about-us/acknowledgements/. The fetched first-party page explicitly says Encircle Families is Arizona’s Parent Training and Information (PTI) Center and cites IDEA Part D grant support, so the PTI family is now verified from live first-party designation text rather than inferred family-support scope.';
const EDUCATION_EVIDENCE = 'Reviewed 2026-06-23 live Arizona education blocker artifacts plus one bounded check of the official AZ School Report Cards host at https://azreportcards.azed.gov/. The main AZED root, parental-rights, dispute-resolution, az-find, ESSO, publications, contact, robots.txt, and sitemap URLs still return the Cloudflare "Just a moment..." HTTP 403 shell. But the sibling official report-cards app is browser-readable and its public API /api/Entity/GetEntityList returns a statewide district inventory, including Arizona LEA rows such as St Johns Unified District, Window Rock Unified District, and Chinle Unified District. The live school_district table still contains 15/15 Arizona rows pointing only at the statewide AZED fallback https://www.azed.gov/specialeducation, and the packet still lacks county-keyed district-owned root authoring or exact special-education leaves. Arizona education is therefore no longer blocked by zero official inventory; it is blocked because the accessible official inventory has not yet been converted into county-keyed district-owned roots and leaf evidence.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations, and no authored Arizona county-office leaf packet is currently present on disk to replace them.';
const LESSON_HEADING = '### Full-Domain 403 Plus Fallback-Only Rows Means Packet Gap, Not Just Browser Gap';
const LESSON_BODY = '*   **Lesson:** When an official state domain 403s on the root, robots.txt, sitemap, and obvious leaf guesses, check whether the live rows are still 100% statewide or DOI-style placeholders. If so, record the blocker as missing authored local leaf coverage too, so later repairs do not stall waiting on a browser lane that still has no exact local targets to verify.';
const REPORT_CARDS_LESSON_HEADING = '### Challenged DOE Roots Can Still Have Accessible Official Inventory Apps';
const REPORT_CARDS_LESSON_BODY = "*   **Lesson:** If the main state DOE host is challenge-blocked, inspect sibling official data or report-card apps before declaring the district-root lane empty. Arizona's `azreportcards.azed.gov` host stayed public and its `/api/Entity/GetEntityList` endpoint exposed statewide district inventory even while the main AZED education pages, robots.txt, and sitemap stayed challenged.";

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
  const additions = [];
  if (!current.includes(LESSON_HEADING)) additions.push(`${LESSON_HEADING}\n${LESSON_BODY}`);
  if (!current.includes(REPORT_CARDS_LESSON_HEADING)) additions.push(`${REPORT_CARDS_LESSON_HEADING}\n${REPORT_CARDS_LESSON_BODY}`);
  if (!additions.length) return;
  fs.writeFileSync(INPUTS.lessons, `${current.trimEnd()}\n\n${additions.join('\n\n')}\n`);
}

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
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
    '- Arizona now has reviewed live first-party PTI designation evidence on Encircle Families, so Parent Training and Information Center is no longer a blocker.',
    '- Arizona still cannot reach California-grade or become index-safe because district or county education routing still depends on statewide fallback evidence even though the official AZ School Report Cards app now proves a public district inventory exists; the packet still lacks county-keyed district-owned roots and exact special-education leaves. County/local disability resources still depend on DOI or generic locator rows while the official DES domain is challenged across the root plus obvious office-locator leaves and no reviewed county-office leaf packet is yet authored on disk.',
    '- Arizona is therefore still BLOCKED and not index-safe, but the final blockers are now limited to the two county- or district-grade local-proof families.',
    '',
    '## Evidence checks',
    '',
    `- Parent training and information center: ${PTI_EVIDENCE}`,
    `- Education routing: ${EDUCATION_EVIDENCE}`,
    `- County/local disability resources: ${COUNTY_EVIDENCE}`,
  ].join('\n') + '\n';
}

export function generateBatch95ArizonaBlockerRefinementV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const queueRows = readJsonl(INPUTS.queue);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page',
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_report_cards_inventory_not_yet_converted_to_county_keyed_district_roots',
        status_reason: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        status_reason: COUNTY_EVIDENCE,
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
          failure_code: 'official_report_cards_inventory_exists_but_county_keyed_district_roots_are_unauthored',
          evidence: EDUCATION_EVIDENCE,
        };
      }
      if (row.family === 'county_local_disability_resources') {
        return { ...row, evidence: COUNTY_EVIDENCE };
      }
      return row;
    });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'parent_training_information_center') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        query_basis: 'Reviewed 2026-06-22 live Encircle Families acknowledgements page preserves explicit Arizona PTI designation text and IDEA Part D grant support.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'Encircle Families Acknowledgements',
            source_url: 'https://encirclefamilies.org/about-us/acknowledgements/',
            final_url: 'https://encirclefamilies.org/about-us/acknowledgements/',
            verification_status: 'official_verified',
            source_type: 'official_acknowledgements',
            source_table: 'reviewed_first_party_artifact',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Encircle Families is Arizona’s Parent Training and Information (PTI) Center. PTI Centers are established under Part D of the Individuals with Disabilities Education Act (IDEA).',
          },
        ],
      };
    }
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_official_report_cards_inventory_not_yet_converted_to_county_keyed_district_roots',
        blocker_code: 'official_report_cards_inventory_exists_but_county_keyed_district_roots_are_unauthored',
        blocker_evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        blocker_evidence: COUNTY_EVIDENCE,
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
          failure_code: 'official_report_cards_inventory_exists_but_county_keyed_district_roots_are_unauthored',
          next_action: 'extract_county_keyed_district_inventory_from_official_report_cards_api_then_author_exact_special_education_leaves',
          evidence: EDUCATION_EVIDENCE,
        };
      }
      if (row.family === 'county_local_disability_resources') {
        return {
          ...row,
          next_action: 'author_reviewed_county_specific_office_leaves_before_reopening_browser_lane',
          evidence: COUNTY_EVIDENCE,
        };
      }
      return row;
    });

  const updatedSummary = {
    ...summary,
    completeness_pct: 83,
    strong_critical_families: 10,
    weak_critical_families: 2,
    primary_gap_reason: 'full_domain_challenge_plus_missing_authored_local_leaf_packets',
    major_gap_families: [],
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        failure_code: 'official_report_cards_inventory_exists_but_county_keyed_district_roots_are_unauthored',
        evidence: EDUCATION_EVIDENCE,
      },
      {
        family: 'county_local_disability_resources',
        failure_code: 'official_local_office_roots_challenge_and_doi_fallback_rows',
        evidence: COUNTY_EVIDENCE,
      },
    ],
  };

  const updatedQueueRows = queueRows.map((row) => {
    if (row.state === 'arizona') {
      return {
        ...row,
        primary_gap_reason: 'full_domain_challenge_plus_missing_authored_local_leaf_packets',
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
    batch: 'batch_95_arizona_blocker_refinement_v1',
    generated_at: '2026-06-22T18:00:00.000Z',
    state: 'arizona',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    repaired_families: ['parent_training_information_center'],
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      pti: PTI_EVIDENCE,
      education: EDUCATION_EVIDENCE,
      countyLocal: COUNTY_EVIDENCE,
    },
    official_report_cards_inventory_live: true,
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Arizona Blocker Refinement Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      '- repaired_families: parent_training_information_center',
      '- remaining_blockers: district_or_county_education_routing, county_local_disability_resources',
      '',
      '## Evidence checks',
      '',
      `- pti: ${PTI_EVIDENCE}`,
      `- education: ${EDUCATION_EVIDENCE}`,
      `- county_local: ${COUNTY_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch95ArizonaBlockerRefinementV1();
}
