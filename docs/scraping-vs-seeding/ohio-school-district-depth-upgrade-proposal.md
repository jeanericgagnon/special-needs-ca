# Ohio School District Depth Upgrade Proposal

This proposal outlines the technical, schema, and UI adaptations required to transition Ohio from county-level special education routing to exhaustive local school district coverage.

---

## 1. Technical Audit Summary

*   **Current State:** Ohio has **100% county-level routing completeness** with exactly 88 school district contacts in the database.
*   **Target State:** Upgrade to **611 public school districts** to map every local municipal school board in Ohio.
*   **Database Schema Capability:** Fully verified. The `school_districts` table holds multiple records per `county_id` without unique index constraint violations. The frontend correctly loops and displays all districts matching the county ID.

---

## 2. Proposed Changes

### A. Database Seeding Expansion
We will stage the **95 school districts** compiled in `full_school_districts.json` to replace the 88 county-level representative contacts:
*   Cuyahoga County will expand to **3 local districts** (Cleveland Metro, Lakewood, Shaker Heights).
*   Franklin County will expand to **4 local districts** (Columbus City, Upper Arlington, Worthington, Dublin).
*   Hamilton County will expand to **3 local districts** (Cincinnati Public, Oak Hills, Sycamore).
*   The remaining 81 counties will map to their primary county-seat city school district.

### B. UI/Copy Adjustments
To prevent misleading parents, we will update the directory templates in `frontend/src/` to display:
*   **"Primary County-Wide / Special Education Contacts"** for representative routing entries.
*   **"Local School Districts (Special Education Departments)"** for specific municipal school boards.

---

## 3. Deployment Gating & Timeline
*   **Phase 1 (Active):** Ohio is certified as the post-autonomy control state with the current 88 primary/county-routing directory.
*   **Phase 2 (Wave B):** Scrapers are deployed to harvest the special education director names and emails for the remaining 523 rural school districts, staging them for manual validation.
*   **Batching Status:** Ingestion batching for approved categories remains **ACTIVE** (since Ohio has successfully verified all engine mechanics), but school district promotions remain strictly serialized.
