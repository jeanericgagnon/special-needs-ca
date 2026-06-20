import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const dataDir = path.join(repoRoot, 'data');
const workfilesDir = path.join(dataDir, 'provider-authoring-state-workfiles');

function parseArgs(argv) {
  const args = { state: '', apply: false };
  for (const arg of argv) {
    if (arg === '--apply') args.apply = true;
    else if (arg.startsWith('--state=')) args.state = arg.slice('--state='.length).trim().toLowerCase();
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function normalizeUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function normalizeDomain(rawDomain, rawUrl) {
  const explicit = String(rawDomain || '').trim().replace(/^www\./, '').toLowerCase();
  if (explicit) return explicit;
  try {
    return new URL(String(rawUrl || '').trim()).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

const args = parseArgs(process.argv.slice(2));
if (!args.state) {
  throw new Error('Missing required --state=<state-id>.');
}

const workfilePath = path.join(workfilesDir, `provider-authoring-state-workfile-${args.state}.json`);
if (!fs.existsSync(workfilePath)) {
  throw new Error(`Missing provider authoring state workfile: ${workfilePath}. Run npm run fix:provider-authoring-state-workfile -- --state=${args.state} first.`);
}

const workfile = readJson(workfilePath);
const sourceTargetsPath = path.join(repoRoot, workfile.sourceTargetsPath || '');
if (!workfile.sourceTargetsPath || !fs.existsSync(sourceTargetsPath)) {
  throw new Error(`Missing source targets file for state=${args.state}: ${sourceTargetsPath}`);
}

const sourceTargets = readJson(sourceTargetsPath);
const readyCandidates = (workfile.candidateProviderTargets || []).filter((row) =>
  hasText(row.sourceName)
  && hasText(row.sourceUrl)
  && hasText(normalizeDomain(row.domain, row.sourceUrl))
  && hasText(row.reviewedBy)
);
const existingByUrl = new Map(sourceTargets.map((row) => [normalizeUrl(row.source_url), row]));
let addedRows = 0;
let updatedRows = 0;

for (const row of readyCandidates) {
  const normalizedUrl = normalizeUrl(row.sourceUrl);
  if (!normalizedUrl) continue;
  const normalizedDomain = normalizeDomain(row.domain, row.sourceUrl);
  const payload = {
    source_name: row.sourceName,
    source_url: normalizedUrl,
    domain: normalizedDomain,
    target_table: 'resource_providers',
    category: row.category || 'M. Hospitals / university clinics',
    specific_subcategory: row.specificSubcategory || '',
    organization_type: row.organizationType || '',
    expected_extraction_fields: row.expectedExtractionFields || 'name, phone, address',
    crawl_method: row.crawlMethod || 'static_fetch',
    robots_status: row.robotsStatus || 'allowed',
    terms_risk: row.termsRisk || 'low',
    priority: row.priority ?? 2,
    notes: row.notes || '',
    last_checked_at: new Date().toISOString().slice(0, 10),
    state: row.stateCode || sourceTargets.find((target) => hasText(target?.state))?.state || '',
  };

  const existing = existingByUrl.get(normalizedUrl);
  if (existing) {
    Object.assign(existing, payload);
    updatedRows += 1;
  } else {
    sourceTargets.push(payload);
    existingByUrl.set(normalizedUrl, payload);
    addedRows += 1;
  }
}

if (args.apply) {
  writeJson(sourceTargetsPath, sourceTargets);
}

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  stateId: args.state,
  mode: args.apply ? 'apply' : 'dry-run',
  workfilePath,
  sourceTargetsPath,
  readyCandidates: readyCandidates.length,
  addedRows,
  updatedRows,
}, null, 2));
