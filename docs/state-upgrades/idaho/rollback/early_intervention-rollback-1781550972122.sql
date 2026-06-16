-- Rollback Script for State: Idaho | Phase: early_intervention
-- Generated At: 2026-06-15T19:16:12.149Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'washington-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'valley-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'twin-falls-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'teton-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'shoshone-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'power-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'payette-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'owyhee-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'oneida-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'nez-perce-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'minidoka-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'madison-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'lincoln-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'lewis-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'lemhi-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'latah-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'kootenai-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'jerome-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'jefferson-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'idaho-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'gooding-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'gem-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'fremont-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'franklin-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'elmore-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'custer-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'clearwater-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'clark-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'cassia-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'caribou-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'canyon-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'camas-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'butte-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'boundary-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'bonneville-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'bonner-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'boise-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'blaine-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'bingham-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'benewah-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'bear-lake-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'bannock-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'adams-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'ada-id';
UPDATE state_resource_agencies SET state_id = 'idaho', agency_type = 'early_intervention', name = 'Idaho Early Intervention State Office', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.idaho.gov/earlystart', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.idaho.gov/earlystart', source_url = 'https://dhhs.idaho.gov/earlystart', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'id-ei-agency';

COMMIT;
