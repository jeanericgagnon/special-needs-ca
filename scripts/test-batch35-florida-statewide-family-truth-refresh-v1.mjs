import assert from 'node:assert/strict';
import { generateBatch35FloridaStatewideFamilyTruthRefreshV1 } from './run-batch35-florida-statewide-family-truth-refresh-v1.mjs';

const summary = generateBatch35FloridaStatewideFamilyTruthRefreshV1();

assert.ok(summary.upgraded_families.includes('vocational_rehabilitation_pre_ets'), 'Florida statewide truth refresh must upgrade VR when rehabworks evidence already exists.');
assert.ok(summary.upgraded_families.includes('protection_and_advocacy'), 'Florida statewide truth refresh must upgrade P&A when Disability Rights Florida evidence already exists.');
assert.ok(summary.upgraded_families.includes('parent_training_information_center'), 'Florida statewide truth refresh must upgrade PTI when Family Network on Disabilities evidence already exists.');
assert.ok(summary.upgraded_families.includes('legal_aid'), 'Florida statewide truth refresh must upgrade legal aid when first-party Florida legal aid sources already exist on disk.');
assert.ok(summary.completeness_pct >= 80, 'Florida completeness should materially improve after statewide family truth refresh.');

console.log('test-batch35-florida-statewide-family-truth-refresh-v1: ok');
