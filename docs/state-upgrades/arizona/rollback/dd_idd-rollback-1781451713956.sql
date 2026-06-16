-- Rollback Script for State: Arizona | Phase: dd_idd
-- Generated At: 2026-06-14T15:41:53.967Z

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
UPDATE state_resource_agencies SET state_id = 'arizona', agency_type = 'dd_office', name = 'Arizona Division of Developmental Disabilities', counties_served = 'apache-az,cochise-az,coconino-az,gila-az,graham-az,greenlee-az,la-paz-az,maricopa-az,mohave-az,navajo-az,pima-az,pinal-az,santa-cruz-az,yavapai-az,yuma-az', catchment_boundaries = 'Statewide coverage for all counties in Arizona.', website = 'https://des.az.gov/ddd', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://des.az.gov/services/developmental-disabilities/determine-eligibility', services_page = 'https://des.az.gov/ddd', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Arizona State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://des.az.gov/ddd', source_url = 'https://des.az.gov/ddd', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.536Z', confidence_score = 5, evidence_level = NULL WHERE id = 'az-dd-agency';

COMMIT;
