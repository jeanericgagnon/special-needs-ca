import assert from 'node:assert/strict';
import {
  mergeProviderSupportExtraction,
  pickProviderSupportLink,
} from './source-acquisition-provider-support-lib.mjs';

function testPickProviderSupportLinkPrefersContactLikeSameDomain() {
  const picked = pickProviderSupportLink({
    sourceUrl: 'https://calliercenter.utdallas.edu/',
    finalUrl: 'https://calliercenter.utdallas.edu/',
    links: [
      { href: 'https://example.com/contact', text: 'Contact' },
      { href: '/about', text: 'About' },
      { href: '/contact-us/', text: 'Address Locations' },
    ],
  });
  assert.equal(picked.resolvedUrl, 'https://calliercenter.utdallas.edu/contact-us/');
}

function testMergeProviderSupportExtractionBackfillsAddress() {
  const merged = mergeProviderSupportExtraction(
    {
      familyExtraction: {
        organizationName: 'Example Clinic',
        contactPhone: '(800) 555-1111',
        contactEmail: '',
        contactAddress: '',
      },
    },
    {
      sourceUrl: 'https://example.org/contact',
      finalUrl: 'https://example.org/contact',
      familyExtraction: {
        organizationName: 'Example Clinic',
        contactPhone: '(800) 555-1111',
        contactEmail: 'help@example.org',
        contactAddress: '123 Main St., Sacramento, CA 95817',
        publicContactSignalCount: 3,
      },
    },
  );
  assert.equal(merged.extractedAddress, '123 Main St., Sacramento, CA 95817');
  assert.equal(merged.extractedPhone, '(800) 555-1111');
  assert.equal(merged.extractedEmail, 'help@example.org');
}

function testPickProviderSupportLinkRejectsHashOnlyLocationLinks() {
  const picked = pickProviderSupportLink({
    sourceUrl: 'https://childrenshospital.northwell.edu/departments-services',
    finalUrl: 'https://childrenshospital.northwell.edu/departments-services',
    links: [
      { href: '#', text: 'Locations' },
      { href: '/about-us', text: 'About us' },
    ],
  });
  assert.equal(picked, null);
}

testPickProviderSupportLinkPrefersContactLikeSameDomain();
testMergeProviderSupportExtractionBackfillsAddress();
testPickProviderSupportLinkRejectsHashOnlyLocationLinks();

console.log('source acquisition provider support followup tests passed');
