-- Rollback Script for State: Connecticut | Phase: early_intervention
-- Generated At: 2026-06-14T15:40:52.174Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'windham-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'tolland-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'new-london-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'new-haven-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'middlesex-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'litchfield-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'hartford-ct';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ct-ei-agency' AND county_id = 'fairfield-ct';
DELETE FROM state_resource_agencies WHERE id = 'ct-ei-agency';

COMMIT;
