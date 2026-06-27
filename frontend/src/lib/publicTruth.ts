import { NON_CA_VERIFIED_COUNTIES } from './verifiedCounties.ts';
import { stateAuditStatus, stateRuntimeLaunchStatus } from './stateAudit.ts';
import {
  isMeaningfulDirectoryEmail,
  isMeaningfulDirectoryPhone,
  isMeaningfulDirectoryWebsite,
  isSyntheticDirectoryUrl,
} from './directoryFoundation.ts';

/**
 * PUBLIC_RENDERABLE_STATE_IDS defines all states that the application can render in the UI
 * for navigation and user research.
 * IMPORTANT: This is NOT an allowlist for search engine indexation. Indexability is strictly
 * controlled by stateAuditStatus() via isIndexableState(stateId).
 */
export const PUBLIC_RENDERABLE_STATE_IDS = [
  'california', 'texas', 'florida', 'pennsylvania', 'new-york', 'ohio', 'illinois', 'georgia',
  'maryland', 'utah', 'new-mexico', 'oregon', 'washington', 'idaho', 'south-carolina',
  'north-dakota', 'west-virginia', 'montana', 'colorado', 'louisiana', 'south-dakota',
  'alabama', 'wisconsin', 'arkansas', 'oklahoma', 'north-carolina', 'mississippi', 'michigan',
  'minnesota', 'indiana', 'nebraska', 'tennessee', 'virginia', 'arizona', 'alaska',
  'connecticut', 'delaware', 'hawaii', 'iowa', 'kansas', 'kentucky', 'maine', 'massachusetts',
  'missouri', 'nevada', 'new-hampshire', 'new-jersey', 'rhode-island', 'vermont', 'wyoming',
] as const;


export const VERIFIED_DIAGNOSIS_SLUGS = [
  'autism-spectrum-disorder',
  'adhd',
  'down-syndrome',
  'speech-or-language-delay',
  'cerebral-palsy',
  'epilepsy',
] as const;

export const HIGH_FIDELITY_COUNTY_DIAGNOSIS_IDS = [
  'los-angeles',
  'orange',
  'san-diego',
  'riverside',
  'sacramento',
  'san-francisco',
  'alameda',
  'fresno',
] as const;

