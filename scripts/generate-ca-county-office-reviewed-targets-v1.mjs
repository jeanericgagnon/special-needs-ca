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
const candidateRows = readNdjson(path.join(generatedDir, 'ca_county_office_leaf_candidates_v1.jsonl'));

const candidatesByCounty = new Map();
for (const row of candidateRows) {
  const bucket = candidatesByCounty.get(row.countyId) || [];
  bucket.push(row);
  candidatesByCounty.set(row.countyId, bucket);
}

const reviewedTargets = [];
const unresolvedRows = [];

for (const job of repairQueue) {
  const countyCandidates = (candidatesByCounty.get(job.countyId) || [])
    .sort((a, b) => b.score - a.score || a.candidateUrl.localeCompare(b.candidateUrl));

  if (!countyCandidates.length) {
    unresolvedRows.push({
      countyId: job.countyId,
      currentRecordId: job.currentRecordId,
      currentRootUrl: job.currentRootUrl,
      likelyAgency: job.likelyAgency,
      unresolvedReason: 'no_same_domain_leaf_candidate_found_in_saved_homepage',
      nextAction: 'manual_authoring_or_one_hop_live_navigation',
      desiredProgramId: job.desiredProgramId,
      targetFamily: job.targetFamily,
    });
    continue;
  }

  const topCandidates = countyCandidates.slice(0, 2);
  for (const candidate of topCandidates) {
    reviewedTargets.push({
      state: 'california',
      countyId: job.countyId,
      currentRecordId: job.currentRecordId,
      targetFamily: job.targetFamily,
      targetTable: job.targetTable,
      desiredProgramId: job.desiredProgramId,
      likelyAgency: job.likelyAgency,
      reviewedStatus: candidate.score >= 10 ? 'high_confidence_leaf_candidate' : 'medium_confidence_leaf_candidate',
      candidateUrl: candidate.candidateUrl,
      linkText: candidate.linkText,
      score: candidate.score,
      acceptanceRule: job.acceptanceRule,
      source: 'saved_homepage_leaf_mining_v1',
    });
  }
}

const summary = {
  generatedAt: new Date().toISOString(),
  reviewedTargetCount: reviewedTargets.length,
  unresolvedCounties: unresolvedRows.map((row) => row.countyId),
  byReviewedStatus: summarize(reviewedTargets, 'reviewedStatus'),
};

const reviewedPath = path.join(generatedDir, 'ca_county_office_reviewed_targets_v1.jsonl');
const unresolvedPath = path.join(generatedDir, 'ca_county_office_unresolved_leaf_gaps_v1.jsonl');
const summaryPath = path.join(generatedDir, 'ca_county_office_reviewed_targets_summary_v1.json');
const mdPath = path.join(docsDir, 'ca-county-office-reviewed-targets-v1.md');

writeNdjson(reviewedPath, reviewedTargets);
writeNdjson(unresolvedPath, unresolvedRows);
writeJson(summaryPath, summary);
fs.writeFileSync(
  mdPath,
  [
    '# California County Office Reviewed Targets v1',
    '',
    `- Reviewed targets: \`${summary.reviewedTargetCount}\``,
    `- Unresolved counties: \`${summary.unresolvedCounties.join(', ') || 'none'}\``,
    '',
    '## Reviewed Status',
    ...Object.entries(summary.byReviewedStatus).map(([label, count]) => `- ${label}: ${count}`),
    '',
  ].join('\n') + '\n',
);

console.log(JSON.stringify({ reviewedPath, unresolvedPath, summaryPath, mdPath, summary }, null, 2));
