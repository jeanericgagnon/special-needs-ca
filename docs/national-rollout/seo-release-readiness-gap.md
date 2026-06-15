# SEO Release Readiness Gap

This document evaluates the SEO indexability risk and sitemap release-readiness across the 50 states, focusing on content uniqueness, thin-content risk, sitemap eligibility, and GSC readiness.

---

## 1. SEO Audit Dimensions vs California Gold Standard

### 1.1 Indexable Page Quality
* **California Standard:** Every county page contains rich, unique local content, including local office addresses, custom school district special education metrics (enrollment, IEP rate, inclusion rates), and local nonprofit listings.
* **Gated States Gap:** County pages in the 42 partial states contain identical statewide fallback links (e.g., links to the state Medicaid site or state DD waiver site) with zero localized county-specific contacts.

### 1.2 County Page Uniqueness
* **California Standard:** High. 58 unique configurations with localized county contacts.
* **Texas Standard:** High. 254 counties, rich with 2,129 local nonprofits and 814 advocates.
* **Partial States Risk:** Extremely low uniqueness. County pages for Alabama or Colorado would look 95% identical, varying only by the county name in the headers. This triggers search engine duplicate content penalties.

### 1.3 Thin-Content Risk
* **Definition:** Google's Helpful Content System (HCS) penalizes sites containing large numbers of automated, thin "directory shell" pages.
* **Status:** Allowlisting gated states (like Georgia or Ohio) before their manual-review records are resolved would add hundreds of thin county pages to the index. For example, Ohio county pages would render with empty school district cards, creating a poor user experience.

### 1.4 Sitemap & Indexing Status
* **Allowlist:** Only California, Texas, Florida, and Pennsylvania are allowlisted.
* **Noindex Gating:** All other 47 states are explicitly marked `noindex, follow` in the page metadata and excluded from the sitemap. This protects the site's overall indexing health.

---

## 2. GSC and Sitemap Readiness Matrix

| Group / State | Sitemap Eligible? | Noindex Status | Thin Page Risk | Page Uniqueness | GSC Action Needed |
|:---|:---:|:---|:---|:---|:---|
| **California** | Yes | Indexable | Low (Rich data) | High | Clean up legacy fallbacks/mock records |
| **Texas** | Yes | Indexable | Low (2k+ records) | High | Spot-check and monitor search console impressions |
| **Florida** | Yes | Indexable | Low | Medium-High | Resolve remaining 1 manual review district |
| **Pennsylvania**| Yes | Indexable | Low | Medium-High | Seed more local nonprofits to boost density |
| **Illinois** | No | `noindex` | High (89 MR districts) | Medium-Low | Verify school districts before allowlisting |
| **New York** | No | `noindex` | High (0 nonprofits) | Medium-Low | Seed nonprofits; verify 62 manual reviews |
| **Ohio** | No | `noindex` | High (0 nonprofits) | Medium-Low | Seed nonprofits; verify 166 manual reviews |
| **Georgia** | No | `noindex` | Critical (296 MR) | Low | Resolve 296 manual review records |
| **Wave 2 States**| No | `noindex` | Critical (100% MR) | Low | Full crawl and verify before allowlisting |
| **Wave 3/4** | No | `noindex` | Critical (100% MR) | Low | Full crawl and verify before allowlisting |

---

## 3. Recommended SEO Guardrail Policy

1. **Keep Noindex Active:** Do not lift `noindex` for any state that does not have:
   - **0 Mock Contacts** (no 555 numbers or fake links).
   - **Manual review rate below 5%** of total records.
   - **At least 1 verified local county office** per county.
   - **At least 1 verified local school district** per county.
2. **Sitemap Synchronization:** Keep `verifiedCounties.ts` synchronized with the database status. Only allowlist counties that pass all quality gates.
3. **Internal Linking Reinforcement:** Ensure each county page has:
   - Breadcrumb links back to the state hub.
   - Links to neighboring counties within the same state to distribute crawler equity.
   - Links to regional education and DD routing pages.
