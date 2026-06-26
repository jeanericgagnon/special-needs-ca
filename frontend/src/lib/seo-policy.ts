import { createRequire } from 'module';
import { NON_CA_VERIFIED_COUNTIES } from './verifiedCounties.ts';
import { isAllowlistedStaticPath, isHardBlockedSitemapRoute, isStaticGuidePath, normalizeManifestPath } from './seoRouteManifest.ts';
import {
  getEligibleStatesFromAudit,
  stateAuditStatus as readStateAuditStatus,
  stateGapReason as readStateGapReason,
  stateRuntimeLaunchStatus as readStateRuntimeLaunchStatus,
} from './stateAudit.ts';

const nodeRequire = typeof window === 'undefined' ? createRequire(import.meta.url) : null;

export type RouteType =
  | 'state-hub'
  | 'county-hub'
  | 'state-counties-hub'
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
  path?: string;
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
  hasVerifiedEligibilityRules?: boolean;
  hasDocuments?: boolean;
  hasUniqueLocalData?: boolean;
  hasNoPlaceholderData?: boolean;
  lastVerifiedDate?: string | null;
  confidenceScore?: number | null;
  verificationStatus?: string | null;
};

export type SeoPolicyResult = {
  index: boolean;
  follow: boolean;
  includeInSitemap: boolean;
  qualityScore: number;
  canonicalPath: string;
  canonicalUrl: string;
  schemaEligible: boolean;
  verificationState: 'official-verified' | 'human-reviewed' | 'crawler-verified' | 'unverified';
  reasons: string[];
  blockers: string[];
};

export function canRender(stateId?: string): boolean {
  if (!stateId) return true;
  return stateAuditStatus(stateId) !== null;
}

export function stateAuditStatus(stateId: string): { classification: string; indexSafe: boolean } | null {
  return readStateAuditStatus(stateId);
}

export function stateGapReason(stateId: string): string | null {
  return readStateGapReason(stateId);
}

export function stateRuntimeLaunchStatus(stateId: string): { runtimeIndexSafe: boolean } | null {
  return readStateRuntimeLaunchStatus(stateId);
}

export function canIndex(input: SeoPolicyInput): boolean {
  return evaluateSeoPolicy(input).index;
}

export function includeInSitemap(input: SeoPolicyInput): boolean {
  return shouldIncludeInSitemap(evaluateSeoPolicy(input));
}

export const ALL_STATES = [
  'california', 'texas', 'florida', 'pennsylvania', 'new-york', 'ohio', 'illinois',
  'georgia', 'maryland', 'utah', 'new-mexico', 'oregon', 'washington', 'idaho',
  'south-carolina', 'north-dakota', 'west-virginia', 'montana', 'colorado',
  'louisiana', 'south-dakota', 'alabama', 'wisconsin', 'arkansas', 'oklahoma',
  'north-carolina', 'mississippi', 'michigan', 'minnesota', 'indiana', 'nebraska',
  'tennessee', 'virginia', 'arizona', 'alaska', 'connecticut', 'delaware', 'hawaii',
  'iowa', 'kansas', 'kentucky', 'maine', 'massachusetts', 'missouri', 'nevada',
  'new-hampshire', 'new-jersey', 'rhode-island', 'vermont', 'wyoming'
];

export function getEligibleStates(): string[] {
  return getEligibleStatesFromAudit();
}

export const SEO_STATE_ALLOWLIST = getEligibleStates();

export function normalizeConfidenceScore(score: number | null | undefined): number | null {
  if (score === null || score === undefined) return null;
  if (score <= 1.0) {
    return score;
  }
  if (score <= 5.0) {
    return score / 5.0;
  }
  return score / 10.0;
}

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
    /placeholder/i,
    /fake/i,
    /example\.com/i,
    /test@/i,
    /dummy/i
  ];
  return !placeholderPatterns.some(pattern => pattern.test(text));
}

let dbHosts: Set<string> | null = null;

