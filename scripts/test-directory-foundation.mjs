import assert from 'node:assert/strict';
import {
  getDirectoryAvailabilityDisplayLabel,
  getDirectoryFieldCoverage,
  hasDirectoryAvailabilityDetails,
  hasDirectoryPanelAccessibilityDetails,
  hasDirectoryPanelNextStepDetails,
  hasDirectorySampleAccessibilitySummary,
  hasDirectorySampleNextStepSummary,
  isRenderableDirectoryFoundationRecord,
  validateDirectoryFoundationRecord,
} from '../frontend/src/lib/directoryFoundation.ts';
import {
  hasPublicFreshnessSignal,
  isPublicDirectoryRecordEligible,
  isPublicRecordEligible,
} from '../frontend/src/lib/publicTruth.ts';

function run() {
  const bareFreshnessRecord = {
    id: 'provider-1',
    name: 'Provider One',
    verification_status: 'verified',
    source_url: 'https://example.org/provider',
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
    source_url: 'https://example.org/provider-2',
    application_url: 'https://example.org/apply',
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
    source_url: 'https://example.org/provider-3',
    unsupported_claim_flags: 'telehealth-not-confirmed',
  };
  assert.equal(isRenderableDirectoryFoundationRecord(unsupportedRecord), false);
  assert.deepEqual(validateDirectoryFoundationRecord(unsupportedRecord), ['unsupported_claim_flags_present']);

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
    source_url: 'https://example.org/provider-5',
    next_step_type: 'email',
    next_step_email: 'intake@example.org',
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

  const publicRecordWithoutFreshness = {
    id: 'provider-6',
    name: 'Provider Six',
    verification_status: 'official_verified',
    source_url: 'https://example.org/provider-6',
    phone: '800-111-2222',
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
}

run();
console.log('directory foundation tests passed');
