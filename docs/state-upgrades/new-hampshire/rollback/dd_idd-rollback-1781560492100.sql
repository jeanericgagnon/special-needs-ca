-- Rollback Script for State: New Hampshire | Phase: dd_idd
-- Generated At: 2026-06-15T21:54:52.116Z

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
UPDATE state_resource_agencies SET state_id = 'new-hampshire', agency_type = 'dd_intake', name = 'New Hampshire Developmental Services Intake', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.new-hampshire.gov/dd', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.new-hampshire.gov/dd', source_url = 'https://dhhs.new-hampshire.gov/dd', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'nh-dd-agency';

COMMIT;
