import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { execFileSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const frontendDir = path.join(repoRoot, 'frontend');

const dbFiles = [
  'ca_disability_crawler.db',
  'ca_disability_navigator.db',
];

const envPath = path.join(frontendDir, '.env.local');
const envTemplate = `JWT_SECRET=local-dev-jwt-secret-change-me
DB_ENCRYPTION_KEY=ca-special-needs-navigator-key-dev-32
# Optional: switch the frontend to PostgreSQL instead of the bundled SQLite files.
# DATABASE_URL=postgres://user:password@localhost:5432/special_needs_ca
`;

function ensureFrontendEnv() {
  if (fs.existsSync(envPath)) {
    console.log(`• Keeping existing ${path.relative(repoRoot, envPath)}`);
    return;
  }

  fs.writeFileSync(envPath, envTemplate, 'utf8');
  console.log(`• Created ${path.relative(repoRoot, envPath)}`);
}

function ensureDbLink(fileName) {
  const rootPath = path.join(repoRoot, fileName);
  const frontendPath = path.join(frontendDir, fileName);

  if (!fs.existsSync(frontendPath)) {
    console.warn(`• Skipped ${fileName}: missing ${path.relative(repoRoot, frontendPath)}`);
    return;
  }

  if (fs.existsSync(rootPath)) {
    console.log(`• Keeping existing ${fileName}`);
    return;
  }

  const relativeTarget = path.relative(repoRoot, frontendPath);
  fs.symlinkSync(relativeTarget, rootPath);
  console.log(`• Linked ${fileName} -> ${relativeTarget}`);
}

function quickCheckDb(dbPath) {
  try {
    const output = execFileSync('sqlite3', [dbPath, 'PRAGMA quick_check;'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    return output === 'ok';
  } catch {
    return false;
  }
}

function recoverSqliteDb(dbPath) {
  const relativeDbPath = path.relative(repoRoot, dbPath);
  const recoverSqlPath = path.join(frontendDir, '.tmp-navigator-recover.sql');
  const recoveredDbPath = path.join(frontendDir, '.tmp-navigator-recovered.db');
  const backupBase = `${dbPath}.corrupt-${Date.now()}`;

  try {
    const recoverSql = execFileSync('sqlite3', [dbPath, '.recover'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 50 * 1024 * 1024,
    });

    fs.writeFileSync(recoverSqlPath, recoverSql, 'utf8');
    if (fs.existsSync(recoveredDbPath)) {
      fs.rmSync(recoveredDbPath, { force: true });
    }

    execFileSync('sqlite3', [recoveredDbPath], {
      cwd: repoRoot,
      input: recoverSql,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 50 * 1024 * 1024,
    });

    if (!quickCheckDb(recoveredDbPath)) {
      throw new Error('Recovered database failed quick_check');
    }

    const sidecars = [dbPath, `${dbPath}-wal`, `${dbPath}-shm`];
    for (const originalPath of sidecars) {
      if (fs.existsSync(originalPath)) {
        fs.renameSync(originalPath, `${backupBase}${originalPath.slice(dbPath.length)}`);
      }
    }

    fs.renameSync(recoveredDbPath, dbPath);
    console.log(`• Recovered malformed navigator DB at ${relativeDbPath}`);
    console.log(`• Archived corrupt navigator DB as ${path.relative(repoRoot, backupBase)}`);
    return true;
  } catch (error) {
    console.warn(`• Failed navigator DB recovery for ${relativeDbPath}: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  } finally {
    if (fs.existsSync(recoverSqlPath)) {
      fs.rmSync(recoverSqlPath, { force: true });
    }
    if (fs.existsSync(recoveredDbPath)) {
      fs.rmSync(recoveredDbPath, { force: true });
    }
  }
}

function ensureHealthyNavigatorDb() {
  const dbPath = path.join(frontendDir, 'ca_disability_navigator.db');
  if (!fs.existsSync(dbPath)) {
    return;
  }

  if (quickCheckDb(dbPath)) {
    return;
  }

  console.warn(`• Detected malformed navigator DB at ${path.relative(repoRoot, dbPath)}`);
  recoverSqliteDb(dbPath);
}

function ensureLocalDbCompatibility() {
  const dbPath = path.join(frontendDir, 'ca_disability_navigator.db');
  if (!fs.existsSync(dbPath)) {
    console.warn(`• Skipped DB compatibility repair: missing ${path.relative(repoRoot, dbPath)}`);
    return;
  }

  const db = new Database(dbPath);
  const stateNameToId = {
    Alabama: 'alabama',
    Alaska: 'alaska',
    Arizona: 'arizona',
    Arkansas: 'arkansas',
    California: 'california',
    Colorado: 'colorado',
    Connecticut: 'connecticut',
    Delaware: 'delaware',
    Florida: 'florida',
    Georgia: 'georgia',
    Hawaii: 'hawaii',
    Idaho: 'idaho',
    Illinois: 'illinois',
    Indiana: 'indiana',
    Iowa: 'iowa',
    Kansas: 'kansas',
    Kentucky: 'kentucky',
    Louisiana: 'louisiana',
    Maine: 'maine',
    Maryland: 'maryland',
    Massachusetts: 'massachusetts',
    Michigan: 'michigan',
    Minnesota: 'minnesota',
    Mississippi: 'mississippi',
    Missouri: 'missouri',
    Montana: 'montana',
    Nebraska: 'nebraska',
    Nevada: 'nevada',
    'New Hampshire': 'new-hampshire',
    'New Jersey': 'new-jersey',
    'New Mexico': 'new-mexico',
    'New York': 'new-york',
    'North Carolina': 'north-carolina',
    'North Dakota': 'north-dakota',
    Ohio: 'ohio',
    Oklahoma: 'oklahoma',
    Oregon: 'oregon',
    Pennsylvania: 'pennsylvania',
    'Rhode Island': 'rhode-island',
    'South Carolina': 'south-carolina',
    'South Dakota': 'south-dakota',
    Tennessee: 'tennessee',
    Texas: 'texas',
    Utah: 'utah',
    Vermont: 'vermont',
    Virginia: 'virginia',
    Washington: 'washington',
    'West Virginia': 'west-virginia',
    Wisconsin: 'wisconsin',
    Wyoming: 'wyoming',
  };
  const stateIdToCode = {
    alabama: 'AL',
    alaska: 'AK',
    arizona: 'AZ',
    arkansas: 'AR',
    california: 'CA',
    colorado: 'CO',
    connecticut: 'CT',
    delaware: 'DE',
    florida: 'FL',
    georgia: 'GA',
    hawaii: 'HI',
    idaho: 'ID',
    illinois: 'IL',
    indiana: 'IN',
    iowa: 'IA',
    kansas: 'KS',
    kentucky: 'KY',
    louisiana: 'LA',
    maine: 'ME',
    maryland: 'MD',
    massachusetts: 'MA',
    michigan: 'MI',
    minnesota: 'MN',
    mississippi: 'MS',
    missouri: 'MO',
    montana: 'MT',
    nebraska: 'NE',
    nevada: 'NV',
    'new-hampshire': 'NH',
    'new-jersey': 'NJ',
    'new-mexico': 'NM',
    'new-york': 'NY',
    'north-carolina': 'NC',
    'north-dakota': 'ND',
    ohio: 'OH',
    oklahoma: 'OK',
    oregon: 'OR',
    pennsylvania: 'PA',
    'rhode-island': 'RI',
    'south-carolina': 'SC',
    'south-dakota': 'SD',
    tennessee: 'TN',
    texas: 'TX',
    utah: 'UT',
    vermont: 'VT',
    virginia: 'VA',
    washington: 'WA',
    'west-virginia': 'WV',
    wisconsin: 'WI',
    wyoming: 'WY',
  };
  const tableExists = (name) => Boolean(
    db.prepare(`SELECT 1 AS ok FROM sqlite_master WHERE type IN ('table', 'view') AND name = ?`).get(name)
  );
  const columnNames = (tableName) => (
    tableExists(tableName)
      ? db.prepare(`PRAGMA table_info(${tableName})`).all().map((row) => row.name)
      : []
  );

  try {
    if (tableExists('program_eligibility_rules')) {
      const cols = new Set(columnNames('program_eligibility_rules'));
      if (!cols.has('min_age_years')) {
        db.exec(`ALTER TABLE program_eligibility_rules ADD COLUMN min_age_years REAL DEFAULT 0.0;`);
      }
      if (!cols.has('max_age_years')) {
        db.exec(`ALTER TABLE program_eligibility_rules ADD COLUMN max_age_years REAL DEFAULT 21.0;`);
      }
    }

    if (tableExists('counties')) {
      const cols = new Set(columnNames('counties'));
      if (!cols.has('website')) {
        db.exec(`ALTER TABLE counties ADD COLUMN website TEXT DEFAULT '';`);
      }
      if (!cols.has('ihss_wage_rate')) {
        db.exec(`ALTER TABLE counties ADD COLUMN ihss_wage_rate REAL;`);
      }
      if (!cols.has('medi_cal_plans')) {
        db.exec(`ALTER TABLE counties ADD COLUMN medi_cal_plans TEXT;`);
      }
    }

    if (tableExists('program_waitlists')) {
      const cols = new Set(columnNames('program_waitlists'));
      if (!cols.has('duration_label')) {
        db.exec(`ALTER TABLE program_waitlists ADD COLUMN duration_label TEXT DEFAULT 'unknown';`);
      }
      if (!cols.has('duration_months')) {
        db.exec(`ALTER TABLE program_waitlists ADD COLUMN duration_months REAL DEFAULT 0.0;`);
      }
      if (!cols.has('status')) {
        db.exec(`ALTER TABLE program_waitlists ADD COLUMN status TEXT DEFAULT 'unknown';`);
      }
      if (!cols.has('reserve_capacity_notice')) {
        db.exec(`ALTER TABLE program_waitlists ADD COLUMN reserve_capacity_notice TEXT;`);
      }
      if (!cols.has('legal_deadline')) {
        db.exec(`ALTER TABLE program_waitlists ADD COLUMN legal_deadline TEXT;`);
      }
      if (!cols.has('last_scraped_at')) {
        db.exec(`ALTER TABLE program_waitlists ADD COLUMN last_scraped_at TEXT;`);
      }
    }

    if (tableExists('program_appeal_info')) {
      const cols = new Set(columnNames('program_appeal_info'));
      if (!cols.has('deadline_days')) {
        db.exec(`ALTER TABLE program_appeal_info ADD COLUMN deadline_days TEXT;`);
      }
    }

    if (tableExists('program_document_requirements')) {
      const cols = new Set(columnNames('program_document_requirements'));
      if (!cols.has('is_mandatory')) {
        db.exec(`ALTER TABLE program_document_requirements ADD COLUMN is_mandatory INTEGER DEFAULT 1;`);
      }
    }

    if (tableExists('program_application_steps')) {
      const cols = new Set(columnNames('program_application_steps'));
      if (!cols.has('step_number')) {
        db.exec(`ALTER TABLE program_application_steps ADD COLUMN step_number INTEGER DEFAULT 1;`);
      }
    }

    if (tableExists('state_resource_agencies')) {
      const cols = new Set(columnNames('state_resource_agencies'));
      if (!cols.has('frc_relationship')) {
        db.exec(`ALTER TABLE state_resource_agencies ADD COLUMN frc_relationship TEXT;`);
      }
      if (!cols.has('office_locations')) {
        db.exec(`ALTER TABLE state_resource_agencies ADD COLUMN office_locations TEXT;`);
      }
    }

    if (tableExists('school_districts')) {
      const cols = new Set(columnNames('school_districts'));
      if (!cols.has('total_enrollment')) {
        db.exec(`ALTER TABLE school_districts ADD COLUMN total_enrollment INTEGER;`);
      }
      if (!cols.has('special_ed_pct')) {
        db.exec(`ALTER TABLE school_districts ADD COLUMN special_ed_pct REAL;`);
      }
      if (!cols.has('inclusion_rate_pct')) {
        db.exec(`ALTER TABLE school_districts ADD COLUMN inclusion_rate_pct REAL;`);
      }
      if (!cols.has('self_contained_rate_pct')) {
        db.exec(`ALTER TABLE school_districts ADD COLUMN self_contained_rate_pct REAL;`);
      }
      if (!cols.has('evidence_level')) {
        db.exec(`ALTER TABLE school_districts ADD COLUMN evidence_level TEXT;`);
      }
      if (!cols.has('display_status')) {
        db.exec(`ALTER TABLE school_districts ADD COLUMN display_status TEXT DEFAULT 'published';`);
      }
    }

    if (tableExists('regional_education_agencies')) {
      const cols = new Set(columnNames('regional_education_agencies'));
      if (!cols.has('display_status')) {
        db.exec(`ALTER TABLE regional_education_agencies ADD COLUMN display_status TEXT DEFAULT 'published';`);
      }
    }

    if (tableExists('state_resource_agencies')) {
      const cols = new Set(columnNames('state_resource_agencies'));
      if (!cols.has('display_status')) {
        db.exec(`ALTER TABLE state_resource_agencies ADD COLUMN display_status TEXT DEFAULT 'published';`);
      }
    }

    if (tableExists('iep_advocates')) {
      const cols = new Set(columnNames('iep_advocates'));
      if (!cols.has('display_status')) {
        db.exec(`ALTER TABLE iep_advocates ADD COLUMN display_status TEXT DEFAULT 'published';`);
      }
    }

    if (tableExists('resource_providers')) {
      const cols = new Set(columnNames('resource_providers'));
      if (!cols.has('display_status')) {
        db.exec(`ALTER TABLE resource_providers ADD COLUMN display_status TEXT DEFAULT 'published';`);
      }
    }

    if (tableExists('nonprofit_organizations')) {
      const cols = new Set(columnNames('nonprofit_organizations'));
      if (!cols.has('display_status')) {
        db.exec(`ALTER TABLE nonprofit_organizations ADD COLUMN display_status TEXT DEFAULT 'published';`);
      }
    }

    db.exec(`
      CREATE TABLE IF NOT EXISTS iep_advocates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL DEFAULT '',
        credentials TEXT NOT NULL DEFAULT '',
        experience_years INTEGER NOT NULL DEFAULT 0,
        price_rate TEXT NOT NULL DEFAULT '',
        counties_served TEXT NOT NULL DEFAULT '',
        languages_spoken TEXT NOT NULL DEFAULT '',
        phone TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        website TEXT NOT NULL DEFAULT '',
        verification_status TEXT DEFAULT 'unverified',
        source_url TEXT,
        source_type TEXT,
        last_scraped_at TEXT,
        last_verified_at TEXT,
        last_verified_date TEXT,
        data_origin TEXT,
        confidence_score REAL,
        service_tags TEXT,
        serving_tags TEXT,
        availability_status TEXT,
        accepting_new_clients INTEGER,
        waitlist_status TEXT,
        capacity_notes TEXT,
        funding_status TEXT,
        checked_at TEXT,
        source_name TEXT,
        source_last_updated TEXT,
        next_step_type TEXT,
        next_step_label TEXT,
        next_step_url TEXT,
        next_step_phone TEXT,
        next_step_email TEXT,
        next_step_instructions TEXT,
        requirements TEXT,
        application_url TEXT,
        referral_url TEXT,
        walk_in_available INTEGER,
        appointment_required INTEGER,
        interpreter_available INTEGER,
        asl_available INTEGER,
        wheelchair_accessible INTEGER,
        virtual_services INTEGER,
        in_person_services INTEGER,
        home_visits INTEGER,
        transportation_help INTEGER,
        accessibility_notes TEXT,
        manual_review_required INTEGER DEFAULT 0,
        data_quality_notes TEXT,
        unsupported_claim_flags TEXT,
        claim_status TEXT,
        claimed_by TEXT,
        verified_affiliation INTEGER DEFAULT 0,
        claim_email TEXT
      );
      CREATE TABLE IF NOT EXISTS iep_advocate_counties (
        iep_advocate_id TEXT,
        county_id TEXT,
        PRIMARY KEY (iep_advocate_id, county_id)
      );
      CREATE TABLE IF NOT EXISTS child_profile_conditions (
        child_id TEXT NOT NULL,
        condition_id TEXT NOT NULL,
        PRIMARY KEY (child_id, condition_id)
      );
      CREATE TABLE IF NOT EXISTS child_profile_needs (
        child_id TEXT NOT NULL,
        need_id TEXT NOT NULL,
        PRIMARY KEY (child_id, need_id)
      );
      CREATE TABLE IF NOT EXISTS child_profiles (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        nickname TEXT NOT NULL,
        dob TEXT NOT NULL,
        county_id TEXT NOT NULL,
        zip_code TEXT,
        insurance_type TEXT,
        school_status TEXT,
        language_preference TEXT,
        caregiver_notes TEXT
      );
      CREATE TABLE IF NOT EXISTS case_program_statuses (
        child_id TEXT NOT NULL,
        program_id TEXT NOT NULL,
        status TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        PRIMARY KEY (child_id, program_id)
      );
      CREATE TABLE IF NOT EXISTS document_checklist_items (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        document_name TEXT NOT NULL,
        is_collected INTEGER NOT NULL,
        program_id TEXT,
        file_mock_url TEXT
      );
      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        program_id TEXT,
        title TEXT NOT NULL,
        due_date TEXT NOT NULL,
        is_completed INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS child_iep_accommodations (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        accommodation_id TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS child_iep_goals (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        goal_template_id TEXT NOT NULL,
        custom_text TEXT NOT NULL,
        tokens_json TEXT
      );
      CREATE TABLE IF NOT EXISTS child_respite_assessments (
        child_id TEXT PRIMARY KEY,
        safety_score INTEGER NOT NULL,
        sleep_score INTEGER NOT NULL,
        medical_score INTEGER NOT NULL,
        behavior_score INTEGER NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS child_waivers (
        id TEXT PRIMARY KEY,
        child_id TEXT NOT NULL,
        waiver_type TEXT NOT NULL,
        document_name TEXT NOT NULL,
        file_path TEXT,
        effective_date TEXT,
        expiration_date TEXT,
        authorized_hours REAL,
        parsed_content TEXT,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS conditions (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        aliases TEXT,
        parent_friendly_explanation TEXT,
        regional_center_relevance INTEGER,
        iep_relevance INTEGER,
        ccs_relevance INTEGER,
        ssi_relevance INTEGER,
        cal_able_relevance INTEGER,
        age_specific_notes TEXT,
        source_url TEXT,
        last_verified_date TEXT
      );
      CREATE TABLE IF NOT EXISTS functional_needs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        description TEXT,
        program_triggers TEXT
      );
      DROP VIEW IF EXISTS regional_centers;
      CREATE VIEW regional_centers AS
      SELECT
        id,
        state_id,
        agency_type,
        name,
        counties_served,
        catchment_boundaries,
        website,
        intake_phone,
        early_intervention_contact AS early_start_contact,
        agency_intake_contact AS lanterman_intake_contact,
        eligibility_info_page,
        services_page,
        appeals_info,
        frc_relationship,
        office_locations,
        languages,
        last_verified_date,
        source_urls,
        source_url,
        source_type,
        data_origin,
        verification_status,
        last_scraped_at,
        confidence_score,
        display_status
      FROM state_resource_agencies;
      DROP VIEW IF EXISTS selpas;
      CREATE VIEW selpas AS
      SELECT
        id,
        name,
        counties_served,
        website,
        source_url,
        source_type,
        data_origin,
        verification_status,
        last_verified_date,
        last_scraped_at,
        confidence_score,
        display_status
      FROM regional_education_agencies;
    `);

    const stateCount = tableExists('states')
      ? Number(db.prepare('SELECT COUNT(*) AS count FROM states').get().count)
      : 0;
    const countyCount = tableExists('counties')
      ? Number(db.prepare('SELECT COUNT(*) AS count FROM counties').get().count)
      : 0;

    if (stateCount < 45 || countyCount < 1000) {
      const usCountiesPath = path.join(repoRoot, 'data', 'us_counties.json');
      const usCounties = JSON.parse(fs.readFileSync(usCountiesPath, 'utf8'));

      const insertState = db.prepare(`
        INSERT OR IGNORE INTO states (id, name, code)
        VALUES (?, ?, ?)
      `);
      const insertCounty = db.prepare(`
        INSERT OR IGNORE INTO counties (id, state_id, name, website)
        VALUES (?, ?, ?, ?)
      `);

      const normalizeCountySlug = (countyName, stateCode) => {
        const base = countyName
          .replace(/\s+(County|Parish|Borough|Census Area|Municipality|City and Borough)$/i, '')
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/^-+|-+$/g, '')
          .toLowerCase();
        return stateCode === 'CA' ? base : `${base}-${stateCode.toLowerCase()}`;
      };

      db.transaction(() => {
        Object.entries(stateIdToCode).forEach(([stateId, code]) => {
          const stateName = Object.keys(stateNameToId).find((name) => stateNameToId[name] === stateId);
          if (stateName) {
            insertState.run(stateId, stateName, code);
          }
        });

        Object.values(usCounties).forEach((countyData) => {
          const stateId = stateNameToId[countyData.state];
          if (!stateId) return;
          const stateCode = stateIdToCode[stateId];
          const countyId = normalizeCountySlug(countyData.name, stateCode);
          const countyName = countyData.name.replace(/\s+(County|Parish|Borough|Census Area|Municipality|City and Borough)$/i, '').trim();
          const website = stateCode === 'CA'
            ? `https://www.${countyId}county.ca.gov`
            : `https://www.${countyId.replace(new RegExp(`-${stateCode.toLowerCase()}$`), '')}.${stateCode.toLowerCase()}.gov`;
          insertCounty.run(countyId, stateId, countyName, website);
        });
      })();

      console.log('• Seeded local geography spine from data/us_counties.json');
    }
    console.log('• Repaired local DB compatibility for audits/build');
  } finally {
    db.close();
  }
}