function getDbHosts(): Set<string> {
  if (dbHosts) return dbHosts;
  dbHosts = new Set();
  if (typeof window === 'undefined') {
    try {
      const fs = nodeRequire ? nodeRequire('fs') : null;
      const path = nodeRequire ? nodeRequire('path') : null;
      const Database = nodeRequire ? nodeRequire('better-sqlite3') : null;
      if (!fs || !path || !Database) {
        return dbHosts;
      }

      const dbPaths = [
        path.resolve(process.cwd(), 'ca_disability_navigator.db'),
        path.resolve(process.cwd(), 'frontend/ca_disability_navigator.db'),
        path.resolve(process.cwd(), '../frontend/ca_disability_navigator.db'),
      ];

      const dbPath = dbPaths.find((candidate: string) => fs.existsSync(candidate));
      if (dbPath) {
        const db = new Database(dbPath, { readonly: true });
        const queryTables = ['programs', 'regional_centers', 'school_districts', 'county_offices', 'resource_providers'];
        for (const table of queryTables) {
          try {
            const rows = db.prepare(`SELECT source_url FROM ${table} WHERE source_url IS NOT NULL`).all() as Array<{ source_url: string }>;
            rows.forEach((row) => {
              try {
                const parsed = new URL(row.source_url);
                dbHosts!.add(parsed.hostname.toLowerCase());
              } catch {}
            });
          } catch {}
        }
      }
    } catch (error) {
      console.warn('Unable to preload DB source hosts for SEO authority checks:', error);
    }
  }
  return dbHosts;
}

/**
 * Verifies if a given program URL is a valid first-party official source,
 * rejecting common fallbacks, mock URLs, and placeholders.
 */
