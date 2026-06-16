-- Rollback Script for State: Delaware | Phase: early_intervention
-- Generated At: 2026-06-14T15:40:07.140Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'de-ei-agency' AND county_id = 'sussex-de';
DELETE FROM regional_center_counties WHERE regional_center_id = 'de-ei-agency' AND county_id = 'new-castle-de';
DELETE FROM regional_center_counties WHERE regional_center_id = 'de-ei-agency' AND county_id = 'kent-de';
DELETE FROM state_resource_agencies WHERE id = 'de-ei-agency';

COMMIT;