export const HIGH_FIDELITY_COUNTY_DIAGNOSIS_COUNTIES_BY_STATE = {
  california: HIGH_FIDELITY_COUNTY_DIAGNOSIS_IDS,
  arizona: ['maricopa-az', 'pima-az'],
  connecticut: ['fairfield-ct', 'hartford-ct'],
  delaware: ['new-castle-de', 'sussex-de'],
  hawaii: ['honolulu-hi', 'hawai-i-hi'],
  maryland: ['montgomery-md', 'prince-george-s-md'],
  massachusetts: ['middlesex-ma', 'worcester-ma'],
  'new-hampshire': ['hillsborough-nh', 'rockingham-nh'],
  'new-jersey': ['bergen-nj', 'middlesex-nj'],
  oregon: ['multnomah-or', 'washington-or'],
  'rhode-island': ['providence-ri', 'kent-ri'],
  virginia: ['fairfax-va', 'prince-william-va'],
  washington: ['king-wa', 'pierce-wa'],
  colorado: ['el-paso-co', 'city-and-county-of-denver-co'],
  michigan: ['wayne-mi', 'oakland-mi'],
  'south-carolina': ['greenville-sc', 'richland-sc'],
  'north-carolina': ['wake-nc', 'mecklenburg-nc'],
  'new-mexico': ['bernalillo-nm', 'do-a-ana-nm'],
  louisiana: ['east-baton-rouge-parish-la', 'jefferson-parish-la'],
  missouri: ['saint-louis-mo', 'jackson-mo'],
  tennessee: ['shelby-tn', 'davidson-tn'],
  wisconsin: ['milwaukee-wi', 'dane-wi'],
  indiana: ['marion-in', 'lake-in'],
  minnesota: ['hennepin-mn', 'ramsey-mn'],
  idaho: ['ada-id', 'canyon-id'],
  utah: ['salt-lake-ut', 'utah-ut'],
  'north-dakota': ['cass-nd', 'burleigh-nd'],
  wyoming: ['laramie-wy', 'natrona-wy'],
  kentucky: ['jefferson-ky', 'fayette-ky'],
  kansas: ['johnson-ks', 'sedgwick-ks'],
  iowa: ['polk-ia', 'linn-ia'],
  montana: ['yellowstone-mt', 'gallatin-mt'],
  nebraska: ['douglas-ne', 'lancaster-ne'],
  maine: ['cumberland-me', 'york-me'],
  vermont: ['chittenden-vt', 'rutland-vt'],
  nevada: ['clark-nv', 'washoe-nv'],
  oklahoma: ['oklahoma-ok', 'tulsa-ok'],
  'west-virginia': ['kanawha-wv', 'berkeley-wv'],
  alabama: ['jefferson-al', 'madison-al'],
  alaska: ['anchorage-ak', 'matanuska-susitna-borough-ak'],
  arkansas: ['pulaski-ar', 'benton-ar'],
  mississippi: ['harrison-ms', 'hinds-ms'],
  'south-dakota': ['minnehaha-sd', 'pennington-sd'],
  ohio: ['franklin-oh', 'cuyahoga-oh', 'hamilton-oh', 'summit-oh', 'montgomery-oh', 'lucas-oh', 'stark-oh'],
  pennsylvania: ['philadelphia-pa', 'allegheny-pa', 'montgomery-pa', 'bucks-pa', 'delaware-pa', 'chester-pa', 'lancaster-pa', 'berks-pa'],
  illinois: ['cook-il', 'dupage-il', 'lake-il', 'will-il', 'kane-il', 'mchenry-il', 'winnebago-il', 'sangamon-il', 'st-clair-il', 'madison-il'],
  georgia: ['fulton-ga', 'gwinnett-ga', 'cobb-ga', 'dekalb-ga', 'clayton-ga', 'cherokee-ga', 'forsyth-ga', 'chatham-ga', 'richmond-ga', 'muscogee-ga', 'clarke-ga'],
  'new-york': ['kings-ny', 'queens-ny', 'new-york-ny', 'bronx-ny', 'richmond-ny', 'nassau-ny', 'suffolk-ny', 'westchester-ny', 'erie-ny', 'monroe-ny', 'onondaga-ny', 'albany-ny'],
  texas: ['harris-tx', 'dallas-tx', 'tarrant-tx', 'travis-tx', 'bexar-tx', 'el-paso-tx', 'collin-tx', 'denton-tx', 'fort-bend-tx', 'williamson-tx', 'montgomery-tx', 'hidalgo-tx'],
  florida: ['miami-dade-fl', 'broward-fl', 'palm-beach-fl', 'hillsborough-fl', 'orange-fl', 'pinellas-fl', 'duval-fl', 'lee-fl', 'polk-fl', 'brevard-fl', 'pasco-fl', 'seminole-fl', 'alachua-fl', 'leon-fl'],
} as const;
const PUBLIC_VERIFICATION_STATUSES = new Set(['official_verified', 'verified', 'human_verified', 'source_listed']);
const FALLBACK_DATA_ORIGINS = new Set(['programmatic_fallback', 'generated_county_fallback']);
const SYNTHETIC_SOURCE_HOST_PATTERNS = [
  /^example\.(com|org|net)$/i,
  /^www\.example\.(com|org|net)$/i,
  /^state\.gov$/i,
  /^www\.state\.gov$/i,
  /^localhost$/i,
  /^127\.0\.0\.1$/i,
  /^0\.0\.0\.0$/i,
  /^ablefull\.org$/i,
  /^www\.ablefull\.org$/i,
  /^www\.advocate\./i,
  /^www\.therapy\./i,
  /^www\.legal\./i,
  /^www\.pediatrictherapy\./i,
  /^[a-z]{2}-pa\.org$/i,
] as const;

