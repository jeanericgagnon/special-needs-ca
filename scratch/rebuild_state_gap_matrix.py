import sqlite3
import os

db_root = "ca_disability_navigator.db"
conn = sqlite3.connect(db_root)
cursor = conn.cursor()

# Get all states
cursor.execute("SELECT id, name, code FROM states ORDER BY name ASC")
states = cursor.fetchall()

report_lines = [
    "# State-by-State Gap Matrix (v5)",
    "",
    "**Date:** June 15, 2026  ",
    "**Auditor:** Antigravity (AI Coding Assistant)  ",
    "**Status:** **AUTHORITATIVE**",
    "",
    "This matrix maps out the verified records, manual review burdens, and data quality gap status for all 50 states.",
    "",
    "---",
    "",
    "## 1. 50-State Ingestion & Curation Matrix",
    "",
    "| State Name | Code | Total DB Records | Manual Reviews | Manual Review Rate | Status Classification |",
    "| :--- | :---: | :---: | :---: | :---: | :--- |"
]

# Order states so TX, CA, FL, PA are at the top, or just order by state name, or order by manual review rate?
# Let's keep the priority ones at the top: Texas, California, Florida, Pennsylvania, Georgia, Illinois, New York, Ohio, and then alphabetical order for others.
priority_states = ['texas', 'california', 'florida', 'pennsylvania', 'georgia', 'illinois', 'new-york', 'ohio']
priority_rows = []
other_rows = []

for state_id, state_name, state_code in states:
    # Total DB Records (county_offices, school_districts, nonprofit_organizations)
    cursor.execute("""
        SELECT COUNT(*) FROM county_offices t JOIN counties c ON t.county_id = c.id WHERE c.state_id = ?
    """, (state_id,))
    co_count = cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT COUNT(*) FROM school_districts t JOIN counties c ON t.county_id = c.id WHERE c.state_id = ?
    """, (state_id,))
    sd_count = cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT COUNT(*) FROM nonprofit_organizations t JOIN counties c ON t.county_id = c.id WHERE c.state_id = ?
    """, (state_id,))
    np_count = cursor.fetchone()[0]
    
    total_db_records = co_count + sd_count + np_count
    
    # Manual Reviews
    mr_count = 0
    for table in ['county_offices', 'school_districts', 'nonprofit_organizations']:
        cursor.execute(f"""
            SELECT COUNT(*) FROM {table} t JOIN counties c ON t.county_id = c.id 
            WHERE c.state_id = ? AND t.verification_status = 'manual_review_required'
        """, (state_id,))
        mr_count += cursor.fetchone()[0]
        
    cursor.execute("""
        SELECT COUNT(*) FROM regional_education_agencies WHERE state_id = ? AND verification_status = 'manual_review_required'
    """, (state_id,))
    mr_count += cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT COUNT(*) FROM state_resource_agencies WHERE state_id = ? AND verification_status = 'manual_review_required'
    """, (state_id,))
    mr_count += cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT COUNT(*) FROM iep_advocates t JOIN iep_advocate_counties j ON t.id = j.iep_advocate_id JOIN counties c ON j.county_id = c.id 
        WHERE c.state_id = ? AND t.verification_status = 'manual_review_required'
    """, (state_id,))
    mr_count += cursor.fetchone()[0]
    
    mr_rate = (mr_count / total_db_records * 100) if total_db_records > 0 else 0.0
    
    # Status Classification
    if state_id == 'california':
        status_class = "`COMPLETE_WITH_LEGACY_EXCEPTION` (Gated)"
    elif state_id in ['texas', 'florida', 'pennsylvania']:
        status_class = f"`READY_FOR_ALLOWLIST` (Batch 1, GSC Hold)"
    elif state_id in ['georgia', 'illinois', 'new-york', 'ohio']:
        status_class = "`KEEP_GATED` (Pilot)"
    else:
        status_class = "`KEEP_GATED` (Skeleton)"
        
    row_text = f"| **{state_name}** | {state_code.upper()} | {total_db_records} | {mr_count} | {mr_rate:.2f}% | {status_class} |"
    
    if state_id in priority_states:
        priority_rows.append((state_id, row_text))
    else:
        other_rows.append(row_text)

# Sort priority rows to match the priority_states order
priority_rows_sorted = sorted(priority_rows, key=lambda x: priority_states.index(x[0]))

for _, row_text in priority_rows_sorted:
    report_lines.append(row_text)
for row_text in other_rows:
    report_lines.append(row_text)

# Write file
out_path = "docs/national-rollout/state-by-state-gap-matrix-v5.md"
with open(out_path, "w", encoding="utf-8") as f:
    f.write("\n".join(report_lines))
    
print("✓ Rebuilt docs/national-rollout/state-by-state-gap-matrix-v5.md successfully.")
conn.close()
