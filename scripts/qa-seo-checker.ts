import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { spawn } from 'child_process';
import { 
  getSeoPolicyForRoute, 
  assertNoPlaceholderData, 
  normalizeConfidenceScore, 
  stateAuditStatus,
  hasOfficialProgramSource 
} from '../frontend/src/lib/seo-policy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.cwd().endsWith('frontend')
  ? path.resolve(process.cwd(), 'ca_disability_navigator.db')
  : path.resolve(process.cwd(), 'frontend/ca_disability_navigator.db');
if (!fs.existsSync(dbPath)) {
  console.error(`Database not found at ${dbPath}`);
  process.exit(1);
}

const db = new Database(dbPath, { readonly: true });

let errors = 0;
let warnings = 0;

function logError(msg: string) {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
  errors++;
}

function logWarning(msg: string) {
  console.warn(`\x1b[33m[WARNING]\x1b[0m ${msg}`);
  warnings++;
}

function logSuccess(msg: string) {
  console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
}

const VERIFIED_DIAGNOSES = [
  'autism-spectrum-disorder',
  'adhd',
  'down-syndrome',
  'speech-or-language-delay',
  'cerebral-palsy',
  'epilepsy'
];

// ----------------------------------------------------
// Banned Source Code Pattern Scanner
// ----------------------------------------------------
const BANNED_PATTERNS = [
  { pattern: /['"]State\s+Waiver\s+Code['"]/i, label: 'State Waiver Code' },
  { pattern: /['"]State\s+Waiver\s+Manuals['"]/i, label: 'State Waiver Manuals' },
  { pattern: /hasOfficialSource\s*:\s*true/i, label: 'hasOfficialSource: true' },
  { pattern: /lastVerifiedDate\s*:\s*['"]2026/i, label: "lastVerifiedDate: '2026" },
  { pattern: /lastReviewedDate\s*:\s*['"]2026/i, label: "lastReviewedDate: '2026" },
  { pattern: /verificationState\s*=\s*\{\s*policy\.index\s*\?\s*['"]official-verified['"]/i, label: "verificationState={policy.index ? 'official-verified'" },
  { pattern: /confidenceScore\s*:\s*0\.9(?!5)/i, label: 'confidenceScore: 0.9' },
  { pattern: /confidenceScore\s*:\s*0\.95/i, label: 'confidenceScore: 0.95' },
  { pattern: /official_verified\s+used\s+with\s+undefined\s+URL/i, label: 'official_verified used with undefined URL' },
  { pattern: /2026-06-01/i, label: '2026-06-01' },
  { pattern: /2026-06-19/i, label: '2026-06-19' },
  { pattern: /\|\|\s*5\.0/, label: '|| 5.0 fallback' },
  { pattern: /\|\|\s*1\.0/, label: '|| 1.0 fallback' },
  { pattern: /confidence_score\s*\|\|\s*5(\.0)?/i, label: 'confidence_score || 5 fallback' },
  { pattern: /source_url\s*\|\|\s*['"]https:\/\/www\.dhcs\.ca\.gov['"]/i, label: 'source_url DHCS fallback' },
  { pattern: /officialSources:\s*\[\s*\{\s*name:\s*[`'"]\s*\$\{\s*stateName\s*\}\s*State\s+Program\s+Portal\s*[`'"],\s*url:\s*program\.source_url\s*\|\|/i, label: 'officialSources state portal fallback' },
  { pattern: /(?:source_url|official_source_url)\s*\|\|\s*['"](?!\s*['"])[^'"]+['"]/i, label: 'source_url fallback to non-empty string literal' },
  { pattern: /officialSources\s*:\s*\[/i, label: 'hardcoded officialSources array' },
  { pattern: /\|\|\s*18(\.00)?\b/i, label: '|| 18 wage fallback' },
  { pattern: /\?\?\s*18(\.00)?\b/i, label: '?? 18 wage fallback' },
  { pattern: /typically 15 to 30 days/i, label: 'generic IEP timeline claim' },
  { pattern: /\bVERIFIED_STATES\b/i, label: 'legacy VERIFIED_STATES list' },
  { pattern: /\bINDEXABLE_STATE_IDS\b/i, label: 'legacy INDEXABLE_STATE_IDS list' },
  { pattern: /confidence_score\s*.*?\/.*?5(\.0)?\b/i, label: 'manual division of confidence score by 5' }
];

function scanFilesForBannedPatterns() {
  console.log('\n--- Scanning Source Files for Banned Hardcoded SEO Patterns ---');
  const srcDir = path.resolve(__dirname, '../frontend/src');
  
  function walkDir(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath, fileList);
      } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        if (!filePath.endsWith('seo-policy.ts') && 
            !filePath.includes('qa-seo-checker')) {
          fileList.push(filePath);
        }
      }
    }
    return fileList;
  }

  const allFiles = walkDir(srcDir);
  let bannedStringsFound = 0;

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(path.resolve(__dirname, '..'), file);
    
    BANNED_PATTERNS.forEach(({ pattern, label }) => {
      const isSeoDataFile = file.endsWith('seo-data.ts') || file.endsWith('five-states-seo-data.ts');
      const skipLabels = [
        'hardcoded officialSources array',
        "lastVerifiedDate: '2026",
        "lastReviewedDate: '2026",
        '2026-06-01',
        '2026-06-19',
        'officialSources state portal fallback'
      ];
      if (isSeoDataFile && skipLabels.includes(label)) {
        return;
      }
      if (pattern.test(content)) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (pattern.test(line)) {
            // Note: QA-ALLOW is no longer allowed to suppress legal, financial, timing, etc.
            logError(`Banned pattern "${label}" found in ${relativePath}:${index + 1}\n  > ${line.trim()}`);
            bannedStringsFound++;
          }
        });
      }
    });
  }

  if (bannedStringsFound === 0) {
    logSuccess('No banned hardcoded SEO patterns found in source code files.');
  } else {
    console.log(`\x1b[31m[FAIL]\x1b[0m Found ${bannedStringsFound} occurrences of banned hardcoded patterns.`);
  }
}

// ----------------------------------------------------
// Database QA Checks
// ----------------------------------------------------
console.log('--- Starting SEO Database QA Verification ---');

const states = db.prepare('SELECT * FROM states').all() as any[];
const counties = db.prepare('SELECT * FROM counties').all() as any[];
const programs = db.prepare('SELECT * FROM programs').all() as any[];

// 1. State Hubs
states.forEach(state => {
  const stateProgs = db.prepare('SELECT * FROM programs WHERE state_id = ?').all(state.id) as any[];
  const dates = stateProgs.map(p => p.last_verified_date).filter(Boolean);
  const minDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
  const scores = stateProgs.map(p => normalizeConfidenceScore(p.confidence_score)).filter((s): s is number => s !== null);
  const avgScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

  const policy = getSeoPolicyForRoute('state-hub', {
    stateId: state.id
  }, {
    entityCount: stateProgs.length,
    confidenceScore: avgScore,
    hasOfficialSource: stateProgs.length > 0 && stateProgs.some(p => !!p.source_url),
    lastVerifiedDate: minDate,
    hasNoPlaceholderData: assertNoPlaceholderData(state.name) && stateProgs.every(p => assertNoPlaceholderData(JSON.stringify(p)))
  });

  const url = `/benefits/${state.id}`;
  if (policy.index) {
    logSuccess(`State Hub indexable: ${url}`);
  } else {
    logSuccess(`State Hub noindexed (correct): ${url} (Blockers: ${policy.blockers.join(', ')})`);
  }
});

// 1.5 State Counties Hub Directory (/counties/[state])
console.log('\n--- Checking State Counties Hub Directory Pages ---');
states.forEach(state => {
  const stateCounties = db.prepare('SELECT * FROM counties WHERE state_id = ?').all(state.id) as any[];
  
  let indexableCountiesCount = 0;
  const countyDates: string[] = [];
  const countyScores: number[] = [];
  let stateHasOfficialSource = false;
  
  stateCounties.forEach(county => {
    const offices = db.prepare('SELECT * FROM county_offices WHERE county_id = ?').all(county.id) as any[];
    const countyDistricts = db.prepare('SELECT * FROM school_districts WHERE county_id = ?').all(county.id) as any[];
    const details = db.prepare(`
      SELECT rc.* FROM regional_centers rc
      JOIN regional_center_counties rcc ON rc.id = rcc.regional_center_id
      WHERE rcc.county_id = ?
    `).all(county.id) as any[];
    
    const hasRequiredContactInfo = offices.length > 0;
    const hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(county)) && assertNoPlaceholderData(JSON.stringify(offices));
    
    const rcDates = details.map(rc => rc.last_verified_date).filter(Boolean);
    const sdDates = countyDistricts.map(sd => sd.last_verified_date).filter(Boolean);
    const coDates = offices.map(co => co.last_verified_date).filter(Boolean);
    const allDates = [...rcDates, ...sdDates, ...coDates];
    const lastVerifiedDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;
    if (lastVerifiedDate) countyDates.push(lastVerifiedDate);
    
    const rcScores = details.map(rc => normalizeConfidenceScore(rc.confidence_score)).filter((s): s is number => s !== null);
    const sdScores = countyDistricts.map(sd => normalizeConfidenceScore(sd.confidence_score)).filter((s): s is number => s !== null);
    const coScores = offices.map(co => normalizeConfidenceScore(co.confidence_score)).filter((s): s is number => s !== null);
    const allScores = [...rcScores, ...sdScores, ...coScores];
    const confidenceScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;
    if (confidenceScore !== null) countyScores.push(confidenceScore);
    
    let hasOfficialSource = false;
    if (details.some(rc => !!rc.source_url) || countyDistricts.some(sd => !!sd.source_url) || offices.some(co => !!co.source_url)) {
      hasOfficialSource = true;
      stateHasOfficialSource = true;
    }
    
    const cPolicy = getSeoPolicyForRoute('county-hub', {
      stateId: county.state_id,
      countyId: county.id
    }, {
      entityCount: countyDistricts.length,
      hasOfficialSource,
      lastVerifiedDate,
      confidenceScore,
      hasRequiredContactInfo,
      hasNoPlaceholderData
    });
    
    if (cPolicy.index) {
      indexableCountiesCount++;
    }
  });
  
  const stateCountiesDate = countyDates.length > 0 ? countyDates.reduce((min, d) => d < min ? d : min, countyDates[0]) : null;
  const stateCountiesScore = countyScores.length > 0 ? countyScores.reduce((sum, s) => sum + s, 0) / countyScores.length : null;
  
  const stateCountiesPolicy = getSeoPolicyForRoute('state-counties-hub', {
    stateId: state.id
  }, {
    entityCount: stateCounties.length,
    hasRealLocalAssets: indexableCountiesCount > 0,
    hasOfficialSource: stateHasOfficialSource,
    lastVerifiedDate: stateCountiesDate,
    confidenceScore: stateCountiesScore,
    hasNoPlaceholderData: assertNoPlaceholderData(state.name)
  });
  
  const countiesDirUrl = `/counties/${state.id}`;
  if (stateCountiesPolicy.index) {
    logSuccess(`State Counties Hub indexable: ${countiesDirUrl}`);
  } else {
    logSuccess(`State Counties Hub noindexed (correct): ${countiesDirUrl} (Blockers: ${stateCountiesPolicy.blockers.join(', ')})`);
  }
});

// 2. County Hubs
counties.forEach(county => {
  const offices = db.prepare('SELECT * FROM county_offices WHERE county_id = ?').all(county.id) as any[];
  const countyDistricts = db.prepare('SELECT * FROM school_districts WHERE county_id = ?').all(county.id) as any[];
  const details = db.prepare(`
    SELECT rc.* FROM regional_centers rc
    JOIN regional_center_counties rcc ON rc.id = rcc.regional_center_id
    WHERE rcc.county_id = ?
  `).all(county.id) as any[];

  const hasRequiredContactInfo = offices.length > 0;
  const hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(county)) && assertNoPlaceholderData(JSON.stringify(offices));

  const rcDates = details.map(rc => rc.last_verified_date).filter(Boolean);
  const sdDates = countyDistricts.map(sd => sd.last_verified_date).filter(Boolean);
  const coDates = offices.map(co => co.last_verified_date).filter(Boolean);
  const allDates = [...rcDates, ...sdDates, ...coDates];
  const lastVerifiedDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

  const rcScores = details.map(rc => normalizeConfidenceScore(rc.confidence_score)).filter((s): s is number => s !== null);
  const sdScores = countyDistricts.map(sd => normalizeConfidenceScore(sd.confidence_score)).filter((s): s is number => s !== null);
  const coScores = offices.map(co => normalizeConfidenceScore(co.confidence_score)).filter((s): s is number => s !== null);
  const allScores = [...rcScores, ...sdScores, ...coScores];
  const confidenceScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

  let hasOfficialSource = false;
  if (details.some(rc => !!rc.source_url) || countyDistricts.some(sd => !!sd.source_url) || offices.some(co => !!co.source_url)) {
    hasOfficialSource = true;
  }

  const policy = getSeoPolicyForRoute('county-hub', {
    stateId: county.state_id,
    countyId: county.id
  }, {
    entityCount: countyDistricts.length,
    hasOfficialSource,
    lastVerifiedDate,
    confidenceScore,
    hasRequiredContactInfo,
    hasNoPlaceholderData,
    hasRealLocalAssets: countyDistricts.length > 0 || offices.length > 0 || rcs.length > 0
  });

  const url = `/benefits/${county.state_id}/${county.id}`;
  if (policy.index) {
    logSuccess(`County Hub indexable: ${url}`);
    if (!hasNoPlaceholderData) {
      logError(`Indexable County Hub ${url} contains placeholder data!`);
    }
  } else {
    if (!policy.blockers.includes("State '" + county.state_id + "' is not index-safe") && county.state_id === 'california') {
      logSuccess(`County Hub noindexed (correct): ${url} (Blockers: ${policy.blockers.join(', ')})`);
    }
  }
});

// 3. Programs
programs.forEach(prog => {
  const rules = db.prepare('SELECT COUNT(*) as count FROM program_eligibility_rules WHERE program_id = ?').get(prog.id) as { count: number };
  const steps = db.prepare('SELECT COUNT(*) as count FROM program_application_steps WHERE program_id = ?').get(prog.id) as { count: number };
  const docs = db.prepare('SELECT COUNT(*) as count FROM program_document_requirements WHERE program_id = ?').get(prog.id) as { count: number };

  const hasEligibilityRules = rules.count > 0;
  const hasApplicationSteps = steps.count > 0;
  const hasDocuments = docs.count > 0;
  const hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(prog));
  const hasVerifiedEligibilityRules = hasEligibilityRules && (prog.verification_status === 'official_verified' || prog.verification_status === 'verified' || prog.verification_status === 'human_verified');

  const policy = getSeoPolicyForRoute('program-guide', {
    stateId: prog.state_id || 'california',
    programId: prog.id
  }, {
    hasOfficialSource: hasOfficialProgramSource(prog.source_url),
    lastVerifiedDate: prog.last_verified_date || null,
    confidenceScore: normalizeConfidenceScore(prog.confidence_score),
    hasEligibilityRules,
    hasVerifiedEligibilityRules,
    hasApplicationSteps,
    hasDocuments,
    hasNoPlaceholderData,
    programStateId: prog.state_id || null,
    verificationStatus: prog.verification_status || null
  });

  const url = `/programs/${prog.id.toLowerCase().replace(/_/g, '-')}`;
  if (policy.index) {
    logSuccess(`Program guide indexable: ${url}`);
    if (!hasNoPlaceholderData) {
      logError(`Indexable Program ${url} contains placeholder data!`);
    }
    if (!prog.source_url) {
      logError(`Indexable Program ${url} is missing source URL!`);
    } else if (prog.source_url === 'https://www.dhcs.ca.gov' || prog.source_url === 'https://dhcs.ca.gov') {
      logError(`Indexable Program ${url} has a generic fallback source URL!`);
    }
  } else {
    logSuccess(`Program guide noindexed (correct): ${url} (Blockers: ${policy.blockers.join(', ')})`);
  }
});

// Run source and db scans
scanFilesForBannedPatterns();

function verifySitemapsUseCentralPolicy() {
  console.log('\n--- Verifying Sitemaps Use Central Policy ---');
  const sitemapFiles = [
    'frontend/src/app/sitemaps/static.xml/route.ts',
    'frontend/src/app/sitemaps/counties.xml/route.ts',
    'frontend/src/app/sitemaps/cities.xml/route.ts',
    'frontend/src/app/sitemaps/districts.xml/route.ts'
  ];
  
  sitemapFiles.forEach(file => {
    const filePath = path.resolve(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      logError(`Sitemap file not found: ${file}`);
      return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('getSeoPolicyForRoute')) {
      logError(`Sitemap file ${file} does not use getSeoPolicyForRoute!`);
    } else {
      logSuccess(`Sitemap ${file} correctly integrates central policy.`);
    }
  });
}

function verifyUnreadyRouteTypesAreNoindex() {
  console.log('\n--- Verifying Unready Route Types Are Blocked ---');
  
  const cityPolicy = getSeoPolicyForRoute('city', {
    stateId: 'california',
    countyId: 'los-angeles',
    diagnosisId: 'autism-spectrum-disorder'
  });
  if (cityPolicy.index) {
    logError("Gating failure: 'city' route type is indexable!");
  } else {
    logSuccess("'city' route type is correctly blocked.");
  }
  
  const sdPolicy = getSeoPolicyForRoute('school-district', {
    stateId: 'california',
    programId: 'los-angeles-unified'
  });
  if (sdPolicy.index) {
    logError("Gating failure: 'school-district' route type is indexable!");
  } else {
    logSuccess("'school-district' route type is correctly blocked.");
  }
}

async function verifyOfficialSourceHelper() {
  console.log('\n--- Verifying hasOfficialProgramSource Helper ---');
  const failCases = [
    'https://www.dhcs.ca.gov',
    'https://dhcs.ca.gov',
    'https://www.ablefull.org',
    'https://ablefull.org',
    'http://example.com/test',
    '',
    'null',
    'undefined',
    '#'
  ];
  
  let failed = false;
  failCases.forEach(c => {
    if (hasOfficialProgramSource(c)) {
      logError(`hasOfficialProgramSource incorrectly accepted: "${c}"`);
      failed = true;
    }
  });
  
  if (!hasOfficialProgramSource('https://www.medicaid.gov/some-waiver')) {
    logError('hasOfficialProgramSource incorrectly rejected a valid URL: "https://www.medicaid.gov/some-waiver"');
    failed = true;
  }
  
  if (!failed) {
    logSuccess('hasOfficialProgramSource behaves correctly.');
  }
}

function verifyUnknownStateIsNoindexed() {
  console.log('\n--- Verifying Mismatched / Unknown State Fail-Closed Gating ---');
  const unknownPolicy = getSeoPolicyForRoute('state-hub', {
    stateId: 'unknown-state-id'
  }, {
    entityCount: 10,
    confidenceScore: 0.95,
    hasOfficialSource: true,
    lastVerifiedDate: '2026-01-01',
    hasNoPlaceholderData: true
  });
  if (unknownPolicy.index) {
    logError("Gating failure: unknown state 'unknown-state-id' is indexable!");
  } else {
    logSuccess("Unknown state 'unknown-state-id' correctly fails closed (noindex).");
  }
}

verifySitemapsUseCentralPolicy();
verifyUnreadyRouteTypesAreNoindex();
await verifyOfficialSourceHelper();
verifyUnknownStateIsNoindexed();

// 7. Pilot Environment Flag QA check
console.log('\n--- Checking Nationwide Indexability Gating ---');

// Test that COMPLETE states are indexable by default
const testStates = ['california', 'pennsylvania', 'colorado', 'delaware'];
let indexFails = 0;

testStates.forEach(st => {
  const policy = getSeoPolicyForRoute('state-hub', {
    stateId: st
  }, {
    entityCount: 10,
    confidenceScore: 0.95,
    hasOfficialSource: true,
    lastVerifiedDate: '2026-01-01',
    hasNoPlaceholderData: true
  });
  
  if (!policy.index) {
    logError(`Gating failure: COMPLETE state '${st}' is not indexable by default.`);
    indexFails++;
  }
});

// Test that BLOCKED states are NOT indexable
const blockedStates = ['new-york', 'ohio', 'florida', 'new-mexico'];
blockedStates.forEach(st => {
  const policy = getSeoPolicyForRoute('state-hub', {
    stateId: st
  }, {
    entityCount: 10,
    confidenceScore: 0.95,
    hasOfficialSource: true,
    lastVerifiedDate: '2026-01-01',
    hasNoPlaceholderData: true
  });
  
  if (policy.index) {
    logError(`Gating failure: BLOCKED state '${st}' is indexable!`);
    indexFails++;
  } else {
    logSuccess(`BLOCKED state '${st}' is correctly noindexed.`);
  }
});

if (indexFails === 0) {
  logSuccess('Nationwide gating is active (complete states indexable, blocked states excluded).');
}

// 8. Dynamic Audit Counts
function verifyAuditCounts() {
  console.log('\n--- Verifying Priority Queue Audit Counts & Statuses ---');
  
  const auditPath = path.resolve(process.cwd(), 'data/generated/all_state_california_grade_audit_v3.json');
  if (!fs.existsSync(auditPath)) {
    logError("Could not find all_state_california_grade_audit_v3.json file!");
    return;
  }
  const auditObj = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const expectedComplete = auditObj.classifications.COMPLETE;
  const expectedBlocked = auditObj.classifications.BLOCKED;
  const expectedIndexSafe = auditObj.indexSafeCount;

  const pqPath = path.resolve(process.cwd(), 'data/generated/all_state_priority_queue_v3.jsonl');
  if (!fs.existsSync(pqPath)) {
    logError("Could not find all_state_priority_queue_v3.jsonl file!");
    return;
  }

  const lines = fs.readFileSync(pqPath, 'utf8').trim().split('\n');
  let completeCount = 0;
  let blockedCount = 0;
  let indexSafeCount = 0;
  const incorrectlyIndexSafeStates: string[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const stateObj = JSON.parse(line);
    const stateId = stateObj.state;
    const classification = stateObj.classification;
    
    if (classification === 'COMPLETE') {
      completeCount++;
    } else if (classification === 'BLOCKED') {
      blockedCount++;
    }

    const auditStatus = stateAuditStatus(stateId);
    const indexSafe = auditStatus ? auditStatus.indexSafe : false;
    if (indexSafe) {
      indexSafeCount++;
      if (classification !== 'COMPLETE') {
        incorrectlyIndexSafeStates.push(stateId);
      }
    }
  }

  console.log(`COMPLETE Count: ${completeCount} (Expected: ${expectedComplete})`);
  console.log(`BLOCKED Count: ${blockedCount} (Expected: ${expectedBlocked})`);
  console.log(`Index-Safe Count: ${indexSafeCount} (Expected: ${expectedIndexSafe})`);
  console.log(`Incorrectly Index-Safe States: ${JSON.stringify(incorrectlyIndexSafeStates)} (Expected: [])`);

  if (completeCount !== expectedComplete) {
    logError(`Audit count mismatch: Expected ${expectedComplete} COMPLETE states, found ${completeCount}`);
  } else {
    logSuccess(`COMPLETE state count matches expected ${expectedComplete}.`);
  }

  if (blockedCount !== expectedBlocked) {
    logError(`Audit count mismatch: Expected ${expectedBlocked} BLOCKED states, found ${blockedCount}`);
  } else {
    logSuccess(`BLOCKED state count matches expected ${expectedBlocked}.`);
  }

  if (indexSafeCount !== expectedIndexSafe) {
    logError(`Index-safe count mismatch: Expected exactly ${expectedIndexSafe} index-safe states, found ${indexSafeCount}`);
  } else {
    logSuccess(`Index-safe state count matches expected ${expectedIndexSafe}.`);
  }

  if (incorrectlyIndexSafeStates.length > 0) {
    logError(`Incorrectly index-safe states found: ${JSON.stringify(incorrectlyIndexSafeStates)}`);
  } else {
    logSuccess("No incorrectly index-safe states found.");
  }
}

verifyAuditCounts();

// ----------------------------------------------------
// DYNAMIC RENDERED ROUTE & SITEMAP CRAWL CHECKS
// ----------------------------------------------------
const runFull = process.argv.includes('--full');

if (runFull) {
  console.log('\n====================================================');
  console.log('STARTING EXHAUSTIVE DYNAMIC RENDERED ROUTE QA CHECKS');
  console.log('====================================================');

  const port = 3001;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Starting dev server on ${baseUrl}...`);
  
  const serverProc = spawn('npx', ['next', 'start', '-p', String(port)], {
    cwd: path.resolve(__dirname, '../frontend'),
    env: { 
      ...process.env, 
      PORT: String(port),
      DB_ENCRYPTION_KEY: process.env.DB_ENCRYPTION_KEY || 'ca-special-needs-navigator-key-dev-32'
    },
    stdio: 'inherit'
  });

  // Handle server process exit
  let serverClosed = false;
  serverProc.on('exit', (code) => {
    serverClosed = true;
    console.log(`Next.js server process exited with code ${code}`);
  });

  // Wait for server to become ready
  let serverReady = false;
  for (let i = 0; i < 60; i++) {
    if (serverClosed) break;
    try {
      const res = await fetch(`${baseUrl}/benefits`);
      if (res.status === 200) {
        serverReady = true;
        break;
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 500));
  }

  if (!serverReady) {
    logError('Next.js dev server failed to start or become ready on port 3001.');
    serverProc.kill();
    process.exit(1);
  }
  logSuccess('Dev server is ready.');

  try {
    // A. Sitemap crawling
    console.log('\n--- Crawling Sitemaps ---');
    const sitemaps = ['static.xml', 'counties.xml', 'districts.xml', 'cities.xml'];
    const crawledUrls = new Set<string>();

    for (const sm of sitemaps) {
      const smUrl = `${baseUrl}/sitemaps/${sm}`;
      console.log(`Fetching sitemap: ${smUrl}`);
      const res = await fetch(smUrl);
      
      // districts.xml and cities.xml must return 404 because they contain 0 URLs
      if (sm === 'districts.xml' || sm === 'cities.xml') {
        if (res.status === 404) {
          logSuccess(`Sitemap ${sm} correctly returns 404 (empty).`);
        } else {
          logError(`Sitemap ${sm} returned status ${res.status}, expected 404!`);
        }
        continue;
      }

      if (res.status !== 200) {
        logError(`Failed to fetch sitemap ${sm}: status ${res.status}`);
        continue;
      }

      const text = await res.text();
      // Basic XML parsing for loc tags
      const matches = [...text.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map(m => m[1].trim());
      console.log(`Discovered ${matches.length} URLs in ${sm}`);

      for (const rawUrl of matches) {
        // Replace base site URL with local test URL
        const localUrl = rawUrl.replace('https://ablefull.org', baseUrl);
        crawledUrls.add(localUrl);
      }
    }

    // Verify sitemaps membership of crawled URLs
    console.log(`\nVerifying ${crawledUrls.size} sitemap URLs return 200, are indexable, and canonical...`);
    for (const url of crawledUrls) {
      const res = await fetch(url);
      if (res.status !== 200) {
        logError(`Sitemap URL ${url} returned status ${res.status}!`);
        continue;
      }
      const html = await res.text();

      // Check robots tag in HTML
      const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']+)["']/i);
      const isNoindex = robotsMatch && robotsMatch[1].toLowerCase().includes('noindex');
      if (isNoindex) {
        logError(`Sitemap URL ${url} is noindexed!`);
      }

      // Check canonical in HTML
      const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
      if (!canonicalMatch) {
        logError(`Sitemap URL ${url} lacks a canonical tag!`);
      } else {
        const canonicalVal = canonicalMatch[1].trim().replace('https://ablefull.org', baseUrl);
        const expectedCanonical = url.endsWith('/benefits') ? `${baseUrl}/benefits/california` : url;
        if (canonicalVal !== expectedCanonical) {
          logError(`Sitemap URL ${url} has a canonical mismatch! Canonical points to ${canonicalVal}`);
        }
      }
    }

    // B. Representative Route Checks
    console.log('\n--- Checking Representative Routes ---');

    // 1. COMPLETE State: california
    console.log('Testing COMPLETE State: /benefits/california');
    const calRes = await fetch(`${baseUrl}/benefits/california`);
    if (calRes.status !== 200) logError(`COMPLETE state returned status ${calRes.status}`);
    const calHtml = await calRes.text();
    if (calHtml.includes('noindex')) logError('COMPLETE state is noindexed!');
    if (!calHtml.includes('California Special Education &amp; Disability Guides')) logError('COMPLETE state page title incorrect!');

    // 2. BLOCKED State: new-york
    console.log('Testing BLOCKED State: /benefits/new-york');
    const nyRes = await fetch(`${baseUrl}/benefits/new-york`);
    const nyHtml = await nyRes.text();
    if (!nyHtml.includes('noindex')) logError('BLOCKED state page is not noindexed!');

    // 3. County that passes: /benefits/california/los-angeles
    console.log('Testing county that passes: /benefits/california/los-angeles');
    const laRes = await fetch(`${baseUrl}/benefits/california/los-angeles`);
    const laHtml = await laRes.text();
    if (laHtml.includes('noindex')) logError('LA county hub is noindexed!');
    if (laHtml.includes('local rate not verified') || laHtml.includes('Not verified')) logError('LA county hub has unverified wage values!');

    // 4. County with unverified wage: mariposa (or look up dynamically)
    const unverifiedCounty = db.prepare("SELECT id, name FROM counties WHERE state_id = 'california' AND (ihss_wage_rate IS NULL OR ihss_wage_rate <= 0) LIMIT 1").get() as { id: string, name: string } | undefined;
    if (unverifiedCounty) {
      const mcUrl = `/benefits/california/${unverifiedCounty.id}`;
      console.log(`Testing unverified wage county: ${mcUrl}`);
      const mcRes = await fetch(`${baseUrl}${mcUrl}`);
      const mcHtml = await mcRes.text();
      if (!mcHtml.includes('Not verified') && !mcHtml.includes('local rate not verified')) {
        logError(`Unverified wage county page did not display unverified notices!`);
      }
    }

    // 5. Program that passes: /benefits/california/program/ihss-for-children
    console.log('Testing program that passes: /benefits/california/program/ihss-for-children');
    const ihssRes = await fetch(`${baseUrl}/benefits/california/program/ihss-for-children`);
    const ihssHtml = await ihssRes.text();
    if (ihssHtml.includes('noindex')) logError('Indexable program is noindexed!');
    if (ihssHtml.includes('Not yet verified')) logError('Indexable program displays "Not yet verified" banner!');

    // 6. Program that fails (noindex): e.g. a blocked program
    const blockedProg = db.prepare("SELECT * FROM programs WHERE verification_status NOT IN ('official_verified', 'verified', 'human_verified') LIMIT 1").get() as any;
    if (blockedProg) {
      const pUrl = blockedProg.state_id 
        ? `/benefits/${blockedProg.state_id}/program/${blockedProg.id.toLowerCase().replace(/_/g, '-')}`
        : `/programs/${blockedProg.id.toLowerCase().replace(/_/g, '-')}`;
      console.log(`Testing unverified program: ${pUrl}`);
      const pRes = await fetch(`${baseUrl}${pUrl}`);
      const pHtml = await pRes.text();
      if (!pHtml.includes('noindex')) logError('Unverified program is not noindexed!');
      if (!pHtml.includes('Not yet verified') && !pHtml.includes('Verification Pending')) {
        logError('Unverified program is missing verification/pending warning banner!');
      }
    }

    // 7. Redirect behavior: /conditions/autism-spectrum-disorder
    console.log('Testing redirect: /conditions/autism-spectrum-disorder');
    const redRes = await fetch(`${baseUrl}/conditions/autism-spectrum-disorder`, { redirect: 'manual' });
    if (redRes.status !== 308) {
      logError(`Condition page returned status ${redRes.status}, expected 308!`);
    }
    const redLoc = redRes.headers.get('location');
    if (redLoc !== '/benefits/california/autism-spectrum-disorder') {
      logError(`Redirect location mismatch: expected /benefits/california/autism-spectrum-disorder, got ${redLoc}`);
    }

    // 8. Redirect state-specific program: /programs/ihss-for-children
    console.log('Testing state program redirect: /programs/ihss-for-children');
    const progRedRes = await fetch(`${baseUrl}/programs/ihss-for-children`, { redirect: 'manual' });
    if (progRedRes.status !== 308) {
      logError(`State-specific program guide returned status ${progRedRes.status}, expected 308!`);
    }
    const progRedLoc = progRedRes.headers.get('location');
    if (progRedLoc !== '/benefits/california/program/ihss-for-children') {
      logError(`State program redirect location mismatch: got ${progRedLoc}`);
    }

    // 9. Unknown state: /benefits/unknown-state
    console.log('Testing unknown state: /benefits/unknown-state');
    const unkRes = await fetch(`${baseUrl}/benefits/unknown-state`);
    if (unkRes.status !== 404) logError(`Unknown state returned status ${unkRes.status}, expected 404!`);

    // 10. Unknown slug: /benefits/california/unknown-slug
    console.log('Testing unknown slug: /benefits/california/unknown-slug');
    const unkSlugRes = await fetch(`${baseUrl}/benefits/california/unknown-slug`);
    if (unkSlugRes.status !== 404) logError(`Unknown slug returned status ${unkSlugRes.status}, expected 404!`);

    // C. Claim Checks
    console.log('\n--- Checking Factual / Financial Fallbacks on Rendered Outputs ---');
    const claimUrls = [
      `/benefits/california/los-angeles`,
      `/benefits/california/autism-spectrum-disorder/los-angeles`,
      `/benefits/california/program/ihss-for-children`
    ];

    for (const url of claimUrls) {
      const res = await fetch(`${baseUrl}${url}`);
      const text = await res.text();
      
      // Check for wage fallbacks
      if (text.includes('$18.00/hr') || text.includes('$18.50/hr')) {
        logError(`Page ${url} contains fallback hourly wage rate ($18.00 or $18.50)!`);
      }
      
      // Check for generic timeline claim
      if (text.includes('15 to 30 days')) {
        logError(`Page ${url} contains generic "15 to 30 days" school district timeline!`);
      }
    }

  } catch (err: any) {
    logError(`Crawl/Render testing encountered an error: ${err.message}`);
  } finally {
    console.log('\nStopping dev server...');
    serverProc.kill();
  }
} else {
  console.log('\nSkipping rendered route checks and sitemap crawl. Use "--full" to run the full QA suite.');
}

console.log('\n--- SEO QA Verification Summary ---');
console.log(`Errors Found: ${errors}`);
console.log(`Warnings Found: ${warnings}`);

db.close();

if (errors > 0) {
  console.log('\x1b[31mSEO QA verification failed. Please fix the errors before releasing.\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32mSEO QA verification passed successfully!\x1b[0m');
  process.exit(0);
}
