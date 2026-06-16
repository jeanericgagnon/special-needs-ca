-- Rollback Script for State: Arizona | Phase: early_intervention
-- Generated At: 2026-06-14T15:41:54.261Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'yuma-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'yavapai-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'santa-cruz-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'pinal-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'pima-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'navajo-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'mohave-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'maricopa-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'la-paz-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'greenlee-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'graham-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'gila-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'coconino-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'cochise-az';
DELETE FROM regional_center_counties WHERE regional_center_id = 'az-ei-agency' AND county_id = 'apache-az';
DELETE FROM state_resource_agencies WHERE id = 'az-ei-agency';

COMMIT;
