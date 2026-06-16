-- Rollback Script for State: Maine | Phase: dd_idd
-- Generated At: 2026-06-14T15:42:09.642Z

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
UPDATE state_resource_agencies SET state_id = 'maine', agency_type = 'dd_office', name = 'Maine Office of Aging and Disability Services', counties_served = 'androscoggin-me,aroostook-me,cumberland-me,franklin-me,hancock-me,kennebec-me,knox-me,lincoln-me,oxford-me,penobscot-me,piscataquis-me,sagadahoc-me,somerset-me,waldo-me,washington-me,york-me', catchment_boundaries = 'Statewide coverage for all counties in Maine.', website = 'https://www.maine.gov/dhhs/oads', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://www.maine.gov/dhhs/oads/eligibility', services_page = 'https://www.maine.gov/dhhs/oads', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Maine State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://www.maine.gov/dhhs/oads', source_url = 'https://www.maine.gov/dhhs/oads', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.550Z', confidence_score = 5, evidence_level = NULL WHERE id = 'me-dd-agency';

COMMIT;
