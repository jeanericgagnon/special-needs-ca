import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

/**
 * Calculates exact age in years from date of birth
 * @param {string} dob - YYYY-MM-DD
 * @returns {number}
 */
function getAgeInYears(dob) {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function hasPublishableProvenance(row) {
  return Boolean(
    row &&
    String(row.source_url || '').trim() &&
    String(row.source_type || '').trim() &&
    String(row.data_origin || '').trim() &&
    String(row.verification_status || '').trim() &&
    String(row.last_verified_date || '').trim() &&
    String(row.last_scraped_at || '').trim() &&
    row.confidence_score !== null &&
    row.confidence_score !== undefined
  );
}

/**
 * SQL-Backed Matching Engine
 * @param {Object} profile - Child parameters
 * @returns {Object} Matches and explanations pulled from SQL Database
 */
export function runDbMatchingEngine(profile) {
  const db = new Database(dbPath, { readonly: true });
  db.pragma('foreign_keys = ON');

  const ageYears = getAgeInYears(profile.dob);
  const countyId = profile.county_id || profile.countyId || 'los-angeles';
  
  const conditionIds = profile.conditionIds || [];
  const suspectedConditionIds = profile.suspectedConditionIds || [];
  const allConditions = [...conditionIds, ...suspectedConditionIds];
  const functionalNeedIds = profile.functionalNeedIds || [];

  const isMediCal = profile.insurance_type === 'medi-cal' || profile.insuranceType === 'medi-cal' || profile.insurance_type === 'both' || profile.insuranceType === 'both';

  const results = {
    highPriority: [],
    possible: [],
    localOffices: [],
    localOrganizations: [],
    vendedProviders: [],
    applicationSequence: [],
    summaryRationale: ''
  };

  try {
    // 1. Query Local County Office Mappings
    const officesQuery = db.prepare(`
      SELECT * FROM county_offices
      WHERE county_id = ?
        AND source_url IS NOT NULL AND TRIM(source_url) <> ''
        AND source_type IS NOT NULL AND TRIM(source_type) <> ''
        AND data_origin IS NOT NULL AND TRIM(data_origin) <> ''
        AND verification_status IS NOT NULL AND TRIM(verification_status) <> ''
        AND last_verified_date IS NOT NULL AND TRIM(last_verified_date) <> ''
        AND last_scraped_at IS NOT NULL AND TRIM(last_scraped_at) <> ''
        AND confidence_score IS NOT NULL
    `);
    const localOffices = officesQuery.all(countyId).filter(hasPublishableProvenance);
    results.localOffices = localOffices.map(o => ({
      type: o.program_id === 'ihss-for-children' ? 'County IHSS' : o.program_id === 'california-childrens-services' ? 'County CCS Office' : 'County Office',
      name: o.office_name,
      contact: `Address: ${o.address} | Phone: ${o.phone} | Web: ${o.website || 'N/A'}`
    }));

    // 2. Query Regional Center serving this county
    const rcQuery = db.prepare('SELECT * FROM regional_centers WHERE counties_served LIKE ?');
    const rcs = rcQuery.all(`%${countyId}%`);
    rcs.forEach(rc => {
      results.localOffices.push({
        type: 'Regional Center Intake',
        name: rc.name,
        contact: `Intake Phone: ${rc.intake_phone} | Early Start Contact: ${rc.early_start_contact} | Web: ${rc.website}`
      });
    });

    // 3. Query School District Special Ed department
    const districtsQuery = db.prepare(`
      SELECT * FROM school_districts
      WHERE county_id = ?
        AND source_url IS NOT NULL AND TRIM(source_url) <> ''
        AND source_type IS NOT NULL AND TRIM(source_type) <> ''
        AND data_origin IS NOT NULL AND TRIM(data_origin) <> ''
        AND verification_status IS NOT NULL AND TRIM(verification_status) <> ''
        AND last_verified_date IS NOT NULL AND TRIM(last_verified_date) <> ''
        AND last_scraped_at IS NOT NULL AND TRIM(last_scraped_at) <> ''
        AND confidence_score IS NOT NULL
    `);
    const districts = districtsQuery.all(countyId).filter(hasPublishableProvenance);
    districts.forEach(sd => {
      results.localOffices.push({
        type: 'School District Special Ed',
        name: sd.name,
        contact: `Phone: ${sd.spec_ed_contact_phone} | Email: ${sd.spec_ed_contact_email || 'N/A'} | Web: ${sd.website}`
      });
    });

    // 4. Query local nonprofit organizations
    const nonprofitQuery = db.prepare(`
      SELECT * FROM nonprofit_organizations
      WHERE county_id = ?
        AND source_url IS NOT NULL AND TRIM(source_url) <> ''
        AND source_type IS NOT NULL AND TRIM(source_type) <> ''
        AND data_origin IS NOT NULL AND TRIM(data_origin) <> ''
        AND verification_status IS NOT NULL AND TRIM(verification_status) <> ''
        AND last_verified_date IS NOT NULL AND TRIM(last_verified_date) <> ''
        AND last_scraped_at IS NOT NULL AND TRIM(last_scraped_at) <> ''
        AND confidence_score IS NOT NULL
    `);
    const nonprofits = nonprofitQuery.all(countyId).filter(hasPublishableProvenance);
    results.localOrganizations = nonprofits.map(org => ({
      name: org.name,
      website: org.website,
      phone: org.phone,
      focus: org.focus_condition
    }));

    // 5. Query local vended resource providers
    const providerQuery = db.prepare(`
      SELECT * FROM resource_providers
      WHERE county_id = ?
        AND source_url IS NOT NULL AND TRIM(source_url) <> ''
        AND source_type IS NOT NULL AND TRIM(source_type) <> ''
        AND data_origin IS NOT NULL AND TRIM(data_origin) <> ''
        AND verification_status IS NOT NULL AND TRIM(verification_status) <> ''
        AND last_verified_date IS NOT NULL AND TRIM(last_verified_date) <> ''
        AND last_scraped_at IS NOT NULL AND TRIM(last_scraped_at) <> ''
        AND confidence_score IS NOT NULL
    `);
    const providers = providerQuery.all(countyId).filter(hasPublishableProvenance);
    results.vendedProviders = providers.map(p => ({
      name: p.name,
      categories: p.categories,
      phone: p.phone,
      email: p.email,
      address: p.address,
      acceptsMediCal: p.accepts_medi_cal === 1,
      vendorIds: p.regional_center_vendor_ids
    }));

    // 6. SQL Parameterized Matching Query
    // We fetch all rules where the child satisfies the age milestone bounds
    // AND satisfies condition/need parameters
    let rulesQuerySql = `
      SELECT r.*, p.name as program_name, p.description as program_description, p.official_source_url, p.last_verified_date, p.last_scraped_at, p.confidence_score, p.source_url, p.source_type, p.data_origin, p.verification_status
      FROM program_eligibility_rules r
      JOIN programs p ON r.program_id = p.id
      WHERE ? >= r.min_age_years AND ? <= r.max_age_years
        AND p.official_source_url IS NOT NULL AND TRIM(p.official_source_url) <> ''
        AND p.source_url IS NOT NULL AND TRIM(p.source_url) <> ''
        AND p.source_type IS NOT NULL AND TRIM(p.source_type) <> ''
        AND p.data_origin IS NOT NULL AND TRIM(p.data_origin) <> ''
        AND p.verification_status IS NOT NULL AND TRIM(p.verification_status) <> ''
        AND p.last_verified_date IS NOT NULL AND TRIM(p.last_verified_date) <> ''
        AND p.last_scraped_at IS NOT NULL AND TRIM(p.last_scraped_at) <> ''
        AND p.confidence_score IS NOT NULL
    `;
    
    const params = [ageYears, ageYears];

    // Conditionally filter on condition junctions
    if (allConditions.length > 0) {
      const placeholders = allConditions.map(() => '?').join(',');
      rulesQuerySql += ` AND (r.required_condition IS NULL OR r.required_condition IN (${placeholders}))`;
      params.push(...allConditions);
    } else {
      rulesQuerySql += ' AND r.required_condition IS NULL';
    }

    // Conditionally filter on need junctions
    if (functionalNeedIds.length > 0) {
      const placeholders = functionalNeedIds.map(() => '?').join(',');
      rulesQuerySql += ` AND (r.required_need IS NULL OR r.required_need IN (${placeholders}))`;
      params.push(...functionalNeedIds);
    } else {
      rulesQuerySql += ' AND r.required_need IS NULL';
    }

    const rulesQuery = db.prepare(rulesQuerySql);
    const matchedRules = rulesQuery.all(...params).filter(hasPublishableProvenance);

    // Group recommendations by High Priority vs Possible
    matchedRules.forEach(rule => {
      // Fetch document requirements from DB for this program
      const docsQuery = db.prepare('SELECT * FROM program_document_requirements WHERE program_id = ?');
      const docs = docsQuery.all(rule.program_id);

      // Fetch steps from DB for this program
      const stepsQuery = db.prepare('SELECT * FROM program_application_steps WHERE program_id = ? ORDER BY step_number ASC');
      const steps = stepsQuery.all(rule.program_id);

      // Fetch appeal info from DB for this program
      const appealQuery = db.prepare('SELECT * FROM program_appeal_info WHERE program_id = ?');
      const appeal = appealQuery.get(rule.program_id);

      const recommendation = {
        id: rule.program_id,
        name: rule.program_name,
        description: rule.program_description,
        officialSourceUrl: rule.official_source_url,
        lastVerifiedDate: rule.last_verified_date,
        confidenceScore: rule.confidence_score,
        whyMatched: rule.trigger_reason,
        requiredDocs: docs.map(d => `${d.name} (${d.is_mandatory === 1 ? 'Mandatory' : 'Optional'}) - ${d.description || ''}`),
        applicationSteps: steps.map(s => `Step ${s.step_number}: ${s.title} - ${s.action_description}`),
        appealDetails: appeal ? {
          deadline: appeal.deadline_days,
          form: appeal.appeal_form_name,
          formUrl: appeal.official_appeal_source_url,
          steps: appeal.appeal_steps
        } : null
      };

      // Determine priority: if the child profile triggers active conditions or severe safety needs, it is High Priority!
      const isHighPriority = 
        (rule.required_condition && allConditions.includes(rule.required_condition)) || 
        (rule.required_need && functionalNeedIds.includes(rule.required_need));

      if (isHighPriority) {
        results.highPriority.push(recommendation);
      } else {
        results.possible.push(recommendation);
      }
    });

    // 7. Compile rationales
    const matchedNames = results.highPriority.map(p => p.name);
    results.summaryRationale = `SQL Database match processed for ${profile.nickname} (Age: ${ageYears}, County: ${countyId}). Identified ${results.highPriority.length} high priority benefits (${matchedNames.join(', ') || 'none'}) and ${results.possible.length} potential programs.`;
    results.applicationSequence = [...results.highPriority.map(p => p.id), ...results.possible.map(p => p.id)];

  } catch (err) {
    console.error('❌ Error executing SQL database matching rules:', err);
  } finally {
    db.close();
  }

  return results;
}
