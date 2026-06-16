-- Rollback Script for State: Hawaii | Phase: early_intervention
-- Generated At: 2026-06-15T21:51:48.000Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-ei-agency' AND county_id = 'maui-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-ei-agency' AND county_id = 'kauai-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-ei-agency' AND county_id = 'kalawao-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-ei-agency' AND county_id = 'honolulu-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-ei-agency' AND county_id = 'hawai-i-hi';
UPDATE state_resource_agencies SET state_id = 'hawaii', agency_type = 'early_intervention', name = 'Hawaii Early Intervention State Office', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.hawaii.gov/earlystart', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.hawaii.gov/earlystart', source_url = 'https://dhhs.hawaii.gov/earlystart', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'hi-ei-agency';

COMMIT;
