import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const generatedDataDir = path.join(repoRoot, 'data', 'generated');
const generatedDocsDir = path.join(repoRoot, 'docs', 'generated');
const registryPath = path.join(generatedDataDir, 'california-next-source-registry-v1.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function batchClassForSeed(seed) {
  const lowerUrl = seed.sourceUrl.toLowerCase();
  if (seed.sourceType.includes('directory') || seed.targetKind === 'directory_root') return 'directory_root';
  if (lowerUrl.endsWith('.pdf')) return 'pdf';
  return 'html';
}

function fetchModeForSeed(seed) {
  return batchClassForSeed(seed) === 'directory_root' ? 'http_fetch_with_same_domain_discovery' : 'http_fetch';
}

function maxBytesForSeed(seed) {
  return batchClassForSeed(seed) === 'pdf' ? 10 * 1024 * 1024 : 3 * 1024 * 1024;
}

function buildQueueRow(seed, index) {
  const batchClass = batchClassForSeed(seed);
  return {
    jobId: `ca_seed_${String(index + 1).padStart(3, '0')}`,
    state: 'california',
    family: seed.family,
    sourceRole: seed.role,
    label: seed.label,
    url: seed.sourceUrl,
    authority: seed.authority,
    owner: seed.owner,
    sourceType: seed.sourceType,
    targetKind: seed.targetKind,
    expectedCoverage: seed.expectedCoverage,
    normalizedDomain: seed.normalizedDomain,
    batchClass,
    fetchMode: fetchModeForSeed(seed),
    maxBytes: maxBytesForSeed(seed),
    timeoutMs: 20000,
    retryCount: 1,
    delayMs: 400,
    requiredValidationChecks: seed.requiredValidationChecks,
    displayStatusOnIngest: 'needs_review',
    queueLane: 'registry_seed_fetch',
    notes: seed.notes,
  };
}

if (!fs.existsSync(registryPath)) {
  throw new Error(`Missing California registry at ${registryPath}. Run node scripts/generate-california-next-source-registry-v1.mjs first.`);
}

const registry = readJson(registryPath);
const seedEntries = Array.isArray(registry.seedEntries) ? registry.seedEntries : [];
const queueRows = seedEntries
  .filter((entry) => entry.validationStatus === 'seed_ready')
  .map(buildQueueRow);

const summary = {
  generatedAt: new Date().toISOString(),
  state: 'california',
  inputRegistryPath: path.relative(repoRoot, registryPath),
  totalRegistrySeeds: seedEntries.length,
  queueRows: queueRows.length,
  byFamily: queueRows.reduce((acc, row) => {
    acc[row.family] = (acc[row.family] || 0) + 1;
    return acc;
  }, {}),
  byBatchClass: queueRows.reduce((acc, row) => {
    acc[row.batchClass] = (acc[row.batchClass] || 0) + 1;
    return acc;
  }, {}),
};

const outputJsonl = path.join(generatedDataDir, 'california-next-source-seed-queue-v1.jsonl');
const outputJson = path.join(generatedDataDir, 'california-next-source-seed-queue-v1.json');
const outputMd = path.join(generatedDocsDir, 'california-next-source-seed-queue-v1.md');

fs.mkdirSync(generatedDataDir, { recursive: true });
fs.mkdirSync(generatedDocsDir, { recursive: true });
writeJsonl(outputJsonl, queueRows);
writeJson(outputJson, summary);
fs.writeFileSync(outputMd, [
  '# California Next-Source Seed Queue v1',
  '',
  `Generated: ${summary.generatedAt}`,
  '',
  `- Input registry: \`${summary.inputRegistryPath}\``,
  `- Total registry seeds: \`${summary.totalRegistrySeeds}\``,
  `- Queue rows: \`${summary.queueRows}\``,
  '',
  '## Queue by Family',
  ...Object.entries(summary.byFamily).map(([family, count]) => `- ${family}: ${count}`),
  '',
  '## Queue by Batch Class',
  ...Object.entries(summary.byBatchClass).map(([batchClass, count]) => `- ${batchClass}: ${count}`),
  '',
  '## Seed Jobs',
  ...queueRows.flatMap((row) => [
    `### ${row.jobId} — ${row.label}`,
    `- Family: \`${row.family}\``,
    `- URL: ${row.url}`,
    `- Batch class: \`${row.batchClass}\``,
    `- Fetch mode: \`${row.fetchMode}\``,
    `- Display status on ingest: \`${row.displayStatusOnIngest}\``,
    '',
  ]),
].join('\n') + '\n');

console.log(JSON.stringify({
  outputJsonl: path.join('data', 'generated', 'california-next-source-seed-queue-v1.jsonl'),
  outputJson: path.join('data', 'generated', 'california-next-source-seed-queue-v1.json'),
  outputMarkdown: path.join('docs', 'generated', 'california-next-source-seed-queue-v1.md'),
  queueRows: queueRows.length,
}, null, 2));
