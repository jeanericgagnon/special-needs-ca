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

const jsonOutPath = path.join(docsDir, `launch-scraper-false-positive-taxonomy-${generatedDate}.json`);
const mdOutPath = path.join(docsDir, `launch-scraper-false-positive-taxonomy-${generatedDate}.md`);

function readJson(prefix) {
  const matches = fs.existsSync(docsDir)
    ? fs.readdirSync(docsDir).filter((name) => name.startsWith(prefix) && name.endsWith('.json')).sort()
    : [];
  if (!matches.length) {
    throw new Error(`Missing generated input for prefix "${prefix}"`);
  }
  const filePath = path.join(docsDir, matches.at(-1));
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const qaPack = readJson('launch-scraper-qa-pack-');
const queueGovernance = readJson('launch-scraper-queue-governance-');
const fixtureMatrix = readJson('launch-scraper-fixture-matrix-');

const rejectedByFamily = new Map(
  (qaPack.familyQaPacks || [])
    .filter((pack) => pack.rejectedCase)
    .map((pack) => [pack.family, pack.rejectedCase]),
);

const fixtureByFamily = new Map((fixtureMatrix.familyFixtureMatrix || []).map((row) => [row.family, row]));

const taxonomyClasses = [
  {
    taxonomyClass: 'blocked_error_shell',
    appliesToFamilies: ['education_routing', 'knowledge_content', 'programs_benefits', 'waivers', 'program_waitlists'],
    detectionSignals: [
      'pageTitle or heading contains Access Denied, Page Not Found, 404, 403, or Forbidden',
      'text sample contains request-blocked or permission-denied language',
      'page identity is generic error text rather than a real program, routing body, or article title',
    ],
    validatorOutcomes: ['missing_basic_signal', 'missing_action_signal', 'knowledge_summary_too_thin'],
    queueDisposition: 'defer_blocked_source',
    nextLane: 'repair_first',
    rationale: 'Blocked or error shells should never count as successful fetch depth, even when they technically contain a link or browser chrome.',
    exampleFamilies: ['education_routing', 'knowledge_content'],
  },
  {
    taxonomyClass: 'generic_program_shell',
    appliesToFamilies: ['programs_benefits', 'waivers', 'program_waitlists'],
    detectionSignals: [
      'page names a department or agency shell rather than a distinct program or waiver',
      'no explicit action path survives except generic site navigation',
      'program identity depends on page chrome instead of content-specific headings or steps',
    ],
    validatorOutcomes: ['missing_program_name', 'missing_action_signal'],
    queueDisposition: 'promotion_only',
    nextLane: 'author_first',
    rationale: 'Generic agency shells create false program coverage and should be replaced with exact actionable program targets.',
    exampleFamilies: ['programs_benefits', 'waivers', 'program_waitlists'],
  },
  {
    taxonomyClass: 'contactless_directory_shell',
    appliesToFamilies: ['education_routing', 'medicaid_hhs_offices', 'dd_routing', 'providers_care'],
    detectionSignals: [
      'no phone, no email, and no credible routing or office path on the captured page',
      'directory or locator shell exists, but the saved page never resolves to a concrete office, district, or provider contact',
      'entity name can be extracted, but actionable contact/location evidence is missing',
    ],
    validatorOutcomes: ['missing_basic_signal', 'missing_office_phone', 'missing_office_address', 'missing_provider_contact_signal', 'missing_dd_contact_signal'],
    queueDisposition: 'repair_first',
    nextLane: 'author_first',
    rationale: 'A shell directory without contact evidence should trigger more exact targeting or repair, not count as live searchable help.',
    exampleFamilies: ['education_routing', 'medicaid_hhs_offices', 'providers_care'],
  },
  {
    taxonomyClass: 'thin_or_untrusted_knowledge_shell',
    appliesToFamilies: ['knowledge_content'],
    detectionSignals: [
      'summary is too thin to be useful after boilerplate removal',
      'source is not official or not on the high-trust allowlist',
      'article title is present, but the captured page is effectively blocked boilerplate or generic legal text with no journey value',
    ],
    validatorOutcomes: ['knowledge_requires_high_trust_source', 'missing_knowledge_title', 'knowledge_summary_too_thin'],
    queueDisposition: 'defer_blocked_source',
    nextLane: 'author_first',
    rationale: 'Knowledge pages should be promoted only when the public article is trustworthy and materially useful, not merely crawlable.',
    exampleFamilies: ['knowledge_content'],
  },
];

function enrichWithExamples(row) {
  const examples = row.exampleFamilies
    .map((family) => {
      const rejected = rejectedByFamily.get(family);
      const fixture = fixtureByFamily.get(family);
      if (!rejected) return null;
      return {
        family,
        sourceUrl: rejected.sourceUrl,
        pageTitle: rejected.pageTitle,
        validationReasons: rejected.validationReasons || [],
        savedPath: rejected.savedPath,
        expectedNegativeFixtures: fixture?.negativeFixtures?.map((item) => ({
          description: item.description,
          expectedRejectionReasons: item.expectedRejectionReasons,
        })) || [],
      };
    })
    .filter(Boolean);

  return {
    ...row,
    queueAllowedNextLanes: row.queueDisposition
      ? (queueGovernance.launchNeedClassRules || []).find((rule) => rule.class === row.queueDisposition)?.allowedNextLanes || []
      : [],
    examples,
  };
}

const rows = taxonomyClasses.map(enrichWithExamples);

const payload = {
  generatedAt: new Date().toISOString(),
  generatedDate,
  purpose: 'False-positive taxonomy for launch scraper families so blocked/error shells, generic agency pages, and weak directory captures are handled consistently across validator, queue, and QA surfaces.',
  classCount: rows.length,
  rows,
  invariants: [
    'A blocked or error shell must never count as successful family coverage.',
    'A generic agency shell must not be promoted as a program or waiver just because it has navigation links.',
    'A contactless directory shell must move into repair/authoring rather than counting as local office or provider depth.',
    'A thin or untrusted knowledge shell must stay out of public article coverage until a reviewed replacement exists.',
  ],
};

const mdLines = [
  '# Launch Scraper False-Positive Taxonomy',
  '',
  `Generated: ${payload.generatedAt}`,
  '',
  payload.purpose,
  '',
  `- classCount: ${payload.classCount}`,
  '',
  '## Classes',
  '',
  '| class | families | validator outcomes | queue disposition | next lane |',
  '|---|---|---|---|---|',
];

for (const row of rows) {
  mdLines.push(`| ${row.taxonomyClass} | ${row.appliesToFamilies.join(', ')} | ${row.validatorOutcomes.join(', ')} | ${row.queueDisposition} | ${row.nextLane} |`);
}

for (const row of rows) {
  mdLines.push('', `## ${row.taxonomyClass}`, '');
  mdLines.push(`- appliesToFamilies: ${row.appliesToFamilies.join(', ')}`);
  mdLines.push(`- detectionSignals: ${row.detectionSignals.join(' | ')}`);
  mdLines.push(`- validatorOutcomes: ${row.validatorOutcomes.join(', ')}`);
  mdLines.push(`- queueDisposition: ${row.queueDisposition}`);
  mdLines.push(`- queueAllowedNextLanes: ${row.queueAllowedNextLanes.join(', ') || 'none'}`);
  mdLines.push(`- nextLane: ${row.nextLane}`);
  mdLines.push(`- rationale: ${row.rationale}`);
  if (row.examples.length) {
    mdLines.push('- examples:');
    for (const example of row.examples) {
      mdLines.push(`  - ${example.family}: ${example.pageTitle}`);
      mdLines.push(`    - sourceUrl: ${example.sourceUrl}`);
      mdLines.push(`    - validationReasons: ${(example.validationReasons || []).join(', ')}`);
      mdLines.push(`    - savedPath: ${example.savedPath}`);
    }
  }
}

mdLines.push('', '## Invariants', '');
for (const item of payload.invariants) {
  mdLines.push(`- ${item}`);
}
mdLines.push('');

fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(jsonOutPath, `${JSON.stringify(payload, null, 2)}\n`);
fs.writeFileSync(mdOutPath, `${mdLines.join('\n')}\n`);

console.log(JSON.stringify({
  generatedAt: payload.generatedAt,
  json: jsonOutPath,
  markdown: mdOutPath,
  classCount: payload.classCount,
}, null, 2));
