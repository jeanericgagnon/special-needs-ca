import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function runWave(args) {
  const result = spawnSync('npm', ['run', 'run:source-acquisition-wave', '--', ...args], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Wave run failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }

  const jsonStart = result.stdout.indexOf('{');
  if (jsonStart === -1) {
    throw new Error(`Expected JSON output from wave run\nSTDOUT:\n${result.stdout}`);
  }
  return JSON.parse(result.stdout.slice(jsonStart));
}

function normalizeUrlFingerprint(rawUrl) {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const pathFingerprint = url.pathname
      .toLowerCase()
      .replace(/\/+/g, '/')
      .replace(/\/$/, '')
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.replace(/[^a-z0-9]/g, ''))
      .filter(Boolean)
      .join('/');
    return `${host}|${pathFingerprint}`;
  } catch {
    return String(rawUrl || '').trim().toLowerCase();
  }
}

function providerSelectionKey(stateId, rawUrl) {
  return `${String(stateId || '').trim()}|${normalizeUrlFingerprint(rawUrl)}`;
}

function runAudit(scriptName) {
  const result = spawnSync('npm', ['run', scriptName], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Audit failed: ${scriptName}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
}

const output = runWave(['--mode=dry-run', '--lane=ready_target_scrape', '--gap=providers_care', '--limit=5']);
const manifest = JSON.parse(fs.readFileSync(output.manifestPath, 'utf8'));
const rows = manifest.rows || [];
const blockerRegistryPath = path.join(repoRoot, 'docs', 'generated', `provider-followup-blocker-registry-${new Date().toISOString().slice(0, 10)}.json`);
const blockedUrls = fs.existsSync(blockerRegistryPath)
  ? new Set((JSON.parse(fs.readFileSync(blockerRegistryPath, 'utf8')).rows || []).map((row) => row.sourceUrl))
  : new Set();
const acceptedProviderUrls = new Set();
const rejectedProviderUrls = new Set();
const outputRoot = path.join(repoRoot, 'data', 'source-acquisition-runs');
if (fs.existsSync(outputRoot)) {
  for (const runId of fs.readdirSync(outputRoot)) {
    const acceptedPath = path.join(outputRoot, runId, 'validated', 'providers_care', 'accepted.ndjson');
    if (!fs.existsSync(acceptedPath)) continue;
    const lines = fs.readFileSync(acceptedPath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line);
      if (row?.sourceUrl) acceptedProviderUrls.add(String(row.sourceUrl));
    }
  }
  for (const runId of fs.readdirSync(outputRoot)) {
    const rejectedPath = path.join(outputRoot, runId, 'validated', 'providers_care', 'rejected.ndjson');
    if (!fs.existsSync(rejectedPath)) continue;
    const lines = fs.readFileSync(rejectedPath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line);
      const reasons = Array.isArray(row?.validationReasons) ? row.validationReasons : [];
      if (!reasons.includes('missing_provider_contact_signal')) continue;
      if (row?.sourceUrl) rejectedProviderUrls.add(String(row.sourceUrl));
    }
  }
}
const db = new Database(path.join(repoRoot, 'ca_disability_navigator.db'), { readonly: true });
const stagedProviderKeys = new Set(
  db.prepare(`
    SELECT DISTINCT state_id, source_url
    FROM staging_scraped_resource_providers
    WHERE source_type = 'lightweight_source_acquisition'
      AND source_url IS NOT NULL
      AND TRIM(source_url) <> ''
  `).all().map((row) => providerSelectionKey(row.state_id, row.source_url)),
);
db.close();
const hostnames = new Set(
  rows.map((row) => {
    try {
      return new URL(row.sourceUrl).hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      return '';
    }
  }).filter(Boolean),
);

assert.ok(output.selectedCount >= 0 && output.selectedCount <= 5);
assert.equal(rows.length, output.selectedCount);
if (rows.length >= 2) {
  assert.ok(hostnames.size >= 2, `Expected hostname-diverse selection, received ${hostnames.size} unique hosts`);
}
assert.equal(rows.some((row) => blockedUrls.has(row.sourceUrl)), false, 'Expected provider wave selection to exclude repeated blocker URLs');
assert.equal(rows.some((row) => acceptedProviderUrls.has(row.sourceUrl)), false, 'Expected provider wave selection to exclude previously accepted provider URLs');
assert.equal(rows.some((row) => rejectedProviderUrls.has(row.sourceUrl)), false, 'Expected provider wave selection to exclude previously rejected provider URLs');
assert.equal(
  rows.some((row) => stagedProviderKeys.has(providerSelectionKey(row.stateId, row.sourceUrl))),
  false,
  'Expected provider wave selection to exclude already staged provider URLs',
);

console.log(JSON.stringify({
  ok: true,
  runId: output.runId,
  uniqueHostnames: hostnames.size,
  excludedProviderRepeatedBlockerRows: manifest.selectionGuards?.excludedProviderRepeatedBlockerRows || 0,
  excludedPreviouslyAcceptedProviderRows: manifest.selectionGuards?.excludedPreviouslyAcceptedProviderRows || 0,
  excludedPreviouslyRejectedProviderRows: manifest.selectionGuards?.excludedPreviouslyRejectedProviderRows || 0,
  excludedAlreadyStagedProviderRows: manifest.selectionGuards?.excludedAlreadyStagedProviderRows || 0,
}, null, 2));

