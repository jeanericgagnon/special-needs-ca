# Wave A Routing Model Audit

This document audits the local routing models utilized during the Wave A batch execution and details why 1:1 county mirroring is invalid for regional services.

---

## 1. Local Routing vs. Regional Catchments

In developmental services (DD) and early childhood intervention (EI), states rarely operate physical storefronts in every single county. Instead, they use regional catchment areas:

*   **Pennsylvania:** Uses **45 County MH/ID offices** to serve its 67 counties (several rural counties share combined administrative offices).
*   **Illinois:** Uses **17 Child & Family Connections (CFC) offices** to coordinate EI across 102 counties.
*   **Georgia:** Uses **6 DBHDD regional offices** to administer DD intake across 159 counties.
*   **North Carolina:** Uses **4 LME/MCO regional offices** to manage Medicaid waivers across 100 counties.

---

## 2. Mirroring Validation Failure

By duplicating a single regional office name and statewide hotline into every county 1:1, the batch process generated fake county-level expansion records:

*   **Addresses:** Mapped as ` Harrisburg, PA` or left empty.
*   **Phones:** Mapped as a single toll-free hotline.
*   **Catchment Representation:** Mapped as a local office rather than a regional office serving a catchment list.

### Correct Implementation Pattern:
To prevent mirroring, regional records must be seeded once as a single regional agency, and their county mappings must be explicitly declared in the database mapping tables (e.g. `regional_center_counties` or `selpa_counties`). Physical address fields must represent the true administrative office location, not a county seat placeholder.
