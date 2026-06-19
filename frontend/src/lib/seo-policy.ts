import { NON_CA_VERIFIED_COUNTIES } from './verifiedCounties';

export type RouteType =
  | 'state-hub'
  | 'county-hub'
  | 'condition-hub'
  | 'program-guide'
  | 'category-hub'
  | 'comparison'
  | 'county-condition'
  | 'school-district'
  | 'city'
  | 'static-page'
  | 'unknown';

export type SeoPolicyInput = {
  routeType: RouteType;
  stateId?: string;
  countyId?: string;
  diagnosisId?: string;
  programId?: string;
  entityCount?: number;
  verifiedSourceCount?: number;
  officialSourceCount?: number;
  hasOfficialSource?: boolean;
  hasRealLocalAssets?: boolean;
  hasRequiredContactInfo?: boolean;
  hasApplicationSteps?: boolean;
  hasEligibilityRules?: boolean;
  hasDocuments?: boolean;
  hasUniqueLocalData?: boolean;
  hasNoPlaceholderData?: boolean;
  lastVerifiedDate?: string | null;
  confidenceScore?: number | null;
};

export type SeoPolicyResult = {
  index: boolean;
  follow: boolean;
  includeInSitemap: boolean;
  qualityScore: number;
  canonicalPath: string;
  reasons: string[];
  blockers: string[];
};

export const VERIFIED_STATES = ['california', 'texas', 'florida', 'pennsylvania', 'new-york', 'ohio', 'illinois'];

export const VERIFIED_DIAGNOSES = [
  'autism-spectrum-disorder',
  'adhd',
  'down-syndrome',
  'speech-or-language-delay',
  'cerebral-palsy',
  'epilepsy'
];

/**
 * Checks text content for generic placeholder values. Returns true if NO placeholders are found.
 */
export function assertNoPlaceholderData(text: string | null | undefined): boolean {
  if (!text) return true;
  const placeholderPatterns = [
    /\(555\)\s*019/i,
    /555-019/i,
    /State\s+Waiver\s+Code/i,
    /State\s+Waiver\s+Manuals/i,
    /Inclusive\s+Play\s+Space/i,
    /Pediatric\s+Therapy\s+Hub/i,
    /Family\s+Resource\s+Center\s+Network/i,
    /compiled\s+and\s+reviewed\s+by\s+special\s+needs\s+family\s+experts/i,
    /compiled\s+and\s+reviewed\s+by\s+experts/i,
    /expert/i,
    /placeholder/i,
    /fake/i,
    /example\.com/i,
    /test@/i,
    /dummy/i
  ];
  return !placeholderPatterns.some(pattern => pattern.test(text));
}

/**
 * Returns the canonical URL path for a given route pattern.
 */
export function canonicalForRoute(
  routeType: RouteType,
  params: {
    state?: string;
    county?: string;
    diagnosis?: string;
    program?: string;
    category?: string;
    path?: string;
  }
): string {
  const state = params.state?.toLowerCase() || 'california';
  const county = params.county?.toLowerCase() || '';
  const diagnosis = params.diagnosis?.toLowerCase() || '';
  const program = params.program?.toLowerCase() || '';
  const category = params.category?.toLowerCase() || '';

  switch (routeType) {
    case 'state-hub':
      return `/benefits/${state}`;
    case 'county-hub':
      return `/benefits/${state}/${county}`;
    case 'condition-hub':
      return `/benefits/${state}/${diagnosis}`;
    case 'program-guide':
      return `/programs/${program}`;
    case 'category-hub':
      return `/benefits/${state}/category/${category}`;
    case 'comparison':
      return `/benefits/${state}/compare`;
    case 'county-condition':
      return `/benefits/${state}/${diagnosis}/${county}`;
    case 'static-page':
      return params.path || '/';
    default:
      return '/benefits';
  }
}

/**
 * Resolves standard robots object.
 */
export function robotsForPolicy(result: SeoPolicyResult) {
  return {
    index: result.index,
    follow: result.follow
  };
}

/**
 * Resolves whether a page is eligible for sitemap inclusion.
 */
export function shouldIncludeInSitemap(result: SeoPolicyResult): boolean {
  return result.index && result.includeInSitemap;
}

/**
 * Core SEO Quality Gate Evaluator.
 */
