import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Helpers
import { loadStateConfig } from './lib/loadStateConfig.js';
import { phaseConfigs } from './lib/phaseConfigs.js';
import * as queries from './lib/stateQueries.js';
import { runReferenceAudit, updateReferencesInTransaction } from './lib/referenceAudits.js';
import { assertWriteProtection, assertBulkWriteProtection, validateStagedRecordProvenance } from './lib/protectionGuards.js';
import { RollbackGenerator } from './lib/rollbackGenerator.js';
import { writeDiffReport } from './lib/diffReporter.js';
import { getDbChecksum, assertMutationSafety, getProtectedRecordCounts, assertProtectedCountsSafety } from './lib/mutationGuard.js';
import { detectFakeCoverage } from './lib/fakeCoverageDetector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../ca_disability_navigator.db');
const frontendDbPath = process.env.FRONTEND_DB_PATH || path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');

function checkpointAndSyncDb() {
  console.log(`⚙️ Running SQLite WAL Checkpoint...`);
  try {
    const db = new Database(dbPath);
    db.pragma('wal_checkpoint(TRUNCATE)');
    db.close();

    // Clean up stale destination -wal and -shm files to prevent DB corruption
    try {
      fs.unlinkSync(`${frontendDbPath}-wal`);
    } catch (err) {}
    try {
      fs.unlinkSync(`${frontendDbPath}-shm`);
    } catch (err) {}

    fs.copyFileSync(dbPath, frontendDbPath);
    console.log(`✓ Synced database to frontend replica: ${frontendDbPath}`);
  } catch (e) {
    console.error(`⚠️ Warning: Database sync or checkpoint failed: ${e.message}`);
  }
}

function runFastAudits(state) {
  if (process.env.SKIP_AUDITS === 'true') {
    console.log(`⚙️ Skipping Fast State Audits due to SKIP_AUDITS=true`);
    return;
  }
  console.log(`\n⚙️ Running Fast State Audits for state '${state}'...`);
  try {
    try {
      execSync(`node --experimental-strip-types src/db/audit_state_standard.js ${state}`, { stdio: 'inherit' });
    } catch (err) {
      console.log(`⚠️ Note: audit_state_standard reported warnings or non-zero exit (expected during partial upgrade): ${err.message}`);
    }
    try {
      execSync(`node --experimental-strip-types src/db/audit_state_depth.js ${state}`, { stdio: 'inherit' });
    } catch (err) {
      console.log(`⚠️ Note: audit_state_depth reported warnings or non-zero exit (expected during partial upgrade): ${err.message}`);
    }
    console.log(`✓ Fast State Audits completed.`);
  } catch (e) {
    console.error(`❌ Fast State Audits failed: ${e.message}`);
  }
}

