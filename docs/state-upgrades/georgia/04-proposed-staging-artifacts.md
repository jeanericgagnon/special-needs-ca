# Georgia Proposed Staging Artifacts

This document details the configuration and contents of the cleaned JSON staging files in `data/state-upgrades/georgia/phase_records/`.

## 1. Phase JSON Configurations

### A. Benefits/HHS (`benefits_hhs.json`)
*   **Total Records:** 159
*   **Fields:** `source_url`, `confidence_score`, `notes`, `suggested_target_id`, `name`, `phone`, `email`, `physical_address`, `physical_county`, `evidence_level`, `verification_status`, `data_origin`
*   **Values:** 
    *   11 priority counties: correct physical addresses, phone = `null`, `verification_status = 'source_listed'`.
    *   148 directory counties: address = `null`, phone = `null`, `verification_status = 'manual_review_required'`.

### B. DD/IDD Waiver Routing (`dd_idd.json`)
*   **Total Records:** 6 (one per region)
*   **Fields:** `source_url`, `confidence_score`, `notes`, `suggested_target_id`, `name`, `phone`, `physical_county`, `agency_type`, `evidence_level`, `verification_status`, `data_origin`
*   **Values:** Real administrative office physical addresses, correct regional phone numbers, `physical_county` maps the comma-separated county FIPS IDs served, `verification_status = 'source_listed'`.

### C. Early Intervention (`early_intervention.json`)
*   **Total Records:** 1 (statewide coordinator)
*   **Fields:** `source_url`, `confidence_score`, `notes`, `suggested_target_id`, `name`, `phone`, `physical_county`, `agency_type`, `evidence_level`, `verification_status`, `data_origin`
*   **Values:** Name = `"Georgia Babies Can't Wait State Office"`, Phone = `"(888) 651-8224"`, `physical_county = 'statewide'`, `verification_status = 'source_listed'`.

### D. School Districts (`district_replacements.json`)
*   **Total Records:** 148
*   **Fields:** `source_url`, `confidence_score`, `notes`, `suggested_target_id`, `name`, `phone`, `email`, `website`, `physical_county`, `evidence_level`, `verification_status`, `data_origin`
*   **Values:** Phone = `null`, email = `null`, website = `null`, `suggested_target_id` = `sd-[county-name]-ga` (without `-fallback`), `verification_status = 'manual_review_required'`.

### E. Trusted Nonprofits (`trusted_nonprofits.json`)
*   **Total Records:** 331
    *   159 GAO records (statewide)
    *   159 P2P records (statewide)
    *   11 Centers for Independent Living (metro priority)
    *   9 Arc of Georgia local chapters (southwest, macon, liberty, walker, douglas, clayton, northeast, stephens, thomas grady)
*   **Fields:** `id`, `name`, `county_id`, `website`, `phone`, `focus_condition`, `source_url`, `source_type`, `data_origin`, `verification_status`, `confidence_score`, `evidence_level`
*   **Values:** All mock numbers cleared. GAO and P2P have their correct statewide phone numbers and websites. Local CILs and real Arc chapters are mapped to their respective counties.
