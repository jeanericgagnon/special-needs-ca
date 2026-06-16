-- Rollback Script for State: Maryland | Phase: early_intervention
-- Generated At: 2026-06-14T15:45:31.038Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'worcester-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'wicomico-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'washington-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'talbot-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'st-mary-s-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'somerset-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'queen-anne-s-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'prince-george-s-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'montgomery-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'kent-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'howard-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'harford-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'garrett-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'frederick-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'dorchester-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'charles-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'cecil-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'carroll-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'caroline-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'calvert-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'baltimore-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'baltimore-city-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'anne-arundel-md';
DELETE FROM regional_center_counties WHERE regional_center_id = 'md-ei-agency' AND county_id = 'allegany-md';
DELETE FROM state_resource_agencies WHERE id = 'md-ei-agency';

COMMIT;
