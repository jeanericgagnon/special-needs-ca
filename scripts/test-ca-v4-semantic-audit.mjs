import assert from 'node:assert/strict';
import { evaluateCaliforniaSemanticRecord } from './ca-v4-semantic-lib.mjs';

function baseRecord(overrides = {}) {
  return {
    recordId: 'test-record',
    stateId: 'california',
    gapFamily: 'programs_benefits',
    sourceRole: 'program_page',
    authority: 'official_state',
    agency: 'Test Agency',
    sourceUrl: 'https://example.ca.gov/source',
    finalUrl: 'https://example.ca.gov/source',
    provenanceUrl: 'https://example.ca.gov/source',
    pageTitle: 'Example Program',
    h1s: ['Example Program'],
    h2s: [],
    paragraphs: [],
    phones: [],
    emails: [],
    addressLines: [],
    links: [],
    textSample: '',
    familyExtraction: {},
    ...overrides,
  };
}

{
  const row = baseRecord({
    gapFamily: 'advocates_legal',
    sourceRole: 'legal_help_page',
    pageTitle: 'Free Legal Help',
    h1s: ['Free Legal Help'],
    paragraphs: ['The State Bar of California offers free legal help and lawyer referral information.'],
  });
  const result = evaluateCaliforniaSemanticRecord(row);
  assert.equal(result.semanticStatus, 'unsupported');
  assert.equal(result.destinationTable, 'legal_help_resources');
  assert.equal(result.entityType, 'directory');
}

{
  const row = baseRecord({
    gapFamily: 'dd_routing',
    sourceRole: 'service_index',
    pageTitle: 'Employment Services',
    h1s: ['Employment Services'],
    paragraphs: ['DDS provides information about employment supports and related services.'],
  });
  const result = evaluateCaliforniaSemanticRecord(row);
  assert.equal(result.semanticStatus, 'unsupported');
  assert.equal(result.entityType, 'policy_or_informational_page');
}

{
  const row = baseRecord({
    gapFamily: 'programs_benefits',
    sourceRole: 'directory_index',
    pageTitle: 'Services',
    h1s: ['Services'],
    paragraphs: ['Browse services by category.'],
    links: [{ text: 'Directory', href: 'https://example.ca.gov/directory' }],
  });
  const result = evaluateCaliforniaSemanticRecord(row);
  assert.equal(result.semanticStatus, 'unsupported');
  assert.equal(result.entityType, 'directory');
}

{
  const row = baseRecord({
    gapFamily: 'programs_benefits',
    pageTitle: 'Home',
    h1s: ['Home'],
    paragraphs: ['Apply today.'],
    links: [{ text: 'Apply', href: 'https://example.ca.gov/apply' }],
  });
  const result = evaluateCaliforniaSemanticRecord(row);
  assert.equal(result.semanticStatus, 'unsupported');
  assert.match(result.reasons.join(','), /page_title_alone_not_valid_program_identity|generic_title_not_program_identity/);
}

{
  const row = baseRecord({
    gapFamily: 'dd_routing',
    sourceRole: 'regional_center_root_from_dds_directory',
    pageTitle: 'Example Regional Center',
    h1s: ['Example Regional Center'],
    phones: ['(555) 123-0000'],
    addressLines: ['123 Main St, Los Angeles, CA'],
    paragraphs: ['Service area: California'],
    links: [
      { text: 'Eligibility', href: 'https://example.ca.gov/eligibility' },
      { text: 'Appeals', href: 'https://example.ca.gov/appeals' },
    ],
  });
  const result = evaluateCaliforniaSemanticRecord(row);
  assert.equal(result.semanticStatus, 'rejected');
  assert.ok(result.reasons.includes('statewide_value_used_as_catchment_boundaries'));
}

{
  const sameUrl = 'https://example.ca.gov/contact';
  const row = baseRecord({
    gapFamily: 'dd_routing',
    sourceRole: 'regional_center_root_from_dds_directory',
    pageTitle: 'Example Regional Center',
    h1s: ['Example Regional Center'],
    phones: ['(555) 123-0000'],
    addressLines: ['123 Main St, Los Angeles, CA'],
    paragraphs: ['Counties served: Alameda and Contra Costa'],
    links: [
      { text: 'Eligibility', href: sameUrl },
      { text: 'Services', href: sameUrl },
      { text: 'Appeals', href: sameUrl },
    ],
  });
  const result = evaluateCaliforniaSemanticRecord(row);
  assert.equal(result.semanticStatus, 'rejected');
  assert.ok(result.reasons.includes('same_url_reused_for_multiple_semantic_fields'));
}

{
  const row = baseRecord({
    gapFamily: 'forms_guides',
    sourceRole: 'exact_form_pdf',
    pageTitle: 'SOC 873.pdf',
    h1s: [],
    paragraphs: [
      'SOC 873 (01/24)',
      'HEALTH CARE CERTIFICATION',
      'California Department of Social Services',
      'Applicant/recipient must complete this form.',
    ],
  });
  const result = evaluateCaliforniaSemanticRecord(row);
  assert.equal(result.semanticStatus, 'enrichment_required');
  assert.ok(result.reasons.includes('form_missing_signer_or_submission_route'));
}

{
  const row = baseRecord({
    gapFamily: 'dd_routing',
    sourceRole: 'regional_center_root_from_dds_directory',
    pageTitle: 'Example Regional Center',
    h1s: ['Example Regional Center'],
    phones: ['(555) 123-0000'],
    emails: ['info@example.org'],
    addressLines: ['123 Main St, Los Angeles, CA'],
    paragraphs: ['Counties served: Alameda and Contra Costa'],
    links: [
      { text: 'Eligibility', href: 'https://example.ca.gov/eligibility' },
      { text: 'Appeals', href: 'https://example.ca.gov/appeals' },
    ],
  });
  const result = evaluateCaliforniaSemanticRecord(row);
  const intakeField = result.fieldEntries.find((entry) => entry.field === 'intake_contact');
  assert.equal(intakeField?.covered, false);
}

{
  const row = baseRecord({
    gapFamily: 'general_gap_fill',
    sourceRole: 'alternatives_to_conservatorship',
    pageTitle: 'Options to help someone with an impairment or disability | California Courts | Self Help Guide',
    h1s: ['Options to help someone with an impairment or disability'],
    paragraphs: ['California Courts self help guide for alternatives to conservatorship and decision making support.'],
  });
  const result = evaluateCaliforniaSemanticRecord(row);
  assert.equal(result.semanticStatus, 'unsupported');
  assert.equal(result.entityType, 'policy_or_informational_page');
}

console.log('ok');
