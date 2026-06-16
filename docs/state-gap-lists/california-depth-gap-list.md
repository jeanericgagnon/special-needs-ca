# California Depth Gap Closure Plan

This document outlines the detailed gap analysis and action plan to raise California's **CA-Equivalence Depth Score** from **82.1%** to **90%+** (and ultimately **99%+**) honestly, without gaming the metrics.

---

## 1. Current California Depth Metrics

* **CA-Equivalence Depth Score:** **82.1%** (Classification: *Strong pilot*)
* **Pilot Launch Score:** **91.7%**
* **Total Database Records:** 826 records
* **Generated Fallback Share:** **11.7%** (119 records)
* **Explicit / Source-Listed Share:** **88.3%**
* **Human Verification Share:** **2.1%** (21 records)
* **Indexation Readiness:** **100.0%** (All 58 counties in sitemap)

---

## 2. Top Score Blockers & Penalties

California’s score is primarily held back by programmatic fallback placeholders in two categories:

### A. Special Education & School Districts (Category Score: 31.8% / Weighted Drop: -4.52%)
* **Table:** `school_districts`
* **Gaps:** **77 out of 142 school districts** in the database are programmatic fallback placeholders.
* **Penalty:** The fallback share of $54.2\%$ triggers a heavy **x0.46 fallback penalty** on the entire education category, dropping its contribution from $69.5\%$ to $31.8\%$.

### B. Nonprofit Organizations & Support Chapters (Category Score: 34.3% / Weighted Drop: -4.10%)
* **Table:** `nonprofit_organizations`
* **Gaps:** **42 out of 77 nonprofits** mapped to California counties are programmatic fallbacks.
* **Penalty:** The fallback share of $54.5\%$ triggers a **x0.45 fallback penalty** on the category, dropping it from $75.3\%$ to $34.3\%$.

### C. Waivers & Waitlists (Category Score: 93.0% / Weighted Drop: -0.70%)
* **Table:** `program_waitlists`
* **Gaps:** Mapped waitlist registries count is 4 out of 5 expected. The waitlist rules and intake details for **California Children's Services (CCS) Application** (`ccs-application`) are missing from the table.

### D. Source Provenance & Verification (Category Score: 75.2% / Weighted Drop: -2.48%)
* **Table:** `sources` and `source_verifications`
* **Gaps:** Only **21 out of 826 records** have human-verified status. The remaining records are unverified placeholders ($64.3\%$) or source-listed ($33.2\%$).

---

## 3. Prioritized Fixes & Estimated Score Lift

| Priority | Fix Description | Target Table / Scope | Estimated Score Lift | Cumulative Score | User & SEO Value |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Replace 77 fallback school districts with official special education directors | `school_districts` | **+8.18%** | **90.3%** | **Highest.** Replaces placeholders with real, actionable contact names, direct emails, and phone lines. |
| **2** | Replace 42 fallback support chapters with local Arc, family resources, and PTI chapters | `nonprofit_organizations` | **+6.57%** | **96.8%** | **High.** Connects families with local support chapters in rural/non-metro counties. |
| **3** | Map waitlist/denial rules for CCS application | `program_waitlists` | **+0.70%** | **97.5%** | **Medium.** Clarifies CCS review timelines and wait list policies. |
| **4** | Human-audit 50% of the database records (413 records) and register sources | `sources` / `source_verifications` | **+1.48%** | **99.0%** | **Highest Trust.** Unlocks the **Human-verified state** classification. |

---

## 4. Crawl Targets & Data Source Plan

To acquire the required explicit records, we must target and extract data from the following domains:

1. **[`https://www.cde.ca.gov`](https://www.cde.ca.gov) (California Department of Education):**
   * **Target:** Special Education Local Plan Area (SELPA) directory and school district directories.
   * **Data to Extract:** Direct phone numbers and emails for special education administrators/directors.
   * **DB Target:** `school_districts` contacts update.
2. **[`https://www.frcnca.org`](https://www.frcnca.org) (Family Resource Centers Network of CA):**
   * **Target:** Roster of local Family Resource Centers.
   * **Data to Extract:** Physical addresses, phone numbers, and URLs for local support branches.
   * **DB Target:** `nonprofit_organizations` (to replace programmatic placeholders in rural counties).
3. **[`https://www.thearc.org/find-a-chapter/`](https://www.thearc.org/find-a-chapter/) (The Arc CA Chapters):**
   * **Target:** California Arc local chapters directory.
   * **Data to Extract:** County mappings and direct contact emails.
   * **DB Target:** `nonprofit_organizations`.
4. **[`https://www.dhcs.ca.gov`](https://www.dhcs.ca.gov) (Department of Health Care Services):**
   * **Target:** CCS county office listings and service guidelines.
   * **Data to Extract:** CCS waitlist rules (CCS has no waitlist but mandates enrollment decisions within 30 days of receiving clinical reports).
   * **DB Target:** `program_waitlists` ingestion.

---

## 5. Summary Path to California-Equivalent Excellence

By executing this crawl plan and replacing placeholders:
1. **Uncapped score increases to 99.0%** (meeting the $92\%$ threshold for California-equivalent candidate).
2. **Human verification share increases to 50%**, qualifying California for the **Human-verified state** status.
3. **Generated fallback share drops to 0%** (from $11.7\%$), removing all fallback penalties.
