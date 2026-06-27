export type IhssWageDisclosure = {
  countyId: string;
  countyName: string;
  hourlyRate: number | null;
  sourceUrl: string;
  sourceLabel: string;
  officialConfirmUrl: string;
  lastVerifiedDate: string;
  isEstimate: boolean;
  fallbackUsed: boolean;
  explanation: string;
};

export type IhssCountyEstimateRecord = {
  countyId: string;
  countyName: string;
  hourlyRate: number;
  sourceUrl: string;
  officialConfirmUrl: string;
  lastVerifiedDate: string;
  isEstimate: true;
  explanation: string;
};

export const CA_IHSS_WAGE_SOURCE_URL = 'https://galtadvocacy.com/ihss-wages-by-county/';
export const CA_IHSS_WAGE_LAST_VERIFIED_DATE = '2026-06-20';
export const CA_IHSS_WAGE_FALLBACK_URL = 'https://www.cdss.ca.gov/inforesources/county-ihss-offices';
export const CA_IHSS_WAGE_SOURCE_NOTE =
  'This estimate is based on a public California county IHSS wage directory that we checked on 2026-06-20. It is not an official county pay notice. Confirm the current rate with the county IHSS office before relying on it.';

// Preserved from the bounded 2026 California IHSS wage dataset already checked into the repo.
const CA_IHSS_STATIC_WAGES: Record<string, number> = {
  'alameda': 21.6,
  'alpine': 17.75,
  'amador': 18.4,
  'butte': 17.9,
  'calaveras': 17.89,
  'colusa': 17.4,
  'contra-costa': 20.03,
  'del-norte': 18.5,
  'el-dorado': 17.4,
  'fresno': 18.75,
  'glenn': 17.9,
  'humboldt': 18.4,
  'imperial': 18.83,
  'inyo': 17.65,
  'kern': 17.7,
  'kings': 17.5,
  'lake': 17.55,
  'lassen': 17.55,
  'los-angeles': 19.64,
  'madera': 17.4,
  'marin': 20.4,
  'mariposa': 17.5,
  'mendocino': 19.71,
  'merced': 17.5,
  'modoc': 17.75,
  'mono': 17.95,
  'monterey': 20.64,
  'napa': 20.9,
  'nevada': 18.5,
  'orange': 18.9,
  'placer': 18.5,
  'plumas': 18.5,
  'riverside': 19.9,
  'sacramento': 19.15,
  'san-benito': 19.35,
  'san-bernardino': 19,
  'san-diego': 20.4,
  'san-francisco': 23,
  'san-joaquin': 18.97,
  'san-luis-obispo': 21.4,
  'san-mateo': 21.7,
  'santa-barbara': 20.07,
  'santa-clara': 20.44,
  'santa-cruz': 20.9,
  'shasta': 18.5,
  'sierra': 18.5,
  'siskiyou': 16.9,
  'solano': 18.1,
  'sonoma': 20.25,
  'stanislaus': 18.65,
  'sutter': 17.9,
  'tehama': 18.15,
  'trinity': 18.25,
  'tulare': 17.5,
  'tuolumne': 17.9,
  'ventura': 20.55,
  'yolo': 19.05,
  'yuba': 18.78,
};

export const DEFAULT_CA_IHSS_ESTIMATE_HOURLY = CA_IHSS_STATIC_WAGES['los-angeles'];
export const DEFAULT_CA_IHSS_ESTIMATE_COUNTY_ID = 'los-angeles';
export const DEFAULT_CA_IHSS_ESTIMATE_COUNTY_NAME = 'Los Angeles';

