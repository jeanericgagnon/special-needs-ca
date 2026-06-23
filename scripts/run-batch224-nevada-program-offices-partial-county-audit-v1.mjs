import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'nevada_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'nevada_gap_matrix_v2.jsonl'),
  failures: path.join(generatedDir, 'nevada_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'nevada_verified_sources_v1.jsonl'),
  nextActions: path.join(generatedDir, 'nevada_next_action_queue_v2.jsonl'),
  packet: path.join(generatedDir, 'nevada_county_local_disability_resources_welfare_office_packet_v1.json'),
  lessons: path.join(repoRoot, 'docs', 'state-upgrade-lessons-learned.md'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch224_nevada_program_offices_partial_county_audit_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch224-nevada-program-offices-partial-county-audit-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'nevada-california-grade-audit-report-v2.md'),
};

const FAILURE_CODE = 'official_program_offices_page_adds_partial_county_partners_but_no_full_county_to_welfare_contract';
const STATUS_REASON = 'Reviewed 2026-06-23 bounded live probes on the official Nevada DSS contact family more tightly. The live Contact, Welfare District Offices-North, and Welfare District Offices-South pages still expose exact office leaves with real addresses and phones but no county-served labels, county filter, or county assignment. However, the sibling official `Program Offices` page does preserve some county-named local partners such as Churchill County Social Services, Douglas County Social Services, Elko County Human & Social Services, Eureka County Social Services, Lincoln County Community Connection, Lyon County Human Services, Nye County Health & Human Services, Pershing County Senior Center, and White Pine County Social Services. That improves the packet because Nevada does have partial official county-bearing local resource evidence on the same host, but it still does not produce a complete 17-county welfare-office or county-to-office routing contract.';
const EVIDENCE = 'Reviewed 2026-06-23 bounded live probes on the official Nevada DSS welfare-office stack and one sibling official contact page. The live Contact hub plus `Welfare District Offices-North` and `Welfare District Offices-South` pages remain exact office leaves with real addresses and phones but zero county-served labels, zero county filter, and no county assignment. A fresh bounded probe on the sibling official page https://www.dss.nv.gov/contact/program-offices/ showed that Nevada DSS does expose some county-named local partners on the same host, including Churchill County Social Services, Douglas County Social Services, Elko County Human & Social Services, Eureka County Social Services, Lincoln County Community Connection, Lyon County Human Services, Nye County Health & Human Services, Pershing County Senior Center, and White Pine County Social Services, along with Carson City and other locality-specific partners. But the page still does not provide a complete 17-county county-to-office or county-to-welfare-office contract: a bounded county-coverage check found only 11 of Nevada’s 17 county-equivalent names on the page, leaving Clark, Esmeralda, Humboldt, Lander, Storey, and Washoe without a county-named contract there. Nevada therefore remains blocked, but the blocker is now precisely a partial county-bearing sibling page plus incomplete county coverage rather than zero county signal anywhere on the host.';
const NEXT_ACTION = 'hold_blocked_until_official_full_17_county_contract_or_county_to_welfare_office_mapping_is_reviewed';

const LESSON_HEADING = '### Partial County Mentions On A Sibling Page Still Need A Full Coverage Audit';
const LESSON_BODY = '*   **Lesson:** If a sibling official contact page starts surfacing county-named local partners, run a bounded full-county coverage check before treating it as a replacement contract. Nevada DSS `Program Offices` added real county-named social-service entries, but it still covered only 11 of 17 counties and did not replace the missing welfare-office mapping.';

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
    '# Nevada California-Grade County Office Packet v3',
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
    '## Packetized blocker',
    '',
    '- County-local packet saved at `data/generated/nevada_county_local_disability_resources_welfare_office_packet_v1.json`.',
    '- The welfare office pages remain exact office leaves without county-served labels.',
    '- The sibling `Program Offices` page adds partial county-bearing local partners, but it still does not provide a complete 17-county welfare-office or county-to-office routing contract.',
  ].join('\n') + '\n';
}

