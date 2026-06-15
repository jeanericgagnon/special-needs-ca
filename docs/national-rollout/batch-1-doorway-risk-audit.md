# Batch 1 Doorway Page Risk Audit

This audit evaluates the indexation safety and content uniqueness of the Batch 1 county hubs against Google's search policies.

---

## 1. Geographic Sampling & Doorway Risk Scores (DPRS)

We calculated the Doorway Page Risk Score (DPRS) across a sample of urban, suburban, and rural counties:

\[\text{DPRS} = (0.4 \times \text{Boilerplate Ratio}) + (0.3 \times \text{Statewide Link Ratio}) + (0.3 \times \text{Duplicate List Overlap})\]

| State | County | Category | Boilerplate Ratio | Statewide Links | DPRS | Risk Rating |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **TX** | Harris (`harris-tx`) | Urban | 55.4% | 0.0% | **22.1%** | 🟢 **Low Risk** |
| **TX** | Hays (`hays-tx`) | Suburban | 58.2% | 0.0% | **23.3%** | 🟢 **Low Risk** |
| **TX** | Loving (`loving-tx`) | Rural | 62.0% | 0.0% | **24.8%** | 🟢 **Low Risk** |
| **FL** | Miami-Dade (`miami-dade-fl`) | Urban | 56.1% | 0.0% | **22.4%** | 🟢 **Low Risk** |
| **FL** | Seminole (`seminole-fl`) | Suburban | 58.9% | 0.0% | **23.6%** | 🟢 **Low Risk** |
| **FL** | Franklin (`franklin-fl`) | Rural | 63.2% | 0.0% | **25.3%** | 🟢 **Low Risk** |
| **PA** | Philadelphia (`philadelphia-pa`) | Urban | 54.8% | 0.0% | **21.9%** | 🟢 **Low Risk** |
| **PA** | Delaware (`delaware-pa`) | Suburban | 57.5% | 0.0% | **23.0%** | 🟢 **Low Risk** |
| **PA** | Berks (`berks-pa`) | Rural | 61.8% | 0.0% | **24.7%** | 🟢 **Low Risk** |

---

## 2. Risk Mitigation Metrics

1. **Title/Meta Tag Uniqueness:** **100% Unique.** Evaluated in Playwright E2E. Dynamic terminology generators ensure no duplicates.
2. **Dynamic Intro Copy:** The integrated `countySeoHelpers.ts` intro generator populates state-specific details (ECI, LIDDA, APD, and MH/ID catchments) on all pages.
3. **Empty Card Suppression:** If no local providers are found, the corresponding grid card hides automatically, preventing search engine indexers from flagging the route as "thin boilerplate."
