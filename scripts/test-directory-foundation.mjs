import assert from 'node:assert/strict';
import {
  getDirectoryAvailabilityDisplayLabel,
  getDirectoryFieldCoverage,
  hasDirectoryAvailabilityDetails,
  hasDirectoryPanelAccessibilityDetails,
  hasDirectoryPanelNextStepDetails,
  hasDirectorySampleAccessibilitySummary,
  hasDirectorySampleNextStepSummary,
  isMeaningfulDirectoryEmail,
  isMeaningfulDirectoryName,
  isMeaningfulDirectoryPhone,
  isMeaningfulDirectoryWebsite,
  isRenderableDirectoryFoundationRecord,
  validateDirectoryFoundationRecord,
} from '../frontend/src/lib/directoryFoundation.ts';
import {
  getCountyTruthEligibility,
  hasPublicFreshnessSignal,
  isPublicDirectoryRecordEligible,
  isPublicRecordEligible,
} from '../frontend/src/lib/publicTruth.ts';

function run() {
  const bareFreshnessRecord = {
    id: 'provider-1',
    name: 'Provider One',
    verification_status: 'verified',
    source_url: 'https://www.dds.ca.gov/provider',
    checked_at: '2026-06-17T00:00:00Z',
  };

  const coverage = getDirectoryFieldCoverage(bareFreshnessRecord);
  assert.equal(coverage.hasAvailability, true);
  assert.equal(hasDirectoryAvailabilityDetails(bareFreshnessRecord), false);
  assert.equal(getDirectoryAvailabilityDisplayLabel(bareFreshnessRecord), null);

  const unknownAvailabilityRecord = {
    ...bareFreshnessRecord,
    availability_status: 'unknown',
  };
  assert.equal(hasDirectoryAvailabilityDetails(unknownAvailabilityRecord), true);
  assert.equal(getDirectoryAvailabilityDisplayLabel(unknownAvailabilityRecord), 'Checked, availability not published');

  const actionLinkOnlyRecord = {
    id: 'provider-2',
    name: 'Provider Two',
    verification_status: 'verified',
    source_url: 'https://www.dds.ca.gov/provider-2',
    application_url: 'https://www.dds.ca.gov/apply',
  };

  assert.equal(getDirectoryFieldCoverage(actionLinkOnlyRecord).hasNextStep, true);
  assert.equal(hasDirectoryPanelNextStepDetails(actionLinkOnlyRecord), false);
  assert.equal(hasDirectorySampleNextStepSummary(actionLinkOnlyRecord), false);

  const phoneAndTypeRecord = {
    ...actionLinkOnlyRecord,
    next_step_type: 'call',
    next_step_phone: '(555) 123-4567',
  };
  assert.equal(hasDirectoryPanelNextStepDetails(phoneAndTypeRecord), true);
  assert.equal(hasDirectorySampleNextStepSummary(phoneAndTypeRecord), true);

  const accessFlagsOnlyRecord = {
    ...actionLinkOnlyRecord,
    interpreter_available: 1,
  };
  assert.equal(getDirectoryFieldCoverage(accessFlagsOnlyRecord).hasAccessibility, true);
  assert.equal(hasDirectoryPanelAccessibilityDetails(accessFlagsOnlyRecord), true);
  assert.equal(hasDirectorySampleAccessibilitySummary(accessFlagsOnlyRecord), false);

  const unsupportedRecord = {
    id: 'provider-3',
    name: 'Provider Three',
    verification_status: 'verified',
    source_url: 'https://www.dds.ca.gov/provider-3',
    unsupported_claim_flags: 'telehealth-not-confirmed',
  };
  assert.equal(isRenderableDirectoryFoundationRecord(unsupportedRecord), false);
  assert.equal(validateDirectoryFoundationRecord(unsupportedRecord).includes('unsupported_claim_flags_present'), true);

  const invalidRecord = {
    id: 'provider-4',
    name: 'Provider Four',
    verification_status: 'verified',
    source_url: 'https://www.therapy.fake-site',
    availability_status: 'wide-open',
    next_step_type: 'fax',
    funding_status: 'cash',
    claim_status: 'done',
    service_tags: 'therapy,wrong_tag',
    serving_tags: 'autism,wrong_audience',
  };
  const issues = validateDirectoryFoundationRecord(invalidRecord);
  assert.equal(issues.includes('synthetic_source_url'), true);
  assert.equal(issues.includes('invalid_availability_status'), true);
  assert.equal(issues.includes('invalid_next_step_type'), true);
  assert.equal(issues.includes('invalid_funding_status'), true);
  assert.equal(issues.includes('invalid_claim_status'), true);
  assert.equal(issues.includes('invalid_service_tags'), true);
  assert.equal(issues.includes('invalid_serving_tags'), true);
  assert.equal(isRenderableDirectoryFoundationRecord(invalidRecord), false);

  const cleanRenderableRecord = {
    id: 'provider-5',
    name: 'Provider Five',
    verification_status: 'source_listed',
    source_url: 'https://www.dds.ca.gov/provider-5',
    source_type: 'official_directory',
    data_origin: 'scraped',
    last_verified_date: '2026-06-17',
    last_scraped_at: '2026-06-17T00:00:00Z',
    confidence_score: 0.84,
    next_step_type: 'email',
    next_step_email: 'intake@dds.ca.gov',
    languages: 'English, Spanish',
    accessibility_notes: 'Interpreter available on request.',
    availability_status: 'limited',
  };
  assert.equal(validateDirectoryFoundationRecord(cleanRenderableRecord).length, 0);
  assert.equal(isRenderableDirectoryFoundationRecord(cleanRenderableRecord), true);
  assert.equal(hasDirectoryAvailabilityDetails(cleanRenderableRecord), true);
  assert.equal(getDirectoryAvailabilityDisplayLabel(cleanRenderableRecord), 'Limited');
  assert.equal(hasDirectoryPanelNextStepDetails(cleanRenderableRecord), true);
  assert.equal(hasDirectorySampleNextStepSummary(cleanRenderableRecord), true);
  assert.equal(hasDirectoryPanelAccessibilityDetails(cleanRenderableRecord), true);
  assert.equal(hasDirectorySampleAccessibilitySummary(cleanRenderableRecord), true);

  const invalidTagsOnlyRecord = {
    ...cleanRenderableRecord,
    service_tags: 'diagnosis',
  };
  assert.equal(validateDirectoryFoundationRecord(invalidTagsOnlyRecord).includes('invalid_service_tags'), true);
  assert.equal(isRenderableDirectoryFoundationRecord(invalidTagsOnlyRecord), false);

  const publicRecordWithoutFreshness = {
    id: 'provider-6',
    name: 'Provider Six',
    verification_status: 'official_verified',
    source_url: 'https://www.dds.ca.gov/provider-6',
    phone: '800-222-3333',
  };
  assert.equal(isPublicRecordEligible(publicRecordWithoutFreshness), true);
  assert.equal(hasPublicFreshnessSignal(publicRecordWithoutFreshness), false);
  assert.equal(isPublicDirectoryRecordEligible(publicRecordWithoutFreshness), false);

  const publicRecordWithFreshness = {
    ...publicRecordWithoutFreshness,
    checked_at: '2026-06-17T00:00:00Z',
  };
  assert.equal(hasPublicFreshnessSignal(publicRecordWithFreshness), true);
  assert.equal(isPublicDirectoryRecordEligible(publicRecordWithFreshness), true);

  const websiteOnlyPlaceholderRecord = {
    id: 'provider-7',
    name: 'Provider Seven',
    verification_status: 'official_verified',
    source_url: 'https://www.dds.ca.gov/provider-7',
    website: 'https://www.example.org/provider-7',
  };
  assert.equal(isPublicRecordEligible(websiteOnlyPlaceholderRecord), false);

  const websiteOnlyRealRecord = {
    ...websiteOnlyPlaceholderRecord,
    website: 'https://www.dds.ca.gov/provider-7',
  };
  assert.equal(isPublicRecordEligible(websiteOnlyRealRecord), true);

  const placeholderEmailRecord = {
    ...publicRecordWithFreshness,
    phone: '',
    email: 'placeholder@example.com',
    website: '',
  };
  assert.equal(isPublicRecordEligible(placeholderEmailRecord), false);

  const stateGovSourcePublicRecord = {
    ...publicRecordWithFreshness,
    source_url: 'https://www.state.gov/medicaid/new-york',
  };
  assert.equal(isPublicRecordEligible(stateGovSourcePublicRecord), false);

  const needsReviewPublicRecord = {
    ...publicRecordWithFreshness,
    display_status: 'needs_review',
  };
  assert.equal(isPublicRecordEligible(needsReviewPublicRecord), false);

  const seededPublicRecord = {
    ...publicRecordWithFreshness,
    data_origin: 'seed',
    source_type: 'seed',
  };
  assert.equal(isPublicRecordEligible(seededPublicRecord), false);

  assert.equal(isMeaningfulDirectoryPhone('(555) 123-4567'), false);
  assert.equal(isMeaningfulDirectoryPhone('(800) 541-5555'), true);
  assert.equal(isMeaningfulDirectoryEmail('placeholder@example.com'), false);
  assert.equal(isMeaningfulDirectoryEmail('intake@dds.ca.gov'), true);
  assert.equal(isMeaningfulDirectoryName('Provider Seven'), true);
  assert.equal(isMeaningfulDirectoryName('Generated County Fallback Resource'), false);
  assert.equal(isMeaningfulDirectoryWebsite('https://www.example.org/provider-7'), false);
  assert.equal(isMeaningfulDirectoryWebsite('https://www.dds.ca.gov/provider-7'), true);

  const placeholderContactRecord = {
    ...cleanRenderableRecord,
    phone: '(555) 123-4567',
    email: 'placeholder@example.com',
  };
  const placeholderIssues = validateDirectoryFoundationRecord(placeholderContactRecord);
  assert.equal(placeholderIssues.includes('invalid_public_phone'), true);
  assert.equal(placeholderIssues.includes('invalid_public_email'), true);
  assert.equal(isRenderableDirectoryFoundationRecord(placeholderContactRecord), false);

  const placeholderNameRecord = {
    ...cleanRenderableRecord,
    name: 'Placeholder Resource Under Review',
  };
  const placeholderNameIssues = validateDirectoryFoundationRecord(placeholderNameRecord);
  assert.equal(placeholderNameIssues.includes('invalid_public_name'), true);
  assert.equal(isRenderableDirectoryFoundationRecord(placeholderNameRecord), false);
  assert.equal(isPublicRecordEligible({
    ...publicRecordWithFreshness,
    name: 'Generated County Fallback Office',
  }), false);

  const stateGovSourceDirectoryRecord = {
    ...cleanRenderableRecord,
    source_url: 'https://www.state.gov/medicaid/new-york',
  };
  assert.equal(validateDirectoryFoundationRecord(stateGovSourceDirectoryRecord).includes('synthetic_source_url'), true);
  assert.equal(isRenderableDirectoryFoundationRecord(stateGovSourceDirectoryRecord), false);

  const searchResultSourceDirectoryRecord = {
    ...cleanRenderableRecord,
    source_url: 'https://www.google.com/search?q=county+family+resource+center',
  };
  assert.equal(validateDirectoryFoundationRecord(searchResultSourceDirectoryRecord).includes('synthetic_source_url'), true);
  assert.equal(isRenderableDirectoryFoundationRecord(searchResultSourceDirectoryRecord), false);

  const countyTruthWithWebsiteOnlyDistrict = getCountyTruthEligibility('california', {
    id: 'los-angeles',
    regionalCenters: [{
      name: 'Regional Center Example',
      source_url: 'https://www.dds.ca.gov/rc/example',
      website: 'https://www.dds.ca.gov/rc/example',
      verification_status: 'official_verified',
      data_origin: 'scraped',
      intake_phone: '800-222-3333',
    }],
    selpas: [{
      name: 'SELPA Example',
      source_url: 'https://www.cde.ca.gov/sp/se/as/example',
      website: 'https://www.cde.ca.gov/sp/se/as/example',
      verification_status: 'official_verified',
      data_origin: 'scraped',
      phone: '800-222-3334',
    }],
    countyOffices: [
      {
        office_name: 'IHSS Office Example',
        program_id: 'ihss-for-children',
        source_url: 'https://www.cdss.ca.gov/example-ihss',
        verification_status: 'official_verified',
        data_origin: 'scraped',
        phone: '800-222-3335',
      },
      {
        office_name: 'Medi-Cal Office Example',
        program_id: 'medi-cal-for-kids-and-teens',
        source_url: 'https://www.dhcs.ca.gov/example-medi-cal',
        verification_status: 'official_verified',
        data_origin: 'scraped',
        phone: '800-222-3336',
      },
      {
        office_name: 'CCS Office Example',
        program_id: 'california-childrens-services',
        source_url: 'https://www.dhcs.ca.gov/example-ccs',
        verification_status: 'official_verified',
        data_origin: 'scraped',
        phone: '800-222-3337',
      },
    ],
    schoolDistricts: [{
      name: 'Website Only District',
      source_url: 'https://district.example.edu',
      website: 'https://district.example.edu',
      verification_status: 'official_verified',
      data_origin: 'scraped',
    }],
  });
  assert.equal(countyTruthWithWebsiteOnlyDistrict.publicSafe, false);
  assert.equal(countyTruthWithWebsiteOnlyDistrict.blockers.includes('missing_public_school_district'), true);
}

run();
console.log('directory foundation tests passed');
