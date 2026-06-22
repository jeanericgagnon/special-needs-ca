import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'connecticut_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'connecticut_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'connecticut_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'connecticut_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'connecticut_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch107_connecticut_local_proof_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch107-connecticut-local-proof-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'connecticut-california-grade-audit-report-v2.md'),
};

const EDUCATION_EVIDENCE = 'Reviewed 2026-06-22 bounded live checks on the current Public EdSight district-finder shell https://public-edsight.ct.gov/overview/find-schools/find-school-district and its linked official OrgSearchReport endpoint https://edsight.ct.gov/SASStoredProcess/do?_keyword=&_program=%2FCTDOE%2FEdSight%2FRelease%2FReporting%2FPublic%2FReports%2FStoredProcesses%2FOrgSearchReport_SiteCore&orgtype=&orgdistrict=&orgname=Hartford&_select=Submit. The public shell renders anonymous navigation only, while the direct district query bounces to SAS Logon instead of returning public district records, so the official state directory surface still does not preserve county- or district-grade routing contacts that can replace Connecticut\'s statewide SDE fallback rows.';
const COUNTY_EVIDENCE = 'Reviewed 2026-06-22 bounded live checks on the current Connecticut DDS regions hub https://portal.ct.gov/dds/about/dds-regions plus its linked official regional-contact-list PDF https://portal.ct.gov/-/media/DDS/Commissioner/Regional_Contact_List.pdf and town-finder archive https://portal.ct.gov/dds/searchable-archive/general/regionstownfinder/townfinder1. The live DDS hub is real, but the actionable local-routing evidence now lives in an unparsed PDF and searchable-archive town-finder path, while the older direct regional-office URLs from the sitemap return HTTP 404. Connecticut therefore has a reviewed official replacement source family, but not yet county-grade extracted local office evidence that can truthfully replace the DOI-backed office rows.';
const PTI_EVIDENCE = 'Reviewed 2026-06-22 live first-party CPAC About page https://cpacinc.org/about.aspx. The page preserves the sentence "Beth is also the Director of CPAC\'s federally funded Parent Training and Information (PTI) Center project," so CPAC now has explicit first-party PTI designation evidence rather than only generic statewide family-support language.';

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

function buildReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Connecticut California-Grade Audit Report v2',
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
    '- Connecticut still cannot reach California-grade or become index-safe because the official education directory surface stops at a public finder shell plus a SAS-logon-gated district query, and the official DDS replacement for local office routing now lives in a PDF-plus-archive stack that has not yet been extracted into county-grade evidence.',
    '- CPAC is no longer a blocker because the live first-party About page explicitly preserves federally funded Parent Training and Information (PTI) Center designation text.',
    '- Connecticut is therefore still BLOCKED and not index-safe, but the remaining blockers are now narrowed to one authenticated education directory lane and one PDF/archive local-office extraction lane.',
  ].join('\n') + '\n';
}

