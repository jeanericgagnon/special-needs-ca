-- Rollback Script for State: Wyoming | Phase: early_intervention
-- Generated At: 2026-06-14T15:45:15.573Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'weston-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'washakie-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'uinta-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'teton-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'sweetwater-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'sublette-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'sheridan-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'platte-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'park-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'niobrara-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'natrona-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'lincoln-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'laramie-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'johnson-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'hot-springs-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'goshen-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'fremont-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'crook-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'converse-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'carbon-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'campbell-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'big-horn-wy';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wy-ei-agency' AND county_id = 'albany-wy';
DELETE FROM state_resource_agencies WHERE id = 'wy-ei-agency';

COMMIT;
