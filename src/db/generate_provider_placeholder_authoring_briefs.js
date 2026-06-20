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
const jsonOutPath = path.join(docsDir, `provider-placeholder-authoring-briefs-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `provider-placeholder-authoring-briefs-${generatedDate}.md`);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] || 'unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function findLatestGeneratedJson(prefix) {
  const entries = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir)
      .filter((name) => name.startsWith(prefix) && name.endsWith('.json'))
      .sort()
    : [];

  if (entries.length === 0) {
    throw new Error(`Missing generated artifact for prefix: ${prefix}`);
  }

  return path.join(docsDir, entries[entries.length - 1]);
}

function titleCaseStateId(stateId) {
  return String(stateId || '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildSearchQueries(stateName) {
  return [
    `${stateName} children's hospital developmental pediatrics site:.org`,
    `${stateName} university children's hospital autism center site:.edu`,
    `${stateName} pediatric therapy hospital autism clinic site:.org`,
    `${stateName} children's specialty clinic developmental behavioral pediatrics`,
  ];
}

function buildPreferredTargetArchetypes(stateName) {
  return [
    {
      archetype: 'children_hospital',
      desiredCount: 2,
      why: `Named pediatric hospital systems are the fastest path to trustworthy provider rows in ${stateName}.`,
    },
    {
      archetype: 'university_clinic',
      desiredCount: 1,
      why: `Academic medical centers often publish specialty developmental or autism clinic pages with stronger location and contact evidence.`,
    },
    {
      archetype: 'specialty_center',
      desiredCount: 1,
      why: `A named developmental, autism, neurology, or behavioral center can add depth without relying on generic hospital landing pages.`,
    },
  ];
}

function buildExclusions() {
  return [
    'Do not keep generic national domains that are not clearly state-specific provider sources.',
    'Do not use aggregator, ranking, or directory pages as replacement targets.',
    'Do not use broad hospital homepages when a named pediatric, autism, developmental, or specialty clinic page exists.',
    'Do not promote any authored replacement until it is first-party and carries usable contact or location evidence.',
  ];
}

const queuePath = findLatestGeneratedJson('provider-placeholder-replacement-queue-');
const queue = readJson(queuePath);
const rows = queue.rows || [];

const grouped = new Map();
for (const row of rows) {
  const key = row.stateId;
  if (!grouped.has(key)) {
    const stateName = row.stateName || titleCaseStateId(row.stateId);
    grouped.set(key, {
      stateId: row.stateId,
      stateName,
      sourceTargetsPath: row.sourceTargetsPath,
      replacementGoal: `Replace the provider placeholder targets for ${stateName} with a shared set of named first-party provider targets.`,
      desiredAuthoredTargetCount: 4,
      preferredTargetArchetypes: buildPreferredTargetArchetypes(stateName),
      searchQueries: buildSearchQueries(stateName),
      exclusionRules: buildExclusions(),
      expectedFields: [
        'source_name',
        'source_url',
        'domain',
        'target_table=resource_providers',
        'crawl_method',
        'organization_type',
        'expected_extraction_fields=name, phone, address',
        'notes',
      ],
      promotionRule: 'Use authored replacement targets only for first-party provider page acquisition; do not promote provider rows unless extracted records pass public-safe validation.',
      placeholderTargets: [],
    });
  }

  grouped.get(key).placeholderTargets.push({
    placeholderSourceName: row.placeholderSourceName,
    placeholderSourceUrl: row.placeholderSourceUrl,
    domain: row.domain,
    crawlMethod: row.crawlMethod,
    notes: row.notes || '',
    followupType: row.followupType || '',
  });
}

const briefs = [...grouped.values()].map((brief) => ({
  ...brief,
  placeholderTargetCount: brief.placeholderTargets.length,
}));

const payload = {
  briefId: 'provider_placeholder_authoring_briefs',
  generatedAt: generatedDate,
  sourceQueue: path.relative(repoRoot, queuePath),
  purpose: 'Deterministic authoring briefs for replacing placeholder provider targets with stronger first-party hospital, university clinic, and specialty-center sources.',
  summary: {
    totalBriefs: briefs.length,
    byState: countBy(briefs, 'stateId'),
  },
  briefs,
};

const mdLines = [
  '# Provider Placeholder Authoring Briefs',
  '',
  `Generated: ${generatedDate}`,
  '',
  'These briefs turn provider placeholder replacement rows into repeatable authoring instructions for adding stronger first-party source targets.',
  '',
  '## Summary',
  '',
  `- total briefs: ${payload.summary.totalBriefs}`,
  '',
];

for (const brief of briefs) {
  mdLines.push(
    `## ${brief.stateName}`,
    '',
    `- source targets file: ${brief.sourceTargetsPath}`,
    `- placeholder target count: ${brief.placeholderTargetCount}`,
    `- replacement goal: ${brief.replacementGoal}`,
    `- desired authored target count: ${brief.desiredAuthoredTargetCount}`,
    '',
    'Placeholder targets to replace:',
    '',
    ...brief.placeholderTargets.map((item) => `- ${item.placeholderSourceName} (${item.placeholderSourceUrl})`),
    '',
    'Preferred target archetypes:',
    '',
    ...brief.preferredTargetArchetypes.map((item) => `- ${item.archetype}: ${item.desiredCount} | ${item.why}`),
    '',
    'Suggested search queries:',
    '',
    ...brief.searchQueries.map((query) => `- ${query}`),
    '',
    'Exclusion rules:',
    '',
    ...brief.exclusionRules.map((rule) => `- ${rule}`),
    '',
    'Expected authored fields:',
    '',
    ...brief.expectedFields.map((field) => `- ${field}`),
    '',
    `- promotion rule: ${brief.promotionRule}`,
    ''
  );
}

mdLines.push('## Files', '', `- JSON briefs: ${path.relative(repoRoot, jsonOutPath)}`, `- Source queue: ${path.relative(repoRoot, queuePath)}`);

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: generatedDate,
  briefs: {
    json: jsonOutPath,
    md: mdOutPath,
  },
  summary: payload.summary,
}, null, 2));
