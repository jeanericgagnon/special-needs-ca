import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildPromotionCandidate } from '../../scripts/source-acquisition-stage-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `launch-scraper-staging-support-matrix-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-staging-support-matrix-${generatedDate}.md`);

function readJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated input for prefix "${prefix}"`);
  }
  const filePath = path.join(docsDir, matches.at(-1));
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function makeRecord(family, targetTable) {
  const base = {
    recordId: `sample|${family}|record`,
    parsedAt: `${generatedDate}T00:00:00.000Z`,
    stateId: 'sample-state',
    countyId: 'sample-county',
    gapFamily: family,
    targetTable,
    sourceName: 'Sample Source',
    sourceUrl: `https://example.org/${family}`,
    finalUrl: `https://example.org/${family}`,
    pageTitle: `Sample ${family} page`,
    h1s: [`Sample ${family}`],
    phones: ['(800) 555-1212'],
    emails: ['info@example.org'],
    addressLines: ['123 Main St'],
    textSample: `Sample text for ${family}`,
    familyExtraction: {},
  };

  if (family === 'dd_routing') {
    base.familyExtraction = { officeName: 'Sample DD Agency', contactPhone: '(800) 555-1212' };
  } else if (family === 'programs_benefits' || family === 'waivers' || family === 'program_waitlists') {
    base.familyExtraction = { programName: `Sample ${family} program` };
  } else if (family === 'forms_guides') {
    base.familyExtraction = { programName: 'Sample forms program', officialDownloadUrl: 'https://example.org/form.pdf' };
  } else if (family === 'medicaid_hhs_offices') {
    base.familyExtraction = { officeName: 'Sample Office', contactPhone: '(800) 555-1212', contactAddress: '123 Main St' };
  } else if (family === 'education_routing') {
    base.familyExtraction = { officeName: 'Sample Education Routing', contactPhone: '(800) 555-1212', contactEmail: 'sped@example.org', countyId: 'sample-county' };
  } else if (family === 'providers_care') {
    base.familyExtraction = { organizationName: 'Sample Provider', contactPhone: '(800) 555-1212', contactEmail: 'care@example.org', contactAddress: '123 Main St' };
  } else if (family === 'knowledge_content') {
    base.familyExtraction = { articleTitle: 'Sample Article', canonicalKnowledgeUrl: 'https://example.org/article', summaryText: 'Sample summary text for launch knowledge content.' };
  }

  return base;
}

const lifecycle = readJson('launch-scraper-lifecycle-contract-');
const provenance = readJson('launch-scraper-provenance-contract-');
const runbook = readJson('launch-scraper-runbook-');

const provenanceByFamily = new Map((provenance.familyContracts || []).map((row) => [row.family, row]));
const runbookByFamily = new Map((runbook.familyRunbooks || []).map((row) => [row.family, row]));

const targetTableByFamily = {
  dd_routing: 'state_resource_agencies',
  programs_benefits: 'programs',
  waivers: 'programs',
  forms_guides: 'forms_and_guides',
  program_waitlists: 'program_waitlists',
  medicaid_hhs_offices: 'county_offices',
  education_routing: 'regional_education_agencies',
  providers_care: 'resource_providers',
  knowledge_content: 'knowledge_content',
};

const rows = (lifecycle.familyLifecycles || []).map((row) => {
  const family = row.family;
  const provenanceRow = provenanceByFamily.get(family) || {};
  const runbookRow = runbookByFamily.get(family) || {};
  const candidate = buildPromotionCandidate(makeRecord(family, targetTableByFamily[family]));

  return {
    family,
    stageSupported: Boolean(candidate.supported),
    stagingTable: candidate.stagingTable || provenanceRow.stagingTable || null,
    targetTable: candidate.targetTable || targetTableByFamily[family] || null,
    unsupportedReason: candidate.supported ? null : (candidate.reason || 'no_staging_mapping_for_family'),
    stageProceedRule: row.lifecycleStages.find((stage) => stage.stage === 'stage')?.proceedWhen || '',
    stageStopRule: row.lifecycleStages.find((stage) => stage.stage === 'stage')?.stopWhen || '',
    recommendedRunMode: row.recommendedRunMode,
    compactAcceptanceSignals: runbookRow.compactAcceptanceSignals || [],
    truthFieldsThatMustSurvive: provenanceRow.truthFieldsThatMustSurvive || [],
    stageSpecificFields: provenanceRow.stageSpecificFields || [],
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'Launch-family staging support matrix so it is explicit which families can stage, where they stage, and why unsupported families stop.',
  supportedFamilyCount: rows.filter((row) => row.stageSupported).length,
  unsupportedFamilyCount: rows.filter((row) => !row.stageSupported).length,
  rows,
};

const mdLines = [
  '# Launch Scraper Staging Support Matrix',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  `- supportedFamilyCount: ${payload.supportedFamilyCount}`,
  `- unsupportedFamilyCount: ${payload.unsupportedFamilyCount}`,
  '',
  '## Matrix',
  '',
  '| family | supported | staging table | target table | unsupported reason |',
  '|---|---|---|---|---|',
];

for (const row of rows) {
  mdLines.push(`| ${row.family} | ${row.stageSupported} | ${row.stagingTable || ''} | ${row.targetTable || ''} | ${row.unsupportedReason || ''} |`);
}

for (const row of rows) {
  mdLines.push('', `## ${row.family}`, '');
  mdLines.push(`- stageSupported: ${row.stageSupported}`);
  mdLines.push(`- stagingTable: ${row.stagingTable || 'none'}`);
  mdLines.push(`- targetTable: ${row.targetTable || 'none'}`);
  mdLines.push(`- unsupportedReason: ${row.unsupportedReason || 'none'}`);
  mdLines.push(`- recommendedRunMode: ${row.recommendedRunMode}`);
  mdLines.push(`- stageProceedRule: ${row.stageProceedRule}`);
  mdLines.push(`- stageStopRule: ${row.stageStopRule}`);
  mdLines.push(`- compactAcceptanceSignals: ${row.compactAcceptanceSignals.join(', ') || 'none'}`);
  mdLines.push(`- truthFieldsThatMustSurvive: ${row.truthFieldsThatMustSurvive.join(', ') || 'none'}`);
  mdLines.push(`- stageSpecificFields: ${row.stageSpecificFields.join(', ') || 'none'}`);
}
mdLines.push('');

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  supportedFamilyCount: payload.supportedFamilyCount,
  unsupportedFamilyCount: payload.unsupportedFamilyCount,
}, null, 2));