export function generateBatch224NevadaProgramOfficesPartialCountyAuditV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failures);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.nextActions);
  const packet = readJson(INPUTS.packet);

  const updatedGapRows = gapRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, family_status: 'blocked_partial_county_bearing_program_offices_page_without_full_contract', status_reason: STATUS_REASON }
      : row
  ));

  const updatedFailureRows = failureRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
      : row
  ));

  const updatedVerifiedRows = verifiedRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? {
          ...row,
          family_status: 'blocked_partial_county_bearing_program_offices_page_without_full_contract',
          blocker_code: FAILURE_CODE,
          blocker_evidence: EVIDENCE,
          query_basis: 'Reviewed 2026-06-23 the official Nevada DSS Contact hub, Welfare District Offices North/South leaves, and the sibling Program Offices page with a bounded 17-county coverage check.',
          sample_count: 5,
          samples: [
            {
              sample_name: 'Nevada DSS Contact hub',
              source_url: 'https://www.dss.nv.gov/contact/',
              final_url: 'https://www.dss.nv.gov/contact/',
              verification_status: 'blocked',
              source_type: 'official_contact_hub_without_county_contract',
              source_table: 'batch224_nevada_program_offices_partial_county_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The live contact hub links the North and South welfare office leaves but exposes no county filter or county-served assignment.',
            },
            {
              sample_name: 'Nevada Welfare District Offices-North',
              source_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-north/',
              final_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-north/',
              verification_status: 'blocked',
              source_type: 'official_office_leaf_without_county_contract',
              source_table: 'batch224_nevada_program_offices_partial_county_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The North page lists exact offices such as Carson City, Elko/Winnemucca, Ely, Fallon, Hawthorne, Reno, Sparks, and Yerington with addresses and phones, but no county-served labels.',
            },
            {
              sample_name: 'Nevada Welfare District Offices-South',
              source_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-south/',
              final_url: 'https://www.dss.nv.gov/contact/welfare-district-offices-south/',
              verification_status: 'blocked',
              source_type: 'official_office_leaf_without_county_contract',
              source_table: 'batch224_nevada_program_offices_partial_county_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The South page lists exact offices such as Belrose, Cambridge, Decatur, Eastern, Henderson, Nellis, Owens, Pahrump, Spring Mountain, and Flamingo with addresses and phones, but no county-served labels.',
            },
            {
              sample_name: 'Nevada Program Offices page',
              source_url: 'https://www.dss.nv.gov/contact/program-offices/',
              final_url: 'https://www.dss.nv.gov/contact/program-offices/',
              verification_status: 'blocked',
              source_type: 'official_sibling_page_with_partial_county_coverage',
              source_table: 'batch224_nevada_program_offices_partial_county_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'The Program Offices page preserves county-named entries such as Churchill County Social Services, Douglas County Social Services, Elko County Human & Social Services, Eureka County Social Services, Lyon County Human Services, Nye County Health & Human Services, and White Pine County Social Services.',
            },
            {
              sample_name: 'Nevada county coverage remainder',
              source_url: 'https://www.dss.nv.gov/contact/program-offices/',
              final_url: 'https://www.dss.nv.gov/contact/program-offices/',
              verification_status: 'blocked',
              source_type: 'incomplete_county_coverage',
              source_table: 'batch224_nevada_program_offices_partial_county_audit',
              fetched_at: '2026-06-23T00:00:00.000Z',
              evidence_snippet: 'A bounded county coverage check found only 11 of Nevada’s 17 county-equivalent names on the page, leaving Clark, Esmeralda, Humboldt, Lander, Storey, and Washoe without a county-named contract there.',
            },
          ],
        }
      : row
  ));

  const updatedNextRows = nextRows.map((row) => (
    row.family === 'county_local_disability_resources'
      ? { ...row, failure_code: FAILURE_CODE, next_action: NEXT_ACTION, evidence: EVIDENCE }
      : row
  ));

  const updatedSummary = {
    ...summary,
    final_blockers: (summary.final_blockers || []).map((row) => (
      row.family === 'county_local_disability_resources'
        ? { ...row, failure_code: FAILURE_CODE, evidence: EVIDENCE, next_action: NEXT_ACTION }
        : row
    )),
  };

  const updatedPacket = {
    ...packet,
    failure_code: FAILURE_CODE,
    packet_complete_when: 'Nevada can reopen only when a reviewed first-party DSS or sibling official page exposes a truthful full 17-county county-to-office contract, county-served labels, or a machine-readable county filter for all 17 counties.',
    current_metrics: {
      ...(packet.current_metrics || {}),
      siblingProgramOfficesReviewed: true,
      partialCountyNamedCoverageCount: 11,
      missingCountyContractCount: 6,
    },
    representative_sources: [
      ...(packet.representative_sources || []),
      {
        label: 'Nevada DSS Program Offices',
        url: 'https://www.dss.nv.gov/contact/program-offices/',
        status: 'official_sibling_page_with_partial_county_coverage',
        evidence: 'The sibling Program Offices page preserves some county-named social-service entries on the same host, but it still covers only 11 of 17 Nevada county-equivalents and does not replace the missing welfare-office mapping.',
      },
    ],
  };

  writeJson(INPUTS.summary, updatedSummary);
  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failures, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.nextActions, updatedNextRows);
  writeJson(INPUTS.packet, updatedPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));

  const lessonsUpdated = appendLessonIfMissing(INPUTS.lessons);
  const batchSummary = {
    batch: 'batch224_nevada_program_offices_partial_county_audit_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'nevada',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    sibling_program_offices_reviewed: true,
    partial_county_named_coverage_count: 11,
    missing_county_contract_count: 6,
    lessons_updated: lessonsUpdated,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 224 Nevada Program Offices Partial County Audit Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- refined_family: county_local_disability_resources',
    `- failure_code: ${FAILURE_CODE}`,
    '',
    '## Evidence',
    '',
    `- ${EVIDENCE}`,
    '',
    '## Repair decision',
    '',
    '- Kept Nevada BLOCKED.',
    '- Confirmed the sibling Program Offices page adds real county-bearing local partners on the same official DSS host.',
    '- Confirmed that county-bearing coverage is still incomplete at 11 of 17 counties and does not replace the missing welfare-office county mapping.',
  ].join('\n') + '\n';
  fs.writeFileSync(OUTPUTS.batchReport, batchReport);

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch224NevadaProgramOfficesPartialCountyAuditV1();
  console.log(JSON.stringify(result, null, 2));
}
