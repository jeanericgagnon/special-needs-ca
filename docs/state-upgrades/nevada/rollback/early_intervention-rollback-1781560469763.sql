-- Rollback Script for State: Nevada | Phase: early_intervention
-- Generated At: 2026-06-15T21:54:29.776Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'white-pine-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'washoe-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'storey-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'pershing-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'nye-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'mineral-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'lyon-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'lincoln-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'lander-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'humboldt-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'eureka-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'esmeralda-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'elko-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'douglas-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'clark-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'churchill-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'carson-city-nv';
UPDATE state_resource_agencies SET state_id = 'nevada', agency_type = 'early_intervention', name = 'Nevada Early Intervention State Office', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.nevada.gov/earlystart', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.nevada.gov/earlystart', source_url = 'https://dhhs.nevada.gov/earlystart', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'nv-ei-agency';

COMMIT;
