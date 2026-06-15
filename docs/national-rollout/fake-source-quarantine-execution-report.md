# Fake Source Quarantine Execution Report

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** **COMPLETED**

---

## 1. Purge Summary

* **Root Database (`ca_disability_navigator.db`) Records Purged:** 206
* **Frontend Database (`frontend/ca_disability_navigator.db`) Records Purged:** 206
* **Rollback SQL Script Generated:** `/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/backups/fake-purging-rollback.sql`
* **Quarantined URLs added to list:** 54

---

## 2. Affected Records and Downgrades

All records associated with these fake sources have been:
1. Stripped of the fake/generated URL.
2. Downgraded to `manual_review_required` verification status.
3. Assigned a `confidence_score` of `0.0` to set their verified-depth contribution to 0.

### Purged Records Sample (First 50):

| Table | Row ID | Column | Purged URL |
| :--- | :--- | :--- | :--- |
| `programs` | `pa-special-education` | `source_url` | https://www.education.pa.gov/K-12/Special%20Education/Pages/default.aspx |
| `programs` | `ne-dd-waiver` | `source_url` | https://dhhs.ne.gov/Pages/DD-Waivers-Eligibility.aspx |
| `programs` | `ne-dd-self-direction` | `source_url` | https://dhhs.ne.gov/Pages/DD |
| `programs` | `ne-medicaid` | `source_url` | https://dhhs.ne.gov/medicaid |
| `programs` | `ne-personal-care` | `source_url` | https://dhhs.ne.gov/medicaid |
| `programs` | `ne-chip` | `source_url` | https://dhhs.ne.gov/medicaid |
| `programs` | `ne-early-intervention` | `source_url` | https://dhhs.ne.gov/Pages/DD |
| `programs` | `ne-transition-services` | `source_url` | https://dhhs.ne.gov/Pages/DD |
| `programs` | `nh-dd-waiver` | `source_url` | https://www.dhhs.nh.gov/bds/hcbs/eligibility |
| `programs` | `nh-dd-self-direction` | `source_url` | https://www.dhhs.nh.gov/bds |
| `programs` | `nh-medicaid` | `source_url` | https://www.dhhs.nh.gov/medicaid |
| `programs` | `nh-personal-care` | `source_url` | https://www.dhhs.nh.gov/medicaid |
| `programs` | `nh-chip` | `source_url` | https://www.dhhs.nh.gov/medicaid |
| `programs` | `nh-early-intervention` | `source_url` | https://www.dhhs.nh.gov/bds |
| `programs` | `nh-transition-services` | `source_url` | https://www.dhhs.nh.gov/bds |
| `regional_education_agencies` | `pa-iu-1` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-1` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-2` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-2` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-3` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-3` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-4` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-4` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-5` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-5` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-6` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-6` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-7` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-7` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-8` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-8` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-9` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-9` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-10` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-10` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-11` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-11` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-12` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-12` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-13` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-13` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-14` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-14` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-15` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-15` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-16` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-16` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-17` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-17` | `source_url` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
| `regional_education_agencies` | `pa-iu-18` | `website` | https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx |
