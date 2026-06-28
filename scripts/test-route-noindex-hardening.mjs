import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

const routeExpectations = [
  {
    path: 'frontend/src/app/login/page.tsx',
    required: [
      "robots: {",
      'index: false',
      'follow: true',
      "canonical: '/login'",
    ],
  },
  {
    path: 'frontend/src/app/register/page.tsx',
    required: [
      "robots: {",
      'index: false',
      'follow: true',
      "canonical: '/register'",
    ],
  },
  {
    path: 'frontend/src/app/appeals-center/page.tsx',
    required: [
      "robots: {",
      'index: false',
      'follow: true',
      "canonical: '/appeals-center'",
    ],
  },
  {
    path: 'frontend/src/app/financial-planning/page.tsx',
    required: [
      "robots: {",
      'index: false',
      'follow: true',
      "canonical: '/financial-planning'",
    ],
  },
  {
    path: 'frontend/src/app/counties/page.tsx',
    required: [
      "robots: {",
      'index: false',
      'follow: true',
      "canonical: '/counties'",
    ],
  },
  {
    path: 'frontend/src/app/counties/[state]/[county]/page.tsx',
    required: [
      "robots: {",
      'index: false',
      'follow: true',
    ],
  },
];

for (const expectation of routeExpectations) {
  const content = read(expectation.path);
  for (const requiredText of expectation.required) {
    assert.match(
      content,
      new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      `${expectation.path} should include ${requiredText}`,
    );
  }
}

console.log('route noindex hardening tests passed');
