# Paid Caregiver Priority State Gap Report

This report evaluates the current coverage gaps and data completeness of the paid caregiver personal care layer across the 10 priority states.

---

## 1. State-by-State Gap Matrix

We evaluated the personal care metadata completeness across states (CA, TX, FL, PA, NY, OH, IL, GA, NC, MI):

| State | Caregiver Program Name | Parent Hiring Allowed? | Local Office Routing | Forms Seeded? | Source Link Status |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **CA** | IHSS | 🟢 Yes | Mapped (county DSS) | 🟢 Yes | 🟢 Verified (CDSS) |
| **TX** | Consumer Directed Services | 🟢 Yes | Mapped (LIDDA) | 🟢 Yes | 🟢 Verified (HHSC) |
| **FL** | Consumer Directed Care Plus | 🟢 Yes | Mapped (APD Areas) | 🟢 Yes | 🟢 Verified (APD) |
| **PA** | Participant Directed Services | 🟢 Yes | Mapped (CAO) | 🟢 Yes | 🟢 Verified (DHS) |
| **NY** | CDPAP | 🟡 Adult Only | Mapped (LDSS) | 🔴 No | 🟢 Verified (DOH) |
| **OH** | Homemaker/Personal Care | 🟢 Yes | Mapped (County Boards) | 🔴 No | 🟢 Verified (DODD) |
| **IL** | Home Services Program | 🟡 Adult Only | Mapped (DHS local) | 🔴 No | 🟢 Verified (IDHS) |
| **GA** | GAPP / NOW / COMP | 🟡 Restricted | Mapped (DFCS) | 🔴 No | 🟡 Unverified (DCH) |
| **NC** | CAP/C | 🟢 Yes | Mapped (DSS) | 🔴 No | 🟡 Unverified (DHHS) |
| **MI** | Choice / HSW | 🟢 Yes | Mapped (CMHSP) | 🔴 No | 🟡 Unverified (MDHHS) |

---

## 2. Priority Recovery Actions

1. **New York (NY) & Illinois (IL):** Expose CDPAP/HSP details on county pages but explicitly display the **"Adult Only" parent restriction** warning in the hero block.
2. **Ohio (OH) & Michigan (MI):** Ensure local county board/CMHSP office listings display direct intake lines so parents can request self-directed assessments.
3. **Form Seeding:** Seed the caregiver intake timesheets and application packets for NY, OH, IL, GA, NC, and MI in `staging_scraped_forms` during the next scraping sprint.
