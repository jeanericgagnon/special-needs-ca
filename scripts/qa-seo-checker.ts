import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { evaluateSeoPolicy, assertNoPlaceholderData, mapShortDiagToDbId } from '../frontend/src/lib/seo-policy';

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
  { pattern: /officialSources\s*:\s*\[/i, label: 'hardcoded officialSources array' }
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
            !filePath.endsWith('seo-data.ts') && 
            !filePath.endsWith('five-states-seo-data.ts') && 
            !filePath.endsWith('diagnoses.ts') && 
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
      if (pattern.test(content)) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (pattern.test(line) && !line.includes('QA-ALLOW')) {
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
  const scores = stateProgs.map(p => p.confidence_score).filter(s => s !== null && s !== undefined);
  const avgScore = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length) / 5.0 : null;

  const policy = evaluateSeoPolicy({
    routeType: 'state-hub',
    stateId: state.id,
    confidenceScore: avgScore,
    hasOfficialSource: stateProgs.length > 0 && stateProgs.some(p => !!p.official_source_url),
    lastVerifiedDate: minDate,
    hasNoPlaceholderData: assertNoPlaceholderData(state.name) && stateProgs.every(p => assertNoPlaceholderData(JSON.stringify(p)))
  });

  const url = `/benefits/${state.id}`;
  if (policy.index) {
    logSuccess(`State Hub indexable: ${url} (Score: ${policy.qualityScore})`);
  } else {
    logSuccess(`State Hub noindexed (correct): ${url} (Blockers: ${policy.blockers.join(', ')})`);
  }
});