function maybeSeedLocalDemoDataset() {
  const dbPath = path.join(frontendDir, 'ca_disability_navigator.db');
  if (!fs.existsSync(dbPath)) return;

  const db = new Database(dbPath, { readonly: true });
  try {
    const stateCount = Number(db.prepare('SELECT COUNT(*) AS count FROM states').get().count);
    const countyCount = Number(db.prepare('SELECT COUNT(*) AS count FROM counties').get().count);
    const programCount = Number(db.prepare('SELECT COUNT(*) AS count FROM programs').get().count);
    const districtCount = Number(db.prepare('SELECT COUNT(*) AS count FROM school_districts').get().count);

    if (stateCount >= 45 && countyCount >= 3000 && programCount >= 50 && districtCount >= 50) {
      console.log('• Keeping existing local dataset');
      return;
    }
  } finally {
    db.close();
  }

  const seedScripts = [
    'src/db/scrapers/countyRouterGenerator.js',
    'src/db/seed_florida_exhaustive.js',
    'src/db/seed_five_states.js',
  ];

  for (const script of seedScripts) {
    execFileSync(process.execPath, [path.join(repoRoot, script)], {
      cwd: repoRoot,
      stdio: 'inherit',
    });
  }

  console.log('• Seeded local demo dataset for county/state route QA');
}

console.log('Setting up local development workspace...');

ensureFrontendEnv();
dbFiles.forEach(ensureDbLink);
ensureHealthyNavigatorDb();
ensureLocalDbCompatibility();
maybeSeedLocalDemoDataset();

console.log('Local setup complete.');
