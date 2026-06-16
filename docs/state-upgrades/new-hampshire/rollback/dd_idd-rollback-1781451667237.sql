-- Rollback Script for State: New Hampshire | Phase: dd_idd
-- Generated At: 2026-06-14T15:41:07.248Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-dd-agency' AND county_id = 'sullivan-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-dd-agency' AND county_id = 'strafford-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-dd-agency' AND county_id = 'rockingham-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-dd-agency' AND county_id = 'merrimack-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-dd-agency' AND county_id = 'hillsborough-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-dd-agency' AND county_id = 'grafton-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-dd-agency' AND county_id = 'co-s-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-dd-agency' AND county_id = 'cheshire-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-dd-agency' AND county_id = 'carroll-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-dd-agency' AND county_id = 'belknap-nh';
UPDATE state_resource_agencies SET state_id = 'new-hampshire', agency_type = 'dd_office', name = 'New Hampshire Bureau of Developmental Services', counties_served = 'belknap-nh,carroll-nh,cheshire-nh,co-s-nh,grafton-nh,hillsborough-nh,merrimack-nh,rockingham-nh,strafford-nh,sullivan-nh', catchment_boundaries = 'Statewide coverage for all counties in New Hampshire.', website = 'https://www.dhhs.nh.gov/bds', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://www.dhhs.nh.gov/bds/eligibility', services_page = 'https://www.dhhs.nh.gov/bds', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'New Hampshire State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://www.dhhs.nh.gov/bds', source_url = 'https://www.dhhs.nh.gov/bds', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.562Z', confidence_score = 5, evidence_level = NULL WHERE id = 'nh-dd-agency';

COMMIT;
