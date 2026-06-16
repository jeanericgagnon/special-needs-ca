-- Rollback Script for State: New Mexico | Phase: early_intervention
-- Generated At: 2026-06-14T15:46:02.872Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'valencia-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'union-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'torrance-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'taos-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'socorro-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'sierra-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'santa-fe-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'sandoval-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'san-miguel-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'san-juan-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'roosevelt-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'rio-arriba-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'quay-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'otero-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'mora-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'mckinley-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'luna-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'los-alamos-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'lincoln-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'lea-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'hidalgo-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'harding-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'guadalupe-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'grant-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'eddy-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'do-a-ana-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'de-baca-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'curry-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'colfax-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'cibola-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'chaves-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'catron-nm';
DELETE FROM regional_center_counties WHERE regional_center_id = 'nm-ei-agency' AND county_id = 'bernalillo-nm';
DELETE FROM state_resource_agencies WHERE id = 'nm-ei-agency';

COMMIT;
