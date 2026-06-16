-- Rollback Script for State: Idaho | Phase: dd_idd
-- Generated At: 2026-06-14T15:46:51.638Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'washington-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'valley-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'twin-falls-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'teton-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'shoshone-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'power-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'payette-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'owyhee-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'oneida-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'nez-perce-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'minidoka-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'madison-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'lincoln-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'lewis-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'lemhi-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'latah-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'kootenai-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'jerome-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'jefferson-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'idaho-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'gooding-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'gem-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'fremont-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'franklin-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'elmore-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'custer-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'clearwater-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'clark-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'cassia-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'caribou-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'canyon-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'camas-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'butte-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'boundary-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'bonneville-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'bonner-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'boise-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'blaine-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'bingham-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'benewah-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'bear-lake-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'bannock-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'adams-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-dd-agency' AND county_id = 'ada-id';
UPDATE state_resource_agencies SET state_id = 'idaho', agency_type = 'dd_office', name = 'Idaho Department of Health and Welfare', counties_served = 'ada-id,adams-id,bannock-id,bear-lake-id,benewah-id,bingham-id,blaine-id,boise-id,bonner-id,bonneville-id,boundary-id,butte-id,camas-id,canyon-id,caribou-id,cassia-id,clark-id,clearwater-id,custer-id,elmore-id,franklin-id,fremont-id,gem-id,gooding-id,idaho-id,jefferson-id,jerome-id,kootenai-id,latah-id,lemhi-id,lewis-id,lincoln-id,madison-id,minidoka-id,nez-perce-id,oneida-id,owyhee-id,payette-id,power-id,shoshone-id,teton-id,twin-falls-id,valley-id,washington-id', catchment_boundaries = 'Statewide coverage for all counties in Idaho.', website = 'https://healthandwelfare.idaho.gov', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://healthandwelfare.idaho.gov/developmental-disabilities', services_page = 'https://healthandwelfare.idaho.gov', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Idaho State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://healthandwelfare.idaho.gov', source_url = 'https://healthandwelfare.idaho.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.540Z', confidence_score = 5, evidence_level = NULL WHERE id = 'id-dd-agency';

COMMIT;