type PublicRecordLike = {
  id?: string | null;
  name?: string | null;
  office_name?: string | null;
  program_id?: string | null;
  display_status?: string | null;
  source_url?: string | null;
  website?: string | null;
  next_step_url?: string | null;
  application_url?: string | null;
  referral_url?: string | null;
  phone?: string | null;
  email?: string | null;
  intake_phone?: string | null;
  spec_ed_contact_phone?: string | null;
  spec_ed_contact_email?: string | null;
  next_step_phone?: string | null;
  next_step_email?: string | null;
  source_type?: string | null;
  verification_status?: string | null;
  data_origin?: string | null;
  last_verified_date?: string | null;
  last_verified_at?: string | null;
  checked_at?: string | null;
  source_last_updated?: string | null;
  last_scraped_at?: string | null;
};

type CountyDetailsLike = {
  id: string;
  countyOffices?: Array<PublicRecordLike & { program_id?: string | null }>;
  schoolDistricts?: PublicRecordLike[];
  localOrganizations?: PublicRecordLike[];
  regionalCenters?: PublicRecordLike[];
  selpas?: PublicRecordLike[];
};

function hasSyntheticSourceHost(url?: string | null): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return SYNTHETIC_SOURCE_HOST_PATTERNS.some((pattern) => pattern.test(parsed.hostname));
  } catch {
    return true;
  }
}

export function isIndexableState(stateId: string): boolean {
  const status = stateAuditStatus(stateId);
  if (status === null || status.indexSafe !== true) {
    return false;
  }

  const runtimeStatus = stateRuntimeLaunchStatus(stateId);
  return runtimeStatus !== null && runtimeStatus.runtimeIndexSafe === true;
}

export function isAcceptablePublicVerificationStatus(status?: string | null): boolean {
  return Boolean(status && PUBLIC_VERIFICATION_STATUSES.has(status));
}

export function hasPublicContactSignal(record?: PublicRecordLike | null): boolean {
  if (!record) return false;
  const phone = record.phone || record.intake_phone || record.spec_ed_contact_phone || '';
  const email = record.email || record.spec_ed_contact_email || '';
  const website = record.website || '';

  const hasPhone = isMeaningfulDirectoryPhone(phone);
  const hasEmail = isMeaningfulDirectoryEmail(email);
  const hasWebsite = isMeaningfulDirectoryWebsite(website);

  return Boolean(
    hasPhone ||
    hasEmail ||
    hasWebsite
  );
}

function hasDirectPublicContactSignal(record?: PublicRecordLike | null): boolean {
  if (!record) return false;
  const phone = record.phone || record.intake_phone || record.spec_ed_contact_phone || '';
  const email = record.email || record.spec_ed_contact_email || '';
  return isMeaningfulDirectoryPhone(phone) || isMeaningfulDirectoryEmail(email);
}

function hasInvalidPublicContactField(record?: PublicRecordLike | null): boolean {
  if (!record) return false;
  const phone = record.phone || record.intake_phone || record.spec_ed_contact_phone || '';
  const email = record.email || record.spec_ed_contact_email || '';
  const website = record.website || '';
  const nextStepPhone = record.next_step_phone || '';
  const nextStepEmail = record.next_step_email || '';
  const actionUrls = [record.next_step_url, record.application_url, record.referral_url].filter(Boolean) as string[];

  if (phone && !isMeaningfulDirectoryPhone(phone)) return true;
  if (email && !isMeaningfulDirectoryEmail(email)) return true;
  if (website && !isMeaningfulDirectoryWebsite(website)) return true;
  if (nextStepPhone && !isMeaningfulDirectoryPhone(nextStepPhone)) return true;
  if (nextStepEmail && !isMeaningfulDirectoryEmail(nextStepEmail)) return true;
  if (actionUrls.some((url) => isSyntheticDirectoryUrl(url))) return true;
  return false;
}

function hasInvalidPublicNameField(record?: PublicRecordLike | null): boolean {
  if (!record) return false;
  const value = String(record.office_name || record.name || '').trim();
  if (!value) return false;
  return /\b(placeholder|dummy|fake|test record|generated county fallback)\b/i.test(value);
}

export function hasPublicSourceUrl(record?: PublicRecordLike | null): boolean {
  if (!record?.source_url) return false;
  if (hasSyntheticSourceHost(record.source_url)) return false;

  try {
    const url = new URL(record.source_url);
    return !url.username && !url.password && !isSyntheticDirectoryUrl(record.source_url);
  } catch {
    return false;
  }
}

