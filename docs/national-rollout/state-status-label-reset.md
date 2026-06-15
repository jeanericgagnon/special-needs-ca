# State Status Label Reset

This document outlines the reset of state classification labels under the **V3 release-readiness criteria**. This reset removes score inflation and groups states by their actual data safety and usefulness.

---

## 1. Classification Definitions

1. **`READY_FOR_ALLOWLIST`:** Verified local depth, low manual-review rate (< 10%), zero mocks, and zero fallbacks. Eligible for XML sitemap inclusion.
2. **`LEGACY_EXCEPTION`:** Mapped local routing layers but contains legacy fallback records or unverified advocate listings. Gated from search indexation.
3. **`GATED_REVIEW_READY`:** Mapped county structure with partial pilot data, but blocked by a significant manual review queue. Gated (`noindex`).
4. **`UNVERIFIED_GATED_SHELL`:** Scaffolded county office structures with some category targets mapped, but completely unverified. Gated (`noindex`).
5. **`DATA_BUILDOUT_REQUIRED`:** Empty skeleton states with no local offices or school district contacts populated. Requires full web scraping or manual seeding.
6. **`BLOCKED`:** Structural components are present, but the state is gated from pilot candidacy due to a manual review bottleneck exceeding 40%.

---

## 2. Decisive Classification Reset Matrix

| State Name | Code | Old Status Label | New V3 Status Label | Justification |
| :--- | :---: | :--- | :--- | :--- |
| **Texas** | TX | `COMPLETE` | `READY_FOR_ALLOWLIST` | 0.0% manual review rate; ECI & LIDDA routing complete. |
| **Florida** | FL | `COMPLETE` | `READY_FOR_ALLOWLIST` | 0.2% manual review rate; APD & Early Steps routing complete. |
| **Pennsylvania** | PA | `COMPLETE` | `READY_FOR_ALLOWLIST` | 5.3% manual review rate; MH/ID & IU routing complete. |
| **California** | CA | `COMPLETE` | `LEGACY_EXCEPTION` | Gated due to 77 fallback districts and 69.1% manual review rate. |
| **Illinois** | IL | `KEEP_GATED` | `GATED_REVIEW_READY` | 89 school districts in manual review. |
| **New York** | NY | `KEEP_GATED` | `GATED_REVIEW_READY` | 40 school districts in manual review. |
| **Ohio** | OH | `KEEP_GATED` | `GATED_REVIEW_READY` | 166 school districts in manual review. |
| **Georgia** | GA | `KEEP_GATED` | `BLOCKED` | 41.3% manual review rate (blocked due to data bottleneck). |
| **North Carolina** | NC | `KEEP_GATED` | `UNVERIFIED_GATED_SHELL` | Mapped catchments but lacks verified county offices/districts. |
| **Michigan** | MI | `KEEP_GATED` | `UNVERIFIED_GATED_SHELL` | Mapped catchments but lacks verified county offices/districts. |
| **Other 40 States** | - | `KEEP_GATED` | `DATA_BUILDOUT_REQUIRED` | Mapped structurally but contains zero verified local offices or contacts. |
