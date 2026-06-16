-- Rollback Script for State: Hawaii | Phase: early_intervention
-- Generated At: 2026-06-14T15:40:21.989Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-ei-agency' AND county_id = 'maui-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-ei-agency' AND county_id = 'kauai-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-ei-agency' AND county_id = 'kalawao-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-ei-agency' AND county_id = 'honolulu-hi';
DELETE FROM regional_center_counties WHERE regional_center_id = 'hi-ei-agency' AND county_id = 'hawai-i-hi';
DELETE FROM state_resource_agencies WHERE id = 'hi-ei-agency';

COMMIT;
