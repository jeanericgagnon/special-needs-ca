declare const window: any;
import { NON_CA_VERIFIED_COUNTIES } from './verifiedCounties';
import { SEO_CLUSTERS } from './seo-data';

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
};

export type SeoPolicyResult = {
  index: boolean;
  follow: boolean;
  includeInSitemap: boolean;
  canonicalPath: string;
  canonicalUrl: string;
  schemaEligible: boolean;
  verificationState: 'official-verified' | 'human-reviewed' | 'crawler-verified' | 'unverified';
  blockers: string[];
  reasons: string[];
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

export function shouldIncludeInSitemap(result: SeoPolicyResult | { index: boolean, includeInSitemap: boolean }): boolean {
  return result.index && result.includeInSitemap;
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
    /dummy/i,
    /Call your local office/i,
    /Gather medical proof/i,
    /Dial 2-1-1/i,
    /proof-of-residency lists/i,
    /application checklists/i,
    /inferred eligibility/i,
    /Not yet verified/i,
    /verification-pending/i,
    /Locate your local county office/i,
    /Pediatric medical certification/i,
    /Proof of residency/i,
    /\b2-1-1\b/
  ];
  return !placeholderPatterns.some(pattern => pattern.test(text));
}

let dbHosts: Set<string> | null = null;

