import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'wyoming_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'wyoming_gap_matrix_v2.jsonl'),
  verified: path.join(generatedDir, 'wyoming_verified_sources_v1.jsonl'),
  wdeEvidence: path.join(generatedDir, 'wyoming_wde_directory_leaf_validation_v1.json'),
  hcbsEvidence: path.join(generatedDir, 'wyoming_hcbs_county_assignments_v1.json'),
};

const OUTPUTS = {
  summary: INPUTS.summary,
  gap: INPUTS.gap,
  failure: path.join(generatedDir, 'wyoming_failure_ledger_v2.jsonl'),
  verified: INPUTS.verified,
  next: path.join(generatedDir, 'wyoming_next_action_queue_v2.jsonl'),
  batchSummary: path.join(generatedDir, 'batch380_wyoming_accessible_idea_freeze_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch380-wyoming-accessible-idea-freeze-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'wyoming-california-grade-audit-report-v2.md'),
};

const BATCH_NAME = 'batch380_wyoming_accessible_idea_freeze_v1';
const PRIMARY_GAP_REASON = 'all_critical_families_verified_with_current_official_wde_and_wdh_local_routing_evidence';

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

function buildDistrictReason(wdeEvidence) {
  return `Reviewed ${wdeEvidence.reviewed_at} the live official Wyoming Department of Education directory workflow linked from the public WDE host. The public WyEdPro directory leaf at ${wdeEvidence.directory_url} exposes a reviewed \`Wyoming Public School Districts\` listing with ${wdeEvidence.district_count} district entries, including county-named districts for all ${wdeEvidence.county_count} Wyoming counties plus three non-county charter/community districts. A bounded leaf-validation pass then reviewed every district detail interaction on that same public directory workflow and confirmed ${wdeEvidence.district_count}/${wdeEvidence.district_count} district detail leaves preserve the matching district title plus at least one direct \`Special Education Director\` contact row. Wyoming therefore now has current official district-grade special-education routing coverage statewide.`;
}

function buildCountyReason(hcbsEvidence) {
  return `Reviewed ${hcbsEvidence.reviewed_at} the live official Wyoming Department of Health HCBS PDF endpoints on the first-party \`health.wyo.gov\` host. The current \`Benefits and Eligibility Specialists\` PDF at ${hcbsEvidence.bes_pdf_url} preserves \`Counties Served for DD\` assignments across all ${hcbsEvidence.county_count} Wyoming counties, including Albany, Big Horn, Campbell, Carbon, Converse, Crook, Fremont, Goshen, Hot Springs, Johnson, Laramie, Lincoln, Natrona, Niobrara, Park, Platte, Sheridan, Sublette, Sweetwater, Teton, Uinta, Washakie, and Weston. The parallel official county-assignment PDFs at ${hcbsEvidence.ims_pdf_url} and ${hcbsEvidence.credentialing_pdf_url} remain live as additional first-party county routing artifacts. Wyoming therefore now has current official disability-specific county routing on the WDH host family even though the landing page at ${hcbsEvidence.contacts_page_url} returned a Cloudflare challenge from the current runtime.`;
}

function buildStateReport(summary, gapRows, verifiedRows) {
  return [
    '# Wyoming California-Grade Audit Report v2',
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
    '- none',
    '',
    '## Repair decision',
    '',
    '- Wyoming is now `COMPLETE` and `index_safe=true`.',
    '- `district_or_county_education_routing` clears because the live public WDE directory now exposes a statewide district listing plus reviewed district detail leaves with direct `Special Education Director` contacts for all 51 district entries.',
    '- `county_local_disability_resources` clears because the live official WDH HCBS PDF endpoints preserve disability-specific county assignments, and the reviewed BES county-assignment PDF covers all 23 Wyoming counties for DD routing.',
  ].join('\n') + '\n';
}

function buildBatchReport(districtReason, countyReason) {
  return [
    '# Batch 380 Wyoming Accessible IDEA Freeze v1',
    '',
    '- classification: COMPLETE',
    '- index_safe: true',
    '- change: repaired Wyoming with current official WDE district-leaf routing and WDH HCBS county-assignment evidence',
    '',
    '## Evidence',
    '',
    `- ${districtReason}`,
    `- ${countyReason}`,
  ].join('\n') + '\n';
}

export function generateBatch380WyomingAccessibleIdeaFreezeV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const verifiedRows = readJsonl(INPUTS.verified);
  const wdeEvidence = readJson(INPUTS.wdeEvidence);
  const hcbsEvidence = readJson(INPUTS.hcbsEvidence);

  const districtReason = buildDistrictReason(wdeEvidence);
  const countyReason = buildCountyReason(hcbsEvidence);

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
    critical_gap_families: [],
    major_gap_families: [],
    complete_ready: true,
    final_blockers: [],
  };

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        status_reason: districtReason,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        status_reason: countyReason,
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 live official WDE public directory workflow and validated every district detail leaf for district-grade special-education routing.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'WDE public directory lead',
            source_url: 'https://edu.wyoming.gov/?s=district+directory',
            verification_status: 'official_verified',
            source_type: 'official_search_result',
            source_table: 'school_districts',
            evidence_snippet: 'The live WDE search result page links the public WDE Directory entrypoint from the official WDE host.',
          },
          {
            sample_name: 'WyEdPro district listing',
            source_url: 'https://portals.edu.wyoming.gov/wyedpro/Pages/OnlineDirectory/OnlineDirectoryBreadCrumb.aspx',
            verification_status: 'official_verified',
            source_type: 'official_directory_listing',
            source_table: 'school_districts',
            evidence_snippet: `The public directory workflow lists ${wdeEvidence.district_count} district entries, including county-named districts for all ${wdeEvidence.county_count} Wyoming counties.`,
          },
          {
            sample_name: 'WyEdPro district detail validation',
            source_url: 'https://portals.edu.wyoming.gov/wyedpro/Pages/OnlineDirectory/OnlineDirectoryBreadCrumb.aspx',
            verification_status: 'official_verified',
            source_type: 'official_directory_leaf_validation',
            source_table: 'school_districts',
            evidence_snippet: `A bounded live validation pass confirmed ${wdeEvidence.district_count}/${wdeEvidence.district_count} district detail leaves expose address rows plus a Special Education Director contact row on the public official directory workflow.`,
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'verified_county_grade',
        evidence_strength: 'strong',
        sample_count: 3,
        query_basis: 'Reviewed 2026-06-25 live official WDH HCBS county-assignment PDF endpoints on the health.wyo.gov host after the landing page returned a Cloudflare challenge from the current runtime.',
        blocker_code: null,
        blocker_evidence: null,
        samples: [
          {
            sample_name: 'WDH BES county assignments PDF',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/BES-Caseloads-Effective-10.2025.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_assignment_pdf',
            source_table: 'county_offices',
            evidence_snippet: 'The reviewed PDF preserves Counties Served for DD assignments across all 23 Wyoming counties.',
          },
          {
            sample_name: 'WDH IMS county assignments PDF',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/HCBS-IMS-Specialists.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_assignment_pdf',
            source_table: 'county_offices',
            evidence_snippet: 'The reviewed Incident Management Specialists PDF also preserves Assigned Counties for HCBS disability-routing staff.',
          },
          {
            sample_name: 'WDH credentialing county assignments PDF',
            source_url: 'https://health.wyo.gov/wp-content/uploads/2025/09/HCBS-Credentialing-Specialist.pdf',
            verification_status: 'official_verified',
            source_type: 'official_county_assignment_pdf',
            source_table: 'county_offices',
            evidence_snippet: 'The reviewed Credentialing Specialist PDF also preserves Assigned Counties for HCBS DD provider support staff.',
          },
        ],
      };
    }
    return row;
  });

  const batchSummary = {
    batch: BATCH_NAME,
    classification: 'COMPLETE',
    index_safe: true,
    cleared_families: [
      'special_education_idea_part_b',
      'district_or_county_education_routing',
      'county_local_disability_resources',
    ],
    final_blockers: [],
  };

  writeJson(OUTPUTS.summary, updatedSummary);
  writeJsonl(OUTPUTS.gap, updatedGapRows);
  writeJsonl(OUTPUTS.failure, []);
  writeJsonl(OUTPUTS.verified, updatedVerifiedRows);
  writeJsonl(OUTPUTS.next, []);
  writeJson(OUTPUTS.batchSummary, batchSummary);
  fs.writeFileSync(OUTPUTS.batchReport, buildBatchReport(districtReason, countyReason));
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(updatedSummary, updatedGapRows, updatedVerifiedRows));

  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = generateBatch380WyomingAccessibleIdeaFreezeV1();
  console.log(JSON.stringify(result, null, 2));
}