// 2. County Hubs
counties.forEach(county => {
  const offices = db.prepare('SELECT * FROM county_offices WHERE county_id = ?').all(county.id) as any[];
  const countyDistricts = db.prepare('SELECT * FROM school_districts WHERE county_id = ?').all(county.id) as any[];
  
  // Get regional centers view details
  const details = db.prepare(`
    SELECT rc.* FROM regional_centers rc
    JOIN regional_center_counties rcc ON rc.id = rcc.regional_center_id
    WHERE rcc.county_id = ?
  `).all(county.id) as any[];

  const hasRequiredContactInfo = offices.length > 0;
  const hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(county)) && assertNoPlaceholderData(JSON.stringify(offices));

  // Compute metrics dynamically from sub-entities
  const rcDates = details.map(rc => rc.last_verified_date).filter(Boolean);
  const sdDates = countyDistricts.map(sd => sd.last_verified_date).filter(Boolean);
  const coDates = offices.map(co => co.last_verified_date).filter(Boolean);
  const allDates = [...rcDates, ...sdDates, ...coDates];
  const lastVerifiedDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

  const rcScores = details.map(rc => rc.confidence_score).filter((s): s is number => s !== null && s !== undefined);
  const sdScores = countyDistricts.map(sd => sd.confidence_score !== null && sd.confidence_score !== undefined ? sd.confidence_score / 5.0 : null).filter((s): s is number => s !== null);
  const coScores = offices.map(co => co.confidence_score !== null && co.confidence_score !== undefined ? co.confidence_score / 5.0 : null).filter((s): s is number => s !== null);
  const allScores = [...rcScores, ...sdScores, ...coScores];
  const confidenceScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

  let hasOfficialSource = !!county.website || !!county.source_url;
  if (details.some(rc => !!rc.source_url) || countyDistricts.some(sd => !!sd.source_url) || offices.some(co => !!co.source_url)) {
    hasOfficialSource = true;
  }

  const policy = evaluateSeoPolicy({
    routeType: 'county-hub',
    stateId: county.state_id,
    countyId: county.id,
    entityCount: countyDistricts.length,
    hasOfficialSource,
    lastVerifiedDate,
    confidenceScore,
    hasRequiredContactInfo,
    hasNoPlaceholderData
  });

  const url = `/benefits/${county.state_id}/${county.id}`;
  if (policy.index) {
    logSuccess(`County Hub indexable: ${url} (Score: ${policy.qualityScore})`);
    if (!hasNoPlaceholderData) {
      logError(`Indexable County Hub ${url} contains placeholder data!`);
    }
  } else {
    if (!policy.blockers.includes('State is not yet in the indexed state allowlist') && county.state_id === 'california') {
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

  const policy = evaluateSeoPolicy({
    routeType: 'program-guide',
    stateId: prog.state_id || 'california',
    programId: prog.id,
    hasOfficialSource: !!prog.official_source_url,
    lastVerifiedDate: prog.last_verified_date || null,
    confidenceScore: prog.confidence_score !== null && prog.confidence_score !== undefined
      ? Number(prog.confidence_score) / 5.0
      : null,
    hasEligibilityRules,
    hasApplicationSteps,
    hasDocuments,
    hasNoPlaceholderData
  });

  const url = `/programs/${prog.id.toLowerCase().replace(/_/g, '-')}`;
  if (policy.index) {
    logSuccess(`Program guide indexable: ${url} (Score: ${policy.qualityScore})`);
    if (!hasNoPlaceholderData) {
      logError(`Indexable Program ${url} contains placeholder data!`);
    }
    
    // Database-level assertions for indexable program pages
    if (!prog.official_source_url) {
      logError(`Indexable Program ${url} is missing official source URL!`);
    } else if (prog.official_source_url === 'https://www.dhcs.ca.gov' || prog.official_source_url === 'https://dhcs.ca.gov') {
      logError(`Indexable Program ${url} has a generic fallback official source URL!`);
    }
    if (!prog.last_verified_date) {
      logError(`Indexable Program ${url} is missing last verified date!`);
    }
    if (prog.confidence_score === null || prog.confidence_score === undefined) {
      logError(`Indexable Program ${url} is missing confidence score!`);
    }
    if (!hasEligibilityRules) {
      logError(`Indexable Program ${url} is missing eligibility rules!`);
    }
    if (!hasApplicationSteps) {
      logError(`Indexable Program ${url} is missing application steps!`);
    }
    if (!hasDocuments) {
      logError(`Indexable Program ${url} is missing document requirements!`);
    }
  } else {
    logSuccess(`Program guide noindexed (correct): ${url} (Blockers: ${policy.blockers.join(', ')})`);
  }
});

// 4. County-Condition Pages
counties.forEach(county => {
  const stateId = county.state_id || 'california';
  if (stateId !== 'california') return;

  const offices = db.prepare('SELECT * FROM county_offices WHERE county_id = ?').all(county.id) as any[];
  const providers = db.prepare('SELECT * FROM resource_providers WHERE county_id = ?').all(county.id) as any[];
  
  // Get regional centers view details
  const details = db.prepare(`
    SELECT rc.* FROM regional_centers rc
    JOIN regional_center_counties rcc ON rc.id = rcc.regional_center_id
    WHERE rcc.county_id = ?
  `).all(county.id) as any[];
  
  const countyDistricts = db.prepare('SELECT * FROM school_districts WHERE county_id = ?').all(county.id) as any[];

  const playgrounds = providers.filter(p => p.categories === 'playground');
  const clinics = providers.filter(p => p.categories === 'therapy-clinic');
  const groups = providers.filter(p => p.categories === 'support-group');

  const hasRealLocalAssets = playgrounds.length > 0 || clinics.length > 0 || groups.length > 0;
  const hasRequiredContactInfo = offices.length > 0;
  const hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(county)) && assertNoPlaceholderData(JSON.stringify(offices));

  // Compute metrics dynamically from sub-entities
  const rcDates = details.map(rc => rc.last_verified_date).filter(Boolean);
  const sdDates = countyDistricts.map(sd => sd.last_verified_date).filter(Boolean);
  const coDates = offices.map(co => co.last_verified_date).filter(Boolean);
  const allDates = [...rcDates, ...sdDates, ...coDates];
  const lastVerifiedDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

  const rcScores = details.map(rc => rc.confidence_score).filter((s): s is number => s !== null && s !== undefined);
  const sdScores = countyDistricts.map(sd => sd.confidence_score !== null && sd.confidence_score !== undefined ? sd.confidence_score / 5.0 : null).filter((s): s is number => s !== null);
  const coScores = offices.map(co => co.confidence_score !== null && co.confidence_score !== undefined ? co.confidence_score / 5.0 : null).filter((s): s is number => s !== null);
  const allScores = [...rcScores, ...sdScores, ...coScores];
  const confidenceScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

  let hasOfficialSource = !!county.website || !!county.source_url;
  if (details.some(rc => !!rc.source_url) || countyDistricts.some(sd => !!sd.source_url) || offices.some(co => !!co.source_url)) {
    hasOfficialSource = true;
  }

  VERIFIED_DIAGNOSES.forEach(diag => {
    const policy = evaluateSeoPolicy({
      routeType: 'county-condition',
      stateId,
      countyId: county.id,
      diagnosisId: diag,
      hasRealLocalAssets,
      hasRequiredContactInfo,
      hasNoPlaceholderData,
      confidenceScore,
      hasOfficialSource,
      lastVerifiedDate
    });

    const url = `/benefits/${stateId}/${diag}/${county.id}`;
    if (policy.index) {
      logSuccess(`County-Condition indexable: ${url}`);
      if (!hasNoPlaceholderData) {
        logError(`Indexable County-Condition ${url} contains placeholder data!`);
      }
    } else {
      if (county.id === 'los-angeles' || county.id === 'orange') {
        logWarning(`County-Condition noindexed: ${url} (Blockers: ${policy.blockers.join(', ')})`);
      }
    }
  });
});

