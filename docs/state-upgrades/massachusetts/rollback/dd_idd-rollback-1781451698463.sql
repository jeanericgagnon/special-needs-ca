-- Rollback Script for State: Massachusetts | Phase: dd_idd
-- Generated At: 2026-06-14T15:41:38.474Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'worcester-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'suffolk-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'plymouth-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'norfolk-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'nantucket-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'middlesex-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'hampshire-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'hampden-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'franklin-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'essex-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'dukes-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'bristol-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'berkshire-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-dd-agency' AND county_id = 'barnstable-ma';
UPDATE state_resource_agencies SET state_id = 'massachusetts', agency_type = 'dd_office', name = 'Massachusetts Department of Developmental Services', counties_served = 'barnstable-ma,berkshire-ma,bristol-ma,dukes-ma,essex-ma,franklin-ma,hampden-ma,hampshire-ma,middlesex-ma,nantucket-ma,norfolk-ma,plymouth-ma,suffolk-ma,worcester-ma', catchment_boundaries = 'Statewide coverage for all counties in Massachusetts.', website = 'https://www.mass.gov/dds', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://www.mass.gov/dds-eligibility', services_page = 'https://www.mass.gov/dds', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Massachusetts State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://www.mass.gov/dds', source_url = 'https://www.mass.gov/dds', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.551Z', confidence_score = 5, evidence_level = NULL WHERE id = 'ma-dd-agency';

COMMIT;
