# National Manual Review Operating System (V2)

This document establishes the V2 operational workflow for human/VA curation to resolve the remaining 6,091 unverified database records.

---

## 1. Backlog & Priority Overview

Our adversarial audit shows a national backlog of **6,091 records** requiring manual verification before we can index county pages safely.

- **School Districts (2,696 records):** Mapped but missing direct special education coordinators.
- **County HHS/Medicaid Offices (2,350 records):** Missing direct intake lines.
- **IEP Advocates (928 records):** Missing validation status.
- **Forms & Appeals (36 records):** Missing direct PDF downloads.

---

## 2. Curation Workflow Rules

1. **Queue Export:** Curation queues are exported as structured tables containing the current record ID, missing fields, recommended search terms, and priority scores.
2. **Review Fields:** Reviewers must populate the following fields upon verification:
   - `verified_phone`
   - `verified_email`
   - `verified_website`
   - `source_url` (must be direct)
   - `reviewer_initials`
   - `reviewed_date`
   - `verification_outcome` (`VERIFIED_OFFICIAL`, `ARCHIVED_DUPLICATE`, `DEAD_LINK`)
3. **Double-Verification for Badges:** No record can receive a green "Verified" badge on the frontend unless a second reviewer verifies the source link.
