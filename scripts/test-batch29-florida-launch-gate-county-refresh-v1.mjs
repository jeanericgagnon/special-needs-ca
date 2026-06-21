import assert from 'node:assert/strict';
import { classifyFloridaCountyLocalBlocker } from './run-batch29-florida-launch-gate-county-refresh-v1.mjs';

const blocked = classifyFloridaCountyLocalBlocker(
  {
    ok: false,
    status: 404,
    finalUrl: 'https://www.myflfamilies.com/service-programs/access/map.shtml',
    body: '',
  },
  {
    ok: true,
    status: 200,
    finalUrl: 'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance',
    body: `
      <html><head><title>Applying for Assistance | Florida DCF</title></head>
      <body>
        <p>Use our Community Partner Search page or customer service center for assistance.</p>
        <a href="https://myaccess.myflfamilies.com/Public/CPCPS">Community Partner Search</a>
        <a href="https://familyresourcecenter.myflfamilies.com/">customer service center</a>
      </body></html>
    `,
  },
  {
    ok: true,
    status: 200,
    finalUrl: 'https://www.myflfamilies.com/services/public-assistance',
    body: `
      <html><head><title>Public Benefits and Services | Florida DCF</title></head>
      <body>
        <p>Community Partner Search and statewide customer call center.</p>
      </body></html>
    `,
  },
);
assert.equal(
  blocked.blocker_code,
  'official_local_service_center_locator_missing_after_same_domain_repair',
  'Florida county-local classifier should keep the family blocked when only community-partner and statewide customer-center replacements remain.',
);

const ambiguous = classifyFloridaCountyLocalBlocker(
  {
    ok: false,
    status: 404,
    finalUrl: 'https://www.myflfamilies.com/service-programs/access/map.shtml',
    body: '',
  },
  {
    ok: true,
    status: 200,
    finalUrl: 'https://www.myflfamilies.com/services/public-assistance/applying-for-assistance',
    body: '<html><head><title>Applying</title></head><body><a href="/county-office-locator">County Office Locator</a></body></html>',
  },
  {
    ok: true,
    status: 200,
    finalUrl: 'https://www.myflfamilies.com/services/public-assistance',
    body: '<html><head><title>Public Benefits</title></head><body>County Office Locator</body></html>',
  },
);
assert.equal(
  ambiguous.blocker_code,
  'official_local_service_center_locator_requires_manual_review',
  'Florida county-local classifier should fail closed when bounded evidence suggests a locator might exist but does not prove the replacement semantics cleanly.',
);

console.log('test-batch29-florida-launch-gate-county-refresh-v1: ok');
