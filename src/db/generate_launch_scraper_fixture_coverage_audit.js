import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `launch-scraper-fixture-coverage-audit-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-fixture-coverage-audit-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const qaPackPath = path.join(docsDir, `launch-scraper-qa-pack-${generatedDate}.json`);
if (!fs.existsSync(qaPackPath)) {
  throw new Error(`Missing QA pack: ${qaPackPath}`);
}

const qaPack = readJson(qaPackPath);
const rows = (qaPack.familyQaPacks || []).map((pack) => {
  const accepted = Boolean(pack.hasRealAcceptedCase);
  const rejected = Boolean(pack.hasRealRejectedCase);
  const coverageClass = accepted && rejected
    ? 'accepted_and_rejected'
    : accepted
      ? 'accepted_only'
      : rejected
        ? 'rejected_only'
        : 'no_real_cases';
  return {
    family: pack.family,
    hasRealAcceptedCase: accepted,
    hasRealRejectedCase: rejected,
    coverageClass,
    replayReady: accepted || rejected,
    gap: accepted && rejected ? '' : accepted ? 'missing_rejected_case' : rejected ? 'missing_accepted_case' : 'missing_all_cases',
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'Coverage audit for launch scraper real-fixture replay so weak family verification depth is explicit.',
  familyCount: rows.length,
  summary: {
    acceptedAndRejectedFamilies: rows.filter((row) => row.coverageClass === 'accepted_and_rejected').length,
    acceptedOnlyFamilies: rows.filter((row) => row.coverageClass === 'accepted_only').length,
    rejectedOnlyFamilies: rows.filter((row) => row.coverageClass === 'rejected_only').length,
    noRealCaseFamilies: rows.filter((row) => row.coverageClass === 'no_real_cases').length,
    missingRejectedFamilies: rows.filter((row) => row.gap === 'missing_rejected_case').map((row) => row.family),
    missingAcceptedFamilies: rows.filter((row) => row.gap === 'missing_accepted_case').map((row) => row.family),
  },
  rows,
};

const mdLines = [
  '# Launch Scraper Fixture Coverage Audit',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  '## Summary',
  '',
  `- acceptedAndRejectedFamilies: ${payload.summary.acceptedAndRejectedFamilies}`,
  `- acceptedOnlyFamilies: ${payload.summary.acceptedOnlyFamilies}`,
  `- rejectedOnlyFamilies: ${payload.summary.rejectedOnlyFamilies}`,
  `- noRealCaseFamilies: ${payload.summary.noRealCaseFamilies}`,
  `- missingRejectedFamilies: ${(payload.summary.missingRejectedFamilies || []).join(', ') || 'none'}`,
  `- missingAcceptedFamilies: ${(payload.summary.missingAcceptedFamilies || []).join(', ') || 'none'}`,
  '',
  '## Family Coverage',
  '',
];

for (const row of rows) {
  mdLines.push(`- ${row.family}: ${row.coverageClass}${row.gap ? ` (${row.gap})` : ''}`);
}
mdLines.push('');

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  summary: payload.summary,
}, null, 2));
