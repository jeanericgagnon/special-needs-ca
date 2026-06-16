-- Rollback Script for State: South Carolina | Phase: dd_idd
-- Generated At: 2026-06-14T15:47:09.296Z

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
UPDATE state_resource_agencies SET state_id = 'south-carolina', agency_type = 'dd_office', name = 'South Carolina Department of Disabilities and Special Needs', counties_served = 'abbeville-sc,aiken-sc,allendale-sc,anderson-sc,bamberg-sc,barnwell-sc,beaufort-sc,berkeley-sc,calhoun-sc,charleston-sc,cherokee-sc,chester-sc,chesterfield-sc,clarendon-sc,colleton-sc,darlington-sc,dillon-sc,dorchester-sc,edgefield-sc,fairfield-sc,florence-sc,georgetown-sc,greenville-sc,greenwood-sc,hampton-sc,horry-sc,jasper-sc,kershaw-sc,lancaster-sc,laurens-sc,lee-sc,lexington-sc,mccormick-sc,marion-sc,marlboro-sc,newberry-sc,oconee-sc,orangeburg-sc,pickens-sc,richland-sc,saluda-sc,spartanburg-sc,sumter-sc,union-sc,williamsburg-sc,york-sc', catchment_boundaries = 'Statewide coverage for all counties in South Carolina.', website = 'https://ddsn.sc.gov', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://ddsn.sc.gov/consumers/eligibility', services_page = 'https://ddsn.sc.gov', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'South Carolina State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://ddsn.sc.gov', source_url = 'https://ddsn.sc.gov', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.570Z', confidence_score = 5, evidence_level = NULL WHERE id = 'sc-dd-agency';

COMMIT;
