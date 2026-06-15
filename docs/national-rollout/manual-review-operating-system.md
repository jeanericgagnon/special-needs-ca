# Manual Review Operating System

This document outlines the operational process and prioritization guidelines for running manual review curation sprints.

## 1. National Backlog Statistics

* **Total School Districts in Manual Review:** 2696
* **Total County Offices in Manual Review:** 2350
* **Total Nonprofits in Manual Review:** 0

## 2. Priority Scoring Matrix

Priority is assigned using a 3-tier scoring system to maximize HCU/SEO authority impact first:

* **Priority 1 (High Population Metro Hubs):** Metro counties in allowlisted or Batch 2 candidate states (TX, FL, PA, NY, OH, IL).
* **Priority 2 (Wave 2 Pilot Candidates):** Michigan & North Carolina priority counties.
* **Priority 3 (Gated Rural Counties):** Rural areas in Waves 3-6.

## 3. Operating Procedure Workflow

```
[ Research Source URL ] ──► [ Find Direct Contact Phone/Email ] ──► [ Apply SQL Update ] ──► [ Run Integrity Audit ]
```

1. **Step 1: Check Source URL:** Review the existing `source_url`. If empty or generic, use Google Search to locate the specific program contact folder.
2. **Step 2: Curation:** Extract the phone, email, and specific office name.
3. **Step 3: Database Update:** Apply the transaction, setting `verification_status` to `'official_verified'` and `confidence_score` to `9.5`.
4. **Step 4: Synchronize:** Run `PRAGMA wal_checkpoint(TRUNCATE)` and copy the DB to the frontend folder.
