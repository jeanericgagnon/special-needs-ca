import assert from 'node:assert/strict';
import { getSourceReviewDisplay } from '../frontend/src/lib/sourceReviewLabels.ts';

assert.deepEqual(getSourceReviewDisplay('official_verified'), {
  label: 'Source-backed reviewed',
  color: '#0f766e',
  background: 'rgba(15, 118, 110, 0.08)',
  borderColor: '#0f766e30',
});

assert.deepEqual(getSourceReviewDisplay('verified'), {
  label: 'Source-backed reviewed',
  color: '#0f766e',
  background: 'rgba(15, 118, 110, 0.08)',
  borderColor: '#0f766e30',
});

assert.deepEqual(getSourceReviewDisplay('source_listed'), {
  label: 'Public source linked',
  color: '#2563eb',
  background: 'rgba(37, 99, 235, 0.08)',
  borderColor: '#2563eb30',
});

assert.deepEqual(getSourceReviewDisplay('needs_review'), {
  label: 'Needs deeper verification',
  color: '#64748b',
  background: 'rgba(100, 116, 139, 0.08)',
  borderColor: '#64748b30',
});

assert.deepEqual(getSourceReviewDisplay(undefined), {
  label: 'Needs deeper verification',
  color: '#64748b',
  background: 'rgba(100, 116, 139, 0.08)',
  borderColor: '#64748b30',
});

console.log('source review labels tests passed');