export function hasOfficialProgramSource(url: string | null | undefined): boolean {
  if (!url) return false;
  let trimmed = url.trim();
  if (trimmed.startsWith('http://')) {
    trimmed = `https://${trimmed.slice(7)}`;
  }
  const lowered = trimmed.toLowerCase();
  if (
    lowered === '' ||
    lowered === 'null' ||
    lowered === 'undefined' ||
    lowered === 'https://www.dhcs.ca.gov' ||
    lowered === 'https://dhcs.ca.gov' ||
    lowered === 'https://www.ablefull.org' ||
    lowered === 'https://ablefull.org' ||
    lowered.includes('example.com') ||
    lowered.includes('state.gov') ||
    lowered.startsWith('#')
  ) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname.endsWith('.gov') ||
      hostname.endsWith('.gov.us') ||
      hostname.endsWith('.edu') ||
      /\.state\.[a-z]{2}\.us$/.test(hostname) ||
      /\.k12\.[a-z]{2}\.us$/.test(hostname)
    ) {
      return true;
    }

    const hosts = getDbHosts();
    if (hosts.has(hostname) || hosts.has(`www.${hostname}`)) {
      return true;
    }
    for (const host of hosts) {
      if (hostname.endsWith(`.${host}`)) {
        return true;
      }
    }

    const authoritativeRegistry = new Set([
      'myflorida.com',
      'myflfamilies.com',
      'isbe.net',
      'gadoe.org',
      'k12.wa.us',
      'ode.state.or.us',
      'wvde.us',
      'coveredca.com',
      'texasable.org',
      'ableunited.com',
      'floridakidcare.org',
      'floridaearlysteps.com',
      'disabilityrightsca.org',
      'odr-pa.org'
    ]);
    for (const domain of authoritativeRegistry) {
      if (hostname === domain || hostname.endsWith(`.${domain}`)) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
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
    schoolDistrict?: string;
    city?: string;
  },
  programStateId?: string | null
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
      if (programStateId) {
        return `/benefits/${programStateId}/program/${program}`;
      }
      return `/programs/${program}`;
    case 'category-hub':
      return `/benefits/${state}/category/${category}`;
    case 'comparison':
      return `/benefits/${state}/compare`;
    case 'county-condition':
      return `/benefits/${state}/${diagnosis}/${county}`;
    case 'static-page':
      return params.path || '/';
    case 'school-district':
      return `/school-districts/${state}/${params.schoolDistrict || program}`;
    case 'city':
      return `/benefits/${state}/${diagnosis}/${params.city || county}`;
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

  const auditStatus = stateId ? stateAuditStatus(stateId) : null;
  const runtimeLaunchStatus = stateId ? stateRuntimeLaunchStatus(stateId) : null;
  const isEligibleState = auditStatus !== null && auditStatus.classification === 'COMPLETE' && auditStatus.indexSafe === true;
  const requiresRuntimeParity = ['state-hub', 'state-counties-hub', 'county-hub', 'program-guide', 'category-hub', 'comparison', 'county-condition'].includes(input.routeType);
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
    const minThreshold = 0.7;
    if (input.confidenceScore < minThreshold) {
      blockers.push(`Confidence score (${input.confidenceScore}) below ${minThreshold * 100}% threshold`);
    }
  } else {
    if (input.routeType !== 'static-page') {
      blockers.push('Missing confidence score');
    }
  }

  const hasEligibilityRules = input.hasEligibilityRules && (input.hasVerifiedEligibilityRules ?? (stateId === 'california'));

  if (hasEligibilityRules) {
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
    } else if (auditStatus === null) {
      blockers.push(`Missing audit data for state '${stateId}'`);
    } else if (!isEligibleState) {
      blockers.push(`State '${stateId}' is not index-safe (classification: ${auditStatus.classification}, indexSafe: ${auditStatus.indexSafe})`);
    } else if (requiresRuntimeParity && (!runtimeLaunchStatus || runtimeLaunchStatus.runtimeIndexSafe !== true)) {
      blockers.push(`State '${stateId}' is not runtime-launch-safe`);
    }
  }

  switch (input.routeType) {
    case 'static-page':
      break;

    case 'state-hub':
      if (input.entityCount === undefined || input.entityCount < 1) {
        blockers.push('State hub has 0 programs');
      }
      if (!input.hasOfficialSource) {
        blockers.push('State hub lacks official source URL');
      }
      if (!input.lastVerifiedDate) {
        blockers.push('State hub lacks verification date');
      }
      const stateHubThreshold = 0.7;
      if (input.confidenceScore === undefined || input.confidenceScore === null || input.confidenceScore < stateHubThreshold) {
        blockers.push(`State hub confidence score (${input.confidenceScore ?? 'missing'}) below ${stateHubThreshold * 100}% threshold`);
      }
      break;

    case 'state-counties-hub':
      if (input.entityCount === undefined || input.entityCount < 1) {
        blockers.push('State counties directory has 0 counties in database');
      }
      if (!input.hasRealLocalAssets) {
        blockers.push('State has 0 indexable county hubs');
      }
      if (!input.hasOfficialSource) {
        blockers.push('Missing official source URL for counties directory');
      }
      if (!input.lastVerifiedDate) {
        blockers.push('Missing verification date for counties directory');
      }
      const stateCountiesThreshold = 0.7;
      if (input.confidenceScore === undefined || input.confidenceScore === null || input.confidenceScore < stateCountiesThreshold) {
        blockers.push(`Confidence score (${input.confidenceScore ?? 'missing'}) below ${stateCountiesThreshold * 100}% threshold`);
      }
      break;

    case 'county-hub':
      if (input.entityCount === undefined || input.entityCount < 1) {
        blockers.push('County hub lacks school district records (entityCount < 1)');
      }
      if (!input.hasRequiredContactInfo) {
        blockers.push('County lacks required localized agency contact phone or address');
      }
      if (!input.hasOfficialSource) {
        blockers.push('County hub lacks claim-specific official source verification');
      }
      if (!input.lastVerifiedDate) {
        blockers.push('County hub lacks verification date');
      }
      const countyHubThreshold = 0.7;
      if (input.confidenceScore === undefined || input.confidenceScore === null || input.confidenceScore < countyHubThreshold) {
        blockers.push(`County hub confidence score (${input.confidenceScore ?? 'missing'}) below ${countyHubThreshold * 100}% threshold`);
      }
      break;

    case 'condition-hub':
      if (!isVerifiedDiagnosis) {
        blockers.push(`Condition '${diagnosisId}' is not in the verified indexable conditions list`);
      }
      break;

    case 'program-guide':
      if (!input.hasApplicationSteps || !hasEligibilityRules || !input.hasDocuments) {
        blockers.push('Program guide is missing required application steps, eligibility criteria, or document checklist');
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
      if (input.entityCount === undefined || input.entityCount < 1) {
        blockers.push('County lacks verified school districts (entityCount < 1)');
      }
      if (!input.hasRealLocalAssets) {
        blockers.push('Lacks real provider, support group, or clinic directories from database');
      }
      if (!input.hasRequiredContactInfo) {
        blockers.push('Missing official local catchment/educational agency contacts');
      }
      break;

    case 'school-district':
      blockers.push('school-district pages are not ready for indexation');
      break;

    case 'city':
      blockers.push('city pages are not ready for indexation');
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
    schoolDistrict: input.routeType === 'school-district' ? input.programId : undefined,
    city: input.routeType === 'city' ? input.countyId : undefined,
    path: input.routeType === 'static-page' ? input.path : undefined
  });

  const shouldIndex = blockers.length === 0 && (input.routeType === 'static-page' || qualityScore >= 50);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  let verificationState: 'official-verified' | 'human-reviewed' | 'crawler-verified' | 'unverified' = 'unverified';
  if (input.verificationStatus === 'official_verified') {
    verificationState = 'official-verified';
  } else if (input.verificationStatus === 'verified' || input.verificationStatus === 'human_verified') {
    verificationState = 'human-reviewed';
  } else if (input.verificationStatus === 'crawler_verified' || input.verificationStatus === 'source_listed') {
    verificationState = 'crawler-verified';
  }

  return {
    index: shouldIndex,
    follow: true,
    includeInSitemap: shouldIndex,
    qualityScore,
    canonicalPath,
    canonicalUrl,
    schemaEligible: shouldIndex && ['state-hub', 'county-hub', 'condition-hub', 'program-guide', 'county-condition'].includes(input.routeType),
    verificationState,
    reasons,
    blockers
  };

}

