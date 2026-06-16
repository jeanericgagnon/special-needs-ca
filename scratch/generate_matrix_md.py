import json

with open("scratch/gap_matrix_stats.json") as f:
    stats = json.load(f)

with open("scratch/equivalence_scores_v2.json") as f:
    scores = json.load(f)

# Define honest status for each state
# CA: COMPLETE (Legacy Ex)
# TX, FL, PA: COMPLETE
# GA: BLOCKED
# IL, NY, OH: PILOT-READY PARTIAL (with details)
# Others: PILOT-READY PARTIAL

honest_statuses = {
    "california": "COMPLETE with legacy exception",
    "texas": "COMPLETE",
    "florida": "COMPLETE",
    "pennsylvania": "COMPLETE",
    "georgia": "BLOCKED",
    "illinois": "PILOT-READY PARTIAL",
    "new-york": "PILOT-READY PARTIAL",
    "ohio": "PILOT-READY PARTIAL",
}

md_content = """# State-by-State Gap Matrix

This document provides a comprehensive state-by-state quality matrix comparing all states against California. The new **California-Equivalence Score** is stricter than previous audits:
- **100%** = California-level local verified depth
- **80% - 99%** = Strong verified state, near release quality
- **60% - 79%** = Pilot-ready but missing local verified depth
- **40% - 59%** = Broad structure exists but too much manual/directory routing
- **Below 40%** = Not useful enough for release

---

## 1. National Summary Matrix

| State | Honest Status | CA-Equivalence Score | Counties | County Offices | School Districts | DD/IDD Waiver Routing | Regional Ed | Nonprofits | IEP Advocates |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
"""

for s_id in sorted(stats.keys()):
    s = stats[s_id]
    score_info = scores[s_id]
    
    # Determine honest status
    if s_id in honest_statuses:
        status = honest_statuses[s_id]
    else:
        # Default for other partial states
        status = "PILOT-READY PARTIAL"
        
    md_content += f"| **{s['name']}** | {status} | **{score_info['score']:.1f}%** | {s['counties_count']} | {s['categories']['benefits_hhs']['total_count']} | {s['categories']['school_districts']['total_count']} | {s['categories']['dd_idd_waivers']['total_count']} | {s['categories']['regional_education']['total_count']} | {s['categories']['nonprofit_organizations']['total_count']} | {s['categories']['iep_advocates']['total_count']} |\n"

