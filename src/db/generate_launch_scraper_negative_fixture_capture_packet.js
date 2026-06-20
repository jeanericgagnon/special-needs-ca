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

const jsonOutPath = path.join(docsDir, `launch-scraper-negative-fixture-capture-packet-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-negative-fixture-capture-packet-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function requiredJson(name) {
  const filePath = path.join(docsDir, `${name}-${generatedDate}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required artifact: ${filePath}`);
  }
  return readJson(filePath);
}

const negativePlan = requiredJson('launch-scraper-negative-fixture-plan');
const qaPack = requiredJson('launch-scraper-qa-pack');
const coverage = requiredJson('launch-scraper-fixture-coverage-audit');

const qaByFamily = new Map((qaPack.familyQaPacks || []).map((pack) => [pack.family, pack]));
const coverageByFamily = new Map((coverage.rows || []).map((row) => [row.family, row]));

function familyWorkflow(row, qa) {
  if (row.family === 'education_routing') {
    return {
      boundedCaptureGoal: 'Capture one real rejected district or regional-routing page that looks official but lacks a usable phone, email, or routing link.',
      candidatePattern: 'Prefer a saved education-routing page from an existing run where parse succeeded but validator would reject for missing_basic_signal.',
      lanePolicy: 'Do not broaden the family. Use one exact saved page from an existing launch run first; only run a new bounded fetch if no rejected saved page exists on disk.',
      preferredCommands: [
        'npm run audit:launch-scraper-qa-pack',
        'npm run audit:launch-scraper-fixture-coverage-audit',
        'npm run test:launch-scraper-real-fixtures',
      ],
      validatorCloseCondition: 'A real rejected education_routing replay case exists on disk and carries a missing_basic_signal-style validation reason.',
    };
  }

  if (row.family === 'knowledge_content') {
    return {
      boundedCaptureGoal: 'Capture one real rejected knowledge page that fails for low trust or thin summary, without reopening deferred dead sources.',
      candidatePattern: 'Prefer a saved knowledge page from an existing run where parser extracted a title but validator rejected for trust or summary depth.',
      lanePolicy: 'Use existing saved pages first. If none exist, capture exactly one reviewed exact target from a high-signal launch topic bucket and stop after the first rejected real case.',
      preferredCommands: [
        'npm run audit:launch-scraper-qa-pack',
        'npm run audit:launch-scraper-fixture-coverage-audit',
        'npm run test:launch-scraper-real-fixtures',
      ],
      validatorCloseCondition: 'A real rejected knowledge_content replay case exists on disk and carries a knowledge_requires_high_trust_source- or knowledge_summary_too_thin-style validation reason.',
    };
  }

  return {
    boundedCaptureGoal: 'Capture one real rejected saved page for this family.',
    candidatePattern: 'Prefer an existing saved page that already shows the family failure shape.',
    lanePolicy: 'Use saved pages first; do not broaden the scrape lane.',
    preferredCommands: [
      'npm run audit:launch-scraper-qa-pack',
      'npm run audit:launch-scraper-fixture-coverage-audit',
      'npm run test:launch-scraper-real-fixtures',
    ],
    validatorCloseCondition: 'A real rejected replay case exists on disk for this family.',
  };
}

const rows = (negativePlan.rows || []).map((row, index) => {
  const qa = qaByFamily.get(row.family) || {};
  const familyCoverage = coverageByFamily.get(row.family) || {};
  const acceptedCase = qa.acceptedCase || null;
  const workflow = familyWorkflow(row, qa);

  return {
    priority: index + 1,
    family: row.family,
    gap: row.gap,
    currentCoverageClass: familyCoverage.coverageClass || row.currentCoverageClass || '',
    acceptedAnchorSourceUrl: acceptedCase?.sourceUrl || row.acceptedAnchorSourceUrl || '',
    acceptedAnchorSavedPath: acceptedCase?.savedPath || row.acceptedAnchorSavedPath || '',
    targetFailureShape: row.targetFailureShape,
    suggestedWeakSignal: row.suggestedWeakSignal,
    boundedCaptureGoal: workflow.boundedCaptureGoal,
    candidatePattern: workflow.candidatePattern,
    lanePolicy: workflow.lanePolicy,
    preferredCommands: workflow.preferredCommands,
    validatorCloseCondition: workflow.validatorCloseCondition,
    doneWhen: row.doneWhen,
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'Operator capture packet for the remaining launch families that still need one real rejected replay fixture on disk.',
  rowCount: rows.length,
  rows,
};

const mdLines = [
  '# Launch Scraper Negative Fixture Capture Packet',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  'This packet is intentionally narrow. It exists only to close the remaining real rejected replay gaps without reopening broad scrape work.',
  '',
  `- rowCount: ${payload.rowCount}`,
  '',
];

for (const row of rows) {
  mdLines.push(`## ${row.family}`);
  mdLines.push('');
  mdLines.push(`- priority: ${row.priority}`);
  mdLines.push(`- gap: ${row.gap}`);
  mdLines.push(`- currentCoverageClass: ${row.currentCoverageClass}`);
  mdLines.push(`- acceptedAnchorSourceUrl: ${row.acceptedAnchorSourceUrl || 'none'}`);
  mdLines.push(`- acceptedAnchorSavedPath: ${row.acceptedAnchorSavedPath || 'none'}`);
  mdLines.push(`- targetFailureShape: ${row.targetFailureShape}`);
  mdLines.push(`- suggestedWeakSignal: ${row.suggestedWeakSignal}`);
  mdLines.push(`- boundedCaptureGoal: ${row.boundedCaptureGoal}`);
  mdLines.push(`- candidatePattern: ${row.candidatePattern}`);
  mdLines.push(`- lanePolicy: ${row.lanePolicy}`);
  mdLines.push(`- validatorCloseCondition: ${row.validatorCloseCondition}`);
  mdLines.push(`- doneWhen: ${row.doneWhen}`);
  mdLines.push('- preferredCommands:');
  for (const command of row.preferredCommands) {
    mdLines.push(`  - ${command}`);
  }
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
