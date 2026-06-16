-- Rollback Script for State: Maine | Phase: early_intervention
-- Generated At: 2026-06-14T15:42:09.940Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'york-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'washington-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'waldo-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'somerset-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'sagadahoc-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'piscataquis-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'penobscot-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'oxford-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'lincoln-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'knox-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'kennebec-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'hancock-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'franklin-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'cumberland-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'aroostook-me';
DELETE FROM regional_center_counties WHERE regional_center_id = 'me-ei-agency' AND county_id = 'androscoggin-me';
DELETE FROM state_resource_agencies WHERE id = 'me-ei-agency';

COMMIT;
