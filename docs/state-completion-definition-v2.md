# State Completion Definition V2

This document defines what constitutes a "Complete" state in our national directory database.

---

## 1. Core Data Completeness Requirements

A state's data structure is defined as **Complete** if it satisfies the following baseline checks:

1. **County Ingestion Coverage:** 100% of the state's counties must be registered in the `counties` table with valid FIPS codes.
2. **Local Office Presence:** Every county must be mapped to at least 1 local Medicaid/HHS administrative office in the `county_offices` table.
3. **School District Presence:** 100% of the state's public school districts must be mapped to their respective counties in the `school_districts` table.
4. **Early Intervention Routing:** Every county must map to a regional Early Intervention catchment coordinator.
5. **Waitlist Information:** The state's primary HCBS waivers must have active rules and estimated wait times mapped in the `program_waitlists` table.

---

## 2. Completeness Classification Tiers

* **Tier 1 (Scaffold Complete):** Geographic records and statewide agency placeholders exist. Local contact phone lines are not verified (rate of manual review > 40%).
* **Tier 2 (Scraped / Pilot Ready):** Key population centers have direct, verified contact lines. Local offices have specific urls (rate of manual review < 40%).
* **Tier 3 (Exhaustive / Gold Standard):** 100% of counties have verified, direct local contacts. Manual review rate is under 5.0%.
