import { getPublishedProvenanceIssues, hasMinimumPublishedProvenance } from './publishedProvenance.ts';

const AVAILABILITY_STATUSES = [
  'available',
  'limited',
  'near_capacity',
  'waitlist',
  'full',
  'out_of_funding',
  'temporarily_closed',
  'unknown',
] as const;

const NEXT_STEP_TYPES = [
  'call',
  'email',
  'apply_online',
  'referral',
  'schedule',
  'walk_in',
  'download_form',
  'contact_form',
  'see_instructions',
  'unknown',
] as const;

const FUNDING_STATUSES = [
  'funded',
  'grant_funded',
  'insurance_only',
  'medicaid_only',
  'private_pay',
  'scholarships_available',
  'out_of_funding',
  'unknown',
] as const;

const CLAIM_STATUSES = [
  'unclaimed',
  'pending_review',
  'claimed',
  'verified_affiliation',
  'changes_submitted',
  'changes_approved',
] as const;

export const DIRECTORY_SERVICE_TAGS = [
  'food',
  'housing',
  'home_mods',
  'utilities',
  'supplies',
  'transport',
  'therapy',
  'behavioral_health',
  'benefits',
  'grants',
  'respite',
  'in_home_support',
  'caregiving',
  'early_intervention',
  'special_education',
  'iep_advocacy',
  'vocational_rehab',
  'transition',
  'guardianship',
  'trusts',
  'legal_aid',
  'appeals',
] as const;

export const DIRECTORY_SERVING_TAGS = [
  'down_syndrome',
  'autism',
  'idd_dd',
  'early_childhood',
  'school_age',
  'transition_age',
  'parents_caregivers',
  'medicaid_waiver_families',
  'iep_families',
  'non_english_speakers',
  'rural_families',
  'low_income_families',
] as const;

export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];
export type NextStepType = (typeof NEXT_STEP_TYPES)[number];
export type FundingStatus = (typeof FUNDING_STATUSES)[number];
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export type DirectoryFoundationRecord = {
  id: string;
  name: string;
  categories?: string | null;
  focus_condition?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  source_url?: string | null;
  source_type?: string | null;
  data_origin?: string | null;
  source_name?: string | null;
  verification_status?: string | null;
  confidence_score?: number | null;
  availability_status?: string | null;
  accepting_new_clients?: number | null;
  waitlist_status?: string | null;
  next_step_type?: string | null;
  funding_status?: string | null;
  claim_status?: string | null;
  service_tags?: string | null;
  serving_tags?: string | null;
  capacity_notes?: string | null;
  next_step_label?: string | null;
  next_step_url?: string | null;
  next_step_phone?: string | null;
  next_step_email?: string | null;
  next_step_instructions?: string | null;
  requirements?: string | null;
  application_url?: string | null;
  referral_url?: string | null;
  walk_in_available?: number | null;
  appointment_required?: number | null;
  languages?: string | null;
  languages_spoken?: string | null;
  accessibility_notes?: string | null;
  claim_email?: string | null;
  claimed_by?: string | null;
  unsupported_claim_flags?: string | null;
  manual_review_required?: number | null;
  checked_at?: string | null;
  source_last_updated?: string | null;
  last_scraped_at?: string | null;
  last_verified_at?: string | null;
  last_verified_date?: string | null;
  interpreter_available?: number | null;
  asl_available?: number | null;
  wheelchair_accessible?: number | null;
  virtual_services?: number | null;
  in_person_services?: number | null;
  home_visits?: number | null;
  transportation_help?: number | null;
  accepts_medi_cal?: number | null;
};

const AVAILABILITY_STATUS_SET = new Set(AVAILABILITY_STATUSES);
const NEXT_STEP_TYPE_SET = new Set(NEXT_STEP_TYPES);
const FUNDING_STATUS_SET = new Set(FUNDING_STATUSES);
const CLAIM_STATUS_SET = new Set(CLAIM_STATUSES);
const SERVICE_TAG_SET = new Set(DIRECTORY_SERVICE_TAGS);
const SERVING_TAG_SET = new Set(DIRECTORY_SERVING_TAGS);

