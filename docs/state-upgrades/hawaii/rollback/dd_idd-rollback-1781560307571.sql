-- Rollback Script for State: Hawaii | Phase: dd_idd
-- Generated At: 2026-06-15T21:51:47.584Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-dd-agency' AND county_id = 'maui-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-dd-agency' AND county_id = 'kauai-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-dd-agency' AND county_id = 'kalawao-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-dd-agency' AND county_id = 'honolulu-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-dd-agency' AND county_id = 'hawai-i-hi';
UPDATE state_resource_agencies SET state_id = 'hawaii', agency_type = 'dd_intake', name = 'Hawaii Developmental Services Intake', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.hawaii.gov/dd', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.hawaii.gov/dd', source_url = 'https://dhhs.hawaii.gov/dd', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'hi-dd-agency';

COMMIT;
