-- Rollback Script for State: Nevada | Phase: early_intervention
-- Generated At: 2026-06-14T15:42:26.124Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'white-pine-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'washoe-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'storey-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'pershing-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'nye-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'mineral-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'lyon-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'lincoln-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'lander-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'humboldt-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'eureka-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'esmeralda-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'elko-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'douglas-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'clark-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'churchill-nv';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nv-ei-agency' AND county_id = 'carson-city-nv';
DELETE FROM state_resource_agencies WHERE id = 'nv-ei-agency';

COMMIT;
