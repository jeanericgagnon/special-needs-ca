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
    required: ['SourceFreshnessDisclosure'],
  },
  {
    path: 'frontend/src/app/advocates/page.tsx',
    required: ['SourceFreshnessDisclosure'],
  },
  {
    path: 'frontend/src/app/counties/[state]/page.tsx',
    required: ['SourceFreshnessDisclosure'],
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
    required: ['LaunchToolLanding'],
  },
  {
    path: 'frontend/src/app/ihss-behavior-log/page.tsx',
    required: ['LaunchToolLanding'],
  },
  {
    path: 'frontend/src/app/iep-goals/page.tsx',
    required: ['LaunchToolLanding'],
  },
  {
    path: 'frontend/src/app/regional-center-funding/page.tsx',
    required: ['LaunchToolLanding'],
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

console.log('public route provenance contract tests passed');
