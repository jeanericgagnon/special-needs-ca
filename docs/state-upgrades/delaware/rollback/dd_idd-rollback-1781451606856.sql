-- Rollback Script for State: Delaware | Phase: dd_idd
-- Generated At: 2026-06-14T15:40:06.865Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'de-dd-agency' AND county_id = 'sussex-de';
DELETE FROM regional_center_counties WHERE regional_center_id = 'de-dd-agency' AND county_id = 'new-castle-de';
DELETE FROM regional_center_counties WHERE regional_center_id = 'de-dd-agency' AND county_id = 'kent-de';
UPDATE state_resource_agencies SET state_id = 'delaware', agency_type = 'dd_office', name = 'Delaware Division of Developmental Disabilities Services', counties_served = 'kent-de,new-castle-de,sussex-de', catchment_boundaries = 'Statewide coverage for all counties in Delaware.', website = 'https://dhss.delaware.gov/ddds', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://dhss.delaware.gov/ddds/eligibility.html', services_page = 'https://dhss.delaware.gov/ddds', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Delaware State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://dhss.delaware.gov/ddds', source_url = 'https://dhss.delaware.gov/ddds', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.540Z', confidence_score = 5, evidence_level = NULL WHERE id = 'de-dd-agency';

COMMIT;
