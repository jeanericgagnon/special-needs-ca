-- Rollback Script for State: Vermont | Phase: early_intervention
-- Generated At: 2026-06-15T21:56:19.814Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'windsor-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'windham-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'washington-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'rutland-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'orleans-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'orange-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'lamoille-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'grand-isle-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'franklin-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'essex-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'chittenden-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'caledonia-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'bennington-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'addison-vt';
UPDATE state_resource_agencies SET state_id = 'vermont', agency_type = 'early_intervention', name = 'Vermont Early Intervention State Office', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.vermont.gov/earlystart', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.vermont.gov/earlystart', source_url = 'https://dhhs.vermont.gov/earlystart', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'vt-ei-agency';

COMMIT;
