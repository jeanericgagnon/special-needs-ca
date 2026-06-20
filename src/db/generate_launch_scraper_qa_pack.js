import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseFamilyRecord, validateFamilyRecord } from '../../scripts/source-acquisition-lightweight-lib.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = process.env.ABLEFULL_REPO_ROOT
  ? path.resolve(process.env.ABLEFULL_REPO_ROOT)
  : path.resolve(__dirname, '../..');
const docsDir = path.join(repoRoot, 'docs', 'generated');
const runsDir = path.join(repoRoot, 'data', 'source-acquisition-runs');
const generatedDate = new Date().toISOString().slice(0, 10);

const jsonOutPath = path.join(docsDir, `launch-scraper-qa-pack-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-qa-pack-${generatedDate}.md`);

const LAUNCH_FAMILIES = [
  'dd_routing',
  'programs_benefits',
  'waivers',
  'forms_guides',
  'program_waitlists',
  'medicaid_hhs_offices',
  'education_routing',
  'providers_care',
  'knowledge_content',
];

const TARGET_TABLE_BY_FAMILY = {
  dd_routing: 'state_resource_agencies',
  programs_benefits: 'programs',
  waivers: 'programs',
  forms_guides: 'forms_and_guides',
  program_waitlists: 'program_waitlists',
  medicaid_hhs_offices: 'county_offices',
  education_routing: 'regional_education_agencies',
  providers_care: 'resource_providers',
  knowledge_content: 'knowledge_content',
};

const CURATED_REJECTED_REPLAY_CANDIDATES = {
  education_routing: [
    {
      stateId: 'florida',
      sourceUrl: 'https://www.fldoe.org/schools/school-choice/k-12-schools/',
      finalUrl: 'https://www.fldoe.org/schools/school-choice/k-12-schools/',
      savedPath: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-19T00-42-52-835Z', 'pages', '00004-florida-education-routing-florida-school-district-directory.html'),
      expectedReasons: ['missing_basic_signal'],
    },
  ],
  knowledge_content: [
    {
      stateId: 'national',
      sourceUrl: 'https://www.ssa.gov/benefits/disability/apply-child.html',
      finalUrl: 'https://www.ssa.gov/benefits/disability/apply-child.html',
      savedPath: path.join(repoRoot, 'data', 'source-acquisition-runs', '2026-06-18T03-38-52-430Z', 'pages', '00005-national-knowledge-content-ssa-apply-for-child-disability-benefits.html'),
      expectedReasons: ['knowledge_summary_too_thin'],
    },
  ],
};

