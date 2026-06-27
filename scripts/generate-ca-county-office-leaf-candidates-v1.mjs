import fs from 'node:fs';
import path from 'node:path';

function readNdjson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  if (!raw) return [];
  return raw.split('\n').map((line) => JSON.parse(line));
}

function writeNdjson(filePath, rows) {
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function stripTags(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractLinks(html) {
  const links = [];
  const regex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    links.push({
      href: decodeEntities(match[1]),
      text: decodeEntities(stripTags(match[2])),
    });
  }
  return links;
}

function sameDomain(baseUrl, href) {
  try {
    const base = new URL(baseUrl);
    const resolved = new URL(href, baseUrl);
    return resolved.hostname === base.hostname;
  } catch {
    return false;
  }
}

function toAbsolute(baseUrl, href) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

function scoreLink(link, preferredPathTerms, requiredTerms, supportingTerms, prohibitedTerms) {
  const haystack = `${link.text} ${link.href}`.toLowerCase();
  let score = 0;
  for (const term of preferredPathTerms) {
    if (haystack.includes(term.toLowerCase())) score += 4;
  }
  for (const term of requiredTerms) {
    if (haystack.includes(term.toLowerCase())) score += 5;
  }
  for (const term of supportingTerms) {
    if (haystack.includes(term.toLowerCase())) score += 2;
  }
  for (const term of prohibitedTerms) {
    if (haystack.includes(term.toLowerCase())) score -= 6;
  }
  if (/ihss|in-home supportive|public authority/i.test(link.text)) score += 3;
  return score;
}

function isLikelyNewsOrAnnouncement(link) {
  const haystack = `${link.text} ${link.href}`.toLowerCase();
  return (
    /latest-news|news|press-release|announcement/.test(haystack) ||
    /\b\d{1,2}\/\d{1,2}\/20\d{2}\b/.test(link.text) ||
    /\bmay qualify\b|\breplacement homes\b/.test(haystack)
  );
}

function summarize(rows, key) {
  return rows.reduce((acc, row) => {
    const bucket = String(row[key] || 'unknown');
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

const repoRoot = process.cwd();
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsDir = path.join(repoRoot, 'docs', 'generated');

const repairQueue = readNdjson(path.join(generatedDir, 'ca_county_office_leaf_repair_queue_v1.jsonl'));
const acceptedRows = readNdjson(path.join(repoRoot, 'data', 'source-acquisition-runs', 'ca-v3', 'validated', 'medicaid_hhs_offices', 'accepted.ndjson'));
const acceptedByRecordId = new Map(acceptedRows.map((row) => [row.recordId, row]));

const candidateRows = [];

for (const job of repairQueue) {
  const accepted = acceptedByRecordId.get(job.currentRecordId);
  if (!accepted?.savedPath || !fs.existsSync(accepted.savedPath)) continue;
  const html = fs.readFileSync(accepted.savedPath, 'utf8');
  const links = extractLinks(html)
    .filter((link) => link.href && !link.href.startsWith('javascript:'))
    .filter((link) => sameDomain(accepted.finalUrl || accepted.sourceUrl, link.href))
    .map((link) => ({
      ...link,
      absoluteUrl: toAbsolute(accepted.finalUrl || accepted.sourceUrl, link.href),
      score: scoreLink(link, job.preferredPathTerms || [], job.requiredTerms || [], job.supportingTerms || [], job.prohibitedTerms || []),
    }))
    .filter((link) => !isLikelyNewsOrAnnouncement(link))
    .filter((link) => link.score > 0)
    .sort((a, b) => b.score - a.score || a.absoluteUrl.localeCompare(b.absoluteUrl));

  const deduped = [];
  const seen = new Set();
  for (const link of links) {
    if (seen.has(link.absoluteUrl)) continue;
    seen.add(link.absoluteUrl);
    deduped.push(link);
    if (deduped.length >= 5) break;
  }

  for (const link of deduped) {
    candidateRows.push({
      jobId: job.jobId,
      countyId: job.countyId,
      currentRecordId: job.currentRecordId,
      baseUrl: accepted.finalUrl || accepted.sourceUrl,
      candidateUrl: link.absoluteUrl,
      linkText: link.text,
      linkHref: link.href,
      score: link.score,
      likelyAgency: job.likelyAgency,
      acceptanceRule: job.acceptanceRule,
      desiredProgramId: job.desiredProgramId,
      discoverySource: 'existing_saved_homepage_html',
    });
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  totalCandidates: candidateRows.length,
  countiesWithCandidates: Array.from(new Set(candidateRows.map((row) => row.countyId))).sort(),
  byCounty: summarize(candidateRows, 'countyId'),
};

const jsonlPath = path.join(generatedDir, 'ca_county_office_leaf_candidates_v1.jsonl');
const jsonPath = path.join(generatedDir, 'ca_county_office_leaf_candidates_summary_v1.json');
const mdPath = path.join(docsDir, 'ca-county-office-leaf-candidates-v1.md');

writeNdjson(jsonlPath, candidateRows);
writeJson(jsonPath, summary);
fs.writeFileSync(
  mdPath,
  [
    '# California County Office Leaf Candidates v1',
    '',
    `- Total candidates: \`${summary.totalCandidates}\``,
    `- Counties with candidates: \`${summary.countiesWithCandidates.join(', ')}\``,
    '',
    '## Candidates By County',
    ...Object.entries(summary.byCounty).map(([label, count]) => `- ${label}: ${count}`),
    '',
  ].join('\n') + '\n',
);

console.log(JSON.stringify({ jsonlPath, jsonPath, mdPath, summary }, null, 2));
