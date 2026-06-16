import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');
const outputJsonPath = path.resolve(__dirname, 'national_audit_metrics.json');

const db = new Database(dbPath, { readonly: true });

const states = db.prepare("SELECT id, name, code FROM states ORDER BY name ASC").all();

const auditResults = {
  timestamp: new Date().toISOString(),
  registryIntegrity: {
    duplicates: [],
    wrongSlugs: [],
    countyMismatch: [],
    crossStateCountyMappings: [],
    wrongStateRecords: []
  },
  stateMetrics: {}
};

// Expected county counts by state code
const expectedCountyCounts = {
  AL: 67, AK: 20, AZ: 15, AR: 75, CA: 58, CO: 64, CT: 8, DE: 3, FL: 67, GA: 159,
  HI: 5, ID: 44, IL: 102, IN: 92, IA: 99, KS: 105, KY: 120, LA: 64, ME: 16, MD: 24,
  MA: 14, MI: 83, MN: 87, MS: 82, MO: 115, MT: 56, NE: 93, NV: 17, NH: 10, NJ: 21,
  NM: 33, NY: 62, NC: 100, ND: 53, OH: 88, OK: 77, OR: 36, PA: 67, RI: 5, SC: 46,
  SD: 66, TN: 95, TX: 254, UT: 29, VT: 14, VA: 95, WA: 39, WV: 55, WI: 72, WY: 23
};

// 1. Registry Integrity Checks
console.log("Checking State Registry Integrity...");

// Duplicate checks
const seenSlugs = new Set();
for (const state of states) {
  if (seenSlugs.has(state.id)) {
    auditResults.registryIntegrity.duplicates.push(state.id);
  }
  seenSlugs.add(state.id);
}

// Counties check
for (const state of states) {
  const code = state.code.toUpperCase();
  const expected = expectedCountyCounts[code] || 0;
  
  const counties = db.prepare("SELECT id, name FROM counties WHERE state_id = ?").all(state.id);
  if (counties.length !== expected) {
    auditResults.registryIntegrity.countyMismatch.push({
      stateId: state.id,
      expected,
      actual: counties.length
    });
  }
  
  // Cross state county mapping
  for (const c of counties) {
    const parts = c.id.split('-');
    const suffix = parts[parts.length - 1];
    if (suffix !== code.toLowerCase()) {
      auditResults.registryIntegrity.crossStateCountyMappings.push({
        countyId: c.id,
        stateId: state.id,
        suffix
      });
    }
  }
}

// Check records assigned to the wrong state
const tablesToCheck = [
  { name: 'county_offices', stateCol: 'county_id', stateJoin: 'counties' },
  { name: 'school_districts', stateCol: 'county_id', stateJoin: 'counties' },
  { name: 'nonprofit_organizations', stateCol: 'county_id', stateJoin: 'counties' }
];

for (const tbl of tablesToCheck) {
  const wrongRecords = db.prepare(`
    SELECT r.id, r.${tbl.stateCol} as parent, c.state_id 
    FROM ${tbl.name} r
    JOIN ${tbl.stateJoin} c ON r.${tbl.stateCol} = c.id
    WHERE c.state_id IS NULL OR c.state_id = ''
  `).all();
  if (wrongRecords.length > 0) {
    auditResults.registryIntegrity.wrongStateRecords.push({
      table: tbl.name,
      records: wrongRecords
    });
  }
}

