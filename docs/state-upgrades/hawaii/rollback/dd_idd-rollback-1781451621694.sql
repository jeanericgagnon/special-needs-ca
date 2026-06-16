-- Rollback Script for State: Hawaii | Phase: dd_idd
-- Generated At: 2026-06-14T15:40:21.703Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-dd-agency' AND county_id = 'maui-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-dd-agency' AND county_id = 'kauai-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-dd-agency' AND county_id = 'kalawao-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-dd-agency' AND county_id = 'honolulu-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-dd-agency' AND county_id = 'hawai-i-hi';
UPDATE state_resource_agencies SET state_id = 'hawaii', agency_type = 'dd_office', name = 'Hawaii Developmental Disabilities Division', counties_served = 'hawai-i-hi,honolulu-hi,kalawao-hi,kauai-hi,maui-hi', catchment_boundaries = 'Statewide coverage for all counties in Hawaii.', website = 'https://health.hawaii.gov/ddd', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://health.hawaii.gov/ddd/eligibility/', services_page = 'https://health.hawaii.gov/ddd', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Hawaii State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://health.hawaii.gov/ddd', source_url = 'https://health.hawaii.gov/ddd', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.540Z', confidence_score = 5, evidence_level = NULL WHERE id = 'hi-dd-agency';

COMMIT;
