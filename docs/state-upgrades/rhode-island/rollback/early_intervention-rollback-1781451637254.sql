-- Rollback Script for State: Rhode Island | Phase: early_intervention
-- Generated At: 2026-06-14T15:40:37.262Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-ei-agency' AND county_id = 'washington-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-ei-agency' AND county_id = 'providence-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-ei-agency' AND county_id = 'newport-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-ei-agency' AND county_id = 'kent-ri';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ri-ei-agency' AND county_id = 'bristol-ri';
DELETE FROM state_resource_agencies WHERE id = 'ri-ei-agency';

COMMIT;
