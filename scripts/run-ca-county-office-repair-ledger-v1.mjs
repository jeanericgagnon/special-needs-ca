import fs from 'node:fs';
import path from 'node:path';

function readNdjson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

function writeNdjson(filePath, rows) {
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function slugFromRecordId(recordId) {
  const entity = String(recordId || '').split('|')[2] || '';
  return entity.startsWith('county-ihss-') ? entity.replace(/^county-ihss-/, '') : entity;
}

function classifyPattern(row) {
  const title = String(row.pageTitle || row.h1s?.[0] || '').toLowerCase();
  const text = String(row.textSample || '').toLowerCase();
  const finalUrl = String(row.finalUrl || row.sourceUrl || '').toLowerCase();
  const sourceRole = String(row.sourceRole || '').toLowerCase();

  if (/parent_training_information_and_family_empowerment_directory/.test(sourceRole)) {
    return {
      blockerType: 'wrong_family_source',
      blockerReason: 'parent_training_directory_not_county_office',
      nextAction: 'move_to_parent_training_or_pti_lane',
    };
  }

  if (/aging services/.test(title) || /support for our aging community/.test(String(row.h1s?.[0] || '').toLowerCase())) {
    return {
      blockerType: 'aging_only_page',
      blockerReason: 'aging_services_page_not_disability_office',
      nextAction: 'author_exact_ihss_or_human_services_leaf',
    };
  }

  if (/public authority/.test(title) || /in-home supportive services/.test(text) || /provider application/.test(text)) {
    return {
      blockerType: 'likely_repairable_leaf',
      blockerReason: 'ihss_signals_present_but_not_yet_promoted',
      nextAction: 'review_for_exact_office_leaf_and_contact_role',
    };
  }

  if (/official website|county of|county, ca|^home\b/.test(title) || /search our website|community news|county spotlights|csa main/.test(title) || /\/home$/.test(finalUrl)) {
    return {
      blockerType: 'generic_homepage',
      blockerReason: 'generic_county_homepage_not_office',
      nextAction: 'author_exact_social_services_or_ihss_leaf',
    };
  }

  return {
    blockerType: 'generic_needs_repair',
    blockerReason: 'county_office_not_public_safe',
    nextAction: 'review_exact_leaf_target',
  };
}

function summarize(rows, key) {
  return rows.reduce((acc, row) => {
    const bucket = String(row[key] || 'unknown');
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

const repoRoot = process.cwd();
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');

const acceptedRows = readNdjson(path.join(repoRoot, 'data', 'source-acquisition-runs', 'ca-v3', 'validated', 'medicaid_hhs_offices', 'accepted.ndjson'));
const stagedRows = readNdjson(path.join(repoRoot, 'data', 'source-acquisition-runs', 'ca-v3', 'staged', 'medicaid_hhs_offices', 'promotion-candidates.ndjson'));
const publishDecisionRows = readNdjson(path.join(repoRoot, 'data', 'generated', 'ca_publish_decisions_v1.jsonl'))
  .filter((row) => row.family === 'medicaid_hhs_offices');

const stagedById = new Map(stagedRows.map((row) => [row.recordId, row]));
const publishDecisionById = new Map(publishDecisionRows.map((row) => [row.recordId, row]));

const ledgerRows = acceptedRows.map((row) => {
  const staged = stagedById.get(row.recordId);
  const publishDecision = publishDecisionById.get(row.recordId);
  const displayStatus = String(
    publishDecision?.displayStatusDecision
    || staged?.candidate?.row?.display_status
    || 'needs_review'
  );
  const extractedName = staged?.candidate?.row?.extracted_name || row.h1s?.[0] || row.pageTitle || '';
  const pattern = classifyPattern(row);
  return {
    recordId: row.recordId,
    countyId: slugFromRecordId(row.recordId),
    sourceRole: row.sourceRole,
    sourceUrl: row.sourceUrl,
    finalUrl: row.finalUrl,
    pageTitle: row.pageTitle,
    extractedName,
    displayStatus,
    programId: staged?.candidate?.row?.program_id || '',
    blockerType: displayStatus === 'published' ? 'cleared' : pattern.blockerType,
    blockerReason: displayStatus === 'published' ? 'public_safe_county_office' : pattern.blockerReason,
    nextAction: displayStatus === 'published' ? 'none' : pattern.nextAction,
    phones: row.phones || [],
    address: row.addressLines?.[0] || '',
    textSample: row.textSample || '',
  };
});

const summary = {
  generatedAt: new Date().toISOString(),
  totalRows: ledgerRows.length,
  publishedRows: ledgerRows.filter((row) => row.displayStatus === 'published').length,
  needsReviewRows: ledgerRows.filter((row) => row.displayStatus !== 'published').length,
  byBlockerType: summarize(ledgerRows.filter((row) => row.displayStatus !== 'published'), 'blockerType'),
  byNextAction: summarize(ledgerRows.filter((row) => row.displayStatus !== 'published'), 'nextAction'),
};

const jsonlPath = path.join(generatedDir, 'ca_county_office_repair_ledger_v1.jsonl');
const jsonPath = path.join(generatedDir, 'ca_county_office_repair_summary_v1.json');
const mdPath = path.join(docsDir, 'ca-county-office-repair-ledger-v1.md');

writeNdjson(jsonlPath, ledgerRows);
writeJson(jsonPath, summary);
fs.writeFileSync(
  mdPath,
  [
    '# California County Office Repair Ledger v1',
    '',
    `- Total rows: \`${summary.totalRows}\``,
    `- Published rows: \`${summary.publishedRows}\``,
    `- Needs review rows: \`${summary.needsReviewRows}\``,
    '',
    '## Blocker Types',
    ...Object.entries(summary.byBlockerType).map(([label, count]) => `- ${label}: ${count}`),
    '',
    '## Next Actions',
    ...Object.entries(summary.byNextAction).map(([label, count]) => `- ${label}: ${count}`),
    '',
  ].join('\n') + '\n',
);

console.log(JSON.stringify({ jsonlPath, jsonPath, mdPath, summary }, null, 2));
