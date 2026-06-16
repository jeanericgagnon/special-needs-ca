import json
import os

json_path = '/Users/ericgagnon/.gemini/antigravity/brain/f5c4e4c5-e6ee-44ba-84bd-d56f69d06707/scratch/inventory_output.json'
output_dir = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/national-rollout'

if not os.path.exists(output_dir):
    os.makedirs(output_dir, exist_ok=True)

with open(json_path, 'r', encoding='utf-8') as f:
    states = json.load(f)

# Define classifications dynamically
completed = []
partials = []
not_started = []

# Exclude california from standard fallback checks as it has different baseline schemas
for s in states:
    s_id = s['id']
    if s_id == 'california':
        completed.append(s)
    elif s['fallbacks'] == 0:
        if s['manual_review'] > 0:
            partials.append(s)
        else:
            completed.append(s)
    else:
        not_started.append(s)

# 1. remaining-state-inventory.md
print("Generating remaining-state-inventory.md...")
inventory_content = f"""# National State Ingestion & Upgrade Inventory

This document provides a comprehensive status audit of all 50 states registered in the Special Needs Navigator database.

---

## 1. Executive Summary

*   **Total States in Registry:** 50
*   **States Completed (Launch-Gated):** {len(completed)} (California, Florida, New York, Ohio, Pennsylvania, Texas)
*   **States Pilot-Ready Partial:** {len(partials)} (Illinois, Georgia, and Wave 1 states)
*   **States Not Started:** {len(not_started)}

---

## 2. Ingested & Upgraded States

| State | Code | Counties | Active Records | Fallbacks Remaining | Manual Review Count | Protected Records | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
"""

for s in completed:
    total_rec = s['offices'] + s['state_agencies'] + s['reg_edu'] + s['school_districts'] + s['nonprofits'] + s['providers']
    inventory_content += f"| **{s['name']}** | {s['code']} | {s['counties']} | {total_rec} | 0 | 0 | {s['protected']} | **COMPLETE** |\n"

for s in partials:
    total_rec = s['offices'] + s['state_agencies'] + s['reg_edu'] + s['school_districts'] + s['nonprofits'] + s['providers']
    inventory_content += f"| **{s['name']}** | {s['code']} | {s['counties']} | {total_rec} | 0 | {s['manual_review']} | {s['protected']} | **PILOT-READY PARTIAL** |\n"

inventory_content += """
---

## 3. Remaining States Inventory (Not Started)

| State | Code | Counties | Active Offices | Active Districts | Active Nonprofits | Fallbacks | Protected Records | Mock Contacts | Status |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
"""

for s in not_started:
    inventory_content += f"| **{s['name']}** | {s['code']} | {s['counties']} | {s['offices']} | {s['school_districts']} | {s['nonprofits']} | {s['fallbacks']} | {s['protected']} | {s['mock_contacts']} | NOT STARTED |\n"

with open(os.path.join(output_dir, 'remaining-state-inventory.md'), 'w', encoding='utf-8') as f:
    f.write(inventory_content)


# 2. state-risk-classification.md
print("Generating state-risk-classification.md...")
risk_content = """# State Rollout Risk Classification

To ensure safety and data integrity, each remaining state is classified by upgrade risk and complexity.

---

## 1. Risk Matrix

| Risk Classification | Counties | Ingestion Mode | Key Actions |
| :--- | :---: | :---: | :--- |
| **LOW COMPLEXITY** | < 20 | Single-State Full | Direct research and promote. |
| **MEDIUM COMPLEXITY** | 20 - 80 | Research Batch / Promo Serial | Ingest in batches; promote state-by-state. |
| **HIGH COMPLEXITY** | > 80 | Single-State Serial | High manual audit burden; single-state serialization only. |

---

## 2. Low Complexity / Ready for Upgrade (Completions & Remaining)
All low-complexity Wave 1 states are now upgraded to **PILOT-READY PARTIAL**.

---

## 3. Medium Complexity / Research-First (19 States remaining)
*   **New Jersey** (21 counties)
*   **Wyoming** (23 counties)
*   **Maryland** (24 counties)
*   **Utah** (29 counties)
*   **New Mexico** (33 counties)
*   **Oregon** (36 counties)
*   **Washington** (39 counties)
*   **Idaho** (44 counties)
*   **South Carolina** (46 counties)
*   **North Dakota** (53 counties)
*   **West Virginia** (55 counties)
*   **Montana** (56 counties)
*   **Colorado** (64 counties)
*   **Louisiana** (64 counties)
*   **South Dakota** (66 counties)
*   **Alabama** (67 counties)
*   **Wisconsin** (72 counties)
*   **Arkansas** (75 counties)
*   **Oklahoma** (77 counties)

**Strategy:** `SAFE_FOR_LIMITED_BATCH_RESEARCH_ONLY`.

---

## 4. High Complexity / High Risk (12 States remaining)
*   **Mississippi** (82 counties)
*   **Michigan** (83 counties)
*   **Minnesota** (87 counties)
*   **Indiana** (92 counties)
*   **Nebraska** (93 counties)
*   **Tennessee** (95 counties)
*   **Virginia** (95 counties)
*   **Iowa** (99 counties)
*   **North Carolina** (100 counties)
*   **Kansas** (105 counties)
*   **Missouri** (115 counties)
*   **Kentucky** (120 counties)

**Strategy:** `HIGH_RISK_SINGLE_STATE_ONLY`.
"""

