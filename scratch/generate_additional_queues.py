import sqlite3
import os

db_path = "ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

os.makedirs("docs/national-rollout", exist_ok=True)

# 1. dd-ei-routing-review-queue.md
print("Generating dd-ei-routing-review-queue.md...")
cursor.execute("""
    SELECT sra.id, sra.name, sra.state_id, sra.source_url
    FROM state_resource_agencies sra
    WHERE sra.verification_status = 'manual_review_required'
    LIMIT 50
""")
sra_rows = cursor.fetchall()

sra_md = """# DD/IDD and EI Routing Review Queue (Top 50)

This queue lists the state resource agencies responsible for developmental disability (DD/IDD) waiver intake and Early Intervention (EI) coordination that currently lack direct, human-verified intake details.

| State | Agency Name | Record ID | Search Link | Est. Time | Phone Call Needed? |
| :--- | :--- | :--- | :--- | :---: | :---: |
"""

for rid, name, state, source_url in sra_rows:
    search_url = source_url if source_url else f"https://www.google.com/search?q={name.replace(' ', '+')}+{state}+intake"
    sra_md += f"| {state.upper()} | {name} | `{rid}` | [Search Link]({search_url}) | 5 mins | Yes |\n"

with open("docs/national-rollout/dd-ei-routing-review-queue.md", "w", encoding="utf-8") as f:
    f.write(sra_md)

# 2. clinic-verification-queue.md
print("Generating clinic-verification-queue.md...")
cursor.execute("""
    SELECT rp.id, rp.name, c.name, c.state_id, rp.source_url
    FROM resource_providers rp
    JOIN counties c ON rp.county_id = c.id
    WHERE rp.verification_status = 'manual_review_required'
    LIMIT 50
""")
rp_rows = cursor.fetchall()

rp_md = """# Clinic and Provider Verification Queue (Top 50)

This queue lists the special needs clinical providers, occupational/speech therapists, and behavioral health clinics that are currently unverified in the database.

| State | County | Clinic/Provider Name | Record ID | Search Link | Est. Time | Phone Call Needed? |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
"""

for rid, name, county, state, source_url in rp_rows:
    search_url = source_url if source_url else f"https://www.google.com/search?q={name.replace(' ', '+')}+{county}+{state}"
    rp_md += f"| {state.upper()} | {county} | {name} | `{rid}` | [Search Link]({search_url}) | 4 mins | Yes |\n"

with open("docs/national-rollout/clinic-verification-queue.md", "w", encoding="utf-8") as f:
    f.write(rp_md)

print("✓ Additional queue files generated successfully.")
conn.close()
