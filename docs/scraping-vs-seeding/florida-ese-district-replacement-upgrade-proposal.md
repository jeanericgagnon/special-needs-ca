# Upgrade Proposal: Florida ESE District Fallback Replacements

This proposal outlines the ingestion and upgrade strategy for the remaining 53 fallback Exceptional Student Education (ESE) school district records in Florida.

## 1. Executive Summary
*   **Current State:** 53 school district fallbacks in production.
*   **Proposed State:** 53 source-verified ESE district contact records ready for staging.
*   **Classification Breakdown:**
    - `source_supported_ready_to_stage`: 47 records
    - `partial_source_manual_review`: 6 records (Escambia, Lake, Manatee, Monroe, Okeechobee, Putnam)
*   **Target Staging Table:** `staging_scraped_school_districts`
*   **Deduplication Key:** `county_id, program_id`

## 2. Ingestion Plan
*   **Stage Phase:** Stage the 53 records. The 47 ready-to-stage records will be marked `should_promote_automatically = true` and `should_stage_later = true`. The 6 manual review records will be marked `should_promote_automatically = false`, `should_stage_later = true`, and `review_status = manual_review_required`.
*   **Promotion Phase:** Promote the ready-to-stage records to production, replacing fallback placeholders with verified ESE director details.

## 3. Safety Gate
*   No database modifications were performed during research.


## 3. Staging Verification (2026-06-13)
*   Staged 47 promotion-ready ESE school districts.
*   Staged 6 manual-review ESE school districts.
*   Completed staging validation checks successfully. Production data remains completely unchanged.


## 4. Promotion Results (2026-06-13)
*   Promoted 47 source-supported ESE school districts to production (evidence level upgraded to direct_official_page or source_listed).
*   Re-keyed the 47 promoted districts from their `-fallback` ID suffix to clean IDs (e.g. `sd-baker-fl`).
*   Held back the 6 manual-review ESE school districts (Escambia, Lake, Manatee, Monroe, Okeechobee, Putnam) in production, preserving them as fallback records.
*   Florida school districts readiness score improved from 20.9% to 91.0%.
