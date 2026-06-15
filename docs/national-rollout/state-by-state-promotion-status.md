# State-by-State Promotion Status

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  

---

## 1. Summary of Promotion Progress

Multi-state geographic batch promotions are strictly suspended. Promotion is managed on a state-by-state basis, requiring staging, validation, diff creation, and rollback generation before promotion.

- **Promoted to Production (Indexable):** 4 States (California, Texas, Florida, Pennsylvania)
- **Staged / In Validation (Gated):** 6 States (Georgia, Illinois, New York, Ohio, North Carolina, Michigan)
- **Skeleton Active (Noindex Gated):** 40 States

---

## 2. Promotion Status Registry

| State | Code | Sitemap Allowed | Indexability | Promotion Status | Details |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **California** | CA | **YES** | `index` | **PROMOTED** | Legacy CA records active. county × diagnosis leaves active for LA and Orange counties. |
| **Texas** | TX | **YES (248 Co)** | `index` | **PROMOTED** | Upgraded local storefronts and school districts active in allowlist counties. |
| **Florida** | FL | **YES (14 Co)** | `index` | **PROMOTED** | Upgraded county offices and ESE school districts active in allowlist counties. |
| **Pennsylvania** | PA | **YES (8 Co)** | `index` | **PROMOTED** | Upgraded DHS offices, P&A, and PTI active in allowlist counties. |
| **New York** | NY | **NO** | `noindex` | **STAGED** | Scraped data is staged; validation pending. Gated. |
| **Ohio** | OH | **NO** | `noindex` | **UPGRADED** | Central portals and helplines promoted. Gated. |
| **Georgia** | GA | **NO** | `noindex` | **UPGRADED** | Central portals and helplines promoted. Gated. |
| **Illinois** | IL | **NO** | `noindex` | **STAGED** | Scraped data is staged; validation pending. Gated. |
| **North Carolina** | NC | **NO** | `noindex` | **STAGED** | Scraped data is staged; validation pending. Gated. |
| **Michigan** | MI | **NO** | `noindex` | **STAGED** | Scraped data is staged; validation pending. Gated. |
| **All Other 40 States** | - | **NO** | `noindex` | **SKELETON** | Skeleton records are gated behind `noindex` tags and excluded from sitemaps. |

---

## 3. Promotion Policy & Controls

1. **Statewide Isolation:** No promotion may span multiple states in a single batch.
2. **Rollback Generation:** Every database modification must be backed up with a matching rollback script in the `rollback/` directory.
3. **No Sitemap Expansion:** No new counties or states can be added to the sitemap allowlist without explicit approval.
