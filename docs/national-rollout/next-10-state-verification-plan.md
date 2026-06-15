# Next 10 State Verification Plan

This document outlines the prioritizations, rollout roadmap, and exact verification steps required to upgrade our Wave 2 high-value states from **PILOT-READY PARTIAL** to launch-ready **COMPLETE** status.

---

## 1. Selected Next States for Upgrade

The Wave 2 candidate states were chosen due to high population, web traffic, and existing data structure density. During our June 2026 sprint, the first two candidates were successfully upgraded to verified pilot states:

1. **North Carolina (NC):** **UPGRADED TO PILOT** (Depth: 79.4%, Mocks: 0, Fallbacks: 0)
2. **Michigan (MI):** **UPGRADED TO PILOT** (Depth: 79.6%, Mocks: 0, Fallbacks: 0)

The remaining 8 states slated for the next verification sprints are:

3. **New Jersey (NJ):** 21 counties. High density, low county count makes it a quick win.
4. **Virginia (VA):** 95 counties, 285 nonprofits.
5. **Washington (WA):** 39 counties. High-value progressive waiver structures.
6. **Arizona (AZ):** 15 counties. Very low county count, highly concentrated population.
7. **Massachusetts (MA):** 14 counties. Complex regional education but very small county count.
8. **Colorado (CO):** 64 counties.
9. **Tennessee (TN):** 95 counties.
10. **Indiana (IN):** 92 counties.

---

## 2. Core Upgrades and Sourcing Strategy

To upgrade these remaining 8 states to pilot status, we must replace their current statewide fallbacks and manual-review placeholders with verified local data:

### 2.1 Local DD/IDD Intake Offices & Catchments
* **Current State:** 2 statewide manual-review records per state.
* **Target:** Map and ingest the regional DD waiver intake offices (e.g., Virginia's CSBs, Washington's DDA offices). Identify which counties each office serves and map the catchment boundaries.

### 2.2 Local HHS/Medicaid Enrollment Offices
* **Current State:** 1 unverified office per county.
* **Target:** Harvest the direct local DSS/HHS county office address, local phone number, and official county benefits enrollment website.

### 2.3 School District Special Education Contacts
* **Current State:** 1 district per county, set to manual review.
* **Target:** Scrape the state Department of Education directories to collect the name, phone line, and email address of the Special Education Director for every school district in the state.

---

## 3. Four-Step Verification Protocol

For each state, we will run the following verification protocol to ensure it passes all safety gates before launch:

### Phase 1: Automated Ingestion & Quality Gates
1. Run Playwright scraping tasks for state HHS and Education Board directories.
2. Load scraped records into staging tables.
3. Run automated validators to ensure 0 mock contacts, direct website and source URLs are present, and address fields are complete.

### Phase 2: Staging-to-Production Promotion
1. Run standard normalization and promotion scripts under local database transactions.
2. Downgrade any records that fail validation to `manual_review_required`.

### Phase 3: Corrected Depth Auditing
1. Run the corrected state depth audit command:
   ```bash
   node src/db/audit_state_depth.js <state_id>
   ```
2. Verify that the state satisfies these conditions:
   - **Verified-Depth Score:** Over **80.0%** (Strong verified state).
   - **Manual-Review Rate:** Below **5.0%** for county offices and school districts.
   - **0 active mock numbers.**
   - **0 empty cards.**

### Phase 4: Local Playwright Testing & Sitemap Promotion
1. Run E2E Playwright county page tests for the state.
2. Append the state's verified counties into `verifiedCounties.ts` in the frontend once manual review rate is below 5%.
3. Lift the `noindex` gate by allowlisting the state.
