import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const conditionPageSource = fs.readFileSync(
  path.join(repoRoot, 'frontend/src/app/conditions/[slug]/page.tsx'),
  'utf8'
);

assert.match(
  conditionPageSource,
  /resolvePublicSourceVerificationStatus\(null, true\)/,
  'Fallback condition pages should derive honest public-source review labels instead of hardcoding checked verification.'
);

assert.doesNotMatch(
  conditionPageSource,
  /verificationStatus:\s*'official_verified'/,
  'Fallback condition pages should not hardcode official_verified source badges.'
);

assert.doesNotMatch(
  conditionPageSource,
  /Complete Parent Guide/,
  'Fallback condition pages should avoid overclaiming completeness in public titles.'
);

assert.doesNotMatch(
  conditionPageSource,
  /establish qualifying services/,
  'Fallback condition call scripts should avoid implying guaranteed qualifying services.'
);

console.log('condition page trust hardening tests passed');
