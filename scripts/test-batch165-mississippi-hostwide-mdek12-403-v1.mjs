import fs from 'fs';
import path from 'path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'url';
import { generateBatch165MississippiHostwideMdek12403V1 } from './run-batch165-mississippi-hostwide-mdek12-403-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, filePath), 'utf8'));
}

function readJsonl(filePath) {
  return fs.readFileSync(path.join(repoRoot, filePath), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

generateBatch165MississippiHostwideMdek12403V1();

const summary = readJson('data/generated/mississippi_california_grade_summary_v2.json');
const gapRows = readJsonl('data/generated/mississippi_gap_matrix_v2.jsonl');
const failureRows = readJsonl('data/generated/mississippi_failure_ledger_v2.jsonl');
const verifiedRows = readJsonl('data/generated/mississippi_verified_sources_v1.jsonl');
const nextRows = readJsonl('data/generated/mississippi_next_action_queue_v2.jsonl');
const batchSummary = readJson('data/generated/batch165_mississippi_hostwide_mdek12_403_summary_v1.json');
const report = fs.readFileSync(path.join(repoRoot, 'docs/generated/mississippi-california-grade-audit-report-v2.md'), 'utf8');
const lessons = fs.readFileSync(path.join(repoRoot, 'docs/state-upgrade-lessons-learned.md'), 'utf8');

assert.equal(summary.classification, 'BLOCKED');
assert.equal(summary.index_safe, false);
assert.equal(summary.primary_gap_reason, 'mdek12_public_root_and_bounded_directory_guesses_return_uniform_azure_app_gateway_403');

const gap = gapRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(gap.family_status, 'blocked_mdek12_public_host_uniform_403');
assert.match(gap.status_reason, /MDEK12 root and every bounded local directory guess tested under the same host return the same short Azure Application Gateway 403 shell/i);

const failure = failureRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(failure.failure_code, 'mdek12_public_host_returns_uniform_azure_app_gateway_403');
assert.match(failure.evidence, /public root https:\/\/www\.mdek12\.org\/ itself returns the same short HTTP 403 shell/i);
assert.match(failure.evidence, /OTS\/Directory/);
assert.match(failure.evidence, /Microsoft-Azure-Application-Gateway\/v2/i);

const verified = verifiedRows.find((row) => row.family === 'district_or_county_education_routing');
assert.equal(verified.blocker_code, 'mdek12_public_host_returns_uniform_azure_app_gateway_403');
assert.match(verified.query_basis, /MDEK12 root plus a bounded set of likely district-directory and OSE child paths/i);

assert.equal(nextRows.find((row) => row.family === 'district_or_county_education_routing').next_action, 'browser_or_alternate_client_probe_only_if_mdek12_hostwide_403_can_be_bypassed_without_lowering_standards');
assert.equal(batchSummary.education_blocker_sharpened, true);
assert.equal(batchSummary.failure_code, 'mdek12_public_host_returns_uniform_azure_app_gateway_403');
assert.match(report, /uniform host-wide 403 pattern/i);
assert.match(lessons, /Uniform Short 403 Shells Across Root And Child Paths Mean Host-Wide Block, Not Child-Path Churn/);

console.log('test-batch165-mississippi-hostwide-mdek12-403-v1: ok');
