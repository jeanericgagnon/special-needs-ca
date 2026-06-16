-- Rollback Script for State: New Jersey | Phase: dd_idd
-- Generated At: 2026-06-14T22:48:42.471Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-voorhees' AND county_id = 'gloucester-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-voorhees' AND county_id = 'camden-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-voorhees' AND county_id = 'burlington-nj';
DELETE FROM state_resource_agencies WHERE id = 'nj-ddd-voorhees';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-egg-harbor' AND county_id = 'salem-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-egg-harbor' AND county_id = 'cumberland-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-egg-harbor' AND county_id = 'cape-may-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-egg-harbor' AND county_id = 'atlantic-nj';
DELETE FROM state_resource_agencies WHERE id = 'nj-ddd-egg-harbor';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-trenton' AND county_id = 'middlesex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-trenton' AND county_id = 'mercer-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-trenton' AND county_id = 'hunterdon-nj';
DELETE FROM state_resource_agencies WHERE id = 'nj-ddd-trenton';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-freehold' AND county_id = 'monmouth-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-freehold' AND county_id = 'ocean-nj';
DELETE FROM state_resource_agencies WHERE id = 'nj-ddd-freehold';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-green-brook' AND county_id = 'somerset-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-green-brook' AND county_id = 'union-nj';
DELETE FROM state_resource_agencies WHERE id = 'nj-ddd-green-brook';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-newark' AND county_id = 'essex-nj';
DELETE FROM state_resource_agencies WHERE id = 'nj-ddd-newark';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-paterson' AND county_id = 'passaic-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-paterson' AND county_id = 'hudson-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-paterson' AND county_id = 'bergen-nj';
DELETE FROM state_resource_agencies WHERE id = 'nj-ddd-paterson';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-flanders' AND county_id = 'warren-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-flanders' AND county_id = 'sussex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-flanders' AND county_id = 'morris-nj';
DELETE FROM state_resource_agencies WHERE id = 'nj-ddd-flanders';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'warren-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'union-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'sussex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'somerset-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'salem-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'passaic-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'ocean-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'morris-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'monmouth-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'middlesex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'mercer-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'hunterdon-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'hudson-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'gloucester-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'essex-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'cumberland-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'cape-may-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'camden-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'burlington-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'bergen-nj';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nj-ddd-admin' AND county_id = 'atlantic-nj';
DELETE FROM state_resource_agencies WHERE id = 'nj-ddd-admin';

COMMIT;
