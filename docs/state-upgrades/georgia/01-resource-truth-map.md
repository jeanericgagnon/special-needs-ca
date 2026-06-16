# Georgia Resource Truth Map

This document establishes the authoritative service routing and resource models for Georgia.

## 1. Category-Specific Routing Models

### A. Benefits / HHS Routing (Medicaid)
*   **Central Administration:** Georgia Department of Human Services (DHS) Division of Family and Children Services (DFCS).
*   **Intake Portals:** Online Gateway portal (`gateway.ga.gov`) and statewide toll-free customer service line `(877) 423-4746`.
*   **Office Structure:** Direct county offices exist in all 159 counties. Local physical addresses must be source-supported. Phone inquiries are routed centrally, so county-local records must NOT duplicate the statewide helpline. Local phone fields are set to `NULL` to prevent statewide hotline duplication.
*   **Priority Counties:** Fulton, Gwinnett, Cobb, DeKalb, Clayton, Cherokee, Forsyth, Chatham, Richmond, Muscogee, and Clarke have verified physical addresses in the database.

### B. DD / IDD Waiver Routing
*   **Central Administration:** Georgia Department of Behavioral Health and Developmental Disabilities (DBHDD).
*   **Routing Structure:** 6 Regional Field Offices manage intake, eligibility, and waitlist (planning list) placement for NOW (New Options Waiver) and COMP (Comprehensive) waivers. Services are regionalized, not county-localized.
*   **Mapping:** Regional field office records reside in the `state_resource_agencies` table and are linked to their catchment counties via `regional_center_counties` table:
    *   **Region 1 (Rome):** Serves 31 North Georgia counties.
    *   **Region 2 (Augusta):** Serves 33 East Central Georgia counties.
    *   **Region 3 (Atlanta):** Serves 6 Metro Atlanta counties (Fulton, Gwinnett, Cobb, DeKalb, Clayton, Newton, Rockdale).
    *   **Region 4 (Thomasville):** Serves 24 Southwest Georgia counties.
    *   **Region 5 (Savannah):** Serves 34 Southeast Georgia counties.
    *   **Region 6 (Columbus):** Serves 31 West Central Georgia counties.

### C. Early Intervention (Babies Can't Wait)
*   **Central Administration:** Georgia Department of Public Health (DPH).
*   **Routing Structure:** Organized into 18 Public Health Districts. Referrals are routed through the Children 1st coordinators at the district level.
*   **Statewide Coordination:** General intake and Part C referrals utilize the central statewide Babies Can't Wait line `(888) 651-8224` and website `https://dph.georgia.gov/babies-cant-wait`. To keep statewide lines statewide, we implement a single statewide Babies Can't Wait coordinator in `state_resource_agencies` mapped to all 159 counties.

### D. Education Regional Support (RESAs)
*   **Central Administration:** Georgia Department of Education (GaDOE).
*   **Routing Structure:** 16 Regional Education Service Agencies (RESAs) provide shared support and special education coordination. They are distinct from local school districts. Metro Atlanta is served by Metro RESA (`https://www.metroresa.org`).

### E. School District Special Education Contacts
*   **Source Hierarchy:** Authoritative local school district directories.
*   **Validation Rule:** Fallback districts with mock numbers `(800) 555-0199` and fictional websites are strictly disallowed. Unresolved districts must be downgraded to `manual_review_required` with `NULL` phone/email/website, leaving only the official GaDOE directory source link.

### F. Institutional Clinics
*   **Authority:** CHOA Marcus Autism Center (Atlanta), university LEND clinics, and public diagnostic centers.
*   **Vetting Rule:** Exclude private ABA therapy businesses, commercial directories, and legal advocate directories. Service areas must represent the true clinic limits.

### G. Trusted Nonprofits
*   **Authoritative Statewide Orgs:** Georgia Advocacy Office (GAO) and Parent to Parent of Georgia (P2P). Must be mapped statewide using their correct official central contacts.
*   **Local Chapters:** Local chapters of The Arc of Georgia (e.g., Arc of Southwest Georgia, Arc of Macon) should only be mapped to the specific counties they source-support. Fake local Arc records with mock contact numbers are deleted.
*   **Centers for Independent Living (CILs):** Mapped as source-supported local support (e.g., disABILITY LINK in Metro Atlanta, LIFE in Savannah, Walton Options in Augusta, Access 2 Independence in Columbus, Multiple Choices in Athens).
