# National Release-Quality Repair Program Report

This document details the execution and results of the National Release-Quality Repair Program, which resolved critical quality gaps across California (legacy cleanup), Wave 1 recovery states (New York, Ohio, Illinois, Georgia), and Wave 2 candidate states (North Carolina, Michigan).

---

## 1. Executive Summary

The National Release-Quality Repair Program was designed to move our gated pilot states towards launch readiness and address quality exceptions (such as mock contacts, missing local contacts, and legacy fallbacks) in our baseline gold standard state (California).

All 7 target states were repaired successfully. Major outcomes include:
1. **0 active mock (`555`) contacts** across all target states.
2. **Georgia unblocked** by verifying 27 county DFCS offices and 27 school districts, dropping the manual-review rate from 44.31% to **39.52%** (below the 40% unblock gate).
3. **California legacy cleanup** completed by clearing 40 school districts, 43 placeholder nonprofits, and 580 IEP advocates of `555` mock contacts, and downgrading 37 regional SELPA fallbacks to manual review.
4. **Wave 2 verification candidates** (North Carolina and Michigan) upgraded with verified local benefits, early intervention, and school district contacts, raising their verified-depth scores to **79.4%** and **79.6%** respectively.
5. **Corrections to scoring logic** verified and synced across both database replicas.

---

## 2. State Repair Logs

### Order 1: New York Recovery
- **LDSS Medicaid Offices:** Verified 12 local county offices (Albany, Erie, Monroe, Nassau, Onondaga, Suffolk, Westchester, and all 5 NYC boroughs) with official websites and phone numbers.
- **School Districts:** Verified 10 regional BOCES districts with direct special education phone lines.
- **Seeded Nonprofits:** Inserted 5 trusted nonprofits: Disability Rights New York, Parent Network of WNY, INCLUDEnyc, Starbridge, and The Arc New York.
- **Resulting Metrics:** Manual-Review Rate: **16.95%** (down from 26.84%), Verified-Depth Score: **74.9%**.

### Order 2: Ohio Recovery
- **School Districts:** Verified 6 major school districts (Columbus City, Cleveland Metropolitan, Cincinnati Public, Toledo Public, Akron Public, Dayton Public) with direct student services phone lines.
- **Seeded Nonprofits:** Inserted 3 trusted nonprofits: Disability Rights Ohio, The Arc of Ohio, and Ohio Coalition for the Education of Children with Disabilities.
- **Resulting Metrics:** Manual-Review Rate: **33.60%** (down from 33.81%), Verified-Depth Score: **72.8%**.

### Order 3: Illinois Recovery
- **School Districts:** Verified 8 major school districts (DuPage, Lake, Will, Kane, Winnebago, Sangamon, Peoria, Champaign) with direct student services contacts.
- **Resulting Metrics:** Manual-Review Rate: **15.27%**, Verified-Depth Score: **76.0%**.

### Order 4: California Legacy Cleanup
- **Mocks Scrubbed:** Removed `555` mock numbers from 40 school districts and 580 IEP advocates. Deleted 43 placeholder nonprofits with mock numbers.
- **Legacy Fallbacks:** Downgraded 37 regional education fallbacks (`selpa-gen-*`) to `manual_review_required` to prevent misleading rendering on public routes.
- **Resulting Metrics:** Manual-Review Rate: **10.78%**, Verified-Depth Score: **76.2%**.

### Order 5: Georgia Unblock Sprint
- **DFCS Medicaid Offices:** Verified 27 local DFCS county offices with official websites and phone numbers.
- **School Districts:** Verified 27 school districts with direct special education contacts.
- **Resulting Metrics:** Manual-Review Rate: **39.52%** (down from 44.31%, unblocked), Verified-Depth Score: **74.2%**.

### Order 6: North Carolina Wave 2 Verification
- **County DSS Offices:** Verified 10 county DSS offices with official directories.
- **School Districts:** Verified 4 major school districts (Wake County, Charlotte-Mecklenburg, Guilford County, Winston-Salem/Forsyth County).
- **Statewide Agencies:** Updated LME/MCO system intake (`nc-dd-agency`), CDSA Early Intervention (`nc-ei-agency`), and NCDPI regional education (`nc-ed-agency`).
- **Seeded Nonprofits:** Updated 3 trusted nonprofits: Disability Rights North Carolina, The Arc of North Carolina, and First In Families of North Carolina.
- **Resulting Metrics:** Manual-Review Rate: **36.98%**, Verified-Depth Score: **79.4%**.

### Order 7: Michigan Wave 2 Verification
- **County DHHS Offices:** Verified 10 county DHHS offices with official directories.
- **School Districts:** Verified 5 major school districts (Detroit Public Schools, Utica Community Schools, Ann Arbor Public Schools, Oakland Schools, Grand Rapids Public Schools).
- **Statewide Agencies:** Updated CMHSP DD services (`mi-dd-agency`), Early On Part C Early Intervention (`mi-ei-agency`), and MDE regional education (`mi-ed-agency`).
- **Seeded Nonprofits:** Updated 3 trusted nonprofits: Disability Rights Michigan, The Arc of Michigan, and Michigan Alliance for Families.
- **Resulting Metrics:** Manual-Review Rate: **36.12%**, Verified-Depth Score: **79.6%**.

---

## 3. National Score and Status Ledger

Following this repair program, our state status ledger has been updated as follows:

| State | Status | Mocks | Fallbacks | Manual-Review Rate | Verified-Depth Score |
|:---|:---|:---:|:---:|:---:|:---:|
| **Texas** | READY_FOR_ALLOWLIST | 0 | 0 | 0.00% | 78.9% |
| **Florida** | READY_FOR_ALLOWLIST | 0 | 0 | 0.24% | 79.0% |
| **Pennsylvania** | READY_FOR_ALLOWLIST | 0 | 0 | 0.00% | 72.9% |
| **California** | KEEP_GATED (Legacy Ex) | 0 | 77 | 10.78% | 76.2% |
| **Illinois** | KEEP_GATED | 0 | 0 | 15.27% | 76.0% |
| **New York** | KEEP_GATED | 0 | 0 | 16.95% | 74.9% |
| **Ohio** | KEEP_GATED | 0 | 0 | 33.60% | 72.8% |
| **Georgia** | KEEP_GATED | 0 | 0 | 39.52% | 74.2% |
| **North Carolina** | KEEP_GATED | 0 | 0 | 36.98% | 79.4% |
| **Michigan** | KEEP_GATED | 0 | 0 | 36.12% | 79.6% |

---

## 4. Release Recommendations

1. **Batch 1 Public Release (TX, FL, PA):** Maintain sitemap allowlisting only for Texas, Florida, and Pennsylvania. They are the only states that have manual review rates below 5% and 0 fallbacks/mocks.
2. **Batch 2 Candidate Selection (NY, IL, NC, MI):** We recommend New York, Illinois, North Carolina, and Michigan as the next batch of release candidates. While they remain gated (`noindex`), their verified-depth scores are high (74.9% to 79.6%) and their manual-review backlogs can be targeted in a subsequent local verification sprint to reduce them below the 5% allowlist threshold.
