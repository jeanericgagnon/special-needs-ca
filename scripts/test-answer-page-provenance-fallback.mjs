import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const filePath = path.resolve('frontend/src/app/components/answer-page.tsx');
const source = fs.readFileSync(filePath, 'utf8');

assert.match(
  source,
  /const displayLastReviewedDate = data\.lastReviewedDate\?\.trim\(\) \|\| 'Still being verified';/,
  'AnswerPage should expose a safe last-reviewed fallback when provenance is missing.',
);

assert.match(
  source,
  /Last Checked: <strong[^>]*>\{displayLastReviewedDate\}<\/strong>/,
  'AnswerPage should render the safe last-reviewed fallback instead of the raw field.',
);

console.log('answer-page provenance fallback check passed');
