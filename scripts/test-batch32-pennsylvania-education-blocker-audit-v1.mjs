import assert from 'node:assert/strict';
import { collectPennsylvaniaEducationBlockerMetrics } from './run-batch32-pennsylvania-education-blocker-audit-v1.mjs';

const metrics = collectPennsylvaniaEducationBlockerMetrics();

assert.equal(metrics.totalRows, 67, 'Pennsylvania should still have 67 school_district rows in the blocker audit.');
assert.equal(metrics.genericIntermediateUnitDirectoryRows, 59, 'Pennsylvania blocker audit should quantify 59 generic Intermediate Units directory rows.');
assert.equal(metrics.nonGenericRows, 8, 'Pennsylvania should have 8 non-generic district-routing rows after exact-leaf refresh.');
assert.ok(metrics.sampleGenericCountyRows.length > 0, 'Pennsylvania blocker audit should preserve sample generic county rows.');
assert.ok(metrics.sampleGenericCountyRows.every((row) => row.source_url === 'https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx'), 'Sample generic county rows must point at the generic Intermediate Units directory.');

console.log('test-batch32-pennsylvania-education-blocker-audit-v1: ok');
