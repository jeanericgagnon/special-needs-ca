import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const dataDir = path.join(repoRoot, 'data');
const generatedDate = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const jsonOutPath = path.join(docsDir, `provider-pull-now-manual-fill-queue-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-pull-now-manual-fill-queue-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row?.[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined;
}

function normalizeUrl(rawUrl) {
  if (!hasText(rawUrl)) return '';
  try {
    const parsed = new URL(String(rawUrl).trim());
    parsed.hash = '';
    if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    if ((parsed.protocol === 'https:' && parsed.port === '443') || (parsed.protocol === 'http:' && parsed.port === '80')) parsed.port = '';
    return parsed.toString();
  } catch {
    return String(rawUrl).trim();
  }
}

function domainFromUrl(rawUrl) {
  try {
    return new URL(String(rawUrl).trim()).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

const decisionFilePath = path.join(dataDir, 'provider-pull-now-decisions.json');
const sourcePackPlanPath = path.join(docsDir, `provider-source-pack-plan-${generatedDate}.json`);

const decisionsPayload = readJson(decisionFilePath);
const sourcePackPlan = readJson(sourcePackPlanPath);
const statePlanById = new Map((sourcePackPlan.states || []).map((state) => [state.stateId, state]));

const unresolvedRows = (decisionsPayload.rows || [])
  .filter((row) => !hasText(row.decisionMode))
  .map((row) => {
    const statePlan = statePlanById.get(row.stateId) || {};
    const concreteTargets = Array.isArray(statePlan.concreteProviderTargets) ? statePlan.concreteProviderTargets : [];
    const sourceUrl = normalizeUrl(row.sourceUrl);
    const sourceDomain = domainFromUrl(sourceUrl);
    const sameDomainCandidates = concreteTargets.filter((target) => domainFromUrl(target.source_url) === sourceDomain);
    return {
      stateId: row.stateId,
      actionClass: row.actionClass,
      followupReason: row.followupReason,
      sourceUrl,
      hostname: row.hostname,
      repeatCount: row.repeatCount,
      decisionHint:
        row.actionClass === 'bounded_retry_then_replace'
          ? 'bounded_retry_once'
          : sameDomainCandidates.length === 1 && normalizeUrl(sameDomainCandidates[0].source_url) !== sourceUrl
            ? 'replace_with_reviewed_first_party_target'
            : 'needs_manual_research',
      sameDomainCandidateCount: sameDomainCandidates.length,
      sameDomainCandidates: sameDomainCandidates.slice(0, 5).map((candidate) => ({
        sourceName: candidate.source_name,
        sourceUrl: normalizeUrl(candidate.source_url),
        priority: candidate.priority,
      })),
      topConcreteTargets: concreteTargets.slice(0, 5).map((candidate) => ({
        sourceName: candidate.source_name,
        sourceUrl: normalizeUrl(candidate.source_url),
        priority: candidate.priority,
      })),
    };
  })
  .sort((a, b) =>
    b.repeatCount - a.repeatCount
    || a.stateId.localeCompare(b.stateId)
    || a.sourceUrl.localeCompare(b.sourceUrl)
  );

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  sourceArtifacts: {
    decisionFilePath: path.relative(repoRoot, decisionFilePath),
    sourcePackPlanPath: path.relative(repoRoot, sourcePackPlanPath),
  },
  summary: {
    unresolvedRows: unresolvedRows.length,
    byActionClass: countBy(unresolvedRows, 'actionClass'),
    byDecisionHint: countBy(unresolvedRows, 'decisionHint'),
    byState: countBy(unresolvedRows, 'stateId'),
  },
  rows: unresolvedRows,
};

const mdLines = [
  '# Provider Pull-Now Manual Fill Queue',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  '## Summary',
  '',
  `- unresolved rows: ${payload.summary.unresolvedRows}`,
  '',
  '## By Action Class',
  '',
  ...Object.entries(payload.summary.byActionClass).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## By Decision Hint',
  '',
  ...Object.entries(payload.summary.byDecisionHint).sort((a, b) => b[1] - a[1]).map(([label, count]) => `- ${label}: ${count}`),
  '',
  '## Top Rows',
  '',
];

for (const row of unresolvedRows.slice(0, 20)) {
  mdLines.push(`- ${row.stateId} | ${row.actionClass} | hint=${row.decisionHint} | repeats=${row.repeatCount} | ${row.sourceUrl}`);
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  unresolvedRows: payload.summary.unresolvedRows,
}, null, 2));