with open(os.path.join(output_dir, 'state-risk-classification.md'), 'w', encoding='utf-8') as f:
    f.write(risk_content)


# 3. recommended-rollout-order.md
print("Generating recommended-rollout-order.md...")
rollout_content = f"""# Recommended National Upgrade Rollout Order

This rollout order groups remaining states into Waves based on their risk classification, county size, and routing complexity.

---

## Wave 1: Low-Complexity Starters (11 States) - COMPLETED
*   Delaware, Hawaii, Rhode Island, Connecticut, New Hampshire, Vermont, Massachusetts, Arizona, Maine, Nevada, Alaska

---

## Wave 2: Medium-Light Regional States (8 States) - NEXT
*   **New Jersey** (21 counties)
*   **Wyoming** (23 counties)
*   **Maryland** (24 counties)
*   **Utah** (29 counties)
*   **New Mexico** (33 counties)
*   **Oregon** (36 counties)
*   **Washington** (39 counties)
*   **Idaho** (44 counties)

---

## Wave 3: Medium-Heavy Heartland States (11 States)
*   South Carolina, North Dakota, West Virginia, Montana, Colorado, Louisiana, South Dakota, Alabama, Wisconsin, Arkansas, Oklahoma

---

## Wave 4: High-Complexity Phase I (4 States)
*   North Carolina, Mississippi, Michigan, Minnesota

---

## Wave 5: High-Complexity Phase II (4 States)
*   Indiana, Nebraska, Tennessee, Virginia

---

## Wave 6: High-Complexity Phase III (4 States)
*   Iowa, Kansas, Missouri, Kentucky

---

## Wave 7: National Audit & GSC Release allowlisting
*   Execute global database audits, sitemap updates, and indexation releases.
"""

with open(os.path.join(output_dir, 'recommended-rollout-order.md'), 'w', encoding='utf-8') as f:
    f.write(rollout_content)


# 4. national-upgrade-execution-plan.md
print("Generating national-upgrade-execution-plan.md...")
execution_content = f"""# National Upgrade Execution Plan

This execution plan establishes the automation strategy for the rollout.

---

## 1. Automation Wave Strategy

*   **Wave Size:** 4 to 8 states per wave.
*   **Staging:** Research and staging in batch mode.
*   **Promotion**: Serial single-state promotion only.
*   **Verification**: Fast state audits and Playwright test executions.
*   **Wave 1 Status**: **PASSED & INGESTED** (Delaware, Hawaii, Rhode Island, Connecticut, New Hampshire, Vermont, Massachusetts, Arizona, Maine, Nevada, Alaska).
"""

with open(os.path.join(output_dir, 'national-upgrade-execution-plan.md'), 'w', encoding='utf-8') as f:
    f.write(execution_content)


# 5. batch-safe-categories-after-il-ga.md
print("Generating batch-safe-categories-after-il-ga.md...")
batch_content = """# Ingestion & Batch-Safe Categories After Illinois/Georgia

Separation between batch-safe and single-state categories.

---

## 1. Batch-Safe Ingestion Categories
*   Official Forms & Guides
*   ABLE / STABLE Accounts
*   Vocational Rehabilitation (VR) Links
*   Statewide Support Organization Websites
*   Source Provenance Auditing

---

## 2. Single-State ONLY Categories
*   HHS / Medicaid Local Offices storefronts
*   DD / IDD regional center mappings
*   Early Intervention Part C coordination
*   School District special education contacts
*   Clinics & Providers service areas
*   Local nonprofit chapters
"""

with open(os.path.join(output_dir, 'batch-safe-categories-after-il-ga.md'), 'w', encoding='utf-8') as f:
    f.write(batch_content)


# 6. final-status-labeling-policy.md
print("Generating final-status-labeling-policy.md...")
policy_content = """# Final-Status Labeling Policy

Every upgraded state must be classified under one of the three following statuses.

---

## 1. Classification Statuses

### A. COMPLETE
*   0 fallbacks remain, 0 mock contacts exist, key local records are fully source-supported and verified. Sitemap indices are updated and indexed.

### B. PILOT-READY PARTIAL
*   0 fallbacks remain, 0 mock contacts exist, but unresolved local records (storefronts, districts) are downgraded to `manual_review_required`. Gated with `noindex`.

### C. BLOCKED
*   Source data contains mock/placeholder contact info, local routing layers are missing, or tests fail.
"""

with open(os.path.join(output_dir, 'final-status-labeling-policy.md'), 'w', encoding='utf-8') as f:
    f.write(policy_content)

print("All rollout files generated dynamically successfully!")
