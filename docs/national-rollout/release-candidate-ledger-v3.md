# Release Candidate Ledger (V3)

**Audit Version:** 3.0  
**Date:** June 14, 2026  
**Status:** APPROVED FOR LOCAL STAGING (NO GSC SUBMISSION)

This ledger defines the authoritative release candidate status for all states under the **V3 Index Eligibility Gates**. We enforce a zero-trust model where any state failing to meet all seven quality gates is strictly gated with a `noindex` tag.

---

## 1. The V3 Index Eligibility Gates

To prevent doorway-page search penalties and guarantee parent utility, a state must pass all seven gates before public allowlisting:
1. **Zero Mock Contacts:** `0` dummy phone numbers, test emails, or generic websites.
2. **Zero Active Fallbacks:** `0` programmatic fallback cards rendered on public routes.
3. **Low Manual-Review Rate:** Less than 10.0% of local records flagged as `manual_review_required`.
4. **Verified Local Routing:** Direct county/regional contacts mapped (not just statewide hotlines).
5. **No Empty Cards:** CSS structures hide empty parent-facing contact rows.
6. **High Source Target Trust:** All scraped sources must map to verified official state or institutional domains.
7. **Unique Parent-Intro Content:** County pages must display state-specific Medicaid/agency descriptions.

---

## 2. Release Candidate Audit Ledger

### 🏆 Category 1: APPROVED RELEASE CANDIDATES (READY_FOR_ALLOWLIST)

These states have passed all 7 V3 gates. They are compiled into local sitemaps but **held from public GSC submission**.

#### 🤠 Texas (TX) — GO (Staged)
- **Manual Review Rate:** **0.00%** (0 / 486 records)
- **Mocks & Fallbacks:** **0** Mocks, **0** Fallbacks
- **Honest Score:** **100.0%**
- **Medicaid/Waiver Label:** Texas Medicaid, ECI (Early Childhood Intervention), LIDDA (Local Mental Health/IDD Authorities)
- **Sitemap Status:** Staged locally.

#### 🌴 Florida (FL) — GO (Staged)
- **Manual Review Rate:** **0.22%** (1 / 456 records)
- **Mocks & Fallbacks:** **0** Mocks, **0** Fallbacks
- **Honest Score:** **99.8%**
- **Medicaid/Waiver Label:** Florida Medicaid, APD (Agency for Persons with Disabilities), Early Steps
- **Sitemap Status:** Staged locally.

#### 🔔 Pennsylvania (PA) — GO (Staged)
- **Manual Review Rate:** **5.30%** (16 / 302 records)
- **Mocks & Fallbacks:** **0** Mocks, **0** Fallbacks
- **Honest Score:** **94.7%**
- **Medicaid/Waiver Label:** Pennsylvania Medical Assistance, MH/ID (Mental Health & Intellectual Disability), Intermediate Units (IU)
- **Sitemap Status:** Staged locally.

---

### 🔒 Category 2: GATED LEGACY EXCEPTIONS (LEGACY_EXCEPTION)

These states have historical production roots but do not meet V3 release standards and must remain gated.

#### 🐻 California (CA) — HOLD (Keep Gated)
- **Manual Review Rate:** **69.09%** (657 / 951 records)
- **Mocks & Fallbacks:** **0** Mocks, **40** Fallbacks
- **Honest Score:** **26.7%** (Heavily penalized by 77 legacy fallback school districts and raw scraped records)
- **Medicaid/Waiver Label:** Medi-Cal, Regional Centers, Family Resource Centers
- **Decision:** **HOLD / GATED.** Do not index new diagnosis or county routes. Keep existing counties gated under `noindex` for new URLs.

---

### ⏳ Category 3: GATED RETRIEVAL CANDIDATES (GATED_REVIEW_READY)

These states are category-complete but blocked by high manual-review backlogs.

* **Illinois (IL):** Mocks = 0, Fallbacks = 0, MR Rate = **18.02%** (109 / 605 records). Requires school district direct contact validation.
* **New York (NY):** Mocks = 0, Fallbacks = 0, MR Rate = **24.43%** (64 / 262 records). Requires LDSS intake-specific phone validation.
* **Ohio (OH):** Mocks = 0, Fallbacks = 0, MR Rate = **35.29%** (180 / 510 records). Requires county CBDD contact audits.

---

### 🛑 Category 4: SKELETAL SCAFFOLDS (DATA_BUILDOUT_REQUIRED)

All remaining 43 states.
- **Manual Review Rate:** **>75.0%** average (skeletal records without localized direct routing).
- **Mocks & Fallbacks:** **0** Mocks, **0** Fallbacks.
- **Honest Score:** **~20.0%**
- **Sitemap Status:** Strictly excluded; served with hard `noindex` tags.
