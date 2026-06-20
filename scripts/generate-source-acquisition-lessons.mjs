import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const outputRoot = path.join(repoRoot, 'data', 'source-acquisition-runs');
const generatedDocsDir = path.join(repoRoot, 'docs', 'generated');

function parseArgs(argv) {
  const args = {
    runId: '',
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'run-id' && value) args.runId = value;
  }

  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function getLatestRunId() {
  const entries = fs.readdirSync(outputRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();
  return entries[0] || '';
}

function renderTopCounts(title, items, fallback = '_None_') {
  const lines = [`## ${title}`, ''];
  if (!items.length) {
    lines.push(fallback, '');
    return lines.join('\n');
  }
  for (const item of items) {
    lines.push(`- ${item.label}: ${item.count}`);
  }
  lines.push('');
  return lines.join('\n');
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

const args = parseArgs(process.argv.slice(2));
const runId = args.runId || getLatestRunId();

if (!runId) {
  throw new Error('No source acquisition run found.');
}

const runDir = path.join(outputRoot, runId);
const summaryPath = path.join(runDir, 'summary.json');
const followupSummaryPath = path.join(runDir, 'followups', 'followup-summary.json');

if (!fs.existsSync(summaryPath)) {
  throw new Error(`Missing summary: ${summaryPath}`);
}

if (!fs.existsSync(followupSummaryPath)) {
  throw new Error(`Missing followup summary: ${followupSummaryPath}`);
}

ensureDir(generatedDocsDir);

const summary = readJson(summaryPath);
const followup = readJson(followupSummaryPath);
const lessonsPath = path.join(runDir, 'lessons-learned.md');
const generatedPath = path.join(generatedDocsDir, `source-acquisition-lessons-${runId}.md`);

const selectedCount = Number(summary.selectedCount || 0);
const succeeded = Number(summary.succeeded || 0);
const failed = Number(summary.failed || 0);
const successRate = selectedCount > 0 ? ((succeeded / selectedCount) * 100).toFixed(1) : '0.0';
const highSignal = Number(followup.parseReadyHighSignalCount || 0);
const suspect = Number(followup.parseReadySuspectCount || 0);
const retryable = Number(followup.retryableCount || 0);
const blocked = Number(followup.blockedCount || 0);
const repair = Number(followup.sourceRepairCount || 0);

const topHighSignalDomains = asArray(followup.topParseReadyHighSignalDomains).slice(0, 15);
const topSuspectDomains = asArray(followup.topParseReadySuspectDomains).slice(0, 10);
const retryReasons = asArray(followup.topRetryReasons).slice(0, 10);
const blockedReasons = asArray(followup.topBlockedReasons).slice(0, 10);
const repairReasons = asArray(followup.topSourceRepairReasons).slice(0, 10);

const nextActions = [];
if (highSignal > 0) {
  nextActions.push(`Start parser work from \`followups/parse-ready-high-signal.json\` instead of the raw manifest.`);
}
if (retryable > 0) {
  nextActions.push(`Rerun the retryable queue separately before assuming content is missing.`);
}
if (blocked > 0) {
  nextActions.push(`Treat blocked domains as special handling candidates instead of burning tokens on manual review.`);
}
if (repair > 0) {
  nextActions.push(`Repair stale or invalid source targets before scheduling more fetch attempts.`);
}
if (suspect > 0) {
  nextActions.push(`Keep suspect parse-ready artifacts out of default parser waves until domain rules are tightened.`);
}

const lessons = [
  '# Source Acquisition Lessons Learned',
  '',
  `- Run ID: \`${runId}\``,
  `- Selected URLs: \`${selectedCount}\``,
  `- Fetch Successes: \`${succeeded}\``,
  `- Fetch Failures: \`${failed}\``,
  `- Success Rate: \`${successRate}%\``,
  `- Parse-Ready High Signal: \`${highSignal}\``,
  `- Parse-Ready Suspect: \`${suspect}\``,
  `- Retryable Failures: \`${retryable}\``,
  `- Blocked Failures: \`${blocked}\``,
  `- Source Repair Needed: \`${repair}\``,
  '',
  '## What Worked',
  '',
  `- The run produced a large parser-safe queue without requiring Codex to read raw page bodies.`,
  `- Followup bucketing separated parser-safe artifacts from retry, blocked, and stale-url work.`,
  `- High-signal domains are now visible from compact summaries, which makes the next parser wave cheaper to plan.`,
  '',
  '## What Needs Caution',
  '',
  `- A successful fetch is not the same as parser-safe public evidence; suspect redirects and platform pages still need isolation.`,
  `- Retryable and blocked failures should not be treated as missing information.`,
  `- Stale source targets need repair before more acquisition volume is added.`,
  '',
  renderTopCounts('Top High-Signal Domains', topHighSignalDomains),
  renderTopCounts('Top Suspect Domains', topSuspectDomains),
  renderTopCounts('Top Retry Reasons', retryReasons),
  renderTopCounts('Top Blocked Reasons', blockedReasons),
  renderTopCounts('Top Source Repair Reasons', repairReasons),
  '## Recommended Next Actions',
  '',
  ...nextActions.map((line) => `- ${line}`),
  '',
  '## Artifact Paths',
  '',
  `- Run Summary: \`${summaryPath}\``,
  `- Run Manifest: \`${path.join(runDir, 'manifest.json')}\``,
  `- Run Report: \`${path.join(runDir, 'report.md')}\``,
  `- Followup Summary: \`${followupSummaryPath}\``,
  `- Parse-Ready High Signal: \`${path.join(runDir, 'followups', 'parse-ready-high-signal.json')}\``,
  `- Retryable Failures: \`${path.join(runDir, 'followups', 'retryable-failures.json')}\``,
  `- Blocked Failures: \`${path.join(runDir, 'followups', 'blocked-failures.json')}\``,
  `- Source Repair: \`${path.join(runDir, 'followups', 'source-repair.json')}\``,
  '',
  '## Reuse Rule',
  '',
  '- Repeat this lessons artifact after every major acquisition wave so operational memory lives in the repo, not in chat context.',
  '',
];

const content = `${lessons.join('\n')}\n`;
fs.writeFileSync(lessonsPath, content);
fs.writeFileSync(generatedPath, content);

console.log(JSON.stringify({
  runId,
  lessonsPath,
  generatedPath,
  selectedCount,
  succeeded,
  failed,
  parseReadyHighSignal: highSignal,
  parseReadySuspect: suspect,
  retryableFailures: retryable,
  blockedFailures: blocked,
  sourceRepairNeeded: repair,
}, null, 2));