function getDbHosts(): Set<string> {
  if (dbHosts) return dbHosts;
  dbHosts = new Set();
  if (typeof window === 'undefined') {
    try {
      // Dynamic imports/requires to prevent client-side build errors
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const Database = require('better-sqlite3');
      
      const dbPaths = [
        path.resolve(process.cwd(), 'ca_disability_navigator.db'),
        path.resolve(process.cwd(), 'frontend/ca_disability_navigator.db'),
        path.resolve(process.cwd(), '../frontend/ca_disability_navigator.db'),
      ];
      let dbPath = '';
      for (const p of dbPaths) {
        if (fs.existsSync(p)) {
          dbPath = p;
          break;
        }
      }
      if (dbPath) {
        const db = new Database(dbPath, { readonly: true });
        const queryTables = ['programs', 'regional_centers', 'school_districts', 'county_offices', 'nonprofit_organizations', 'iep_advocates', 'sources', 'legal_decisions', 'selpas', 'resource_providers'];
        for (const tbl of queryTables) {
          try {
            const col = tbl === 'legal_decisions' ? 'document_url' : 'source_url';
            const rows = db.prepare(`SELECT ${col} FROM ${tbl} WHERE ${col} IS NOT NULL`).all();
            rows.forEach((r: any) => {
              const urlVal = r[col];
              if (urlVal) {
                try {
                  const p = new URL(urlVal);
                  dbHosts!.add(p.hostname.toLowerCase());
                } catch {}
              }
            });
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Failed to preload authoritative hosts from SQLite:', e);
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
    trimmed = 'https://' + trimmed.slice(7);
  }
  
  const trimmedLower = trimmed.toLowerCase();
  if (
    trimmedLower === '' ||
    trimmedLower === 'null' ||
    trimmedLower === 'undefined' ||
    trimmedLower === 'https://www.dhcs.ca.gov' ||
    trimmedLower === 'https://dhcs.ca.gov' ||
    trimmedLower === 'https://www.ablefull.org' ||
    trimmedLower === 'https://ablefull.org' ||
    trimmedLower.includes('example.com') ||
    trimmedLower.includes('state.gov') ||
    trimmedLower.startsWith('#')
  ) {
    return false;
  }

  if (!trimmed.startsWith('https://')) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.toLowerCase();

    // 1. Suffix/TLD check
    if (
      hostname.endsWith('.gov') ||
      hostname.endsWith('.gov.us') ||
      /\.state\.[a-z]{2}\.us$/.test(hostname) ||
      hostname.endsWith('.edu') ||
      /\.k12\.[a-z]{2}\.us$/.test(hostname)
    ) {
      return true;
    }

    // 2. Preloaded database registry check
    const hosts = getDbHosts();
    if (hosts.has(hostname) || hosts.has('www.' + hostname)) {
      return true;
    }
    
    // Check subdomains
    for (const host of hosts) {
      if (hostname.endsWith('.' + host)) {
        return true;
      }
    }

    // 3. Fallback static registry for clients/build time
    const authoritativeRegistry = new Set([
      'myflorida.com',
      'myflfamilies.com',
      'isbe.net',
      'gadoe.org',
      'k12.wa.us',
      'ode.state.or.us',
      'wvde.us',
      'altaregional.org', 'sdrc.org', 'elarc.org', 'sgprc.org', 'sclarc.org',
      'wrc.org', 'fnrc.org', 'nbrc.org', 'rceb.org', 'rcoc.org', 'smprc.org',
      'cvrc.org', 'vfrc.org', 'kmrc.org', 'tcrclist.org', 'tri-counties.org',
      'vmrc.net', 'ggrc.org', 'rcdavis.org', 'sarc.org', 'hrc.org',
      'lausd.net', 'iusd.org', 'ousd.org', 'sjusd.org', 'sandiegounified.org',
      'sausd.us', 'scusd.edu', 'sfusd.edu',
      'justia.com', 'law.justia.com',
      'coveredca.com',
      'odr-pa.org',
      'disabilityrightsca.org',
      'stepupforstudents.org',
      'ableunited.com',
      'texasable.org',
      'floridakidcare.org',
      'floridaearlysteps.com',
      'rehabworks.org',
      'fldoe.org'
    ]);

    for (const domain of authoritativeRegistry) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
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
 * Core SEO Quality Gate Evaluator.
 */
export function evaluateSeoPolicy(input: SeoPolicyInput): { index: boolean; qualityScore: number; reasons: string[]; blockers: string[] } {
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

  // Gated based on verified eligibility rules parameter
  let hasEligibilityRules = input.hasEligibilityRules && input.hasVerifiedEligibilityRules;

  if (hasEligibilityRules) {
    qualityScore += 10;
    reasons.push('Contains statutory eligibility rules (+10)');
  } else {
    if (input.routeType === 'program-guide') {
      blockers.push('Program guide is missing verified eligibility rules');
    }
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

  // Gated based on unique local data/assets
  if (input.routeType === 'county-hub' || input.routeType === 'county-condition') {
    if (!input.hasRealLocalAssets) {
      blockers.push('Missing local asset integrations (Regional Centers, School Districts, or County Offices)');
    }
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
    case 'static-page': {
      let pageStateId = 'california';
      const pathStr = input.path || '';
      const slugMatch = pathStr.match(/\/(?:forms|deadlines|situations|programs)\/([a-zA-Z0-9_-]+)/);
      if (slugMatch) {
        const slug = slugMatch[1].toLowerCase();
        if (slug.startsWith('ny-')) pageStateId = 'new-york';
        else if (slug.startsWith('pa-')) pageStateId = 'pennsylvania';
        else if (slug.startsWith('il-')) pageStateId = 'illinois';
        else if (slug.startsWith('ga-')) pageStateId = 'georgia';
        else if (slug.startsWith('oh-')) pageStateId = 'ohio';
        else if (slug.startsWith('tx-')) pageStateId = 'texas';
        else if (slug.startsWith('fl-')) pageStateId = 'florida';
      }
      
      const pageAuditStatus = stateAuditStatus(pageStateId);
      const isPageStateEligible = pageAuditStatus !== null && pageAuditStatus.classification === 'COMPLETE' && pageAuditStatus.indexSafe === true;
      if (!isPageStateEligible) {
        blockers.push(`State '${pageStateId}' for static page is not index-safe`);
      }
      
      const allowedPaths = [
        '/',
        '/benefits',
        '/advocates',
        '/forms',
        '/school-districts',
        '/find-help'
      ];
      const isStandardPath = allowedPaths.includes(pathStr) || pathStr === '';
      
      if (!isStandardPath) {
        if (slugMatch) {
          const slug = slugMatch[1].toLowerCase();

          // Fetch cluster and evaluate evidence-based gating
          const cluster = SEO_CLUSTERS[slug];
          if (!cluster) {
            blockers.push(`Static guide data for '${slug}' was not found`);
          } else {
            // Check official sources
            const sources = cluster.officialSources || [];
            const officialUrl = sources.find(s => s.url && hasOfficialProgramSource(s.url))?.url;
            if (!officialUrl) {
              blockers.push(`Static guide '${slug}' is missing a verified official source URL`);
            }

            // Check review date
            if (!cluster.lastReviewedDate) {
              blockers.push(`Static guide '${slug}' is missing a verified review date`);
            }

            // Check claims
            const textToVerify = [
              cluster.title,
              cluster.metaTitle,
              cluster.metaDescription,
              cluster.quickAnswer,
              ...(cluster.tldrPoints || []).map(p => `${p.label}: ${p.value}`),
            ];

            for (const text of textToVerify) {
              const claimResult = verifyClaimEvidence({
                text,
                type: 'eligibility',
                jurisdiction: pageStateId,
                sourceUrl: officialUrl,
                reviewedDate: cluster.lastReviewedDate,
                confidence: 0.95
              });
              if (!claimResult.verified) {
                blockers.push(`Static guide '${slug}' contains unverified claims: ${claimResult.error}`);
              }
            }
          }
        } else {
          blockers.push(`Static page '${pathStr}' is not allowlisted`);
        }
      }
      break;
    }

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
      if (!input.hasRequiredContactInfo && stateId === 'california') {
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

  const shouldIndex = blockers.length === 0 && (input.routeType === 'static-page' || qualityScore >= 50);

  return {
    index: shouldIndex,
    qualityScore,
    reasons,
    blockers
  };
}

/**
 * Normalized shared SEO helper. Enforces one authoritative control plane decision.
 */
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
  dbData?: Partial<SeoPolicyInput> & {
    programStateId?: string | null;
    verificationStatus?: string | null;
  }
): SeoPolicyResult {
  const stateId = params.stateId?.toLowerCase() || '';
  const path = params.path || '';

  const blockers: string[] = [];
  const reasons: string[] = [];

  // Check unknown routes
  const knownRoutes: RouteType[] = [
    'state-hub', 'county-hub', 'state-counties-hub', 'condition-hub',
    'program-guide', 'category-hub', 'comparison', 'county-condition',
    'school-district', 'city', 'static-page'
  ];
  if (!knownRoutes.includes(routeType)) {
    blockers.push('Unknown or unsupported route type');
  }

  // Derive stateId for static pages if possible
  let derivedStateId = '';
  if (routeType === 'static-page' && path) {
    const normalizedPath = path.startsWith('/') ? path : '/' + path;
    const parts = normalizedPath.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const category = parts[0];
      const slug = parts[1];
      if (['forms', 'situations', 'deadlines'].includes(category)) {
        const match = slug.match(/^([a-z]{2})-(.+)$/i);
        if (match) {
          const code = match[1].toUpperCase();
          const codeMap: Record<string, string> = {
            AL: 'alabama', AK: 'alaska', AZ: 'arizona', AR: 'arkansas', CA: 'california',
            CO: 'colorado', CT: 'connecticut', DE: 'delaware', FL: 'florida', GA: 'georgia',
            HI: 'hawaii', ID: 'idaho', IL: 'illinois', IN: 'indiana', IA: 'iowa',
            KS: 'kansas', KY: 'kentucky', LA: 'louisiana', ME: 'maine', MD: 'maryland',
            MA: 'massachusetts', MI: 'michigan', MN: 'minnesota', MS: 'mississippi', MO: 'missouri',
            MT: 'montana', NE: 'nebraska', NV: 'nevada', NH: 'new-hampshire', NJ: 'new-jersey',
            NM: 'new-mexico', NY: 'new-york', NC: 'north-carolina', ND: 'north-dakota', OH: 'ohio',
            OK: 'oklahoma', OR: 'oregon', PA: 'pennsylvania', RI: 'rhode-island', SC: 'south-carolina',
            SD: 'south-dakota', TN: 'tennessee', TX: 'texas', UT: 'utah', VT: 'vermont',
            VA: 'virginia', WA: 'washington', WV: 'west-virginia', WI: 'wisconsin', WY: 'wyoming'
          };
          if (codeMap[code]) {
            derivedStateId = codeMap[code];
          }
        }
        if (!derivedStateId) {
          const stateNames = [
            'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
            'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
            'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan',
            'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new-hampshire',
            'new-jersey', 'new-mexico', 'new-york', 'north-carolina', 'north-dakota', 'ohio', 'oklahoma',
            'oregon', 'pennsylvania', 'rhode-island', 'south-carolina', 'south-dakota', 'tennessee',
            'texas', 'utah', 'vermont', 'virginia', 'washington', 'west-virginia', 'wisconsin', 'wyoming'
          ];
          for (const st of stateNames) {
            if (slug.endsWith(`-${st}`) || slug === st) {
              derivedStateId = st;
              break;
            }
          }
        }
      }
    }
  }

  // Check static page allowlist
  if (routeType === 'static-page') {
    const normalizedPath = path.startsWith('/') ? path : '/' + path;
    const STATIC_ROUTES_ALLOWLIST = ['/', '/benefits', '/advocates', '/forms', '/school-districts', '/find-help'];
    const isAllowedSubRoute =
      normalizedPath.startsWith('/forms/') ||
      normalizedPath.startsWith('/situations/') ||
      normalizedPath.startsWith('/deadlines/');
    if (!STATIC_ROUTES_ALLOWLIST.includes(normalizedPath) && !isAllowedSubRoute) {
      blockers.push(`Static route '${normalizedPath}' is not in the explicit publishing allowlist`);
    }
  }

  // Check unknown states & audit consistency
  let auditStatus = null;
  const targetStateId = derivedStateId || stateId;
  if (targetStateId) {
    auditStatus = stateAuditStatus(targetStateId);
    if (!auditStatus) {
      blockers.push(`Missing or malformed audit data for state '${targetStateId}'`);
    } else if (auditStatus.classification !== 'COMPLETE' || !auditStatus.indexSafe) {
      blockers.push(`State '${targetStateId}' is not index-safe (classification: ${auditStatus.classification}, indexSafe: ${auditStatus.indexSafe})`);
    }
  }

  // Build full input object
  const input: SeoPolicyInput = {
    routeType,
    path: path || params.path || undefined,
    stateId: targetStateId || undefined,
    countyId: params.countyId || undefined,
    diagnosisId: params.diagnosisId || undefined,
    programId: params.programId || undefined,
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
    hasNoPlaceholderData: dbData?.hasNoPlaceholderData !== false,
    lastVerifiedDate: dbData?.lastVerifiedDate,
    confidenceScore: dbData?.confidenceScore,
  };

  const baseResult = evaluateSeoPolicy(input);

  // Merge blockers and reasons
  blockers.push(...baseResult.blockers);
  reasons.push(...baseResult.reasons);

  // Determine canonical
  const programStateId = dbData?.programStateId;
  const canonicalPath = canonicalForRoute(routeType, {
    state: stateId || undefined,
    county: params.countyId || undefined,
    diagnosis: params.diagnosisId || undefined,
    program: params.programId || undefined,
    category: params.category || undefined,
    path: path || undefined
  }, programStateId);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  // Indexable check
  const isIndexable = blockers.length === 0 && baseResult.index;

  // Schema eligibility (neutral site-level schema on blocked/noindex is allowed in parent components, but substantive goes here)
  const schemaEligible = isIndexable && (
    routeType === 'state-hub' || 
    routeType === 'county-hub' || 
    routeType === 'condition-hub' || 
    routeType === 'program-guide' || 
    routeType === 'county-condition'
  );

  // Verification state mapping
  let verificationState: 'official-verified' | 'human-reviewed' | 'crawler-verified' | 'unverified' = 'unverified';
  const status = dbData?.verificationStatus || '';
  if (status === 'official_verified') {
    verificationState = 'official-verified';
  } else if (status === 'human_verified' || status === 'verified') {
    verificationState = 'human-reviewed';
  } else if (status === 'crawler_verified' || status === 'source_listed') {
    verificationState = 'crawler-verified';
  }

  return {
    index: isIndexable,
    follow: true,
    includeInSitemap: isIndexable,
    canonicalPath,
    canonicalUrl,
    schemaEligible,
    verificationState,
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




export function getAuditStats(): { complete: number; blocked: number } {
  if (priorityQueueData.length === 0) {
    return { complete: 24, blocked: 26 };
  }
  let complete = 0;
  let blocked = 0;
  for (const s of priorityQueueData) {
    if (s.classification === 'COMPLETE') {
      complete++;
    } else if (s.classification === 'BLOCKED') {
      blocked++;
    }
  }
  return { complete, blocked };
}

export interface ClaimEvidence {
  text: string;
  type: 'eligibility' | 'payout' | 'timeline' | 'contact' | 'office' | 'legal' | 'medical' | 'financial';
  jurisdiction: string;
  sourceUrl?: string;
  reviewedDate?: string;
  confidence: number;
}

export function verifyClaimEvidence(claim: ClaimEvidence): { verified: boolean; error?: string } {
  const bannedRegex = /legally entitled|guaranteed|will qualify|\b2-1-1\b|\$2,000–\$5,200\/mo|\$1,100\+\/mo|\$3,200–\$5,800\/mo|typically 15 to 30 days/i;
  if (bannedRegex.test(claim.text)) {
    return { verified: false, error: `Claim contains high-risk/banned phrase: "${claim.text}"` };
  }

  if (!claim.sourceUrl || !hasOfficialProgramSource(claim.sourceUrl)) {
    return { verified: false, error: `Claim lacks a verified official source URL: "${claim.sourceUrl ?? 'undefined'}"` };
  }

  const threshold = (claim.type === 'contact' || claim.type === 'office') ? 0.4 : 0.7;

  if (claim.confidence < threshold) {
    return { verified: false, error: `Claim confidence score (${claim.confidence}) is below ${threshold * 100}% threshold` };
  }

  return { verified: true };
}
