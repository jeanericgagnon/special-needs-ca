-- Rollback Script for State: Oregon | Phase: dd_idd
-- Generated At: 2026-06-14T15:46:18.842Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'yamhill-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'wheeler-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'washington-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'wasco-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'wallowa-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'union-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'umatilla-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'tillamook-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'sherman-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'polk-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'multnomah-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'morrow-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'marion-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'malheur-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'linn-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'lincoln-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'lane-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'lake-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'klamath-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'josephine-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'jefferson-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'jackson-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'hood-river-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'harney-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'grant-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'gilliam-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'douglas-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'deschutes-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'curry-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'crook-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'coos-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'columbia-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'clatsop-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'clackamas-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'benton-or';
DELETE FROM regional_center_counties WHERE regional_center_id = 'or-dd-agency' AND county_id = 'baker-or';
UPDATE state_resource_agencies SET state_id = 'oregon', agency_type = 'dd_office', name = 'Oregon Developmental Disability Services', counties_served = 'baker-or,benton-or,clackamas-or,clatsop-or,columbia-or,coos-or,crook-or,curry-or,deschutes-or,douglas-or,gilliam-or,grant-or,harney-or,hood-river-or,jackson-or,jefferson-or,josephine-or,klamath-or,lake-or,lane-or,lincoln-or,linn-or,malheur-or,marion-or,morrow-or,multnomah-or,polk-or,sherman-or,tillamook-or,umatilla-or,union-or,wallowa-or,wasco-or,washington-or,wheeler-or,yamhill-or', catchment_boundaries = 'Statewide coverage for all counties in Oregon.', website = 'https://www.oregon.gov/odhs/dds', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://www.oregon.gov/odhs/dds/pages/eligibility.aspx', services_page = 'https://www.oregon.gov/odhs/dds', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Oregon State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://www.oregon.gov/odhs/dds', source_url = 'https://www.oregon.gov/odhs/dds', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.569Z', confidence_score = 5, evidence_level = NULL WHERE id = 'or-dd-agency';

COMMIT;
