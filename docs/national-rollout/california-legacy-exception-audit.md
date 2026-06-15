# California Legacy Exception Audit

This document details the audit of California's legacy data, analyzing active fallback/mock records, public visibility, gating status, and allowlisting recommendations.

---

## Executive Summary

During the national integrity audit, California (our baseline control state) was found to contain **119 active fallback records** and **82 active mock contacts** (40 school districts, 42 nonprofits). 

Unlike other states that have been successfully scrubbed and downgraded during the repair sprint, California remains an exception. Because California is currently **ungated and public**, these mock contacts are visible to the public. 

To maintain transparency, California should be marked as **COMPLETE (with Legacy Exceptions)** and excluded from future "safe allowlisting" and search console index promotion until a dedicated cleanup pass resolves these legacy placeholders.

---

## Core Findings

### 1. Active Mock Records and Fallbacks
* **Total Legacy Fallbacks:** **119**
  - **School Districts:** 40
  - **Nonprofit Support Networks:** 42
  - **SELPA/Regional Education Boundaries:** 37
  - **County Offices:** 0
  - **State Agencies:** 0
* **Total Mock Phone Numbers:** **82**
  - **School Districts:** 40 mock numbers (e.g., Alpine County Unified School District has `(916) 555-8065`, Amador County has `(916) 555-3700`).
  - **Nonprofits:** 42 mock numbers (e.g., generic `555` numbers assigned to unverified local organizations).

### 2. Public Visibility and Gating Status
* **Is California publicly visible?** **YES.** 
* **Is California gated?** **NO.** California was launched as the primary baseline state, and its routes do not use the pilot/noindex gate applied to later states.
* **Are these mock numbers active in production?** **YES.** Anyone browsing California county pages (e.g., Alpine County, Amador County) will see these unverified contact phone numbers and placeholders.

### 3. Legacy Placeholder Analysis
These records were originally generated as baseline placeholders during the early scaffolding phase of the California directory. When the platform was built, they served as scaffolding data for testing frontend layouts and map boundaries. Because California was treated as the stable control baseline, these placeholders were never downgraded or cleaned.

---

## Policy and Allowlisting Recommendations

### Should California remain COMPLETE?
> [!WARNING]
> California **cannot** remain honestly classified as a clean `COMPLETE` state under our modern integrity rules. 
> - **New Status:** **COMPLETE (with Legacy Exceptions)**
> - This status explicitly indicates that while it has deep geographic routing and structural completeness, it contains legacy placeholder data.

### Allowlisting & Indexing Recommendation
> [!IMPORTANT]
> - California should be **excluded from any automated search engine allowlisting updates** until a dedicated California Scrub sprint is completed.
> - While already indexed, we should not promote any additional California county routes or submit updated California sitemaps to Google Search Console (GSC) until all mock contacts are replaced with official ISBE-style directory listings.

---

## Technical Remediation Plan

To clean up California and align it with the high standard established for Texas, Florida, and Pennsylvania:
1. **School District Scrub:** Clear all `555` numbers for the 40 school districts and point their websites to the official California Department of Education directory. Downgrade verification status to `manual_review_required`.
2. **Nonprofit Cleanup:** Archive or remove the 42 unverified mock nonprofits that do not have physical local contacts.
3. **SELPA/Education Agency Scrub:** Verify catchment area websites and replace any remaining placeholder URLs.
