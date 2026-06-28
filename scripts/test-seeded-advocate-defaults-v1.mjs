import assert from 'node:assert/strict';
import fs from 'fs';

const dbSource = fs.readFileSync(new URL('../frontend/src/lib/db.ts', import.meta.url), 'utf8');

assert.equal(
  dbSource.includes("'verified', 'seed'"),
  false,
  'Seeded advocate records must not default to verified without reviewable provenance.'
);

assert.equal(
  dbSource.includes("'needs_review', 'seed'"),
  true,
  'Seeded advocate records should default to needs_review until a source-backed review happens.'
);

assert.equal(
  dbSource.includes('https://elena@sacramentopedadvocate.com'),
  false,
  'Seeded advocate websites must not contain malformed mailto-like URLs in the website field.'
);

assert.equal(
  dbSource.includes('https://sacramentopedadvocate.com'),
  true,
  'Seeded advocate website fix should keep a valid public website URL.'
);

console.log('seeded advocate defaults tests passed');
