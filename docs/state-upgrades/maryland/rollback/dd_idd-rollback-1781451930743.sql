-- Rollback Script for State: Maryland | Phase: dd_idd
-- Generated At: 2026-06-14T15:45:30.753Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'worcester-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'wicomico-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'washington-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'talbot-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'st-mary-s-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'somerset-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'queen-anne-s-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'prince-george-s-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'montgomery-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'kent-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'howard-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'harford-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'garrett-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'frederick-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'dorchester-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'charles-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'cecil-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'carroll-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'caroline-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'calvert-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'baltimore-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'baltimore-city-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'anne-arundel-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-dd-agency' AND county_id = 'allegany-md';
UPDATE state_resource_agencies SET state_id = 'maryland', agency_type = 'dd_office', name = 'Maryland Developmental Disabilities Administration', counties_served = 'allegany-md,anne-arundel-md,baltimore-md,baltimore-city-md,calvert-md,caroline-md,carroll-md,cecil-md,charles-md,dorchester-md,frederick-md,garrett-md,harford-md,howard-md,kent-md,montgomery-md,prince-george-s-md,queen-anne-s-md,somerset-md,st-mary-s-md,talbot-md,washington-md,wicomico-md,worcester-md', catchment_boundaries = 'Statewide coverage for all counties in Maryland.', website = 'https://dda.health.maryland.gov', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://dda.health.maryland.gov/Pages/Eligibility.aspx', services_page = 'https://dda.health.maryland.gov', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Maryland State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://dda.health.maryland.gov', source_url = 'https://dda.health.maryland.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.551Z', confidence_score = 5, evidence_level = NULL WHERE id = 'md-dd-agency';

COMMIT;
