-- Rollback Script for State: Oregon | Phase: early_intervention
-- Generated At: 2026-06-15T19:15:16.226Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'yamhill-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'wheeler-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'washington-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'wasco-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'wallowa-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'union-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'umatilla-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'tillamook-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'sherman-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'polk-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'multnomah-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'morrow-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'marion-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'malheur-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'linn-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'lincoln-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'lane-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'lake-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'klamath-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'josephine-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'jefferson-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'jackson-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'hood-river-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'harney-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'grant-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'gilliam-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'douglas-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'deschutes-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'curry-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'crook-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'coos-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'columbia-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'clatsop-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'clackamas-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'benton-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-ei-agency' AND county_id = 'baker-or';
UPDATE state_resource_agencies SET state_id = 'oregon', agency_type = 'early_intervention', name = 'Oregon Early Intervention State Office', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.oregon.gov/earlystart', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.oregon.gov/earlystart', source_url = 'https://dhhs.oregon.gov/earlystart', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'or-ei-agency';

COMMIT;