// 5. Condition Hub Pages
console.log('\n--- Checking Condition Hub Pages ---');
const conditions = db.prepare('SELECT * FROM conditions').all() as any[];

conditions.forEach(cond => {
  const condId = cond.id;
  const condPrograms = db.prepare(`
    SELECT DISTINCT p.* FROM programs p
    JOIN program_eligibility_rules r ON p.id = r.program_id
    WHERE r.required_condition = ? AND p.state_id = 'california'
  `).all(condId) as any[];

  const dates = condPrograms.map(p => p.last_verified_date).filter(Boolean);
  if (cond.last_verified_date) {
    dates.push(cond.last_verified_date);
  }
  const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;

  const scores = condPrograms.map(p => p.confidence_score).filter(s => s !== null && s !== undefined);
  const confidenceScore = scores.length > 0 ? (scores.reduce((sum, s) => sum + s, 0) / scores.length) / 5.0 : null;

  const hasOfficialSource = (cond.source_url ? (!cond.source_url.includes('ablefull.org') && !cond.source_url.includes('california-navigator.org')) : false) || condPrograms.some(p => !!p.official_source_url);

  const policy = evaluateSeoPolicy({
    routeType: 'condition-hub',
    stateId: 'california',
    diagnosisId: condId,
    confidenceScore,
    hasOfficialSource,
    lastVerifiedDate,
    hasNoPlaceholderData: condPrograms.every(p => assertNoPlaceholderData(JSON.stringify(p)))
  });

  const url = `/conditions/${condId}`;
  if (policy.index) {
    logSuccess(`Condition Hub indexable: ${url} (Score: ${policy.qualityScore})`);
    if (!lastVerifiedDate) {
      logError(`Indexable Condition ${url} is missing last verified date!`);
    }
    if (confidenceScore === null) {
      logError(`Indexable Condition ${url} is missing confidence score!`);
    }
    if (!hasOfficialSource) {
      logError(`Indexable Condition ${url} is missing official source!`);
    }
  } else {
    logSuccess(`Condition Hub noindexed (correct): ${url} (Blockers: ${policy.blockers.join(', ')})`);
  }
});

// 6. Schema Over-Emission Scanner
function scanFilesForSchemaOverEmission() {
  console.log('\n--- Scanning Source Files for Schema Over-Emission ---');
  const srcDir = path.resolve(__dirname, '../frontend/src');
  
  function walkDir(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath, fileList);
      } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        if (!filePath.includes('qa-seo-checker')) {
          fileList.push(filePath);
        }
      }
    }
    return fileList;
  }

  const allFiles = walkDir(srcDir);
  let overEmissionsFound = 0;
  
  const schemaKeywords = ['FAQPage', 'MedicalCondition', 'GovernmentService', 'ProfessionalService', 'Park'];

  for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(path.resolve(__dirname, '..'), file);
    
    const foundKeywords = schemaKeywords.filter(keyword => {
      if (keyword === 'Park') {
        return content.includes("'Park'") || content.includes('"Park"');
      }
      return content.includes(keyword);
    });
    if (foundKeywords.length > 0) {
      const hasGating = content.includes('policy.index') || content.includes('isIndexable') || content.includes('verifiedAdvocates') || content.includes('QA-ALLOW-SCHEMA');
      if (!hasGating) {
        logError(`Potential schema over-emission in ${relativePath}: contains schema keywords [${foundKeywords.join(', ')}] but lacks gating check (policy.index, isIndexable).`);
        overEmissionsFound++;
      }
    }
  }

  if (overEmissionsFound === 0) {
    logSuccess('No schema over-emission vulnerabilities found in source code files.');
  } else {
    console.log(`\x1b[31m[FAIL]\x1b[0m Found ${overEmissionsFound} potential schema over-emission instances.`);
  }
}

// Run scanners
scanFilesForSchemaOverEmission();
scanFilesForBannedPatterns();

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
