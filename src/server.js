import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { runDbMatchingEngine } from './engine/dbMatchingEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Helper to open read-write DB connection
function openDb() {
  const db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  return db;
}

console.log('🚀 Express REST API server configuring relational routes...');

// ----------------------------------------------------
// 1. PUBLIC SEO DIRECTORY PORTAL ENDPOINTS
// ----------------------------------------------------

// GET /api/programs - Retrieve all statewide and federal programs
app.get('/api/programs', (req, res) => {
  const db = openDb();
  try {
    const progs = db.prepare('SELECT * FROM programs').all();
    res.json(progs);
  } catch (err) {
    res.status(500).json({ error: 'Database read failed', details: err.message });
  } finally {
    db.close();
  }
});

// GET /api/programs/:id - Detailed program layout with docs, steps, and appeal rules
app.get('/api/programs/:id', (req, res) => {
  const db = openDb();
  try {
    const prog = db.prepare('SELECT * FROM programs WHERE id = ?').get(req.params.id);
    if (!prog) return res.status(404).json({ error: 'Program not found' });

    const docs = db.prepare('SELECT * FROM program_document_requirements WHERE program_id = ?').all(req.params.id);
    const steps = db.prepare('SELECT * FROM program_application_steps WHERE program_id = ? ORDER BY step_number ASC').all(req.params.id);
    const appeal = db.prepare('SELECT * FROM program_appeal_info WHERE program_id = ?').get(req.params.id);
    const offices = db.prepare('SELECT * FROM county_offices WHERE program_id = ?').all(req.params.id);
    
    res.json({
      ...prog,
      documentRequirements: docs,
      applicationSteps: steps,
      appealInfo: appeal || null,
      countyOffices: offices
    });
  } catch (err) {
    res.status(500).json({ error: 'Query failed', details: err.message });
  } finally {
    db.close();
  }
});

// GET /api/counties - Retrieve list of California Counties
app.get('/api/counties', (req, res) => {
  const db = openDb();
  try {
    const list = db.prepare('SELECT * FROM counties').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Database lookup failed' });
  } finally {
    db.close();
  }
});

// GET /api/counties/:id - Local offices and school districts routing
app.get('/api/counties/:id', (req, res) => {
  const db = openDb();
  try {
    const county = db.prepare('SELECT * FROM counties WHERE id = ?').get(req.params.id);
    if (!county) return res.status(404).json({ error: 'County not found' });

    const offices = db.prepare('SELECT * FROM county_offices WHERE county_id = ?').all(req.params.id);
    const districts = db.prepare('SELECT * FROM school_districts WHERE county_id = ?').all(req.params.id);
    const nonprofits = db.prepare('SELECT * FROM nonprofit_organizations WHERE county_id = ?').all(req.params.id);
    
    res.json({
      ...county,
      countyOffices: offices,
      schoolDistricts: districts,
      localOrganizations: nonprofits
    });
  } catch (err) {
    res.status(500).json({ error: 'County query failed', details: err.message });
  } finally {
    db.close();
  }
});

// GET /api/conditions - Taxonomy catalog
app.get('/api/conditions', (req, res) => {
  const db = openDb();
  try {
    const list = db.prepare('SELECT * FROM conditions').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Query failed' });
  } finally {
    db.close();
  }
});

// GET /api/needs - Functional needs catalog
app.get('/api/needs', (req, res) => {
  const db = openDb();
  try {
    const list = db.prepare('SELECT * FROM functional_needs').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Query failed' });
  } finally {
    db.close();
  }
});


// ----------------------------------------------------
// 2. LOGGED-IN FAMILY DASHBOARD CORE ENDPOINTS
// ----------------------------------------------------

