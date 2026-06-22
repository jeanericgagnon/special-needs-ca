# California Blocker Refinement Report v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- refined_families: district_or_county_education_routing, parent_training_information_center

## Evidence checks

- education: Reviewed the existing bounded California district packet after the statewide CDE SELPA directory root https://www.cde.ca.gov/sp/se/as/caselpas.asp returned a Radware bot challenge. Exact district/county leaves now verify across OUSD, Amador, and Berkeley: OUSD special-education, school-directory, and ECE contact pages; Amador SELPA, special-education, and district-office-directory pages; and Berkeley special-education, student-services, and directory pages. However, AlpineCOE, ButteCOE, CalaverasCOE, and ColusaCOE SELPA roots fail DNS on both www and bare-domain checks, and Fremont USD still fails SSL handshake in the current lane. Even with 9 reviewed exact leaves, county-grade district routing still cannot be proven statewide across all 58 California counties.
- pti: Reviewed 2026-06-22 live California DDS Family Resource Centers pages. The legacy Family Resource Centers Network URL https://www.dds.ca.gov/rc/frcn still returns 404, but the live statewide FRC page https://www.dds.ca.gov/services/early-start/family-resource-center/ now preserves the Family Resource Center Network of California mission to support families of children with disabilities and promote family-centered, parent-directed family resource centers, and the live directory https://www.dds.ca.gov/services/early-start/family-resource-center/regional-center-early-start-intake-and-family-resource-centers/ enumerates county-by-county California FRC routing. This now supplies an official statewide equivalent parent-center source on disk.