export function hasPublicFreshnessSignal(record?: PublicRecordLike | null): boolean {
  if (!record) return false;

  return Boolean(
    (record.last_verified_at && String(record.last_verified_at).trim()) ||
    (record.last_verified_date && String(record.last_verified_date).trim()) ||
    (record.checked_at && String(record.checked_at).trim()) ||
    (record.source_last_updated && String(record.source_last_updated).trim()) ||
    (record.last_scraped_at && String(record.last_scraped_at).trim())
  );
}

export function isLikelySyntheticPublicAdvocate(record?: PublicRecordLike | null): boolean {
  if (!record?.id?.startsWith('gen-')) return false;
  if (!['verified', 'official_verified', 'human_verified', 'source_listed'].includes(record.verification_status || '')) return false;
  if (record.last_verified_date) return false;

  const phone = record.phone || '';
  const email = record.email || '';
  if (isMeaningfulDirectoryPhone(phone) || isMeaningfulDirectoryEmail(email)) return false;

  if ((record.website || '').trim() !== 'https://www.cde.ca.gov/sp/se/') return false;

  try {
    const url = new URL(record.source_url || '');
    return url.hostname.toLowerCase().endsWith('advocacy.com');
  } catch {
    return false;
  }
}

export function isPublicRecordEligible(record?: PublicRecordLike | null): boolean {
  if (!record) return false;

  return (
    (record.display_status || 'published') === 'published' &&
    !FALLBACK_DATA_ORIGINS.has(record.data_origin || '') &&
    (record.data_origin || '') !== 'seed' &&
    (record.data_origin || '') !== 'manual_seed' &&
    (record.source_type || '') !== 'seed' &&
    !isLikelySyntheticPublicAdvocate(record) &&
    !hasInvalidPublicNameField(record) &&
    !hasInvalidPublicContactField(record) &&
    isAcceptablePublicVerificationStatus(record.verification_status) &&
    hasPublicSourceUrl(record) &&
    hasPublicContactSignal(record)
  );
}

