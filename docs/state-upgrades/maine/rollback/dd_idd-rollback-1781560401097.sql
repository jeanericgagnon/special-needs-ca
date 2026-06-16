-- Rollback Script for State: Maine | Phase: dd_idd
-- Generated At: 2026-06-15T21:53:21.111Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'york-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'washington-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'waldo-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'somerset-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'sagadahoc-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'piscataquis-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'penobscot-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'oxford-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'lincoln-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'knox-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'kennebec-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'hancock-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'franklin-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'cumberland-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'aroostook-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-dd-agency' AND county_id = 'androscoggin-me';
UPDATE state_resource_agencies SET state_id = 'maine', agency_type = 'dd_intake', name = 'Maine Developmental Services Intake', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.maine.gov/dd', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.maine.gov/dd', source_url = 'https://dhhs.maine.gov/dd', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'me-dd-agency';

COMMIT;
