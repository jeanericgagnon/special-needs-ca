# Illinois Completion Status Correction

**Date:** 2026-06-14  
**Status Correction:** **PARTIAL (Data Ingested, Local Reviews Pending)**  

---

## 1. Background & Status Correction

Illinois was previously marked as complete. However, a detailed inspection of database contact details revealed mock/placeholder records and fictional contact data (`555` phone numbers, generated websites) seeded for geographic routing.

To correct this status and ensure database integrity:
1.  **Removed 20 duplicate/placeholder records**: Deleting 10 duplicate curated community offices and 10 placeholder local nonprofits.
2.  **Downgraded 89 school districts**: Deleting mock phone numbers/emails and pointing websites to the official ISBE directory. These 89 districts are now downgraded to `manual_review_required`.

Because these 89 school districts are in the active database but marked `manual_review_required`, the final state-upgrade classification for Illinois is corrected from *COMPLETE* to **PARTIAL**.

---

## 2. Active Manual Review Queue

The following items are now queued for manual verification before Illinois can reach full launch completeness:

### A. School District Local Special Education Contacts (89 Records)
- **Problem**: These 89 counties do not have official, scraped local district special education department contacts.
- **Interim State**: Contact details have been cleared, website points to the state-level [ISBE Special Education Programs Directory](https://www.isbe.net/Pages/Special-Education-Programs.aspx), and status is set to `manual_review_required`.
- **Action Required**: Manual collectors must locate and insert the correct special education department phone/email for the primary unit school district in each of these 89 counties.

### B. Private Provider / Legal Review (2 Records)
- **Problem**: Commercial private providers and lawyers are isolated from production.
- **Interim State**: Safely isolated in `provider_legal_review_queue.json` to keep unvetted directories out of production.
- **Action Required**: Vetting team must check credentials for:
  1.  `Midwest Autism Coaching & Advocacy` (Cook County)
  2.  `Chicago Special Education Attorneys LLC` (Cook County)
