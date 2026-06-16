# Website Information Model

This document outlines the master information model for the website, detailing the entities, relations, required/optional fields, staging targets, and trust requirements.

---

## 1. Core Entities and Mappings

### State
* **Required Fields:** `id`, `name`, `code`
* **Optional Fields:** `flag_url`, `description`
* **Target Table:** `states`
* **Staging Table:** `N/A`
* **Validation Rules:** State code must be exactly 2 characters (e.g. `CA`, `TX`). State ID must be the lowercase, slugified state name.

### County
* **Required Fields:** `id`, `name`, `state_id`
* **Optional Fields:** `ihss_wage_rate`, `fips_code`
* **Target Table:** `counties`
* **Staging Table:** `N/A`
* **Validation Rules:** `state_id` must reference an existing record in `states` table.

### Benefits/HHS Office
* **Required Fields:** `id`, `county_id`, `office_name`, `program_id`, `verification_status`, `data_origin`
* **Optional Fields:** `address`, `phone`, `email`, `website`, `source_url`, `last_verified_date`
* **Target Table:** `county_offices`
* **Staging Table:** `staging_scraped_county_offices`
* **Trust Metadata:** Must track `confidence_score` and `verification_status` ('official_verified', 'manual_review_required').

### DD/IDD Local Routing Agency
* **Required Fields:** `id`, `name`, `state_id`
* **Optional Fields:** `catchment_boundaries`, `intake_phone`, `website`, `source_url`
* **Target Table:** `regional_centers`
* **Staging Table:** `N/A`
* **County Mapping Table:** `regional_center_counties`

### HCBS Waiver Program
* **Required Fields:** `id`, `state_id`, `name`, `slug`
* **Optional Fields:** `description`, `eligibility_criteria`, `source_url`
* **Target Table:** `programs`
* **Staging Table:** `N/A`

### Waiver Waitlist/Interest List
* **Required Fields:** `program_id`, `waitlist_status`, `estimated_wait_time`
* **Optional Fields:** `source_url`, `last_updated_at`
* **Target Table:** `program_waitlists`
* **Staging Table:** `staging_scraped_waitlists`

---

## 2. Information Flow and Promotion Rules

```
[ Raw Scraped Ingestion ] ──► [ Staging Table ] ──► [ Schema Validation Gate ] ──► [ Promotion Transaction ] ──► [ Production Tables ]
```

1. **Scraped Ingestion:** Data is loaded from JSON source targets into staging tables (e.g. `staging_scraped_school_districts`).
2. **Schema Validation Gate:** Checks for duplicate IDs, fake phone numbers, empty websites, and wrong-state codes.
3. **Promotion Transaction:** Promotes valid, verified data to production tables under transactional write protection.