function readNdjson(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function previewFamilyExtraction(record) {
  const extraction = record.familyExtraction || {};
  const preview = {};
  for (const key of [
    'recordType',
    'officeName',
    'programName',
    'organizationName',
    'articleTitle',
    'contactPhone',
    'contactEmail',
    'contactAddress',
    'officialDownloadUrl',
    'canonicalKnowledgeUrl',
    'publicContactSignalCount',
  ]) {
    if (extraction[key] !== undefined && extraction[key] !== '') {
      preview[key] = extraction[key];
    }
  }
  return preview;
}

function buildCase(runId, status, record) {
  return {
    runId,
    validationStatus: status,
    recordId: record.recordId,
    sourceUrl: record.sourceUrl,
    finalUrl: record.finalUrl,
    savedPath: record.savedPath,
    stateId: record.stateId,
    pageTitle: record.pageTitle,
    canonicalUrl: record.canonicalUrl,
    parseStatus: record.parseStatus,
    validationReasons: record.validationReasons || [],
    familyExtractionPreview: previewFamilyExtraction(record),
  };
}

function buildReplayRow(family, candidate) {
  return {
    stateId: candidate.stateId,
    gapFamily: family,
    targetTable: TARGET_TABLE_BY_FAMILY[family],
    sourceQueue: 'qa_pack_curated_replay',
    sourceUrl: candidate.sourceUrl,
    finalUrl: candidate.finalUrl || candidate.sourceUrl,
    savedPath: candidate.savedPath,
    contentType: 'text/html',
    sourceName: '',
  };
}

function latestRunIds() {
  return fs.existsSync(runsDir)
    ? fs.readdirSync(runsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
      .reverse()
    : [];
}

function pickCase(runIds, family, bucket) {
  for (const runId of runIds) {
    const filePath = path.join(runsDir, runId, 'validated', family, `${bucket}.ndjson`);
    if (!fs.existsSync(filePath)) continue;
    const rows = readNdjson(filePath);
    const row = rows.find((item) => item.savedPath && fs.existsSync(item.savedPath));
    if (!row) continue;
    return buildCase(runId, bucket === 'accepted' ? 'accepted' : 'rejected', row);
  }
  return null;
}

function pickCuratedRejectedReplayCase(family) {
  const candidates = CURATED_REJECTED_REPLAY_CANDIDATES[family] || [];
  for (const candidate of candidates) {
    if (!candidate.savedPath || !fs.existsSync(candidate.savedPath)) continue;
    const html = fs.readFileSync(candidate.savedPath, 'utf8');
    const parsed = parseFamilyRecord(buildReplayRow(family, candidate), html);
    const validation = validateFamilyRecord(parsed);
    if (validation.isAccepted) continue;
    if (candidate.expectedReasons?.length) {
      const matches = candidate.expectedReasons.every((reason) => validation.reasons.includes(reason));
      if (!matches) continue;
    }
    return {
      runId: 'curated_saved_page_replay',
      validationStatus: 'rejected',
      recordId: parsed.recordId,
      sourceUrl: parsed.sourceUrl,
      finalUrl: parsed.finalUrl,
      savedPath: parsed.savedPath,
      stateId: parsed.stateId,
      pageTitle: parsed.pageTitle,
      canonicalUrl: parsed.canonicalUrl,
      parseStatus: parsed.parseStatus,
      validationReasons: validation.reasons,
      familyExtractionPreview: previewFamilyExtraction(parsed),
    };
  }
  return null;
}

const runIds = latestRunIds();

const familyQaPacks = LAUNCH_FAMILIES.map((family) => {
  const acceptedCase = pickCase(runIds, family, 'accepted');
  const rejectedCase = pickCase(runIds, family, 'rejected') || pickCuratedRejectedReplayCase(family);
  return {
    family,
    acceptedCase,
    rejectedCase,
    hasRealAcceptedCase: Boolean(acceptedCase),
    hasRealRejectedCase: Boolean(rejectedCase),
    qaReady: Boolean(acceptedCase || rejectedCase),
    recommendedAssertions: [
      acceptedCase ? 'accepted case should preserve sourceUrl/finalUrl/stateId and expected family extraction' : 'no accepted case currently available',
      rejectedCase ? 'rejected case should preserve validationReasons exactly as saved on disk' : 'no rejected case currently available',
    ],
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'Real-artifact QA pack for launch scraper families using saved accepted and rejected records from source-acquisition runs.',
  familyCount: familyQaPacks.length,
  familyQaPacks,
};

const mdLines = [
  '# Launch Scraper QA Pack',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
];

for (const pack of familyQaPacks) {
  mdLines.push(`## ${pack.family}`);
  mdLines.push('');
  mdLines.push(`- hasRealAcceptedCase: ${pack.hasRealAcceptedCase}`);
  mdLines.push(`- hasRealRejectedCase: ${pack.hasRealRejectedCase}`);
  mdLines.push(`- qaReady: ${pack.qaReady}`);
  if (pack.acceptedCase) {
    mdLines.push('- acceptedCase:');
    mdLines.push(`  - runId: ${pack.acceptedCase.runId}`);
    mdLines.push(`  - stateId: ${pack.acceptedCase.stateId}`);
    mdLines.push(`  - sourceUrl: ${pack.acceptedCase.sourceUrl}`);
    mdLines.push(`  - savedPath: ${pack.acceptedCase.savedPath}`);
    mdLines.push(`  - parseStatus: ${pack.acceptedCase.parseStatus}`);
  }
  if (pack.rejectedCase) {
    mdLines.push('- rejectedCase:');
    mdLines.push(`  - runId: ${pack.rejectedCase.runId}`);
    mdLines.push(`  - stateId: ${pack.rejectedCase.stateId}`);
    mdLines.push(`  - sourceUrl: ${pack.rejectedCase.sourceUrl}`);
    mdLines.push(`  - savedPath: ${pack.rejectedCase.savedPath}`);
    mdLines.push(`  - validationReasons: ${(pack.rejectedCase.validationReasons || []).join(', ')}`);
  }
  mdLines.push(`- recommendedAssertions: ${pack.recommendedAssertions.join(' | ')}`);
  mdLines.push('');
}

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  familyCount: payload.familyCount,
}, null, 2));
