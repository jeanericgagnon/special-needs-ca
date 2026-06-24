import { NON_CA_VERIFIED_COUNTIES } from './verifiedCounties';

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

interface AuditState {
  stateId: string;
  classification: string;
  indexSafe: boolean;
}

interface AuditData {
  states: AuditState[];
}

interface PriorityQueueState {
  state: string;
  classification: string;
  index_safe: boolean;
  primary_gap_reason?: string | null;
}

let auditData: AuditData | null = null;
const priorityQueueData: PriorityQueueState[] = [];

if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    
    // Load grade audit JSON
    const auditPaths = [
      path.resolve(process.cwd(), 'data/generated/all_state_california_grade_audit_v3.json'),
      path.resolve(process.cwd(), '../data/generated/all_state_california_grade_audit_v3.json'),
    ];
    let auditPath = auditPaths[0];
    for (const p of auditPaths) {
      if (fs.existsSync(p)) {
        auditPath = p;
        break;
      }
    }
    if (fs.existsSync(auditPath)) {
      const fileContent = fs.readFileSync(auditPath, 'utf8');
      auditData = JSON.parse(fileContent);
    }
    
    // Load priority queue JSONL
    const pqPaths = [
      path.resolve(process.cwd(), 'data/generated/all_state_priority_queue_v3.jsonl'),
      path.resolve(process.cwd(), '../data/generated/all_state_priority_queue_v3.jsonl'),
    ];
    let pqPath = pqPaths[0];
    for (const p of pqPaths) {
      if (fs.existsSync(p)) {
        pqPath = p;
        break;
      }
    }
    if (fs.existsSync(pqPath)) {
      const lines = fs.readFileSync(pqPath, 'utf8').split('\n');
      for (const line of lines) {
        if (line.trim()) {
          priorityQueueData.push(JSON.parse(line));
        }
      }
    }
  } catch (err) {
    console.error('Failed to load SEO state audit data:', err);
  }
}

export function stateAuditStatus(stateId: string): { classification: string; indexSafe: boolean } | null {
  if (!stateId) return null;
  const normalized = stateId.toLowerCase().trim();
  
  if (!auditData || !Array.isArray(auditData.states) || priorityQueueData.length === 0) {
    return null;
  }
  
  const stateObj = auditData.states.find((s: AuditState) => s && s.stateId === normalized);
  const pqObj = priorityQueueData.find((s: PriorityQueueState) => s && s.state === normalized);
  
  if (!stateObj || !pqObj) return null;
  
  // Consistency check
  const isConsistent = (stateObj.classification === pqObj.classification) &&
                       (stateObj.indexSafe === pqObj.index_safe);
  if (!isConsistent) {
    console.error(`Audit data inconsistency for ${normalized}: JSON says classification=${stateObj.classification}, indexSafe=${stateObj.indexSafe}. PQ says classification=${pqObj.classification}, index_safe=${pqObj.index_safe}`);
    return null;
  }
  
  return {
    classification: stateObj.classification,
    indexSafe: stateObj.indexSafe
  };
}

export function stateGapReason(stateId: string): string | null {
  if (!stateId) return null;
  const normalized = stateId.toLowerCase().trim();
  const pqObj = priorityQueueData.find((s: PriorityQueueState) => s && s.state === normalized);
  return pqObj ? (pqObj.primary_gap_reason || null) : null;
}

export function canRender(stateId?: string): boolean {
  if (!stateId) return true;
  return stateAuditStatus(stateId) !== null;
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
  if (!auditData || !Array.isArray(auditData.states) || priorityQueueData.length === 0) {
    return [];
  }
  return auditData.states
    .filter((s: AuditState) => {
      const status = stateAuditStatus(s.stateId);
      return status !== null && status.classification === 'COMPLETE' && status.indexSafe === true;
    })
    .map((s: AuditState) => s.stateId);
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
 * Verifies if a given program URL is a valid first-party official source,
 * rejecting common fallbacks, mock URLs, and placeholders.
 */
export function hasOfficialProgramSource(url: string | null | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed === '' ||
    trimmed === 'null' ||
    trimmed === 'undefined' ||
    trimmed === 'https://www.dhcs.ca.gov' ||
    trimmed === 'https://dhcs.ca.gov' ||
    trimmed === 'https://www.ablefull.org' ||
    trimmed === 'https://ablefull.org' ||
    trimmed.includes('example.com') ||
    trimmed.startsWith('#')
  ) {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
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
  const isEligibleState = auditStatus !== null && auditStatus.classification === 'COMPLETE' && auditStatus.indexSafe === true;
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

  // Heuristic rules for non-California programs are gated out of SEO indexation rules
  const hasEligibilityRules = input.hasEligibilityRules && stateId === 'california';

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
    path: input.routeType === 'static-page' ? input.stateId : undefined
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
