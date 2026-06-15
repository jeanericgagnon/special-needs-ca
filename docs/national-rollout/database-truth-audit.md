# Database Truth Audit Report

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** **AUTHORITATIVE / CURRENT_SUPPORTING**

---

## 1. Core Schema and Forms Tables

* **Table `forms_and_guides` Exists:** 🟢 Yes
* **Table `forms_and_guides` Row Count:** 67
* **Table `staging_scraped_forms` Exists:** 🟢 Yes
* **Table `staging_scraped_forms` Row Count:** 76

---

## 2. 50-State Quality Metrics & Scaffold Signatures

| State Name | Code | Active Records (Off+Dist+NP) | Manual Reviews | Fallbacks | Mocks | Scaffold Signature |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Alabama** | AL | 335 | 203 | 0 | 0 | 100% (Skeleton) |
| **Alaska** | AK | 100 | 62 | 0 | 0 | 100% (Skeleton) |
| **Arizona** | AZ | 75 | 47 | 0 | 0 | 100% (Skeleton) |
| **Arkansas** | AR | 375 | 227 | 0 | 0 | 100% (Skeleton) |
| **California** | CA | 288 | 657 | 40 | 0 | 0% (Upgraded/Custom) |
| **Colorado** | CO | 321 | 195 | 0 | 0 | 100% (Skeleton) |
| **Connecticut** | CT | 40 | 26 | 0 | 0 | 100% (Skeleton) |
| **Delaware** | DE | 15 | 21 | 0 | 0 | 100% (Skeleton) |
| **Florida** | FL | 371 | 0 | 0 | 0 | 0% (Upgraded/Custom) |
| **Georgia** | GA | 656 | 265 | 0 | 0 | 0% (Upgraded/Custom) |
| **Hawaii** | HI | 25 | 17 | 0 | 0 | 100% (Skeleton) |
| **Idaho** | ID | 220 | 134 | 0 | 0 | 100% (Skeleton) |
| **Illinois** | IL | 211 | 1 | 0 | 0 | 0% (Upgraded/Custom) |
| **Indiana** | IN | 460 | 278 | 0 | 0 | 100% (Skeleton) |
| **Iowa** | IA | 495 | 299 | 0 | 0 | 100% (Skeleton) |
| **Kansas** | KS | 525 | 317 | 0 | 0 | 100% (Skeleton) |
| **Kentucky** | KY | 600 | 606 | 0 | 0 | 100% (Skeleton) |
| **Louisiana** | LA | 320 | 194 | 0 | 0 | 100% (Skeleton) |
| **Maine** | ME | 80 | 50 | 0 | 0 | 100% (Skeleton) |
| **Maryland** | MD | 120 | 74 | 0 | 0 | 100% (Skeleton) |
| **Massachusetts** | MA | 70 | 44 | 0 | 0 | 100% (Skeleton) |
| **Michigan** | MI | 415 | 151 | 0 | 0 | 100% (Skeleton) |
| **Minnesota** | MN | 435 | 441 | 0 | 0 | 100% (Skeleton) |
| **Mississippi** | MS | 410 | 248 | 0 | 0 | 100% (Skeleton) |
| **Missouri** | MO | 575 | 347 | 0 | 0 | 100% (Skeleton) |
| **Montana** | MT | 280 | 170 | 0 | 0 | 100% (Skeleton) |
| **Nebraska** | NE | 465 | 471 | 0 | 0 | 100% (Skeleton) |
| **Nevada** | NV | 85 | 53 | 0 | 0 | 100% (Skeleton) |
| **New Hampshire** | NH | 50 | 56 | 0 | 0 | 100% (Skeleton) |
| **New Jersey** | NJ | 105 | 23 | 0 | 0 | 100% (Skeleton) |
| **New Mexico** | NM | 165 | 101 | 0 | 0 | 100% (Skeleton) |
| **New York** | NY | 124 | 0 | 0 | 0 | 0% (Upgraded/Custom) |
| **North Carolina** | NC | 500 | 186 | 0 | 0 | 100% (Skeleton) |
| **North Dakota** | ND | 265 | 161 | 0 | 0 | 100% (Skeleton) |
| **Ohio** | OH | 267 | 167 | 0 | 0 | 0% (Upgraded/Custom) |
| **Oklahoma** | OK | 385 | 233 | 0 | 0 | 100% (Skeleton) |
| **Oregon** | OR | 180 | 110 | 0 | 0 | 100% (Skeleton) |
| **Pennsylvania** | PA | 142 | 29 | 0 | 0 | 0% (Upgraded/Custom) |
| **Rhode Island** | RI | 25 | 17 | 0 | 0 | 100% (Skeleton) |
| **South Carolina** | SC | 230 | 140 | 0 | 0 | 100% (Skeleton) |
| **South Dakota** | SD | 330 | 200 | 0 | 0 | 100% (Skeleton) |
| **Tennessee** | TN | 475 | 287 | 0 | 0 | 100% (Skeleton) |
| **Texas** | TX | 2647 | 0 | 0 | 0 | 0% (Upgraded/Custom) |
| **Utah** | UT | 145 | 89 | 0 | 0 | 100% (Skeleton) |
| **Vermont** | VT | 70 | 44 | 0 | 0 | 100% (Skeleton) |
| **Virginia** | VA | 475 | 287 | 0 | 0 | 100% (Skeleton) |
| **Washington** | WA | 195 | 119 | 0 | 0 | 100% (Skeleton) |
| **West Virginia** | WV | 275 | 167 | 0 | 0 | 100% (Skeleton) |
| **Wisconsin** | WI | 360 | 218 | 0 | 0 | 100% (Skeleton) |
| **Wyoming** | WY | 115 | 50 | 0 | 0 | 100% (Skeleton) |

---

## 3. Active Quarantined Fake/Generated Domains in Database
* **Total Quarantined Domain Records Found:** 74