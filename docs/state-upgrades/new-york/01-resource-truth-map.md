# New York Resource Truth Map

Authoritative sourcing parameters and routing structures for New York.

## 1. Benefits / HHS Routing (Medicaid)
- **Source:** [NYS Local Departments of Social Services (LDSS) Directory](https://www.health.ny.gov/health_care/medicaid/ldss.htm)
- **Routing:** 57 counties route to their specific local DSS office. 5 boroughs of New York City (Bronx, Kings, New York, Queens, Richmond) route to the centralized Human Resources Administration (HRA).
- **Target Table:** `county_offices`

## 2. DD / IDD / OPWDD Routing
- **Source:** [OPWDD Front Door Regional Contacts](https://opwdd.ny.gov/get-started/front-door)
- **Routing:** Regional DDRO structure with 7 offices serving the 62 counties:
  1. Western NY DDRO (Region 1) -> 8 counties
  2. Finger Lakes DDRO (Region 1) -> 9 counties
  3. Central NY DDRO (Region 2) -> 20 counties
  4. Capital District DDRO (Region 3) -> 9 counties
  5. Hudson Valley DDRO (Region 3) -> 9 counties
  6. NYC DDRO (Region 4) -> 5 counties (Bronx, Kings, New York, Queens, Richmond)
  7. Long Island DDRO (Region 5) -> 2 counties (Nassau, Suffolk)
- **Target Table:** `state_resource_agencies` (with county mapping in `regional_center_counties`)

## 3. Early Intervention / Part C
- **Source:** [NYS Early Intervention Program County Contacts](https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm)
- **Routing:** County/municipal health departments for 57 counties, and 5 borough-specific offices under NYC Department of Health and Mental Hygiene (DOHMH).
- **Target Table:** `state_resource_agencies`

## 4. Education / Regional Structures (BOCES)
- **Source:** [NYSED BOCES Directory](http://www.p12.nysed.gov/restrport/boces/)
- **Routing:** 37 regional shared educational service boards (BOCES) serving school districts in all counties except the "Big Five" city school districts (NYC, Buffalo, Rochester, Yonkers, Syracuse).
- **Target Table:** `regional_education_agencies`

## 5. School Districts
- **Source:** NYSED directories and school district portals.
- **Routing:** 50 fallback school districts replaced with verified Special Education directors.
- **Target Table:** `school_districts`

## 6. Institutional Clinics
- **Source:** University-affiliated developmental/autism centers.
- **Target Table:** `resource_providers`

## 7. Forms, Appeals & Guides
- **Target Tables:**
  - `staging_scraped_forms` for PDF forms/applications.
  - `program_appeal_info` for appeals/fair hearings.
  - `program_waitlists` for waitlist data.
  - `programs` for program definitions.
