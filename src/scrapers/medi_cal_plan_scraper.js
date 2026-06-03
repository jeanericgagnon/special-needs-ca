import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPaths = [
  path.resolve(__dirname, '../../ca_disability_navigator.db'),
  path.resolve(__dirname, '../../frontend/ca_disability_navigator.db')
];

// Complete 2026 Medi-Cal Managed Care Plans (MCP) county mapping in CA
const COUNTY_MEDI_CAL_PLANS = {
  'alameda': 'Alameda Alliance for Health, Anthem Blue Cross',
  'alpine': 'California Health & Wellness, Anthem Blue Cross',
  'amador': 'Health Net, Anthem Blue Cross',
  'butte': 'California Health & Wellness, Anthem Blue Cross',
  'calaveras': 'Health Net, Anthem Blue Cross',
  'colusa': 'California Health & Wellness, Anthem Blue Cross',
  'contra-costa': 'Contra Costa Health Plan, Kaiser Permanente',
  'del-norte': 'Partnership HealthPlan of California',
  'el-dorado': 'Anthem Blue Cross, California Health & Wellness, Kaiser Permanente',
  'fresno': 'CalViva Health, Anthem Blue Cross, Kaiser Permanente',
  'glenn': 'California Health & Wellness, Anthem Blue Cross',
  'humboldt': 'Partnership HealthPlan of California',
  'imperial': 'California Health & Wellness, Molina Healthcare',
  'inyo': 'California Health & Wellness, Anthem Blue Cross',
  'kern': 'Kern Family Health Care, Health Net',
  'kings': 'Health Net, Anthem Blue Cross',
  'lake': 'Partnership HealthPlan of California',
  'lassen': 'Partnership HealthPlan of California',
  'los-angeles': 'L.A. Care Health Plan, Health Net, Molina Healthcare, Kaiser Permanente',
  'madera': 'CalViva Health, Anthem Blue Cross, Kaiser Permanente',
  'marin': 'Partnership HealthPlan of California',
  'mariposa': 'Health Net, Anthem Blue Cross',
  'mendocino': 'Partnership HealthPlan of California',
  'merced': 'Central California Alliance for Health',
  'modoc': 'Partnership HealthPlan of California',
  'mono': 'California Health & Wellness, Anthem Blue Cross',
  'monterey': 'Central California Alliance for Health',
  'napa': 'Partnership HealthPlan of California',
  'nevada': 'California Health & Wellness, Anthem Blue Cross',
  'orange': 'CalOptima Health',
  'placer': 'Anthem Blue Cross, California Health & Wellness, Kaiser Permanente',
  'plumas': 'California Health & Wellness, Anthem Blue Cross',
  'riverside': 'Inland Empire Health Plan (IEHP), Molina Healthcare, Kaiser Permanente',
  'sacramento': 'Anthem Blue Cross, Molina Healthcare, Health Net, Kaiser Permanente',
  'san-benito': 'Central California Alliance for Health',
  'san-bernardino': 'Inland Empire Health Plan (IEHP), Molina Healthcare, Kaiser Permanente',
  'san-diego': 'Community Health Group, Blue Shield of California Promise Health Plan, Molina Healthcare, Kaiser Permanente, Aetna Better Health',
  'san-francisco': 'San Francisco Health Plan, Anthem Blue Cross',
  'san-joaquin': 'Health Plan of San Joaquin, Health Net, Kaiser Permanente',
  'san-luis-obispo': 'CenCal Health',
  'san-mateo': 'HealthPlan of San Mateo',
  'santa-barbara': 'CenCal Health',
  'santa-clara': 'Santa Clara Family Health Plan, Anthem Blue Cross, Kaiser Permanente',
  'santa-cruz': 'Central California Alliance for Health',
  'shasta': 'Partnership HealthPlan of California',
  'sierra': 'California Health & Wellness, Anthem Blue Cross',
  'siskiyou': 'Partnership HealthPlan of California',
  'solano': 'Partnership HealthPlan of California',
  'sonoma': 'Partnership HealthPlan of California',
  'stanislaus': 'Health Plan of San Joaquin, Health Net, Kaiser Permanente',
  'sutter': 'California Health & Wellness, Anthem Blue Cross',
  'tehama': 'California Health & Wellness, Anthem Blue Cross',
  'trinity': 'Partnership HealthPlan of California',
  'tulare': 'Health Net, Anthem Blue Cross',
  'tuolumne': 'Health Net, Anthem Blue Cross',
  'ventura': 'Gold Coast Health Plan',
  'yolo': 'Partnership HealthPlan of California',
  'yuba': 'California Health & Wellness, Anthem Blue Cross'
};

async function run() {
  console.log("🚀 Seeding Medi-Cal Managed Care Plans by County...");
  
  for (const dbPath of dbPaths) {
    console.log(`Updating database at: ${dbPath}...`);
    const db = new Database(dbPath);
    
    // Ensure column exists
    try {
      db.exec("ALTER TABLE counties ADD COLUMN medi_cal_plans TEXT;");
      console.log("  Added medi_cal_plans column to counties table.");
    } catch (err) {
      // Column already exists
    }
    
    const updateStmt = db.prepare("UPDATE counties SET medi_cal_plans = ? WHERE id = ?");
    const checkStmt = db.prepare("SELECT name FROM counties WHERE id = ?");
    
    let updated = 0;
    const tx = db.transaction(() => {
      for (const [slug, plans] of Object.entries(COUNTY_MEDI_CAL_PLANS)) {
        const exists = checkStmt.get(slug);
        if (exists) {
          updateStmt.run(plans, slug);
          updated++;
        }
      }
    });
    
    tx();
    console.log(`  Updated ${updated} counties with Medi-Cal plans.`);
    db.close();
  }
  
  console.log("🎉 Successfully seeded all Medi-Cal county plans!");
}

run();
