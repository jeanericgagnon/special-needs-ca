import path from 'node:path';
import {
  buildNmControlPlane,
  discoverNmCandidates,
  buildNmScraperQueue,
  runNmScraperQueue,
  writeNmArtifacts,
} from './nm-low-token-source-acquisition-lib.mjs';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function parseInteger(value, fallbackValue) {
  if (value === undefined || value === '') return fallbackValue;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`Invalid numeric flag value: ${value}`);
  return parsed;
}

function parseArgs(argv) {
  const outputDir = path.join(repoRoot, 'data', 'generated');
  const docsDir = path.join(repoRoot, 'docs', 'generated');
  const parsed = {
    outputDir,
    docsDir,
    dbPath: path.join(repoRoot, 'ca_disability_navigator.db'),
    maxCandidatesPerRole: 3,
    maxJobs: 75,
    requestTimeoutMs: 15000,
    bodyTimeoutMs: 15000,
    maxResponseBytes: 3_000_000,
    delayMs: 250,
    retryDelayMs: 800,
    mode: 'full',
  };

  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [key, rawValue] = arg.slice(2).split(/=(.*)/s, 2);
    const value = rawValue ?? '';
    if (key === 'output-dir') parsed.outputDir = path.resolve(value);
    else if (key === 'docs-dir') parsed.docsDir = path.resolve(value);
    else if (key === 'db-path') parsed.dbPath = path.resolve(value);
    else if (key === 'max-candidates-per-role') parsed.maxCandidatesPerRole = parseInteger(value, parsed.maxCandidatesPerRole);
    else if (key === 'max-jobs') parsed.maxJobs = parseInteger(value, parsed.maxJobs);
    else if (key === 'request-timeout-ms') parsed.requestTimeoutMs = parseInteger(value, parsed.requestTimeoutMs);
    else if (key === 'body-timeout-ms') parsed.bodyTimeoutMs = parseInteger(value, parsed.bodyTimeoutMs);
    else if (key === 'max-response-bytes') parsed.maxResponseBytes = parseInteger(value, parsed.maxResponseBytes);
    else if (key === 'delay-ms') parsed.delayMs = parseInteger(value, parsed.delayMs);
    else if (key === 'retry-delay-ms') parsed.retryDelayMs = parseInteger(value, parsed.retryDelayMs);
    else if (key === 'mode') parsed.mode = value || parsed.mode;
  }
  return parsed;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { registryRows, roleRows } = buildNmControlPlane({
    repoRoot,
    dbPath: args.dbPath,
  });

  const candidateRows = await discoverNmCandidates({
    registryRows,
    roleRows,
    options: args,
  });
  const queueRows = buildNmScraperQueue(candidateRows, roleRows, args);

  writeNmArtifacts({
    outputDir: args.outputDir,
    docsDir: args.docsDir,
    registryRows,
    roleRows,
    candidateRows,
    queueRows,
  });

  if (args.mode === 'plan-only') {
    console.log(JSON.stringify({
      ok: true,
      mode: 'plan-only',
      registryRows: registryRows.length,
      roleRows: roleRows.length,
      candidateRows: candidateRows.length,
      queueRows: queueRows.length,
      outputDir: args.outputDir,
    }, null, 2));
    return;
  }

  const { verifiedRows, rejectedRows, blockedRows, unresolvedRows, summary } = await runNmScraperQueue({
    queueRows,
    roleRows,
    outputDir: args.outputDir,
    options: args,
  });

  writeNmArtifacts({
    outputDir: args.outputDir,
    docsDir: args.docsDir,
    registryRows,
    roleRows,
    candidateRows,
    queueRows,
    verifiedRows,
    rejectedRows,
    blockedRows,
    unresolvedRows,
    summary,
  });

  console.log(JSON.stringify({
    ok: true,
    mode: 'full',
    registryRows: registryRows.length,
    roleRows: roleRows.length,
    candidateRows: candidateRows.length,
    queueRows: queueRows.length,
    verifiedRows: verifiedRows.length,
    rejectedRows: rejectedRows.length,
    blockedRows: blockedRows.length,
    unresolvedRows: unresolvedRows.length,
    summaryPath: path.join(args.outputDir, 'nm_low_token_acquisition_summary_v1.json'),
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exitCode = 1;
});
