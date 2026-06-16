-- Rollback Script for State: Rhode Island | Phase: dd_idd
-- Generated At: 2026-06-14T15:40:36.968Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-dd-agency' AND county_id = 'washington-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-dd-agency' AND county_id = 'providence-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-dd-agency' AND county_id = 'newport-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-dd-agency' AND county_id = 'kent-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-dd-agency' AND county_id = 'bristol-ri';
UPDATE state_resource_agencies SET state_id = 'rhode-island', agency_type = 'dd_office', name = 'Rhode Island Division of Developmental Disabilities', counties_served = 'bristol-ri,kent-ri,newport-ri,providence-ri,washington-ri', catchment_boundaries = 'Statewide coverage for all counties in Rhode Island.', website = 'https://bhddh.ri.gov/developmental-disabilities', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://bhddh.ri.gov/developmental-disabilities/eligibility', services_page = 'https://bhddh.ri.gov/developmental-disabilities', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Rhode Island State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://bhddh.ri.gov/developmental-disabilities', source_url = 'https://bhddh.ri.gov/developmental-disabilities', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.570Z', confidence_score = 5, evidence_level = NULL WHERE id = 'ri-dd-agency';

COMMIT;
