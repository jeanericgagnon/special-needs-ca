-- Rollback Script for State: Wyoming | Phase: dd_idd
-- Generated At: 2026-06-14T15:45:15.288Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'weston-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'washakie-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'uinta-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'teton-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'sweetwater-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'sublette-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'sheridan-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'platte-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'park-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'niobrara-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'natrona-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'lincoln-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'laramie-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'johnson-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'hot-springs-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'goshen-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'fremont-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'crook-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'converse-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'carbon-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'campbell-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'big-horn-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-dd-agency' AND county_id = 'albany-wy';
UPDATE state_resource_agencies SET state_id = 'wyoming', agency_type = 'dd_office', name = 'Wyoming Developmental Disabilities Division', counties_served = 'albany-wy,big-horn-wy,campbell-wy,carbon-wy,converse-wy,crook-wy,fremont-wy,goshen-wy,hot-springs-wy,johnson-wy,laramie-wy,lincoln-wy,natrona-wy,niobrara-wy,park-wy,platte-wy,sheridan-wy,sublette-wy,sweetwater-wy,teton-wy,uinta-wy,washakie-wy,weston-wy', catchment_boundaries = 'Statewide coverage for all counties in Wyoming.', website = 'https://health.wyo.gov/behavioralhealth/dd', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://health.wyo.gov/behavioralhealth/dd/eligibility', services_page = 'https://health.wyo.gov/behavioralhealth/dd', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Wyoming State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://health.wyo.gov/behavioralhealth/dd', source_url = 'https://health.wyo.gov/behavioralhealth/dd', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.580Z', confidence_score = 5, evidence_level = NULL WHERE id = 'wy-dd-agency';

COMMIT;
