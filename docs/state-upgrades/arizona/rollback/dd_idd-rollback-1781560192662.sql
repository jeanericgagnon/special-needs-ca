-- Rollback Script for State: Arizona | Phase: dd_idd
-- Generated At: 2026-06-15T21:49:52.686Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'yuma-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'yavapai-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'santa-cruz-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'pinal-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'pima-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'navajo-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'mohave-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'maricopa-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'la-paz-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'greenlee-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'graham-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'gila-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'coconino-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'cochise-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-dd-agency' AND county_id = 'apache-az';
UPDATE state_resource_agencies SET state_id = 'arizona', agency_type = 'dd_intake', name = 'Arizona Developmental Services Intake', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.arizona.gov/dd', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.arizona.gov/dd', source_url = 'https://dhhs.arizona.gov/dd', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'az-dd-agency';

COMMIT;
