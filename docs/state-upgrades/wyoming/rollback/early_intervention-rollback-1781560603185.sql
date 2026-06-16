-- Rollback Script for State: Wyoming | Phase: early_intervention
-- Generated At: 2026-06-15T21:56:43.200Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'weston-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'washakie-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'uinta-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'teton-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'sweetwater-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'sublette-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'sheridan-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'platte-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'park-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'niobrara-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'natrona-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'lincoln-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'laramie-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'johnson-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'hot-springs-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'goshen-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'fremont-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'crook-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'converse-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'carbon-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'campbell-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'big-horn-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'albany-wy';
UPDATE state_resource_agencies SET state_id = 'wyoming', agency_type = 'early_intervention', name = 'Wyoming Early Intervention State Office', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.wyoming.gov/earlystart', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-15', source_urls = 'https://dhhs.wyoming.gov/earlystart', source_url = 'https://dhhs.wyoming.gov/earlystart', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'wy-ei-agency';

COMMIT;
