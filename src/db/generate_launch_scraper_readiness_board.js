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

const jsonOutPath = path.join(docsDir, `launch-scraper-readiness-board-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-readiness-board-${generatedDate}.md`);

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

const contract = readJson('launch-scraper-contract-');
const fixtureCoverage = readJson('launch-scraper-fixture-coverage-audit-');
const lifecycle = readJson('launch-scraper-lifecycle-contract-');
const stagingSupport = readJson('launch-scraper-staging-support-matrix-');
const negativeClosure = readJson('launch-scraper-negative-fixture-closure-status-');

const fixtureByFamily = new Map((fixtureCoverage.rows || []).map((row) => [row.family, row]));
const lifecycleByFamily = new Map((lifecycle.familyLifecycles || []).map((row) => [row.family, row]));
const stagingByFamily = new Map((stagingSupport.rows || []).map((row) => [row.family, row]));
const closureByFamily = new Map((negativeClosure.rows || []).map((row) => [row.family, row]));

function readinessClass(row) {
  const queueReady = row.readyTargetScrape > 0;
  const hasRejectedGap = row.fixtureGap === 'missing_rejected_case';
  const stageBlocked = !row.stageSupported;

  if (queueReady && !hasRejectedGap && !stageBlocked) return 'fully_specified_ready';
  if (queueReady && (hasRejectedGap || stageBlocked)) return 'ready_with_spec_gap';
  if (!queueReady && !hasRejectedGap && !stageBlocked) return 'not_queue_ready_but_specified';
  return 'not_queue_ready_with_spec_gap';
}

const rows = (contract.familyContracts || []).map((family) => {
  const fixture = fixtureByFamily.get(family.family) || {};
  const lifecycleRow = lifecycleByFamily.get(family.family) || {};
  const stagingRow = stagingByFamily.get(family.family) || {};
  const closureRow = closureByFamily.get(family.family) || null;

  const row = {
    family: family.family,
    readyTargetScrape: family.currentCounts.readyTargetScrape,
    authorFirst: family.currentCounts.authorFirst,
    repairFirst: family.currentCounts.repairFirst,
    deferredBlockedSource: family.currentCounts.deferredBlockedSource,
    recommendedRunMode: lifecycleRow.recommendedRunMode || '',
    startQueueClass: lifecycleRow.startQueueClass || '',
    fixtureCoverageClass: fixture.coverageClass || 'unknown',
    fixtureGap: fixture.gap || '',
    negativeFixtureClosureStatus: closureRow?.closureStatus || 'not_applicable',
    stageSupported: Boolean(stagingRow.stageSupported),
    stagingTable: stagingRow.stagingTable || null,
    topSpecGap: closureRow?.closureStatus === 'open'
      ? 'missing_real_rejected_fixture'
      : !stagingRow.stageSupported
        ? 'no_staging_mapping'
        : family.currentCounts.readyTargetScrape === 0
          ? 'no_ready_target_scrape_queue'
          : '',
  };

  row.readinessClass = readinessClass(row);
  return row;
});

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'Family-by-family readiness board for the launch scraper spec, combining queue state, fixture coverage, lifecycle entry, staging support, and remaining spec gaps.',
  summary: {
    familyCount: rows.length,
    fullySpecifiedReady: rows.filter((row) => row.readinessClass === 'fully_specified_ready').length,
    readyWithSpecGap: rows.filter((row) => row.readinessClass === 'ready_with_spec_gap').length,
    notQueueReadyButSpecified: rows.filter((row) => row.readinessClass === 'not_queue_ready_but_specified').length,
    notQueueReadyWithSpecGap: rows.filter((row) => row.readinessClass === 'not_queue_ready_with_spec_gap').length,
  },
  rows,
};

const mdLines = [
  '# Launch Scraper Readiness Board',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Summary',
  '',
  `- familyCount: ${payload.summary.familyCount}`,
  `- fullySpecifiedReady: ${payload.summary.fullySpecifiedReady}`,
  `- readyWithSpecGap: ${payload.summary.readyWithSpecGap}`,
  `- notQueueReadyButSpecified: ${payload.summary.notQueueReadyButSpecified}`,
  `- notQueueReadyWithSpecGap: ${payload.summary.notQueueReadyWithSpecGap}`,
  '',
  '## Board',
  '',
  '| family | readiness class | ready | author | repair | fixture coverage | stage supported | top spec gap |',
  '|---|---|---:|---:|---:|---|---|---|',
];

for (const row of rows) {
  mdLines.push(`| ${row.family} | ${row.readinessClass} | ${row.readyTargetScrape} | ${row.authorFirst} | ${row.repairFirst} | ${row.fixtureCoverageClass} | ${row.stageSupported} | ${row.topSpecGap || ''} |`);
}

for (const row of rows) {
  mdLines.push('', `## ${row.family}`, '');
  mdLines.push(`- readinessClass: ${row.readinessClass}`);
  mdLines.push(`- readyTargetScrape: ${row.readyTargetScrape}`);
  mdLines.push(`- authorFirst: ${row.authorFirst}`);
  mdLines.push(`- repairFirst: ${row.repairFirst}`);
  mdLines.push(`- deferredBlockedSource: ${row.deferredBlockedSource}`);
  mdLines.push(`- recommendedRunMode: ${row.recommendedRunMode}`);
  mdLines.push(`- startQueueClass: ${row.startQueueClass}`);
  mdLines.push(`- fixtureCoverageClass: ${row.fixtureCoverageClass}`);
  mdLines.push(`- fixtureGap: ${row.fixtureGap || 'none'}`);
  mdLines.push(`- negativeFixtureClosureStatus: ${row.negativeFixtureClosureStatus}`);
  mdLines.push(`- stageSupported: ${row.stageSupported}`);
  mdLines.push(`- stagingTable: ${row.stagingTable || 'none'}`);
  mdLines.push(`- topSpecGap: ${row.topSpecGap || 'none'}`);
}
mdLines.push('');

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  summary: payload.summary,
}, null, 2));
