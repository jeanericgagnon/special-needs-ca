import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const wizardSource = fs.readFileSync(
  path.join(repoRoot, 'frontend/src/app/wizard-client.tsx'),
  'utf8'
);

assert.match(
  wizardSource,
  /const WIZARD_SOURCE_CONFIDENCE = 0\.94;/,
  'The public benefits matcher should declare an explicit source-confidence baseline.'
);

assert.match(
  wizardSource,
  /const WIZARD_LAST_REVIEWED_DATE = '2026-06-27';/,
  'The public benefits matcher should declare an explicit last-reviewed date for its disclosure sources.'
);

assert.match(
  wizardSource,
  /confidenceScore: WIZARD_SOURCE_CONFIDENCE,/,
  'Each matcher disclosure source should expose a confidence score.'
);

assert.match(
  wizardSource,
  /lastReviewedDate: WIZARD_LAST_REVIEWED_DATE,/,
  'Each matcher disclosure source should expose a last-reviewed date.'
);

assert.doesNotMatch(
  wizardSource,
  /Official Site/,
  'Matcher result links should avoid claiming every program link is an official site.'
);

assert.match(
  wizardSource,
  /<Globe size=\{14\} \/> Source Page/,
  'Matcher result links should use evidence-safe source wording.'
);

console.log('wizard provenance hardening tests passed');
