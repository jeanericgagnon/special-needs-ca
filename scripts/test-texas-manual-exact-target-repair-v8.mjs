import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

const summaryV7 = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v7.json'));
const summaryV8 = readJson(path.join(repoRoot, 'data/generated/tx_verification_summary_v8.json'));
const countiesV7 = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v7.jsonl'));
const countiesV8 = readJsonl(path.join(repoRoot, 'data/generated/tx_county_baseline_v8.jsonl'));
const directSourcesV8 = readJsonl(path.join(repoRoot, 'data/generated/tx_education_direct_district_sources_v8.jsonl'));
const failuresV8 = readJsonl(path.join(repoRoot, 'data/generated/tx_failure_ledger_v8.jsonl'));
const manualTargetsV8 = readJsonl(path.join(repoRoot, 'data/generated/tx_manual_target_candidates_v8.jsonl'));
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/tx-manual-exact-target-repair-report-v8.md'), 'utf8');
const sourceLessons = fs.readFileSync(path.join(repoRoot, 'docs/source-acquisition-lessons-learned.md'), 'utf8');
const stateLessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');
const playbook = fs.readFileSync(path.join(repoRoot, 'docs/reusable-state-upgrade-playbook.md'), 'utf8');

assert.equal(countiesV8.length, 254, 'tx_county_baseline_v8.jsonl must have exactly 254 counties');
assert.equal(summaryV8.v8.pass_counties + summaryV8.v8.partial_counties + summaryV8.v8.blocked_counties, 254, 'v8 summary totals must equal 254');
assert.equal(summaryV8.index_safe, summaryV8.v8.partial_counties === 0, 'index_safe is true only when partial_counties is 0');

const v7Partial = new Set(countiesV7.filter((row) => row.verification_status === 'partial').map((row) => row.county_slug));
const v7Pass = new Set(countiesV7.filter((row) => row.verification_status === 'pass').map((row) => row.county_slug));
const v8ByCounty = new Map(countiesV8.map((row) => [row.county_slug, row]));
const sourceByCounty = new Map(directSourcesV8.map((row) => [row.county_slug, row]));
const failureByCounty = new Map(failuresV8.map((row) => [row.county_slug, row]));

for (const slug of v7Pass) {
  assert.equal(v8ByCounty.get(slug)?.verification_status, 'pass', `v7 PASS county ${slug} cannot be downgraded in v8`);
}

for (const row of manualTargetsV8) {
  assert.ok(v7Partial.has(row.county_slug), `v8 manual target rows must start only from the 21 v7 partial counties, found ${row.county_slug}`);
}

for (const row of countiesV8.filter((item) => item.verification_status === 'pass' && v7Partial.has(item.county_slug))) {
  const source = sourceByCounty.get(row.county_slug);
  assert.ok(source, `repaired PASS county ${row.county_slug} must have a source row`);
  assert.equal(source.verification_status, 'verified', `repaired PASS county ${row.county_slug} must have verified direct source`);
  assert.ok(source.discovery_method === 'manual_exact_target', `repaired PASS county ${row.county_slug} must come from manual exact target lane`);
  assert.ok(!/(tea\.texas\.gov|tealprod\.tea\.state\.tx\.us|duckduckgo|facebook|instagram|x\.com|twitter|google accounts)/i.test(`${source.source_url} ${source.final_url} ${source.evidence_snippet}`), `PASS county ${row.county_slug} cannot rely on generic/statewide/search/social evidence`);
  assert.ok(/special education|child find|special populations|special services|special programs|dyslexia|504|spedtex|special ed/i.test(`${source.source_url} ${source.final_url} ${source.evidence_snippet}`), `PASS county ${row.county_slug} must preserve district-grade evidence terms`);
}

for (const row of manualTargetsV8.filter((item) => item.source_type === 'district_document' && item.attempt_status === 'verified')) {
  assert.ok(/special education|child find|special populations|special services|special programs|dyslexia|504|spedtex|special ed/i.test(`${row.target_url} ${row.evidence_snippet}`), `district document ${row.target_url} cannot verify without explicit special-education evidence`);
}

for (const row of countiesV8.filter((item) => item.verification_status !== 'pass')) {
  assert.ok(failureByCounty.has(row.county_slug), `remaining partial county ${row.county_slug} must have a v8 failure row`);
}

assert.ok(summaryV8.repaired_counties < summaryV7.v7.partial_counties, 'v8 repaired counties should be fewer than or equal to the 21-county starting set');
assert.ok(summaryV8.repaired_counties > 0, 'v8 should repair at least one county');
assert.ok(report.includes('v7 PASS/PARTIAL/BLOCKED'), 'v8 report must include v7 counts');
assert.ok(report.includes('v8 PASS/PARTIAL/BLOCKED'), 'v8 report must include v8 counts');
assert.ok(report.includes('Counties newly repaired with accepted source URL'), 'v8 report must include accepted source URLs');
assert.ok(report.includes('Texas is index-safe'), 'v8 report must state index safety');

for (const doc of [sourceLessons, stateLessons, playbook]) {
  assert.ok(/sitemap mining should precede any new search fallback|sitemap/i.test(doc), 'lessons docs must include the new sitemap-first exact-target lesson');
}

console.log('test-texas-manual-exact-target-repair-v8: ok');
