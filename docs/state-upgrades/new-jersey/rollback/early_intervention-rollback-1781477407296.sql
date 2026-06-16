-- Rollback Script for State: New Jersey | Phase: early_intervention
-- Generated At: 2026-06-14T22:50:07.306Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-family-link' AND county_id = 'warren-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-family-link' AND county_id = 'union-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-family-link' AND county_id = 'sussex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-family-link' AND county_id = 'morris-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-family-link' AND county_id = 'essex-nj';
UPDATE state_resource_agencies SET state_id = 'new-jersey', agency_type = 'early_intervention', name = 'Family Link REIC', counties_served = 'essex-nj, morris-nj, sussex-nj, union-nj, warren-nj', catchment_boundaries = 'essex-nj, morris-nj, sussex-nj, union-nj, warren-nj', website = 'https://www.nj.gov/health/fhs/eis/', intake_phone = '(908) 964-5303', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://www.nj.gov/health/fhs/eis/', source_url = 'https://www.nj.gov/health/fhs/eis/', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 10, evidence_level = 'official_locator_derived' WHERE id = 'nj-ei-family-link';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-southern-nj' AND county_id = 'salem-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-southern-nj' AND county_id = 'gloucester-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-southern-nj' AND county_id = 'cumberland-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-southern-nj' AND county_id = 'cape-may-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-southern-nj' AND county_id = 'camden-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-southern-nj' AND county_id = 'burlington-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-southern-nj' AND county_id = 'atlantic-nj';
UPDATE state_resource_agencies SET state_id = 'new-jersey', agency_type = 'early_intervention', name = 'Southern New Jersey REIC', counties_served = 'atlantic-nj, burlington-nj, camden-nj, cape-may-nj, cumberland-nj, gloucester-nj, salem-nj', catchment_boundaries = 'atlantic-nj, burlington-nj, camden-nj, cape-may-nj, cumberland-nj, gloucester-nj, salem-nj', website = 'https://www.nj.gov/health/fhs/eis/', intake_phone = '(856) 768-6747', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://www.nj.gov/health/fhs/eis/', source_url = 'https://www.nj.gov/health/fhs/eis/', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 10, evidence_level = 'official_locator_derived' WHERE id = 'nj-ei-southern-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-mid-jersey-cares' AND county_id = 'somerset-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-mid-jersey-cares' AND county_id = 'ocean-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-mid-jersey-cares' AND county_id = 'monmouth-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-mid-jersey-cares' AND county_id = 'middlesex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-mid-jersey-cares' AND county_id = 'mercer-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-mid-jersey-cares' AND county_id = 'hunterdon-nj';
UPDATE state_resource_agencies SET state_id = 'new-jersey', agency_type = 'early_intervention', name = 'Mid-Jersey CARES REIC', counties_served = 'hunterdon-nj, mercer-nj, middlesex-nj, monmouth-nj, ocean-nj, somerset-nj', catchment_boundaries = 'hunterdon-nj, mercer-nj, middlesex-nj, monmouth-nj, ocean-nj, somerset-nj', website = 'https://www.nj.gov/health/fhs/eis/', intake_phone = '(732) 937-5437', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://www.nj.gov/health/fhs/eis/', source_url = 'https://www.nj.gov/health/fhs/eis/', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 10, evidence_level = 'official_locator_derived' WHERE id = 'nj-ei-mid-jersey-cares';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-helpful-hands' AND county_id = 'passaic-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-helpful-hands' AND county_id = 'hudson-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-helpful-hands' AND county_id = 'bergen-nj';
UPDATE state_resource_agencies SET state_id = 'new-jersey', agency_type = 'early_intervention', name = 'Helpful Hands REIC', counties_served = 'bergen-nj, hudson-nj, passaic-nj', catchment_boundaries = 'bergen-nj, hudson-nj, passaic-nj', website = 'https://www.nj.gov/health/fhs/eis/', intake_phone = '(973) 256-8484', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://www.nj.gov/health/fhs/eis/', source_url = 'https://www.nj.gov/health/fhs/eis/', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 10, evidence_level = 'official_locator_derived' WHERE id = 'nj-ei-helpful-hands';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'warren-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'union-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'sussex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'somerset-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'salem-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'passaic-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'ocean-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'morris-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'monmouth-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'middlesex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'mercer-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'hunterdon-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'hudson-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'gloucester-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'essex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'cumberland-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'cape-may-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'camden-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'burlington-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'bergen-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'atlantic-nj';
UPDATE state_resource_agencies SET state_id = 'new-jersey', agency_type = 'early_intervention', name = 'New Jersey Early Intervention System (NJEIS)', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://www.nj.gov/health/fhs/eis/', intake_phone = '1-888-653-4463', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://www.nj.gov/health/fhs/eis/', source_url = 'https://www.nj.gov/health/fhs/eis/', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 10, evidence_level = 'official_locator_derived' WHERE id = 'nj-ei-agency';

COMMIT;
