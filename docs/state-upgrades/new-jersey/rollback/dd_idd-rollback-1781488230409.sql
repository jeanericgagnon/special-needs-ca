-- Rollback Script for State: New Jersey | Phase: dd_idd
-- Generated At: 2026-06-15T01:50:30.420Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'warren-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'union-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'sussex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'somerset-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'salem-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'passaic-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'ocean-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'morris-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'monmouth-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'middlesex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'mercer-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'hunterdon-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'hudson-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'gloucester-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'essex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'cumberland-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'cape-may-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'camden-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'burlington-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'bergen-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-dd-agency' AND county_id = 'atlantic-nj';
UPDATE state_resource_agencies SET state_id = 'new-jersey', agency_type = 'dd_intake', name = 'New Jersey Developmental Services Intake', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.new-jersey.gov/dd', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.new-jersey.gov/dd', source_url = 'https://dhhs.new-jersey.gov/dd', source_type = 'official_website', data_origin = 'scraped', verification_status = 'manual_review_required', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'nj-dd-agency';

COMMIT;
