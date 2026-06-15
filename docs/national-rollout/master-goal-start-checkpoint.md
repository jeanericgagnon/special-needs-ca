# Master Goal Start Checkpoint

**Date:** June 15, 2026
**Auditor:** Antigravity (AI Coding Assistant)
**Status:** GSC_HOLD / DNS_HOLD / NO_DEPLOY (Strictly Active)

---

## 1. Database Integrity & Safety Snapshots

- **Root DB Backup Created:** `file:////Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/backups/ca_disability_navigator.db.backup-20260615_094526`
- **Frontend DB Backup Created:** `file:////Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/backups/ca_disability_navigator_frontend.db.backup-20260615_094526`
- **Root DB PRAGMA integrity_check:** `ok`
- **Frontend DB PRAGMA integrity_check:** `ok`
- **WAL Checkpoint:** Completed and Truncated on both DBs

---

## 2. Protected Records Counts

| Table | Root DB count | Frontend DB count |
| :--- | :---: | :---: |
| `county_offices` | 248 | 248 |
| `school_districts` | 183 | 183 |
| `nonprofit_organizations` | 8872 | 8872 |
| `regional_education_agencies` | 116 | 116 |
| `iep_advocates` | 408 | 408 |
| `resource_providers` | 6 | 6 |
| `state_resource_agencies` | 40 | 40 |

---

## 3. Sitemap Allowlist Configuration

- **Allowed Counties Count:** **270** (TX: 248, FL: 14, PA: 8)
- **Exposed States:** California (Legacy), Texas (Allowlist), Florida (Allowlist), Pennsylvania (Allowlist)
- **Other 47 States Gating:** Excluded from sitemaps, hard-gated with `noindex` header

---

## 4. Forms Table & Staging Counts

- **`forms_and_guides` count:** 67 promoted rows
- **`staging_scraped_forms` count:** 76 staged rows

---

## 5. Fake / Generated Domain Counts

- **Fake Domains in Root DB:** 0
- **Fake Domains in Frontend DB:** 0

---

## 6. Manual Review Required Count by State/Category