export function evaluateSeoPolicy(input: SeoPolicyInput): SeoPolicyResult {
  const blockers: string[] = [];
  const reasons: string[] = [];
  let qualityScore = 0;

  const stateId = input.stateId?.toLowerCase() || '';
  const countyId = input.countyId?.toLowerCase() || '';
  const diagnosisId = input.diagnosisId?.toLowerCase() || '';

  const isVerifiedState = VERIFIED_STATES.includes(stateId);
  const isVerifiedDiagnosis = VERIFIED_DIAGNOSES.includes(diagnosisId);

  // 1. Quality Score calculation
  if (input.hasOfficialSource) {
    qualityScore += 15;
    reasons.push('Has official source URL (+15)');
  } else {
    if (input.routeType !== 'static-page') {
      blockers.push('Missing official source URL');
    }
  }

  if (input.lastVerifiedDate) {
    qualityScore += 10;
    reasons.push('Has freshness verification date (+10)');
  } else {
    if (input.routeType !== 'static-page') {
      blockers.push('Missing verification date');
    }
  }

  if (input.confidenceScore !== undefined && input.confidenceScore !== null) {
    const scoreVal = Math.min(30, Math.max(0, Math.round(input.confidenceScore * 30)));
    qualityScore += scoreVal;
    reasons.push(`Data confidence score contribution (+${scoreVal})`);
    if (input.confidenceScore < 0.7) {
      blockers.push(`Confidence score (${input.confidenceScore}) below 70% threshold`);
    }
  } else {
    if (input.routeType !== 'static-page') {
      blockers.push('Missing confidence score');
    }
  }

  if (input.hasEligibilityRules) {
    qualityScore += 10;
    reasons.push('Contains statutory eligibility rules (+10)');
  }
  if (input.hasApplicationSteps) {
    qualityScore += 10;
    reasons.push('Contains structured application steps (+10)');
  }
  if (input.hasDocuments) {
    qualityScore += 10;
    reasons.push('Contains document checklist (+10)');
  }
  if (input.hasRealLocalAssets) {
    qualityScore += 10;
    reasons.push('Contains real database local providers/clinics (+10)');
  }
  if (input.hasUniqueLocalData) {
    qualityScore += 5;
    reasons.push('Contains custom non-templated local context (+5)');
  }

  // 2. Hard constraints & gate verification
  if (input.hasNoPlaceholderData === false) {
    blockers.push('Contains placeholder data pattern (555 numbers, dummy text, etc.)');
  }

  if (input.routeType !== 'static-page') {
    if (!stateId) {
      blockers.push('Missing state ID context');
    } else if (!isVerifiedState) {
      blockers.push(`State '${stateId}' is not yet in the indexed state allowlist`);
    }
  }

  const isCa = stateId === 'california';

  switch (input.routeType) {
    case 'static-page':
      break;

    case 'state-hub':
      if (isVerifiedState) {
        reasons.push('State hub passes allowlist check.');
      }
      break;

    case 'county-hub':
      const isCaCounty = isCa && ['los-angeles', 'orange', 'sacramento', 'san-francisco'].includes(countyId);
      const isNonCaCounty = !isCa && NON_CA_VERIFIED_COUNTIES.includes(countyId);
      if (!isCaCounty && !isNonCaCounty) {
        blockers.push(`County '${countyId}' is not a verified high-fidelity county directory`);
      }
      if (!input.hasRequiredContactInfo) {
        blockers.push('County lacks required localized agency contact phone or address');
      }
      break;

    case 'condition-hub':
      if (!isVerifiedDiagnosis) {
        blockers.push(`Condition '${diagnosisId}' is not in the verified indexable conditions list`);
      }
      break;

    case 'program-guide':
      if (!input.hasApplicationSteps || !input.hasEligibilityRules) {
        blockers.push('Program guide is missing required application steps or eligibility criteria');
      }
      break;

    case 'category-hub':
      if (input.entityCount === undefined || input.entityCount === 0) {
        blockers.push('Category contains 0 programs for this state');
      }
      break;

    case 'comparison':
      if (input.entityCount === undefined || input.entityCount < 2) {
        blockers.push('Comparison matrix requires at least 2 programs');
      }
      break;

    case 'county-condition':
      // Extremely strict county-condition check
      if (stateId !== 'california') {
        blockers.push('County-condition leaf pages are only indexed for California currently');
      }
      if (countyId !== 'los-angeles' && countyId !== 'orange') {
        blockers.push('County-condition leaf pages only indexed for Los Angeles and Orange County');
      }
      if (!isVerifiedDiagnosis) {
        blockers.push(`Condition '${diagnosisId}' is not verified for county-condition hubs`);
      }
      if (!input.hasRealLocalAssets) {
        blockers.push('Lacks real provider, support group, or clinic directories from database');
      }
      if (!input.hasRequiredContactInfo) {
        blockers.push('Missing official local catchment/educational agency contacts');
      }
      break;

    default:
      blockers.push('Unknown or unsupported route type');
      break;
  }

  const canonicalPath = canonicalForRoute(input.routeType, {
    state: input.stateId,
    county: input.countyId,
    diagnosis: input.diagnosisId,
    program: input.programId,
    path: input.routeType === 'static-page' ? input.stateId : undefined // We can pass path in stateId parameter if needed, but it is better to pass it in params.path or use it as fallback. Let's pass stateId as path for static-page or just let canonicalForRoute handle it.
  });

  const shouldIndex = blockers.length === 0 && (input.routeType === 'static-page' || qualityScore >= 50);

  return {
    index: shouldIndex,
    follow: true,
    includeInSitemap: shouldIndex,
    qualityScore,
    canonicalPath,
    reasons,
    blockers
  };
}
