export function getFallbackCountyOffices(db, stateConfig) {
  const suffixPattern = `%${stateConfig.county_id_suffix}`;
  return db.prepare(`
    SELECT count(*) as cnt 
    FROM county_offices 
    WHERE county_id LIKE ? AND verification_status = 'generated_county_fallback'
  `).get(suffixPattern).cnt;
}

export function getFallbackSchoolDistricts(db, stateConfig) {
  const suffixPattern = `%${stateConfig.county_id_suffix}`;
  return db.prepare(`
    SELECT count(*) as cnt 
    FROM school_districts 
    WHERE county_id LIKE ? AND verification_status = 'generated_county_fallback'
  `).get(suffixPattern).cnt;
}

export function getExistingStateResourceAgencies(db, stateConfig, agencyType) {
  return db.prepare(`
    SELECT * 
    FROM state_resource_agencies 
    WHERE state_id = ? AND agency_type = ?
  `).all(stateConfig.state_id, agencyType);
}

export function getExistingPrograms(db, stateConfig) {
  const prefixPattern = `${stateConfig.program_id_prefix}%`;
  return db.prepare(`
    SELECT * 
    FROM programs 
    WHERE id LIKE ?
  `).all(prefixPattern);
}

export function getCountyIds(db, stateConfig) {
  const suffixPattern = `%${stateConfig.county_id_suffix}`;
  return db.prepare(`
    SELECT id 
    FROM counties 
    WHERE id LIKE ?
  `).all(suffixPattern).map(r => r.id);
}

export function getVerifiedProvidersCount(db, stateConfig) {
  const suffixPattern = `%${stateConfig.county_id_suffix}`;
  return db.prepare(`
    SELECT count(distinct id) as cnt 
    FROM resource_providers 
    WHERE county_id LIKE ? AND verification_status = 'source_listed'
  `).get(suffixPattern).cnt;
}
