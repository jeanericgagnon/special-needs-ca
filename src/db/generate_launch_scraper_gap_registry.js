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

const jsonOutPath = path.join(docsDir, `launch-scraper-gap-registry-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-gap-registry-${generatedDate}.md`);

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

const readinessBoard = readJson('launch-scraper-readiness-board-');
const negativeClosure = readJson('launch-scraper-negative-fixture-closure-status-');
const stagingSupport = readJson('launch-scraper-staging-support-matrix-');

const closureByFamily = new Map((negativeClosure.rows || []).map((row) => [row.family, row]));
const stagingByFamily = new Map((stagingSupport.rows || []).map((row) => [row.family, row]));

function gapRow(row) {
  if (row.topSpecGap === 'missing_real_rejected_fixture') {
    const closure = closureByFamily.get(row.family);
    return {
      family: row.family,
      gapClass: 'missing_real_rejected_fixture',
      severity: 'spec_gap',
      currentState: row.readinessClass,
      evidence: `${row.family} fixture coverage is ${row.fixtureCoverageClass}; negative fixture closure is ${row.negativeFixtureClosureStatus}.`,
      nextArtifact: `docs/generated/launch-scraper-negative-fixture-closure-status-${generatedDate}.json`,
      nextCommand: 'npm run audit:launch-scraper-negative-fixture-closure-status',
      doneWhen: closure?.validatorCloseCondition || 'family has a real rejected replay case on disk',
    };
  }

  if (row.topSpecGap === 'no_staging_mapping') {
    const staging = stagingByFamily.get(row.family);
    return {
      family: row.family,
      gapClass: 'no_staging_mapping',
      severity: 'structural_gap',
      currentState: row.readinessClass,
      evidence: `${row.family} stageSupported=${staging?.stageSupported}; unsupportedReason=${staging?.unsupportedReason}.`,
      nextArtifact: `docs/generated/launch-scraper-staging-support-matrix-${generatedDate}.json`,
      nextCommand: 'npm run audit:launch-scraper-staging-support-matrix',
      doneWhen: 'family has a direct staging mapping or an explicit replacement staging contract',
    };
  }

  return null;
}

const rows = (readinessBoard.rows || [])
  .map(gapRow)
  .filter(Boolean);

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'Actionable registry for remaining launch scraper spec gaps, with one next artifact and one next command per gap.',
  rowCount: rows.length,
  rows,
};

const mdLines = [
  '# Launch Scraper Gap Registry',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  `- rowCount: ${payload.rowCount}`,
  '',
  '| family | gap class | severity | next artifact | next command |',
  '|---|---|---|---|---|',
];

for (const row of rows) {
  mdLines.push(`| ${row.family} | ${row.gapClass} | ${row.severity} | ${row.nextArtifact} | \`${row.nextCommand}\` |`);
}

for (const row of rows) {
  mdLines.push('', `## ${row.family}`, '');
  mdLines.push(`- gapClass: ${row.gapClass}`);
  mdLines.push(`- severity: ${row.severity}`);
  mdLines.push(`- currentState: ${row.currentState}`);
  mdLines.push(`- evidence: ${row.evidence}`);
  mdLines.push(`- nextArtifact: ${row.nextArtifact}`);
  mdLines.push(`- nextCommand: \`${row.nextCommand}\``);
  mdLines.push(`- doneWhen: ${row.doneWhen}`);
}
mdLines.push('');

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  rowCount: payload.rowCount,
}, null, 2));
