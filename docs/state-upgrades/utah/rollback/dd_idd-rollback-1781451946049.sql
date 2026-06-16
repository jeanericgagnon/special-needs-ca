-- Rollback Script for State: Utah | Phase: dd_idd
-- Generated At: 2026-06-14T15:45:46.058Z

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
UPDATE state_resource_agencies SET state_id = 'utah', agency_type = 'dd_office', name = 'Utah Division of Services for People with Disabilities', counties_served = 'beaver-ut,box-elder-ut,cache-ut,carbon-ut,daggett-ut,davis-ut,duchesne-ut,emery-ut,garfield-ut,grand-ut,iron-ut,juab-ut,kane-ut,millard-ut,morgan-ut,piute-ut,rich-ut,salt-lake-ut,san-juan-ut,sanpete-ut,sevier-ut,summit-ut,tooele-ut,uintah-ut,utah-ut,wasatch-ut,washington-ut,wayne-ut,weber-ut', catchment_boundaries = 'Statewide coverage for all counties in Utah.', website = 'https://dspd.utah.gov', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://dspd.utah.gov/eligibility', services_page = 'https://dspd.utah.gov', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Utah State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://dspd.utah.gov', source_url = 'https://dspd.utah.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.574Z', confidence_score = 5, evidence_level = NULL WHERE id = 'ut-dd-agency';

COMMIT;
