import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

const provenanceBackedRoutes = [
  {
    path: 'frontend/src/app/page.tsx',
    required: ['SourceFreshnessDisclosure'],
  },
  {
    path: 'frontend/src/app/forms/page.tsx',
    required: ['SourceFreshnessDisclosure', 'correctionTargetId={`forms-${stateId}`}', 'correctionButtonLabel="Report a forms source issue"'],
  },
  {
    path: 'frontend/src/app/forms-checklist/page.tsx',
    required: ['LaunchToolLanding', 'disclaimer=', 'sources={sources}', 'correctionSuggestionType="other"'],
  },
  {
    path: 'frontend/src/app/advocates/page.tsx',
    required: ['SourceFreshnessDisclosure'],
  },
  {
    path: 'frontend/src/app/advocates/advocate-directory-client.tsx',
    required: ['SourceFreshnessDisclosure', 'correctionSuggestionType="advocate"', 'correctionButtonLabel="Report an advocate listing issue"'],
  },
  {
    path: 'frontend/src/app/counties/[state]/page.tsx',
    required: ['SourceFreshnessDisclosure'],
  },
  {
    path: 'frontend/src/app/find-help/find-help-client.tsx',
    required: ['SourceFreshnessDisclosure', 'correctionTargetId={`find-help-${stateId}`}', 'correctionButtonLabel="Report a directory or source issue"'],
  },
  {
    path: 'frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx',
    required: ['SourceFreshnessDisclosure'],
  },
  {
    path: 'frontend/src/app/benefits/[state]/[[...slug]]/page.tsx',
    required: ['SourceFreshnessDisclosure'],
  },
  {
    path: 'frontend/src/app/benefits/page.tsx',
    required: ['LaunchToolLanding', 'disclaimer=', 'sources={sources}', 'correctionSuggestionType="program"'],
  },
  {
    path: 'frontend/src/app/benefits-matcher/page.tsx',
    required: ['LaunchToolLanding', 'disclaimer=', 'sources={sources}', 'correctionSuggestionType="program"'],
  },
  {
    path: 'frontend/src/app/ihss-behavior-log/page.tsx',
    required: ['LaunchToolLanding', 'disclaimer=', 'sources={sources}', 'correctionSuggestionType="other"'],
  },
  {
    path: 'frontend/src/app/iep-goals/page.tsx',
    required: ['LaunchToolLanding', 'disclaimer=', 'sources={sources}', 'correctionSuggestionType="other"'],
  },
  {
    path: 'frontend/src/app/regional-center-funding/page.tsx',
    required: ['LaunchToolLanding', 'disclaimer=', 'sources={sources}', 'correctionSuggestionType="other"'],
  },
  {
    path: 'frontend/src/app/programs/[slug]/page.tsx',
    required: ['AnswerPage', 'getSeoPolicyForRoute'],
  },
  {
    path: 'frontend/src/app/conditions/[slug]/page.tsx',
    required: ['AnswerPage', 'getSeoPolicyForRoute'],
  },
  {
    path: 'frontend/src/app/deadlines/[slug]/page.tsx',
    required: ['AnswerPage', 'getSeoPolicyForRoute'],
  },
  {
    path: 'frontend/src/app/situations/[slug]/page.tsx',
    required: ['AnswerPage', 'getSeoPolicyForRoute'],
  },
  {
    path: 'frontend/src/app/forms/[slug]/page.tsx',
    required: ['AnswerPage', 'getSeoPolicyForRoute'],
  },
];

const syntheticFreshnessFreeRoutes = [
  'frontend/src/app/page.tsx',
  'frontend/src/app/benefits/page.tsx',
  'frontend/src/app/benefits-matcher/page.tsx',
  'frontend/src/app/wizard-client.tsx',
  'frontend/src/app/find-help/find-help-client.tsx',
  'frontend/src/app/forms-checklist/page.tsx',
  'frontend/src/app/ihss-behavior-log/page.tsx',
  'frontend/src/app/iep-goals/page.tsx',
  'frontend/src/app/regional-center-funding/page.tsx',
];

const launchEntryRoutesNeedingReviewedDates = [
  'frontend/src/app/page.tsx',
  'frontend/src/app/benefits/page.tsx',
  'frontend/src/app/benefits-matcher/page.tsx',
  'frontend/src/app/wizard-client.tsx',
  'frontend/src/app/find-help/find-help-client.tsx',
  'frontend/src/app/forms-checklist/page.tsx',
  'frontend/src/app/ihss-behavior-log/page.tsx',
  'frontend/src/app/iep-goals/page.tsx',
  'frontend/src/app/regional-center-funding/page.tsx',
];

for (const route of provenanceBackedRoutes) {
  const content = read(route.path);
  for (const requiredText of route.required) {
    assert.match(
      content,
      new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      `${route.path} should include ${requiredText}`,
    );
  }
}

const countiesStateHub = read('frontend/src/app/counties/[state]/page.tsx');
const homepage = read('frontend/src/app/page.tsx');
const findHelpPage = read('frontend/src/app/find-help/page.tsx');
const answerPage = read('frontend/src/app/components/answer-page.tsx');

assert.match(
  countiesStateHub,
  /verificationStatus:\s*record\.verification_status\s*\|\|\s*undefined/,
  'State county hub disclosure sources should preserve per-record verification status for public provenance display.',
);

assert.match(
  homepage,
  /SourceFreshnessDisclosure/,
  'Homepage should expose a public source freshness disclosure for the launch matcher surface.',
);

assert.match(
  homepage,
  /does not promise approval, eligibility, or payment amounts on this public homepage/i,
  'Homepage should include an explicit public disclaimer so the indexable matcher surface does not read like a promise of eligibility or benefits.',
);

assert.match(
  homepage,
  /correctionButtonLabel="Report a homepage source issue"/,
  'Homepage provenance disclosure should include a direct public correction CTA.',
);

assert.match(
  answerPage,
  /This summary is informational, may include estimates, and should be checked against the linked public sources before you act on it\./,
  'AnswerPage should include an explicit public disclaimer on the quick-answer surface before families rely on the summary.',
);

assert.match(
  answerPage,
  /Suggest a public source to review/,
  'AnswerPage should offer a public source-suggestion CTA when direct source-backed evidence is still missing.',
);

assert.match(
  findHelpPage,
  /robots:\s*\{[\s\S]*index:\s*false,[\s\S]*follow:\s*true,[\s\S]*\}/,
  'Find-help hub should remain noindex while it aggregates mixed-quality linked surfaces.',
);

const benefitsStateRoute = read('frontend/src/app/benefits/[state]/[[...slug]]/page.tsx');
assert.match(
  benefitsStateRoute,
  /correctionTargetId=/,
  'Benefits state/county surfaces should provide a route-specific correction target to the provenance disclosure.',
);

assert.match(
  benefitsStateRoute,
  /correctionButtonLabel="Report a source or routing issue"/,
  'Benefits state/county provenance disclosure should provide a public correction CTA for source or routing issues.',
);

for (const routePath of syntheticFreshnessFreeRoutes) {
  const content = read(routePath);
  assert.doesNotMatch(
    content,
    /LAST_REVIEWED_DATE|lastReviewedDate:\s*['"`]20/,
    `${routePath} should not hardcode a synthetic public last-reviewed date for launch disclosures.`,
  );
}

for (const routePath of launchEntryRoutesNeedingReviewedDates) {
  const content = read(routePath);
  assert.match(
    content,
    /lastReviewedDate:/,
    `${routePath} should expose a reviewed date on its public source disclosure entries.`,
  );
}

console.log('public route provenance contract tests passed');
