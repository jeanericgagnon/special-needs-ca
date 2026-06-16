-- Rollback Script for State: Vermont | Phase: dd_idd
-- Generated At: 2026-06-14T15:41:22.540Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'windsor-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'windham-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'washington-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'rutland-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'orleans-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'orange-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'lamoille-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'grand-isle-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'franklin-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'essex-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'chittenden-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'caledonia-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'bennington-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-dd-agency' AND county_id = 'addison-vt';
UPDATE state_resource_agencies SET state_id = 'vermont', agency_type = 'dd_office', name = 'Vermont Developmental Disabilities Services Division', counties_served = 'addison-vt,bennington-vt,caledonia-vt,chittenden-vt,essex-vt,franklin-vt,grand-isle-vt,lamoille-vt,orange-vt,orleans-vt,rutland-vt,washington-vt,windham-vt,windsor-vt', catchment_boundaries = 'Statewide coverage for all counties in Vermont.', website = 'https://ddsd.vermont.gov', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://ddsd.vermont.gov/eligibility', services_page = 'https://ddsd.vermont.gov', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Vermont State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://ddsd.vermont.gov', source_url = 'https://ddsd.vermont.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.575Z', confidence_score = 5, evidence_level = NULL WHERE id = 'vt-dd-agency';

COMMIT;
