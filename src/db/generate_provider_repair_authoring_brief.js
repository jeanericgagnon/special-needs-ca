import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);

function parseArgs(argv) {
  const args = {
    state: '',
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'state' && value) args.state = value.toLowerCase();
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function latestMatchingPacketPath(stateId) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir)
      .filter((name) => name.startsWith('provider-repair-batch-packet-') && name.endsWith('.json'))
      .filter((name) => !stateId || name.includes(`-${stateId}-`))
      .sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing provider repair batch packet${stateId ? ` for state=${stateId}` : ''}.`);
  }
  return path.join(docsDir, matches.at(-1));
}

function titleCaseStateId(stateId) {
  return String(stateId || '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeHref(href, sourceUrl) {
  const raw = String(href || '').trim();
  if (!raw || raw.startsWith('#') || raw.startsWith('javascript:') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return '';
  try {
    return new URL(raw, sourceUrl).toString();
  } catch {
    return '';
  }
}

function extractCandidateHints(html, sourceUrl) {
  const hrefMatches = [...html.matchAll(/href\s*=\s*"([^"]+)"/gi)];
  const keywordPattern = /(develop|child|service|center|clinic|location|special|autism|behavior|contact|referral|doctor|provider)/i;
  const candidates = [];
  const seen = new Set();

  for (const match of hrefMatches) {
    const url = normalizeHref(match[1], sourceUrl);
    if (!url || seen.has(url)) continue;
    const pathname = (() => {
      try {
        return new URL(url).pathname;
      } catch {
        return '';
      }
    })();
    if (!keywordPattern.test(pathname)) continue;
    seen.add(url);
    candidates.push(url);
  }

  return candidates.slice(0, 8);
}

const args = parseArgs(process.argv.slice(2));
const packetPath = latestMatchingPacketPath(args.state);
const packet = readJson(packetPath);
const stateId = packet?.selection?.stateId || args.state || 'unknown';
const briefKey = `provider-repair-authoring-brief-${stateId}-${generatedDate}`;
const jsonOutPath = path.join(docsDir, `${briefKey}.json`);
const mdOutPath = path.join(docsDir, `${briefKey}.md`);

const rows = Array.isArray(packet.selectedRows) ? packet.selectedRows : [];
const unresolvedRows = rows.map((row) => {
  const savedPath = row.topSavedPath ? path.join(repoRoot, row.topSavedPath) : '';
  const savedHtml = savedPath && fs.existsSync(savedPath) ? fs.readFileSync(savedPath, 'utf8') : '';
  return {
    stateId: row.stateId,
    stateName: titleCaseStateId(row.stateId),
    actionClass: row.actionClass,
    followupReason: row.followupReason,
    sourceUrl: row.sourceUrl,
    hostname: row.hostname,
    repeatCount: row.repeatCount || 0,
    savedEvidencePath: row.topSavedPath || '',
    savedEvidenceStatus: savedHtml ? (/<title>.*Page Not Found/i.test(savedHtml) ? 'page_not_found' : 'saved_html_present') : 'missing_saved_html',
    candidateHints: savedHtml ? extractCandidateHints(savedHtml, row.sourceUrl) : [],
    nextAction: 'Author a current same-org first-party replacement URL before the next provider fetch cycle.',
  };
});

const payload = {
  briefId: 'provider_repair_authoring_brief',
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourcePacketPath: path.relative(repoRoot, packetPath),
  stateId,
  purpose: 'Deterministic authoring brief for unresolved provider repair rows that still need same-org first-party replacement URLs.',
  summary: {
    unresolvedRows: unresolvedRows.length,
    rowsWithSavedEvidence: unresolvedRows.filter((row) => row.savedEvidencePath).length,
    rowsWithCandidateHints: unresolvedRows.filter((row) => row.candidateHints.length > 0).length,
  },
  rows: unresolvedRows,
};

const mdLines = [
  '# Provider Repair Authoring Brief',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  `- state: ${titleCaseStateId(stateId)}`,
  `- unresolved rows: ${payload.summary.unresolvedRows}`,
  `- source packet: ${payload.sourcePacketPath}`,
  '',
];

for (const row of unresolvedRows) {
  mdLines.push(
    `## ${row.hostname}`,
    '',
    `- source URL: ${row.sourceUrl}`,
    `- action class: ${row.actionClass}`,
    `- followup reason: ${row.followupReason}`,
    `- repeats: ${row.repeatCount}`,
    `- saved evidence: ${row.savedEvidencePath || 'none'}`,
    `- saved evidence status: ${row.savedEvidenceStatus}`,
    `- next action: ${row.nextAction}`,
    '',
    'Candidate hints from saved page:',
    '',
    ...(row.candidateHints.length ? row.candidateHints.map((hint) => `- ${hint}`) : ['- none']),
    ''
  );
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  brief: {
    json: jsonOutPath,
    md: mdOutPath,
  },
  summary: payload.summary,
}, null, 2));
