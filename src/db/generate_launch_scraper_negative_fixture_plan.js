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

const jsonOutPath = path.join(docsDir, `launch-scraper-negative-fixture-plan-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-negative-fixture-plan-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const coveragePath = path.join(docsDir, `launch-scraper-fixture-coverage-audit-${generatedDate}.json`);
const qaPackPath = path.join(docsDir, `launch-scraper-qa-pack-${generatedDate}.json`);

if (!fs.existsSync(coveragePath)) {
  throw new Error(`Missing coverage audit: ${coveragePath}`);
}
if (!fs.existsSync(qaPackPath)) {
  throw new Error(`Missing QA pack: ${qaPackPath}`);
}

const coverage = readJson(coveragePath);
const qaPack = readJson(qaPackPath);
const qaByFamily = new Map((qaPack.familyQaPacks || []).map((pack) => [pack.family, pack]));

const planRows = (coverage.rows || [])
  .filter((row) => row.gap === 'missing_rejected_case')
  .map((row) => {
    const qa = qaByFamily.get(row.family) || {};
    const acceptedCase = qa.acceptedCase || null;
    const sourceUrl = acceptedCase?.sourceUrl || '';
    const savedPath = acceptedCase?.savedPath || '';

    let targetFailureShape = '';
    let suggestedWeakSignal = '';
    if (row.family === 'education_routing') {
      targetFailureShape = 'missing_basic_signal';
      suggestedWeakSignal = 'official or district-looking page with no phone, no email, and no credible routing link';
    } else if (row.family === 'knowledge_content') {
      targetFailureShape = 'knowledge_requires_high_trust_source or knowledge_summary_too_thin';
      suggestedWeakSignal = 'low-trust guidance page or trusted page with thin extractable summary';
    } else {
      targetFailureShape = 'family-specific validator failure';
      suggestedWeakSignal = 'page missing the family’s core acceptance signal';
    }

    return {
      family: row.family,
      currentCoverageClass: row.coverageClass,
      gap: row.gap,
      acceptedAnchorSourceUrl: sourceUrl,
      acceptedAnchorSavedPath: savedPath,
      targetFailureShape,
      suggestedWeakSignal,
      acquisitionStrategy: 'capture one real rejected saved page from a live run and add it to the QA pack selection pool',
      doneWhen: 'family has at least one real rejected replay case on disk and fixture coverage audit no longer marks missing_rejected_case',
    };
  });

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'Explicit plan for launch families that still lack real rejected replay fixtures.',
  rowCount: planRows.length,
  rows: planRows,
};

const mdLines = [
  '# Launch Scraper Negative Fixture Plan',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  `- rowCount: ${payload.rowCount}`,
  '',
];

for (const row of planRows) {
  mdLines.push(`## ${row.family}`);
  mdLines.push('');
  mdLines.push(`- currentCoverageClass: ${row.currentCoverageClass}`);
  mdLines.push(`- gap: ${row.gap}`);
  mdLines.push(`- acceptedAnchorSourceUrl: ${row.acceptedAnchorSourceUrl || 'none'}`);
  mdLines.push(`- acceptedAnchorSavedPath: ${row.acceptedAnchorSavedPath || 'none'}`);
  mdLines.push(`- targetFailureShape: ${row.targetFailureShape}`);
  mdLines.push(`- suggestedWeakSignal: ${row.suggestedWeakSignal}`);
  mdLines.push(`- acquisitionStrategy: ${row.acquisitionStrategy}`);
  mdLines.push(`- doneWhen: ${row.doneWhen}`);
  mdLines.push('');
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  rowCount: payload.rowCount,
}, null, 2));
