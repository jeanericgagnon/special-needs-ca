-- Rollback Script for State: Nevada | Phase: dd_idd
-- Generated At: 2026-06-14T15:42:25.804Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'white-pine-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'washoe-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'storey-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'pershing-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'nye-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'mineral-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'lyon-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'lincoln-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'lander-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'humboldt-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'eureka-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'esmeralda-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'elko-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'douglas-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'clark-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'churchill-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-dd-agency' AND county_id = 'carson-city-nv';
UPDATE state_resource_agencies SET state_id = 'nevada', agency_type = 'dd_office', name = 'Nevada Aging and Disability Services Division', counties_served = 'carson-city-nv,churchill-nv,clark-nv,douglas-nv,elko-nv,esmeralda-nv,eureka-nv,humboldt-nv,lander-nv,lincoln-nv,lyon-nv,mineral-nv,nye-nv,pershing-nv,storey-nv,washoe-nv,white-pine-nv', catchment_boundaries = 'Statewide coverage for all counties in Nevada.', website = 'https://adsd.nv.gov', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://adsd.nv.gov/Programs/Intellectual/Intellectual/', services_page = 'https://adsd.nv.gov', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Nevada State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://adsd.nv.gov', source_url = 'https://adsd.nv.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.561Z', confidence_score = 5, evidence_level = NULL WHERE id = 'nv-dd-agency';

COMMIT;
