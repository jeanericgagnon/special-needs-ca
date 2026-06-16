-- Rollback Script for State: Delaware | Phase: early_intervention
-- Generated At: 2026-06-15T21:51:24.712Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'de-ei-agency' AND county_id = 'sussex-de';
DELETE FROM regional_center_counties WHERE regional_center_id = 'de-ei-agency' AND county_id = 'new-castle-de';
DELETE FROM regional_center_counties WHERE regional_center_id = 'de-ei-agency' AND county_id = 'kent-de';
UPDATE state_resource_agencies SET state_id = 'delaware', agency_type = 'early_intervention', name = 'Delaware Early Intervention State Office', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.delaware.gov/earlystart', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.delaware.gov/earlystart', source_url = 'https://dhhs.delaware.gov/earlystart', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'de-ei-agency';

COMMIT;
