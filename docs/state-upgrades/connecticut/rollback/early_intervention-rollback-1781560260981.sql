-- Rollback Script for State: Connecticut | Phase: early_intervention
-- Generated At: 2026-06-15T21:51:00.998Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'windham-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'tolland-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'new-london-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'new-haven-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'middlesex-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'litchfield-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'hartford-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'fairfield-ct';
UPDATE state_resource_agencies SET state_id = 'connecticut', agency_type = 'early_intervention', name = 'Connecticut Early Intervention State Office', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.connecticut.gov/earlystart', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.connecticut.gov/earlystart', source_url = 'https://dhhs.connecticut.gov/earlystart', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'ct-ei-agency';

COMMIT;
