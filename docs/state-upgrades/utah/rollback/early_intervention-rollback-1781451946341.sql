-- Rollback Script for State: Utah | Phase: early_intervention
-- Generated At: 2026-06-14T15:45:46.351Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'weber-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'wayne-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'washington-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'wasatch-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'utah-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'uintah-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'tooele-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'summit-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'sevier-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'sanpete-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'san-juan-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'salt-lake-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'rich-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'piute-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'morgan-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'millard-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'kane-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'juab-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'iron-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'grand-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'garfield-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'emery-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'duchesne-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'davis-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'daggett-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'carbon-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'cache-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'box-elder-ut';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ut-ei-agency' AND county_id = 'beaver-ut';
DELETE FROM state_resource_agencies WHERE id = 'ut-ei-agency';

COMMIT;
