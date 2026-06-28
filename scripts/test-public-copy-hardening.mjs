import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

const answerPage = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/components/answer-page.tsx'), 'utf8');
const ihssBehaviorLog = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/ihss-behavior-log/behavior-log-client.tsx'), 'utf8');
const countyBenefitsPage = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/benefits/[state]/[[...slug]]/page.tsx'), 'utf8');

assert.match(
  answerPage,
  /Download Source-Backed Form/,
  'Document download CTA should not label every linked form as official.'
);

assert.doesNotMatch(
  answerPage,
  /Download Official Form/,
  'Document download CTA should avoid unsupported official-form wording.'
);

assert.match(
  ihssBehaviorLog,
  />\s*24-HOUR BEHAVIOR & SAFETY LOG\s*</,
  'Printed IHSS safety log should avoid claiming official status.'
);

assert.doesNotMatch(
  ihssBehaviorLog,
  /OFFICIAL 24-HOUR BEHAVIOR & SAFETY LOG/,
  'Printed IHSS safety log should not present itself as official.'
);

assert.match(
  countyBenefitsPage,
  /Visit Source Page/,
  'Program CTA should use evidence-safe source wording.'
);

assert.doesNotMatch(
  countyBenefitsPage,
  /Visit Official Agency Source/,
  'Program CTA should avoid assuming every linked source is an official agency page.'
);

console.log('public copy hardening tests passed');
