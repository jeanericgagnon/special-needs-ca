-- Rollback Script for State: Rhode Island | Phase: dd_idd
-- Generated At: 2026-06-15T21:55:53.241Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-dd-agency' AND county_id = 'washington-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-dd-agency' AND county_id = 'providence-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-dd-agency' AND county_id = 'newport-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-dd-agency' AND county_id = 'kent-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-dd-agency' AND county_id = 'bristol-ri';
UPDATE state_resource_agencies SET state_id = 'rhode-island', agency_type = 'dd_intake', name = 'Rhode Island Developmental Services Intake', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.rhode-island.gov/dd', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.rhode-island.gov/dd', source_url = 'https://dhhs.rhode-island.gov/dd', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'ri-dd-agency';

COMMIT;
