-- Rollback Script for State: Washington | Phase: dd_idd
-- Generated At: 2026-06-15T00:03:12.297Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'yakima-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'whitman-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'whatcom-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'walla-walla-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'wahkiakum-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'thurston-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'stevens-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'spokane-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'snohomish-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'skamania-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'skagit-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'san-juan-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'pierce-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'pend-oreille-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'pacific-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'okanogan-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'mason-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'lincoln-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'lewis-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'klickitat-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'kittitas-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'kitsap-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'king-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'jefferson-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'island-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'grays-harbor-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'grant-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'garfield-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'franklin-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'ferry-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'douglas-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'cowlitz-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'columbia-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'clark-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'clallam-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'chelan-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'benton-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'asotin-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'adams-wa';
UPDATE state_resource_agencies SET state_id = 'washington', agency_type = 'dd_intake', name = 'Washington Developmental Services Intake', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.washington.gov/dd', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.washington.gov/dd', source_url = 'https://dhhs.washington.gov/dd', source_type = 'official_website', data_origin = 'scraped', verification_status = 'manual_review_required', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'wa-dd-agency';

COMMIT;
