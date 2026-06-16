import sqlite3
import os

db_path = "ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Make sure docs directory exists
os.makedirs("docs/national-rollout", exist_ok=True)

# -------------------------------------------------------------------------
# 1. Generate school-district-review-queue.md
# -------------------------------------------------------------------------
print("Generating school-district-review-queue.md...")
cursor.execute("""
    SELECT sd.id, sd.name, c.name, c.state_id, sd.source_url
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE sd.verification_status = 'manual_review_required'
    LIMIT 50
""")
sd_rows = cursor.fetchall()

sd_md = """# School District Manual Review Queue (Top 50)

This queue lists the high-priority school districts that currently have missing or unverified special education coordinator contact details.

| State | County | District Name | Record ID | Target Search Directory | Est. Time | Phone Needed? |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
"""

for rid, name, county, state, source_url in sd_rows:
    target_search = source_url if source_url else f"https://www.google.com/search?q={name.replace(' ', '+')}+{state}+special+education+contact"
    sd_md += f"| {state.upper()} | {county} | {name} | `{rid}` | [Search Link]({target_search}) | 3 mins | Yes |\n"

with open("docs/national-rollout/school-district-review-queue.md", "w") as f:
    f.write(sd_md)

# -------------------------------------------------------------------------
# 2. Generate county-office-review-queue.md
# -------------------------------------------------------------------------
print("Generating county-office-review-queue.md...")
cursor.execute("""
    SELECT co.id, co.office_name, c.name, c.state_id, co.source_url
    FROM county_offices co
    JOIN counties c ON co.county_id = c.id
    WHERE co.verification_status = 'manual_review_required'
    LIMIT 50
""")
co_rows = cursor.fetchall()

co_md = """# County Office Manual Review Queue (Top 50)

This queue lists the local Health and Human Services (HHS) or Medicaid offices that require direct localized contact details.

| State | County | Office Name | Record ID | Target Search Directory | Est. Time | Phone Needed? |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
"""

for rid, name, county, state, source_url in co_rows:
    target_search = source_url if source_url else f"https://www.google.com/search?q={name.replace(' ', '+')}+{state}+contact+number"
    co_md += f"| {state.upper()} | {county} | {name} | `{rid}` | [Search Link]({target_search}) | 4 mins | Yes |\n"

with open("docs/national-rollout/county-office-review-queue.md", "w") as f:
    f.write(co_md)

# -------------------------------------------------------------------------
# 3. Generate nonprofit-seeding-queue.md
# -------------------------------------------------------------------------
print("Generating nonprofit-seeding-queue.md...")
# Find counties with 0 nonprofits
cursor.execute("""
    SELECT c.id, c.name, c.state_id
    FROM counties c
    LEFT JOIN nonprofit_organizations np ON c.id = np.county_id
    GROUP BY c.id
    HAVING COUNT(np.id) = 0
    LIMIT 50
""")
np_rows = cursor.fetchall()

np_md = """# Nonprofit Seeding Queue (Top 50 Empty Counties)

These counties currently have 0 local nonprofit or support organizations mapped in the database.

| State | County Name | County ID | Recommended Seeding Target | Action Needed | Est. Time |
| :--- | :--- | :--- | :--- | :--- | :---: |
"""

for cid, name, state in np_rows:
    np_md += f"| {state.upper()} | {name} | `{cid}` | Look up The Arc or Parent Center chapters serving {state.upper()} | Seed 1 local chapter | 5 mins |\n"

with open("docs/national-rollout/nonprofit-seeding-queue.md", "w") as f:
    f.write(np_md)

# -------------------------------------------------------------------------
# 4. Generate manual-review-operating-system.md
# -------------------------------------------------------------------------
print("Generating manual-review-operating-system.md...")
cursor.execute("SELECT COUNT(*) FROM school_districts WHERE verification_status = 'manual_review_required'")
total_sd_mr = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM county_offices WHERE verification_status = 'manual_review_required'")
total_co_mr = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM nonprofit_organizations WHERE verification_status = 'manual_review_required'")
total_np_mr = cursor.fetchone()[0]

os_md = f"""# Manual Review Operating System

This document outlines the operational process and prioritization guidelines for running manual review curation sprints.

## 1. National Backlog Statistics

* **Total School Districts in Manual Review:** {total_sd_mr}
* **Total County Offices in Manual Review:** {total_co_mr}
* **Total Nonprofits in Manual Review:** {total_np_mr}

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
"""

with open("docs/national-rollout/manual-review-operating-system.md", "w") as f:
    f.write(os_md)

# -------------------------------------------------------------------------
# 5. Generate va-review-instructions.md
# -------------------------------------------------------------------------
print("Generating va-review-instructions.md...")
va_md = """# Virtual Assistant (VA) Review Instructions

These instructions are designed for remote researchers responsible for verifying contacts in the manual review queues.

---

## 📋 General Guidelines

1. **No Hotlines:** Do not use generic 1-800 state numbers for local office contacts. We need the physical local office phone line.
2. **No Placeholders:** If a contact is not available, leave the database field empty and set `verification_status = 'manual_review_required'`. Do not enter mock or fake numbers (e.g. `555` numbers).
3. **Official Sources Only:** All verified URLs must start with `.gov`, `.org`, or the official school district domain. Do not use commercial blogging or directories (e.g. Yelp, YellowPages) as sources.

---

## 🏫 Special Education / School Districts
* **Objective:** Find the name, email, and phone number of the Special Education Director or Student Services Coordinator.
* **Search Query:** `[School District Name] Special Education Contact` or `[School District Name] Student Services Coordinator`
* **Success Criteria:** direct phone extension or email address.

---

## 🏢 County Medicaid / HHS Offices
* **Objective:** Locate the physical county department office handling Medicaid intake or SNAP/welfare.
* **Search Query:** `[County Name] County DSS Medicaid intake` or `[County Name] Department of Social Services`
* **Success Criteria:** direct local phone line.
"""

with open("docs/national-rollout/va-review-instructions.md", "w") as f:
    f.write(va_md)

print("✓ All manual review OS documents generated successfully.")
conn.close()
