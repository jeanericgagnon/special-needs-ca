import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

const answerPage = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/components/answer-page.tsx'), 'utf8');
const ihssBehaviorLog = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/ihss-behavior-log/behavior-log-client.tsx'), 'utf8');
const countyBenefitsPage = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/benefits/[state]/[[...slug]]/page.tsx'), 'utf8');
const correctionFlow = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/counties/components/CorrectionFlow.tsx'), 'utf8');
const footer = fs.readFileSync(path.join(repoRoot, 'src/components/Footer.jsx'), 'utf8');
const editorialDisclosure = fs.readFileSync(path.join(repoRoot, 'frontend/src/components/editorial-disclosure.tsx'), 'utf8');
const seoPolicy = fs.readFileSync(path.join(repoRoot, 'frontend/src/lib/seo-policy.ts'), 'utf8');

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
  answerPage,
  /\$\\?\{countyWageDisclosure\.hourlyRate\.toFixed\(2\)\}\/hour estimate/,
  'AnswerPage should label county IHSS values as estimates.'
);

assert.doesNotMatch(
  answerPage,
  /\$\\?\{countyWageDisclosure\.hourlyRate\.toFixed\(2\)\}\/hr/,
  'AnswerPage should avoid rendering county IHSS values like hard rates.'
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

assert.doesNotMatch(
  correctionFlow,
  /Source-backed checked official contact/,
  'County trust badge should avoid overstating a listing as an official contact.'
);

assert.match(
  correctionFlow,
  /Source-backed checked public contact/,
  'County trust badge should use softer public-contact wording for checked official-source listings.'
);

assert.match(
  correctionFlow,
  /Official public source linked/,
  'County trust badge should distinguish a linked official public source from a verified contact claim.'
);

assert.doesNotMatch(
  footer,
  /\bLast database audit:\b/i,
  'Footer should not ship a fake sitewide freshness stamp.'
);

assert.doesNotMatch(
  footer,
  /\bBuilt to wow families\b/i,
  'Footer should avoid throwaway marketing copy on a public trust surface.'
);

assert.match(
  footer,
  /Check each page for source links and last checked dates\./,
  'Footer should direct families to page-level provenance instead of claiming one global freshness date.'
);

assert.doesNotMatch(
  `${answerPage}\n${countyBenefitsPage}\n${footer}\n${ihssBehaviorLog}`,
  /\bwagers\b/i,
  'Public app copy must not contain the wagers typo.'
);

assert.doesNotMatch(
  `${editorialDisclosure}\n${seoPolicy}`,
  /\bcrawler-verified\b/i,
  'Public trust surfaces should not label content as crawler-verified.'
);

assert.match(
  editorialDisclosure,
  /Public source linked from/,
  'Editorial disclosure should use softer public-source wording instead of automated verification claims.'
);

console.log('public copy hardening tests passed');
