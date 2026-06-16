# Florida FDLRS / ESE Regional Education

Analysis of regional education and special education routing in Florida.

## 1. FDLRS Associate Centers
The Florida Diagnostic and Learning Resources System (FDLRS) Associate Centers provide Child Find diagnostic screening, ESE support, and training. There are 19 Associate Centers serving all 67 counties:

1.  **FDLRS Action**: Lake, Orange, Osceola, Seminole, Sumter
2.  **FDLRS Alpha**: Palm Beach
3.  **FDLRS Reach**: Broward
4.  **FDLRS Crown**: Clay, Duval, Nassau
5.  **FDLRS East**: Brevard, Volusia
6.  **FDLRS Emerald Coast**: Escambia, Okaloosa, Santa Rosa
7.  **FDLRS Galaxy**: Indian River, Martin, Okeechobee, St. Lucie
8.  **FDLRS Gateway**: Columbia, Hamilton, Lafayette, Madison, Suwannee
9.  **FDLRS Gulfcoast**: Hernando, Pasco, Pinellas
10. **FDLRS Heartland**: DeSoto, Glades, Hendry, Highlands
11. **FDLRS Hillsborough**: Hillsborough
12. **FDLRS Island Coast**: Collier, Lee
13. **FDLRS Miccosukee**: Gadsden, Jefferson, Leon, Taylor, Wakulla
14. **FDLRS NEFEC**: Baker, Bradford, Flagler, Putnam, St. Johns, Union
15. **FDLRS PAEC**: Bay, Calhoun, Franklin, Gulf, Holmes, Jackson, Liberty, Walton, Washington
16. **FDLRS South**: Miami-Dade, Monroe
17. **FDLRS Springs**: Alachua, Citrus, Dixie, Gilchrist, Levy, Marion
18. **FDLRS Suncoast**: Charlotte, Manatee, Sarasota
19. **FDLRS Sunrise**: Hardee, Polk

## 2. ESE School Districts
Florida operates 67 county-wide school districts. 14 of these are priority verified districts, while the remaining 53 are fallback placeholders.

### Verified School Districts (14)
*   Alachua, Brevard, Broward, Duval, Hillsborough, Lee, Leon, Miami-Dade, Orange, Palm Beach, Pasco, Pinellas, Polk, Seminole.

### Fallback School Districts (53)
*   All other 53 counties are mapped to fallback placeholders requiring official FLDOE directory details before promotion.


## 3. Staging Verification (2026-06-13)
*   Staged 19 regional FDLRS centers serving all 67 counties.
*   Staged 14 priority ESE districts.
*   Retained 53 fallback districts in backup backlog queue only.


## 4. Promotion Results (2026-06-13)
*   19 FDLRS Associate Centers live in production (`regional_education_agencies`).
*   67/67 counties mapped to FDLRS centers (`regional_center_counties`).
*   14 priority ESE districts upgraded to `source_listed` in production.
*   53 fallback ESE districts retained as backlog — no deletion.
