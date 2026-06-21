import assert from 'node:assert/strict';
import { generateBatch34PennsylvaniaStatewideFamilyTruthRefreshV1 } from './run-batch34-pennsylvania-statewide-family-truth-refresh-v1.mjs';

const summary = generateBatch34PennsylvaniaStatewideFamilyTruthRefreshV1();

assert.ok(summary.upgraded_families.includes('vocational_rehabilitation_pre_ets'), 'Pennsylvania statewide truth refresh must upgrade VR when official OVR evidence exists.');
assert.ok(summary.upgraded_families.includes('protection_and_advocacy'), 'Pennsylvania statewide truth refresh must upgrade P&A when DRP evidence already exists.');
assert.ok(summary.upgraded_families.includes('parent_training_information_center'), 'Pennsylvania statewide truth refresh must upgrade PTI when PEAL evidence already exists.');
assert.ok(summary.completeness_pct >= 80, 'Pennsylvania completeness should materially improve after statewide family truth refresh.');

console.log('test-batch34-pennsylvania-statewide-family-truth-refresh-v1: ok');
