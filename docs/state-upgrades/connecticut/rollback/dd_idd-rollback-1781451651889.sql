-- Rollback Script for State: Connecticut | Phase: dd_idd
-- Generated At: 2026-06-14T15:40:51.898Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-dd-agency' AND county_id = 'windham-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-dd-agency' AND county_id = 'tolland-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-dd-agency' AND county_id = 'new-london-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-dd-agency' AND county_id = 'new-haven-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-dd-agency' AND county_id = 'middlesex-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-dd-agency' AND county_id = 'litchfield-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-dd-agency' AND county_id = 'hartford-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-dd-agency' AND county_id = 'fairfield-ct';
UPDATE state_resource_agencies SET state_id = 'connecticut', agency_type = 'dd_office', name = 'Connecticut Department of Developmental Services', counties_served = 'fairfield-ct,hartford-ct,litchfield-ct,middlesex-ct,new-haven-ct,new-london-ct,tolland-ct,windham-ct', catchment_boundaries = 'Statewide coverage for all counties in Connecticut.', website = 'https://portal.ct.gov/dds', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://portal.ct.gov/dds/eligibility', services_page = 'https://portal.ct.gov/dds', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Connecticut State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://portal.ct.gov/dds', source_url = 'https://portal.ct.gov/dds', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.539Z', confidence_score = 5, evidence_level = NULL WHERE id = 'ct-dd-agency';

COMMIT;
