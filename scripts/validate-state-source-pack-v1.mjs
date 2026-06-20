import fs from 'fs';
import path from 'path';
import assert from 'assert/strict';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');

const taxonomyPath = path.join(generatedDir, 'state_source_taxonomy_v1.json');
const packPath = path.join(generatedDir, 'all_states_source_pack_v1.jsonl');
const summaryPath = path.join(generatedDir, 'state_source_pack_summary_v1.csv');
const gapsPath = path.join(generatedDir, 'state_source_pack_gaps_v1.jsonl');

const allowedAuthorities = new Set([
  'official_state',
  'official_county',
  'official_local',
  'official_federal',
  'protection_advocacy',
  'legal_aid',
  'high_authority_nonprofit',
]);
const allowedBatchClasses = new Set(['html', 'pdf', 'document', 'spreadsheet', 'portal', 'directory_root']);
const allowedPriorities = new Set(['critical', 'high', 'medium', 'low']);
const allowedStatuses = new Set(['verified_target', 'target_candidate', 'blocked_known', 'needs_review']);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readNdjson(filePath) {
  return fs.readFileSync(filePath, 'utf8').split('\n').map((line) => line.trim()).filter(Boolean).map((line) => JSON.parse(line));
}

function readCsvStates(filePath) {
  const [header, ...lines] = fs.readFileSync(filePath, 'utf8').trim().split('\n');
  const stateIndex = header.split(',').indexOf('state');
  return lines.map((line) => line.split(',')[stateIndex]);
}

assert.ok(fs.existsSync(taxonomyPath), 'Missing taxonomy output');
assert.ok(fs.existsSync(packPath), 'Missing source pack output');
assert.ok(fs.existsSync(summaryPath), 'Missing summary CSV');
assert.ok(fs.existsSync(gapsPath), 'Missing gaps output');

const taxonomy = readJson(taxonomyPath);
const packRows = readNdjson(packPath);
const gapRows = readNdjson(gapsPath);
const summaryStates = readCsvStates(summaryPath);

const roleIndex = new Map();
for (const category of taxonomy.workflowCategories || []) {
  for (const role of category.roles || []) {
    assert.ok(!roleIndex.has(role.roleId), `Duplicate taxonomy role: ${role.roleId}`);
    roleIndex.set(role.roleId, { ...role, workflowCategory: category.categoryId });
  }
}

assert.equal((taxonomy.workflowCategories || []).length, 7, 'Expected 7 workflow categories');
assert.ok(packRows.length > 1000, `Expected more than 1000 source-pack rows, received ${packRows.length}`);
assert.equal(summaryStates.length, 50, `Expected 50 states in summary CSV, received ${summaryStates.length}`);

for (const row of packRows) {
  for (const field of [
    'state', 'state_abbr', 'entity_id', 'source_role', 'url', 'authority', 'agency', 'batch_class',
    'priority', 'expected_content_type', 'workflow_category', 'notes', 'status',
    'taxonomy_role_id', 'target_kind', 'discovery_method', 'discovery_confidence',
    'state_completeness_role', 'normalized_domain',
  ]) {
    assert.ok(String(row[field] ?? '').trim(), `Missing required field ${field} on ${row.entity_id}`);
  }
  assert.ok(allowedAuthorities.has(row.authority), `Invalid authority ${row.authority}`);
  assert.ok(allowedBatchClasses.has(row.batch_class), `Invalid batch class ${row.batch_class}`);
  assert.ok(allowedPriorities.has(row.priority), `Invalid priority ${row.priority}`);
  assert.ok(allowedStatuses.has(row.status), `Invalid status ${row.status}`);
  assert.ok(roleIndex.has(row.source_role), `Unknown source role ${row.source_role}`);
  assert.equal(row.taxonomy_role_id, row.source_role, 'taxonomy_role_id must match source_role');
  assert.equal(roleIndex.get(row.source_role).workflowCategory, row.workflow_category, `Workflow category mismatch for ${row.entity_id}`);
  if (row.status === 'verified_target') {
    assert.ok(roleIndex.get(row.source_role).allowedAuthorities.includes(row.authority), `verified_target authority not allowed for role ${row.source_role}`);
  }
  if (row.target_kind === 'directory_root') {
    assert.notEqual(row.source_role, 'dd_intake_application', `Directory root cannot satisfy leaf role dd_intake_application (${row.entity_id})`);
    assert.notEqual(row.source_role, 'medicaid_application', `Directory root cannot satisfy leaf role medicaid_application (${row.entity_id})`);
    assert.notEqual(row.source_role, 'medicaid_fair_hearing', `Directory root cannot satisfy leaf role medicaid_fair_hearing (${row.entity_id})`);
    assert.notEqual(row.source_role, 'special_education_due_process', `Directory root cannot satisfy leaf role special_education_due_process (${row.entity_id})`);
  }
  if (row.status === 'blocked_known' || row.status === 'needs_review') {
    assert.ok(String(row.notes || row.review_reason || '').trim(), `Blocked/review row missing notes: ${row.entity_id}`);
  }
}

const statesWithRows = new Set(packRows.map((row) => row.state));
for (const state of summaryStates) {
  assert.ok(statesWithRows.has(state), `Summary state missing pack rows: ${state}`);
}

for (const gap of gapRows) {
  assert.ok(roleIndex.has(gap.missing_role), `Gap references unknown role ${gap.missing_role}`);
  assert.ok(String(gap.suggested_search_query || '').trim(), `Missing suggested_search_query for gap ${gap.missing_role}`);
}

console.log(JSON.stringify({
  ok: true,
  categoryCount: taxonomy.workflowCategories.length,
  roleCount: roleIndex.size,
  packRows: packRows.length,
  summaryStates: summaryStates.length,
  gaps: gapRows.length,
}, null, 2));
