import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');

const verifiedPath = path.join(generatedDir, 'verified_state_source_pack_v2.jsonl');
const candidatePath = path.join(generatedDir, 'state_source_candidates_v2.jsonl');
const blockedPath = path.join(generatedDir, 'state_source_blocked_v2.jsonl');
const unresolvedPath = path.join(generatedDir, 'state_source_unresolved_v2.jsonl');
const federalPath = path.join(generatedDir, 'global_federal_source_pack_v1.jsonl');
const summaryPath = path.join(generatedDir, 'state_source_summary_v2.csv');
const semanticPath = path.join(generatedDir, 'state_source_semantic_failures_v2.jsonl');

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean).map((line) => JSON.parse(line));
}

function readCsv(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
  });
}

const verifiedRows = readJsonl(verifiedPath);
const candidateRows = readJsonl(candidatePath);
const blockedRows = readJsonl(blockedPath);
const unresolvedRows = readJsonl(unresolvedPath);
const federalRows = readJsonl(federalPath);
const semanticRows = readJsonl(semanticPath);
const summaryRows = readCsv(summaryPath);

assert.ok(fs.existsSync(verifiedPath), 'Missing verified v2 pack');
assert.ok(fs.existsSync(candidatePath), 'Missing candidate v2 pack');
assert.ok(fs.existsSync(blockedPath), 'Missing blocked v2 pack');
assert.ok(fs.existsSync(unresolvedPath), 'Missing unresolved v2 pack');
assert.ok(fs.existsSync(federalPath), 'Missing federal pack');
assert.ok(fs.existsSync(summaryPath), 'Missing summary CSV');
assert.ok(fs.existsSync(semanticPath), 'Missing semantic failures ledger');

const states = new Set(['New Mexico', 'New Hampshire', 'Illinois', 'Nebraska', 'Mississippi']);
const allowedAuthorities = new Set(['official_state', 'official_county', 'official_local', 'official_federal', 'protection_advocacy', 'legal_aid', 'high_authority_nonprofit']);

for (const row of verifiedRows) {
  assert.ok(states.has(row.state), `Unexpected state in verified pack: ${row.state}`);
  assert.equal(row.status, 'verified_target');
  assert.ok(allowedAuthorities.has(row.authority), `Unexpected authority ${row.authority}`);
  assert.ok(row.content_hash, `Verified row missing content hash: ${row.url}`);
  assert.ok(row.final_url, `Verified row missing final_url: ${row.url}`);
  assert.ok(Number(row.role_confidence) >= 0.5, `Verified row confidence too low: ${row.url}`);
  assert.ok(!/state_resource_agencies\.website|forms_and_guides\.source_url/i.test(String(row.agency || '')), `DB field name leaked into agency: ${row.agency}`);
}

for (const row of federalRows) {
  assert.equal(row.authority, 'official_federal', `Federal row must be official_federal: ${row.url}`);
}

const federalUrls = federalRows.map((row) => row.url);
assert.equal(new Set(federalUrls).size, federalUrls.length, 'Federal URLs must be globally deduped');

for (const row of candidateRows) {
  assert.notEqual(row.status, 'verified_target', `Candidate row cannot be verified_target: ${row.url}`);
  assert.ok(String(row.review_reason || '').trim(), `Candidate row missing review_reason: ${row.url}`);
}

for (const row of blockedRows) {
  assert.ok(String(row.blocker_class || '').trim(), `Blocked row missing blocker_class: ${row.attempted_url}`);
  assert.ok(String(row.reason || '').trim(), `Blocked row missing reason: ${row.attempted_url}`);
}

for (const row of unresolvedRows) {
  assert.ok(states.has(row.state), `Unexpected state in unresolved row: ${row.state}`);
  assert.ok(String(row.missing_role || '').trim(), 'Unresolved row missing role');
  assert.ok(String(row.unresolved_reason || '').trim(), 'Unresolved row missing reason');
}

assert.equal(summaryRows.length, 5, `Expected 5 summary rows, received ${summaryRows.length}`);

console.log(JSON.stringify({
  ok: true,
  verifiedRows: verifiedRows.length,
  candidateRows: candidateRows.length,
  blockedRows: blockedRows.length,
  unresolvedRows: unresolvedRows.length,
  federalRows: federalRows.length,
  semanticRows: semanticRows.length,
}, null, 2));
