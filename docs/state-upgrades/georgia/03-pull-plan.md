# Georgia Data Pull Plan

This document details the strategies and sources used to replace programmatic placeholders in Georgia with verified or safely downgraded directory records.

## 1. Autoritative Sources List

*   **Medicaid/DFCS Offices:** Georgia Department of Human Services (DHS) Division of Family and Children Services (DFCS) County Office Directory (`https://dfcs.georgia.gov/locations`).
*   **DD/IDD Regional Offices:** Georgia Department of Behavioral Health and Developmental Disabilities (DBHDD) regional office maps (`https://dbhdd.georgia.gov/locations/regional-offices`).
*   **Babies Can't Wait:** Georgia Department of Public Health (DPH) Babies Can't Wait program coordinator page (`https://dph.georgia.gov/babies-cant-wait`).
*   **Special Education Districts:** Georgia Department of Education (GaDOE) special education landing page (`https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/default.aspx`).
*   **Centers for Independent Living:** Statewide Independent Living Council of Georgia (SILCGA) directory (`https://silcga.org`).

## 2. Ingestion & Cleaning Strategies

1.  **Medicaid Local Offices:**
    *   For the 11 priority counties, retrieve correct physical addresses from existing database seeds. Set contact phone numbers to `NULL` to comply with centralized statewide routing rules. Set verification status to `'source_listed'`.
    *   For the 148 other counties, clear address and phone fields (set to `NULL`). Set verification status to `'manual_review_required'`.
2.  **DBHDD Regional Offices:**
    *   Define the 6 regional field offices as distinct records in the state resource agencies table. Map each region to its specific catchment county IDs.
3.  **Babies Can't Wait:**
    *   Define a single statewide coordinator record in the state resource agencies table with the central BCW hotline `(888) 651-8224` and DPH website. Map all 159 counties to it.
4.  **Special Education Districts:**
    *   For the 148 fallback school districts, set `spec_ed_contact_phone = NULL`, `spec_ed_contact_email = NULL`, and `website = NULL`.
    *   Set `source_url = 'https://www.gadoe.org/Curriculum-Instruction-and-Assessment/Special-Education-Services/Pages/default.aspx'`.
    *   Rekey target IDs to `sd-[county-name]-ga` (without `-fallback`).
    *   Downgrade verification status to `'manual_review_required'`.
5.  **Nonprofits:**
    *   Retain the statewide GAO and P2P records with their correct central websites and phone numbers.
    *   Delete the 159 fake `The Arc of Georgia` county records.
    *   Delete other fake local Arc records with mock `555` numbers.
    *   Seed local Centers for Independent Living (CILs) for the 11 priority counties (disABILITY LINK, LIFE, Walton Options, Access 2 Independence, Multiple Choices).
    *   Seed real local Arc chapters (Arc of Southwest Georgia, Arc of Macon, Arc of Liberty County, Arc of Walker County, Arc of Douglas County, Arc of Clayton County, Arc of Northeast Georgia, Arc of Stephens County, Arc Thomas Grady Center) in their respective physical counties.
