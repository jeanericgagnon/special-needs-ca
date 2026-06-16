-- Rollback Script for State: Massachusetts | Phase: early_intervention
-- Generated At: 2026-06-15T21:53:44.068Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'worcester-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'suffolk-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'plymouth-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'norfolk-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'nantucket-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'middlesex-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'hampshire-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'hampden-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'franklin-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'essex-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'dukes-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'bristol-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'berkshire-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'barnstable-ma';
UPDATE state_resource_agencies SET state_id = 'massachusetts', agency_type = 'early_intervention', name = 'Massachusetts Early Intervention State Office', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.massachusetts.gov/earlystart', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.massachusetts.gov/earlystart', source_url = 'https://dhhs.massachusetts.gov/earlystart', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'ma-ei-agency';

COMMIT;