runAudit('audit:advocate-followup-blocker-registry');
const advocateOutput = runWave(['--mode=dry-run', '--lane=ready_target_scrape', '--gap=advocates_legal', '--limit=5']);
const advocateManifest = JSON.parse(fs.readFileSync(advocateOutput.manifestPath, 'utf8'));
const advocateRows = advocateManifest.rows || [];
const blockedAdvocateUrls = new Set();
if (fs.existsSync(outputRoot)) {
  const groupedAdvocateRows = new Map();
  for (const runId of fs.readdirSync(outputRoot)) {
    const followupDir = path.join(outputRoot, runId, 'followups');
    if (!fs.existsSync(followupDir)) continue;
    for (const [fileName, bucket] of [
      ['blocked-failures.json', 'blocked'],
      ['source-repair.json', 'source_repair'],
      ['retryable-failures.json', 'retryable'],
    ]) {
      const filePath = path.join(followupDir, fileName);
      if (!fs.existsSync(filePath)) continue;
      const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (row?.gapFamily !== 'advocates_legal') continue;
        const sourceUrl = String(row?.sourceUrl || '').trim();
        const followupReason = String(row?.followupReason || '').trim();
        if (!sourceUrl || !followupReason) continue;
        const key = `${bucket}|${followupReason}|${sourceUrl}`;
        const current = groupedAdvocateRows.get(key) || { bucket, followupReason, sourceUrl, count: 0 };
        current.count += 1;
        groupedAdvocateRows.set(key, current);
      }
    }
  }

  for (const entry of groupedAdvocateRows.values()) {
    if (entry.count >= 2 || (entry.bucket === 'source_repair' && entry.followupReason === 'dns_lookup_failed')) {
      blockedAdvocateUrls.add(entry.sourceUrl);
    }
  }
}

assert.equal(
  advocateRows.some((row) => blockedAdvocateUrls.has(row.sourceUrl)),
  false,
  'Expected advocate wave selection to exclude actionable advocate followup URLs from saved runs',
);

runAudit('audit:competitive-help-followup-blocker-registry');
const housingOutput = runWave(['--mode=dry-run', '--lane=ready_target_scrape', '--gap=housing', '--limit=5']);
const housingManifest = JSON.parse(fs.readFileSync(housingOutput.manifestPath, 'utf8'));
const housingRows = housingManifest.rows || [];
const competitiveRegistryPath = path.join(repoRoot, 'docs', 'generated', `competitive-help-followup-blocker-registry-${new Date().toISOString().slice(0, 10)}.json`);
const blockedHousingUrls = fs.existsSync(competitiveRegistryPath)
  ? new Set((JSON.parse(fs.readFileSync(competitiveRegistryPath, 'utf8')).rows || []).filter((row) => row.gapFamily === 'housing').map((row) => row.sourceUrl))
  : new Set();

assert.equal(
  housingRows.some((row) => blockedHousingUrls.has(row.sourceUrl)),
  false,
  'Expected housing wave selection to exclude registry-blocked housing URLs',
);

const knowledgeOutput = runWave(['--mode=dry-run', '--lane=ready_target_scrape', '--gap=knowledge_content', '--limit=25']);
const knowledgeManifest = JSON.parse(fs.readFileSync(knowledgeOutput.manifestPath, 'utf8'));
const knowledgeRows = knowledgeManifest.rows || [];
const acceptedKnowledgeUrls = new Set();
if (fs.existsSync(outputRoot)) {
  for (const runId of fs.readdirSync(outputRoot)) {
    const acceptedPath = path.join(outputRoot, runId, 'validated', 'knowledge_content', 'accepted.ndjson');
    if (!fs.existsSync(acceptedPath)) continue;
    const lines = fs.readFileSync(acceptedPath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean);
    for (const line of lines) {
      const row = JSON.parse(line);
      if (row?.sourceUrl) acceptedKnowledgeUrls.add(String(row.sourceUrl));
    }
  }
}

assert.equal(
  knowledgeRows.some((row) => acceptedKnowledgeUrls.has(row.sourceUrl)),
  false,
  'Expected knowledge wave selection to exclude previously accepted knowledge URLs',
);
assert.equal(
  knowledgeRows.some((row) => String(row.sourceUrl || '').includes('ssa.gov')),
  false,
  'Expected knowledge wave selection to exclude repeated blocked SSA knowledge URLs',
);

const educationOutput = runWave(['--mode=dry-run', '--lane=ready_target_scrape', '--gap=education_routing', '--status=ready_js_heavy', '--limit=10']);
const educationManifest = JSON.parse(fs.readFileSync(educationOutput.manifestPath, 'utf8'));
const educationRows = educationManifest.rows || [];
const blockedEducationUrls = new Set();
if (fs.existsSync(outputRoot)) {
  const groupedEducationRows = new Map();
  for (const runId of fs.readdirSync(outputRoot)) {
    const followupDir = path.join(outputRoot, runId, 'followups');
    if (!fs.existsSync(followupDir)) continue;
    for (const fileName of ['blocked-failures.json', 'source-repair.json', 'retryable-failures.json']) {
      const filePath = path.join(followupDir, fileName);
      if (!fs.existsSync(filePath)) continue;
      const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (row?.gapFamily !== 'education_routing') continue;
        const sourceUrl = String(row?.sourceUrl || '').trim();
        const followupReason = String(row?.followupReason || '').trim();
        if (!sourceUrl || !followupReason) continue;
        const key = `${followupReason}|${sourceUrl}`;
        const current = groupedEducationRows.get(key) || { sourceUrl, count: 0 };
        current.count += 1;
        groupedEducationRows.set(key, current);
      }
    }
  }

  for (const entry of groupedEducationRows.values()) {
    if (entry.count >= 2) blockedEducationUrls.add(entry.sourceUrl);
  }
}

assert.equal(
  educationRows.some((row) => blockedEducationUrls.has(row.sourceUrl)),
  false,
  'Expected education wave selection to exclude repeated blocked education followup URLs',
);
