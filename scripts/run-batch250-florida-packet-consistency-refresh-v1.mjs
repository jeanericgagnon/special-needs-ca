import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'florida_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'florida_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'florida_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'florida_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'florida_next_action_queue_v2.jsonl'),
  countyPacket: path.join(generatedDir, 'florida_county_local_disability_resources_leaf_authoring_packet_v1.json'),
};

const OUTPUTS = {
  batchSummary: path.join(generatedDir, 'batch250_florida_packet_consistency_refresh_summary_v1.json'),
  batchReport: path.join(docsGeneratedDir, 'batch250-florida-packet-consistency-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'florida-california-grade-audit-report-v2.md'),
};

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

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows) {
  return [
    '# Florida California-Grade Audit Report v2',
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
    '- Florida remains BLOCKED and not index-safe.',
    '- The public county-complete DCF contacts.csv is still the wrong service role for county-local disability routing.',
    '- The live official sitemap now closes the discovery loop: the public-assistance tree exposes statewide guidance leaves but no county office directory, no service-center leaf, and no county ESS office page.',
    '- The public MyACCESS county-result lanes remain shell-only or authenticated-only under bounded anonymous probes.',
    '- Florida should only reopen county-local once a first-party public county office leaf appears in the public-assistance tree or an anonymous MyACCESS county-result contract exists.',
  ].join('\n') + '\n';
}

export function generateBatch250FloridaPacketConsistencyRefreshV1() {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);
  const countyPacket = readJson(INPUTS.countyPacket);

  const updatedCountyPacket = {
    ...countyPacket,
    purpose: 'Deterministic evidence packet for Florida county-local routing while county-complete public DCF contacts exist only as a wrong-role general service directory, sitemap-advertised circuit leaves are dead, and the MyACCESS county-result lane stays shell-only or authenticated-only.',
    current_problem_metrics: {
      ...countyPacket.current_problem_metrics,
      deadCircuitLeavesAdvertisedInSitemap: true,
      deadCircuitLeavesLive404: true,
      shellOnlyPublicRoutes: 2,
      publicAssistanceSitemapEnumerated: true,
    },
    representative_sources: [
      'https://familyresourcecenter.myflfamilies.com/',
      'https://familyresourcecenter.myflfamilies.com/providers.csv',
      'https://www.myflfamilies.com/contact-us',
      'https://www.myflfamilies.com/contact-us/contacts.csv',
      'https://www.myflfamilies.com/services/public-assistance',
      'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance',
      'https://www.myflfamilies.com/services/public-assistance/economic-self-sufficiency-frequently-asked-questions/',
      'https://www.myflfamilies.com/services/public-assistance/additional-resources-and-services/community/',
      'https://www.myflfamilies.com/sitemap.xml',
      'https://myaccess.myflfamilies.com/Public/CPCPS',
      'https://myaccess.myflfamilies.com/Help/HCINT',
      'https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails',
      'https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch',
      'https://myaccess.myflfamilies.com/config/appconfig.js',
    ],
    root_domains_to_review: [
      'reviewable anonymous public Florida DCF or MyACCESS public-assistance county contracts only',
      'do not treat county-complete general DCF contact rows or source_listed staging partner rows as ACCESS or Medicaid office evidence',
      'do not reopen sitemap-advertised circuit leaves once they are confirmed live 404s',
      'treat Public/CPCPS and Help/HCINT as one shell lane unless the returned HTML meaningfully diverges',
    ],
    packet_complete_when: 'Florida can reopen only when a first-party public-assistance county dataset or other public office contract truthfully covers the remaining 33 storefront-gap counties, or when MyACCESS county-result endpoints become anonymously reviewable. Dead sitemap circuit leaves, shell-only public routes, and wrong-role county-complete contacts do not satisfy the family.',
  };

  writeJson(INPUTS.countyPacket, updatedCountyPacket);
  fs.writeFileSync(OUTPUTS.stateReport, buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows));

  const batchSummary = {
    batch: 'batch250_florida_packet_consistency_refresh_v1',
    generated_at: '2026-06-23T00:00:00.000Z',
    state: 'florida',
    classification: summary.classification,
    index_safe: summary.index_safe,
    shellOnlyPublicRoutes: updatedCountyPacket.current_problem_metrics.shellOnlyPublicRoutes,
    deadCircuitLeavesLive404: updatedCountyPacket.current_problem_metrics.deadCircuitLeavesLive404,
    representativeSourceCount: updatedCountyPacket.representative_sources.length,
  };
  writeJson(OUTPUTS.batchSummary, batchSummary);

  const batchReport = [
    '# Batch 250 Florida Packet Consistency Refresh Report v1',
    '',
    '- classification: BLOCKED',
    '- index_safe: false',
    '- family updated: county_local_disability_resources',
    '',
    '## What changed',
    '',
    '- Refreshed the Florida county-local packet so it now preserves the current blocker contract: county-complete but wrong-role contacts, dead sitemap-advertised circuit leaves, two shell-only public routes, and two authenticated-only county-result endpoints.',
    '- Rebuilt the state report from the current live ledgers so the verified-source status line matches the actual blocker family status again.',
    '',
    '## Result',
    '',
    '- Florida remains BLOCKED and index_safe=false.',
    '- The packet is now aligned with the live blocker evidence and should not reopen on stale circuit-leaf or Help/HCINT assumptions.',
  ].join('\n') + '\n';

  fs.writeFileSync(OUTPUTS.batchReport, batchReport);
  return batchSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateBatch250FloridaPacketConsistencyRefreshV1();
}
