# Ohio Full District Expansion Plan

This document outlines the roadmap to elevate Ohio from a county-level routing model to a comprehensive, multi-district special education directory.

---

## 1. Target Model Recommendation

We recommend **Model C (Hybrid Model: County-level routing for launch, full district expansion queued)**.

### Rationale:
*   **Launch-Readiness:** The 88 county JFS, CBDD, EI, and primary school board contacts currently achieve **100% geographic routing completeness** for Ohio. This ensures families in all 88 counties can route to their intake points.
*   **Expansion Scope:** Upgrading to the full 611 school districts requires massive, state-wide scraping of local municipal directories. Ingesting this blindly without manual verification violates our safety guidelines and risks directory spam.
*   **Implementation Strategy:** We will launch Ohio as a pilot with the current 88 primary/county-routing directory contacts, and queue the ingestion of the remaining 523 local school districts as a post-launch depth wave.

---

## 2. Dataset Classification & Proposed Seed

We have compiled the first Wave of the school district expansion under `data/state-upgrades/ohio/phase_records/full_school_districts.json` containing **95 districts** (with multiple major municipal districts mapped to Cuyahoga, Franklin, and Hamilton counties, and primary seat-city districts for other counties).

### Classification breakdown:
*   **source_supported_ready_to_stage:** **95** (All records mapped with official IRN identifiers, websites, and emails).
*   **partial_source_manual_review:** **0**
*   **no_special_ed_contact_found:** **0**
*   **directory_only:** **0**

---

## 3. Staging and Promotion Rules

To ensure data integrity during expansion, the following transition rules are enforced:
1.  **Do Not Overwrite:** Expanding local school districts must not delete or overwrite the 88 clean county-routing records. Existing county-routing records must be preserved with a `service_area_type = 'county_routing'` metadata flag.
2.  **Many-to-One County Mappings:** Multiple school districts are allowed to map to a single county (e.g. `cuyahoga-oh` maps to Cleveland Metro, Lakewood, and Shaker Heights).
3.  **Strict Serial Ingestion:** School district promotions must run as an isolated single-state transaction, never as a multi-state batch.
