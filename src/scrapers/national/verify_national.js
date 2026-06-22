import { fork } from 'child_process';
import path from 'path';
import fs from 'fs';
import { parseArgs } from 'util';
import Database from 'better-sqlite3';

function validateCopaaRecord(record, expectedState) {
  if (!record.id || !/^copaa-[a-f0-9]{64}$/.test(record.id)) {
    throw new Error(`Invalid COPAA record ID format: ${record.id}`);
  }
  if (record.state !== expectedState) {
    throw new Error(`Expected state ${expectedState}, got ${record.state}`);
  }
  if (record.source !== 'copaa') {
    throw new Error(`Expected source 'copaa', got ${record.source}`);
  }
  if (!record.scraped_at || isNaN(Date.parse(record.scraped_at))) {
    throw new Error(`Invalid scraped_at timestamp: ${record.scraped_at}`);
  }
  if (!record.name) {
    throw new Error(`Missing name in COPAA record: ${record.id}`);
  }
  if (record.organization_info) {
    const org = record.organization_info;
    if (!org.id || !/^org-[a-f0-9]{64}$/.test(org.id)) {
      throw new Error(`Invalid COPAA organization ID format: ${org.id}`);
    }
    if (org.state !== expectedState) {
      throw new Error(`Expected organization state ${expectedState}, got ${org.state}`);
    }
    if (!org.name) {
      throw new Error(`Missing organization name in COPAA record: ${record.id}`);
    }
    if (org.source !== 'copaa') {
      throw new Error(`Expected organization source 'copaa', got ${org.source}`);
    }
    if (!org.scraped_at || isNaN(Date.parse(org.scraped_at))) {
      throw new Error(`Invalid organization scraped_at timestamp: ${org.scraped_at}`);
    }
  }
}

function validateWrightslawRecord(record, expectedState) {
  if (!record.id || !/^yp-[a-f0-9]{64}$/.test(record.id)) {
    throw new Error(`Invalid Wrightslaw record ID format: ${record.id}`);
  }
  if (record.state !== expectedState) {
    throw new Error(`Expected state ${expectedState}, got ${record.state}`);
  }
  if (record.source !== 'wrightslaw') {
    throw new Error(`Expected source 'wrightslaw', got ${record.source}`);
  }
  if (!record.scraped_at || isNaN(Date.parse(record.scraped_at))) {
    throw new Error(`Invalid scraped_at timestamp: ${record.scraped_at}`);
  }
  if (!record.name) {
    throw new Error(`Missing name in Wrightslaw record: ${record.id}`);
  }
  if (record.organization_info) {
    const org = record.organization_info;
    if (!org.id || !/^org-[a-f0-9]{64}$/.test(org.id)) {
      throw new Error(`Invalid Wrightslaw organization ID format: ${org.id}`);
    }
    if (org.state !== expectedState) {
      throw new Error(`Expected organization state ${expectedState}, got ${org.state}`);
    }
    if (!org.name) {
      throw new Error(`Missing organization name in Wrightslaw record: ${record.id}`);
    }
    if (org.source !== 'wrightslaw') {
      throw new Error(`Expected organization source 'wrightslaw', got ${org.source}`);
    }
    if (!org.scraped_at || isNaN(Date.parse(org.scraped_at))) {
      throw new Error(`Invalid organization scraped_at timestamp: ${org.scraped_at}`);
    }
  }
}

