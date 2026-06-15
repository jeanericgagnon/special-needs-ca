# Source Target Truth Audit Report (V3)

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  

---

## 1. National Audit Summary

* **Total Source Targets Audited:** 930
* **Total Verified Targets:** 789
* **Total Quarantined / Review Required Targets:** 141

---

## 2. 50-State Source Target Breakdown

| State | Total Targets | Verified | Quarantined / Review | Discovery Status |
| :--- | :---: | :---: | :---: | :---: |
| **ALABAMA** | 14 | 13 | 1 | `Exhaustive` |
| **ALASKA** | 14 | 11 | 3 | `Exhaustive` |
| **ARIZONA** | 14 | 11 | 3 | `Exhaustive` |
| **ARKANSAS** | 14 | 11 | 3 | `Exhaustive` |
| **COLORADO** | 14 | 11 | 3 | `Exhaustive` |
| **CONNECTICUT** | 14 | 11 | 3 | `Exhaustive` |
| **DELAWARE** | 14 | 11 | 3 | `Exhaustive` |
| **FLORIDA** | 49 | 46 | 3 | `Exhaustive` |
| **GEORGIA** | 41 | 41 | 0 | `Exhaustive` |
| **HAWAII** | 14 | 11 | 3 | `Exhaustive` |
| **IDAHO** | 14 | 11 | 3 | `Exhaustive` |
| **ILLINOIS** | 43 | 43 | 0 | `Exhaustive` |
| **INDIANA** | 14 | 11 | 3 | `Exhaustive` |
| **IOWA** | 14 | 11 | 3 | `Exhaustive` |
| **KANSAS** | 14 | 11 | 3 | `Exhaustive` |
| **KENTUCKY** | 14 | 11 | 3 | `Exhaustive` |
| **LOUISIANA** | 14 | 11 | 3 | `Exhaustive` |
| **MAINE** | 14 | 11 | 3 | `Exhaustive` |
| **MARYLAND** | 14 | 11 | 3 | `Exhaustive` |
| **MASSACHUSETTS** | 14 | 11 | 3 | `Exhaustive` |
| **MICHIGAN** | 14 | 5 | 9 | `Weak` |
| **MINNESOTA** | 14 | 11 | 3 | `Exhaustive` |
| **MISSISSIPPI** | 14 | 11 | 3 | `Exhaustive` |
| **MISSOURI** | 14 | 11 | 3 | `Exhaustive` |
| **MONTANA** | 14 | 11 | 3 | `Exhaustive` |
| **NEBRASKA** | 14 | 11 | 3 | `Exhaustive` |
| **NEVADA** | 14 | 11 | 3 | `Exhaustive` |
| **NEW-HAMPSHIRE** | 14 | 11 | 3 | `Exhaustive` |
| **NEW-JERSEY** | 14 | 11 | 3 | `Exhaustive` |
| **NEW-MEXICO** | 14 | 11 | 3 | `Exhaustive` |
| **NEW-YORK** | 58 | 58 | 0 | `Exhaustive` |
| **NORTH-CAROLINA** | 14 | 5 | 9 | `Weak` |
| **NORTH-DAKOTA** | 14 | 11 | 3 | `Exhaustive` |
| **OHIO** | 50 | 50 | 0 | `Exhaustive` |
| **OKLAHOMA** | 14 | 11 | 3 | `Exhaustive` |
| **OREGON** | 14 | 11 | 3 | `Exhaustive` |
| **PENNSYLVANIA** | 47 | 47 | 0 | `Exhaustive` |
| **RHODE-ISLAND** | 14 | 11 | 3 | `Exhaustive` |
| **SOUTH-CAROLINA** | 14 | 11 | 3 | `Exhaustive` |
| **SOUTH-DAKOTA** | 14 | 11 | 3 | `Exhaustive` |
| **TENNESSEE** | 14 | 11 | 3 | `Exhaustive` |
| **TEXAS** | 54 | 52 | 2 | `Exhaustive` |
| **UTAH** | 14 | 11 | 3 | `Exhaustive` |
| **VERMONT** | 14 | 11 | 3 | `Exhaustive` |
| **VIRGINIA** | 14 | 11 | 3 | `Exhaustive` |
| **WASHINGTON** | 14 | 11 | 3 | `Exhaustive` |
| **WEST-VIRGINIA** | 14 | 11 | 3 | `Exhaustive` |
| **WISCONSIN** | 14 | 11 | 3 | `Exhaustive` |
| **WYOMING** | 14 | 11 | 3 | `Exhaustive` |

---

## 3. Findings and Key Gaps

### States with Weak Source Discovery
The following states have less than 40% verified official/trusted source targets:
**MICHIGAN**, **NORTH-CAROLINA**

### Categories Most Affected
* **B. Medicaid / benefits / HHS:** High rate of generic homepages (e.g. `https://myflfamilies.com` instead of the local county office locator sub-page).
* **C. Education / school districts:** High rate of missing regional education directories and intermediate agency endpoints.

### Next Source Discovery Tasks Required
1. Replace all generic state homepages in the registry with specific local directory locator search URLs.
2. Exclude all quarantined targets from crawler ingestion loops.