function deriveStateFromStaticPath(path: string): string | null {
  const normalized = normalizeManifestPath(path);
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length < 2) {
    return null;
  }

  const slug = parts[1]?.toLowerCase() || '';
  const codeMatch = slug.match(/^([a-z]{2})-/i);
  if (codeMatch) {
    const codeMap: Record<string, string> = {
      ak: 'alaska',
      al: 'alabama',
      ar: 'arkansas',
      az: 'arizona',
      ca: 'california',
      co: 'colorado',
      ct: 'connecticut',
      de: 'delaware',
      fl: 'florida',
      ga: 'georgia',
      hi: 'hawaii',
      ia: 'iowa',
      id: 'idaho',
      il: 'illinois',
      in: 'indiana',
      ks: 'kansas',
      ky: 'kentucky',
      la: 'louisiana',
      ma: 'massachusetts',
      md: 'maryland',
      me: 'maine',
      mi: 'michigan',
      mn: 'minnesota',
      mo: 'missouri',
      ms: 'mississippi',
      mt: 'montana',
      nc: 'north-carolina',
      nd: 'north-dakota',
      ne: 'nebraska',
      nh: 'new-hampshire',
      nj: 'new-jersey',
      nm: 'new-mexico',
      nv: 'nevada',
      ny: 'new-york',
      oh: 'ohio',
      ok: 'oklahoma',
      or: 'oregon',
      pa: 'pennsylvania',
      ri: 'rhode-island',
      sc: 'south-carolina',
      sd: 'south-dakota',
      tn: 'tennessee',
      tx: 'texas',
      ut: 'utah',
      va: 'virginia',
      vt: 'vermont',
      wa: 'washington',
      wi: 'wisconsin',
      wv: 'west-virginia',
      wy: 'wyoming'
    };
    return codeMap[codeMatch[1].toLowerCase()] || null;
  }

  return ALL_STATES.find((state) => slug === state || slug.endsWith(`-${state}`)) || null;
}

export type ClaimEvidence = {
  text: string;
  type: 'eligibility' | 'payout' | 'timeline' | 'contact' | 'office' | 'legal' | 'medical' | 'financial';
  jurisdiction: string;
  sourceUrl?: string;
  reviewedDate?: string | null;
  confidence: number;
};

export function verifyClaimEvidence(claim: ClaimEvidence): { verified: boolean; error?: string } {
  const bannedRegex = /legally entitled|guaranteed|will qualify|\b2-1-1\b|\$2,000|\$1,100\+|typically 15 to 30 days/i;
  if (bannedRegex.test(claim.text)) {
    return { verified: false, error: 'claim_contains_high_risk_phrase' };
  }
  if (!claim.sourceUrl || !hasOfficialProgramSource(claim.sourceUrl)) {
    return { verified: false, error: 'claim_missing_verified_source' };
  }
  const threshold = claim.type === 'contact' || claim.type === 'office' ? 0.4 : 0.7;
  if (claim.confidence < threshold) {
    return { verified: false, error: 'claim_confidence_below_threshold' };
  }
  return { verified: true };
}

