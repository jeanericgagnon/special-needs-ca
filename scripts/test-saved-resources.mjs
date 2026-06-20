import assert from 'node:assert/strict';
import {
  DIRECTORY_SAVED_RESOURCES_KEY,
  getSavedDirectoryResourceAnchorId,
  getSavedDirectoryResources,
  isDirectoryResourceSaved,
  normalizeSavedDirectoryResource,
  parseSavedDirectoryResources,
  saveDirectoryResource,
  toggleSavedDirectoryResource,
} from '../frontend/src/lib/savedResources.ts';

function createStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    },
  };
}

function run() {
  assert.equal(getSavedDirectoryResourceAnchorId(' Provider 123 '), 'directory-resource-provider-123');

  const normalized = normalizeSavedDirectoryResource({
    id: ' Provider 123 ',
    name: '  County Autism Clinic  ',
    recordType: 'provider',
    stateId: ' CA ',
    countyId: 'Los Angeles / CA',
    originPath: '/counties/california/los-angeles#directory-resource-provider-123',
    website: 'https://example.org/help',
    sourceUrl: 'notaurl',
    phone: ' (555) 111-2222 ',
    verificationStatus: ' verified ',
  });

  assert.deepEqual(normalized, {
    id: 'provider-123',
    name: 'County Autism Clinic',
    recordType: 'provider',
    stateId: 'ca',
    countyId: 'los-angeles-ca',
    pageType: undefined,
    originPath: '/counties/california/los-angeles#directory-resource-provider-123',
    phone: '(555) 111-2222',
    email: undefined,
    website: 'https://example.org/help',
    sourceUrl: undefined,
    verificationStatus: 'verified',
    savedAt: normalized.savedAt,
  });
  assert.match(normalized.savedAt, /^\d{4}-\d{2}-\d{2}T/);

  const parsed = parseSavedDirectoryResources(JSON.stringify([
    normalized,
    { id: '', recordType: 'provider' },
  ]));
  assert.equal(parsed.length, 1);

  globalThis.window = {};
  globalThis.localStorage = createStorage();

  assert.deepEqual(getSavedDirectoryResources(), []);

  const saved = saveDirectoryResource({
    id: 'provider-123',
    name: 'County Autism Clinic',
    recordType: 'provider',
    stateId: 'ca',
  });
  assert.equal(saved?.id, 'provider-123');
  assert.equal(isDirectoryResourceSaved('provider-123', 'provider'), true);
  assert.equal(getSavedDirectoryResources().length, 1);
  assert.equal(typeof localStorage.getItem(DIRECTORY_SAVED_RESOURCES_KEY), 'string');

  const toggledOff = toggleSavedDirectoryResource({
    id: 'provider-123',
    name: 'County Autism Clinic',
    recordType: 'provider',
  });
  assert.equal(toggledOff.saved, false);
  assert.equal(getSavedDirectoryResources().length, 0);

  const toggledOn = toggleSavedDirectoryResource({
    id: 'provider-123',
    name: 'County Autism Clinic',
    recordType: 'provider',
    pageType: 'county',
    originPath: '/counties/california/los-angeles#directory-resource-provider-123',
  });
  assert.equal(toggledOn.saved, true);
  assert.equal(getSavedDirectoryResources()[0].pageType, 'county');
  assert.equal(getSavedDirectoryResources()[0].originPath, '/counties/california/los-angeles#directory-resource-provider-123');
}

run();
console.log('saved resources tests passed');
