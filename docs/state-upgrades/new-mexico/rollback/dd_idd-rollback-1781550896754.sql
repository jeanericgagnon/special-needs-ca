-- Rollback Script for State: New Mexico | Phase: dd_idd
-- Generated At: 2026-06-15T19:14:56.766Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'valencia-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'union-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'torrance-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'taos-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'socorro-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'sierra-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'santa-fe-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'sandoval-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'san-miguel-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'san-juan-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'roosevelt-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'rio-arriba-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'quay-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'otero-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'mora-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'mckinley-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'luna-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'los-alamos-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'lincoln-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'lea-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'hidalgo-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'harding-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'guadalupe-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'grant-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'eddy-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'do-a-ana-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'de-baca-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'curry-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'colfax-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'cibola-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'chaves-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'catron-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-dd-agency' AND county_id = 'bernalillo-nm';
UPDATE state_resource_agencies SET state_id = 'new-mexico', agency_type = 'dd_intake', name = 'New Mexico Developmental Services Intake', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.new-mexico.gov/dd', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.new-mexico.gov/dd', source_url = 'https://dhhs.new-mexico.gov/dd', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'nm-dd-agency';

COMMIT;
