# Georgia Gap Analysis

This document audits the current database records against the authoritative Georgia truth maps to identify placeholders and fake data that must be replaced or downgraded.

## 1. Database Mismatches & Audit Metrics

| Category | Current Count | Authoritative Truth Target | Action Required |
| :--- | :---: | :---: | :--- |
| **Counties** | 159 | 159 | None (Verified) |
| **County Offices (DFCS)** | 159 | 11 Curated + 148 Directory | Replace 11 priority county mock phones. Clear mock phones/addresses from 148 other offices, setting them to `manual_review_required`. |
| **State Resource Agencies** | 5 | 6 DBHDD Regions + 1 Babies Can't Wait | Delete 159 county-level duplicate DBHDD and EI offices. Promote 6 regional DBHDD offices and 1 statewide BCW coordinator with correct county mappings. |
| **School Districts** | 159 | 11 Curated + 148 Directory | Rekey 148 fallback districts (releasing `-fallback` IDs). Set contact phone/email/website to `NULL` for the 148 fallback districts and set status to `manual_review_required`. |
| **Nonprofit Organizations** | 488 | 159 GAO + 159 P2P + 11 CILs + 9 Arc Chapters | Delete 159 fake `The Arc of Georgia` duplicate records. Delete other mock county nonprofits. Promote GAO and P2P with correct statewide contact info. Promote local CILs and real Arc chapters. |
| **Institutional Clinics** | 0 | CHOA Marcus Autism Center | Map public diagnostic clinics and university developmental clinics. |

## 2. High-Risk Placeholders Identified

1.  **County Offices:** 148 offices mapped with mock phone `(800) 555-0155` and address `'Services are routed online through the state eligibility portal and local case managers.'`.
2.  **Curated County Offices:** 11 priority offices mapped with mock phone `(800) 555-0155`.
3.  **School Districts:** 148 school districts mapped with mock phone `(800) 555-0199` and fictional website `https://www.state.edu/sped/GA`.
4.  **Nonprofits:** 159 records for `The Arc of Georgia` mapped with mock phone `(770) 555-0131` and fictional local websites. Other local nonprofits mapped with mock phones `(770) 555-017x`.
5.  **Statewide Helplines:** 159 duplicate county records for DBHDD and Early Intervention using `(877) 423-4746`.