const COUNTY_OFFICE_STRONG_SIGNAL = /\b(ihss|in-?home supportive|social services?|human services?|health services?|health care services?|public social services?|medi-?cal|medicaid|children'?s services|ccs\b|child health)\b/i;
const COUNTY_OFFICE_WEAK_AGING_ONLY_SIGNAL = /\b(aging services?|aging and adult services?|area agency on aging|older adults?|senior services?|senior center)\b/i;

export function isPublicCountyOfficeEligible(record?: PublicRecordLike | null): boolean {
  if (!isPublicRecordEligible(record)) return false;

  const officeText = [
    record?.office_name,
    record?.name,
    record?.source_url,
    record?.website,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const hasStrongOfficeSignal = COUNTY_OFFICE_STRONG_SIGNAL.test(officeText);
  const hasWeakAgingOnlySignal = COUNTY_OFFICE_WEAK_AGING_ONLY_SIGNAL.test(officeText);

  if (hasWeakAgingOnlySignal && !hasStrongOfficeSignal) {
    return false;
  }

  return true;
}

export function isPublicDirectoryRecordEligible(record?: PublicRecordLike | null): boolean {
  return isPublicRecordEligible(record) && hasPublicFreshnessSignal(record);
}

export function isVerifiedNonCaliforniaCounty(countyId: string): boolean {
  return NON_CA_VERIFIED_COUNTIES.includes(countyId);
}

export function isHighFidelityCountyDiagnosisSurface(stateId: string, countyId: string): boolean {
  const counties = HIGH_FIDELITY_COUNTY_DIAGNOSIS_COUNTIES_BY_STATE[
    stateId as keyof typeof HIGH_FIDELITY_COUNTY_DIAGNOSIS_COUNTIES_BY_STATE
  ] as readonly string[] | undefined;
  return Boolean(
    counties &&
    counties.includes(countyId)
  );
}

function hasRequiredCountyOffice(details: CountyDetailsLike, programId: string): boolean {
  return (details.countyOffices || []).some((office) =>
    office.program_id === programId &&
    isPublicCountyOfficeEligible(office) &&
    hasDirectPublicContactSignal(office)
  );
}

export function getCountyTruthEligibility(stateId: string, countyDetails?: CountyDetailsLike | null) {
  const blockers: string[] = [];

  if (!countyDetails) {
    return { publicSafe: false, indexSafe: false, blockers: ['missing_county_details'] };
  }

  if (stateId === 'california') {
    const hasRegionalCenter = (countyDetails.regionalCenters || []).some((record) =>
      isPublicRecordEligible(record) && hasDirectPublicContactSignal(record)
    );
    const hasSelpa = (countyDetails.selpas || []).some((record) =>
      isPublicRecordEligible(record) && hasDirectPublicContactSignal(record)
    );
    const hasIhss = hasRequiredCountyOffice(countyDetails, 'ihss-for-children');
    const hasMediCal = hasRequiredCountyOffice(countyDetails, 'medi-cal-for-kids-and-teens');
    const hasCcs = hasRequiredCountyOffice(countyDetails, 'california-childrens-services');
    const hasDistrict = (countyDetails.schoolDistricts || []).some((record) =>
      isPublicRecordEligible(record) && hasDirectPublicContactSignal(record)
    );

    if (!hasRegionalCenter) blockers.push('missing_public_regional_center');
    if (!hasSelpa) blockers.push('missing_public_selpa');
    if (!hasIhss) blockers.push('missing_public_ihss_office');
    if (!hasMediCal) blockers.push('missing_public_medicaid_office');
    if (!hasCcs) blockers.push('missing_public_ccs_office');
    if (!hasDistrict) blockers.push('missing_public_school_district');

    const publicSafe = blockers.length === 0;
    const indexSafe = publicSafe && isIndexableState(stateId);
    const finalBlockers = [...blockers];
    if (!isIndexableState(stateId)) {
      finalBlockers.push('state_not_index_enabled');
    }
    return { publicSafe, indexSafe, blockers: finalBlockers };
  }

  const hasAnyPublicRecord =
    (countyDetails.regionalCenters || []).some((record) => isPublicRecordEligible(record) && hasDirectPublicContactSignal(record)) ||
    (countyDetails.selpas || []).some((record) => isPublicRecordEligible(record) && hasDirectPublicContactSignal(record)) ||
    (countyDetails.countyOffices || []).some((record) => isPublicCountyOfficeEligible(record) && hasDirectPublicContactSignal(record)) ||
    (countyDetails.schoolDistricts || []).some((record) => isPublicRecordEligible(record) && hasDirectPublicContactSignal(record)) ||
    (countyDetails.localOrganizations || []).some(isPublicDirectoryRecordEligible);

  if (!hasAnyPublicRecord) {
    blockers.push('missing_public_local_records');
  }

  if (!isVerifiedNonCaliforniaCounty(countyDetails.id)) {
    blockers.push('county_not_in_verified_allowlist');
  }

  const publicSafe = blockers.length === 0;
  const indexSafe = publicSafe && isIndexableState(stateId);
  const finalBlockers = [...blockers];
  if (!isIndexableState(stateId)) {
    finalBlockers.push('state_not_index_enabled');
  }
  return { publicSafe, indexSafe, blockers: finalBlockers };
}

export function getCountyDiagnosisTruthEligibility(
  stateId: string,
  diagnosisSlug: string,
  countyId: string,
  countyDetails?: CountyDetailsLike | null
) {
  const countyTruth = getCountyTruthEligibility(stateId, countyDetails);
  const blockers = [...countyTruth.blockers];

  if (!isIndexableState(stateId)) {
    blockers.push('state_not_index_enabled');
  }

  if (!VERIFIED_DIAGNOSIS_SLUGS.includes(diagnosisSlug as (typeof VERIFIED_DIAGNOSIS_SLUGS)[number])) {
    blockers.push('diagnosis_not_verified');
  }

  if (!isHighFidelityCountyDiagnosisSurface(stateId, countyId)) {
    blockers.push('county_diagnosis_surface_not_high_fidelity');
  }

  return {
    publicSafe: countyTruth.publicSafe,
    indexSafe: countyTruth.publicSafe && blockers.length === 0,
    blockers,
  };
}
