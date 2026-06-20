import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const scriptPath = path.join(
  path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'),
  'scripts',
  'run-source-acquisition-provider-support-followup.mjs'
);

const source = fs.readFileSync(scriptPath, 'utf8');

assert.match(
  source,
  /const db = args\.mode === 'live' \? new Database\(path\.join\(process\.cwd\(\), 'ca_disability_navigator\.db'\)\) : null;/
);
assert.doesNotMatch(source, /args\.mode === 'apply'/);

console.log('provider support followup mode tests passed');
