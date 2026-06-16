import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath, { readonly: true });

const states = db.prepare("SELECT id, name, code FROM states ORDER BY name ASC").all();

console.log(String.prototype.padEnd ? "State".padEnd(20) + "Code".padEnd(6) + "Offices".padEnd(10) + "Districts".padEnd(10) + "Nonprofits".padEnd(12) + "Fallbacks".padEnd(10) + "ManualRev".padEnd(10) : "State...");

for (const state of states) {
  const suffix = `-${state.code.toLowerCase()}`;
  
  // Count offices
  const offices = db.prepare("SELECT COUNT(*) as count FROM county_offices WHERE county_id LIKE ?").get(`%${suffix}`);
  const officesFallback = db.prepare("SELECT COUNT(*) as count FROM county_offices WHERE county_id LIKE ? AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')").get(`%${suffix}`);
  
  // Count school districts
  const districts = db.prepare("SELECT COUNT(*) as count FROM school_districts WHERE county_id LIKE ?").get(`%${suffix}`);
  const districtsFallback = db.prepare("SELECT COUNT(*) as count FROM school_districts WHERE county_id LIKE ? AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')").get(`%${suffix}`);
  
  // Count nonprofits
  const nonprofits = db.prepare("SELECT COUNT(*) as count FROM nonprofit_organizations WHERE county_id LIKE ?").get(`%${suffix}`);
  const nonprofitsFallback = db.prepare("SELECT COUNT(*) as count FROM nonprofit_organizations WHERE county_id LIKE ? AND (data_origin = 'programmatic_fallback' OR id LIKE '%-fallback')").get(`%${suffix}`);
  
  // Count manual review
  const manualReview = db.prepare(`
    SELECT SUM(cnt) as cnt FROM (
      SELECT COUNT(*) as cnt FROM county_offices WHERE county_id LIKE ? AND verification_status = 'manual_review_required'
      UNION ALL
      SELECT COUNT(*) as cnt FROM school_districts WHERE county_id LIKE ? AND verification_status = 'manual_review_required'
      UNION ALL
      SELECT COUNT(*) as cnt FROM nonprofit_organizations WHERE county_id LIKE ? AND verification_status = 'manual_review_required'
    )
  `).get(`%${suffix}`, `%${suffix}`, `%${suffix}`).cnt || 0;

  const totalFallback = officesFallback.count + districtsFallback.count + nonprofitsFallback.count;

  const line = `${state.name.padEnd(20)}${state.code.padEnd(6)}${String(offices.count).padEnd(10)}${String(districts.count).padEnd(10)}${String(nonprofits.count).padEnd(12)}${String(totalFallback).padEnd(10)}${String(manualReview).padEnd(10)}`;
  console.log(line);
}

db.close();
