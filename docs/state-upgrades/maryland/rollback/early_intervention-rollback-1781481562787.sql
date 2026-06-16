-- Rollback Script for State: Maryland | Phase: early_intervention
-- Generated At: 2026-06-14T23:59:22.814Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'worcester-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'wicomico-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'washington-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'talbot-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'st-mary-s-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'somerset-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'queen-anne-s-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'prince-george-s-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'montgomery-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'kent-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'howard-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'harford-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'garrett-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'frederick-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'dorchester-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'charles-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'cecil-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'carroll-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'caroline-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'calvert-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'baltimore-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'baltimore-city-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'anne-arundel-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'allegany-md';
UPDATE state_resource_agencies SET state_id = 'maryland', agency_type = 'early_intervention', name = 'Maryland Early Intervention State Office', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.maryland.gov/earlystart', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.maryland.gov/earlystart', source_url = 'https://dhhs.maryland.gov/earlystart', source_type = 'official_website', data_origin = 'scraped', verification_status = 'manual_review_required', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'md-ei-agency';

COMMIT;
