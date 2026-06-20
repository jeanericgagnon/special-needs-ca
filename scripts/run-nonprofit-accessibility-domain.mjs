import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const profilesPath = path.join(repoRoot, 'scripts', 'nonprofit-domain-profiles.json');
const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));

function parseArgs(argv) {
  const args = {
    domain: '',
    mode: '',
    state: '',
    allowBulkOrgLevel: false,
    allowNetworkDomain: false,
    maxPages: '',
    seedUrls: [],
    orgTerms: [],
    skipAudit: false,
  };

  for (const arg of argv) {
    if (arg === '--allow-bulk-org-level') {
      args.allowBulkOrgLevel = true;
      continue;
    }
    if (arg === '--allow-network-domain') {
      args.allowNetworkDomain = true;
      continue;
    }
    if (arg === '--skip-audit') {
      args.skipAudit = true;
      continue;
    }
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'domain') args.domain = value.toLowerCase();
    if (flag === 'mode') args.mode = value.toLowerCase();
    if (flag === 'state') args.state = value.toLowerCase();
    if (flag === 'max-pages') args.maxPages = value;
    if (flag === 'seed-url' && value) args.seedUrls.push(value);
    if (flag === 'org' && value) args.orgTerms.push(value);
  }

  return args;
}

function runNode(relativePath, extraArgs = []) {
  return execFileSync('node', [relativePath, ...extraArgs], {
    cwd: repoRoot,
    stdio: 'pipe',
    encoding: 'utf8',
  });
}

function runNpm(scriptName) {
  return execFileSync('npm', ['run', scriptName], {
    cwd: repoRoot,
    stdio: 'pipe',
    encoding: 'utf8',
  });
}

function latestRunDir(domain) {
  const root = path.join(repoRoot, 'data', 'nonprofit-accessibility-domains', domain.replace(/[^a-z0-9]+/gi, '-').toLowerCase());
  if (!fs.existsSync(root)) return null;
  const dirs = fs.readdirSync(root)
    .map((name) => path.join(root, name))
    .filter((fullPath) => fs.statSync(fullPath).isDirectory())
    .sort();
  return dirs.at(-1) || null;
}

const args = parseArgs(process.argv.slice(2));
if (!args.domain) {
  throw new Error('Usage: npm run run:nonprofit-accessibility-domain -- --domain=example.org [--mode=dry-run|live]');
}

const profile = profiles[args.domain] || {};
const mode = args.mode || profile.defaultMode || 'dry-run';
const commandArgs = [
  'src/db/promote_nonprofit_accessibility_domain_batch.js',
  `--domain=${args.domain}`,
];

for (const orgTerm of [...(profile.orgTerms || []), ...args.orgTerms]) {
  commandArgs.push(`--org=${orgTerm}`);
}
if (args.state) commandArgs.push(`--state=${args.state}`);
if (args.maxPages) commandArgs.push(`--max-pages=${args.maxPages}`);
for (const seedUrl of args.seedUrls) {
  commandArgs.push(`--seed-url=${seedUrl}`);
}
if (mode !== 'live') commandArgs.push('--dry-run');
if (args.allowBulkOrgLevel) commandArgs.push('--allow-bulk-org-level');
if (args.allowNetworkDomain) commandArgs.push('--allow-network-domain');

const raw = runNode(commandArgs[0], commandArgs.slice(1));
const result = JSON.parse(raw);

let auditRan = false;
if (mode === 'live' && !args.skipAudit) {
  runNpm('audit:directory-accessibility');
  auditRan = true;
}

const runDir = latestRunDir(args.domain);
let summary = null;
if (runDir) {
  const summaryPath = path.join(runDir, 'summary.json');
  if (fs.existsSync(summaryPath)) {
    summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  }
}

console.log(JSON.stringify({
  domain: args.domain,
  mode,
  auditRan,
  profileNotes: profile.notes || null,
  candidateRows: result.candidateRows,
  mutationRows: result.mutationRows,
  skippedRows: result.skippedRows,
  safeStatus: result.safeStatus,
  warnings: result.warnings,
  bestEvidence: result.bestEvidence,
  report: result.report,
  artifacts: result.artifacts,
  summary,
  nextStep: mode === 'dry-run'
    ? 'Read the compact report and only rerun in live mode if the semantics and guardrails look safe.'
    : 'Review the generated report and refreshed accessibility audit before moving to the next domain.',
}, null, 2));
