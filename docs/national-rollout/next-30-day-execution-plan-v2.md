# Next 30-Day Execution Plan (V2)

**Audit Version:** 3.0  
**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** COMPLETE (Supersedes V1 Roadmap)  

This document outlines the operational plan for the next 30 days to resolve remaining database gaps, clean legacy California structures, and transition the directory from local staging to public indexation.

---

## 1. Weekly Sprints & Milestones

### 📅 Week 1: Batch 1 Polish & Automated Validation
- **Objective:** Finalize Florida and Pennsylvania contact verification; build developer-led validation scripts.
- **Tasks:**
  - Manually review and clean the 16 remaining school districts in PA and the 1 remaining school district in FL.
  - Implement a Python validation script utilizing phone lookup and business registry APIs to verify contact numbers.
  - Seed 5–10 local support nonprofits in priority Pennsylvania counties (e.g. Philadelphia, Allegheny, Montgomery).
- **Gate:** 100% verified status for all county offices and districts in Florida and Pennsylvania.

### 📅 Week 2: California Gold Standard Cleanup
- **Objective:** Clean or downgrade California legacy directories.
- **Tasks:**
  - Audit the 77 active fallback school districts in California and replace them with source-supported contacts.
  - Remove verified badges from legacy advocate listings that lack a matching source URL or last-verified timestamp.
  - Update California county page components to match the latest boilerplate dilution layout of Florida and Texas.
- **Gate:** California fallback count reduced to 0.

### 📅 Week 3: Batch 2 & High-Value States Recovery
- **Objective:** Reduce manual-review backlogs for New York, Illinois, Ohio, Georgia, North Carolina, and Michigan.
- **Tasks:**
  - Execute automated scraper runs on state DSS/HHS directories to retrieve county-level intake lines.
  - Verify special education contacts for priority school districts in New York (62 counties) and Illinois (102 counties).
  - Recalculate verified-depth scores for Batch 2 states under V3 honesty rules.
- **Gate:** NY, IL, and OH manual review rate reduced below 10%.

### 📅 Week 4: Forms Library & Caregiver Layer Productionization
- **Objective:** Apply forms database migrations and roll out paid caregiver programs.
- **Tasks:**
  - Apply the SQLite schema migration to create the production `forms_and_guides` table.
  - Populate the forms table using staged data in `staging_scraped_forms` and verify direct PDF URLs.
  - Deploy the paid caregiver programs from `data/paid-caregiver-programs-priority-states.json` to the production database.
- **Gate:** Forms and caregiver profiles render dynamically on production county pages.

---

## 2. Developer-Led Curation Alternative

To bypass manual curation bottlenecks and remote VA hiring:
1. **Telecom Verification Scraper:** Build a Node.js script to run asynchronous telecom carrier lookups on all scraped phone numbers, flagging dead lines or disconnected hotlines automatically.
2. **Business Registry API Scraper:** Query state registry APIs (e.g., Secretary of State registries) to verify nonprofit and clinic credentials and mailing addresses.
3. **LLM Source Extraction:** Deploy local LLM scraper tasks to extract direct special education departments and contact info from school district website text dumps.
