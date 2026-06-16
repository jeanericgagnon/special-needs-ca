# Texas Forms, Appeals, Waitlists & Transition Ingestion Run Report (Phase 4)

**Date:** June 13, 2026  
**State:** Texas (TX)  
**Ingestion Type:** Forms, Appeals, Waitlists, VR, ABLE, and Transition Resources

---

## 1. Summary of Changes

*   **Records Staged:** 24 records.
    *   Waitlists: 6
    *   Sources: 13
    *   Forms: 5
*   **Records Promoted:** 19 records (6 waitlists to `program_waitlists` and 13 sources to `sources`).
*   **Forms Retained in Staging (Schema Gap):** 5 forms. Staged in `staging_scraped_forms` and marked `auto_accepted`.
*   **Schema Proposal Created:** Yes, located at [forms-and-guides-schema.md](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/schema-proposals/forms-and-guides-schema.md).
*   **Programs Added/Classified:** 5 programs inserted:
    *   `tx-medicaid` (Texas Medicaid & CHIP) — `program_type = 'medicaid_managed_care'`
    *   `tx-yes` (Texas Youth Empowerment Services Waiver) — `program_type = 'behavioral_health_waiver'`
    *   `tx-dbmd` (Texas Deaf-Blind with Multiple Disabilities Waiver) — `program_type = 'medicaid_hcbs_waiver'`
    *   `tx-starplus-hcbs` (Texas STAR+PLUS HCBS Waiver) — `program_type = 'medicaid_managed_care_hcbs'`
    *   `tx-twc-vr` (Texas Workforce Commission Vocational Rehabilitation) — `program_type = 'vocational_rehabilitation'`
*   **Program Classifications Updated:** 7 existing programs updated with rich types (e.g., `tx-hcs` -> `medicaid_hcbs_waiver`, `tx-eci` -> `early_intervention`, `tx-able` -> `able_program`).

---

## 2. Waitlist Duration Estimates & Source Mappings

In strict compliance with waitlist duration corrections:
*   **Waitlist duration labels:** Mapped to `'Not officially stated'` for all 6 waivers. The state HHSC does not officially guarantee waitlist times.
*   **Estimate Source URL:** [https://www.hhs.texas.gov/about/records-statistics/interest-list-status](https://www.hhs.texas.gov/about/records-statistics/interest-list-status)
*   **Estimate Source Type:** `official_state`
*   **Descriptions:** Updated to explain wait time is not officially stated by the state, while referencing historical averages (e.g. 15+ years for HCS, 12-15 years for CLASS) as estimates reported by advocacy groups.

---

## 3. Data Characteristics & Trust Metrics

*   **Evidence Level Distribution (24 records):**
    *   `direct_official_page`: 13 records (sources)
    *   `official_pdf`: 11 records (waitlists and forms)
*   **Confidence Score Distribution (24 records):**
    *   **0.98:** 1 record (YourTexasBenefits portal)
    *   **0.95:** 19 records (TEA forms, waiver waitlists, SPEDTex portal, ECI referral, etc.)
    *   **0.90:** 4 records (guardianship, ombudsman, and star kids appeals)
*   **Verification Status:** All 24 records set to `verification_status = 'source_listed'`.

---

## 4. Before/After Category Scores

*   **Forms & Appeals Score:**
    *   *Before:* 104.0%
    *   *After:* 104.0% (Maintains 104.0%, now backed by rich official dispute resolution links).
*   **Waitlists Score:**
    *   *Before:* 100.0%
    *   *After:* 100.0% (Maintains 100.0%, now includes DBMD and YES waitlist records).
*   **Texas CA-Equivalence Score:**
    *   *Before:* **93.4%**
    *   *After:* **93.4%** (Maintains California-equivalent candidate status, with complete official transition and VR program coverage).

---

## 5. Build and Audit Verification

*   **Standard Audit:** Passed with all categories green (except the localized provider cap).
*   **Depth Audit:** Passed with **93.4% CA-Equivalence Score**.
*   **Next.js Frontend Build:** Compiled cleanly with no compilation issues or TypeScript compiler errors.

---

## 6. Remaining Gaps & Next Steps

1.  **Forms Table Schema Migration:** Implement the production `forms_and_guides` table as proposed in `docs/schema-proposals/forms-and-guides-schema.md` and promote the 5 staged forms.
2.  **Sitemap Allowlisting:** Append pilot counties into `counties.xml` to index the new forms and resources.
3.  **Human Verification Queue:** Submit priority programs to human auditing queue.