function validateJustiaRecord(record, expectedState) {
  if (!record.id || !/^justia-[a-f0-9]{64}$/.test(record.id)) {
    throw new Error(`Invalid Justia record ID format: ${record.id}`);
  }
  if (record.state !== expectedState) {
    throw new Error(`Expected state ${expectedState}, got ${record.state}`);
  }
  if (record.source !== 'justia') {
    throw new Error(`Expected source 'justia', got ${record.source}`);
  }
  if (!record.scraped_at || isNaN(Date.parse(record.scraped_at))) {
    throw new Error(`Invalid scraped_at timestamp: ${record.scraped_at}`);
  }
  if (!record.case_name) {
    throw new Error(`Missing case_name in Justia record: ${record.id}`);
  }
  if (!record.case_number) {
    throw new Error(`Missing case_number in Justia record: ${record.id}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.decision_date)) {
    throw new Error(`Invalid decision_date format (expected YYYY-MM-DD): ${record.decision_date}`);
  }
}

async function main() {
  const options = {
    env: { type: 'string' },
    limit: { type: 'string' },
    states: { type: 'string' },
    scrapers: { type: 'string' },
    'keep-db': { type: 'boolean' }
  };

  const { values } = parseArgs({ options, strict: false });
  const env = values.env || 'test';
  const limit = parseInt(values.limit !== undefined ? values.limit : '3', 10);
  const states = (values.states || 'NY,TX,FL').split(',').map(s => s.trim().toUpperCase());
  const scrapers = (values.scrapers || 'copaa,wrightslaw,justia').split(',').map(s => s.trim().toLowerCase());
  const keepDb = !!values['keep-db'];

  const SANDBOX_DIR = path.resolve(process.cwd(), 'verify_national_tmp');
  const RAW_DIR = path.join(SANDBOX_DIR, 'raw');
  const CHECKPOINT_DIR = path.join(SANDBOX_DIR, 'checkpoints');
  const DB_PATH = path.join(SANDBOX_DIR, 'national_special_needs.db');

  console.log(`[Verify] Initializing sandbox at ${SANDBOX_DIR}...`);
  if (fs.existsSync(SANDBOX_DIR)) {
    fs.rmSync(SANDBOX_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(SANDBOX_DIR, { recursive: true });
  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.mkdirSync(CHECKPOINT_DIR, { recursive: true });

  let serverProc = null;
  let port = null;

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    if (serverProc) {
      console.log('[Verify] Shutting down mock server...');
      try {
        serverProc.kill();
      } catch {
        // ignore
      }
      serverProc = null;
    }
    if (!keepDb) {
      console.log('[Verify] Cleaning up sandbox temporary directory...');
      if (fs.existsSync(SANDBOX_DIR)) {
        try {
          fs.rmSync(SANDBOX_DIR, { recursive: true, force: true });
        } catch {
          // ignore
        }
      }
    } else {
      console.log(`[Verify] --keep-db is set. Preserving sandbox temporary directory at ${SANDBOX_DIR}`);
    }
  };

  // Setup process exit/signal handlers
  process.on('exit', cleanup);
  const sigHandler = () => {
    cleanup();
    process.exit(1);
  };
  process.on('SIGINT', sigHandler);
  process.on('SIGTERM', sigHandler);

  try {
    if (env === 'test') {
      console.log('[Verify] Starting mock server in test environment...');
      const serverPath = path.resolve('tests/e2e/server/index.js');
      serverProc = fork(serverPath, [], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
      });

      port = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Mock server start timeout (10s)'));
        }, 10000);

        serverProc.on('message', (msg) => {
          if (msg && msg.port) {
            clearTimeout(timeout);
            resolve(msg.port);
          }
        });
        serverProc.on('error', (err) => {
          clearTimeout(timeout);
          reject(new Error(`Mock server process error: ${err.message}`));
        });
        serverProc.on('exit', (code) => {
          clearTimeout(timeout);
          if (code !== null && code !== 0) {
            reject(new Error(`Mock server exited prematurely with code ${code}`));
          }
        });
      });
      console.log(`[Verify] Mock server listening on port ${port}`);
    }

    const childEnv = {
      ...process.env,
      RAW_DIR,
      CHECKPOINT_DIR,
      DB_PATH,
      NODE_ENV: env
    };

    if (env === 'test') {
      childEnv.COPAA_BASE_URL = `http://localhost:${port}`;
      childEnv.WRIGHTSLAW_BASE_URL = `http://localhost:${port}`;
      childEnv.JUSTIA_BASE_URL = `http://localhost:${port}`;
    }

    // Run scraper files sequentially for the states
    for (const scraper of scrapers) {
      for (const state of states) {
        console.log(`[Verify] Running scraper '${scraper}' for state '${state}' with limit ${limit}...`);
        const scraperPath = path.resolve(`src/scrapers/national/${scraper}.js`);
        const code = await new Promise((resolve) => {
          const child = fork(scraperPath, ['--state', state, '--limit', String(limit)], {
            env: childEnv,
            stdio: 'inherit'
          });
          child.on('close', resolve);
        });
        if (code !== 0) {
          throw new Error(`Scraper ${scraper} for state ${state} failed with exit code ${code}`);
        }
      }
    }

    // Validate raw JSON files
    console.log('[Verify] Validating raw JSON files...');
    for (const scraper of scrapers) {
      for (const state of states) {
        const filePath = path.join(RAW_DIR, state, `${scraper}.json`);
        if (!fs.existsSync(filePath)) {
          throw new Error(`Expected JSON file does not exist: ${filePath}`);
        }

        const content = fs.readFileSync(filePath, 'utf8');
        let data;
        try {
          data = JSON.parse(content);
        } catch (err) {
          throw new Error(`JSON file is not well-formed: ${filePath}. Error: ${err.message}`, { cause: err });
        }

        if (!Array.isArray(data)) {
          throw new Error(`Expected JSON content to be an array in ${filePath}`);
        }

        console.log(`[Verify] Validating ${data.length} records in ${filePath}`);
        if (limit > 0 && data.length === 0) {
          throw new Error(`Expected non-empty array in ${filePath}`);
        }
        if (data.length > limit) {
          throw new Error(`Scraper exceeded limit of ${limit}: got ${data.length} in ${filePath}`);
        }

        for (const record of data) {
          if (scraper === 'copaa') {
            validateCopaaRecord(record, state);
          } else if (scraper === 'wrightslaw') {
            validateWrightslawRecord(record, state);
          } else if (scraper === 'justia') {
            validateJustiaRecord(record, state);
          }
        }
      }
    }
    console.log('[Verify] All JSON files are well-formed and valid.');

    // Run the DB pipeline script using the sandboxed database path DB_PATH and raw JSON path RAW_DIR
    console.log('[Verify] Running DB pipeline script...');
    const dbCode = await new Promise((resolve) => {
      const child = fork('src/scrapers/national/db.js', [], {
        env: childEnv,
        stdio: 'inherit'
      });
      child.on('close', resolve);
    });
    if (dbCode !== 0) {
      throw new Error(`DB pipeline script failed with exit code ${dbCode}`);
    }

    // Verify table schemas exist (advocates, attorneys, legal_decisions, organizations) and relational row counts are correct
    console.log(`[Verify] Connecting to SQLite database at ${DB_PATH}...`);
    const db = new Database(DB_PATH);
    try {
      const tables = ['advocates', 'attorneys', 'legal_decisions', 'organizations', 'school_districts'];
      for (const table of tables) {
        const row = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(table);
        if (!row) {
          throw new Error(`Table ${table} does not exist in database`);
        }
      }
      console.log('[Verify] All table schemas exist.');

      // Dynamic expected count calculation from raw JSONs
      let expectedAdvocates = 0;
      let expectedAttorneys = 0;
      let expectedOrganizations = 0;
      let expectedDecisions = 0;

      for (const scraper of scrapers) {
        for (const state of states) {
          const filePath = path.join(RAW_DIR, state, `${scraper}.json`);
          if (!fs.existsSync(filePath)) continue;
          const records = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (scraper === 'copaa') {
            expectedAdvocates += records.length;
            for (const r of records) {
              if (r.organization_info) {
                expectedOrganizations++;
              }
            }
          } else if (scraper === 'wrightslaw') {
            for (const r of records) {
              const isAttorney = (r.description && r.description.toLowerCase().includes('attorney')) ||
                                 (r.credentials && r.credentials.toLowerCase().includes('attorney'));
              if (isAttorney) {
                expectedAttorneys++;
                if (r.organization_info) {
                  expectedOrganizations++;
                }
              } else {
                expectedAdvocates++;
              }
            }
          } else if (scraper === 'justia') {
            expectedDecisions += records.length;
          }
        }
      }

      const actualAdvocates = db.prepare('SELECT COUNT(*) as count FROM advocates').get().count;
      const actualAttorneys = db.prepare('SELECT COUNT(*) as count FROM attorneys').get().count;
      const actualOrganizations = db.prepare('SELECT COUNT(*) as count FROM organizations').get().count;
      const actualDecisions = db.prepare('SELECT COUNT(*) as count FROM legal_decisions').get().count;

      console.log(`[Verify] Relational counts validation:`);
      console.log(`  - Advocates: expected ${expectedAdvocates}, got ${actualAdvocates}`);
      console.log(`  - Attorneys: expected ${expectedAttorneys}, got ${actualAttorneys}`);
      console.log(`  - Organizations: expected ${expectedOrganizations}, got ${actualOrganizations}`);
      console.log(`  - Legal Decisions: expected ${expectedDecisions}, got ${actualDecisions}`);

      if (actualAdvocates !== expectedAdvocates) {
        throw new Error(`Advocates count mismatch: expected ${expectedAdvocates}, got ${actualAdvocates}`);
      }
      if (actualAttorneys !== expectedAttorneys) {
        throw new Error(`Attorneys count mismatch: expected ${expectedAttorneys}, got ${actualAttorneys}`);
      }
      if (actualOrganizations !== expectedOrganizations) {
        throw new Error(`Organizations count mismatch: expected ${expectedOrganizations}, got ${actualOrganizations}`);
      }
      if (actualDecisions !== expectedDecisions) {
        throw new Error(`Legal Decisions count mismatch: expected ${expectedDecisions}, got ${actualDecisions}`);
      }
      console.log('[Verify] Relational row counts are correct.');

      // Validate that decisions are linked and outcome is populated
      const decisions = db.prepare('SELECT id, case_name, school_district_id, outcome FROM legal_decisions').all();
      for (const d of decisions) {
        if (!d.school_district_id) {
          throw new Error(`Decision ${d.id} (${d.case_name}) is missing school_district_id link.`);
        }
        if (!['parent_win', 'district_win'].includes(d.outcome)) {
          throw new Error(`Decision ${d.id} has unexpected outcome value: ${d.outcome}`);
        }
      }
      console.log('[Verify] All legal decisions correctly linked to school districts and outcomes.');

      const winLossStats = db.prepare(`
        SELECT 
          sd.name as district_name,
          sd.state as district_state,
          SUM(case when ld.outcome = 'parent_win' then 1 else 0 end) as parent_wins,
          SUM(case when ld.outcome = 'district_win' then 1 else 0 end) as district_wins,
          COUNT(*) as total_cases
        FROM school_districts sd
        JOIN legal_decisions ld ON sd.id = ld.school_district_id
        GROUP BY sd.id
      `).all();

      console.log('\n==================================================');
      console.log('[Verify] Legal Precedents - School District Win/Loss Rates:');
      for (const stat of winLossStats) {
        const parentWinRate = ((stat.parent_wins / stat.total_cases) * 100).toFixed(1);
        const districtWinRate = ((stat.district_wins / stat.total_cases) * 100).toFixed(1);
        console.log(`  * ${stat.district_name} (${stat.district_state}):`);
        console.log(`    Total cases: ${stat.total_cases}`);
        console.log(`    Parent Wins: ${stat.parent_wins} (${parentWinRate}%)`);
        console.log(`    District Wins: ${stat.district_wins} (${districtWinRate}%)`);
      }
      console.log('==================================================');

      // Re-run DB pipeline script a second time for idempotency check
      console.log('[Verify] Re-running DB pipeline for idempotency check...');
      const dbCode2 = await new Promise((resolve) => {
        const child = fork('src/scrapers/national/db.js', [], {
          env: childEnv,
          stdio: 'inherit'
        });
        child.on('close', resolve);
      });
      if (dbCode2 !== 0) {
        throw new Error(`DB pipeline second run failed with exit code ${dbCode2}`);
      }

      const actualAdvocates2 = db.prepare('SELECT COUNT(*) as count FROM advocates').get().count;
      const actualAttorneys2 = db.prepare('SELECT COUNT(*) as count FROM attorneys').get().count;
      const actualOrganizations2 = db.prepare('SELECT COUNT(*) as count FROM organizations').get().count;
      const actualDecisions2 = db.prepare('SELECT COUNT(*) as count FROM legal_decisions').get().count;

      if (actualAdvocates2 !== expectedAdvocates) {
        throw new Error(`Idempotency check failed: Advocates count changed to ${actualAdvocates2}`);
      }
      if (actualAttorneys2 !== expectedAttorneys) {
        throw new Error(`Idempotency check failed: Attorneys count changed to ${actualAttorneys2}`);
      }
      if (actualOrganizations2 !== expectedOrganizations) {
        throw new Error(`Idempotency check failed: Organizations count changed to ${actualOrganizations2}`);
      }
      if (actualDecisions2 !== expectedDecisions) {
        throw new Error(`Idempotency check failed: Legal Decisions count changed to ${actualDecisions2}`);
      }
      console.log('[Verify] Idempotency checks passed: row counts remained invariant.');

      // Output green status report
      console.log('\x1b[32m%s\x1b[0m', '\n==================================================');
      console.log('\x1b[32m%s\x1b[0m', '   NATIONAL SCRAPING AND DB PIPELINE VERIFIED SUCCESSFULLY!   ');
      console.log('\x1b[32m%s\x1b[0m', '==================================================');
      console.log('\x1b[32m%s\x1b[0m', `Environment: ${env}`);
      console.log('\x1b[32m%s\x1b[0m', `States run: ${states.join(', ')}`);
      console.log('\x1b[32m%s\x1b[0m', `Scrapers run: ${scrapers.join(', ')}`);
      console.log('\x1b[32m%s\x1b[0m', `Limit setting: ${limit}`);
      console.log('\x1b[32m%s\x1b[0m', `Database Path: ${DB_PATH}`);
      console.log('\x1b[32m%s\x1b[0m', `Raw data saved in sandbox under RAW_DIR: ${RAW_DIR}`);
      console.log('\x1b[32m%s\x1b[0m', `Row Counts:`);
      console.log('\x1b[32m%s\x1b[0m', `  - Advocates: ${expectedAdvocates}`);
      console.log('\x1b[32m%s\x1b[0m', `  - Attorneys: ${expectedAttorneys}`);
      console.log('\x1b[32m%s\x1b[0m', `  - Organizations: ${expectedOrganizations}`);
      console.log('\x1b[32m%s\x1b[0m', `  - Legal Decisions: ${expectedDecisions}`);
      console.log('\x1b[32m%s\x1b[0m', 'Status: GREEN (All tests passed cleanly)\n');

    } finally {
      db.close();
    }

  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', `\n[Verify] Verification failed: ${err.message}`);
    process.exitCode = 1;
  } finally {
    cleanup();
  }
}

main().catch((err) => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
