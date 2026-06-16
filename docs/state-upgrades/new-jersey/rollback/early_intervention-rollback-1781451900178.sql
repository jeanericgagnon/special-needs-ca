-- Rollback Script for State: New Jersey | Phase: early_intervention
-- Generated At: 2026-06-14T15:45:00.187Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'warren-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'union-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'sussex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'somerset-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'salem-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'passaic-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'ocean-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'morris-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'monmouth-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'middlesex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'mercer-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'hunterdon-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'hudson-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'gloucester-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'essex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'cumberland-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'cape-may-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'camden-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'burlington-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'bergen-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ei-agency' AND county_id = 'atlantic-nj';
DELETE FROM state_resource_agencies WHERE id = 'nj-ei-agency';

COMMIT;
