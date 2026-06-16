-- Rollback Script for State: Washington | Phase: dd_idd
-- Generated At: 2026-06-14T15:46:34.929Z

BEGIN TRANSACTION;

DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'yakima-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'whitman-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'whatcom-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'walla-walla-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'wahkiakum-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'thurston-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'stevens-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'spokane-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'snohomish-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'skamania-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'skagit-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'san-juan-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'pierce-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'pend-oreille-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'pacific-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'okanogan-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'mason-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'lincoln-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'lewis-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'klickitat-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'kittitas-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'kitsap-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'king-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'jefferson-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'island-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'grays-harbor-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'grant-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'garfield-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'franklin-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'ferry-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'douglas-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'cowlitz-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'columbia-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'clark-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'clallam-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'chelan-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'benton-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'asotin-wa';
DELETE FROM regional_center_counties WHERE regional_center_id = 'wa-dd-agency' AND county_id = 'adams-wa';
UPDATE state_resource_agencies SET state_id = 'washington', agency_type = 'dd_office', name = 'Washington Developmental Disabilities Administration', counties_served = 'adams-wa,asotin-wa,benton-wa,chelan-wa,clallam-wa,clark-wa,columbia-wa,cowlitz-wa,douglas-wa,ferry-wa,franklin-wa,garfield-wa,grant-wa,grays-harbor-wa,island-wa,jefferson-wa,king-wa,kitsap-wa,kittitas-wa,klickitat-wa,lewis-wa,lincoln-wa,mason-wa,okanogan-wa,pacific-wa,pend-oreille-wa,pierce-wa,san-juan-wa,skagit-wa,skamania-wa,snohomish-wa,spokane-wa,stevens-wa,thurston-wa,wahkiakum-wa,walla-walla-wa,whatcom-wa,whitman-wa,yakima-wa', catchment_boundaries = 'Statewide coverage for all counties in Washington.', website = 'https://www.dshs.wa.gov/dda', intake_phone = '(800) 555-0100', early_intervention_contact = '(800) 555-0100', agency_intake_contact = '(800) 555-0100', eligibility_info_page = 'https://www.dshs.wa.gov/dda/eligibility', services_page = 'https://www.dshs.wa.gov/dda', appeals_info = 'Waiver decisions can be appealed within 30 days of notice.', frc_relationship = NULL, office_locations = 'Washington State Capitol Office', languages = 'English, Spanish', last_verified_date = '2026-06-12', source_urls = 'https://www.dshs.wa.gov/dda', source_url = 'https://www.dshs.wa.gov/dda', source_type = 'official', data_origin = 'curated_seed', verification_status = 'source_listed', last_scraped_at = '2026-06-13T02:29:27.577Z', confidence_score = 5, evidence_level = NULL WHERE id = 'wa-dd-agency';

COMMIT;
