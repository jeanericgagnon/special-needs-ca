# Data Provenance Report: Texas (TX)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Texas under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `READY_FOR_ALLOWLIST`
- **Canonical Release Gate Score**: **100.00%**
- **Live Raw Database Depth Score**: **100.0%** (Manual Review Rate: **0.0%**)
- **Sitemap Indexing Posture**: `Exposed`
- **Search Engine Gating Policy**: `Eligible` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (248):** Anderson County, Andrews County, Angelina County, Aransas County, Archer County, Armstrong County, Atascosa County, Austin County, Bailey County, Bandera County, Bastrop County, Baylor County, Bee County, Bell County, Bexar County, Blanco County, Borden County, Bosque County, Bowie County, Brazoria County, Brewster County, Briscoe County, Brooks County, Brown County, Burleson County, Burnet County, Caldwell County, Calhoun County, Callahan County, Cameron County, Camp County, Carson County, Cass County, Castro County, Chambers County, Cherokee County, Childress County, Clay County, Cochran County, Coke County, Coleman County, Collin County, Collingsworth County, Colorado County, Comal County, Comanche County, Concho County, Cooke County, Coryell County, Cottle County, Crane County, Crockett County, Crosby County, Culberson County, Dallam County, Dallas County, Dawson County, DeWitt County, Deaf Smith County, Delta County, Denton County, Dickens County, Dimmit County, Donley County, Duval County, Eastland County, Ector County, Edwards County, El Paso County, Ellis County, Erath County, Falls County, Fannin County, Fayette County, Fisher County, Floyd County, Foard County, Fort Bend County, Franklin County, Freestone County, Frio County, Gaines County, Galveston County, Garza County, Gillespie County, Glasscock County, Goliad County, Gonzales County, Gray County, Grayson County, Gregg County, Grimes County, Guadalupe County, Hale County, Hall County, Hamilton County, Hansford County, Hardeman County, Hardin County, Harris County, Harrison County, Hartley County, Haskell County, Hays County, Hemphill County, Henderson County, Hidalgo County, Hill County, Hockley County, Hood County, Hopkins County, Houston County, Howard County, Hudspeth County, Hunt County, Hutchinson County, Irion County, Jack County, Jackson County, Jasper County, Jeff Davis County, Jefferson County, Jim Hogg County, Jim Wells County, Johnson County, Jones County, Karnes County, Kaufman County, Kendall County, Kenedy County, Kent County, Kerr County, Kimble County, King County, Kinney County, Kleberg County, Knox County, La Salle County, Lamar County, Lamb County, Lampasas County, Lee County, Leon County, Liberty County, Limestone County, Lipscomb County, Live Oak County, Llano County, Loving County, Lubbock County, Lynn County, Madison County, Marion County, Martin County, Mason County, Matagorda County, Maverick County, McCulloch County, McMullen County, Medina County, Menard County, Midland County, Milam County, Mills County, Mitchell County, Montague County, Montgomery County, Moore County, Morris County, Motley County, Nacogdoches County, Navarro County, Newton County, Nolan County, Nueces County, Ochiltree County, Oldham County, Orange County, Palo Pinto County, Panola County, Parker County, Parmer County, Pecos County, Polk County, Potter County, Presidio County, Rains County, Randall County, Reagan County, Real County, Red River County, Reeves County, Refugio County, Roberts County, Robertson County, Rockwall County, Runnels County, Rusk County, Sabine County, San Augustine County, San Jacinto County, San Patricio County, San Saba County, Schleicher County, Scurry County, Shackelford County, Shelby County, Sherman County, Smith County, Somervell County, Starr County, Stephens County, Sterling County, Stonewall County, Sutton County, Swisher County, Tarrant County, Taylor County, Terrell County, Terry County, Throckmorton County, Titus County, Tom Green County, Travis County, Trinity County, Upshur County, Upton County, Uvalde County, Val Verde County, Van Zandt County, Walker County, Waller County, Ward County, Washington County, Webb County, Wharton County, Wheeler County, Wilbarger County, Willacy County, Williamson County, Wilson County, Winkler County, Wise County, Wood County, Yoakum County, Young County, Zapata County, Zavala County

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `LIDDA`
- **Medicaid Program Name**: `Texas Medicaid`
- **Waiver Program Name**: `HCS Waiver`
- **Personal Care Program**: `Medically Dependent Children\`
- **Developmental Disability (DD) Agency**: `Texas HHS / IDD services`
- **State Education Agency**: `Texas Education Agency`
- **State Education Agency SPED Label**: `Regional Education Service Centers`
- **State Early Intervention Label**: `Texas Early Childhood Intervention (ECI) (Ages 0-3)`
- **ABLE Savings Program**: `Texas ABLE`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 254
- **County Social Service Storefronts**: 254
- **School Districts**: 264
- **Regional Education Agencies (REAs)**: 20
- **State-Level Resource Agencies**: 78
- **Local Nonprofit Support Organizations**: 2129
- **Special Education (IEP) Advocates/Attorneys**: 19
- **Medicaid Waitlist Profiles**: 6
- **Waiver Denial Appeal Guides**: 6

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 1888 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 2121 records
- **Manual Review Backlog (Flagged)**: 0 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 0 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...
- **Texas ABLE Program** (State Program): Source URL: https://www.texasable.org
  * Description: Tax-advantaged savings program for Texans with disabilities, allowing them to save for qualified disability expenses wit...
- **Texas Community Living Assistance and Support Services (CLASS) Waiver** (State Program): Source URL: https://www.hhs.texas.gov/providers/long-term-care-providers/community-living-assistance-support-services-class
  * Description: Provides home and community-based services to people with related conditions as an alternative to an intermediate care f...
- **Texas Deaf-Blind with Multiple Disabilities (DBMD) Waiver** (State Program): Source URL: https://www.hhs.texas.gov/providers/long-term-care-providers/deaf-blind-multiple-disabilities-dbmd
  * Description: Provides home and community-based services for people who are deaf-blind and have another disability.
- **Texas Early Childhood Intervention (ECI)** (State Program): Source URL: https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services
  * Description: Statewide program for families with children, birth up to age 3, with developmental delays, disabilities, or certain med...
- **Texas Education Agency Special Education Services** (State Program): Source URL: https://tea.texas.gov/academics/special-student-populations/special-education
  * Description: Specially designed instruction and related services provided to eligible students with disabilities under the Individual...
- **Texas Home Living (TxHmL) Waiver** (State Program): Source URL: https://www.hhs.texas.gov/providers/individual-family-support/texas-home-living-txhml
  * Description: Provides essential services and supports to people with an intellectual disability or a related condition who live in th...
- **Texas Home and Community-Based Services (HCS) Waiver** (State Program): Source URL: https://www.hhs.texas.gov/providers/individual-family-support/home-community-based-services-hcs
  * Description: Provides services and supports to people with an intellectual disability or a related condition who live with their fami...
- **Texas Medicaid & CHIP** (State Program): Source URL: https://www.hhs.texas.gov/services/health
  * Description: Medicaid and CHIP provide healthcare coverage, therapies, and equipment for low-income families and children with disabi...
- **Texas Medically Dependent Children Program (MDCP)** (State Program): Source URL: https://www.hhs.texas.gov/providers/individual-family-support/medically-dependent-children-program-mdcp
  * Description: Provides services to support families caring for children and young adults who are medically fragile as an alternative t...
- **Texas STAR+PLUS HCBS Waiver** (State Program): Source URL: https://www.hhs.texas.gov/providers/health-services-providers/starplus
  * Description: STAR+PLUS HCBS provides long-term service and support in a home or community setting for adults with disabilities.
- **Texas Workforce Commission Vocational Rehabilitation (VR)** (State Program): Source URL: https://www.twc.texas.gov/services/vocational-rehabilitation
  * Description: Helps individuals with disabilities prepare for, find, or retain employment.
- **Texas Youth Empowerment Services (YES) Waiver** (State Program): Source URL: https://www.hhs.texas.gov/providers/individual-family-support/youth-empowerment-services-yes
  * Description: YES waiver provides community-based services for children with serious emotional disturbances.


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **ACCESS (Anderson-Cherokee Community Enrichment Services)** (lidda): Website: https://www.access-center.org/ | Phone: (903) 589-9000 | Status: `None`
- **Andrews Center** (lidda): Website: https://www.andrewscenter.com | Phone: (903) 597-1351 | Status: `None`
- **Any Baby Can** (eci): Website: http://anybabycan.org/services/early-childhood-intervention | Phone: (512) 454-3743 | Status: `source_listed`
- **BACH** (eci): Website: http://bachkids.org/eci-program-overview | Phone: (979) 849-2447 | Status: `source_listed`
- **Bay Area Rehabilitation Center** (eci): Website: http://bayarearehab.org/early-childhood-intervention | Phone: (281) 838-4477 | Status: `source_listed`
- **Betty Hardwick Center** (lidda): Website: https://bettyhardwick.org | Phone: (325) 690-5100 | Status: `None`
- **Betty Hardwick Center** (eci): Website: http://bettyhardwick.org/services/eci | Phone: (325) 627-0908 | Status: `source_listed`
- **Bluebonnet Trails Community Services** (lidda): Website: https://bbtrails.org | Phone: (844) 309-6385 | Status: `None`
- **Bluebonnet Trails Community Services** (eci): Website: http://bbtrails.org/early-childhood-intervention-eci-services | Phone: (844) 309-6385 | Status: `source_listed`
- **Border Region Behavioral Health Center** (lidda): Website: https://www.borderregion.org | Phone: (956) 794-3000 | Status: `None`
- **Brighton Center** (eci): Website: http://brightonsa.org/pediatric-therapy-services-0-3 | Phone: (210) 826-4492 | Status: `source_listed`
- **Burke Center** (lidda): Website: https://myburke.org | Phone: (936) 639-1141 | Status: `None`
- **Burke Center** (eci): Website: http://myburke.org/services/eci | Phone: (936) 634-4703 | Status: `source_listed`
- **Camino Real Community Services** (lidda): Website: https://www.caminorealcs.org | Phone: (210) 357-0300 | Status: `None`
- **Camino Real Community Services** (eci): Website: http://caminorealcs.org/eci-services | Phone: (210) 357-0300 | Status: `source_listed`
- **Center for Health Care Services** (eci): Website: http://chcs-eci.org | Phone: (210) 261-3300 | Status: `source_listed`
- **Center for Life Resources** (lidda): Website: https://cflr.us | Phone: (325) 646-9574 | Status: `None`
- **Center for Life Resources** (eci): Website: http://cflr.us/ns/2019/08/08/early-childhood-intervention-eci | Phone: (325) 643-1721 | Status: `source_listed`
- **Central Counties Services** (lidda): Website: https://centralcountiesservices.org | Phone: (254) 298-7000 | Status: `None`
- **Central Counties Services** (eci): Website: http://childteam.org | Phone: (254) 773-6787 | Status: `source_listed`
- **Central Plains Center** (lidda): Website: https://centralplains.org/ | Phone: (806) 293-2636 | Status: `None`
- **Central Plains Center** (eci): Website: http://centralplains.org/eci | Phone: (806) 291-4416 | Status: `source_listed`
- **Coastal Plains Community Center** (lidda): Website: https://www.coastalplainsctr.org | Phone: (361) 777-3991 | Status: `None`
- **Community Action Corporation of South Texas** (eci): Website: http://cacost.org/programs/early-childhood-intervention | Phone: (361) 265-4502 | Status: `source_listed`
- **Community Healthcore** (lidda): Website: https://communityhealthcore.com | Phone: (903) 758-2471 | Status: `None`
- **Community Healthcore** (eci): Website: http://communityhealthcore.com/services/early-childhood-intervention-eci | Phone: (903) 757-8194 | Status: `source_listed`
- **Denton County MHMR Center** (lidda): Website: https://www.dentonmhmr.org | Phone: (940) 381-5000 | Status: `None`
- **Easterseals Greater Houston** (eci): Website: http://eastersealshouston.org/eci-infant-development-program | Phone: (713) 838-9050 | Status: `source_listed`
- **Easterseals Lonestar Central Texas** (eci): Website: http://eslonestar.org/educational-development-programs | Phone: (512) 615-6898 | Status: `source_listed`
- **Easterseals Rehabilitation Center** (eci): Website: http://sanantonio.easterseals.com/about-us/locations-programs | Phone: (210) 614-3911 | Status: `source_listed`
- **Easterseals Rio Grande Valley** (eci): Website: http://tinyurl.com/EastersealsRGVECI | Phone: (956) 631-9171 | Status: `source_listed`
- **Emergence Health Network** (lidda): Website: https://emergencehealthnetwork.org | Phone: (915) 887-3410 | Status: `None`
- **Gulf Bend Center** (lidda): Website: https://www.gulfbend.org | Phone: (361) 575-0611 | Status: `None`
- **Gulf Coast Center** (lidda): Website: https://gulfcoastcenter.org | Phone: (409) 763-2373 | Status: `None`
- **Heart of Texas Behavioral Health Network** (eci): Website: http://hotbhn.org/services/early-childhood-intervention | Phone: (254) 297-7089 | Status: `source_listed`
- **Heart of Texas Region MHMR Center** (lidda): Website: https://hotbhn.org | Phone: (254) 752-3451 | Status: `None`
- **Helen Farabee Centers** (lidda): Website: https://www.helenfarabee.org | Phone: (940) 397-3100 | Status: `None`
- **Helen Farabee Centers** (eci): Website: http://helenfarabee.org/eci-program | Phone: (940) 696-6200 | Status: `source_listed`
- **Hill Country Mental Health and Developmental Disabilities Centers** (lidda): Website: https://www.hillcountry.org | Phone: (830) 792-3300 | Status: `None`
- **Integral Care (Travis County LIDDA)** (lidda): Website: https://integralcare.org | Phone: (512) 472-4357 | Status: `None`
- **Katy Independent School District** (eci): Website: http://katyisd.org/eci-project-tyke | Phone: (281) 237-6647 | Status: `source_listed`
- **Lakes Regional Community Center** (eci): Website: http://lakesregional.org/early-childhood-intervention | Phone: (903) 454-0300 | Status: `source_listed`
- **Lakes Regional MHMR Center** (lidda): Website: https://www.lakesregional.org | Phone: (972) 388-2000 | Status: `None`
- **LifePath Systems** (lidda): Website: https://www.lifepathsystems.org | Phone: (972) 562-0190 | Status: `None`
- **LifePath Systems** (eci): Website: http://lifepathsystems.org/get-help/child-family-services/early-childhood-intervention | Phone: (972) 562-0331 | Status: `source_listed`
- **Lubbock Independent School District** (eci): Website: http://lubbockisd.org/o/lisd/page/early-childhood-intervention-eci | Phone: (806) 219-0500 | Status: `source_listed`
- **MHMR Authority of Brazos Valley** (lidda): Website: https://www.mhmrabv.org | Phone: (979) 822-7326 | Status: `None`
- **MHMR Services for the Concho Valley** (lidda): Website: https://www.mhmrcv.org | Phone: (325) 658-7750 | Status: `None`
- **MHMR of Tarrant County** (lidda): Website: https://www.mhmrtarrant.org | Phone: (817) 569-4000 | Status: `None`
- **MHMR of Tarrant County** (eci): Website: http://mhmrtarrant.org/ECI | Phone: (817) 335-3022 | Status: `source_listed`
- **Metrocare Services** (lidda): Website: https://www.metrocareservices.org | Phone: (214) 743-1200 | Status: `None`
- **Metrocare Services** (eci): Website: http://metrocareservices.org/idd-services/early-childhood-intervention | Phone: (214) 331-0109 | Status: `source_listed`
- **Nueces Center for Mental Health and Intellectual Disability** (lidda): Website: https://www.ncmhid.org | Phone: (361) 886-6970 | Status: `None`
- **PdN Children&#39;s** (eci): Website: http://pdnchildrens.org/programs/early-childhood-intervention-eci | Phone: (915) 534-4324 | Status: `source_listed`
- **Pecan Valley Centers for Behavioral & Developmental HealthCare** (lidda): Website: https://www.pecanvalley.org | Phone: (817) 579-4400 | Status: `None`
- **PermiaCare** (lidda): Website: https://www.permiacare.org | Phone: (432) 570-3300 | Status: `None`
- **PermiaCare** (eci): Website: http://permiacare.org/early-childhood-intervention | Phone: (432) 570-3366 | Status: `source_listed`
- **Region 15 Education Service Center** (eci): Website: http://esc15.net/parents/early-childhood-intervention | Phone: (325) 658-6571 | Status: `source_listed`
- **Region 16 Education Service Center** (eci): Website: http://esc16.net | Phone: (806) 677-5228 | Status: `source_listed`
- **Region 19 Education Service Center** (eci): Website: http://esc19.net/programs/early-childhood-intervention-eci | Phone: (915) 534-4324 | Status: `source_listed`
- **Region 3 Education Service Center** (eci): Website: http://esc3.net/welcome | Phone: (888) 909-3512 | Status: `source_listed`
- **Region One Education Service Center** (eci): Website: http://esc1.net/services/family/early-childhood-intervention | Phone: (956) 984-6131 | Status: `source_listed`
- **Spindletop Center** (lidda): Website: https://www.spindletopcenter.org | Phone: (409) 839-1000 | Status: `None`
- **Spindletop Center** (eci): Website: http://spindletopcenter.org/early-childhood-intervention | Phone: (888) 837-8687 | Status: `source_listed`
- **StarCare Specialty Health System** (lidda): Website: https://www.starcarelubbock.org | Phone: (806) 740-1400 | Status: `None`
- **Texana Center** (lidda): Website: https://www.texanacenter.com | Phone: (281) 239-1300 | Status: `None`
- **Texana Center** (eci): Website: http://texanacenter.com/services/child-and-family-services/early-childhood-intervention | Phone: (281) 238-1800 | Status: `source_listed`
- **Texas Panhandle Centers** (lidda): Website: https://www.texaspanhandlecenters.org | Phone: (806) 376-4431 | Status: `None`
- **Texas Panhandle Centers** (eci): Website: http://texaspanhandlecenters.org/early-childhood-intervention | Phone: (806) 358-8974 | Status: `source_listed`
- **Texoma Community Center** (lidda): Website: https://www.texomacc.org/ | Phone: (903) 957-4700 | Status: `None`
- **The Center for Health Care Services** (lidda): Website: https://chcsbc.org | Phone: (210) 261-1200 | Status: `None`
- **The Harris Center** (eci): Website: http://theharriscenter.org/eci | Phone: (713) 970-4800 | Status: `source_listed`
- **The Harris Center for Mental Health and IDD** (lidda): Website: https://www.theharriscenter.org | Phone: (713) 970-7000 | Status: `None`
- **Tri-County Services** (lidda): Website: https://tcbhc.org | Phone: (936) 521-6100 | Status: `None`
- **Tropical Texas Behavioral Health** (lidda): Website: https://www.ttbh.org | Phone: (956) 289-7000 | Status: `None`
- **Warren Center** (eci): Website: http://thewarrencenter.org/our-services/early-childhood-intervention | Phone: (972) 490-9055 | Status: `source_listed`
- **West Texas Centers** (lidda): Website: https://wtcmhmr.org/ | Phone: (432) 263-0007 | Status: `None`
- **West Texas Centers** (eci): Website: http://wtcmhmr.org/our-services/#little-lives | Phone: (800) 852-2193 | Status: `source_listed`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Anderson County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Andrews County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Angelina County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Aransas County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Archer County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Armstrong County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Atascosa County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Austin County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Bailey County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Bandera County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Bastrop County | 1 | 1 | 10 | 3 | 🟢 COMPLETE |
| Baylor County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Bee County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Bell County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Bexar County | 1 | 2 | 10 | 7 | 🟢 COMPLETE |
| Blanco County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Borden County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Bosque County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Bowie County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Brazoria County | 1 | 2 | 11 | 4 | 🟢 COMPLETE |
| Brazos County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Brewster County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Briscoe County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Brooks County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Brown County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Burleson County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Burnet County | 1 | 1 | 10 | 3 | 🟢 COMPLETE |
| Caldwell County | 1 | 1 | 10 | 3 | 🟢 COMPLETE |
| Calhoun County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Callahan County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Cameron County | 1 | 1 | 10 | 4 | 🟢 COMPLETE |
| Camp County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Carson County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Cass County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Castro County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Chambers County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Cherokee County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Childress County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Clay County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Cochran County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Coke County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Coleman County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Collin County | 1 | 2 | 10 | 6 | 🟢 COMPLETE |
| Collingsworth County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Colorado County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Comal County | 1 | 1 | 10 | 4 | 🟢 COMPLETE |
| Comanche County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Concho County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Cooke County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Coryell County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Cottle County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Crane County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Crockett County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Crosby County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Culberson County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Dallam County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Dallas County | 1 | 1 | 12 | 6 | 🟢 COMPLETE |
| Dawson County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| DeWitt County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Deaf Smith County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Delta County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Denton County | 1 | 1 | 10 | 6 | 🟢 COMPLETE |
| Dickens County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Dimmit County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Donley County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Duval County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Eastland County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Ector County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Edwards County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| El Paso County | 1 | 1 | 10 | 5 | 🟢 COMPLETE |
| Ellis County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Erath County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Falls County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Fannin County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Fayette County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Fisher County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Floyd County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Foard County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Fort Bend County | 1 | 2 | 11 | 6 | 🟢 COMPLETE |
| Franklin County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Freestone County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Frio County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Gaines County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Galveston County | 1 | 2 | 12 | 4 | 🟢 COMPLETE |
| Garza County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Gillespie County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Glasscock County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Goliad County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Gonzales County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Gray County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Grayson County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Gregg County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Grimes County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Guadalupe County | 1 | 1 | 10 | 4 | 🟢 COMPLETE |
| Hale County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hall County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hamilton County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hansford County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hardeman County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hardin County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Harris County | 1 | 2 | 11 | 6 | 🟢 COMPLETE |
| Harrison County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hartley County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Haskell County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hays County | 1 | 1 | 11 | 5 | 🟢 COMPLETE |
| Hemphill County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Henderson County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hidalgo County | 1 | 2 | 11 | 8 | 🟢 COMPLETE |
| Hill County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hockley County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hood County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Hopkins County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Houston County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Howard County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hudspeth County | 1 | 1 | 8 | 4 | 🟢 COMPLETE |
| Hunt County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Hutchinson County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Irion County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Jack County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Jackson County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Jasper County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Jeff Davis County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Jefferson County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Jim Hogg County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Jim Wells County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Johnson County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Jones County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Karnes County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Kaufman County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Kendall County | 1 | 1 | 10 | 3 | 🟢 COMPLETE |
| Kenedy County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Kent County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Kerr County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Kimble County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| King County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Kinney County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Kleberg County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Knox County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| La Salle County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Lamar County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Lamb County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Lampasas County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Lavaca County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Lee County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Leon County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Liberty County | 1 | 1 | 10 | 3 | 🟢 COMPLETE |
| Limestone County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Lipscomb County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Live Oak County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Llano County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Loving County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Lubbock County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Lynn County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Madison County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Marion County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Martin County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Mason County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Matagorda County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Maverick County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| McCulloch County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| McLennan County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| McMullen County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Medina County | 1 | 1 | 10 | 3 | 🟢 COMPLETE |
| Menard County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Midland County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Milam County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Mills County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Mitchell County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Montague County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Montgomery County | 1 | 1 | 11 | 6 | 🟢 COMPLETE |
| Moore County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Morris County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Motley County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Nacogdoches County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Navarro County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Newton County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Nolan County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Nueces County | 1 | 1 | 9 | 6 | 🟢 COMPLETE |
| Ochiltree County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Oldham County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Orange County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Palo Pinto County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Panola County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Parker County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Parmer County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Pecos County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Polk County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Potter County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Presidio County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Rains County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Randall County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Reagan County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Real County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Red River County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Reeves County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Refugio County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Roberts County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Robertson County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Rockwall County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Runnels County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Rusk County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Sabine County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| San Augustine County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| San Jacinto County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| San Patricio County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| San Saba County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Schleicher County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Scurry County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Shackelford County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Shelby County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Sherman County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Smith County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Somervell County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Starr County | 1 | 1 | 10 | 4 | 🟢 COMPLETE |
| Stephens County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Sterling County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Stonewall County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Sutton County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Swisher County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Tarrant County | 1 | 2 | 11 | 6 | 🟢 COMPLETE |
| Taylor County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Terrell County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Terry County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Throckmorton County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Titus County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Tom Green County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Travis County | 1 | 2 | 11 | 7 | 🟢 COMPLETE |
| Trinity County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Tyler County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Upshur County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Upton County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Uvalde County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Val Verde County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Van Zandt County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Victoria County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Walker County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Waller County | 1 | 1 | 10 | 3 | 🟢 COMPLETE |
| Ward County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Washington County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Webb County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Wharton County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Wheeler County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Wichita County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Wilbarger County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Willacy County | 1 | 1 | 10 | 4 | 🟢 COMPLETE |
| Williamson County | 1 | 2 | 11 | 6 | 🟢 COMPLETE |
| Wilson County | 1 | 1 | 10 | 3 | 🟢 COMPLETE |
| Winkler County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Wise County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Wood County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Yoakum County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Young County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |
| Zapata County | 1 | 1 | 9 | 3 | 🟢 COMPLETE |
| Zavala County | 1 | 1 | 8 | 3 | 🟢 COMPLETE |

---

## 8. Detailed County-Level Gap Registry
List of specific counties with zero resource mappings:
- **Counties Missing Social Service Offices**: None
- **Counties Missing School Districts**: None
- **Counties Missing Local Nonprofits**: None

---

## 9. Manual Review Queue Registry
List of records flagged as `manual_review_required` in the database, representing exactly what needs to be verified before this state can be advanced:

No records in manual review queue.


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
