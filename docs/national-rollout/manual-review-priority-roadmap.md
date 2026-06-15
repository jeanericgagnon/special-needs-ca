# Manual Review Priority Roadmap

This roadmap details the priorities, completed repair tasks, and next steps to resolve the national manual-review queues and transition states from **PILOT-READY PARTIAL** to true **COMPLETE** (California Gold Standard equivalence).

---

## 1. Completed Repair Sprint Summary (June 2026)

We have successfully executed the first coordinated recovery sprint:
* **New York (NY):** Verified 12 local LDSS offices and 10 BOCES school districts. Seeded 5 trusted nonprofits. Manual review rate reduced to **16.95%**.
* **Ohio (OH):** Verified 6 major school districts. Seeded 3 trusted nonprofits. Manual review rate reduced to **33.60%**.
* **Illinois (IL):** Verified 8 major school districts. Manual review rate remains at **15.27%**.
* **Georgia (GA):** Verified 27 local DFCS offices and 27 school districts. Manual review rate reduced to **39.52%** (clearing the 40% unblock gate).
* **Wave 2 Pilot Verification (NC & MI):** Verified 10 local county offices, high-population school districts, statewide routing, and 3 nonprofits each.

---

## 2. Next Priority Repair Tasks by State

Now that the initial Wave 1/2 recovery is complete, the roadmap shifts to lowering manual-review rates to the launch-grade **5.0% threshold** and upgrading the rest of Wave 2:

### 2.1 Illinois (IL) - Priority 1 (Quick Win / Close to Launch-Grade)
* **Goal:** Verify remaining 89 school districts to drop manual review below 5.0%.
* **Tasks:** Crawl and replace unverified special education contact details.
* **Effort:** **LOW-MEDIUM**
  - Records to verify: 89.
  - Manual review hours: ~4 hours.
  - Automation potential: High.

### 2.2 New York (NY) - Priority 2 (Launch Candidate)
* **Goal:** Verify remaining 40 school districts to drop manual review below 5.0%.
* **Tasks:** Harvest direct special education contacts for the remaining districts.
* **Effort:** **MEDIUM**
  - Records to verify: 40.
  - Manual review hours: ~3 hours.
  - Automation potential: High.

### 2.3 Ohio (OH) - Priority 3 (Launch Candidate)
* **Goal:** Verify remaining 166 school districts.
* **Tasks:** Harvest direct special education/student services contacts.
* **Effort:** **MEDIUM**
  - Records to verify: 166.
  - Manual review hours: ~8 hours.
  - Automation potential: High.

### 2.4 North Carolina & Michigan - Priority 4 (Launch Candidates)
* **Goal:** Verify remaining county offices and school districts to drop manual review below 5.0%.
* **Tasks:** Scrape local county DSS/DHHS and school district exception directories.
* **Effort:** **MEDIUM-HIGH**
  - Records to verify: ~150 per state.
  - Manual review hours: ~10 hours per state.

### 2.5 Remaining Wave 2 Pilot States - Priority 5 (New Jersey, Virginia, Washington, Arizona, etc.)
* **Goal:** Upgrade remaining Wave 2 states (New Jersey, Virginia, Washington, Arizona, Massachusetts, Colorado, Tennessee, Indiana) to verified pilot status.
* **Tasks:** Verify county DSS/Medicaid offices, high-population school districts, and seed trusted nonprofits.
* **Effort:** **HIGH**
  - Records to verify per state: ~100-250.
  - Manual review hours: ~8 hours per state.

---

## 3. National Effort Summary & Resource Allocation

| Priority | State / Group | Actionable Tasks | Records Needing Verification | Est. Manual Hours | Automation Helper? | Human Review Required? |
|:---:|:---|:---|:---:|:---:|:---:|:---:|
| **1** | Illinois (IL) | Verify 89 school districts | 89 | 4 | Yes (Scraper) | Yes (Spot-check) |
| **2** | New York (NY) | Verify 40 school districts | 40 | 3 | Yes (Scraper) | Yes (Spot-check) |
| **3** | Ohio (OH) | Verify 166 school districts | 166 | 8 | Yes (Scraper) | Yes (Spot-check) |
| **4** | NC & MI | Verify local DSS/DHHS & districts | ~300 | 20 | Yes (Scraper) | Yes (Spot-check) |
| **5** | Rest of Wave 2 | Upgrade 8 states to pilot level | ~1,200 | 60 | Yes (Scrapers) | Yes (Spot-check) |
| **6** | Wave 3/4 States | Full crawl, parse, and verify | ~3,500 | ~150 | Yes (Scrapers) | Yes (Spot-check) |

---

## 4. Recommended Workflow for Sprint Execution

1. **Automated Crawling Phase:** Run custom Playwright crawlers for Illinois, New York, and Ohio education board portals to fetch Special Ed director phone lines and email addresses.
2. **Database Seed Phase:** Insert trusted nonprofit records into `nonprofit_organizations` for Wave 2 states.
3. **Manual Audit & Spot-Checking:** Submit the scraped records to the human review queue, prioritizing county offices first.
4. **Gating Release:** Once a state's manual review rate drops below **5.0%** and verified-depth score exceeds **80.0%**, lift the `noindex` gate and add it to the sitemap allowlist.
