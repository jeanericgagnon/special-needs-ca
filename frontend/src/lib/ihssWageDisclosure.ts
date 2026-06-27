export type IhssWageDisclosure = {
  countyName: string;
  hourlyRate: number | null;
  sourceUrl: string;
  lastVerifiedDate: string;
  isEstimate: boolean;
  fallbackUsed: boolean;
  explanation: string;
};

export const CA_IHSS_WAGE_SOURCE_URL = 'https://www.cdss.ca.gov/inforesources/county-ihss-offices';
export const CA_IHSS_WAGE_LAST_VERIFIED_DATE = '2026-06-20';

export function getIhssWageDisclosure(
  stateId: string,
  countyName: string,
  countyRate?: number | null
): IhssWageDisclosure | null {
  if (stateId !== 'california') {
    return null;
  }

  if (countyRate === null || countyRate === undefined || !Number.isFinite(countyRate) || countyRate <= 0) {
    return {
      countyName,
      hourlyRate: null,
      sourceUrl: CA_IHSS_WAGE_SOURCE_URL,
      lastVerifiedDate: CA_IHSS_WAGE_LAST_VERIFIED_DATE,
      isEstimate: true,
      fallbackUsed: true,
      explanation:
        'We are still verifying the current IHSS provider pay estimate for this county. Use the county IHSS office source below to confirm the latest local rate before relying on it.',
    };
  }

  return {
    countyName,
    hourlyRate: countyRate,
    sourceUrl: CA_IHSS_WAGE_SOURCE_URL,
    lastVerifiedDate: CA_IHSS_WAGE_LAST_VERIFIED_DATE,
    isEstimate: true,
    fallbackUsed: false,
    explanation:
      'This is an estimate based on our stored county IHSS wage dataset and the California county IHSS office directory. County provider pay can change, so confirm the current rate with the local IHSS office before using it.',
  };
}
