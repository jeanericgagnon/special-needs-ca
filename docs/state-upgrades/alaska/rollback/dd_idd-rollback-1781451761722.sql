-- Rollback Script for State: Alaska | Phase: dd_idd
-- Generated At: 2026-06-14T15:42:41.732Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'yakutat-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'wrangell-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'unorganized-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'skagway-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'sitka-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'petersburg-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'northwest-arctic-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'north-slope-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'matanuska-susitna-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'lake-and-peninsula-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'kodiak-island-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'ketchikan-gateway-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'kenai-peninsula-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'juneau-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'haines-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'fairbanks-north-star-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'denali-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'bristol-bay-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'anchorage-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-dd-agency' AND county_id = 'aleutians-east-borough-ak';
UPDATE state_resource_agencies SET state_id = 'alaska', agency_type = 'dd_office', name = 'Alaska Division of Senior and Disabilities Services', counties_served = 'aleutians-east-borough-ak,anchorage-ak,bristol-bay-borough-ak,denali-borough-ak,fairbanks-north-star-borough-ak,haines-borough-ak,juneau-ak,kenai-peninsula-borough-ak,ketchikan-gateway-borough-ak,kodiak-island-borough-ak,lake-and-peninsula-borough-ak,matanuska-susitna-borough-ak,north-slope-borough-ak,northwest-arctic-borough-ak,petersburg-borough-ak,sitka-ak,skagway-ak,unorganized-borough-ak,wrangell-ak,yakutat-ak', catchment_boundaries = 'Statewide coverage for all counties in Alaska.', website = 'https://dhss.alaska.gov/dsds', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://dhss.alaska.gov/dsds/Pages/dd/default.aspx', services_page = 'https://dhss.alaska.gov/dsds', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Alaska State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://dhss.alaska.gov/dsds', source_url = 'https://dhss.alaska.gov/dsds', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.535Z', confidence_score = 5, evidence_level = NULL WHERE id = 'ak-dd-agency';

COMMIT;
