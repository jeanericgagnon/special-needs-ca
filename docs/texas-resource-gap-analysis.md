# Texas Resource Gap Analysis

This document evaluates the current Texas (TX) resource data in the active database against our established **Texas Resource Truth Map**. It identifies data anomalies, missing resources, incorrect schema fields, and generic fallbacks.

---

## 📊 Summary of Active Database Counts for Texas

*   **Total Counties:** 254 (Complete)
*   **Medicaid/HHS offices (county_offices):**
    *   `tx-mdcp` (Pediatric Medicaid / HHS local offices): 15 curated seeds, 239 locator-derived (100% Complete, 0 fallbacks).
    *   `tx-hcs` (Home and Community Services): 254 programmatic fallbacks (Table routing error, see details below).
*   **DD/IDD local routing (state_resource_agencies):**
    *   39 LIDDAs (100% county coverage via `regional_center_counties` mapping, but using generic state helpline and placeholder URLs).
*   **Early Childhood Intervention / ECI:**
    *   0 local contractors in `state_resource_agencies` (Critical data gap).
*   **Regional Education Agencies (ESCs):**
    *   20 ESCs (100% county coverage, Complete).
*   **School Districts (school_districts):**
    *   16 curated seeds, 248 locator-derived (100% Complete, 0 fallbacks).
*   **Nonprofits / Support Organizations (nonprofit_organizations):**
    *   1564 curated seeds (Statewide mapping and regional chapters).
    *   226 programmatic fallbacks (`np-[county]-tx-fallback` representing generic statewide `Texas Parent to Parent` referral).
*   **Special Education Advocates (iep_advocates):**
    *   19 curated seeds (Attorneys, advocates, and private clinics).
*   **University / Hospital Autism Clinics (resource_providers):**
    *   0 records (Critical data gap).
*   **Waiver Interest Lists (program_waitlists):**
    *   4 interest list records (HCS, CLASS, TxHmL, MDCP) (Complete, correct wait-times).
*   **Waiver Appeal Rules (program_appeal_info):**
    *   6 appeal records (HCS, CLASS, TxHmL, MDCP, ECI, TEA SPED) (Complete).

---

## 🔍 Specific Gaps Identified

### 1. Table/Category Routing Errors (Wrong Table)
*   **HCS County Offices (`county_offices`):** The database currently contains 254 `programmatic_fallback` records for `program_id = 'tx-hcs'` in the `county_offices` table.
    *   *Why this is wrong:* Texas HCS (Home and Community-Based Services) is a developmental disability waiver. In Texas, families do not apply for HCS at their local HHSC Medicaid office. Instead, HCS intake and interest list registrations are handled exclusively by the 39 Local Intellectual and Developmental Disability Authorities (LIDDAs) in `state_resource_agencies`.
    *   *Resolution:* These 254 HCS fallback records in `county_offices` are duplicates/incorrect and should be removed. The HCS program routing should point directly to the LIDDAs.

### 2. Generic Placeholder Data (Needs Real Sourcing)
*   **LIDDA Contact Details (`state_resource_agencies`):** Out of 39 LIDDA records, only Travis County (`integral-care`) and Harris County (`the-harris-center`) have real websites and intake phone numbers. The remaining 37 LIDDAs use a generic state benefits hotline `(855) 937-2372` and placeholder websites like `https://andrews-lidda.tx.gov`.
    *   *Resolution:* We need to scrape/compile their actual local websites (e.g. `andrewscenter.com` for Andrews Center, `bettyhardwick.org` for Betty Hardwick, `bbtrails.org` for Bluebonnet Trails) and their local intake numbers.

### 3. Missing Official Resources (Data Gaps)
*   **Early Childhood Intervention (ECI):** There are **0** local ECI contractor records in the `state_resource_agencies` table for Texas.
    *   *Why this is wrong:* ECI is a critical Part C early intervention program serving children from birth to 3 years. Texas contracts with 37 regional providers to serve all 254 counties.
    *   *Resolution:* We must add the 37 ECI contractors and map their specific county catchment areas to achieve ECI local depth.
*   **Special Education Information Center (SPEDTex):** SPEDTex is the statewide special education information hub. It is currently missing from `nonprofit_organizations` and `state_resource_agencies`.
    *   *Resolution:* Add SPEDTex as a statewide parent training/information center.
*   **Hospital and University Developmental Clinics (`resource_providers`):** The `resource_providers` table has **0** records. Major clinics like Texas Children's Hospital Autism Center, Cook Children's, and UT Dallas Callier Center are completely absent.
    *   *Resolution:* Add these university/hospital autism and developmental clinics.

### 4. Programmatic Fallbacks to Replace
*   **Nonprofit Fallbacks (`nonprofit_organizations`):** There are 226 counties that still have a generic fallback record (`np-[county]-tx-fallback`) pointing to the statewide Texas Parent to Parent organization.
    *   *Resolution:* These fallbacks should be replaced with local resources by mapping counties to their regional PTI project (PATH/PEN/TEAM), local Arc chapters, and regional Legal Aid organizations.

### 5. Schema and Metadata Gaps
*   **Missing `evidence_level` Column:** The `evidence_level` column was successfully added to `county_offices` and `school_districts` in the previous pilot, but is **missing** from:
    *   `nonprofit_organizations`
    *   `state_resource_agencies`
    *   `regional_education_agencies`
    *   `iep_advocates`
    *   `resource_providers`
    *   *Resolution:* A migration script is required to add `evidence_level TEXT` to these 5 tables in both `ca_disability_navigator.db` and `frontend/ca_disability_navigator.db`.

### 6. Categories Needing Manual Review
*   **Provider / Advocate / Legal directories:** Due to robot restrictions and scraper risk levels, private attorneys and advocates in `iep_advocates` should not be pulled automatically. We need to maintain a manual review/curation queue for these private resources.
