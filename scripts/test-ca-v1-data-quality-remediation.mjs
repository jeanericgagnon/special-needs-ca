import assert from 'node:assert/strict';
import {
  extractRegionalCenterRoleCandidates,
  hasFieldLevelProvenance,
  isFalseHttp200Challenge,
  repoRelativePath,
  validateCountyIhssCandidate,
} from './ca-v1-data-quality-lib.mjs';

const challengeRow = {
  http_status: 200,
  parser_class: 'html',
  byte_count: 212,
};

assert.equal(
  isFalseHttp200Challenge(challengeRow, '<html><body>Request unsuccessful. Incapsula incident ID</body></html>', 1),
  true,
  'HTTP 200 Incapsula pages should be blocked',
);

assert.equal(
  isFalseHttp200Challenge(
    {
      ...challengeRow,
      byte_count: 32000,
    },
    `
      <html>
        <head><title>IHSS Overview</title></head>
        <body>
          <header>Maintenance history mentions request unsuccessful test cases.</header>
          <main>
            <h1>In-Home Supportive Services</h1>
            <h2>Apply for IHSS</h2>
            <p>IHSS provides services to eligible Californians and includes county intake information, fact sheets, and forms.</p>
          </main>
        </body>
      </html>
    `,
    1,
  ),
  false,
  'Valid IHSS pages should not be false-blocked when meaningful content is present',
);

assert.equal(
  isFalseHttp200Challenge(challengeRow, '<html><body></body></html>', 4),
  true,
  'Repeated suspicious 212-byte bodies should be blocked',
);

assert.equal(
  isFalseHttp200Challenge(challengeRow, '<html><body> </body></html>', 1),
  true,
  'Blank-title blank-body challenge shells should not be parse-ready',
);

assert.equal(
  validateCountyIhssCandidate({
    url: 'https://county.example.org/jobs',
    candidate_text: 'Apply for a Job',
  }).decision,
  'rejected',
  'Jobs pages should be rejected for IHSS discovery',
);

assert.equal(
  validateCountyIhssCandidate({
    url: 'https://county.example.org/ihss/apply',
    candidate_text: 'Apply for IHSS',
  }).decision,
  'accepted',
  'Real IHSS pages should be accepted',
);

const regionalCandidates = extractRegionalCenterRoleCandidates({
  state: 'CA',
  entity_id: 'sample-regional-center',
  authority: 'official_regional',
  agency: 'Sample Regional Center',
  url: 'https://regional.example.org',
}, `
  <a href="/apply">Apply for Services</a>
  <a href="/early-start">Early Start Intake</a>
  <a href="/appeals">Appeals and Complaints</a>
  <a href="/self-determination">Self-Determination Program</a>
`);
assert.ok(regionalCandidates.length >= 4, 'Regional centers should emit multiple role-specific candidates');

assert.equal(
  repoRelativePath('/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/ca-v1/raw/sample.pdf'),
  'data/source-acquisition-runs/ca-v1/raw/sample.pdf',
  'Artifact paths should be repository-relative',
);

assert.equal(
  hasFieldLevelProvenance({
    source_url: 'https://example.org',
    artifact_path: 'data/source-acquisition-runs/ca-v1/raw/x.pdf',
    source_role: 'official_form',
    supporting_text: 'submit this form',
    fetched_at: '2026-06-20T00:00:00Z',
    content_hash: 'abc123',
  }),
  true,
  'Rows with full provenance should be stage-ready',
);

assert.equal(
  hasFieldLevelProvenance({
    source_url: 'https://example.org',
    artifact_path: '',
    source_role: 'official_form',
    supporting_text: 'submit this form',
    fetched_at: '2026-06-20T00:00:00Z',
    content_hash: 'abc123',
  }),
  false,
  'No row should reach staging without field-level provenance',
);

console.log(JSON.stringify({
  ok: true,
  tested: [
    'http_200_incapsula_blocked',
    'valid_ihss_page_not_false_blocked',
    'repeated_212_hash_blocked',
    'blank_challenge_not_parse_ready',
    'ihss_jobs_rejected',
    'ihss_real_page_accepted',
    'regional_center_multi_role_candidates',
    'artifact_paths_relative',
    'staging_requires_field_provenance',
  ],
}, null, 2));
