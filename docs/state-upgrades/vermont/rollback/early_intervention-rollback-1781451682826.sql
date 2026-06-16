-- Rollback Script for State: Vermont | Phase: early_intervention
-- Generated At: 2026-06-14T15:41:22.834Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'windsor-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'windham-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'washington-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'rutland-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'orleans-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'orange-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'lamoille-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'grand-isle-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'franklin-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'essex-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'chittenden-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'caledonia-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'bennington-vt';
DELETE FROM regional_center_counties WHERE regional_center_id = 'vt-ei-agency' AND county_id = 'addison-vt';
DELETE FROM state_resource_agencies WHERE id = 'vt-ei-agency';

COMMIT;
