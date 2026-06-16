# State Upgrade Folder File Templates

This document provides templates for the markdown files required in the state-upgrade directories.

---

## 1. 00-baseline.md Template

```markdown
# State Baseline: [State Name] ([State Code])

Overview of the state's geography, target population size, and project scope.

## 1. Geographic Definition
*   **Total Counties:** [Count of counties]
*   **Priority Metro Counties:**
    - [County Slug] (City)
*   **Non-Priority/Rural Counties:**
    - [County Slug]

## 2. Demographic Target
*   Estimated child disability population or waiver service counts from official census/agency statistics.

## 3. Scale Target
*   Launch target tier: [e.g., Exhaustive & Launchable or Pilot Launchable]
*   TargetCompleteness Score: [e.g., 90%+]
*   Verification threshold count: [e.g., 30+ unique providers, 3 per priority county]
```

---

## 2. 01-resource-truth-map.md Template

```markdown
# [State Name] Resource Truth Map

This document establishes the source of truth for [State Name] ([State Code]) disability and special needs resources across all categories.

## Category A: State Identity and Geography
1.  **Structure:** [e.g., County-level or Municipal-level]
2.  **Official Source URL:** [Link]
3.  **Target Table:** `counties`
4.  **Target fields:** [name, seat, FIPS, website]

## Category B: Medicaid / Benefits / HHS Local Offices
1.  **Structure:** [e.g., Local service centers, regional divisions]
2.  **Official Source URL:** [Link]
3.  **Target Table:** `county_offices`
4.  **Target fields:** [name, address, phone, fax, hours]

## Category C: DD/IDD / Local Catchment Routing
1.  **Structure:** [e.g., Regional centers, local authorities, Area Offices]
2.  **Official Source URL:** [Link]
3.  **Target Table:** `state_resource_agencies` (agency_type: catchment equivalent)

## Category D: HCBS Waivers / Interest Lists
1.  **Structure:** [e.g., Statewide waitlist, chronological assessment]
2.  **Official Source URL:** [Link]
3.  **Target Table:** `programs`, `program_waitlists`, `program_appeal_info`

## Category E: Early Intervention (Ages 0-3)
1.  **Structure:** [e.g., Local contracted centers, early intervention portals]
2.  **Official Source URL:** [Link]
3.  **Target Table:** `state_resource_agencies` (agency_type: `eci`)

## Category F: State Special Education Oversight
1.  **Structure:** [State Department of Education + Special Ed Support portal]
2.  **Official Source URL:** [Link]
3.  **Target Table:** `programs` / `nonprofit_organizations`

## Category G: Regional Education Support
1.  **Structure:** [e.g., Intermediate Units, BOCES, Education Service Centers, FDLRS Centers]
2.  **Official Source URL:** [Link]
3.  **Target Table:** `regional_education_agencies`

## Category H: School District Special Education
1.  **Structure:** [Local school districts and special education contacts]
2.  **Official Source URL:** [Link]
3.  **Target Table:** `school_districts`

## Category I: Forms and Appeals
1.  **Forms to Map:** [Medicaid app, waiver app, IEP request, records request, compliance complaints]
2.  **Target Table:** `program_appeal_info`, `program_document_requirements`

## Category J: Transition / VR / ABLE
1.  **Structure:** [Vocational Rehabilitation agency + State ABLE savings network]
2.  **Official Source URL:** [Link]
3.  **Target Table:** `state_resource_agencies`, `programs`

## Category K: Trusted Nonprofits
1.  **Statewide / Regional Chapters:** [PTI network, local Arc chapters, Disability Rights organization]
2.  **Official Source URL:** [Link]
3.  **Target Table:** `nonprofit_organizations`

## Category L: Hospital / University Clinics
1.  **Key Entities:** [Pediatric developmental centers, university clinics]
2.  **Official Source URL:** [Link]
3.  **Target Table:** `resource_providers`
4.  **Review Queue Boundary:** Private/commercial advocates, lawyers, and therapy clinics must be logged in `data/state-upgrades/[state]/provider_legal_review_queue.json` for manual verification.
```

---

## 3. 02-gap-analysis.md Template

```markdown
# [State Name] Gap Analysis

Audit of current database records against the Truth Map definitions.

## Category Audit Mappings

| Category | Real-world Target Count | Current DB Count | Fallbacks Count | Gap Classification | Action Required |
| :--- | :---: | :---: | :---: | :--- | :--- |
| Counties | | | | | |
| Local Offices | | | | | |
| Catchment Agencies | | | | | |
| Waivers/Waitlists | | | | | |
| Early Intervention | | | | | |
| Regional Education | | | | | |
| School Districts | | | | | |
| Nonprofits | | | | | |
| Providers/Advocates| | | | | |

## Summary of Critical Gaps
*   Identify categories with >50% fallback records.
*   Identify metro counties lacking the required number of providers.
```

---

## 4. 03-pull-plan.md Template

```markdown
# [State Name] Data Pull Plan

Action plan to gather data and replace fallback records.

## 1. Scraping Strategy
*   **Target 1:** [Scraper target name, e.g. APD website]
    *   Method: [HTTP client / Playwright / Manual curation]
    *   Junctions: [Counties mapping rule]
*   **Target 2:** ...

## 2. Extraction & Staging Fields
*   Define parsing regex, CSS selectors, or manual checklist headers.

## 3. Merging and Deduplication
*   Rules to match scraped listings with existing seeds.
```

---

## 5. rollback-plan.md Template

```markdown
# Rollback Plan: [State Name]

Procedures to revert database promotion if errors are encountered.

## Database Reversion
```sql
-- Revert promoted state resources
DELETE FROM state_resource_agencies WHERE state_id = '[state]';
DELETE FROM regional_center_counties WHERE county_id LIKE '%-[state_code]';
-- ...
```

## Sitemap Rollback
*   Steps to revert state configurations in `stateConfigs.ts`.
```
