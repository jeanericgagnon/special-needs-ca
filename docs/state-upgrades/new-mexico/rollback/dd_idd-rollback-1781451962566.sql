-- Rollback Script for State: New Mexico | Phase: dd_idd
-- Generated At: 2026-06-14T15:46:02.575Z

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
UPDATE state_resource_agencies SET state_id = 'new-mexico', agency_type = 'dd_office', name = 'New Mexico Developmental Disabilities Division', counties_served = 'bernalillo-nm,catron-nm,chaves-nm,cibola-nm,colfax-nm,curry-nm,de-baca-nm,do-a-ana-nm,eddy-nm,grant-nm,guadalupe-nm,harding-nm,hidalgo-nm,lea-nm,lincoln-nm,los-alamos-nm,luna-nm,mckinley-nm,mora-nm,otero-nm,quay-nm,rio-arriba-nm,roosevelt-nm,sandoval-nm,san-juan-nm,san-miguel-nm,santa-fe-nm,sierra-nm,socorro-nm,taos-nm,torrance-nm,union-nm,valencia-nm', catchment_boundaries = 'Statewide coverage for all counties in New Mexico.', website = 'https://www.nmhealth.org/about/ddsd', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://www.nmhealth.org/about/ddsd/eligibility', services_page = 'https://www.nmhealth.org/about/ddsd', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'New Mexico State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://www.nmhealth.org/about/ddsd', source_url = 'https://www.nmhealth.org/about/ddsd', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.563Z', confidence_score = 5, evidence_level = NULL WHERE id = 'nm-dd-agency';

COMMIT;
