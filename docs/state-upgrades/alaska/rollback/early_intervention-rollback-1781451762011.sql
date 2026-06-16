-- Rollback Script for State: Alaska | Phase: early_intervention
-- Generated At: 2026-06-14T15:42:42.020Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'yakutat-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'wrangell-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'unorganized-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'skagway-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'sitka-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'petersburg-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'northwest-arctic-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'north-slope-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'matanuska-susitna-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'lake-and-peninsula-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'kodiak-island-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'ketchikan-gateway-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'kenai-peninsula-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'juneau-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'haines-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'fairbanks-north-star-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'denali-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'bristol-bay-borough-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'anchorage-ak';
DELETE FROM regional_center_counties WHERE regional_center_id = 'ak-ei-agency' AND county_id = 'aleutians-east-borough-ak';
DELETE FROM state_resource_agencies WHERE id = 'ak-ei-agency';

COMMIT;