export function generateBatch107ConnecticutLocalProofRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_public_edsight_shell_plus_sas_logon_query',
        status_reason: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_dds_replacement_needs_pdf_or_archive_extraction',
        status_reason: COUNTY_EVIDENCE,
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'public_edsight_shell_does_not_yield_anonymous_district_records',
        evidence: EDUCATION_EVIDENCE,
        next_action: 'author_district_owned_exact_targets_or_browser_auth_edsight_query',
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'dds_regions_replacement_is_pdf_plus_archive_not_county_extracted',
        evidence: COUNTY_EVIDENCE,
        next_action: 'extract_dds_regions_pdf_or_archive_townfinder',
      };
    }
    return row;
  });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        family_status: 'blocked_public_edsight_shell_plus_sas_logon_query',
        blocker_code: 'public_edsight_shell_does_not_yield_anonymous_district_records',
        blocker_evidence: EDUCATION_EVIDENCE,
        sample_count: 2,
        query_basis: 'Reviewed live official Connecticut education routing surfaces and preserved the current public EdSight district-finder shell plus the authenticated OrgSearchReport endpoint as the remaining blocker evidence.',
        samples: [
          {
            sample_name: 'Public EdSight district finder shell',
            source_url: 'https://public-edsight.ct.gov/overview/find-schools/find-school-district',
            final_url: 'https://public-edsight.ct.gov/overview/find-schools/find-school-district',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The public finder shell loads, but it does not expose anonymous district-grade routing contacts by itself.',
          },
          {
            sample_name: 'EdSight OrgSearchReport district query',
            source_url: 'https://edsight.ct.gov/SASStoredProcess/do?_keyword=&_program=%2FCTDOE%2FEdSight%2FRelease%2FReporting%2FPublic%2FReports%2FStoredProcesses%2FOrgSearchReport_SiteCore&orgtype=&orgdistrict=&orgname=Hartford&_select=Submit',
            final_url: 'https://edsight.ct.gov/SASStoredProcess/do?_keyword=&_program=%2FCTDOE%2FEdSight%2FRelease%2FReporting%2FPublic%2FReports%2FStoredProcesses%2FOrgSearchReport_SiteCore&orgtype=&orgdistrict=&orgname=Hartford&_select=Submit',
            verification_status: 'source_listed',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'The direct district query returns SAS Logon rather than anonymous district search results.',
          },
        ],
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        family_status: 'blocked_live_dds_replacement_needs_pdf_or_archive_extraction',
        blocker_code: 'dds_regions_replacement_is_pdf_plus_archive_not_county_extracted',
        blocker_evidence: COUNTY_EVIDENCE,
        sample_count: 3,
        query_basis: 'Reviewed live official Connecticut DDS regional routing surfaces and preserved the current hub, contact-list PDF, and town-finder archive as the replacement local-office source family.',
        samples: [
          {
            sample_name: 'Connecticut DDS Regions hub',
            source_url: 'https://portal.ct.gov/dds/about/dds-regions',
            final_url: 'https://portal.ct.gov/dds/about/dds-regions',
            verification_status: 'official_verified',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'DDS Regions now links a regional contact list PDF, a town finder, and regional help-routing surfaces from the live portal.',
          },
          {
            sample_name: 'Connecticut DDS Regional Contact List PDF',
            source_url: 'https://portal.ct.gov/-/media/DDS/Commissioner/Regional_Contact_List.pdf',
            final_url: 'https://portal.ct.gov/-/media/DDS/Commissioner/Regional_Contact_List.pdf',
            verification_status: 'source_listed',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Official PDF is live, but this bounded lane has not yet extracted county-grade office details from it.',
          },
          {
            sample_name: 'Connecticut DDS Town Finder archive',
            source_url: 'https://portal.ct.gov/dds/searchable-archive/general/regionstownfinder/townfinder1',
            final_url: 'https://portal.ct.gov/dds/searchable-archive/general/regionstownfinder/townfinder1',
            verification_status: 'source_listed',
            source_type: 'official',
            source_table: 'reviewed_live_probe',
            fetched_at: '2026-06-22T00:00:00.000Z',
            evidence_snippet: 'Town Finder is still reachable, but it remains an archive-era routing surface rather than extracted county office evidence.',
          },
        ],
      };
    }
    return row;
  });

  const updatedNextRows = nextRows.map((row) => {
    if (row.family === 'district_or_county_education_routing') {
      return {
        ...row,
        failure_code: 'public_edsight_shell_does_not_yield_anonymous_district_records',
        next_action: 'author_district_owned_exact_targets_or_browser_auth_edsight_query',
        evidence: EDUCATION_EVIDENCE,
      };
    }
    if (row.family === 'county_local_disability_resources') {
      return {
        ...row,
        failure_code: 'dds_regions_replacement_is_pdf_plus_archive_not_county_extracted',
        next_action: 'extract_dds_regions_pdf_or_archive_townfinder',
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
    primary_gap_reason: 'authenticated_public_edsight_directory_and_dds_pdf_archive_local_routing_are_the_last_connecticut_local_proof_blockers',
    final_blockers: [
      {
        family: 'district_or_county_education_routing',
        severity: 'critical',
        failure_code: 'public_edsight_shell_does_not_yield_anonymous_district_records',
        evidence: EDUCATION_EVIDENCE,
        next_action: 'author_district_owned_exact_targets_or_browser_auth_edsight_query',
      },
      {
        family: 'county_local_disability_resources',
        severity: 'critical',
        failure_code: 'dds_regions_replacement_is_pdf_plus_archive_not_county_extracted',
        evidence: COUNTY_EVIDENCE,
        next_action: 'extract_dds_regions_pdf_or_archive_townfinder',
      },
    ],
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJson(OUTPUTS.summary, {
    batch: 'batch_107_connecticut_local_proof_refresh_v1',
    generated_at: '2026-06-22T21:00:00.000Z',
    state: 'connecticut',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    completeness_pct: updatedSummary.completeness_pct,
    remaining_blockers: updatedSummary.final_blockers.map((row) => row.family),
    evidence_checks: {
      education: EDUCATION_EVIDENCE,
      countyLocal: COUNTY_EVIDENCE,
      pti: PTI_EVIDENCE,
    },
  });
  fs.writeFileSync(OUTPUTS.stateReport, buildReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows));
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Connecticut Local Proof Refresh Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- completeness_pct: ${updatedSummary.completeness_pct}`,
      '',
      '## Evidence checks',
      '',
      `- education: ${EDUCATION_EVIDENCE}`,
      `- county_local: ${COUNTY_EVIDENCE}`,
      `- pti_reference: ${PTI_EVIDENCE}`,
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch107ConnecticutLocalProofRefreshV1();
}
