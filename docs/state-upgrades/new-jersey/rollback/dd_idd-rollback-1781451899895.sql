-- Rollback Script for State: New Jersey | Phase: dd_idd
-- Generated At: 2026-06-14T15:44:59.906Z

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
UPDATE state_resource_agencies SET state_id = 'new-jersey', agency_type = 'dd_office', name = 'New Jersey Division of Developmental Disabilities', counties_served = 'atlantic-nj,bergen-nj,burlington-nj,camden-nj,cape-may-nj,cumberland-nj,essex-nj,gloucester-nj,hudson-nj,hunterdon-nj,mercer-nj,middlesex-nj,monmouth-nj,morris-nj,ocean-nj,passaic-nj,salem-nj,somerset-nj,sussex-nj,union-nj,warren-nj', catchment_boundaries = 'Statewide coverage for all counties in New Jersey.', website = 'https://www.nj.gov/humanservices/ddd', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://www.nj.gov/humanservices/ddd/services/apply/', services_page = 'https://www.nj.gov/humanservices/ddd', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'New Jersey State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://www.nj.gov/humanservices/ddd', source_url = 'https://www.nj.gov/humanservices/ddd', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.562Z', confidence_score = 5, evidence_level = NULL WHERE id = 'nj-dd-agency';

COMMIT;
