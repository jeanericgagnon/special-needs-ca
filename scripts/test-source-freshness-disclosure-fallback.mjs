import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const filePath = path.resolve('frontend/src/app/components/SourceFreshnessDisclosure.tsx');
const source = fs.readFileSync(filePath, 'utf8');

assert.match(
  source,
  /const hasSources = Array\.isArray\(sources\) && sources\.length > 0;/,
  'SourceFreshnessDisclosure should detect whether reviewable sources actually exist.',
);

assert.match(
  source,
  /const shouldRender = hasSources \|\| Boolean\(correctionTargetId \|\| correctionTargetName\);/,
  'SourceFreshnessDisclosure should stay visible when a correction path exists even if sources are still missing.',
);

assert.match(
  source,
  /We are still verifying the direct public source notes for this surface\./,
  'SourceFreshnessDisclosure should explain missing source notes instead of disappearing entirely.',
);

console.log('source freshness disclosure fallback tests passed');
