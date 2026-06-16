# Texas Resource Pull Plan

This document outlines the execution plan for pulling, staging, normalizing, and promoting Texas (TX) resource data in subsequent phases. It specifies target tables, staging schemas, validation rules, and promotion thresholds.

---

## 🛠️ Category-by-Category Pull Details

### A. DD/IDD / LIDDAs (Category C)
*   **Proposed Records:** Update contact info (real websites and phone numbers) for all 39 LIDDA agencies. Mappings to the 254 counties remain unchanged.
*   **Source URL:** [Texas HHS LIDDA Directory Info](https://hhs.texas.gov/services/health/local-intellectual-developmental-disability-authorities-lidda) and search locator at [apps.hhs.texas.gov](https://apps.hhs.texas.gov/contact/la.cfm).
*   **Target Staging Table:** `staging_scraped_state_resource_agencies`
*   **Extraction Method:** Playwright locator scraping or manual curation of the 39 official websites.
*   **Evidence Level:** `official_locator_derived`
*   **Confidence Score Rules:** `0.85` for LIDDA main listings with local websites.
*   **Sample Validation Size:** 10 records (verify that local websites like `andrewscenter.com` or `bbtrails.org` resolve and phone numbers match).
*   **Promotion Rules:** Match on LIDDA name or ID. Update the intake phone, main phone, website, and set `evidence_level = 'official_locator_derived'` and `data_origin = 'official_locator_derived'`. Protect curated seeds and do not overwrite county mappings.
*   **Expected Fallback Replacement:** None (LIDDAs already serve as the primary coordinators).
*   **Stop Conditions:** Scraper fails to retrieve at least 30 valid local URLs, or database lock errors occur.

---

### B. Early Childhood Intervention / ECI (Category E)
*   **Proposed Records:** 37 local contracted ECI providers.
*   **Source URL:** [Texas HHS ECI Search Tool](https://citysearch.hhsc.state.tx.us)
*   **Target Staging Table:** `staging_scraped_state_resource_agencies`
*   **Extraction Method:** Playwright locator search automation by county/ZIP to extract contractor names, websites, phones, and county coverages.
*   **Evidence Level:** `official_locator_derived`
*   **Confidence Score Rules:** `0.85` for contractors extracted from the official locator.
*   **Sample Validation Size:** 10 records (validate county coverages for entities like Any Baby Can and Brighton Center).
*   **Promotion Rules:** Ingest the 37 ECI contractors into `state_resource_agencies` with `agency_type = 'eci'`. Map county-catchment areas to the `regional_center_counties` or equivalent mapping tables. Protect curated seeds.
*   **Expected Fallback Replacement:** Establishes local early intervention coverage, resolving the ECI data gap.
*   **Stop Conditions:** ECI contractor count drops below 30 or county coverage is incomplete.

---

### C. Trusted Nonprofits (Category H/I)
*   **Proposed Records:** Regional chapters, PTIs, and Legal Aid organizations covering the 254 counties.
    *   PATH Project (East Texas), PEN Project (West Texas), TEAM Project (North/Central Texas).
    *   Lone Star Legal Aid (72 counties), Legal Aid of Northwest Texas (114 counties), Texas RioGrande Legal Aid (68 counties).
    *   Local Arc chapters (Capital Area, Greater Houston, San Antonio, Northeast, Dallas, Wichita County).
*   **Source URL:** [Partners Resource Network](https://prntexas.org), [The Arc of Texas](https://www.thearcoftexas.org), and legal aid websites.
*   **Target Staging Table:** `staging_scraped_nonprofit_organizations`
*   **Extraction Method:** Static page extraction / manual catchment mapping from official directories.
*   **Evidence Level:** `official_locator_derived`
*   **Confidence Score Rules:** `0.75` for regional chapters and legal aid.
*   **Sample Validation Size:** 15 records (verify that county mapping matches Lone Star, LANWT, and TRLA service boundaries).
*   **Promotion Rules:** Delete the 226 programmatic fallback records (`np-[county]-tx-fallback`). Promote regional nonprofits and map them to their served counties. Protect statewide curated seeds (DRTx, PRN, TxP2P, AST).
*   **Expected Fallback Replacement:** Replaces the 226 generic `Texas Parent to Parent` fallbacks with highly specific local/regional chapters.
*   **Stop Conditions:** Overwrite attempts on curated seeds or mismatched county mapping boundaries.

---

### D. Hospital / University Clinics (Category M)
*   **Proposed Records:** 3 to 6 major pediatric autism and developmental centers.
    *   Texas Children's Hospital Autism Center (Houston)
    *   Cook Children's Child Development Center (Fort Worth)
    *   UT Dallas Callier Center (Dallas)
    *   Dell Children's Texas Child Study Center (Austin)
    *   UT Health Houston Center for Autism (Houston)
*   **Source URL:** Hospital and university official departments.
*   **Target Staging Table:** `staging_scraped_resource_providers`
*   **Extraction Method:** Static fetch of clinical landing pages.
*   **Evidence Level:** `official_locator_derived`
*   **Confidence Score Rules:** `0.75`
*   **Sample Validation Size:** All 5 clinics.
*   **Promotion Rules:** Insert into `resource_providers` table. Set `verification_status = 'source_listed'` and `data_origin = 'official_locator_derived'`.
*   **Expected Fallback Replacement:** Establishes university/hospital clinical resource coverage.
*   **Stop Conditions:** Attempted extraction of private patient portals or appointment forms.

---

### E. Transition / VR / ABLE (Category J)
*   **Proposed Records:** TWC Vocational Rehabilitation and Texas ABLE.
*   **Source URL:** [TWC VR Page](https://www.twc.texas.gov/services/vocational-rehabilitation) and [Texas ABLE](https://www.texasable.org).
*   **Target Staging Table:** `staging_scraped_state_resource_agencies`
*   **Extraction Method:** Static fetch of program rules and offices.
*   **Evidence Level:** `official_state`
*   **Confidence Score Rules:** `0.85`
*   **Sample Validation Size:** Both statewide programs.
*   **Promotion Rules:** Promote to `state_resource_agencies` / `programs`.
*   **Expected Fallback Replacement:** Adds transition and financial support resources.
*   **Stop Conditions:** Database connection errors.

---

## 📅 Recommended Next Pull Order

We recommend executing the data ingestion in the following logical sequence:

1.  **Phase 1: Database Migration (Schema Update)**
    *   Run `ALTER TABLE` commands to add `evidence_level TEXT` to the 10 target tables in both databases.
2.  **Phase 2: LIDDA Contact Update & HCS Office Cleanup**
    *   Ingest and promote real LIDDA contact details to resolve placeholder websites/phones.
    *   Delete the 254 HCS fallback records in `county_offices` since HCS routes through LIDDAs.
3.  **Phase 3: ECI Contractors Ingestion**
    *   Stage and promote the 37 local ECI providers to resolve the ECI gap.
4.  **Phase 4: Trusted Nonprofits & Fallback Replacement**
    *   Stage regional Arc chapters, PTI projects, and Legal Aid organizations.
    *   Delete the 226 generic nonprofit fallbacks and promote the localized regional organizations.
5.  **Phase 5: Hospital/University Clinics Ingestion**
    *   Stage and promote the 5 clinical resource providers.
6.  **Phase 6: Transition, VR & ABLE Ingestion**
    *   Stage and promote TWC VR and Texas ABLE.
