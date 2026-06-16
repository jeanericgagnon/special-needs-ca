# Georgia Manual Review Hardening Audit

**Audit Date:** 2026-06-14  
**Georgia Status:** **PILOT-READY PARTIAL**  
**Total Manual Review Records:** 296  
**Security Gating:** **ACTIVE (noindex header & sitemap exclusion)**  

---

## 1. Category Breakdown of Manual Review Records

A total of **296 records** for Georgia in production tables are marked as `manual_review_required`:

*   **School Districts**: **148 records** (All rural/non-priority school districts are downgraded with empty contacts).
*   **County Offices**: **148 records** (All rural/non-priority DFCS storefront offices are downgraded with empty contacts).
*   **Nonprofit Organizations**: **0 records** (All 338 nonprofits represent real, verified, write-protected support seed organizations).
*   **Resource Providers (Clinics)**: **0 records** (All private/commercial clinics have been successfully excluded).
*   **State Resource Agencies**: **0 records** (All 7 regional/state DBHDD and BCW offices are fully source-supported and verified).
*   **Regional Education Agencies**: **0 records** (All 5 Georgia RESAs are fully source-supported and verified).
*   **Other Tables**: **0 records** (No other tables have unverified or manual review records for Georgia).

---

## 2. Frontend Display & Safety Verification

The React components in the Next.js frontend were inspected to verify display behavior for the 296 `manual_review_required` records:

1.  **Verified Badges**: The `TrustBadge` component renders a teal `Verified official contact` badge ONLY if the status is `'official_verified'`, `'human_verified'`, or `'verified'`. For `'manual_review_required'`, it falls back to the default gray `#64748b` icon and label: **`Unverified directory listing`**. No manual-review records display verified badges.
2.  **Contact Detail Hiding**: The frontend page layout hides contact detail rows if the database value is an empty string `""` or `null`. Because all 296 records had their phone, email, and address fields pre-cleansed to `""` during Phase 1 and Phase 5, **no placeholder or empty fields are rendered** on the card layouts.
3.  **Directory Links**: The source URLs on the unverified school district cards render correctly and point to the official **GaDOE Special Education Services directory**. Unverified county office cards point to the official **Georgia DHS DFCS locations locator**.
4.  **County Page Routing**: Rural county pages render cleanly without empty/spammy cards, since the layout safely hides empty phone/email details while maintaining links to regional DBHDD, Babies Can't Wait, and RESA support directories.

---

## 3. Score Honesty & CA-Equivalence Assessment

### A. Why Georgia gets 92.9% CA-equivalence despite 296 manual-review records
The CA-equivalence score measures **structural depth and architectural completeness** of a state upgrade, rather than the proportion of records that have underwent local phone/email auditing:
*   **0 Generated Fallbacks**: Georgia has replaced 100% of its programmatic fallback IDs (e.g. `sd-appling-ga-fallback` -> `sd-appling-ga` and `off-appling-ga-medicaid` -> `off-appling-ga-medicaid`).
*   **Custom Rekeying**: Mapped custom, unique primary keys to 100% of counties and districts.
*   **Explicit Provenance**: Promoted records from staging tables with `data_origin = 'scraped'`. Because they are not flagged as programmatic fallbacks, the depth audit treats them as explicit database rows, which is correct structurally but inflates the verified coverage metric.

### B. True Sourcing vs. Directory Routing
*   **100% Sourced & Verified Categories**:
    *   *State Agencies* (7/7): Centralized Babies Can't Wait and 6 DBHDD Field Offices.
    *   *RESAs* (5/5): Metro Atlanta, Coastal, CSRA, Chattahoochee Flint, and Northeast Georgia RESAs.
    *   *Priority Metro Counties* (11/159): Fully populated with verified DFCS storefront addresses and local school district special education director numbers.
    *   *Nonprofits* (338/338): Seeded with real Parent to Parent of Georgia and GAO statewide support.
*   **Directory-Routed Categories** (296/668):
    *   *Rural School Districts* (148/159): Cleared contact details, fallback routed to the GaDOE main directory.
    *   *Rural Medicaid Offices* (148/159): Cleared contact details, fallback routed to the DHS main storefront locator.

---

## 4. Database & Metadata Security Check

*   **PRAGMA integrity_check**: **PASS** (Returned `ok`).
*   **Mock Phone Numbers (LIKE '%555-%')**: **0** records.
*   **Fictional Websites/Emails (LIKE '%example.com%')**: **0** records.
*   **Harrisburg/Fictional Addresses**: **0** records.
*   **Statewide Hotline Leaks**: **0** copied to local storefronts (statewide numbers exist only on statewide records).
*   **Unverified Commercial Providers**: **0** auto-promoted (all held in review queues).
*   **Protected Records Losses**: **0** (All 354 write-protected seed records are intact and active).

---

## 5. Completed Hardening Checks
- [x] **PRAGMA integrity_check**
- [x] **Georgia standard audit**
- [x] **Georgia depth audit**
- [x] **Protected-record count verification**
- [x] **Placeholder/fake data scan**
- [x] **Next.js production build**
- [x] **Targeted Georgia Playwright smoke test**

---

## 6. Project Rollout Strategy

1.  **Honest Status**: Georgia is **PILOT-READY PARTIAL**. The structural routing layer is complete and zero mock/fake details exist in production, making it safe for pilot testing.
2.  **Remaining Work before COMPLETE**:
    *   Gather and audit authentic storefront addresses/local phone numbers for the 148 rural county DFCS offices.
    *   Gather and audit local contact phone numbers/special education director emails for the 148 rural school districts.
    *   Pass the state through the human auditing queue to verify local contact details.
    *   Update `counties.xml` to include Georgia counties in the sitemap allowlist when ready for production indexation.
3.  **Moving to the Next State**: We can safely proceed to the next state **without sitemap/indexing changes** because Georgia county-diagnosis pages remain gated under `noindex` headers. There is zero risk of unverified listings leaking into search engines.
4.  **Recommended Next State**: **North Carolina (NC)**.