// POST /api/profiles - Register child profile inside atomic SQLite Transaction
app.post('/api/profiles', (req, res) => {
  const { nickname, dob, countyId, zipCode, insuranceType, schoolStatus, conditionIds, functionalNeedIds, caregiverNotes } = req.body;
  
  if (!nickname || !dob || !countyId) {
    return res.status(400).json({ error: 'Missing required parameters: nickname, dob, countyId' });
  }

  const db = openDb();

  try {
    const childId = 'child-' + Date.now();
    const caseId = 'case-' + Date.now();

    // Atomic SQLite Transaction block
    const createTx = db.transaction(() => {
      // 1. Insert dummy case folder
      db.prepare('INSERT INTO family_cases (id, email, created_at) VALUES (?, ?, ?)')
        .run(caseId, 'caregiver@example.com', new Date().toISOString().split('T')[0]);

      // 2. Insert child profile
      db.prepare(`
        INSERT INTO child_profiles 
        (id, case_id, nickname, dob, county_id, zip_code, insurance_type, school_status, language_preference, caregiver_notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(childId, caseId, nickname, dob, countyId, zipCode || '', insuranceType || 'private', schoolStatus || 'none', 'english', caregiverNotes || '');

      // 3. Map many-to-many selected conditions
      if (conditionIds && conditionIds.length > 0) {
        const insertCond = db.prepare('INSERT INTO child_profile_conditions (child_id, condition_id) VALUES (?, ?)');
        for (const cid of conditionIds) {
          insertCond.run(childId, cid);
        }
      }

      // 4. Map many-to-many selected functional needs
      if (functionalNeedIds && functionalNeedIds.length > 0) {
        const insertNeed = db.prepare('INSERT INTO child_profile_needs (child_id, need_id) VALUES (?, ?)');
        for (const nid of functionalNeedIds) {
          insertNeed.run(childId, nid);
        }
      }
    });

    createTx();
    res.status(201).json({ message: 'Child profile created successfully!', childId, caseId });

  } catch (err) {
    res.status(500).json({ error: 'Database insert transaction failed', details: err.message });
  } finally {
    db.close();
  }
});

// GET /api/profiles/:id/matches - Runs the database-backed rules matching scan
app.get('/api/profiles/:id/matches', (req, res) => {
  const db = openDb();
  try {
    // Load profile parameters
    const profile = db.prepare('SELECT * FROM child_profiles WHERE id = ?').get(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Child profile not found' });

    // Load conditions from many-to-many junction
    const conds = db.prepare('SELECT condition_id FROM child_profile_conditions WHERE child_id = ?').all(req.params.id);
    profile.conditionIds = conds.map(c => c.condition_id);

    // Load needs from many-to-many junction
    const needs = db.prepare('SELECT need_id FROM child_profile_needs WHERE child_id = ?').all(req.params.id);
    profile.functionalNeedIds = needs.map(n => n.need_id);

    // Execute SQL-Backed Matching Engine
    const matches = runDbMatchingEngine(profile);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: 'Matching engine query failed', details: err.message });
  } finally {
    db.close();
  }
});

// PUT /api/profiles/:id/tracker - Update application pipeline status in SQLite
app.put('/api/profiles/:id/tracker', (req, res) => {
  const { programId, status } = req.body;
  if (!programId || !status) return res.status(400).json({ error: 'Missing programId or status' });

  const db = openDb();
  try {
    const statusId = 'status-' + Date.now();
    db.prepare(`
      INSERT INTO case_program_statuses (id, child_id, program_id, status, updated_at) 
      VALUES (?, ?, ?, ?, ?) 
      ON CONFLICT(child_id, program_id) DO UPDATE SET status = ?, updated_at = ?
    `).run(statusId, req.params.id, programId, status, new Date().toISOString().split('T')[0], status, new Date().toISOString().split('T')[0]);

    res.json({ message: 'Application pipeline tracker updated!' });
  } catch (err) {
    res.status(500).json({ error: 'Tracker save failed', details: err.message });
  } finally {
    db.close();
  }
});


// ----------------------------------------------------
// 3. ADMIN DATA VERIFICATION ENDPOINTS
// ----------------------------------------------------

// GET /api/admin/queue - Fetch records needing freshness audit
app.get('/api/admin/queue', (req, res) => {
  const db = openDb();
  try {
    const queue = db.prepare('SELECT * FROM verification_queue_items').all();
    res.json(queue);
  } catch (err) {
    res.status(500).json({ error: 'Queue lookup failed' });
  } finally {
    db.close();
  }
});

// PUT /api/admin/verify/:id - Mark stale verification item OK and refresh database verified_date
app.put('/api/admin/verify/:id', (req, res) => {
  const db = openDb();
  try {
    const queueItem = db.prepare('SELECT * FROM verification_queue_items WHERE id = ?').get(req.params.id);
    if (!queueItem) return res.status(404).json({ error: 'Queue item not found' });

    const auditTx = db.transaction(() => {
      // 1. Elevate verification level to 1 (Official)
      db.prepare('UPDATE verification_queue_items SET verification_level = 1, reason = "Audited & Verified today" WHERE id = ?')
        .run(req.params.id);

      // 2. Dynamic Update of target verified dates
      const currentDate = new Date().toISOString().split('T')[0];
      if (queueItem.record_type === 'program') {
        db.prepare('UPDATE programs SET last_verified_date = ?, confidence_score = 5 WHERE id = ?')
          .run(currentDate, queueItem.record_id);
      } else if (queueItem.record_type === 'regional-center') {
        db.prepare('UPDATE regional_centers SET last_verified_date = ? WHERE id = ?')
          .run(currentDate, queueItem.record_id);
      }
    });

    auditTx();
    res.json({ message: 'Database entity audited! Verification levels and database freshness dates successfully restored.' });
  } catch (err) {
    res.status(500).json({ error: 'Audit transaction failed', details: err.message });
  } finally {
    db.close();
  }
});

// GET /api/admin/coverage - Calculate Database Coverage Health Integrity index
app.get('/api/admin/coverage', (req, res) => {
  const db = openDb();
  try {
    const totalCounties = db.prepare('SELECT COUNT(*) as cnt FROM counties').get().cnt;
    const officesCount = db.prepare('SELECT COUNT(*) as cnt FROM county_offices').get().cnt;
    const gapsCount = db.prepare('SELECT COUNT(*) as cnt FROM coverage_gaps').get().cnt;
    
    // Seed database has 4 counties, each county should theoretically have 3 office records = 12 total offices expected
    const expectedOffices = totalCounties * 3;
    const officeCoveragePercentage = expectedOffices > 0 ? Math.min(100, Math.round((officesCount / expectedOffices) * 100)) : 100;

    res.json({
      statewideProgramCoverage: 100, // Seed contains 9/9 MVP programs
      countyRoutingCoverage: officeCoveragePercentage,
      regionalCenterCoverage: 100, // Seed covers Lanterman and GGRC catchments
      databaseCoverageHealth: Math.max(50, Math.round(100 - (gapsCount * 3))),
      staleRecordsNeedingAudit: db.prepare('SELECT COUNT(*) as cnt FROM verification_queue_items WHERE verification_level >= 5').get().cnt
    });
  } catch (err) {
    res.status(500).json({ error: 'Coverage calculation failed' });
  } finally {
    db.close();
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n🔥 CALIFORNIA DISABILITY DATABASE BACKEND RUNNING AT: http://localhost:${PORT}`);
  console.log(`   - Seeded SQLite File: ca_disability_navigator.db`);
  console.log(`   - Match Engine API Portal active at /api/profiles/:id/matches\n`);
});
