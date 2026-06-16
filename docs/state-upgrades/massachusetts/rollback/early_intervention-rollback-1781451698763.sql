-- Rollback Script for State: Massachusetts | Phase: early_intervention
-- Generated At: 2026-06-14T15:41:38.772Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'worcester-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'suffolk-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'plymouth-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'norfolk-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'nantucket-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'middlesex-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'hampshire-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'hampden-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'franklin-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'essex-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'dukes-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'bristol-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'berkshire-ma';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ma-ei-agency' AND county_id = 'barnstable-ma';
DELETE FROM state_resource_agencies WHERE id = 'ma-ei-agency';

COMMIT;
