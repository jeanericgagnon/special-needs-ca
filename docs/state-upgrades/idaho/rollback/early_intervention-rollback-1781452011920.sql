-- Rollback Script for State: Idaho | Phase: early_intervention
-- Generated At: 2026-06-14T15:46:51.929Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'washington-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'valley-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'twin-falls-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'teton-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'shoshone-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'power-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'payette-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'owyhee-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'oneida-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'nez-perce-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'minidoka-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'madison-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'lincoln-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'lewis-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'lemhi-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'latah-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'kootenai-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'jerome-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'jefferson-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'idaho-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'gooding-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'gem-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'fremont-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'franklin-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'elmore-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'custer-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'clearwater-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'clark-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'cassia-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'caribou-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'canyon-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'camas-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'butte-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'boundary-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'bonneville-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'bonner-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'boise-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'blaine-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'bingham-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'benewah-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'bear-lake-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'bannock-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'adams-id';
DELETE FROM regional_center_counties WHERE regional_center_id = 'id-ei-agency' AND county_id = 'ada-id';
DELETE FROM state_resource_agencies WHERE id = 'id-ei-agency';

COMMIT;
