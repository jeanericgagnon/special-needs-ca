-- Rollback Script for State: Washington | Phase: early_intervention
-- Generated At: 2026-06-14T15:46:35.314Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'yakima-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'whitman-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'whatcom-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'walla-walla-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'wahkiakum-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'thurston-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'stevens-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'spokane-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'snohomish-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'skamania-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'skagit-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'san-juan-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'pierce-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'pend-oreille-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'pacific-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'okanogan-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'mason-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'lincoln-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'lewis-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'klickitat-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'kittitas-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'kitsap-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'king-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'jefferson-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'island-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'grays-harbor-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'grant-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'garfield-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'franklin-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'ferry-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'douglas-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'cowlitz-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'columbia-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'clark-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'clallam-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'chelan-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'benton-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'asotin-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-ei-agency' AND county_id = 'adams-wa';
DELETE FROM state_resource_agencies WHERE id = 'wa-ei-agency';

COMMIT;