// 2. Loop over states and run details audit
console.log("Auditing each state's records...");
for (const state of states) {
  const stateId = state.id;
  const code = state.code.toLowerCase();
  const suffix = `-${code}`;
  
  // A. Fallbacks Audit
  const officesFallback = db.prepare(`
    SELECT COUNT(*) as count 
    FROM county_offices co
    JOIN counties c ON co.county_id = c.id
    WHERE c.state_id = ? AND (co.data_origin IN ('programmatic_fallback', 'generated_county_fallback') OR co.id LIKE '%-fallback')
  `).get(stateId).count;
  const districtsFallback = db.prepare(`
    SELECT COUNT(*) as count 
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = ? AND (sd.data_origin IN ('programmatic_fallback', 'generated_county_fallback') OR sd.id LIKE '%-fallback')
  `).get(stateId).count;
  const nonprofitsFallback = db.prepare(`
    SELECT COUNT(*) as count 
    FROM nonprofit_organizations np
    JOIN counties c ON np.county_id = c.id
    WHERE c.state_id = ? AND (np.data_origin IN ('programmatic_fallback', 'generated_county_fallback') OR np.id LIKE '%-fallback')
  `).get(stateId).count;
  const regEduFallback = db.prepare("SELECT COUNT(*) as count FROM regional_education_agencies WHERE state_id = ? AND (data_origin IN ('programmatic_fallback', 'generated_county_fallback') OR id LIKE '%-fallback')").get(stateId).count;
  const stateAgenciesFallback = db.prepare("SELECT COUNT(*) as count FROM state_resource_agencies WHERE state_id = ? AND (data_origin IN ('programmatic_fallback', 'generated_county_fallback') OR id LIKE '%-fallback')").get(stateId).count;
  
  const totalFallback = officesFallback + districtsFallback + nonprofitsFallback + regEduFallback + stateAgenciesFallback;
  
  // Check active fallback IDs
  const activeFallbackIds = [];
  const officeIds = db.prepare(`
    SELECT co.id 
    FROM county_offices co
    JOIN counties c ON co.county_id = c.id
    WHERE c.state_id = ? AND co.id LIKE '%-fallback'
  `).all(stateId).map(r => r.id);
  const districtIds = db.prepare(`
    SELECT sd.id 
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = ? AND sd.id LIKE '%-fallback'
  `).all(stateId).map(r => r.id);
  const npIds = db.prepare(`
    SELECT np.id 
    FROM nonprofit_organizations np
    JOIN counties c ON np.county_id = c.id
    WHERE c.state_id = ? AND np.id LIKE '%-fallback'
  `).all(stateId).map(r => r.id);
  activeFallbackIds.push(...officeIds, ...districtIds, ...npIds);
  
  // B. Placeholders Audit (Scan nationally for 555 numbers, mock emails, fake/generated domains)
  let mockCount = 0;
  const mockDetails = [];
  
  // 555 numbers & generic emails
  const checkMock = (table, phoneCol, webCol, idCol, parentCol) => {
    let list;
    if (parentCol === 'county_id') {
      list = db.prepare(`
        SELECT t.* 
        FROM ${table} t
        JOIN counties c ON t.county_id = c.id
        WHERE c.state_id = ?
      `).all(stateId);
    } else {
      list = db.prepare(`SELECT * FROM ${table} WHERE ${parentCol} = ?`).all(stateId);
    }
    for (const row of list) {
      let isMock = false;
      const reasons = [];
      const phone = phoneCol ? row[phoneCol] : null;
      const web = webCol ? row[webCol] : null;
      
      if (phone) {
        if (phone.includes("555-") || phone.includes("5550") || phone.includes("5551") || phone.includes("555-0200") || phone.includes("555-01")) {
          isMock = true;
          reasons.push(`Mock phone: ${phone}`);
        }
      }
      if (web) {
        if (web.includes("example.com") || web.includes("temp.com") || web.includes("fictional") || web.includes(`support.${code}`)) {
          isMock = true;
          reasons.push(`Mock website: ${web}`);
        }
      }
      
      if (isMock) {
        mockCount++;
        mockDetails.push({
          table,
          id: row[idCol],
          reasons
        });
      }
    }
  };
  
  checkMock('county_offices', 'phone', 'website', 'id', 'county_id');
  checkMock('school_districts', 'spec_ed_contact_phone', 'website', 'id', 'county_id');
  checkMock('nonprofit_organizations', 'phone', 'website', 'id', 'county_id');
  
  // C. Manual Review Audit
  const officesManual = db.prepare(`
    SELECT COUNT(*) as count 
    FROM county_offices co
    JOIN counties c ON co.county_id = c.id
    WHERE c.state_id = ? AND co.verification_status = 'manual_review_required'
  `).get(stateId).count;
  const districtsManual = db.prepare(`
    SELECT COUNT(*) as count 
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = ? AND sd.verification_status = 'manual_review_required'
  `).get(stateId).count;
  const nonprofitsManual = db.prepare(`
    SELECT COUNT(*) as count 
    FROM nonprofit_organizations np
    JOIN counties c ON np.county_id = c.id
    WHERE c.state_id = ? AND np.verification_status = 'manual_review_required'
  `).get(stateId).count;
  
  const totalManual = officesManual + districtsManual + nonprofitsManual;
  
  const totalActiveOffices = db.prepare(`
    SELECT COUNT(*) as count 
    FROM county_offices co
    JOIN counties c ON co.county_id = c.id
    WHERE c.state_id = ?
  `).get(stateId).count;
  const totalActiveDistricts = db.prepare(`
    SELECT COUNT(*) as count 
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = ?
  `).get(stateId).count;
  const totalActiveNonprofits = db.prepare(`
    SELECT COUNT(*) as count 
    FROM nonprofit_organizations np
    JOIN counties c ON np.county_id = c.id
    WHERE c.state_id = ?
  `).get(stateId).count;
  const totalActiveStateAgencies = db.prepare("SELECT COUNT(*) as count FROM state_resource_agencies WHERE state_id = ?").get(stateId).count;
  const totalActiveRegEdu = db.prepare("SELECT COUNT(*) as count FROM regional_education_agencies WHERE state_id = ?").get(stateId).count;
  const totalActiveRecords = totalActiveOffices + totalActiveDistricts + totalActiveNonprofits + totalActiveStateAgencies + totalActiveRegEdu;
  
  const manualPercentage = totalActiveRecords > 0 ? (totalManual / totalActiveRecords) * 100 : 0;
  
  // Check if any manual review is verified
  const verifiedManual = db.prepare(`
    SELECT co.id 
    FROM county_offices co
    JOIN counties c ON co.county_id = c.id
    WHERE c.state_id = ? AND co.verification_status = 'manual_review_required' AND (co.verification_status = 'verified' OR co.data_origin = 'curated_seed')
    UNION ALL
    SELECT sd.id 
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = ? AND sd.verification_status = 'manual_review_required' AND (sd.verification_status = 'verified' OR sd.data_origin = 'curated_seed')
  `).all(stateId, stateId);
  
  // D. Protected Record Audit
  const protectedNonprofits = db.prepare(`
    SELECT COUNT(*) as count 
    FROM nonprofit_organizations np
    JOIN counties c ON np.county_id = c.id
    WHERE c.state_id = ? AND np.data_origin = 'curated_seed'
  `).get(stateId).count;
  const protectedDistricts = db.prepare(`
    SELECT COUNT(*) as count 
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = ? AND sd.data_origin = 'curated_seed'
  `).get(stateId).count;
  const protectedRegEdu = db.prepare("SELECT COUNT(*) as count FROM regional_education_agencies WHERE state_id = ? AND data_origin = 'curated_seed'").get(stateId).count;
  
  const totalProtected = protectedNonprofits + protectedDistricts + protectedRegEdu;
  
  // E. Geographic Routing / Providers check
  // Verify no commercial providers are promoted (resource_providers count)
  const providersCount = db.prepare(`
    SELECT COUNT(*) as count 
    FROM resource_providers rp
    JOIN counties c ON rp.county_id = c.id
    WHERE c.state_id = ?
  `).get(stateId).count;

  // Expected status
  let claimedStatus = "PILOT-READY PARTIAL";
  if (stateId === 'california' || stateId === 'texas' || stateId === 'florida' || stateId === 'new-york' || stateId === 'ohio' || stateId === 'pennsylvania') {
    claimedStatus = "COMPLETE";
  }

  auditResults.stateMetrics[stateId] = {
    name: state.name,
    code: state.code,
    claimedStatus,
    activeCounts: {
      offices: totalActiveOffices,
      districts: totalActiveDistricts,
      nonprofits: totalActiveNonprofits,
      stateAgencies: totalActiveStateAgencies,
      regEdu: totalActiveRegEdu,
      total: totalActiveRecords
    },
    fallbacks: {
      offices: officesFallback,
      districts: districtsFallback,
      nonprofits: nonprofitsFallback,
      regEdu: regEduFallback,
      stateAgencies: stateAgenciesFallback,
      total: totalFallback,
      activeFallbackIds
    },
    placeholders: {
      mockCount,
      mockDetails
    },
    manualReview: {
      offices: officesManual,
      districts: districtsManual,
      nonprofits: nonprofitsManual,
      total: totalManual,
      percentage: manualPercentage,
      verifiedManual
    },
    protected: {
      nonprofits: protectedNonprofits,
      districts: protectedDistricts,
      regEdu: protectedRegEdu,
      total: totalProtected
    },
    providersCount
  };
}

fs.writeFileSync(outputJsonPath, JSON.stringify(auditResults, null, 2), 'utf8');
console.log(`🎉 National Ingestion Audit completed and written to: ${outputJsonPath}`);
db.close();
