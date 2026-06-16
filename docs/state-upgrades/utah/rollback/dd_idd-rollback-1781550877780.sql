-- Rollback Script for State: Utah | Phase: dd_idd
-- Generated At: 2026-06-15T19:14:37.790Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'weber-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'wayne-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'washington-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'wasatch-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'utah-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'uintah-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'tooele-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'summit-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'sevier-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'sanpete-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'san-juan-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'salt-lake-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'rich-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'piute-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'morgan-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'millard-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'kane-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'juab-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'iron-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'grand-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'garfield-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'emery-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'duchesne-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'davis-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'daggett-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'carbon-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'cache-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'box-elder-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-dd-agency' AND county_id = 'beaver-ut';
UPDATE state_resource_agencies SET state_id = 'utah', agency_type = 'dd_intake', name = 'Utah Developmental Services Intake', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.utah.gov/dd', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.utah.gov/dd', source_url = 'https://dhhs.utah.gov/dd', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'ut-dd-agency';

COMMIT;