function normalizeCountyId(countyIdOrName: string): string {
  return countyIdOrName
    .toLowerCase()
    .replace(/^city-and-county-of-/, '')
    .replace(/\bcounty\b/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function formatCountyNameFromId(countyId: string): string {
  return countyId
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export const CA_IHSS_COUNTY_ESTIMATES: IhssCountyEstimateRecord[] = Object.entries(CA_IHSS_STATIC_WAGES)
  .map(([countyId, hourlyRate]) => ({
    countyId,
    countyName: formatCountyNameFromId(countyId),
    hourlyRate,
    sourceUrl: CA_IHSS_WAGE_SOURCE_URL,
    officialConfirmUrl: CA_IHSS_WAGE_FALLBACK_URL,
    lastVerifiedDate: CA_IHSS_WAGE_LAST_VERIFIED_DATE,
    isEstimate: true as const,
    explanation: CA_IHSS_WAGE_SOURCE_NOTE,
  }))
  .sort((a, b) => a.countyName.localeCompare(b.countyName));

export function getCaIhssCountyEstimateRecord(countyIdOrName: string): IhssCountyEstimateRecord | null {
  const countyId = normalizeCountyId(countyIdOrName);
  return CA_IHSS_COUNTY_ESTIMATES.find((record) => record.countyId === countyId) ?? null;
}

export function getIhssWageDisclosure(
  stateId: string,
  countyIdOrName: string,
  countyName: string,
  countyRate?: number | null
): IhssWageDisclosure | null {
  if (stateId !== 'california') {
    return null;
  }

  const countyId = normalizeCountyId(countyIdOrName);
  const staticRate = CA_IHSS_STATIC_WAGES[countyId];
  const effectiveRate = countyRate !== null && countyRate !== undefined && Number.isFinite(countyRate) && countyRate > 0
    ? countyRate
    : staticRate ?? null;

  if (effectiveRate === null) {
    return {
      countyId,
      countyName,
      hourlyRate: null,
      sourceUrl: CA_IHSS_WAGE_FALLBACK_URL,
      sourceLabel: 'Official county IHSS office directory',
      officialConfirmUrl: CA_IHSS_WAGE_FALLBACK_URL,
      lastVerifiedDate: CA_IHSS_WAGE_LAST_VERIFIED_DATE,
      isEstimate: true,
      fallbackUsed: true,
      explanation:
        'We are still verifying the current IHSS provider pay estimate for this county. Use the official county IHSS office directory to confirm the latest local rate before relying on it.',
    };
  }

  return {
    countyId,
    countyName,
    hourlyRate: effectiveRate,
    sourceUrl: CA_IHSS_WAGE_SOURCE_URL,
    sourceLabel: 'Reviewed public county wage reference',
    officialConfirmUrl: CA_IHSS_WAGE_FALLBACK_URL,
    lastVerifiedDate: CA_IHSS_WAGE_LAST_VERIFIED_DATE,
    isEstimate: true,
    fallbackUsed: countyRate === null || countyRate === undefined || !Number.isFinite(countyRate) || countyRate <= 0,
    explanation:
      countyRate !== null && countyRate !== undefined && Number.isFinite(countyRate) && countyRate > 0
        ? CA_IHSS_WAGE_SOURCE_NOTE
        : 'This is an estimate from a checked California county IHSS wage reference. County provider pay can change, so confirm the current rate with the local IHSS office before using it.',
  };
}

export function getDefaultCaIhssWageDisclosure(): IhssWageDisclosure {
  return getIhssWageDisclosure(
    'california',
    DEFAULT_CA_IHSS_ESTIMATE_COUNTY_ID,
    DEFAULT_CA_IHSS_ESTIMATE_COUNTY_NAME,
    DEFAULT_CA_IHSS_ESTIMATE_HOURLY,
  )!;
}

export function formatIhssEstimateSourceLabel(disclosure: IhssWageDisclosure | null): string {
  if (!disclosure) return 'official county IHSS office directory';
  return disclosure.fallbackUsed
    ? 'official county IHSS office directory'
    : 'reviewed public county wage reference';
}

export function formatIhssEstimateSummary(disclosure: IhssWageDisclosure | null): string {
  if (!disclosure || disclosure.hourlyRate === null) {
    return 'We are still verifying the current county IHSS rate. Use the county IHSS office before relying on any pay estimate.';
  }

  return `Based on a reviewed ${disclosure.countyName} County wage estimate of $${disclosure.hourlyRate.toFixed(2)}/hr. Confirm the current county rate before relying on it.`;
}

export function getIhssMonthlyEstimate(disclosure: IhssWageDisclosure | null, monthlyHours: number): number | null {
  if (!disclosure || disclosure.hourlyRate === null || !Number.isFinite(monthlyHours) || monthlyHours <= 0) {
    return null;
  }

  return disclosure.hourlyRate * monthlyHours;
}
