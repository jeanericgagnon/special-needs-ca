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

const jsonOutPath = path.join(docsDir, `launch-scraper-negative-fixture-closure-status-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-negative-fixture-closure-status-${generatedDate}.md`);

function readJson(name) {
  const filePath = path.join(docsDir, `${name}-${generatedDate}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required artifact: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const coverage = readJson('launch-scraper-fixture-coverage-audit');
const negativePlan = readJson('launch-scraper-negative-fixture-plan');
const capturePacket = readJson('launch-scraper-negative-fixture-capture-packet');
const qaPack = readJson('launch-scraper-qa-pack');

const planByFamily = new Map((negativePlan.rows || []).map((row) => [row.family, row]));
const packetByFamily = new Map((capturePacket.rows || []).map((row) => [row.family, row]));
const qaByFamily = new Map((qaPack.familyQaPacks || []).map((row) => [row.family, row]));

const rows = (coverage.rows || [])
  .filter((row) => row.gap === 'missing_rejected_case')
  .map((row) => {
    const planRow = planByFamily.get(row.family) || {};
    const packetRow = packetByFamily.get(row.family) || {};
    const qaRow = qaByFamily.get(row.family) || {};
    const hasRejectedCase = Boolean(qaRow.hasRealRejectedCase);
    const closureStatus = hasRejectedCase ? 'closed' : 'open';

    return {
      family: row.family,
      closureStatus,
      currentCoverageClass: row.coverageClass,
      gap: row.gap,
      targetFailureShape: planRow.targetFailureShape || '',
      acceptedAnchorSourceUrl: planRow.acceptedAnchorSourceUrl || '',
      acceptedAnchorSavedPath: planRow.acceptedAnchorSavedPath || '',
      nextAction: hasRejectedCase
        ? 'none_required'
        : 'capture_real_rejected_fixture_from_saved_or_next_bounded_run',
      validatorCloseCondition: packetRow.validatorCloseCondition || '',
      nextCommands: packetRow.preferredCommands || [],
      doneWhen: planRow.doneWhen || '',
      evidence: {
        hasRealAcceptedCase: Boolean(qaRow.hasRealAcceptedCase),
        hasRealRejectedCase: hasRejectedCase,
      },
    };
  });

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'Closure-status tracker for the remaining launch scraper negative-fixture gaps.',
  openCount: rows.filter((row) => row.closureStatus === 'open').length,
  closedCount: rows.filter((row) => row.closureStatus === 'closed').length,
  rows,
};

const mdLines = [
  '# Launch Scraper Negative Fixture Closure Status',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  `- openCount: ${payload.openCount}`,
  `- closedCount: ${payload.closedCount}`,
  '',
  '## Closure Table',
  '',
  '| family | status | target failure shape | next action | close condition |',
  '|---|---|---|---|---|',
];

for (const row of rows) {
  mdLines.push(`| ${row.family} | ${row.closureStatus} | ${row.targetFailureShape} | ${row.nextAction} | ${row.validatorCloseCondition} |`);
}

for (const row of rows) {
  mdLines.push('', `## ${row.family}`, '');
  mdLines.push(`- closureStatus: ${row.closureStatus}`);
  mdLines.push(`- currentCoverageClass: ${row.currentCoverageClass}`);
  mdLines.push(`- gap: ${row.gap}`);
  mdLines.push(`- targetFailureShape: ${row.targetFailureShape}`);
  mdLines.push(`- acceptedAnchorSourceUrl: ${row.acceptedAnchorSourceUrl || 'none'}`);
  mdLines.push(`- acceptedAnchorSavedPath: ${row.acceptedAnchorSavedPath || 'none'}`);
  mdLines.push(`- nextAction: ${row.nextAction}`);
  mdLines.push(`- validatorCloseCondition: ${row.validatorCloseCondition}`);
  mdLines.push(`- doneWhen: ${row.doneWhen}`);
  mdLines.push(`- evidence.hasRealAcceptedCase: ${row.evidence.hasRealAcceptedCase}`);
  mdLines.push(`- evidence.hasRealRejectedCase: ${row.evidence.hasRealRejectedCase}`);
  mdLines.push('- nextCommands:');
  for (const command of row.nextCommands) {
    mdLines.push(`  - ${command}`);
  }
}
mdLines.push('');

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  openCount: payload.openCount,
  closedCount: payload.closedCount,
}, null, 2));
