import sqlite3
import shutil
import os

db_path = "ca_disability_navigator.db"
frontend_db_path = "frontend/ca_disability_navigator.db"

print("====================================================")
print("⚙️ STARTING DATABASE QUALITY REPAIR TRANSACTION")
print("====================================================")

conn = sqlite3.connect(db_path)
conn.execute("PRAGMA foreign_keys = ON;")

try:
    with conn:
        cursor = conn.cursor()
        
        # --------------------------------------------------
        # ORDER 1: New York Recovery
        # --------------------------------------------------
        print("\n[ORDER 1] Repairing New York...")
        
        # 1. Update 12 county Medicaid/LDSS offices
        ny_offices_data = [
            ('off-albany-ny-medicaid', '(518) 447-7300', 'https://www.albanycounty.com/departments/social-services'),
            ('off-erie-ny-medicaid', '(716) 858-8000', 'https://www.erie.gov/socialservices'),
            ('off-monroe-ny-medicaid', '(585) 753-2760', 'https://www.monroecounty.gov/hs-socialservices'),
            ('off-nassau-ny-medicaid', '(516) 227-8519', 'https://www.nassaucountyny.gov/departments/social-services'),
            ('off-onondaga-ny-medicaid', '(315) 435-2985', 'http://www.ongov.net/dss/'),
            ('off-suffolk-ny-medicaid', '(631) 854-9930', 'https://www.suffolkcountyny.gov/departments/social-services'),
            ('off-westchester-ny-medicaid', '(914) 995-3333', 'https://socialservices.westchestergov.com/'),
            ('off-bronx-ny-medicaid', '(718) 557-1399', 'https://www.nyc.gov/site/hra/index.page'),
            ('off-kings-ny-medicaid', '(718) 557-1399', 'https://www.nyc.gov/site/hra/index.page'),
            ('off-new-york-ny-medicaid', '(718) 557-1399', 'https://www.nyc.gov/site/hra/index.page'),
            ('off-queens-ny-medicaid', '(718) 557-1399', 'https://www.nyc.gov/site/hra/index.page'),
            ('off-richmond-ny-medicaid', '(718) 557-1399', 'https://www.nyc.gov/site/hra/index.page')
        ]
        
        for office_id, phone, website in ny_offices_data:
            cursor.execute("""
                UPDATE county_offices
                SET phone = ?, website = ?, source_url = 'https://www.health.ny.gov/health_care/medicaid/ldss.htm',
                    verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
                WHERE id = ?
            """, (phone, website, office_id))
        print(f"  - Updated {len(ny_offices_data)} New York LDSS Medicaid offices.")

        # 2. Update 10 high-population school district BOCES contacts
        ny_boces_data = [
            ('sd-rockland-ny', 'Rockland BOCES - Special Education', '(845) 627-4700', 'https://www.rocklandboces.org'),
            ('sd-orange-ny', 'Orange-Ulster BOCES - Special Education', '(845) 291-0100', 'https://www.ouboces.org'),
            ('sd-dutchess-ny', 'Dutchess BOCES - Special Education', '(845) 486-4800', 'https://www.dutchesseboces.org'),
            ('sd-niagara-ny', 'Orleans/Niagara BOCES - Special Education', '(716) 731-6800', 'https://www.onboces.org'),
            ('sd-oneida-ny', 'Oneida-Herkimer-Madison BOCES - Special Education', '(315) 793-8500', 'https://www.oneida-boces.org'),
            ('sd-saratoga-ny', 'WSWHE BOCES - Special Education', '(518) 581-3700', 'https://www.wswheboces.org'),
            ('sd-schenectady-ny', 'Capital Region BOCES - Special Education', '(518) 862-4900', 'https://www.capitalregionboces.org'),
            ('sd-rensselaer-ny', 'Questar III BOCES - Special Education', '(518) 477-8771', 'https://www.questar.org'),
            ('sd-ulster-ny', 'Ulster BOCES - Special Education', '(845) 255-3040', 'https://www.ulsterboces.org'),
            ('sd-broome-ny', 'Broome-Tioga BOCES - Special Education', '(607) 763-3300', 'https://www.btboces.org')
        ]
        
        for sd_id, name, phone, website in ny_boces_data:
            cursor.execute("""
                UPDATE school_districts
                SET name = ?, spec_ed_contact_phone = ?, website = ?, source_url = ?,
                    verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
                WHERE id = ?
            """, (name, phone, website, website, sd_id))
        print(f"  - Updated {len(ny_boces_data)} New York school district BOCES contacts.")

        # 3. Seed 5 trusted nonprofits in New York
        ny_nonprofits = [
            ('np-disability-rights-ny', 'Disability Rights New York (DRNY)', 'albany-ny', 'https://www.drny.org', '(518) 432-7861'),
            ('np-parent-network-wny', 'Parent Network of Western New York (WNY)', 'erie-ny', 'https://parentnetworkwny.org', '(716) 332-4170'),
            ('np-includenyc-ny', 'INCLUDEnyc', 'new-york-ny', 'https://www.includenyc.org', '(212) 677-4650'),
            ('np-starbridge-ny', 'Starbridge Services', 'monroe-ny', 'https://www.starbridgeinc.org', '(585) 546-1800'),
            ('np-arc-ny', 'The Arc New York', 'albany-ny', 'https://www.thearcny.org', '(518) 439-8311')
        ]
        
        # Clear existing nonprofits in NY to prevent duplicate keys
        cursor.execute("DELETE FROM nonprofit_organizations WHERE county_id LIKE '%-ny'")
        
        for np_id, name, county, website, phone in ny_nonprofits:
            cursor.execute("""
                INSERT INTO nonprofit_organizations (
                    id, name, county_id, website, phone, focus_condition,
                    source_url, source_type, data_origin, verification_status, confidence_score
                ) VALUES (?, ?, ?, ?, ?, 'developmental_disabilities', ?, 'official_advocacy', 'curated_seed', 'official_verified', 9.5)
            """, (np_id, name, county, website, phone, website))
        print(f"  - Seeded {len(ny_nonprofits)} New York trusted nonprofits.")

        # --------------------------------------------------
        # ORDER 2: Ohio Recovery
        # --------------------------------------------------
        print("\n[ORDER 2] Repairing Ohio...")
        
        # 1. Update 6 major school districts
        oh_districts_data = [
            ('sd-franklin-oh', 'Columbus City Schools - Special Education Department', '(614) 365-5220', 'https://www.ccsoh.us'),
            ('sd-cuyahoga-oh', 'Cleveland Metropolitan School District - Special Education', '(216) 838-7733', 'https://www.clevelandmetroschools.org'),
            ('sd-hamilton-oh', 'Cincinnati Public Schools - Exceptional Education', '(513) 363-0280', 'https://www.cps-k12.org'),
            ('sd-lucas-oh', 'Toledo Public Schools - Special Education Department', '(419) 671-8401', 'https://www.tps.org'),
            ('sd-summit-oh', 'Akron Public Schools - Special Education Department', '(330) 761-3150', 'https://www.akron.k12.oh.us'),
            ('sd-montgomery-oh', 'Dayton Public Schools - Exceptional Children Department', '(937) 542-3353', 'https://www.dps.k12.oh.us')
        ]
        
        for sd_id, name, phone, website in oh_districts_data:
            cursor.execute("""
                UPDATE school_districts
                SET name = ?, spec_ed_contact_phone = ?, website = ?, source_url = ?,
                    verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
                WHERE id = ?
            """, (name, phone, website, website, sd_id))
        print(f"  - Updated {len(oh_districts_data)} Ohio school districts.")

        # 2. Seed 3 trusted nonprofits in Ohio
        oh_nonprofits = [
            ('np-disability-rights-oh', 'Disability Rights Ohio (DRO)', 'franklin-oh', 'https://www.disabilityrightsohio.org', '(614) 466-7264'),
            ('np-arc-oh', 'The Arc of Ohio', 'franklin-oh', 'https://www.thearcofohio.org', '(614) 487-4726'),
            ('np-ocecd-oh', 'Ohio Coalition for the Education of Children with Disabilities', 'marion-oh', 'https://www.ocecd.org', '(740) 382-5452')
        ]
        
        # Clear existing nonprofits in OH to prevent duplicates
        cursor.execute("DELETE FROM nonprofit_organizations WHERE county_id LIKE '%-oh'")
        
        for np_id, name, county, website, phone in oh_nonprofits:
            cursor.execute("""
                INSERT INTO nonprofit_organizations (
                    id, name, county_id, website, phone, focus_condition,
                    source_url, source_type, data_origin, verification_status, confidence_score
                ) VALUES (?, ?, ?, ?, ?, 'developmental_disabilities', ?, 'official_advocacy', 'curated_seed', 'official_verified', 9.5)
            """, (np_id, name, county, website, phone, website))
        print(f"  - Seeded {len(oh_nonprofits)} Ohio trusted nonprofits.")

        # --------------------------------------------------
        # ORDER 3: Illinois Recovery
        # --------------------------------------------------
        print("\n[ORDER 3] Repairing Illinois...")
        
        il_districts_data = [
            ('sd-dupage-il', '(630) 682-2000'),
            ('sd-lake-il', '(224) 303-1000'),
            ('sd-will-il', '(815) 740-3196'),
            ('sd-kane-il', '(847) 888-5000'),
            ('sd-winnebago-il', '(815) 966-3000'),
            ('sd-sangamon-il', '(217) 525-3000'),
            ('sd-peoria-il', '(309) 672-6500'),
            ('sd-champaign-il', '(217) 351-3800')
        ]
        
        for sd_id, phone in il_districts_data:
            cursor.execute("""
                UPDATE school_districts
                SET spec_ed_contact_phone = ?, verification_status = 'official_verified', data_origin = 'curated_seed'
                WHERE id = ?
            """, (phone, sd_id))
        print(f"  - Updated {len(il_districts_data)} Illinois school districts to verified.")

        # --------------------------------------------------
        # ORDER 4: California Legacy Cleanup
        # --------------------------------------------------
        print("\n[ORDER 4] Cleaning California Legacy exceptions...")
        
        # 1. Clear 40 school districts with mock phone numbers
        cursor.execute("""
            UPDATE school_districts
            SET spec_ed_contact_phone = '', spec_ed_contact_email = '',
                website = 'https://www.cde.ca.gov/sp/se/', source_url = 'https://www.cde.ca.gov/sp/se/',
                verification_status = 'manual_review_required'
            WHERE id IN (
                SELECT sd.id FROM school_districts sd
                JOIN counties c ON sd.county_id = c.id
                WHERE c.state_id = 'california' AND sd.spec_ed_contact_phone LIKE '%555%'
            )
        """)
        print(f"  - Cleared CA school districts with mock phone numbers (changes: {cursor.rowcount}).")
        
        # 2. Delete 43 placeholder nonprofits with mock numbers
        cursor.execute("""
            DELETE FROM nonprofit_organizations
            WHERE id IN (
                SELECT no.id FROM nonprofit_organizations no
                JOIN counties c ON no.county_id = c.id
                WHERE c.state_id = 'california' AND no.phone LIKE '%555%'
            )
        """)
        print(f"  - Deleted CA nonprofits with mock phone numbers (changes: {cursor.rowcount}).")
        
        # 3. Clean 580 iep_advocates with mock numbers
        cursor.execute("""
            UPDATE iep_advocates
            SET phone = '', email = '', website = 'https://www.cde.ca.gov/sp/se/',
                verification_status = 'manual_review_required'
            WHERE phone LIKE '%555%'
        """)
        print(f"  - Cleared CA IEP advocates with mock phone numbers (changes: {cursor.rowcount}).")

        # 4. Safely archive/downgrade the remaining 37 regional education fallbacks (selpa-gen-*)
        cursor.execute("""
            UPDATE regional_education_agencies
            SET verification_status = 'manual_review_required'
            WHERE state_id = 'california' AND data_origin = 'programmatic_fallback'
        """)
        print(f"  - Downgraded CA regional education fallbacks to manual review (changes: {cursor.rowcount}).")

        # --------------------------------------------------
        # ORDER 5: Georgia Unblock Sprint
        # --------------------------------------------------
        print("\n[ORDER 5] Repairing Georgia...")
        
        # 1. Update 15 county DFCS Medicaid offices
        ga_offices_data = [
            ('off-fulton-ga-medicaid', '(404) 657-3433'),
            ('off-gwinnett-ga-medicaid', '(678) 301-6000'),
            ('off-dekalb-ga-medicaid', '(404) 370-5000'),
            ('off-cobb-ga-medicaid', '(770) 528-5000'),
            ('off-chatham-ga-medicaid', '(912) 651-2233'),
            ('off-muscogee-ga-medicaid', '(706) 649-7433'),
            ('off-richmond-ga-medicaid', '(706) 721-3000'),
            ('off-bibb-ga-medicaid', '(478) 751-6000'),
            ('off-houston-ga-medicaid', '(478) 988-7500'),
            ('off-hall-ga-medicaid', '(770) 535-5400'),
            ('off-forsyth-ga-medicaid', '(770) 781-6700'),
            ('off-cherokee-ga-medicaid', '(770) 720-3500'),
            ('off-henry-ga-medicaid', '(770) 954-2000'),
            ('off-paulding-ga-medicaid', '(770) 443-7800'),
            ('off-douglas-ga-medicaid', '(770) 920-7300')
        ]
        
        for office_id, phone in ga_offices_data:
            cursor.execute("""
                UPDATE county_offices
                SET phone = ?, website = 'https://dfcs.georgia.gov/', source_url = 'https://dfcs.georgia.gov/locations',
                    verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
                WHERE id = ?
            """, (phone, office_id))
        print(f"  - Updated {len(ga_offices_data)} Georgia DFCS Medicaid offices.")

        # 2. Update 15 school districts
        ga_districts_data = [
            ('sd-fulton-ga', '(470) 254-3600', 'https://www.fultonschools.org'),
            ('sd-gwinnett-ga', '(678) 301-6000', 'https://www.gcpsk12.org'),
            ('sd-dekalb-ga', '(678) 676-1200', 'https://www.dekalbschoolsga.org'),
            ('sd-cobb-ga', '(770) 426-3300', 'https://www.cobbk12.org'),
            ('sd-chatham-ga', '(912) 395-5600', 'https://www.sccpss.com'),
            ('sd-muscogee-ga', '(706) 748-2000', 'https://www.muscogee.k12.ga.us'),
            ('sd-richmond-ga', '(706) 826-1000', 'https://www.rcboe.org'),
            ('sd-bibb-ga', '(478) 765-8711', 'https://www.bcsdk12.net'),
            ('sd-houston-ga', '(478) 988-6200', 'https://www.hcbe.net'),
            ('sd-hall-ga', '(770) 534-1080', 'https://www.hallco.org'),
            ('sd-forsyth-ga', '(770) 887-2461', 'https://www.forsyth.k12.ga.us'),
            ('sd-cherokee-ga', '(770) 479-1871', 'https://www.cherokeek12.net'),
            ('sd-henry-ga', '(770) 957-6601', 'https://www.henry.k12.ga.us'),
            ('sd-paulding-ga', '(770) 443-8000', 'https://www.paulding.k12.ga.us'),
            ('sd-douglas-ga', '(770) 920-4000', 'https://www.dcssga.org')
        ]
        
        for sd_id, phone, website in ga_districts_data:
            cursor.execute("""
                UPDATE school_districts
                SET spec_ed_contact_phone = ?, website = ?, source_url = ?,
                    verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
                WHERE id = ?
            """, (phone, website, website, sd_id))
        print(f"  - Updated {len(ga_districts_data)} Georgia school districts.")

        # --------------------------------------------------
        # ORDER 6: North Carolina Wave 2 Verification
        # --------------------------------------------------
        print("\n[ORDER 6] Repairing North Carolina...")
        
        # 1. Update 10 county DSS offices
        nc_offices_data = [
            ('off-wake-nc-medicaid', '(919) 212-7000', 'https://www.wake.gov/departments-government/human-services/social-services'),
            ('off-mecklenburg-nc-medicaid', '(704) 336-3000', 'https://dss.mecknc.gov/'),
            ('off-guilford-nc-medicaid', '(336) 641-3000', 'https://www.guilfordcountync.gov/departments/social-services'),
            ('off-forsyth-nc-medicaid', '(336) 703-3800', 'https://www.forsyth.cc/socialservices/'),
            ('off-cumberland-nc-medicaid', '(910) 323-1540', 'https://www.co.cumberland.nc.us/departments/social-services-group'),
            ('off-durham-nc-medicaid', '(919) 560-8000', 'https://www.dconc.gov/departments/social-services'),
            ('off-buncombe-nc-medicaid', '(828) 250-5500', 'https://www.buncomecounty.org/governing/depts/dss/'),
            ('off-new-hanover-nc-medicaid', '(910) 798-3500', 'https://socialservices.nhcgov.com/'),
            ('off-union-nc-medicaid', '(704) 283-3500', 'https://www.unioncountync.gov/government/departments-r-to-z/social-services'),
            ('off-gaston-nc-medicaid', '(704) 862-7500', 'https://www.gastongov.com/departments/social_services/')
        ]
        
        for office_id, phone, website in nc_offices_data:
            cursor.execute("""
                UPDATE county_offices
                SET phone = ?, website = ?, source_url = 'https://www.ncdhhs.gov/divisions/social-services/local-county-social-services-departments',
                    verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
                WHERE id = ?
            """, (phone, website, office_id))
        print(f"  - Updated {len(nc_offices_data)} North Carolina DSS offices.")

        # 2. Update 4 school districts
        nc_districts_data = [
            ('sd-wake-nc', 'Wake County Public School System - Exceptional Children', '(919) 431-7334', 'https://www.wcpss.net/domain/76'),
            ('sd-mecklenburg-nc', 'Charlotte-Mecklenburg Schools - Exceptional Children Department', '(980) 343-6960', 'https://www.cmsk12.org/Page/213'),
            ('sd-guilford-nc', 'Guilford County Schools - Exceptional Children Department', '(336) 370-2300', 'https://www.gcsnc.com/Page/1908'),
            ('sd-forsyth-nc', 'Winston-Salem/Forsyth County Schools - Exceptional Children', '(336) 727-2816', 'https://www.wsfcs.k12.nc.us/Domain/19')
        ]
        
        for sd_id, name, phone, website in nc_districts_data:
            cursor.execute("""
                UPDATE school_districts
                SET name = ?, spec_ed_contact_phone = ?, website = ?, source_url = ?,
                    verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
                WHERE id = ?
            """, (name, phone, website, website, sd_id))
        print(f"  - Updated {len(nc_districts_data)} North Carolina school districts.")

        # 3. Update statewide agencies
        cursor.execute("""
            UPDATE state_resource_agencies
            SET name = 'North Carolina LME/MCO System (Innovations Waiver)', intake_phone = '(800) 662-7030',
                website = 'https://www.ncdhhs.gov/providers/lmemco-directory', source_url = 'https://www.ncdhhs.gov/providers/lmemco-directory',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE id = 'nc-dd-agency'
        """)
        cursor.execute("""
            UPDATE state_resource_agencies
            SET name = 'North Carolina CDSA Early Intervention', intake_phone = '(919) 707-5520',
                website = 'https://www.ncdhhs.gov/divisions/child-and-family-well-being/early-intervention-section',
                source_url = 'https://www.ncdhhs.gov/divisions/child-and-family-well-being/early-intervention-section',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE id = 'nc-ei-agency'
        """)
        cursor.execute("""
            UPDATE regional_education_agencies
            SET name = 'North Carolina Department of Public Instruction - Exceptional Children',
                website = 'https://www.dpi.nc.gov/districts-schools/classroom-resources/exceptional-children',
                source_url = 'https://www.dpi.nc.gov/districts-schools/classroom-resources/exceptional-children',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE id = 'nc-ed-agency'
        """)
        print("  - Updated North Carolina statewide DD, EI, and Education resource agencies.")

        # 4. Verify seeded nonprofits in NC (update their phone numbers/websites across all records)
        cursor.execute("""
            UPDATE nonprofit_organizations
            SET phone = '(919) 856-2195', website = 'https://disabilityrightsnc.org', source_url = 'https://disabilityrightsnc.org',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE name = 'Disability Rights North Carolina'
        """)
        cursor.execute("""
            UPDATE nonprofit_organizations
            SET phone = '(919) 782-4632', website = 'https://www.arcnc.org', source_url = 'https://www.arcnc.org',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE name = 'The Arc of North Carolina'
        """)
        cursor.execute("""
            UPDATE nonprofit_organizations
            SET name = 'First In Families of North Carolina', phone = '(919) 251-8368', website = 'https://fifnc.org', source_url = 'https://fifnc.org',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE name = 'Parent to Parent of North Carolina'
        """)
        print("  - Updated and verified North Carolina nonprofits.")

        # --------------------------------------------------
        # ORDER 7: Michigan Wave 2 Verification
        # --------------------------------------------------
        print("\n[ORDER 7] Repairing Michigan...")
        
        # 1. Update 10 county DHHS offices
        mi_offices_data = [
            ('off-wayne-mi-medicaid', '(313) 456-1000', 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/wayne'),
            ('off-oakland-mi-medicaid', '(248) 975-5200', 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/oakland'),
            ('off-macomb-mi-medicaid', '(586) 469-7700', 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/macomb'),
            ('off-kent-mi-medicaid', '(616) 248-1000', 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/kent'),
            ('off-genesee-mi-medicaid', '(810) 760-2200', 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/genesee'),
            ('off-washtenaw-mi-medicaid', '(734) 481-2000', 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/washtenaw'),
            ('off-ingham-mi-medicaid', '(517) 887-9400', 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/ingham'),
            ('off-kalamazoo-mi-medicaid', '(269) 337-4900', 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/kalamazoo'),
            ('off-ottawa-mi-medicaid', '(616) 394-7200', 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/ottawa'),
            ('off-saginaw-mi-medicaid', '(989) 758-1100', 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices/saginaw')
        ]
        
        for office_id, phone, website in mi_offices_data:
            cursor.execute("""
                UPDATE county_offices
                SET phone = ?, website = ?, source_url = 'https://www.michigan.gov/mdhhs/inside-mdhhs/county-offices',
                    verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
                WHERE id = ?
            """, (phone, website, office_id))
        print(f"  - Updated {len(mi_offices_data)} Michigan DHHS offices.")

        # 2. Update 5 school districts
        mi_districts_data = [
            ('sd-wayne-mi', 'Detroit Public Schools - Exceptional Education', '(313) 873-6300', 'https://www.detroitk12.org/admin/exceptional_education'),
            ('sd-macomb-mi', 'Utica Community Schools - Special Education Department', '(586) 797-1000', 'https://www.uticak12.org/academics/special_education'),
            ('sd-washtenaw-mi', 'Ann Arbor Public Schools - Student Intervention Services', '(734) 994-2200', 'https://www.a2schools.org/Domain/2117'),
            ('sd-oakland-mi', 'Oakland Schools - Special Education Services', '(248) 209-2000', 'https://www.oakland.k12.mi.us/educators/special-education'),
            ('sd-kent-mi', 'Grand Rapids Public Schools - Special Education', '(616) 819-2000', 'https://www.grps.org/departments/special-education')
        ]
        
        for sd_id, name, phone, website in mi_districts_data:
            cursor.execute("""
                UPDATE school_districts
                SET name = ?, spec_ed_contact_phone = ?, website = ?, source_url = ?,
                    verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
                WHERE id = ?
            """, (name, phone, website, website, sd_id))
        print(f"  - Updated {len(mi_districts_data)} Michigan school districts.")

        # 3. Update statewide agencies
        cursor.execute("""
            UPDATE state_resource_agencies
            SET name = 'Michigan Community Mental Health (CMHSP) DD Services', intake_phone = '(517) 335-0196',
                website = 'https://www.michigan.gov/mdhhs/keep-mi-healthy/mentalhealth/mentalhealth/community-mental-health-addresses-and-phone-numbers',
                source_url = 'https://www.michigan.gov/mdhhs/keep-mi-healthy/mentalhealth/mentalhealth/community-mental-health-addresses-and-phone-numbers',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE id = 'mi-dd-agency'
        """)
        cursor.execute("""
            UPDATE state_resource_agencies
            SET name = 'Michigan Early On Early Intervention', intake_phone = '(800) 327-5966',
                website = 'https://www.1800earlyon.org/',
                source_url = 'https://www.1800earlyon.org/',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE id = 'mi-ei-agency'
        """)
        cursor.execute("""
            UPDATE regional_education_agencies
            SET name = 'Michigan Department of Education - Office of Special Education',
                website = 'https://www.michigan.gov/mde/services/special-education',
                source_url = 'https://www.michigan.gov/mde/services/special-education',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE id = 'mi-ed-agency'
        """)
        print("  - Updated Michigan statewide DD, EI, and Education resource agencies.")

        # 4. Verify seeded nonprofits in MI
        cursor.execute("""
            UPDATE nonprofit_organizations
            SET phone = '(517) 487-1755', website = 'https://www.drmich.org', source_url = 'https://www.drmich.org',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE name = 'Disability Rights Michigan'
        """)
        cursor.execute("""
            UPDATE nonprofit_organizations
            SET phone = '(517) 487-5426', website = 'https://arcmi.org', source_url = 'https://arcmi.org',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE name = 'The Arc of Michigan'
        """)
        cursor.execute("""
            UPDATE nonprofit_organizations
            SET name = 'Michigan Alliance for Families', phone = '(800) 552-4821', website = 'https://www.michiganallianceforfamilies.org',
                source_url = 'https://www.michiganallianceforfamilies.org',
                verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
            WHERE name = 'Parent to Parent of Michigan'
        """)
        print("  - Updated and verified Michigan nonprofits.")

except Exception as e:
    print(f"❌ Transaction failed: {e}")
    conn.close()
    exit(1)

# Checkpoint and close
print("\n⚙️ Checkpointing SQLite database (WAL)...")
conn.execute("PRAGMA wal_checkpoint(TRUNCATE);")
conn.close()
print("✓ Checkpoint completed and database closed.")

# Synchronize database file to frontend folder
print(f"⚙️ Copying database to frontend replica: {frontend_db_path}...")
try:
    if os.path.exists(f"{frontend_db_path}-wal"):
        os.unlink(f"{frontend_db_path}-wal")
    if os.path.exists(f"{frontend_db_path}-shm"):
        os.unlink(f"{frontend_db_path}-shm")
    shutil.copyfile(db_path, frontend_db_path)
    print("✓ Synchronization successful!")
except Exception as e:
    print(f"❌ Failed to sync database: {e}")
    exit(1)

print("\n====================================================")
print("🎉 ALL DATABASE REPAIRS COMMITTED SUCCESSFULLY")
print("====================================================")
