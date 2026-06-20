import assert from 'node:assert/strict';
import {
  DIRECTORY_ANALYTICS_BRIDGE_EVENT,
  isDirectoryAnalyticsEventName,
  sanitizeDirectoryAnalyticsPayload,
  trackDirectoryAnalyticsEvent,
} from '../frontend/src/lib/directoryAnalytics.ts';

function run() {
  assert.equal(isDirectoryAnalyticsEventName('directory_search'), true);
  assert.equal(isDirectoryAnalyticsEventName('directory_fake_event'), false);

  const sanitized = sanitizeDirectoryAnalyticsPayload({
    event: 'directory_search',
    recordId: ' Provider 123 ',
    recordType: 'provider',
    stateId: ' CA ',
    countyId: 'Los Angeles / CA',
    pageType: 'find_help',
    searchQuery: 'Need autism help for 555-123-4567 or parent@example.com   now',
    resultCount: -3.9,
    nextStepType: 'call',
  });

  assert.deepEqual(sanitized, {
    event: 'directory_search',
    recordId: 'provider-123',
    recordType: 'provider',
    stateId: 'ca',
    countyId: 'los-angeles-ca',
    pageType: 'find_help',
    searchQuery: 'Need autism help for [redacted-phone] or [redacted-email] now',
    resultCount: 0,
    nextStepType: 'call',
  });

  const invalidEnums = sanitizeDirectoryAnalyticsPayload({
    event: 'directory_next_step_click',
    recordId: 'abc',
    recordType: 'therapist' ,
    pageType: 'dashboard',
    nextStepType: 'fax',
    resultCount: Number.NaN,
  });

  assert.deepEqual(invalidEnums, {
    event: 'directory_next_step_click',
    recordId: 'abc',
    recordType: undefined,
    stateId: undefined,
    countyId: undefined,
    pageType: undefined,
    searchQuery: undefined,
    resultCount: undefined,
    nextStepType: undefined,
  });

  const dispatched = [];
  const pushed = [];
  const dataLayer = [];
  globalThis.window = {
    __ABLEFULL_DIRECTORY_ANALYTICS__: [],
    dataLayer,
    dispatchEvent(event) { dispatched.push(event); },
  };
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  };

  const tracked = trackDirectoryAnalyticsEvent({
    event: 'directory_phone_click',
    recordId: ' Advocates:123 ',
    recordType: 'advocate',
    stateId: 'CA',
    pageType: 'advocates',
    searchQuery: ' Parent email me@example.com ',
    resultCount: 5.2,
  });

  assert.equal(tracked?.recordId, 'advocates:123');
  assert.equal(tracked?.searchQuery, 'Parent email [redacted-email]');
  assert.equal(tracked?.resultCount, 5);
  assert.equal(dispatched.length, 1);
  assert.equal(dispatched[0].type, DIRECTORY_ANALYTICS_BRIDGE_EVENT);
  assert.deepEqual(dispatched[0].detail, tracked);
  assert.deepEqual(globalThis.window.__ABLEFULL_DIRECTORY_ANALYTICS__, [tracked]);
  pushed.push(...dataLayer);
  assert.deepEqual(pushed, [tracked]);
}

run();
console.log('directory analytics tests passed');
