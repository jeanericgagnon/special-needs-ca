# SEO Release Readiness System

This document outlines the core architecture, thresholds, and technical measures designed to protect the website from search engine indexing penalties, specifically Google's Helpful Content System (HCS) and Doorway Page filters.

---

## 1. Core SEO Audit Framework

Programmatic directory sites are highly vulnerable to search engine penalties if they generate thousands of near-identical local pages. This system enforces continuous auditing of six key SEO risk factors:

| Audit Dimension | Target Threshold | Mitigation Strategy |
| :--- | :---: | :--- |
| **Title/Meta/H1 Uniqueness** | **100.0%** | Programmatic page-level override using dynamic SEO helpers. |
| **Hero Intro Copy Uniqueness** | **100.0%** | State-specific and county-specific templates that dynamically mention early intervention catchment contractors, local LIDDAs/ISCs, and DSS offices. |
| **Boilerplate Layout Ratio** | **< 70.0%** | Restricting the amount of static layout wrapper text. Dynamically injecting localized cards rather than static instructions. |
| **Duplicate Card Blocks** | **No adjacent exact lists** | Ensuring lists of local resource providers and advocates are sorted dynamically or filter out duplicate statewide items on county-level pages. |
| **Generic State Links** | **0.0% generic homepages** | Replacing links like `https://hhs.texas.gov` with localized intake-specific subpages. |
| **Thin Rural County Pages** | **No blank or zero-card states** | Applying regional fallback routing cards that explain how service catchments cover rural areas. |

---

## 2. Doorway Page Risk Matrix

We calculate a Doorway Page Risk Score (DPRS) for each county route as follows:

\[\text{DPRS} = (0.4 \times \text{Boilerplate Ratio}) + (0.3 \times \text{Statewide Link Ratio}) + (0.3 \times \text{Duplicate List Overlap})\]

* **High Risk (DPRS > 75%):** Immediately blocked from search engine indexation (`noindex, nofollow` meta tags applied).
* **Medium Risk (50% - 75%):** Allowed in XML sitemaps only if the county meets the local verified HHS/DD routing coverage requirements.
* **Low Risk (DPRS < 50%):** Eligible for full public indexation and sitemap exclusion lists.

---

## 3. SEO Duplication Prevention Rules

1. **Title Overrides:** All county paths must render a title matching the schema:  
   `[County Name] County [Primary Program] & [Secondary Program] Special Needs Resources, [State Code] | Disability Navigator`
2. **Meta Description Overrides:** Meta descriptions must be localized:  
   `Find verified local developmental waitlist offices, Early Intervention providers, special education district contacts, and advocacy groups in [County Name] County, [State Code].`
3. **Canonical Tags:** Every county page must contain a self-referencing `<link rel="canonical" href="https://disabilitynavigator.org/counties/[state]/[slug]" />` tag to avoid protocol or query parameter duplication.
4. **Header Hierarchy:** Each page must have exactly one `<h1>` tag containing the localized county name, e.g., `<h1>Harris County Special Needs Resources</h1>`.

---

## 4. Next Implementation Actions
- Integrate doorway page audit checkers into the Playwright testing suite.
- Continuously monitor Google Search Console indexing patterns for Batch 1 states (TX, FL, PA).
- Exclude all gated states from public sitemaps until they meet the index eligibility thresholds.
