# SEO Index Eligibility Results

This document lists the indexation eligibility outcomes across all 50 states under the V3 quality gate controls.

---

## 1. National Indexation Eligibility Summary

| State Name | Code | County Count | Mocks | Fallbacks | Eligibility Status | Sitemap Status |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **Texas** | TX | 254 | 0 | 0 | 🟢 **Eligible** | Included in sitemap index |
| **Florida** | FL | 67 | 0 | 0 | 🟢 **Eligible** | Included in sitemap index |
| **Pennsylvania** | PA | 67 | 0 | 0 | 🟢 **Eligible** | Included in sitemap index |
| **California** | CA | 58 | 0 | 77 | 🟡 **Gated** (Legacy Exception) | Root directory indexable; leaves blocked |
| **Illinois** | IL | 102 | 0 | 0 | 🔴 **Gated** (Unverified school districts) | Blocked (`noindex`) |
| **New York** | NY | 62 | 0 | 0 | 🔴 **Gated** (Unverified school districts) | Blocked (`noindex`) |
| **Ohio** | OH | 88 | 0 | 0 | 🔴 **Gated** (Unverified school districts) | Blocked (`noindex`) |
| **Georgia** | GA | 159 | 0 | 0 | 🔴 **Gated** (Blocked, high MR rate) | Blocked (`noindex`) |
| **North Carolina** | NC | 100 | 0 | 0 | 🔴 **Gated** (Skeleton) | Blocked (`noindex`) |
| **Michigan** | MI | 83 | 0 | 0 | 🔴 **Gated** (Skeleton) | Blocked (`noindex`) |
| **Other 40 States** | - | Mapped | 0 | 0 | 🔴 **Gated** (Skeletons) | Blocked (`noindex`) |

---

## 2. Eligibility Criteria Verification

1. **Texas (TX):** Passed. 0.0% manual review. verified ECI and LIDDA local routing.
2. **Florida (FL):** Passed. 0.2% manual review. verified APD and Early Steps local routing.
3. **Pennsylvania (PA):** Passed. 5.3% manual review. verified MH/ID and CAO local routing.
4. **California (CA):** Gated. Contains 77 fallback districts. Must remain gated from new county x diagnosis route indexation until these are curated.
5. **Gated Pilot States (NY, IL, OH):** Blocked due to manual review backlog in school districts. Once these are curated below 10%, they can be allowlisted.
