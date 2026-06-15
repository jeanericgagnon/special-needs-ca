# National Manual Review Operating System (V4)

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Total Backlog:** **6,536 records**  

---

## 1. Backlog & Priority Overview

Our data audit shows a total national backlog of **6,536 records** requiring manual verification to replace generated county scaffolds with real source-supported contact details.

| Curation Queue | Table Name | Verification Backlog | Priority | Curation Target |
| :--- | :--- | :---: | :---: | :--- |
| **School Districts SPED** | `school_districts` | **1,936** | High | Replace fallback district contacts with official SPED directors. |
| **HHS/Medicaid storefronts** | `county_offices` | **1,751** | High | Verify direct phone lines and intake offices. |
| **Nonprofit Service-Area** | `nonprofit_organizations` | **2,036** | High | Seed and verify local nonprofit boundaries. |
| **Special Education Advocates** | `iep_advocates` | **610** | Medium | Verify names, phones, and email listings. |
| **State Resource Agencies** | `state_resource_agencies` | **80** | Medium | Verify regional DBHDD, APD, and EI regional offices. |
| **Regional Education Agencies** | `regional_education_agencies` | **66** | Medium | Verify ESC, BOCES, and RESA contacts. |
| **Forms & Guides** | `forms_and_guides` | **42** | Low | Verify form instructions and direct PDF URLs. |
| **Programs** | `programs` | **15** | Low | Verify program description and official eligibility pages. |

---

## 2. Structured Curation Queues

To resolve the backlog safely, the curation work is divided into 9 operational queues:

1. **HHS/DSS Office Queue:** Resolves direct phone and intake details for the 2,350 unverified storefronts.
2. **School District SPED Queue:** Resolves the 2,524 unverified districts.
3. **DD/IDD Routing Queue:** Maps regional catchments and county-to-agency junctions (e.g. Texas LIDDAs, California regional centers).
4. **EI Routing Queue:** Maps Part C Early Intervention intake offices and local service area coordinators.
5. **Nonprofit Service-Area Queue:** Seeding and service-area boundary verification for trusted PTI, Protection & Advocacy, and Arc local chapters.
6. **Clinic Verification Queue:** Verifies physical locations and diagnostic focus areas of Children's Hospital developmental clinics.
7. **Forms PDF/Call-Script Queue:** Audits the 67 promoted forms, direct PDF URLs, and cover letter scripts.
8. **Provider/Legal Credential Queue:** Validates licensing credentials and filters out private commercial directories.
9. **Stale Source Refresh Queue:** Regularly checks and updates official URLs and domains.

---

## 3. VA Standard Operating Procedures (SOPs)

Standardized SOPs have been established to guide human curation:
- **County Offices Curation:** [`va-sop-county-offices.md`](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/national-rollout/va-sop-county-offices.md)
- **School Districts Curation:** [`va-sop-school-districts.md`](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/national-rollout/va-sop-school-districts.md)
- **Nonprofit Seeding Curation:** [`va-sop-nonprofits.md`](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/national-rollout/va-sop-nonprofits.md)
- **Forms & Guides Curation:** [`va-sop-forms.md`](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/national-rollout/va-sop-forms.md)
