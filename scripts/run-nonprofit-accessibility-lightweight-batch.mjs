import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const queuePath = path.join(repoRoot, 'docs', 'generated', `nonprofit-scrape-queue-${generatedDate}.json`);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const summaryPath = path.join(docsDir, `nonprofit-accessibility-lightweight-batch-${generatedDate}.json`);
const mdPath = path.join(docsDir, `nonprofit-accessibility-lightweight-batch-${generatedDate}.md`);

function parseArgs(argv) {
  const args = {
    limit: 6,
    mode: 'dry-run',
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'limit' && Number.isFinite(Number(value))) args.limit = Number(value);
    if (flag === 'mode' && value) args.mode = value.toLowerCase();
  }

  return args;
}

const args = parseArgs(process.argv.slice(2));

if (!fs.existsSync(queuePath)) {
  throw new Error(`Missing queue file: ${queuePath}. Run npm run audit:nonprofit-scrape-queue first.`);
}

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8')).queue || [];
const candidates = queue
  .filter((target) => ['single_site', 'site_path', 'statewide_service_org'].includes(target.targetType))
  .slice(0, args.limit);

function runDomain(target) {
  const commandArgs = ['run', 'run:nonprofit-accessibility-domain', '--', `--domain=${target.domain}`];
  if (args.mode === 'live') {
    commandArgs.push('--mode=live');
  }
  if (target.stateCount === 1 && Array.isArray(target.states) && target.states[0]) {
    commandArgs.push(`--state=${target.states[0]}`);
  }
  for (const orgTerm of (target.orgTerms || []).slice(0, 4)) {
    commandArgs.push(`--org=${orgTerm}`);
  }
  if (target.scrapeStrategy === 'site_path' && target.sampleUrl) {
    commandArgs.push(`--seed-url=${target.sampleUrl}`);
  }
  if (target.rowCount > 50) {
    commandArgs.push('--allow-bulk-org-level');
  }

  try {
    const raw = execFileSync('npm', commandArgs, {
      cwd: repoRoot,
      stdio: 'pipe',
      encoding: 'utf8',
    });
    return { ok: true, ...JSON.parse(raw) };
  } catch (error) {
    return {
      ok: false,
      domain: target.domain,
      key: target.key,
      error: String(error.stderr || error.message || error),
    };
  }
}

const results = candidates.map(runDomain);
const succeeded = results.filter((row) => row.ok);
const failed = results.filter((row) => !row.ok);

const mdLines = [
  '# Nonprofit Accessibility Lightweight Batch',
  '',
  `Generated: ${generatedDate}`,
  '',
  `Mode: ${args.mode}`,
  '',
  `- attempted targets: ${results.length}`,
  `- succeeded: ${succeeded.length}`,
  `- failed: ${failed.length}`,
  '',
  '## Results',
  '',
];

for (const row of succeeded) {
  mdLines.push(`- ${row.domain}: candidates=${row.candidateRows}, mutations=${row.mutationRows}, skipped=${row.skippedRows}, status=${row.safeStatus}, warnings=${(row.warnings || []).join(', ') || 'none'}`);
}

if (failed.length > 0) {
  mdLines.push('', '## Failures', '');
  for (const row of failed) {
    mdLines.push(`- ${row.domain || row.key}: failed`);
  }
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(summaryPath, `${JSON.stringify({
  generatedAt: generatedDate,
  mode: args.mode,
  attemptedTargets: results.length,
  succeeded: succeeded.length,
  failed: failed.length,
  results,
}, null, 2)}\n`);
fs.writeFileSync(mdPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  mode: args.mode,
  attemptedTargets: results.length,
  succeeded: succeeded.length,
  failed: failed.length,
  summaryPath,
  mdPath,
  domains: succeeded.map((row) => ({
    domain: row.domain,
    candidateRows: row.candidateRows,
    safeStatus: row.safeStatus,
    warnings: row.warnings,
    report: row.report,
  })),
}, null, 2));
