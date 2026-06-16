# Doorway Page Risk Mitigation Plan

This document details our defensive engineering strategy to eliminate the risk of Google Doorway Page penalties and Helpful Content Update (HCU) filtering.

---

## 1. The Doorway Page Risk Defined

Google defines **doorway pages** as sites or pages created for the sole purpose of ranking for specific local search queries (e.g., "special needs resources in Loving County TX") to funnel users to a generic state-level landing page.

In our directory architecture, the risk manifests if:
- A county page contains **95%+ identical text** to other county pages in the same state.
- The page contains no actual local information, serving only as a list of links to statewide portals.
- The page renders empty sections or cards with missing contact numbers, offering zero value to a visiting parent.

---

## 2. Defensive Action Plan

To mitigate these risks, we have implemented and enforced the following architectural guards:

### 🛡️ Guard A: Dynamic Boilerplate Dilution
We keep the static boilerplate ratio below **65%** on all indexable county pages.
- **Dynamic Content Injection:** Each page loads localized hero introductions generated dynamically via `countySeoHelpers.ts`.
- **Intake Agency Naming:** The intro explicitly states the name of the regional early intervention contractor and the local LIDDA/ISC agency responsible for that county's waiver programs.
- **Boilerplate Variation:** We rotate intro paragraph templates dynamically using hash-based seeding from the county ID to prevent identical phrasing.

### 🛡️ Guard B: Empty-State Suppression
- **Zero Empty Elements:** We never render empty cards, headers, or buttons with missing phone/website strings.
- **DOM Trimming:** If a county lacks local providers or advocates, the entire component block is withheld from rendering, preventing the indexer from encountering "thin or empty" content blocks.
- **Helpful Fallbacks:** Instead of a generic "no records found" message, we show a highly localized, verified state hotline contact card explaining the exact regional catchment office routing.

### 🛡️ Guard C: Categorized Location Scopes
We tag all listed resources with explicit visibility badges:
1. **Local:** Physical office located inside the county.
2. **Regional:** Catchment agency serving multiple counties (with explicit details on which county is mapped).
3. **Statewide:** Central agency serving the entire state.

This signals to search engine crawlers that the page understands regional geography and is not falsely presenting a state agency as a local county office.

### 🛡️ Guard D: Strict Sitemap Gating
- We exclude all gated states from `sitemap.xml`. Only verified Batch 1 states (TX, FL, PA) are exposed.
- All gated states' routes return a `noindex` header and meta robots tag by default, containing the risk to a clean, high-value release cohort.