const INVALID_SOURCE_HOSTS = [
  /^www\.advocate\./,
  /^www\.therapy\./,
  /^www\.legal\./,
  /^www\.pediatrictherapy\./,
  /^[a-z]{2}-pa\.org$/,
] as const;
const PLACEHOLDER_SITE_HOSTS = [
  /^example\.(com|org|net)$/i,
  /^www\.example\.(com|org|net)$/i,
  /^localhost$/i,
  /^127\.0\.0\.1$/i,
  /^0\.0\.0\.0$/i,
  /^ablefull\.org$/i,
  /^www\.ablefull\.org$/i,
  /^state\.gov$/i,
  /^www\.state\.gov$/i,
] as const;
const PLACEHOLDER_EMAIL_PATTERNS = [
  /@example\.(com|org|net)$/i,
  /^test@/i,
  /^fake@/i,
  /^dummy@/i,
  /^placeholder@/i,
] as const;
const VERIFIED_DIRECTORY_STATUSES = new Set(['verified', 'official_verified', 'human_verified', 'source_listed']);

export function parseDirectoryList(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isSupportedAvailabilityStatus(value?: string | null): value is AvailabilityStatus {
  return Boolean(value && AVAILABILITY_STATUS_SET.has(value as AvailabilityStatus));
}

export function isSupportedNextStepType(value?: string | null): value is NextStepType {
  return Boolean(value && NEXT_STEP_TYPE_SET.has(value as NextStepType));
}

export function isSupportedFundingStatus(value?: string | null): value is FundingStatus {
  return Boolean(value && FUNDING_STATUS_SET.has(value as FundingStatus));
}

export function isSupportedClaimStatus(value?: string | null): value is ClaimStatus {
  return Boolean(value && CLAIM_STATUS_SET.has(value as ClaimStatus));
}

export function hasDirectoryAvailabilitySignal(record: Partial<DirectoryFoundationRecord>): boolean {
  return Boolean(
    record.availability_status ||
    record.accepting_new_clients === 1 ||
    record.waitlist_status ||
    record.capacity_notes ||
    record.funding_status ||
    record.checked_at
  );
}

export function hasDirectoryNextStepSignal(record: Partial<DirectoryFoundationRecord>): boolean {
  return Boolean(
    record.next_step_type ||
    record.next_step_label ||
    record.next_step_url ||
    record.next_step_phone ||
    record.next_step_email ||
    record.next_step_instructions ||
    record.requirements ||
    record.application_url ||
    record.referral_url ||
    record.walk_in_available === 1 ||
    record.appointment_required === 1
  );
}

export function hasDirectoryAccessibilitySignal(record: Partial<DirectoryFoundationRecord>): boolean {
  return Boolean(record.languages || record.languages_spoken || record.accessibility_notes) ||
    Boolean(record.interpreter_available || record.asl_available || record.wheelchair_accessible) ||
    Boolean(record.virtual_services || record.in_person_services || record.home_visits || record.transportation_help);
}

export function hasDirectoryClaimGroundworkSignal(record: Partial<DirectoryFoundationRecord>): boolean {
  return Boolean(record.claim_status || record.claim_email || record.claimed_by);
}

export function getDirectoryFieldCoverage(record: Partial<DirectoryFoundationRecord>) {
  return {
    hasAvailability: hasDirectoryAvailabilitySignal(record),
    hasNextStep: hasDirectoryNextStepSignal(record),
    hasTags: parseDirectoryList(record.service_tags).length > 0 || parseDirectoryList(record.serving_tags).length > 0,
    hasAccessibility: hasDirectoryAccessibilitySignal(record),
    hasClaimGroundwork: hasDirectoryClaimGroundworkSignal(record),
  };
}

export function hasDirectoryAvailabilityDetails(record: Partial<DirectoryFoundationRecord>): boolean {
  return Boolean(
    record.availability_status ||
    record.accepting_new_clients === 1 ||
    record.waitlist_status ||
    record.capacity_notes ||
    record.funding_status
  );
}

export function getDirectoryAvailabilityDisplayLabel(record: Partial<DirectoryFoundationRecord>): string | null {
  if (!record.availability_status) return null;
  if (record.availability_status === 'unknown') {
    return 'Checked, availability not published';
  }
  return record.availability_status
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function hasDirectoryPanelNextStepDetails(record: Partial<DirectoryFoundationRecord>): boolean {
  return Boolean(
    record.next_step_type ||
    record.next_step_label ||
    record.next_step_phone ||
    record.next_step_email ||
    record.next_step_instructions ||
    record.requirements ||
    record.walk_in_available === 1 ||
    record.appointment_required === 1
  );
}

export function hasDirectorySampleNextStepSummary(record: Partial<DirectoryFoundationRecord>): boolean {
  return Boolean(
    record.next_step_type ||
    record.next_step_label ||
    record.next_step_phone ||
    record.next_step_email
  );
}

export function hasDirectoryPanelAccessibilityDetails(record: Partial<DirectoryFoundationRecord>): boolean {
  return Boolean(record.languages || record.languages_spoken || record.accessibility_notes) ||
    Boolean(record.interpreter_available || record.asl_available || record.wheelchair_accessible) ||
    Boolean(record.virtual_services || record.in_person_services || record.home_visits || record.transportation_help) ||
    record.accepts_medi_cal === 1;
}

export function hasDirectorySampleAccessibilitySummary(record: Partial<DirectoryFoundationRecord>): boolean {
  return Boolean(record.languages || record.languages_spoken || record.accessibility_notes);
}

export function isSyntheticDirectoryUrl(url?: string | null): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    if (
      (parsed.hostname === 'www.google.com' || parsed.hostname === 'google.com') &&
      pathname === '/search'
    ) {
      return true;
    }
    if (
      (parsed.hostname === 'www.bing.com' || parsed.hostname === 'bing.com') &&
      pathname === '/search'
    ) {
      return true;
    }
    return INVALID_SOURCE_HOSTS.some((pattern) => pattern.test(parsed.hostname)) ||
      PLACEHOLDER_SITE_HOSTS.some((pattern) => pattern.test(parsed.hostname));
  } catch {
    return true;
  }
}

