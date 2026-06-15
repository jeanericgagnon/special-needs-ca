# Next Real Source Discovery Plan

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** **PROPOSED STRATEGY**

---

## 1. Objective

Systematically replace the purged placeholder domains and downgraded records in Batch 1 states (Texas, Florida, Pennsylvania) and other states with verified, active, official URLs using curated directories and browser-verified public sources.

---

## 2. Recommended Curation Approach

### Phase 1: Texas LIDDA & SpEd Cleanup
1. **LIDDA Directory Verification:**
   - Retrieve the official LIDDA directory directly from the Texas Health and Human Services Commission (HHSC) portal.
   - Resolve remaining unverified placeholder URLs for the 37 Texas LIDDAs with their actual local portal domains.
2. **Texas school district domain audit:**
   - Query the Texas Education Agency (TEA) School Directory database.
   - Replace any unverified school district domains with official district homepages.

### Phase 2: Florida County Office & School Curation
1. **Florida APD Areas:**
   - Map Florida counties to the Agency for Persons with Disabilities (APD) Area offices.
   - Populate local intake phone numbers and web portals.
2. **Florida School Districts:**
   - Curation of Florida district special education offices using Florida Department of Education directory.

### Phase 3: Pennsylvania County MH/ID & School Curation
1. **County Administrative Entities (AE):**
   - Populate local intake details for Pennsylvania County MH/ID Offices (Mental Health and Intellectual Disabilities).
2. **Pennsylvania School Districts:**
   - Curation of local school district IEP pages using Pennsylvania Department of Education directories.

---

## 3. Safe Execution Prompt for Next Step

For the next state-by-state source discovery phase, run this safe execution instruction:

```markdown
Run verified source discovery and data replacement for Batch 1 states (TX, FL, PA).
Query the official HHSC (Texas), APD (Florida), and Department of Human Services (Pennsylvania) directories to replace manual_review_required placeholder contacts with verified official offices. Keep GSC and DNS changes on active HOLD.
```
