import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const briefsPath = path.join(docsDir, `provider-placeholder-authoring-briefs-${generatedDate}.json`);
const jsonOutPath = path.join(docsDir, `provider-placeholder-replacement-decision-template-${generatedDate}.json`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const briefsPayload = readJson(briefsPath);
const briefs = briefsPayload.briefs || [];

const payload = {
  generatedAt: generatedDate,
  sourceBriefs: path.relative(repoRoot, briefsPath),
  instructions: {
    allowedMode: ['replace_placeholder_with_authored_targets'],
    requiredTopLevelFields: ['stateId', 'placeholderSourceUrls', 'decisionMode', 'reviewedBy', 'replacements'],
    requiredReplacementFields: ['source_name', 'source_url', 'organization_type', 'crawl_method', 'notes'],
    rules: [
      'Provide 2-5 named first-party provider replacements per state batch.',
      'Use target_table=resource_providers for all replacements.',
      'Do not keep generic or national placeholder domains.',
      'Do not use aggregator or directory pages as direct replacements.',
      'Use first-party hospital, university clinic, or specialty center pages whenever possible.',
    ],
  },
  rows: briefs.map((brief) => ({
    stateId: brief.stateId,
    stateName: brief.stateName,
    sourceTargetsPath: brief.sourceTargetsPath,
    placeholderSourceNames: (brief.placeholderTargets || []).map((item) => item.placeholderSourceName),
    placeholderSourceUrls: (brief.placeholderTargets || []).map((item) => item.placeholderSourceUrl),
    decisionMode: 'replace_placeholder_with_authored_targets',
    reviewedBy: '',
    reviewNotes: '',
    replacements: [],
  })),
};

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  template: jsonOutPath,
  rows: payload.rows.length,
}, null, 2));
