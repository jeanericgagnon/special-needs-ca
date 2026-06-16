# New York Research Summary & Validation Plan

Verified parameters and checklist for the New York state upgrade.

## 1. Verified Core Counts & Parameters
*   **Total Counties:** 62
*   **Curated Protected Counties:** 12 (Write guards active)
*   **Fallback Medicaid Offices to Replace:** 50
*   **OPWDD DDRO Regions:** 7 regional office listings serving 62 counties
*   **Early Intervention County/Municipal Contacts:** 57 counties + 5 NYC boroughs
*   **BOCES Count:** 37
*   **Fallback School Districts to Replace:** 50
*   **Trusted Nonprofits:** Parent Centers, DRNY, Center for Independent Living, Arc Chapters

## 2. Target Tables and Schemas
*   **Benefits Routing:** `county_offices`
*   **OPWDD Front Door:** `state_resource_agencies` & `regional_center_counties`
*   **Early Intervention:** `state_resource_agencies` & `regional_center_counties` (county/municipal routing)
*   **BOCES Regional Agencies:** `regional_education_agencies`
*   **School Districts:** `school_districts` (re-keyed after reference audit)
*   **Institutional Clinics:** `resource_providers` (no commercial therapist listing)
*   **Forms/Guides:** `staging_scraped_forms`
*   **Appeals/Fair Hearings:** `program_appeal_info`
*   **Waitlists:** `program_waitlists`
*   **Trusted Support:** `nonprofit_organizations`
*   **Provider Review Queue:** `provider_legal_review_queue.json` (Local review queue only, no promotion)

## 3. Leakage & Safety Audit Checklist
- [x] No Florida/Texas leakage in configuration files.
- [x] Write protection active for all 12 curated counties.
- [x] Rollback scripts configured to generate in `docs/state-upgrades/new-york/rollback/`.
- [x] Mutation guards active to detect any unauthorized database modifications.
