import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : process.cwd();
const generatedDate = new Date().toISOString().slice(0, 10);
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const sourceTargetsDir = path.join(dataDir, 'source_targets');
const packetsDir = path.join(docsDir, 'provider-authoring-state-packets');
const workfilesDir = path.join(dataDir, 'provider-authoring-state-workfiles');

function parseArgs(argv) {
  const args = { state: '' };
  for (const arg of argv) {
    if (arg.startsWith('--state=')) args.state = arg.slice('--state='.length).trim().toLowerCase();
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

function pickLatestPacket(stateId) {
  const names = fs.existsSync(packetsDir)
    ? fs.readdirSync(packetsDir).filter((name) => name.startsWith(`provider-authoring-state-packet-${stateId}-`) && name.endsWith('.json')).sort()
    : [];
  if (!names.length) {
    throw new Error(`Missing provider authoring state packet for ${stateId}. Run npm run audit:provider-authoring-state-packets first.`);
  }
  return path.join(packetsDir, names.at(-1));
}

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

const args = parseArgs(process.argv.slice(2));
if (!args.state) {
  throw new Error('Missing required --state=<state-id>.');
}

const packetPath = pickLatestPacket(args.state);
const packet = readJson(packetPath);
const sourceTargetsPath = packet?.sourceTargetsPath
  ? path.join(repoRoot, packet.sourceTargetsPath)
  : path.join(sourceTargetsDir, `${args.state}.json`);
const sourceTargets = fs.existsSync(sourceTargetsPath) ? readJson(sourceTargetsPath) : [];
const stateCode = String(sourceTargets.find((row) => hasText(row?.state))?.state || '').trim();
const existingWorkfilePath = path.join(workfilesDir, `provider-authoring-state-workfile-${args.state}.json`);
const existingWorkfile = fs.existsSync(existingWorkfilePath) ? readJson(existingWorkfilePath) : null;
const existingCandidatesBySlot = new Map(
  (existingWorkfile?.candidateProviderTargets || []).map((row) => [Number(row.slotNumber || 0), row]),
);

const neededTargetCount = Math.max(1, Number(packet?.neededConcreteTargets || 0));
const candidateProviderTargets = Array.from({ length: neededTargetCount }, (_, index) => {
  const slotNumber = index + 1;
  const current = existingCandidatesBySlot.get(slotNumber) || {};
  return {
    slotNumber,
    stateId: args.state,
    stateCode: current.stateCode || stateCode || '',
    sourceName: current.sourceName || '',
    sourceUrl: current.sourceUrl || '',
    domain: normalizeDomain(current.domain, current.sourceUrl),
    category: current.category || 'M. Hospitals / university clinics',
    specificSubcategory: current.specificSubcategory || '',
    organizationType: current.organizationType || '',
    expectedExtractionFields: current.expectedExtractionFields || 'name, phone, address',
    crawlMethod: current.crawlMethod || 'static_fetch',
    robotsStatus: current.robotsStatus || 'allowed',
    termsRisk: current.termsRisk || 'low',
    priority: current.priority ?? 2,
    notes: current.notes || '',
    reviewedBy: current.reviewedBy || '',
  };
});

const readyRows = candidateProviderTargets.filter((row) =>
  hasText(row.sourceName)
  && hasText(row.sourceUrl)
  && hasText(normalizeDomain(row.domain, row.sourceUrl))
  && hasText(row.reviewedBy)
);

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  stateId: args.state,
  stateName: packet?.stateName || '',
  sourcePacketPath: path.relative(repoRoot, packetPath),
  sourceTargetsPath: path.relative(repoRoot, sourceTargetsPath),
  instructions: {
    summary: 'Fill only the missing first-party provider targets needed for this state. Do not broaden beyond provider_directory authoring.',
    completionRule: 'A candidate row is ready only when sourceName, sourceUrl, domain, and reviewedBy are filled.',
  },
  summary: {
    neededConcreteTargets: Number(packet?.neededConcreteTargets || 0),
    currentConcreteProviderTargetCount: Number(packet?.concreteProviderTargetCount || 0),
    existingProviderTargetCount: Array.isArray(packet?.providerTargets) ? packet.providerTargets.length : 0,
    candidateSlotCount: candidateProviderTargets.length,
    readyCandidateCount: readyRows.length,
    unresolvedCandidateCount: candidateProviderTargets.length - readyRows.length,
  },
  existingProviderTargets: (packet?.providerTargets || []).map((row) => ({
    sourceName: row.sourceName || '',
    sourceUrl: row.sourceUrl || '',
    domain: row.domain || '',
    crawlMethod: row.crawlMethod || '',
    organizationType: row.organizationType || '',
    notes: row.notes || '',
  })),
  supportTargets: packet?.supportTargets || [],
  candidateProviderTargets,
};

writeJson(existingWorkfilePath, payload);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  stateId: args.state,
  workfile: existingWorkfilePath,
  summary: payload.summary,
}, null, 2));
