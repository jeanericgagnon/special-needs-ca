# Florida APD / iBudget DD Routing Model

Analysis of developmental disability catchment routing in Florida.

## 1. APD Administrative Structure
The Florida Agency for Persons with Disabilities (APD) oversees services for individuals with developmental disabilities. APD is organized into **6 regions** across the state, which contain a total of **14 field offices** serving all 67 counties:

*   **Northwest Region:**
    *   *Tallahassee Office (Field Office 2B):* Serves Franklin, Gadsden, Jefferson, Leon, Liberty, Wakulla. (4030 Esplanade Way, Suite 280, Tallahassee, FL 32399 | 850-487-1992)
    *   *Pensacola Office (Field Office 1):* Serves Escambia, Okaloosa, Santa Rosa, Walton. (160 West Government St, Suite 412, Pensacola, FL 32502 | 850-595-8351)
    *   *Panama City Office (Field Office 2A):* Serves Bay, Calhoun, Gulf, Holmes, Jackson, Washington. (3309 Frankford Ave, Suite C, Panama City, FL 32405 | 850-872-7652)
*   **Northeast Region:**
    *   *Gainesville Office (Field Office 3):* Serves Alachua, Bradford, Columbia, Dixie, Gilchrist, Hamilton, Lafayette, Levy, Madison, Putnam, Suwannee, Taylor, Union. (1621 NE Waldo Rd, Building 1, Gainesville, FL 32609 | 352-955-6061)
    *   *Jacksonville Office (Field Office 4):* Serves Baker, Clay, Duval, Nassau, St. Johns. (3631 Hodges Blvd, Jacksonville, FL 32224 | 904-992-2440)
    *   *Daytona Beach Office (Field Office 12):* Serves Flagler, Volusia. (210 N Palmetto Ave, Suite 312, Daytona Beach, FL 32114 | 386-238-4607)
*   **Central Region:**
    *   *Orlando Office (Field Office 7):* Serves Brevard, Orange, Osceola, Seminole. (400 W Robinson St, Suite S430, Orlando, FL 32801 | 407-245-0440)
    *   *Wildwood Office (Field Office 13):* Serves Citrus, Hernando, Lake, Marion, Sumter. (901 Industrial Drive, Suite 100, Wildwood, FL 34785 | 352-330-2749)
    *   *Lakeland Office (Field Office 14):* Serves Hardee, Highlands, Polk. (200 N Kentucky Ave, Suite 422, Lakeland, FL 33801 | 863-413-3360)
*   **Suncoast Region:**
    *   *Tampa Office (Field Office 23):* Serves DeSoto, Hillsborough, Manatee, Pasco, Pinellas, Sarasota. (1313 N Tampa St, Suite 515, Tampa, FL 33602 | 813-233-4300)
    *   *Fort Myers Office (Field Office 8):* Serves Charlotte, Collier, Glades, Hendry, Lee. (2295 Victoria Ave, Suite 221, Fort Myers, FL 33901 | 239-338-1370)
*   **Southeast Region:**
    *   *West Palm Beach Office (Field Office 9):* Serves Indian River, Martin, Okeechobee, Palm Beach, St. Lucie. (111 S Sapodilla Ave, Suite 204, West Palm Beach, FL 33401 | 561-837-5564)
    *   *Fort Lauderdale Office (Field Office 10):* Serves Broward. (3125 W Commercial Blvd, Suite 200, Fort Lauderdale, FL 33309 | 954-467-4218)
*   **Southern Region:**
    *   *Miami Office (Field Office 11):* Serves Miami-Dade, Monroe. (401 NW 2nd Ave, Suite South 811, Miami, FL 33128 | 305-349-1478)

## 2. iBudget Medicaid Waiver
The **iBudget Florida Waiver** is Florida’s Home and Community-Based Services (HCBS) Medicaid waiver program for individuals with developmental disabilities.
*   **Application / Intake Route:** Submit the APD Application for Services (Form 10-007) by mail or hand delivery to the APD regional/field office serving the applicant's physical county of residence. Online application is also available through the APD portal.
*   **Eligibility Criteria:** Must have a diagnosed developmental disability occurring before age 18 (e.g., intellectual disability, autism, cerebral palsy, spina bifida, Down syndrome, Prader-Willi syndrome, or Phelan-McDermid syndrome) and meet Medicaid financial eligibility.
*   **Waitlist Registry:** Individuals found eligible but not in crisis are placed on the APD Waiver Waitlist / Interest List (currently over 22,000 individuals).
*   **Crisis Enrollment:** Immediate enrollment is available if the individual meets crisis criteria (e.g., homeless, danger to self/others, caregiver unable to provide care). Crisis requests are submitted to the regional office.
*   **Appeals / Fair Hearing Route:** Appeals of eligibility denials or service reductions are handled via the Department of Children and Families Office of Appeal Hearings.
*   **Application Form:** APD Application for Services (Form 10-007, established under Rule 65G-4.016).

## 3. Other DD/IDD Resources
*   **Consumer-Directed Care Plus (CDC+):** An alternative to the iBudget waiver that allows participants to manage their own budget and hire their own providers/employees.
*   **Family Care Councils (FCC):** 15 local councils made up of volunteers (individuals with DD and family members) who educate and advocate for families in their regions.
*   **Supported Living & Employment Services:** Services funded by APD to assist individuals in living independently and securing competitive employment.

## 4. Target Database Mapping
To model Florida's DD routing correctly in the database:
1.  **state_resource_agencies:** Propose the 14 APD field/regional offices (agency_type: 'apd_office').
2.  **programs:** Propose 1 program for the 'fl-ibudget-waiver'.
3.  **program_waitlists:** Propose 1 waitlist for the 'fl-ibudget-waitlist'.
4.  **sources:** Propose official sources for the APD portal and iBudget waiver pages.
5.  **staging_scraped_forms:** Propose 1 form entry for Form 10-007.
6.  **regional_center_counties:** Map the 14 APD regional office IDs to all 67 counties in Florida.

## 5. Unresolved Questions
*   Should we integrate local Family Care Council contact information as separate nonprofits or subset resources of APD regional offices?
*   Should waitlist length metrics be updated dynamically via APD annual reports?
