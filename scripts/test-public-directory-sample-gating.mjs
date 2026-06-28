import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const dbSource = fs.readFileSync(path.join(repoRoot, 'frontend/src/lib/db.ts'), 'utf8');
assert.match(
  dbSource,
  /isPublicSample\(row\)\s*&&\s*isRenderableDirectoryFoundationRecord\(row\)\s*&&\s*isPublicDirectoryRecordEligible\(row\)/,
  'directory foundation snapshot samples should require public directory eligibility',
);

const findHelpSource = fs.readFileSync(
  path.join(repoRoot, 'frontend/src/app/find-help/find-help-client.tsx'),
  'utf8',
);
assert.match(
  findHelpSource,
  /filter\(\(\{ record \}\) => isRenderableDirectoryFoundationRecord\(record\)\)/,
  'find-help sample records should render only pre-filtered snapshot records',
);

console.log('public directory sample gating tests passed');