export function isMeaningfulDirectoryPhone(phone?: string | null): boolean {
  const trimmed = String(phone || '').trim();
  if (!trimmed) return false;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10) return false;
  if (digits.startsWith('555') || digits.slice(3, 6) === '555') return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  if (digits.endsWith('1234') || digits.endsWith('0000')) return false;
  return true;
}

export function isMeaningfulDirectoryEmail(email?: string | null): boolean {
  const trimmed = String(email || '').trim().toLowerCase();
  if (!trimmed) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return false;
  return !PLACEHOLDER_EMAIL_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function isMeaningfulDirectoryWebsite(url?: string | null): boolean {
  const trimmed = String(url || '').trim();
  if (!trimmed) return false;
  return !isSyntheticDirectoryUrl(trimmed);
}

export function isLikelySyntheticAdvocateProfile(record: DirectoryFoundationRecord): boolean {
  if (!record.id.startsWith('gen-')) return false;
  if (!VERIFIED_DIRECTORY_STATUSES.has(record.verification_status || '')) return false;
  if (record.last_verified_date) return false;
  if ((record.email || '').trim() || (record.next_step_email || '').trim()) return false;
  const phone = (record.next_step_phone || '').trim();
  if (phone.includes('(555)')) return false;
  if (phone) return false;

  const website = (record.website || '').trim();
  if (website !== 'https://www.cde.ca.gov/sp/se/') return false;

  try {
    const sourceHost = new URL(record.source_url || '').hostname.toLowerCase();
    return sourceHost.endsWith('advocacy.com');
  } catch {
    return false;
  }
}

function invalidTagValues(raw: string | null | undefined, allowed: Set<string>) {
  return parseDirectoryList(raw).filter((value) => !allowed.has(value));
}

export function validateDirectoryFoundationRecord(record: DirectoryFoundationRecord): string[] {
  const issues: string[] = [];
  const actionUrls = [record.next_step_url, record.application_url, record.referral_url];

  if (record.source_url && isSyntheticDirectoryUrl(record.source_url)) {
    issues.push('synthetic_source_url');
  }

  if (record.website && isSyntheticDirectoryUrl(record.website)) {
    issues.push('synthetic_website');
  }

  if (actionUrls.some((url) => url && isSyntheticDirectoryUrl(url))) {
    issues.push('synthetic_action_url');
  }

  if (record.availability_status && !isSupportedAvailabilityStatus(record.availability_status)) {
    issues.push('invalid_availability_status');
  }

  if (record.next_step_type && !isSupportedNextStepType(record.next_step_type)) {
    issues.push('invalid_next_step_type');
  }

  if (record.funding_status && !isSupportedFundingStatus(record.funding_status)) {
    issues.push('invalid_funding_status');
  }

  if (record.claim_status && !isSupportedClaimStatus(record.claim_status)) {
    issues.push('invalid_claim_status');
  }

  if (invalidTagValues(record.service_tags, SERVICE_TAG_SET).length > 0) {
    issues.push('invalid_service_tags');
  }

  if (invalidTagValues(record.serving_tags, SERVING_TAG_SET).length > 0) {
    issues.push('invalid_serving_tags');
  }

  if (
    (record.verification_status === 'verified' ||
      record.verification_status === 'official_verified' ||
      record.verification_status === 'human_verified') &&
    !record.source_url
  ) {
    issues.push('verified_without_source_url');
  }

  for (const issue of getPublishedProvenanceIssues(record)) {
    issues.push(issue);
  }

  if ((record.categories || '').toLowerCase().includes('program') && record.focus_condition) {
    issues.push('possible_provider_program_confusion');
  }

  if (record.unsupported_claim_flags && record.unsupported_claim_flags.trim()) {
    issues.push('unsupported_claim_flags_present');
  }

  if (isLikelySyntheticAdvocateProfile(record)) {
    issues.push('likely_synthetic_advocate_profile');
  }

  if (record.phone && !isMeaningfulDirectoryPhone(record.phone)) {
    issues.push('invalid_public_phone');
  }

  if (record.next_step_phone && !isMeaningfulDirectoryPhone(record.next_step_phone)) {
    issues.push('invalid_public_next_step_phone');
  }

  if (record.email && !isMeaningfulDirectoryEmail(record.email)) {
    issues.push('invalid_public_email');
  }

  if (record.next_step_email && !isMeaningfulDirectoryEmail(record.next_step_email)) {
    issues.push('invalid_public_next_step_email');
  }

  return issues;
}

export function getStalenessLabel(record: DirectoryFoundationRecord): string | null {
  return (
    record.last_verified_at ||
    record.last_verified_date ||
    record.checked_at ||
    record.source_last_updated ||
    record.last_scraped_at ||
    null
  );
}

export function isRenderableDirectoryFoundationRecord(record: DirectoryFoundationRecord): boolean {
  const issues = validateDirectoryFoundationRecord(record);
  if (!hasMinimumPublishedProvenance(record)) return false;
  return !issues.includes('synthetic_source_url') &&
    !issues.includes('synthetic_website') &&
    !issues.includes('synthetic_action_url') &&
    !issues.includes('invalid_service_tags') &&
    !issues.includes('invalid_serving_tags') &&
    !issues.includes('invalid_public_phone') &&
    !issues.includes('invalid_public_next_step_phone') &&
    !issues.includes('invalid_public_email') &&
    !issues.includes('invalid_public_next_step_email') &&
    !issues.includes('missing_source_url') &&
    !issues.includes('missing_source_type') &&
    !issues.includes('missing_data_origin') &&
    !issues.includes('missing_verification_status') &&
    !issues.includes('missing_last_verified_date') &&
    !issues.includes('missing_last_scraped_at') &&
    !issues.includes('missing_confidence_score') &&
    !issues.includes('unsupported_claim_flags_present') &&
    !issues.includes('likely_synthetic_advocate_profile');
}
