import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getClusterSourceConfidence } from '../frontend/src/lib/seo-data.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

assert.equal(getClusterSourceConfidence(null), null);
assert.equal(getClusterSourceConfidence(undefined), null);
assert.equal(
  getClusterSourceConfidence({
    officialSources: [
      { name: 'A', url: 'https://example.org/a' },
      { name: 'B', url: 'https://example.org/b', confidenceScore: null },
    ],
  }),
  null
);

const averagedConfidence = getClusterSourceConfidence({
  officialSources: [
    { name: 'A', url: 'https://example.org/a', confidenceScore: 0.8 },
    { name: 'B', url: 'https://example.org/b', confidenceScore: 0.9 },
    { name: 'C', url: 'https://example.org/c' },
  ],
});
assert.ok(Math.abs((averagedConfidence ?? 0) - 0.85) < 1e-9);

for (const relativePath of [
  'frontend/src/app/programs/[slug]/page.tsx',
  'frontend/src/app/situations/[slug]/page.tsx',
  'frontend/src/app/deadlines/[slug]/page.tsx',
  'frontend/src/app/sitemaps/static.xml/route.ts',
]) {
  const contents = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
  assert.ok(
    !contents.includes('confidenceScore: 0.85'),
    `${relativePath} should not hardcode static cluster confidence`
  );
}

const seoDataContents = fs.readFileSync(path.join(repoRoot, 'frontend/src/lib/seo-data.ts'), 'utf8');
for (const phrase of [
  'exact federal legal keywords required for EPSDT approval',
  'forces the district to assess',
  'SSI approval often opens a Medi-Cal pathway',
  'SSI approval often opens a Medicaid pathway',
]) {
  assert.ok(!seoDataContents.includes(phrase), `seo-data.ts should not keep overclaim phrase: ${phrase}`);
}

console.log('seo cluster confidence tests passed');