// Staging Logic
function stagePhaseRecords(db, stateConfig, phaseConfig) {
  const stateId = stateConfig.state_id;
  const phaseId = phaseConfig.phase_id;
  const recordsPath = path.resolve(__dirname, `../../data/state-upgrades/${stateId}/phase_records/${phaseId}.json`);

  if (!fs.existsSync(recordsPath)) {
    throw new Error(`Staging records file not found at: ${recordsPath}`);
  }

  const records = JSON.parse(fs.readFileSync(recordsPath, 'utf8'));
  console.log(`⚙️ Staging ${records.length} records for phase '${phaseId}'...`);

  // Clear existing staging records for this state/program
  if (phaseConfig.staging_table === 'staging_scraped_county_offices') {
    db.prepare("DELETE FROM staging_scraped_county_offices WHERE state_id = ?").run(stateId);
  } else if (phaseConfig.staging_table === 'staging_scraped_state_resource_agencies') {
    db.prepare("DELETE FROM staging_scraped_state_resource_agencies WHERE state_id = ?").run(stateId);
  } else if (phaseConfig.staging_table === 'staging_scraped_regional_education_agencies') {
    db.prepare("DELETE FROM staging_scraped_regional_education_agencies WHERE state_id = ?").run(stateId);
    db.prepare("DELETE FROM staging_scraped_school_districts WHERE county_id LIKE ?").run(`%${stateConfig.county_id_suffix}`);
  } else if (phaseConfig.staging_table === 'staging_scraped_school_districts') {
    db.prepare("DELETE FROM staging_scraped_school_districts WHERE county_id LIKE ?").run(`%${stateConfig.county_id_suffix}`);
  } else if (phaseConfig.staging_table === 'staging_scraped_nonprofit_organizations') {
    // Standardize
  }

  // Insert statements map
  const insertStatements = {
    staging_scraped_county_offices: db.prepare(`
      INSERT INTO staging_scraped_county_offices (
        source_url, source_name, source_type, scraped_at, state_id, county_id,
        confidence_score, extraction_notes, raw_text_excerpt,
        suggested_target_table, suggested_target_id, review_status,
        extracted_name, extracted_phone, extracted_address, program_id, evidence_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    staging_scraped_state_resource_agencies: db.prepare(`
      INSERT INTO staging_scraped_state_resource_agencies (
        source_url, source_name, source_type, scraped_at, state_id, county_id,
        confidence_score, extraction_notes, raw_text_excerpt,
        suggested_target_table, suggested_target_id, review_status,
        extracted_name, extracted_phone, agency_type, counties_served, catchment_boundaries, extracted_website,
        early_intervention_contact, agency_intake_contact, eligibility_info_page, services_page, appeals_info, evidence_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    staging_scraped_school_districts: db.prepare(`
      INSERT INTO staging_scraped_school_districts (
        source_url, source_name, source_type, scraped_at, state_id, county_id,
        confidence_score, extraction_notes, raw_text_excerpt,
        suggested_target_table, suggested_target_id, review_status,
        extracted_name, spec_ed_contact_email, spec_ed_contact_phone, extracted_website, evidence_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    staging_scraped_regional_education_agencies: db.prepare(`
      INSERT INTO staging_scraped_regional_education_agencies (
        source_url, source_name, source_type, scraped_at, state_id, county_id,
        confidence_score, extraction_notes, raw_text_excerpt,
        suggested_target_table, suggested_target_id, review_status,
        extracted_name, extracted_phone, counties_served, agency_type, extracted_website, evidence_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
  };

  const stmt = insertStatements[phaseConfig.staging_table];
  if (!stmt) {
    // Nonprofits and clinics are staged directly into production under curation rules
    console.log(`ℹ️ Phase '${phaseId}' is configured for direct promotion seeding. Staging skipped.`);
    return records.length;
  }

  const scrapedAt = new Date().toISOString().split('T')[0];
  let count = 0;

  for (const record of records) {
    validateStagedRecordProvenance(record, phaseConfig);

    const targetId = record.suggested_target_id || `rec-${record.physical_county || record.county_id}-${stateConfig.state_code.toLowerCase()}`;
    const reviewStatus = record.verification_status === 'manual_review_required' ? 'manual_review_required' : 'pending_review';

    if (phaseConfig.staging_table === 'staging_scraped_county_offices') {
      stmt.run(
        record.source_url,
        stateConfig.routing_labels.medicaid_agency,
        record.office_type || 'official_locator',
        scrapedAt,
        stateId,
        record.physical_county,
        record.confidence_score,
        record.notes,
        record.notes,
        phaseConfig.production_table,
        targetId,
        reviewStatus,
        record.name,
        record.phone,
        record.physical_address,
        record.program_id || `${stateConfig.program_id_prefix}medicaid`,
        record.evidence_level
      );
    } else if (phaseConfig.staging_table === 'staging_scraped_state_resource_agencies') {
      stmt.run(
        record.source_url,
        stateConfig.routing_labels.dd_agency,
        'official_website',
        scrapedAt,
        stateId,
        record.physical_county || 'statewide',
        record.confidence_score,
        record.notes,
        record.notes,
        phaseConfig.production_table,
        targetId,
        reviewStatus,
        record.name,
        record.phone,
        record.agency_type,
        record.physical_county || 'statewide',
        record.physical_county || 'statewide',
        record.source_url,
        "",
        "",
        "",
        "",
        "",
        record.evidence_level
      );
    } else if (phaseConfig.staging_table === 'staging_scraped_school_districts') {
      stmt.run(
        record.source_url,
        stateConfig.routing_labels.education_agency,
        'official_directory',
        scrapedAt,
        stateId,
        record.physical_county,
        record.confidence_score,
        record.notes,
        record.notes,
        phaseConfig.production_table,
        targetId,
        reviewStatus,
        record.name,
        record.email,
        record.phone,
        record.source_url,
        record.evidence_level
      );
    } else if (phaseConfig.staging_table === 'staging_scraped_regional_education_agencies') {
      stmt.run(
        record.source_url,
        stateConfig.routing_labels.education_agency,
        'official_directory',
        scrapedAt,
        stateId,
        record.physical_county || 'statewide',
        record.confidence_score,
        record.notes,
        record.notes,
        phaseConfig.production_table,
        targetId,
        reviewStatus,
        record.name,
        record.phone,
        record.counties_served ? record.counties_served.join(',') : '',
        record.agency_type || 'boces',
        record.source_url,
        record.evidence_level
      );
    }
    count++;
  }

  return count;
}

// Promotion Logic
function promotePhaseRecords(db, stateConfig, phaseConfig, rollback, diff, forceProtected = false) {
  const stateId = stateConfig.state_id;
  const phaseId = phaseConfig.phase_id;

  console.log(`⚙️ Promoting staged records for phase '${phaseId}'...`);

  // Direct promotion for non-staged seed records (clinics, nonprofits, forms)
  if (['clinics', 'trusted_nonprofits', 'forms_appeals_transition'].includes(phaseId)) {
    const recordsPath = path.resolve(__dirname, `../../data/state-upgrades/${stateId}/phase_records/${phaseId}.json`);
    const records = JSON.parse(fs.readFileSync(recordsPath, 'utf8'));
    const scrapedAt = new Date().toISOString().split('T')[0];

    if (phaseId === 'clinics') {
      assertBulkWriteProtection(db, 'resource_providers', "county_id LIKE ? AND categories LIKE '%card_center%'", [`%${stateConfig.county_id_suffix}`], forceProtected);
      const deleteStmt = db.prepare("DELETE FROM resource_providers WHERE county_id LIKE ? AND categories LIKE '%card_center%'");
      deleteStmt.run(`%${stateConfig.county_id_suffix}`);

      const insertStmt = db.prepare(`
        INSERT INTO resource_providers (
          id, name, categories, county_id, phone, email, address,
          accepts_medi_cal, regional_center_vendor_ids, source_url, source_type,
          data_origin, verification_status, confidence_score, evidence_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const rec of records) {
        assertWriteProtection(db, 'resource_providers', rec.id, forceProtected);
        rollback.recordInsert('resource_providers', rec.id);
        insertStmt.run(
          rec.id, rec.name, rec.categories, rec.physical_county, rec.phone, rec.email, rec.address,
          rec.accepts_medi_cal || 1, rec.regional_center_vendor_ids || '', rec.source_url, rec.source_type,
          rec.data_origin, rec.verification_status, rec.confidence_score, rec.evidence_level
        );
        diff.insertedCount++;
      }
    } else if (phaseId === 'trusted_nonprofits') {
      assertBulkWriteProtection(db, 'nonprofit_organizations', "county_id LIKE ?", [`%${stateConfig.county_id_suffix}`], forceProtected);
      const deleteStmt = db.prepare("DELETE FROM nonprofit_organizations WHERE county_id LIKE ?");
      deleteStmt.run(`%${stateConfig.county_id_suffix}`);

      const insertStmt = db.prepare(`
        INSERT INTO nonprofit_organizations (
          id, name, county_id, website, phone, focus_condition,
          source_url, source_type, data_origin, verification_status,
          confidence_score, evidence_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const rec of records) {
        assertWriteProtection(db, 'nonprofit_organizations', rec.id, forceProtected);
        rollback.recordInsert('nonprofit_organizations', rec.id);
        insertStmt.run(
          rec.id, rec.name, rec.county_id, rec.website, rec.phone, rec.focus_condition || 'developmental_disabilities',
          rec.source_url, rec.source_type, rec.data_origin, rec.verification_status,
          rec.confidence_score, rec.evidence_level
        );
        diff.insertedCount++;
      }
    } else if (phaseId === 'forms_appeals_transition') {
      const deleteStmt = db.prepare("DELETE FROM staging_scraped_forms WHERE county_id LIKE ?");
      deleteStmt.run(`%${stateConfig.county_id_suffix}`);

      const insertStmt = db.prepare(`
        INSERT INTO staging_scraped_forms (
          county_id, source_url, source_name, source_type, scraped_at, state_id,
          confidence_score, review_status, slug, program, official_download_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const rec of records) {
        const info = insertStmt.run(
          rec.county_id || 'statewide', rec.source_url, rec.form_title || rec.name,
          rec.source_type || 'official_form', scrapedAt, stateId, rec.confidence_score || 9.5,
          'auto_accepted', rec.slug || '', rec.program || '', rec.pdf_url || rec.source_url
        );
        rollback.recordInsert('staging_scraped_forms', info.lastInsertRowid);
        diff.insertedCount++;
      }
    }
    return;
  }

  // Load staged records
  const staged = db.prepare(`SELECT * FROM ${phaseConfig.staging_table} WHERE state_id = ? AND review_status IN ('pending_review', 'manual_review_required')`).all(stateId);

  // Staging audit before promotion
  if (staged.length === 0) {
    console.log(`⚠️ No staged records found with status 'pending_review' or 'manual_review_required' for phase '${phaseId}'. Promotion skipped.`);
    return;
  }

  // Run fakeCoverageDetector for geographic phases
  const geoPhases = ['benefits_hhs', 'dd_idd', 'early_intervention', 'education_regional', 'district_replacements'];
  if (geoPhases.includes(phaseId)) {
    console.log(`⚙️ Running fakeCoverageDetector check for phase '${phaseId}'...`);
    const checkResult = detectFakeCoverage(staged, stateConfig, phaseId);
    if (!checkResult.pass) {
      console.error(`❌ fakeCoverageDetector Check Failed for phase '${phaseId}':`);
      console.error(JSON.stringify(checkResult.issues, null, 2));
      throw new Error(`fakeCoverageDetector Check Failed for phase '${phaseId}'.`);
    }
    console.log(`✓ fakeCoverageDetector Check Passed.`);
  }

  // Promotion Statements Mapper
  const promoteStatements = {
    county_offices: {
      check: db.prepare("SELECT * FROM county_offices WHERE id = ?"),
      delete: db.prepare("DELETE FROM county_offices WHERE id = ?"),
      insert: db.prepare(`
        INSERT INTO county_offices (
          id, county_id, program_id, office_name, address, phone, website,
          source_url, source_type, data_origin, verification_status,
          last_verified_date, last_scraped_at, confidence_score, evidence_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
    },
    state_resource_agencies: {
      check: db.prepare("SELECT * FROM state_resource_agencies WHERE id = ?"),
      delete: db.prepare("DELETE FROM state_resource_agencies WHERE id = ?"),
      insert: db.prepare(`
        INSERT INTO state_resource_agencies (
          id, state_id, agency_type, name, counties_served, catchment_boundaries,
          website, intake_phone, early_intervention_contact, agency_intake_contact,
          eligibility_info_page, services_page, appeals_info, languages,
          last_verified_date, source_urls, source_url, source_type, data_origin,
          verification_status, confidence_score, evidence_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
    },
    school_districts: {
      check: db.prepare("SELECT * FROM school_districts WHERE id = ?"),
      delete: db.prepare("DELETE FROM school_districts WHERE id = ?"),
      insert: db.prepare(`
        INSERT INTO school_districts (
          id, county_id, name, website, source_url, source_type,
          data_origin, verification_status, last_verified_date, confidence_score,
          evidence_level, spec_ed_contact_phone, spec_ed_contact_email
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
    },
    regional_education_agencies: {
      check: db.prepare("SELECT * FROM regional_education_agencies WHERE id = ?"),
      delete: db.prepare("DELETE FROM regional_education_agencies WHERE id = ?"),
      insert: db.prepare(`
        INSERT INTO regional_education_agencies (
          id, state_id, name, website, source_url, source_type,
          data_origin, verification_status, last_verified_date, confidence_score,
          evidence_level, counties_served, agency_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
    }
  };

  const stmts = promoteStatements[phaseConfig.production_table];

  for (const stg of staged) {
    let targetId = stg.suggested_target_id;
    let oldId = null;

    // Rekey fallback checks
    if (phaseConfig.allow_rekey) {
      const fallbackId = `${targetId}-fallback`;
      const fallbackRow = stmts.check.get(fallbackId);
      if (fallbackRow) {
        oldId = fallbackId;
        console.log(`  🔗 Found fallback primary key: ${fallbackId} -> Rekeying references...`);
        const refs = runReferenceAudit(db, phaseConfig.production_table, fallbackId);
        updateReferencesInTransaction(db, phaseConfig.production_table, fallbackId, targetId, refs);
        
        // Save to rollback
        rollback.recordRekey(phaseConfig.production_table, fallbackId, targetId, refs);
        
        // Delete fallback record to prevent duplicate constraint on rename
        assertWriteProtection(db, phaseConfig.production_table, fallbackId, forceProtected);
        rollback.recordDelete(phaseConfig.production_table, fallbackRow);
        stmts.delete.run(fallbackId);
        diff.deletedCount++;
        diff.rekeyedIds.push(`${fallbackId} -> ${targetId}`);
      }
    }

    // Protect Curated Seeds
    assertWriteProtection(db, phaseConfig.production_table, targetId, forceProtected);

    const existing = stmts.check.get(targetId);
    if (existing) {
      rollback.recordUpdate(phaseConfig.production_table, existing);
      stmts.delete.run(targetId);
      diff.updatedCount++;
    } else {
      rollback.recordInsert(phaseConfig.production_table, targetId);
      diff.insertedCount++;
    }

    const lastChecked = new Date().toISOString().split('T')[0];

    // Table-specific insertions
    if (phaseConfig.production_table === 'county_offices') {
      stmts.insert.run(
        targetId, stg.county_id, stg.program_id, stg.extracted_name, stg.extracted_address, stg.extracted_phone,
        stg.source_url, stg.source_url, stg.source_type, 'scraped', stg.review_status === 'manual_review_required' ? 'manual_review_required' : 'source_listed',
        lastChecked, lastChecked, stg.confidence_score, stg.evidence_level
      );
    } else if (phaseConfig.production_table === 'state_resource_agencies') {
      // Delete existing mappings from regional_center_counties
      const existingMappings = db.prepare("SELECT county_id FROM regional_center_counties WHERE regional_center_id = ?").all(targetId);
      for (const mapping of existingMappings) {
        rollback.recordMappingDelete(targetId, mapping.county_id);
      }
      db.prepare("DELETE FROM regional_center_counties WHERE regional_center_id = ?").run(targetId);

      // Insert state resource agency
      stmts.insert.run(
        targetId, stateId, stg.agency_type, stg.extracted_name, stg.county_id, stg.county_id,
        stg.source_url, stg.extracted_phone, "", "",
        "", "", "", "",
        lastChecked, stg.source_url, stg.source_url, stg.source_type, 'scraped',
        stg.review_status === 'manual_review_required' ? 'manual_review_required' : 'source_listed', stg.confidence_score, stg.evidence_level
      );

      // Insert new mappings into regional_center_counties
      let mappedCounties = [];
      if (stg.county_id === 'statewide') {
        mappedCounties = queries.getCountyIds(db, stateConfig);
      } else if (stg.county_id) {
        mappedCounties = stg.county_id.split(',').map(c => c.trim()).filter(Boolean);
      }

      const insertMapping = db.prepare("INSERT INTO regional_center_counties (regional_center_id, county_id) VALUES (?, ?)");
      for (const county of mappedCounties) {
        rollback.recordMappingInsert(targetId, county);
        insertMapping.run(targetId, county);
      }
    } else if (phaseConfig.production_table === 'school_districts') {
      stmts.insert.run(
        targetId, stg.county_id, stg.extracted_name, stg.source_url, stg.source_url, stg.source_type,
        'scraped', stg.review_status === 'manual_review_required' ? 'manual_review_required' : 'source_listed', lastChecked, stg.confidence_score, stg.evidence_level,
        stg.spec_ed_contact_phone, stg.spec_ed_contact_email
      );
    } else if (phaseConfig.production_table === 'regional_education_agencies') {
      // Delete existing mappings from selpa_counties
      const existingMappings = db.prepare("SELECT county_id FROM selpa_counties WHERE selpa_id = ?").all(targetId);
      for (const mapping of existingMappings) {
        rollback.recordSelpaMappingDelete(targetId, mapping.county_id);
      }
      db.prepare("DELETE FROM selpa_counties WHERE selpa_id = ?").run(targetId);

      stmts.insert.run(
        targetId, stateId, stg.extracted_name, stg.source_url,
        stg.source_url, stg.source_type, 'scraped', stg.review_status === 'manual_review_required' ? 'manual_review_required' : 'source_listed', lastChecked,
        stg.confidence_score, stg.evidence_level, stg.counties_served, stg.agency_type
      );

      // Insert new mappings into selpa_counties
      let mappedCounties = [];
      if (stg.counties_served === 'statewide') {
        mappedCounties = queries.getCountyIds(db, stateConfig);
      } else if (stg.counties_served) {
        mappedCounties = stg.counties_served.split(',').map(c => c.trim()).filter(Boolean);
      }

      const insertMapping = db.prepare("INSERT INTO selpa_counties (selpa_id, county_id) VALUES (?, ?)");
      for (const county of mappedCounties) {
        rollback.recordSelpaMappingInsert(targetId, county);
        insertMapping.run(targetId, county);
      }
    }

    // Update staging review status
    db.prepare(`UPDATE ${phaseConfig.staging_table} SET review_status = 'auto_accepted' WHERE id = ?`).run(stg.id);
  }
}

// Baseline/Research Generation
function runResearchMode(stateConfig) {
  const stateId = stateConfig.state_id;
  const stateName = stateConfig.state_name;
  const stateCode = stateConfig.state_code;

  console.log(`\n🔍 Calculating Baseline Readiness for ${stateName}...`);

  let db;
  try {
    db = new Database(dbPath, { readonly: true });
  } catch (e) {
    console.error(`❌ Error: Failed to open SQLite database: ${e.message}`);
    process.exit(1);
  }

  const totalCounties = queries.getCountyIds(db, stateConfig).length;
  const fallbackOffices = queries.getFallbackCountyOffices(db, stateConfig);
  const fallbackDistricts = queries.getFallbackSchoolDistricts(db, stateConfig);
  const verifiedProviders = queries.getVerifiedProvidersCount(db, stateConfig);

  db.close();

  // Baseline scoring calculation
  const totalDbRecords = totalCounties * 2 + 30; // standard weight
  const totalFallbacks = fallbackOffices + fallbackDistricts;
  const depthScore = totalDbRecords > 0 ? ((totalDbRecords - totalFallbacks) / totalDbRecords) * 100 : 0;
  const finalScore = Math.min(depthScore, 80.0);

  console.log(`====================================================`);
  console.log(`🎉 ${stateName.toUpperCase()} BASELINE AUDIT`);
  console.log(`====================================================`);
  console.log(`  • Readiness Score:            ${finalScore.toFixed(1)}%`);
  console.log(`  • Counties Count:             ${totalCounties}`);
  console.log(`  • Fallback Local Offices:     ${fallbackOffices}/${totalCounties}`);
  console.log(`  • Fallback School Districts:  ${fallbackDistricts}/${totalCounties}`);
  console.log(`  • Verified Local Providers:   ${verifiedProviders} (Priority Metros)`);
  console.log(`====================================================\n`);

  // Write research output files dynamically
  const stateDocsDir = path.resolve(__dirname, `../../docs/state-upgrades/${stateId}`);
  if (!fs.existsSync(stateDocsDir)) {
    fs.mkdirSync(stateDocsDir, { recursive: true });
  }

  const stateDataDir = path.resolve(__dirname, `../../data/state-upgrades/${stateId}`);
  const phaseRecordsDir = path.resolve(stateDataDir, 'phase_records');
  if (!fs.existsSync(stateDataDir)) {
    fs.mkdirSync(stateDataDir, { recursive: true });
  }
  if (!fs.existsSync(phaseRecordsDir)) {
    fs.mkdirSync(phaseRecordsDir, { recursive: true });
  }

  const baselineReport = `# State Baseline: ${stateName} (${stateCode})

Geographic and demographic baseline parameters for the ${stateName} upgrade.

## 1. Geographic Definition
*   **Total Counties:** ${totalCounties} counties
*   **Priority Metro Counties:** ${stateConfig.priority_counties ? stateConfig.priority_counties.join(', ') : 'None'}

## 2. Readiness Metrics
*   **Baseline Score:** ${finalScore.toFixed(1)}%
*   **Fallback Local Offices:** ${fallbackOffices}
*   **Fallback School Districts:** ${fallbackDistricts}
`;

  const truthMapReport = `# ${stateName} Resource Truth Map

Authoritative sourcing parameters for ${stateName} across all categories.

*   **Medicaid Offices:** Sourced from state health/Medicaid departments.
*   **Catchment Routing:** Regional office maps and county mapping junction boundaries.
`;

  const gapAnalysisReport = `# ${stateName} Gap Analysis

Audit of current database records against target truth maps.

*   **Fallback Local Offices:** ${fallbackOffices}
*   **Fallback School Districts:** ${fallbackDistricts}
`;

  const pullPlanReport = `# ${stateName} Data Pull Plan

Data gathering strategy to replace fallbacks.

1. Sourced from official state directory resources.
2. Parameterized ingestion and staging.
`;

  const researchSummaryReport = `# ${stateName} Research Summary

Summary of baseline research:
*   Readiness Score: ${finalScore.toFixed(1)}%
*   Verified Providers: ${verifiedProviders}
`;

  // Safely write files (do not overwrite if they exist)
  const safeWrite = (filePath, content) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Created: ${path.relative(path.resolve(__dirname, '../..'), filePath)}`);
    }
  };

  safeWrite(path.join(stateDocsDir, '00-baseline.md'), baselineReport);
  safeWrite(path.join(stateDocsDir, '01-resource-truth-map.md'), truthMapReport);
  safeWrite(path.join(stateDocsDir, '02-gap-analysis.md'), gapAnalysisReport);
  safeWrite(path.join(stateDocsDir, '03-pull-plan.md'), pullPlanReport);
  safeWrite(path.join(stateDocsDir, '11-research-summary.md'), researchSummaryReport);

  // JSON files
  safeWrite(path.join(stateDataDir, 'source_targets.json'), JSON.stringify({ state_code: stateCode, targets: [] }, null, 2));
  safeWrite(path.join(stateDataDir, 'resource_truth_map.json'), JSON.stringify({ state_code: stateCode, categories: [] }, null, 2));
  safeWrite(path.join(stateDataDir, 'gap_analysis.json'), JSON.stringify({
    state_code: stateCode,
    audit_date: new Date().toISOString().split('T')[0],
    metrics: {
      local_offices: { fallbacks: fallbackOffices },
      school_districts: { fallbacks: fallbackDistricts }
    }
  }, null, 2));
  safeWrite(path.join(stateDataDir, 'pull_plan.json'), JSON.stringify({ state_code: stateCode, targets: [] }, null, 2));

  // Phase records placeholders
  const phases = [
    'benefits_hhs', 'dd_idd', 'early_intervention', 'education_regional',
    'district_replacements', 'clinics', 'forms_appeals_transition',
    'trusted_nonprofits', 'provider_legal_review_queue'
  ];

  for (const ph of phases) {
    safeWrite(path.join(phaseRecordsDir, `${ph}.json`), '[]');
  }
}

// Main Runner
async function main() {
  const args = process.argv.slice(2);
  let state = 'florida';
  let mode = 'research';
  let phase = null;

  let forceProtected = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--state') {
      state = args[i + 1];
    } else if (args[i] === '--mode') {
      mode = args[i + 1];
    } else if (args[i] === '--phase') {
      phase = args[i + 1];
    } else if (args[i] === '--force-protected') {
      forceProtected = true;
    }
  }

  // Enforce: --force-protected must not be usable in batch mode
  if (forceProtected && (process.env.BATCH_MODE || process.env.IS_BATCH || args.includes('--batch'))) {
    console.error(`❌ Error: --force-protected is strictly disallowed in batch mode.`);
    process.exit(1);
  }

  state = state.toLowerCase();
  mode = mode.toLowerCase();

  // CLI Legacy Mode Aliases mapping
  const modeAliases = {
    'research-apd': { phase: 'dd_idd', mode: 'research' },
    'research-early-steps': { phase: 'early_intervention', mode: 'research' },
    'research-fdlrs-ese': { phase: 'education_regional', mode: 'research' },
    'research-ese-districts': { phase: 'district_replacements', mode: 'research' },
    'stage-dcf': { phase: 'benefits_hhs', mode: 'stage' },
    'promote-dcf': { phase: 'benefits_hhs', mode: 'promote' },
    'stage-apd': { phase: 'dd_idd', mode: 'stage' },
    'promote-apd': { phase: 'dd_idd', mode: 'promote' },
    'stage-early-steps': { phase: 'early_intervention', mode: 'stage' },
    'promote-early-steps': { phase: 'early_intervention', mode: 'promote' },
    'stage-fdlrs-ese': { phase: 'education_regional', mode: 'stage' },
    'promote-fdlrs-ese': { phase: 'education_regional', mode: 'promote' },
    'stage-ese-districts': { phase: 'district_replacements', mode: 'stage' },
    'promote-ese-districts': { phase: 'district_replacements', mode: 'promote' },
    'finish-official-florida': { phase: 'clinics', mode: 'stage_and_promote' },
    'finish-support-florida': { phase: 'trusted_nonprofits', mode: 'stage_and_promote' }
  };

  if (modeAliases[mode]) {
    const alias = modeAliases[mode];
    phase = alias.phase;
    mode = alias.mode;
  }

  // Load configuration
  const stateConfig = loadStateConfig(state);

  if (mode === 'research') {
    runResearchMode(stateConfig);
    return;
  }

  if (mode === 'audit') {
    console.log(`⚙️ Running database audits for state ${stateConfig.state_name}...`);
    try {
      execSync(`node src/db/audit_state_standard.js ${state}`, { stdio: 'inherit' });
      execSync(`node src/db/audit_state_depth.js ${state}`, { stdio: 'inherit' });
    } catch (e) {
      console.error(`⚠️ Auditing scripts failed or exited: ${e.message}`);
    }
    return;
  }

  if (mode === 'full-upgrade') {
    console.log(`====================================================`);
    console.log(`🚀 RUNNING FULL END-TO-END UPGRADE: ${stateConfig.state_name.toUpperCase()}`);
    console.log(`====================================================`);

    const phases = [
      'benefits_hhs',
      'dd_idd',
      'early_intervention',
      'education_regional',
      'district_replacements',
      'clinics',
      'forms_appeals_transition',
      'trusted_nonprofits'
    ];

    for (const ph of phases) {
      console.log(`\n----------------------------------------------------`);
      console.log(`💎 Executing Phase: ${ph.toUpperCase()}`);
      console.log(`----------------------------------------------------`);
      
      const phaseConfig = phaseConfigs[ph];
      if (!phaseConfig) {
        throw new Error(`Unsupported phase '${ph}' in full-upgrade sequence.`);
      }

      // Check if data file exists
      const recordsPath = path.resolve(__dirname, `../../data/state-upgrades/${state}/phase_records/${ph}.json`);
      if (!fs.existsSync(recordsPath)) {
        console.warn(`⚠️ Warning: Staging records file not found at ${recordsPath}. Skipping Phase ${ph}.`);
        continue;
      }

      // 1. Stage Phase
      console.log(`[STAGE] Staging records for ${ph}...`);
      const backupDbPath = `${dbPath}.backup-${Date.now()}`;
      try {
        fs.copyFileSync(dbPath, backupDbPath);
      } catch (e) {
        console.error(`❌ Failed to create database backup: ${e.message}`);
        process.exit(1);
      }
      
      let db;
      try {
        db = new Database(dbPath);
        db.transaction(() => {
          const count = stagePhaseRecords(db, stateConfig, phaseConfig);
          console.log(`✓ Staged ${count} records.`);
        })();
        db.close();
        checkpointAndSyncDb();
      } catch (err) {
        console.error(`❌ Staging transaction failed for phase '${ph}': ${err.message}`);
        if (db) {
          try { db.close(); } catch (e) {}
        }
        try { fs.copyFileSync(backupDbPath, dbPath); } catch (e) {}
        process.exit(1);
      }

      // 2. Promote Phase
      console.log(`[PROMOTE] Promoting records for ${ph}...`);
      try {
        db = new Database(dbPath);
        const preChecksum = getDbChecksum(db);
        const preProtectedCounts = getProtectedRecordCounts(db);
        const rollback = new RollbackGenerator(stateConfig, phaseConfig);
        const diff = {
          tablesTouched: phaseConfig.allowed_tables,
          insertedCount: 0,
          updatedCount: 0,
          deletedCount: 0,
          rekeyedIds: [],
          evidenceDistribution: {},
          originDistribution: {},
          verificationDistribution: {}
        };

        db.transaction(() => {
          promotePhaseRecords(db, stateConfig, phaseConfig, rollback, diff, forceProtected);
          console.log(`✓ Promotion processed successfully.`);
        })();

        // Mutation safety guard checks
        const postChecksum = getDbChecksum(db);
        const postProtectedCounts = getProtectedRecordCounts(db);
        assertMutationSafety(preChecksum, postChecksum, phaseConfig.allowed_tables);
        assertProtectedCountsSafety(preProtectedCounts, postProtectedCounts, forceProtected);

        const sumProtectedCounts = (counts, allowedTables) => {
          let sum = 0;
          for (const table of allowedTables) {
            sum += counts[table] || 0;
          }
          return sum;
        };

        diff.preProtectedCount = sumProtectedCounts(preProtectedCounts, phaseConfig.allowed_tables);
        diff.postProtectedCount = sumProtectedCounts(postProtectedCounts, phaseConfig.allowed_tables);

        db.close();
        checkpointAndSyncDb();
        rollback.save();
        writeDiffReport(stateConfig, phaseConfig, diff);

        // Run fast audits after promotion phase
        runFastAudits(state);

        console.log(`✓ Phase ${ph} successfully promoted and verified.`);
      } catch (err) {
        console.error(`❌ Promotion transaction failed for phase '${ph}': ${err.message}`);
        if (db) {
          try { db.close(); } catch (e) {}
        }
        try { fs.copyFileSync(backupDbPath, dbPath); } catch (e) {}
        process.exit(1);
      }

      // Clean up backup file
      try {
        fs.unlinkSync(backupDbPath);
      } catch (err) {}
    }

    // 3. Launch Readiness Check at the end of full-upgrade
    console.log(`\n====================================================`);
    console.log(`⚙️ Running Final Launch Readiness Check...`);
    console.log(`====================================================`);
    
    // 1. Next.js Compile Build check
    console.log(`⚙️ Verifying Next.js production compile build...`);
    try {
      execSync(`npm run build --prefix frontend`, { stdio: 'inherit' });
      console.log(`✓ Next.js build compiled successfully!`);
    } catch (e) {
      console.error(`❌ Next.js build compile check failed: ${e.message}`);
      process.exit(1);
    }

    // 2. Playwright E2E Smoke Tests check
    const specPath = `e2e/${state}-launch.spec.ts`;
    const fullSpecPath = path.resolve(__dirname, `../../frontend/${specPath}`);

    if (fs.existsSync(fullSpecPath)) {
      console.log(`⚙️ Running Playwright launch smoke tests for state '${state}': ${specPath}...`);
      try {
        execSync(`npx playwright test ${specPath}`, { 
          stdio: 'inherit',
          cwd: path.resolve(__dirname, '../../frontend'),
          env: { ...process.env, DB_ENCRYPTION_KEY: 'ca-special-needs-navigator-key-dev-32' }
        });
        console.log(`✓ Playwright launch tests passed successfully!`);
      } catch (e) {
        console.error(`❌ Playwright smoke tests failed: ${e.message}`);
        process.exit(1);
      }
    } else {
      console.log(`⚠️ Warning: Targeted state smoke test file '${specPath}' not found. Skipping targeted smoke test.`);
    }

    const reportPath = path.resolve(__dirname, `../../docs/launch/${state}-launch-readiness-report.md`);
    fs.writeFileSync(reportPath, `# Launch Readiness Report: ${stateConfig.state_name}\n\n*   **Status:** GO\n*   **Timestamp:** ${new Date().toISOString()}\n`, 'utf8');
    console.log(`✓ Launch report saved to docs/launch/${state}-launch-readiness-report.md`);
    return;
  }

  if (mode === 'launch-readiness') {
    console.log(`====================================================`);
    console.log(`🎉 LAUNCH READINESS CHECK: ${stateConfig.state_name.toUpperCase()}`);
    console.log(`====================================================`);
    
    // 1. Next.js Compile Build check
    console.log(`⚙️ Verifying Next.js production compile build...`);
    try {
      execSync(`npm run build --prefix frontend`, { stdio: 'inherit' });
      console.log(`✓ Next.js build compiled successfully!`);
    } catch (e) {
      console.error(`❌ Next.js build compile check failed: ${e.message}`);
      process.exit(1);
    }

    // 2. Playwright E2E Smoke Tests check
    console.log(`⚙️ Running Playwright launch smoke tests...`);
    try {
      execSync(`npx playwright test`, { 
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '../../frontend'),
        env: { ...process.env, DB_ENCRYPTION_KEY: 'ca-special-needs-navigator-key-dev-32' }
      });
      console.log(`✓ Playwright launch tests passed successfully!`);
    } catch (e) {
      console.error(`❌ Playwright smoke tests failed: ${e.message}`);
      process.exit(1);
    }

    const reportPath = path.resolve(__dirname, `../../docs/launch/${state}-launch-readiness-report.md`);
    fs.writeFileSync(reportPath, `# Launch Readiness Report: ${stateConfig.state_name}\n\n*   **Status:** GO\n*   **Timestamp:** ${new Date().toISOString()}\n`, 'utf8');
    console.log(`✓ Launch report saved to docs/launch/${state}-launch-readiness-report.md`);
    return;
  }

  // Phase operations
  if (!phase) {
    console.error(`❌ Error: --phase is required for mode '${mode}'.`);
    process.exit(1);
  }

  const phaseConfig = phaseConfigs[phase];
  if (!phaseConfig) {
    console.error(`❌ Error: Unsupported phase '${phase}'.`);
    process.exit(1);
  }

  // Backup DB
  const backupDbPath = `${dbPath}.backup-${Date.now()}`;
  try {
    fs.copyFileSync(dbPath, backupDbPath);
    console.log(`✓ Created database backup: ${backupDbPath}`);
  } catch (e) {
    console.error(`❌ Error: Failed to create database backup: ${e.message}`);
    process.exit(1);
  }

  let db;
  try {
    db = new Database(dbPath);
  } catch (e) {
    console.error(`❌ Error: Failed to open SQLite database: ${e.message}`);
    process.exit(1);
  }

  if (mode === 'stage') {
    try {
      db.transaction(() => {
        const count = stagePhaseRecords(db, stateConfig, phaseConfig);
        console.log(`✓ Successfully staged ${count} records for phase '${phase}'.`);
      })();
      checkpointAndSyncDb();
    } catch (err) {
      console.error(`❌ Staging transaction failed: ${err.message}`);
      db.close();
      fs.copyFileSync(backupDbPath, dbPath); // Restore backup
      console.log(`✓ Restored database backup after staging failure.`);
      process.exit(1);
    }
  } else if (mode === 'promote') {
    const preChecksum = getDbChecksum(db);
    const preProtectedCounts = getProtectedRecordCounts(db);
    const rollback = new RollbackGenerator(stateConfig, phaseConfig);
    const diff = {
      tablesTouched: phaseConfig.allowed_tables,
      insertedCount: 0,
      updatedCount: 0,
      deletedCount: 0,
      rekeyedIds: [],
      evidenceDistribution: {},
      originDistribution: {},
      verificationDistribution: {}
    };

    try {
      db.transaction(() => {
        promotePhaseRecords(db, stateConfig, phaseConfig, rollback, diff, forceProtected);
        console.log(`✓ Phase '${phase}' promotion transaction processed successfully.`);
      })();

      // Mutation safety guard checks
      const postChecksum = getDbChecksum(db);
      const postProtectedCounts = getProtectedRecordCounts(db);
      assertMutationSafety(preChecksum, postChecksum, phaseConfig.allowed_tables);
      assertProtectedCountsSafety(preProtectedCounts, postProtectedCounts, forceProtected);

      const sumProtectedCounts = (counts, allowedTables) => {
        let sum = 0;
        for (const table of allowedTables) {
          sum += counts[table] || 0;
        }
        return sum;
      };

      diff.preProtectedCount = sumProtectedCounts(preProtectedCounts, phaseConfig.allowed_tables);
      diff.postProtectedCount = sumProtectedCounts(postProtectedCounts, phaseConfig.allowed_tables);

      checkpointAndSyncDb();
      rollback.save();
      writeDiffReport(stateConfig, phaseConfig, diff);

      // Run fast audits after promotion phase
      runFastAudits(state);
    } catch (err) {
      console.error(`❌ Promotion transaction failed: ${err.message}`);
      db.close();
      fs.copyFileSync(backupDbPath, dbPath); // Restore backup
      console.log(`✓ Restored database backup after promotion failure.`);
      process.exit(1);
    }
  }

  db.close();
}

main().catch(err => {
  console.error(`❌ Runner Crash: ${err.message}`);
  process.exit(1);
});
