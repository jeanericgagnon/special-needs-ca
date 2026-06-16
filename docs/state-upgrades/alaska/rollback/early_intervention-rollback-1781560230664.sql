-- Rollback Script for State: Alaska | Phase: early_intervention
-- Generated At: 2026-06-15T21:50:30.682Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'yakutat-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'wrangell-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'unorganized-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'skagway-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'sitka-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'petersburg-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'northwest-arctic-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'north-slope-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'matanuska-susitna-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'lake-and-peninsula-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'kodiak-island-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'ketchikan-gateway-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'kenai-peninsula-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'juneau-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'haines-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'fairbanks-north-star-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'denali-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'bristol-bay-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'anchorage-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'aleutians-east-borough-ak';
UPDATE state_resource_agencies SET state_id = 'alaska', agency_type = 'early_intervention', name = 'Alaska Early Intervention State Office', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.alaska.gov/earlystart', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.alaska.gov/earlystart', source_url = 'https://dhhs.alaska.gov/earlystart', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'ak-ei-agency';

COMMIT;
