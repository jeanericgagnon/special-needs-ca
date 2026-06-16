-- Rollback Script for State: New Hampshire | Phase: early_intervention
-- Generated At: 2026-06-14T15:41:07.538Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-ei-agency' AND county_id = 'sullivan-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-ei-agency' AND county_id = 'strafford-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-ei-agency' AND county_id = 'rockingham-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-ei-agency' AND county_id = 'merrimack-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-ei-agency' AND county_id = 'hillsborough-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-ei-agency' AND county_id = 'grafton-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-ei-agency' AND county_id = 'co-s-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-ei-agency' AND county_id = 'cheshire-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-ei-agency' AND county_id = 'carroll-nh';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nh-ei-agency' AND county_id = 'belknap-nh';
DELETE FROM state_resource_agencies WHERE id = 'nh-ei-agency';

COMMIT;
