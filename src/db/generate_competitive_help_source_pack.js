import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const sourcePacksDir = path.join(repoRoot, 'data', 'source_packs');
const generatedDate = new Date().toISOString().slice(0, 10);

const authoredTargetsPath = path.join(docsDir, `authored-missing-source-targets-${generatedDate}.json`);
const jsonOutPath = path.join(sourcePacksDir, 'competitive_help.json');
const mdOutPath = path.join(docsDir, `competitive-help-source-pack-${generatedDate}.md`);

const COMPETITIVE_GAP_FAMILIES = new Set([
  'housing',
  'goods_supplies',
  'jobs_vocational',
  'legal_aid',
  'transport_utilities_food',
  'care_independent_living',
  'knowledge_content',
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

const authored = readJson(authoredTargetsPath);
const targets = (authored.targets || []).filter((row) => COMPETITIVE_GAP_FAMILIES.has(row.gapFamily));

const payload = {
  packId: 'competitive_help',
  generatedAt: generatedDate,
  sourceArtifact: path.relative(repoRoot, authoredTargetsPath),
  gapFamilies: [...COMPETITIVE_GAP_FAMILIES],
  summary: {
    totalTargets: targets.length,
    byGapFamily: countBy(targets, 'gapFamily'),
    byStatus: countBy(targets, 'ledgerStatus'),
    byState: countBy(targets, 'stateId'),
  },
  targets,
};

fs.mkdirSync(sourcePacksDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);

const mdLines = [
  '# Competitive Help Source Pack',
  '',
  `Generated: ${generatedDate}`,
  '',
  'This artifact promotes the competitive-help authored targets into a first-class deterministic source pack.',
  '',
  'Covered families:',
  '',
  '- housing',
  '- goods/supplies',
  '- jobs/vocational',
  '- legal aid',
  '- transport/utilities/food',
  '- care/independent living',
  '- knowledge content',
  '',
  '## Summary',
  '',
  `- total targets: ${payload.summary.totalTargets}`,
  '',
  '### By Gap Family',
  '',
];

for (const [gapFamily, count] of Object.entries(payload.summary.byGapFamily).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${gapFamily}: ${count}`);
}

mdLines.push('', '### By Status', '');
for (const [status, count] of Object.entries(payload.summary.byStatus).sort((a, b) => b[1] - a[1])) {
  mdLines.push(`- ${status}: ${count}`);
}

mdLines.push('', '## Representative Targets', '');
for (const row of targets.slice(0, 25)) {
  mdLines.push(`- ${row.stateId}: ${row.sourceName} -> ${row.sourceUrl} (${row.gapFamily}; ${row.ledgerStatus})`);
}

mdLines.push('', '## Files', '');
mdLines.push(`- JSON pack: ${path.relative(repoRoot, jsonOutPath)}`);
mdLines.push(`- Source artifact: ${path.relative(repoRoot, authoredTargetsPath)}`);

fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  sourcePack: jsonOutPath,
  markdown: mdOutPath,
  totalTargets: payload.summary.totalTargets,
  byGapFamily: payload.summary.byGapFamily,
}, null, 2));
