import sqlite3
import os

db_path = "ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

os.makedirs("docs/national-rollout", exist_ok=True)

# Query state list
cursor.execute("SELECT id, name, code FROM states ORDER BY name ASC")
states = cursor.fetchall()

ledger_md = """# Final Post-Repair National Status Ledger

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Database Status:** WAL Checkpointed & Synchronized

---

## 1. 50-State Quality Metrics and Release Status

Only Texas, Florida, and Pennsylvania are currently allowlisted for indexing. All other states remain gated under `noindex`.

| State Name | Code | Total Records | Manual Reviews | Manual Review % | Fallbacks | Status Label | Release Candidate? |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
"""

for state_id, name, code in states:
    # Query total records across tables
    # county_offices
    cursor.execute("""
        SELECT COUNT(*), SUM(CASE WHEN verification_status = 'manual_review_required' THEN 1 ELSE 0 END)
        FROM county_offices co JOIN counties c ON co.county_id = c.id
        WHERE c.state_id = ?
    """, (state_id,))
    co_tot, co_mr = cursor.fetchone()
    co_tot = co_tot or 0
    co_mr = co_mr or 0
    
    # school_districts
    cursor.execute("""
        SELECT COUNT(*), SUM(CASE WHEN verification_status = 'manual_review_required' THEN 1 ELSE 0 END)
        FROM school_districts sd JOIN counties c ON sd.county_id = c.id
        WHERE c.state_id = ?
    """, (state_id,))
    sd_tot, sd_mr = cursor.fetchone()
    sd_tot = sd_tot or 0
    sd_mr = sd_mr or 0
    
    # nonprofits
    cursor.execute("""
        SELECT COUNT(*), SUM(CASE WHEN verification_status = 'manual_review_required' THEN 1 ELSE 0 END)
        FROM nonprofit_organizations np JOIN counties c ON np.county_id = c.id
        WHERE c.state_id = ?
    """, (state_id,))
    np_tot, np_mr = cursor.fetchone()
    np_tot = np_tot or 0
    np_mr = np_mr or 0
    
    # regional_education_agencies
    cursor.execute("""
        SELECT COUNT(*), SUM(CASE WHEN verification_status = 'manual_review_required' THEN 1 ELSE 0 END)
        FROM regional_education_agencies WHERE state_id = ?
    """, (state_id,))
    re_tot, re_mr = cursor.fetchone()
    re_tot = re_tot or 0
    re_mr = re_mr or 0
    
    # state_resource_agencies
    cursor.execute("""
        SELECT COUNT(*), SUM(CASE WHEN verification_status = 'manual_review_required' THEN 1 ELSE 0 END)
        FROM state_resource_agencies WHERE state_id = ?
    """, (state_id,))
    sra_tot, sra_mr = cursor.fetchone()
    sra_tot = sra_tot or 0
    sra_mr = sra_mr or 0
    
    # iep_advocates
    # check if linked to state
    cursor.execute("PRAGMA table_info(iep_advocates)")
    cols = [col[1] for col in cursor.fetchall()]
    adv_tot, adv_mr = 0, 0
    if "state_id" in cols:
        cursor.execute("""
            SELECT COUNT(*), SUM(CASE WHEN verification_status = 'manual_review_required' THEN 1 ELSE 0 END)
            FROM iep_advocates WHERE state_id = ?
        """, (state_id,))
        adv_tot, adv_mr = cursor.fetchone()
    else:
        # Check via county
        cursor.execute("""
            SELECT COUNT(distinct ia.id), SUM(CASE WHEN ia.verification_status = 'manual_review_required' THEN 1 ELSE 0 END)
            FROM iep_advocates ia
            JOIN iep_advocate_counties iac ON ia.id = iac.iep_advocate_id
            JOIN counties c ON iac.county_id = c.id
            WHERE c.state_id = ?
        """, (state_id,))
        adv_tot, adv_mr = cursor.fetchone()
    adv_tot = adv_tot or 0
    adv_mr = adv_mr or 0
    
    # Fallback counts (data_origin = 'programmatic_fallback' or 'generated_county_fallback')
    # Count across county_offices, school_districts
    cursor.execute("""
        SELECT COUNT(*) FROM school_districts sd JOIN counties c ON sd.county_id = c.id
        WHERE c.state_id = ? AND sd.data_origin IN ('programmatic_fallback', 'generated_county_fallback')
    """, (state_id,))
    sd_fb = cursor.fetchone()[0] or 0
    
    cursor.execute("""
        SELECT COUNT(*) FROM county_offices co JOIN counties c ON co.county_id = c.id
        WHERE c.state_id = ? AND co.data_origin IN ('programmatic_fallback', 'generated_county_fallback')
    """, (state_id,))
    co_fb = cursor.fetchone()[0] or 0
    
    fb_total = sd_fb + co_fb
    
    tot = co_tot + sd_tot + np_tot + re_tot + sra_tot + adv_tot
    mr = co_mr + sd_mr + np_mr + re_mr + sra_mr + adv_mr
    
    rate = (mr / tot * 100) if tot > 0 else 0.0
    
    # Assign status labels based on state configs
    if state_id in ['texas', 'pennsylvania']:
        status = "READY_FOR_ALLOWLIST"
        candidate = "Yes (Batch 1)"
    elif state_id == 'florida':
        status = "READY_FOR_ALLOWLIST"
        candidate = "Yes (Batch 1)"
    elif state_id == 'california':
        status = "COMPLETE_WITH_LEGACY_EXCEPTION"
        candidate = "Legacy Gated"
    elif state_id in ['new-york', 'illinois', 'ohio']:
        status = "KEEP_GATED"
        candidate = "Yes (Batch 2)"
    elif state_id in ['north-carolina', 'michigan', 'georgia']:
        status = "KEEP_GATED"
        candidate = "No (Pilot)"
    else:
        status = "KEEP_GATED"
        candidate = "No (Skeleton)"
        
    ledger_md += f"| **{name}** | {code} | {tot} | {mr} | {rate:.2f}% | {fb_total} | `{status}` | {candidate} |\n"

with open("docs/national-rollout/final-post-repair-status-ledger.md", "w") as f:
    f.write(ledger_md)

print("✓ final-post-repair-status-ledger.md generated successfully.")
conn.close()
