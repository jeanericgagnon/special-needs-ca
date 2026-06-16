# Data Provenance Report: New York (NY)

This report details the data sources, records count, trust classifications, and launch readiness for the State of New York under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Pilot)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **100.0%** (Manual Review Rate: **0.0%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `OPWDD Regional Office`
- **Medicaid Program Name**: `New York Medicaid`
- **Waiver Program Name**: `OPWDD HCBS Waiver`
- **Personal Care Program**: `CDPAP (Consumer Directed Personal Assistance)`
- **Developmental Disability (DD) Agency**: `NYS Office for People With Developmental Disabilities`
- **State Education Agency**: `New York State Education Department`
- **State Education Agency SPED Label**: `Committee on Special Education (CSE)`
- **State Early Intervention Label**: `NYS Early Intervention Program (Ages 0-3)`
- **ABLE Savings Program**: `NY ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 62
- **County Social Service Storefronts**: 62
- **School Districts**: 62
- **Regional Education Agencies (REAs)**: 38
- **State-Level Resource Agencies**: 69
- **Local Nonprofit Support Organizations**: 0
- **Special Education (IEP) Advocates/Attorneys**: 26
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 112 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 176 records
- **Manual Review Backlog (Flagged)**: 0 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 50 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **ACCES-VR Transition Services** (State Program): Source URL: https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services
  * Description: Supports transition from school to employment/postsecondary education for youth with disabilities.
- **Child Health Plus** (State Program): Source URL: https://www.health.ny.gov/health_care/child_health_plus/
  * Description: New York's child health insurance program (CHIP) for families whose income is too high for Medicaid.
- **Consumer Directed Personal Assistance Program (CDPAP)** (State Program): Source URL: https://www.health.ny.gov/health_care/medicaid/redesign/cdpap.htm
  * Description: Allows Medicaid-eligible individuals to hire their own personal assistants, including relatives/parents.
- **NY ABLE** (State Program): Source URL: https://www.mynyable.org/
  * Description: Tax-free savings accounts for disability-related expenses without losing SSI/Medicaid eligibility.
- **NYS Special Education / CSE** (State Program): Source URL: https://www.nysed.gov/special-education
  * Description: Special education IEP services and therapies provided by local school district Committees on Special Education.
- **New York Early Intervention Program (EIP)** (State Program): Source URL: https://www.health.ny.gov/community/infants_children/early_intervention/
  * Description: Provides developmental therapies (speech, OT, PT) for infants and toddlers with delays.
- **New York Medicaid** (State Program): Source URL: https://www.health.ny.gov/health_care/medicaid/
  * Description: Health coverage for low-income residents, managed by local LDSS/HRA. Bypasses parental income for OPWDD waiver clients.
- **OPWDD HCBS Waiver** (State Program): Source URL: https://opwdd.ny.gov/services-support/home-community-based-services-waiver
  * Description: Home and Community-Based Services waiver providing respite, community habilitation, and adaptive equipment for people wi...
- **OPWDD Self-Direction** (State Program): Source URL: https://opwdd.ny.gov/self-direction
  * Description: Allows individuals to manage their own funding allocation and hire their own staff/caregivers, including parents.
- **SSI for Children (New York)** (State Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Federal cash benefit with automatic full-scope NY Medicaid routing managed via local HRA/LDSS.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Albany County Department for Children, Youth and Families** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-447-4820 | Status: `source_listed`
- **Allegany County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 585-268-9767 | Status: `source_listed`
- **Broome County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 607-778-2851 | Status: `source_listed`
- **Cattaraugus County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 716-373-8050 | Status: `source_listed`
- **Cayuga County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-253-1560 | Status: `source_listed`
- **Chautauqua County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 716-753-4788 | Status: `source_listed`
- **Chemung County Social Services and Mental Hygiene Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 607-737-5568 | Status: `source_listed`
- **Chenango County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 607-337-1729 | Status: `source_listed`
- **Clinton County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-565-4848 | Status: `source_listed`
- **Columbia County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-828-4278 | Status: `source_listed`
- **Cortland County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 607-753-5036 | Status: `source_listed`
- **Delaware County Public Health Nursing Service** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 607-832-5200 | Status: `source_listed`
- **Dutchess County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 845-486-2759 | Status: `source_listed`
- **Erie County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 716-858-6161 | Status: `source_listed`
- **Essex County Public Health Nursing Service** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-873-3522 | Status: `source_listed`
- **Franklin County Public Health Services** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-481-1709 | Status: `source_listed`
- **Fulton County Public Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-736-5720 | Status: `source_listed`
- **Genesee County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 585-344-2580 | Status: `source_listed`
- **Greene County Public Health Nursing Service** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-719-3600 | Status: `source_listed`
- **Hamilton County Public Health Nursing Service** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-648-6497 | Status: `source_listed`
- **Herkimer County Public Health Nursing Service** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-867-1176 | Status: `source_listed`
- **Jefferson County Community Services** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-785-3283 | Status: `source_listed`
- **Lewis County Public Health Agency Children Services** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-376-5453 | Status: `source_listed`
- **Livingston County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 585-243-7299 | Status: `source_listed`
- **Madison County Public Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-366-2361 | Status: `source_listed`
- **Monroe County Department of Public Health** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 585-753-5437 | Status: `source_listed`
- **Montgomery County Public Health** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-853-3531 | Status: `source_listed`
- **NYC Early Intervention Program - Bronx Office** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 718-838-6887 | Status: `source_listed`
- **NYC Early Intervention Program - Brooklyn Office** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 718-694-6000 | Status: `source_listed`
- **NYC Early Intervention Program - Manhattan Office** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 212-436-0900 | Status: `source_listed`
- **NYC Early Intervention Program - Queens Office** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 718-553-3954 | Status: `source_listed`
- **NYC Early Intervention Program - Staten Island Office** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 718-568-2300 | Status: `source_listed`
- **Nassau County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 516-227-8661 | Status: `source_listed`
- **Niagara County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 716-278-1991 | Status: `source_listed`
- **OPWDD Capital District Regional Office (Region 3)** (ddro): Website: https://opwdd.ny.gov/get-started/front-door | Phone: (518) 388-0431 | Status: `source_listed`
- **OPWDD Central NY Regional Office (Region 2)** (ddro): Website: https://opwdd.ny.gov/get-started/front-door | Phone: (607) 240-4900 | Status: `source_listed`
- **OPWDD Finger Lakes Regional Office (Region 1)** (ddro): Website: https://opwdd.ny.gov/get-started/front-door | Phone: (585) 461-8508 | Status: `source_listed`
- **OPWDD Hudson Valley Regional Office (Region 3)** (ddro): Website: https://opwdd.ny.gov/get-started/front-door | Phone: (845) 947-6100 | Status: `source_listed`
- **OPWDD Long Island Regional Office (Region 5)** (ddro): Website: https://opwdd.ny.gov/get-started/front-door | Phone: (631) 434-6100 | Status: `source_listed`
- **OPWDD NYC Regional Office (Region 4)** (ddro): Website: https://opwdd.ny.gov/get-started/front-door | Phone: (646) 766-3466 | Status: `source_listed`
- **OPWDD Western NY Regional Office (Region 1)** (ddro): Website: https://opwdd.ny.gov/get-started/front-door | Phone: (716) 517-2010 | Status: `source_listed`
- **Oneida County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-798-5249 | Status: `source_listed`
- **Onondaga County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-435-3230 | Status: `source_listed`
- **Ontario County Community Health Services** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 585-396-4546 | Status: `source_listed`
- **Orange County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 845-291-2333 | Status: `source_listed`
- **Orleans County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 585-589-2777 | Status: `source_listed`
- **Oswego County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-349-3510 | Status: `source_listed`
- **Otsego County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 607-547-6474 | Status: `source_listed`
- **Putnam County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 845-808-1640 | Status: `source_listed`
- **Rensselaer County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-270-2626 | Status: `source_listed`
- **Rockland County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 845-364-2620 | Status: `source_listed`
- **Saratoga County Public Health Services** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-584-7460 | Status: `source_listed`
- **Schenectady County Public Health Services** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-386-2815 | Status: `source_listed`
- **Schoharie County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-295-8705 | Status: `source_listed`
- **Schuyler County Public Health** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 607-535-8140 | Status: `source_listed`
- **Seneca County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-539-1920 | Status: `source_listed`
- **St. Lawrence County Public Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-386-2325 | Status: `source_listed`
- **Steuben County Public Health and Nursing Services** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 607-664-2146 | Status: `source_listed`
- **Suffolk County Department of Health** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 631-853-3100 | Status: `source_listed`
- **Sullivan County Public Health Nursing Service** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 845-292-5910 | Status: `source_listed`
- **Tioga County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 607-687-8600 | Status: `source_listed`
- **Tompkins County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 607-274-6644 | Status: `source_listed`
- **Ulster County Social Services Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 845-334-5251 | Status: `source_listed`
- **Warren County Health Services** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-761-6580 | Status: `source_listed`
- **Washington County Public Health Service** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 518-746-2400 | Status: `source_listed`
- **Wayne County Public Health** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-946-5749 | Status: `source_listed`
- **Westchester County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 914-813-5094 | Status: `source_listed`
- **Wyoming County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 585-786-8850 | Status: `source_listed`
- **Yates County Health Department** (early_intervention): Website: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm | Phone: 315-536-5160 | Status: `source_listed`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Albany County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Allegany County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Bronx County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Broome County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Cattaraugus County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Cayuga County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Chautauqua County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Chemung County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Chenango County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Clinton County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Columbia County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Cortland County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Delaware County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Dutchess County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Erie County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Essex County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Franklin County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Fulton County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Genesee County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Greene County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Hamilton County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Herkimer County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Jefferson County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Kings County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lewis County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Livingston County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Madison County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Monroe County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Montgomery County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Nassau County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| New York County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Niagara County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Oneida County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Onondaga County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Ontario County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Orange County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Orleans County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Oswego County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Otsego County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Putnam County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Queens County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Rensselaer County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Richmond County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Rockland County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Saratoga County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Schenectady County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Schoharie County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Schuyler County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Seneca County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| St. Lawrence County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Steuben County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Suffolk County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Sullivan County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Tioga County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Tompkins County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Ulster County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Warren County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Washington County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Wayne County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Westchester County | 1 | 1 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Wyoming County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Yates County | 1 | 1 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |

---

## 8. Detailed County-Level Gap Registry
List of specific counties with zero resource mappings:
- **Counties Missing Social Service Offices**: None
- **Counties Missing School Districts**: None
- **Counties Missing Local Nonprofits**: Albany County, Allegany County, Bronx County, Broome County, Cattaraugus County, Cayuga County, Chautauqua County, Chemung County, Chenango County, Clinton County, Columbia County, Cortland County, Delaware County, Dutchess County, Erie County, Essex County, Franklin County, Fulton County, Genesee County, Greene County, Hamilton County, Herkimer County, Jefferson County, Kings County, Lewis County, Livingston County, Madison County, Monroe County, Montgomery County, Nassau County, New York County, Niagara County, Oneida County, Onondaga County, Ontario County, Orange County, Orleans County, Oswego County, Otsego County, Putnam County, Queens County, Rensselaer County, Richmond County, Rockland County, Saratoga County, Schenectady County, Schoharie County, Schuyler County, Seneca County, St. Lawrence County, Steuben County, Suffolk County, Sullivan County, Tioga County, Tompkins County, Ulster County, Warren County, Washington County, Wayne County, Westchester County, Wyoming County, Yates County

---

## 9. Manual Review Queue Registry
List of records flagged as `manual_review_required` in the database, representing exactly what needs to be verified before this state can be advanced:

No records in manual review queue.


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
