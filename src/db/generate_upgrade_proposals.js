import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');
const db = new Database(dbPath);

console.log('Generating upgrade proposals against:', dbPath);

const proposalsDir = path.resolve(__dirname, '../../docs/scraping-vs-seeding');
fs.mkdirSync(proposalsDir, { recursive: true });

const states = db.prepare("SELECT id, name, code FROM states WHERE id != 'california' ORDER BY name ASC").all();

for (const state of states) {
  const stateId = state.id;
  const stateName = state.name;
  const stateCode = state.code;
  const stateSlug = stateId.replace(/-/g, '');

  // Query actual fallback counts from db
  // 1. County offices fallbacks
  const officeFallbacks = db.prepare(`
    SELECT COUNT(*) as cnt 
    FROM county_offices co
    JOIN counties c ON co.county_id = c.id
    WHERE c.state_id = ? AND (co.data_origin = 'programmatic_fallback' OR co.data_origin = 'generated_county_fallback')
  `).get(stateId).cnt;

  // 2. School districts fallbacks
  const districtFallbacks = db.prepare(`
    SELECT COUNT(*) as cnt 
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = ? AND (sd.data_origin = 'programmatic_fallback' OR sd.data_origin = 'generated_county_fallback')
  `).get(stateId).cnt;

  // 3. Nonprofit fallbacks
  const npFallbacks = db.prepare(`
    SELECT COUNT(*) as cnt 
    FROM nonprofit_organizations no
    JOIN counties c ON no.county_id = c.id
    WHERE c.state_id = ? AND (no.data_origin = 'programmatic_fallback' OR no.data_origin = 'generated_county_fallback')
  `).get(stateId).cnt;

  const totalFallbacks = officeFallbacks + districtFallbacks + npFallbacks;

  // Expected score lift calculations
  // Each replaced fallback category improves the category score from fallback-penalized to clean explicit, raising the total CA-equivalence score.
  // Medicaid local offices count for 12%, Education/school counts for 12%, Nonprofits counts for 10%.
  let expectedLift = 0;
  if (officeFallbacks > 0) expectedLift += 12.0;
  if (districtFallbacks > 0) expectedLift += 12.0;
  if (npFallbacks > 0) expectedLift += 10.0;

  // Generate markdown content
  let md = `# Scraping Upgrade Proposal: ${stateName} (${stateCode})\n\n`;
  md = md + `This upgrade proposal maps out the transition from seeded/programmatic fallback records to live, scraper-derived official data for ${stateName}.\n\n`;
  
  md = md + `## 1. Current Placeholders and Fallbacks\n\n`;
  md = md + `We currently rely on **${totalFallbacks}** programmatic fallback placeholders across the state. Replacing these with verified listings is the primary goal of the scraping system.\n\n`;
  
  md = md + `| Category / Table | Current Fallback Count | Target Source URL | Expected Replacement Candidates | Expected Confidence |\n`;
  md = md + `| :--- | :--- | :--- | :--- | :--- |\n`;
  
  if (officeFallbacks > 0) {
    md = md + `| **Medicaid Offices** (\`county_offices\`) | ${officeFallbacks} | Official state locator/directory | Scraped county offices | \`0.90\` (Official Domain) |\n`;
  } else {
    md = md + `| **Medicaid Offices** (\`county_offices\`) | 0 | N/A | Completed/Source-listed | N/A |\n`;
  }

  if (districtFallbacks > 0) {
    md = md + `| **School Districts** (\`school_districts\`) | ${districtFallbacks} | State DOE directory | Scraped special education contacts | \`0.95\` (State DOE) |\n`;
  } else {
    md = md + `| **School Districts** (\`school_districts\`) | 0 | N/A | Completed/Source-listed | N/A |\n`;
  }

  if (npFallbacks > 0) {
    md = md + `| **Nonprofits** (\`nonprofit_organizations\`) | ${npFallbacks} | State chapters / parent centers | Local support chapters | \`0.80\` (.org nonprofit) |\n`;
  } else {
    md = md + `| **Nonprofits** (\`nonprofit_organizations\`) | 0 | N/A | Completed/Source-listed | N/A |\n`;
  }

  md = md + `\n## 2. Upgrade Action Plan & Impact\n\n`;
  md = md + `- **Total Proposed Replacements:** ${totalFallbacks} records\n`;
  md = md + `- **Expected CA-Equivalence Score Lift:** **+${expectedLift.toFixed(1)}%**\n`;
  md = md + `- **Critical Hard Caps Resolved:** ${officeFallbacks > 0 ? "Medicaid office depth hard cap (max 85%) will be removed." : "None"}\n\n`;

  md = md + `## 3. Exact Records Proposed for Replacement (Sample)\n\n`;
  md = md + `All county-level placeholder records where \`data_origin = 'programmatic_fallback'\` or \`data_origin = 'generated_county_fallback'\` will be marked as deprecated and replaced in production. Examples:\n`;
  
  // Fetch a sample county
  const county = db.prepare("SELECT name FROM counties WHERE state_id = ? LIMIT 1").get(stateId);
  const countyName = county ? county.name : "County";

  if (officeFallbacks > 0) {
    md = md + `- Replaces programmatic office: \`${stateSlug}-medicaid-office-${countyName.toLowerCase().replace(/\s+/g, '-')}\`\n`;
  }
  if (districtFallbacks > 0) {
    md = md + `- Replaces programmatic district: \`${stateSlug}-school-district-${countyName.toLowerCase().replace(/\s+/g, '-')}-fallback\`\n`;
  }
  if (npFallbacks > 0) {
    md = md + `- Replaces programmatic nonprofit: \`${stateSlug}-nonprofit-${countyName.toLowerCase().replace(/\s+/g, '-')}-fallback\`\n`;
  }

  md = md + `\n## 4. Promotion Confidence Rules\n`;
  md = md + `1. Official state listings from \`.gov\` domains are auto-promoted if confidence score is $\\ge 0.85$.\n`;
  md = md + `2. Provider listings and private directories require manual review and will default to \`scraped_unverified\` until audited.\n`;

  const proposalPath = path.join(proposalsDir, `${stateId}-upgrade-proposal.md`);
  fs.writeFileSync(proposalPath, md, 'utf8');
}

console.log(`✓ Generated upgrade proposals for ${states.length} states in docs/scraping-vs-seeding/`);
db.close();