| State | Table / Category | Count |
| :--- | :--- | :---: |
| **ALABAMA** | `county_offices` | 67 |
| **ALABAMA** | `forms_and_guides` | 1 |
| **ALABAMA** | `nonprofit_organizations` | 67 |
| **ALABAMA** | `school_districts` | 67 |
| **ALABAMA** | `state_resource_agencies` | 2 |
| **ALASKA** | `county_offices` | 20 |
| **ALASKA** | `forms_and_guides` | 1 |
| **ALASKA** | `nonprofit_organizations` | 20 |
| **ALASKA** | `school_districts` | 20 |
| **ALASKA** | `state_resource_agencies` | 2 |
| **ARIZONA** | `forms_and_guides` | 1 |
| **ARIZONA** | `nonprofit_organizations` | 15 |
| **ARIZONA** | `state_resource_agencies` | 2 |
| **ARKANSAS** | `county_offices` | 75 |
| **ARKANSAS** | `forms_and_guides` | 1 |
| **ARKANSAS** | `nonprofit_organizations` | 75 |
| **ARKANSAS** | `school_districts` | 75 |
| **ARKANSAS** | `state_resource_agencies` | 2 |
| **CALIFORNIA** | `regional_education_agencies` | 37 |
| **CALIFORNIA** | `school_districts` | 40 |
| **COLORADO** | `forms_and_guides` | 1 |
| **COLORADO** | `nonprofit_organizations` | 64 |
| **COLORADO** | `state_resource_agencies` | 2 |
| **CONNECTICUT** | `county_offices` | 8 |
| **CONNECTICUT** | `forms_and_guides` | 1 |
| **CONNECTICUT** | `nonprofit_organizations` | 8 |
| **CONNECTICUT** | `school_districts` | 8 |
| **CONNECTICUT** | `state_resource_agencies` | 2 |
| **DELAWARE** | `county_offices` | 3 |
| **DELAWARE** | `forms_and_guides` | 1 |
| **DELAWARE** | `nonprofit_organizations` | 3 |
| **DELAWARE** | `school_districts` | 3 |
| **DELAWARE** | `state_resource_agencies` | 2 |
| **GEORGIA** | `nonprofit_organizations` | 1 |
| **GLOBAL** | `iep_advocates` | 610 |
| **HAWAII** | `county_offices` | 5 |
| **HAWAII** | `forms_and_guides` | 1 |
| **HAWAII** | `nonprofit_organizations` | 5 |
| **HAWAII** | `school_districts` | 5 |
| **HAWAII** | `state_resource_agencies` | 2 |
| **IDAHO** | `county_offices` | 44 |
| **IDAHO** | `forms_and_guides` | 1 |
| **IDAHO** | `nonprofit_organizations` | 44 |
| **IDAHO** | `school_districts` | 44 |
| **IDAHO** | `state_resource_agencies` | 2 |
| **ILLINOIS** | `nonprofit_organizations` | 1 |
| **INDIANA** | `forms_and_guides` | 1 |
| **INDIANA** | `nonprofit_organizations` | 92 |
| **INDIANA** | `state_resource_agencies` | 2 |
| **IOWA** | `county_offices` | 99 |
| **IOWA** | `forms_and_guides` | 1 |
| **IOWA** | `nonprofit_organizations` | 99 |
| **IOWA** | `school_districts` | 99 |
| **IOWA** | `state_resource_agencies` | 2 |
| **KANSAS** | `county_offices` | 105 |
| **KANSAS** | `forms_and_guides` | 1 |
| **KANSAS** | `nonprofit_organizations` | 105 |
| **KANSAS** | `school_districts` | 105 |
| **KANSAS** | `state_resource_agencies` | 2 |
| **KENTUCKY** | `county_offices` | 120 |
| **KENTUCKY** | `forms_and_guides` | 1 |
| **KENTUCKY** | `nonprofit_organizations` | 120 |
| **KENTUCKY** | `school_districts` | 120 |
| **KENTUCKY** | `state_resource_agencies` | 2 |
| **LOUISIANA** | `county_offices` | 64 |
| **LOUISIANA** | `forms_and_guides` | 1 |
| **LOUISIANA** | `nonprofit_organizations` | 64 |
| **LOUISIANA** | `school_districts` | 64 |
| **LOUISIANA** | `state_resource_agencies` | 2 |
| **MAINE** | `county_offices` | 16 |
| **MAINE** | `forms_and_guides` | 1 |
| **MAINE** | `nonprofit_organizations` | 16 |
| **MAINE** | `school_districts` | 16 |
| **MAINE** | `state_resource_agencies` | 2 |
| **MARYLAND** | `county_offices` | 24 |
| **MARYLAND** | `forms_and_guides` | 1 |
| **MARYLAND** | `nonprofit_organizations` | 24 |
| **MARYLAND** | `school_districts` | 24 |
| **MARYLAND** | `state_resource_agencies` | 2 |
| **MASSACHUSETTS** | `forms_and_guides` | 1 |
| **MASSACHUSETTS** | `nonprofit_organizations` | 14 |
| **MASSACHUSETTS** | `state_resource_agencies` | 2 |
| **MICHIGAN** | `forms_and_guides` | 1 |
| **MINNESOTA** | `county_offices` | 87 |
| **MINNESOTA** | `forms_and_guides` | 1 |
| **MINNESOTA** | `nonprofit_organizations` | 87 |
| **MINNESOTA** | `school_districts` | 87 |
| **MINNESOTA** | `state_resource_agencies` | 2 |
| **MISSISSIPPI** | `county_offices` | 82 |
| **MISSISSIPPI** | `forms_and_guides` | 1 |
| **MISSISSIPPI** | `nonprofit_organizations` | 82 |
| **MISSISSIPPI** | `school_districts` | 82 |
| **MISSISSIPPI** | `state_resource_agencies` | 2 |
| **MISSOURI** | `county_offices` | 115 |
| **MISSOURI** | `forms_and_guides` | 1 |
| **MISSOURI** | `nonprofit_organizations` | 115 |
| **MISSOURI** | `school_districts` | 115 |
| **MISSOURI** | `state_resource_agencies` | 2 |
| **MONTANA** | `county_offices` | 56 |
| **MONTANA** | `forms_and_guides` | 1 |
| **MONTANA** | `nonprofit_organizations` | 56 |
| **MONTANA** | `school_districts` | 56 |
| **MONTANA** | `state_resource_agencies` | 2 |
| **NEBRASKA** | `county_offices` | 93 |
| **NEBRASKA** | `forms_and_guides` | 1 |
| **NEBRASKA** | `nonprofit_organizations` | 93 |
| **NEBRASKA** | `programs` | 7 |
| **NEBRASKA** | `school_districts` | 93 |
| **NEBRASKA** | `state_resource_agencies` | 2 |
| **NEVADA** | `county_offices` | 17 |
| **NEVADA** | `forms_and_guides` | 1 |
| **NEVADA** | `nonprofit_organizations` | 17 |
| **NEVADA** | `school_districts` | 17 |
| **NEVADA** | `state_resource_agencies` | 2 |
| **NEW-HAMPSHIRE** | `county_offices` | 10 |
| **NEW-HAMPSHIRE** | `forms_and_guides` | 1 |
| **NEW-HAMPSHIRE** | `nonprofit_organizations` | 10 |
| **NEW-HAMPSHIRE** | `programs` | 7 |
| **NEW-HAMPSHIRE** | `school_districts` | 10 |
| **NEW-HAMPSHIRE** | `state_resource_agencies` | 2 |
| **NEW-JERSEY** | `forms_and_guides` | 1 |
| **NEW-JERSEY** | `state_resource_agencies` | 2 |
| **NEW-MEXICO** | `county_offices` | 33 |
| **NEW-MEXICO** | `forms_and_guides` | 1 |
| **NEW-MEXICO** | `nonprofit_organizations` | 33 |
| **NEW-MEXICO** | `school_districts` | 33 |
| **NEW-MEXICO** | `state_resource_agencies` | 2 |
| **NORTH-CAROLINA** | `forms_and_guides` | 1 |
| **NORTH-DAKOTA** | `county_offices` | 53 |
| **NORTH-DAKOTA** | `forms_and_guides` | 1 |
| **NORTH-DAKOTA** | `nonprofit_organizations` | 53 |
| **NORTH-DAKOTA** | `school_districts` | 53 |
| **NORTH-DAKOTA** | `state_resource_agencies` | 2 |
| **OHIO** | `nonprofit_organizations` | 1 |
| **OKLAHOMA** | `county_offices` | 77 |
| **OKLAHOMA** | `forms_and_guides` | 1 |
| **OKLAHOMA** | `nonprofit_organizations` | 77 |
| **OKLAHOMA** | `school_districts` | 77 |
| **OKLAHOMA** | `state_resource_agencies` | 2 |
| **OREGON** | `county_offices` | 36 |
| **OREGON** | `forms_and_guides` | 1 |
| **OREGON** | `nonprofit_organizations` | 36 |
| **OREGON** | `school_districts` | 36 |
| **OREGON** | `state_resource_agencies` | 2 |
| **PENNSYLVANIA** | `programs` | 1 |
| **PENNSYLVANIA** | `regional_education_agencies` | 29 |
| **RHODE-ISLAND** | `county_offices` | 5 |
| **RHODE-ISLAND** | `forms_and_guides` | 1 |
| **RHODE-ISLAND** | `nonprofit_organizations` | 5 |
| **RHODE-ISLAND** | `school_districts` | 5 |
| **RHODE-ISLAND** | `state_resource_agencies` | 2 |
| **SOUTH-CAROLINA** | `county_offices` | 46 |
| **SOUTH-CAROLINA** | `forms_and_guides` | 1 |
| **SOUTH-CAROLINA** | `nonprofit_organizations` | 46 |
| **SOUTH-CAROLINA** | `school_districts` | 46 |
| **SOUTH-CAROLINA** | `state_resource_agencies` | 2 |
| **SOUTH-DAKOTA** | `county_offices` | 66 |
| **SOUTH-DAKOTA** | `forms_and_guides` | 1 |
| **SOUTH-DAKOTA** | `nonprofit_organizations` | 66 |
| **SOUTH-DAKOTA** | `school_districts` | 66 |
| **SOUTH-DAKOTA** | `state_resource_agencies` | 2 |
| **TENNESSEE** | `forms_and_guides` | 1 |
| **TENNESSEE** | `nonprofit_organizations` | 95 |
| **TENNESSEE** | `state_resource_agencies` | 2 |
| **UTAH** | `county_offices` | 29 |
| **UTAH** | `forms_and_guides` | 1 |
| **UTAH** | `nonprofit_organizations` | 29 |
| **UTAH** | `school_districts` | 29 |
| **UTAH** | `state_resource_agencies` | 2 |
| **VERMONT** | `county_offices` | 14 |
| **VERMONT** | `forms_and_guides` | 1 |
| **VERMONT** | `nonprofit_organizations` | 14 |
| **VERMONT** | `school_districts` | 14 |
| **VERMONT** | `state_resource_agencies` | 2 |
| **VIRGINIA** | `forms_and_guides` | 1 |
| **VIRGINIA** | `nonprofit_organizations` | 95 |
| **VIRGINIA** | `state_resource_agencies` | 2 |
| **WASHINGTON** | `forms_and_guides` | 1 |
| **WASHINGTON** | `nonprofit_organizations` | 39 |
| **WASHINGTON** | `state_resource_agencies` | 2 |
| **WEST-VIRGINIA** | `county_offices` | 55 |
| **WEST-VIRGINIA** | `forms_and_guides` | 1 |
| **WEST-VIRGINIA** | `nonprofit_organizations` | 55 |
| **WEST-VIRGINIA** | `school_districts` | 55 |
| **WEST-VIRGINIA** | `state_resource_agencies` | 2 |
| **WISCONSIN** | `county_offices` | 72 |
| **WISCONSIN** | `forms_and_guides` | 1 |
| **WISCONSIN** | `nonprofit_organizations` | 72 |
| **WISCONSIN** | `school_districts` | 72 |
| **WISCONSIN** | `state_resource_agencies` | 2 |
| **WYOMING** | `county_offices` | 23 |
| **WYOMING** | `forms_and_guides` | 1 |
| **WYOMING** | `nonprofit_organizations` | 23 |
| **WYOMING** | `school_districts` | 2 |
| **WYOMING** | `state_resource_agencies` | 2 |

---

## 7. Fallback Count by State/Category

| State | Table / Category | Count |
| :--- | :--- | :---: |
| **CALIFORNIA** | `school_districts` | 40 |

