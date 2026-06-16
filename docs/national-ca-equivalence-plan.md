# National California-Equivalence Implementation Plan

> [!WARNING]
> SUPERSEDED — DO NOT USE FOR EXECUTION. This document contains deprecated/stale directives, county/state bounds, or metrics, and is superseded by the Zero-Churn Authoritative Truth Ledger.


This document details the nationwide rollout plan to upgrade all 49 non-California states to California-level data depth.

## 1. National Data Inventory

| Metric | CA Mapped | Non-CA Mapped (49 States) | National Total |
|---|---|---|---|
| Mapped Counties | 58 | 3036 | 3094 |
| Verified Offices (Medicaid/HHS) | 116 | 161 | 277 |
| Verified Districts | 65 | 277 | 342 |
| Verified Nonprofits | 35 | 10056 | 10091 |
| Verified Providers/Advocates | 796 | 10902 | 11698 |
| Programmatic Placeholder Fallbacks | 119 | 5976 | 6095 |

## 2. Launch & SEO Indexation Strategy
1. **Strict sitemap gating remains active.** Do not index county roots or county×diagnosis leaves unless their CA-equivalence depth score is $>75%$ and placeholder count is $<15%$.
2. **State Hub Indexation:** All 50 states are indexable.
3. **Gradual Indexation Rollout:** As states are completed, their counties are moved into 'NON_CA_VERIFIED_COUNTIES' in the sitemap route config, exposing them safely to search crawlers.

## 3. Large National Data Gaps
1. **Local Medicaid/HHS Offices:** $95%$ of non-CA counties rely on generic statewide fallback offices.
2. **School District Contacts:** Outside priority counties, school districts default to generic district homepages and general phone lines rather than special education director contacts.
3. **Nonprofits:** Local support chapters are missing for Wave 3 and 4 states.

## 4. Wave-by-Wave Rollout Plan
* **Phase 1: Deepen Wave 1 (Texas, Florida, New York, Pennsylvania, Illinois, Ohio, Georgia).** Target completion: July 2026.
* **Phase 2: Buildout Wave 2 (NC, MI, NJ, VA, WA, AZ, MA, CO, TN, IN).** Target completion: September 2026.
* **Phase 3: Upgrade Wave 3 (Remaining medium states).** Target completion: December 2026.
* **Phase 4: Complete Wave 4 (Lower population/rural states).** Target completion: March 2027.
