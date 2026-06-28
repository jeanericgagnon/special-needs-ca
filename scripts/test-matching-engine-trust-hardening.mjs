import assert from 'node:assert/strict';
import { runMatchingEngine } from '../src/engine/matchingEngine.js';

const ihssProfile = {
  dob: '2021-01-01',
  countyId: 'los-angeles',
  conditionIds: ['autism-spectrum-disorder-asd'],
  suspectedConditionIds: [],
  functionalNeedIds: ['protective-supervision'],
  currentServiceIds: [],
  insuranceType: 'medi-cal',
};

const earlyStartProfile = {
  ...ihssProfile,
  dob: '2024-01-01',
  functionalNeedIds: ['speech-therapy'],
};

const originalFind = Array.prototype.find;

try {
  Array.prototype.find = function patchedFind(predicate, thisArg) {
    const result = originalFind.call(this, predicate, thisArg);
    if (result && result.id === 'los-angeles') {
      return {
        ...result,
        ihssContact: '',
      };
    }
    if (result && Array.isArray(result.countiesServed) && result.countiesServed.includes('los-angeles')) {
      return {
        ...result,
        intakePhone: '',
        earlyStartContact: '',
      };
    }
    return result;
  };

  const ihssResults = runMatchingEngine(ihssProfile);
  const earlyStartResults = runMatchingEngine(earlyStartProfile);
  const ihss = ihssResults.highPriority.find((row) => row.id === 'ihss-for-children');
  const earlyStart = earlyStartResults.highPriority.find((row) => row.id === 'early-start');

  assert.ok(ihss, 'expected IHSS recommendation');
  assert.match(
    ihss.whatToDoNext,
    /county IHSS office directory/i,
    'missing-county-contact IHSS flow should send families to the current directory instead of a fake fallback',
  );
  assert.doesNotMatch(ihss.whatToDoNext, /local DPSS/i);

  assert.ok(earlyStart, 'expected Early Start recommendation');
  assert.match(
    earlyStart.whatToDoNext,
    /Regional Center Early Start listing/i,
    'missing Early Start contact should fall back to the current listing, not an invented hotline',
  );
  assert.doesNotMatch(earlyStart.whatToDoNext, /DDS line/i);
} finally {
  Array.prototype.find = originalFind;
}

console.log('matching engine trust hardening tests passed');
