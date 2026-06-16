-- Rollback Script for State: South Carolina | Phase: dd_idd
-- Generated At: 2026-06-15T19:53:49.861Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'york-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'williamsburg-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'union-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'sumter-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'spartanburg-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'saluda-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'richland-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'pickens-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'orangeburg-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'oconee-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'newberry-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'mccormick-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'marlboro-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'marion-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'lexington-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'lee-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'laurens-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'lancaster-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'kershaw-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'jasper-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'horry-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'hampton-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'greenwood-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'greenville-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'georgetown-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'florence-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'fairfield-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'edgefield-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'dorchester-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'dillon-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'darlington-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'colleton-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'clarendon-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'chesterfield-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'chester-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'cherokee-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'charleston-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'calhoun-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'berkeley-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'beaufort-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'barnwell-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'bamberg-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'anderson-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'allendale-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'aiken-sc';
DELETE FROM regional_center_counties WHERE regional_center_id = 'sc-dd-agency' AND county_id = 'abbeville-sc';
UPDATE state_resource_agencies SET state_id = 'south-carolina', agency_type = 'dd_intake', name = 'South Carolina Developmental Services Intake', counties_served = 'statewide', catchment_boundaries = 'statewide', website = 'https://dhhs.south-carolina.gov/dd', intake_phone = '', early_intervention_contact = '', agency_intake_contact = '', eligibility_info_page = '', services_page = '', appeals_info = '', frc_relationship = NULL, office_locations = NULL, languages = '', last_verified_date = '2026-06-14', source_urls = 'https://dhhs.south-carolina.gov/dd', source_url = 'https://dhhs.south-carolina.gov/dd', source_type = 'official_website', data_origin = 'scraped', verification_status = 'source_listed', last_scraped_at = NULL, confidence_score = 9.5, evidence_level = 'official_locator_derived' WHERE id = 'sc-dd-agency';

COMMIT;
