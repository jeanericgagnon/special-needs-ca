# HCS Routing Cleanup Proposal: Texas LIDDA Replacement

This proposal outlines the cleanup of 254 incorrect county-level fallback records for the Home and Community-based Services (HCS) program from the `county_offices` table, and explains how their routing has been replaced by the 39 official Local Intellectual and Developmental Disability Authorities (LIDDAs) in `state_resource_agencies`.

## 1. Context and Problem Statement

In Texas, the HCS waiver program is not administered at the county level by local county offices. Instead, it is coordinated by 39 regional public entities known as LIDDAs. Each LIDDA serves a specific multi-county catchment area.

Currently, the database contains **254 fallback records** (one for each Texas county) for the HCS program (`program_id = 'tx-hcs'`) inside the `county_offices` table. These records are incorrect and present severe data quality issues:

*   **Fake Contact Information:** The records list fake intake email addresses in the format `intake@[county]-tx.tx.gov` (e.g., `intake@anderson-tx.tx.gov`) which do not exist.
*   **Fake Address Mappings:** The address is a programmatic fallback (`County Health & Human Services Department, [County], TX`) rather than a real physical site.
*   **Toll-Free Placeholder Phone:** The phone number is mapped to the generic HHS helpline `(855) 937-2372` instead of the LIDDA's local intake number.
*   **Wrong Database Table:** Placing these records in `county_offices` implies HCS is a county-administered program. In reality, HCS routing is regional.

## 2. Replacement Routing via LIDDAs

To resolve this issue, the 39 official LIDDA records have been staged, validated, and promoted to the `state_resource_agencies` table (with `agency_type = 'lidda'`). 

*   **Coverage:** These 39 LIDDAs serve all 254 Texas counties. All counties are mapped to their corresponding LIDDA(s) via the `regional_center_counties` junction table.
*   **Data Quality:** Each promoted LIDDA record has local, source-listed intake phone numbers (e.g., `(972) 382-2449` for Lakes Regional serving Hopkins County) and verified local website URLs instead of placeholders.
*   **Frontend Routing:** The frontend queries LIDDAs for each county page via the `regionalCenters` field in `getCountyDetails`. It displays these regional authorities in the **LIDDA Coverage** section of the page with a `TrustBadge` referencing official sources.

Therefore, the 254 county-level fallbacks in `county_offices` are completely redundant and incorrect. Removing them will clean up the "County Admin Support Offices" section of Texas county pages while leaving the correct HCS routing in place.

## 3. Records Proposed for Deletion

We propose deleting the **254 records** in the `county_offices` table where:
*   `program_id = 'tx-hcs'`
*   `data_origin = 'programmatic_fallback'`

### Sample Records to Delete

| County ID | Office ID (to Delete) | Office Name | Placeholder Phone | Fake Email |
| :--- | :--- | :--- | :--- | :--- |
| `anderson-tx` | `off-anderson-tx-intake` | Anderson County Local LIDDA Intake Desk | `(855) 937-2372` | `intake@anderson-tx.tx.gov` |
| `andrews-tx` | `off-andrews-tx-intake` | Andrews County Local LIDDA Intake Desk | `(855) 937-2372` | `intake@andrews-tx.tx.gov` |
| `angelina-tx` | `off-angelina-tx-intake` | Angelina County Local LIDDA Intake Desk | `(855) 937-2372` | `intake@angelina-tx.tx.gov` |
| `harris-tx` | `off-harris-tx-intake` | Harris County Local LIDDA Intake Desk | `(855) 937-2372` | `intake@harris-tx.tx.gov` |
| `travis-tx` | `off-travis-tx-intake` | Travis County Local LIDDA Intake Desk | `(855) 937-2372` | `intake@travis-tx.tx.gov` |

*No curated or human-verified records will be affected.* Curated records, such as the 15 verified regional HHSC Medicaid offices or any `curated_seed` entries, will be completely preserved. Unrelated programs (such as `tx-mdcp` or Medicaid offices for other states) will not be touched.

## 4. Page Impact Analysis

Removing these records will improve the user experience on Texas county pages:
1.  **Before Cleanup:**
    *   *Catchment Section:* Correctly shows the official regional LIDDA (e.g., *Lakes Regional MHMR Center* for Hopkins County, with phone `(972) 382-2449`).
    *   *County Offices Section:* Confusingly shows a second entry: "*Hopkins County Local LIDDA Intake Desk*" with phone `(855) 937-2372` and email `intake@hopkins-tx.tx.gov` (fake).
2.  **After Cleanup:**
    *   *Catchment Section:* Correctly shows the official regional LIDDA (e.g., *Lakes Regional MHMR Center*).
    *   *County Offices Section:* No longer shows the fake county office. This removes duplicate, contradictory, and incorrect contact information.

## 5. Rollback Plan

To ensure safety, the cleanup will follow these operational rules:
1.  **Transaction Safety:** The deletions will be executed within a SQLite database transaction.
2.  **Audit Logging:** Every deletion will be logged in the `staging_promotion_audit` table, recording the full JSON representation of the deleted record.
3.  **Database Backups:** A copy of the database files will be kept before execution.
4.  **Re-seeding Capability:** If rollback is required, the records can be reconstructed by re-running the seed script (`src/db/seed_texas_exhaustive.js` or equivalent) or by restoring the database backup.