export function getSeoPolicyForRoute(
  routeType: RouteType,
  params: {
    stateId?: string;
    countyId?: string;
    diagnosisId?: string;
    programId?: string;
    category?: string;
    path?: string;
  },
  dbData?: Partial<SeoPolicyInput> & { programStateId?: string | null }
): SeoPolicyResult {
  const normalizedPath = normalizeManifestPath(params.path);
  const targetStateId = params.stateId || (routeType === 'static-page' ? deriveStateFromStaticPath(normalizedPath) || undefined : undefined);

  const input: SeoPolicyInput = {
    routeType,
    path: normalizedPath,
    stateId: targetStateId,
    countyId: params.countyId,
    diagnosisId: params.diagnosisId,
    programId: params.programId,
    entityCount: dbData?.entityCount,
    verifiedSourceCount: dbData?.verifiedSourceCount,
    officialSourceCount: dbData?.officialSourceCount,
    hasOfficialSource: dbData?.hasOfficialSource,
    hasRealLocalAssets: dbData?.hasRealLocalAssets,
    hasRequiredContactInfo: dbData?.hasRequiredContactInfo,
    hasApplicationSteps: dbData?.hasApplicationSteps,
    hasEligibilityRules: dbData?.hasEligibilityRules,
    hasVerifiedEligibilityRules: dbData?.hasVerifiedEligibilityRules,
    hasDocuments: dbData?.hasDocuments,
    hasUniqueLocalData: dbData?.hasUniqueLocalData,
    hasNoPlaceholderData: dbData?.hasNoPlaceholderData,
    lastVerifiedDate: dbData?.lastVerifiedDate,
    confidenceScore: dbData?.confidenceScore,
    verificationStatus: dbData?.verificationStatus
  };

  const result = evaluateSeoPolicy(input);
  const blockers = [...result.blockers];
  const reasons = [...result.reasons];

  if (isHardBlockedSitemapRoute(routeType)) {
    blockers.push(`${routeType} routes remain blocked until their verification framework is ready`);
  }

  if (routeType === 'static-page') {
    if (!isAllowlistedStaticPath(normalizedPath)) {
      blockers.push(`Static route '${normalizedPath}' is not on the publishing allowlist`);
    }

    if (isStaticGuidePath(normalizedPath)) {
      blockers.push('Static guide indexing remains blocked until guide metadata is loaded through a verification-safe adapter');
    }
  }

  const canonicalPath = canonicalForRoute(routeType, {
    state: targetStateId,
    county: params.countyId,
    diagnosis: params.diagnosisId,
    program: params.programId,
    category: params.category,
    path: normalizedPath
  }, dbData?.programStateId || null);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  const isIndexable = blockers.length === 0 && result.index;

  return {
    ...result,
    index: isIndexable,
    includeInSitemap: isIndexable,
    canonicalPath,
    canonicalUrl,
    schemaEligible: isIndexable && ['state-hub', 'county-hub', 'condition-hub', 'program-guide', 'county-condition', 'static-page'].includes(routeType),
    blockers: Array.from(new Set(blockers)),
    reasons: Array.from(new Set(reasons))
  };
}

export function mapShortDiagToDbId(shortId: string): string {
  switch (shortId.toLowerCase()) {
    case 'autism-spectrum-disorder':
      return 'autism-spectrum-disorder-asd';
    case 'adhd':
      return 'attention-deficit-hyperactivity-disorder-adhd';
    case 'down-syndrome':
      return 'down-syndrome-trisomy-21';
    case 'speech-or-language-delay':
    case 'speech-and-language-delay':
      return 'speech-and-language-delay';
    case 'cerebral-palsy':
      return 'cerebral-palsy-cp';
    case 'epilepsy':
      return 'epilepsy-seizure-disorder';
    default:
      return shortId.toLowerCase();
  }
}