md_content += """
---

## 2. Detailed Gap by Category for Key States

For each state, we report category counts in the format: **Total / Verified / Manual Review / Fallbacks**.

### 2.1 California (90.0%) - Gold Standard (with Legacy Exceptions)
* **Benefits/HHS:** 174 / 0 / 0 / 0 (174 unverified directory-routed county contacts, needs local cleanup)
* **School Districts:** 80 / 0 / 0 / 40 (40 fallback records, needs verification of direct special ed contacts)
* **DD/IDD Waivers:** 21 / 21 / 0 / 0 (100% verified regional centers with catchment mapping)
* **Regional Education:** 62 / 0 / 0 / 37 (37 fallbacks, needs direct SELPA contacts)
* **Nonprofit Organizations:** 77 / 0 / 0 / 42 (42 fallbacks, needs local nonprofit seeding)
* **IEP Advocates:** 580 / 0 / 0 / 0 (580 unverified directory advocates)
* **Gaps:** Needs direct local phone number verification for county offices and school districts.

### 2.2 Texas (59.6%) - Complete
* **Benefits/HHS:** 254 / 0 / 0 / 0 (All 254 county offices verified as source-listed, but no local human verification)
* **School Districts:** 264 / 0 / 0 / 0 (All 264 school districts source-listed)
* **DD/IDD Waivers:** 78 / 0 / 0 / 0 (78 LIDDAs mapped, source-listed)
* **Regional Education:** 20 / 0 / 0 / 0 (20 education service centers source-listed)
* **Nonprofit Organizations:** 2,129 / 0 / 0 / 0 (2,129 nonprofits source-listed)
* **IEP Advocates:** 814 / 0 / 0 / 0 (814 advocates source-listed)
* **Gaps:** Lacks deep local county-specific DD waiver intake offices (uses 78 regional LIDDAs instead of county offices), and no human verification.

### 2.3 Florida (57.9%) - Complete
* **Benefits/HHS:** 69 / 0 / 0 / 0 (69 source-listed offices)
* **School Districts:** 67 / 0 / 1 / 0 (66 source-listed, 1 manual review)
* **DD/IDD Waivers:** 29 / 0 / 0 / 0 (29 APD offices mapped, source-listed)
* **Regional Education:** 19 / 0 / 0 / 0 (19 regional offices)
* **Nonprofit Organizations:** 235 / 0 / 0 / 0 (235 nonprofits)
* **IEP Advocates:** 177 / 0 / 0 / 0 (177 advocates)
* **Gaps:** Needs direct county-specific HHS office human verification and resolution of 1 manual-review school district.

### 2.4 Pennsylvania (62.8%) - Complete
* **Benefits/HHS:** 67 / 0 / 0 / 0 (67 source-listed CAOs)
* **School Districts:** 67 / 0 / 0 / 0 (67 source-listed districts)
* **DD/IDD Waivers:** 105 / 0 / 0 / 0 (105 county offices)
* **Regional Education:** 37 / 0 / 0 / 0 (37 intermediate units)
* **Nonprofit Organizations:** 8 / 0 / 0 / 0 (8 nonprofits - extremely low nonprofit coverage compared to CA/TX)
* **IEP Advocates:** 150 / 0 / 0 / 0 (150 advocates)
* **Gaps:** Extremely thin nonprofit listings (only 8, compared to California's 77 and Texas's 2,129). Needs seeding of parent advocacy groups.

### 2.5 Georgia (50.7%) - Blocked
* **Benefits/HHS:** 159 / 0 / 148 / 0 (148 in manual review, missing local contacts)
* **School Districts:** 159 / 0 / 148 / 0 (148 in manual review, missing direct special ed contacts)
* **DD/IDD Waivers:** 7 / 0 / 0 / 0 (7 APD regions, state-level routing)
* **Regional Education:** 5 / 0 / 0 / 0 (5 RESAs)
* **Nonprofit Organizations:** 338 / 0 / 0 / 0 (338 unverified nonprofits)
* **IEP Advocates:** 340 / 0 / 0 / 0 (340 unverified advocates)
* **Gaps:** Massive manual review queue of 296 records blocks the frontend. Needs manual contact lookup for 148 county HHS offices and 148 school districts.

### 2.6 Illinois (57.3%) - Gated (Pilot-Ready Partial)
* **Benefits/HHS:** 102 / 0 / 0 / 0 (102 source-listed offices)
* **School Districts:** 102 / 0 / 89 / 0 (89 in manual review, missing special ed contacts)
* **DD/IDD Waivers:** 40 / 0 / 0 / 0 (40 ISC offices mapped)
* **Regional Education:** 33 / 0 / 0 / 0 (33 intermediate agencies)
* **Nonprofit Organizations:** 306 / 0 / 0 / 0 (306 nonprofits)
* **IEP Advocates:** 224 / 0 / 0 / 0 (224 advocates)
* **Gaps:** Gated due to 89 school districts in manual review. Requires direct special education contact harvesting.

### 2.7 New York (54.0%) - Gated (Pilot-Ready Partial)
* **Benefits/HHS:** 62 / 0 / 12 / 0 (12 LDSS offices in manual review)
* **School Districts:** 62 / 0 / 50 / 0 (50 in manual review, missing special ed contacts)
* **DD/IDD Waivers:** 69 / 0 / 0 / 0 (69 OPWDD offices mapped)
* **Regional Education:** 38 / 0 / 0 / 0 (38 BOCES mapped)
* **Nonprofit Organizations:** 0 / 0 / 0 / 0 (0 nonprofits - complete category completeness gap)
* **IEP Advocates:** 148 / 0 / 0 / 0 (148 advocates)
* **Gaps:** Lacks any nonprofit listings (0), and has 62 total records in manual review.

### 2.8 Ohio (52.4%) - Gated (Pilot-Ready Partial)
* **Benefits/HHS:** 88 / 0 / 0 / 0 (88 CDJFS offices mapped)
* **School Districts:** 176 / 0 / 166 / 0 (166 in manual review after mock phone scrub)
* **DD/IDD Waivers:** 176 / 0 / 0 / 0 (176 county board offices mapped)
* **Regional Education:** 51 / 0 / 0 / 0 (51 intermediate agencies)
* **Nonprofit Organizations:** 0 / 0 / 0 / 0 (0 nonprofits - complete category completeness gap)
* **IEP Advocates:** 190 / 0 / 0 / 0 (190 advocates)
* **Gaps:** Lacks nonprofit listings (0) and has 166 school districts in manual review.

---

## 3. General Gap Summary for Remaining 42 States

All other 42 states score exactly **36.0%**:
* **County Offices & School Districts:** 100% in `manual_review_required` status. They represent structural shells with county records mapped but no verified contacts.
* **DD/IDD Routing:** 2 statewide agencies per state, both in manual review.
* **Regional Education:** 1 statewide agency, unverified.
* **Nonprofits:** 3x the county count, all unverified.
* **IEP Advocates:** Approximately 2x the county count, all unverified.
* **Rollout Recommendation:** Keep gated until Wave-based crawling, sorting, and manual verification are applied.
"""

with open("docs/national-rollout/state-by-state-gap-matrix.md", "w") as f:
    f.write(md_content)

print("Matrix generated successfully!")
