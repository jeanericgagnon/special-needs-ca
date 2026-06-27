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

const COUNTY_HINTS = {
  'el-dorado': {
    likelyAgency: 'El Dorado County Health and Human Services',
    preferredPathTerms: ['ihss', 'in-home-supportive-services', 'adult-services', 'social-services', 'health-human-services'],
  },
  'merced': {
    likelyAgency: 'Merced County Human Services Agency',
    preferredPathTerms: ['ihss', 'in-home-supportive-services', 'human-services', 'aging-adult-services', 'public-authority'],
  },
  'nevada': {
    likelyAgency: 'Nevada County Health and Human Services',
    preferredPathTerms: ['ihss', 'adult-social-services', 'health-human-services', 'public-authority', 'aging-disability'],
  },
  'san-luis-obispo': {
    likelyAgency: 'San Luis Obispo County Department of Social Services',
    preferredPathTerms: ['ihss', 'in-home-supportive-services', 'social-services', 'adult-services', 'public-authority'],
  },
  'sierra': {
    likelyAgency: 'Sierra County Human Services / Social Services',
    preferredPathTerms: ['ihss', 'social-services', 'human-services', 'adult-services', 'public-authority'],
  },
  'stanislaus': {
    likelyAgency: 'Stanislaus County Community Services Agency',
    preferredPathTerms: ['ihss', 'in-home-supportive-services', 'community-services-agency', 'adult-services', 'public-authority'],
  },
};

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
const ledgerRows = readNdjson(path.join(generatedDir, 'ca_county_office_repair_ledger_v1.jsonl'));

const queueRows = ledgerRows
  .filter((row) => row.blockerType === 'generic_homepage')
  .map((row, index) => {
    const hints = COUNTY_HINTS[row.countyId] || {
      likelyAgency: `${row.countyId} County social services / IHSS`,
      preferredPathTerms: ['ihss', 'social-services', 'human-services', 'adult-services'],
    };
    return {
      jobId: `ca_office_leaf_${String(index + 1).padStart(3, '0')}`,
      state: 'california',
      countyId: row.countyId,
      currentRecordId: row.recordId,
      currentRootUrl: row.finalUrl || row.sourceUrl,
      currentTitle: row.pageTitle,
      currentExtractedName: row.extractedName,
      blockerType: row.blockerType,
      blockerReason: row.blockerReason,
      nextLane: 'author_first',
      targetFamily: 'medicaid_hhs_offices',
      targetTable: 'county_offices',
      desiredProgramId: 'ihss-for-children',
      desiredEntityType: 'office',
      likelyAgency: hints.likelyAgency,
      requiredTerms: ['ihss', 'in-home supportive services'],
      supportingTerms: ['social services', 'human services', 'public authority', 'adult services'],
      prohibitedTerms: ['community news', 'spotlights', 'search our website', 'official website', 'aging services only'],
      preferredPathTerms: hints.preferredPathTerms,
      acceptanceRule: 'exact_county_ihss_or_social_services_leaf_with_phone_address_and_county_role',
      notes: 'Do not accept county homepage or generic department index. Require office-specific leaf with county/local contact semantics.',
    };
  });

const summary = {
  generatedAt: new Date().toISOString(),
  totalRows: queueRows.length,
  counties: queueRows.map((row) => row.countyId),
  byLikelyAgency: summarize(queueRows, 'likelyAgency'),
};

const jsonlPath = path.join(generatedDir, 'ca_county_office_leaf_repair_queue_v1.jsonl');
const jsonPath = path.join(generatedDir, 'ca_county_office_leaf_repair_summary_v1.json');
const mdPath = path.join(docsDir, 'ca-county-office-leaf-repair-queue-v1.md');

writeNdjson(jsonlPath, queueRows);
writeJson(jsonPath, summary);
fs.writeFileSync(
  mdPath,
  [
    '# California County Office Leaf Repair Queue v1',
    '',
    `- Total author-first rows: \`${summary.totalRows}\``,
    `- Counties: \`${summary.counties.join(', ')}\``,
    '',
    '## Likely Agencies',
    ...Object.entries(summary.byLikelyAgency).map(([label, count]) => `- ${label}: ${count}`),
    '',
  ].join('\n') + '\n',
);

console.log(JSON.stringify({ jsonlPath, jsonPath, mdPath, summary }, null, 2));
