import sqlite3

db_path = "ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all states
cursor.execute("SELECT id, name, code FROM states ORDER BY name ASC")
states = cursor.fetchall()

print(f"{'State':<20} | {'Counties':<8} | {'Offices':<8} | {'Districts':<9} | {'Nonprofits':<10} | {'Advocates':<9} | {'Fallbacks':<9} | {'MR':<5}")
print("-" * 95)

for s_id, s_name, s_code in states:
    # Counties
    cursor.execute("SELECT COUNT(*) FROM counties WHERE state_id = ?", (s_id,))
    counties_cnt = cursor.fetchone()[0]
    
    # Offices
    cursor.execute("""
        SELECT COUNT(*) FROM county_offices co 
        JOIN counties c ON co.county_id = c.id 
        WHERE c.state_id = ?
    """, (s_id,))
    offices_cnt = cursor.fetchone()[0]
    
    # School Districts
    cursor.execute("""
        SELECT COUNT(*) FROM school_districts sd 
        JOIN counties c ON sd.county_id = c.id 
        WHERE c.state_id = ?
    """, (s_id,))
    districts_cnt = cursor.fetchone()[0]
    
    # Nonprofits
    cursor.execute("""
        SELECT COUNT(*) FROM nonprofit_organizations no 
        JOIN counties c ON no.county_id = c.id 
        WHERE c.state_id = ?
    """, (s_id,))
    nonprofits_cnt = cursor.fetchone()[0]
    
    # Advocates
    cursor.execute("""
        SELECT COUNT(DISTINCT iep.id) FROM iep_advocates iep
        JOIN iep_advocate_counties iepc ON iep.id = iepc.iep_advocate_id
        JOIN counties c ON iepc.county_id = c.id
        WHERE c.state_id = ?
    """, (s_id,))
    advocates_cnt = cursor.fetchone()[0]
    
    # Fallbacks in offices & districts
    cursor.execute("""
        SELECT COUNT(*) FROM county_offices co 
        JOIN counties c ON co.county_id = c.id 
        WHERE c.state_id = ? AND co.data_origin IN ('programmatic_fallback', 'generated_county_fallback')
    """, (s_id,))
    fallback_co = cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT COUNT(*) FROM school_districts sd 
        JOIN counties c ON sd.county_id = c.id 
        WHERE c.state_id = ? AND sd.data_origin IN ('programmatic_fallback', 'generated_county_fallback')
    """, (s_id,))
    fallback_sd = cursor.fetchone()[0]
    
    fallbacks_cnt = fallback_co + fallback_sd
    
    # Manual review counts in offices, districts & nonprofits
    cursor.execute("""
        SELECT COUNT(*) FROM county_offices co 
        JOIN counties c ON co.county_id = c.id 
        WHERE c.state_id = ? AND co.verification_status = 'manual_review_required'
    """, (s_id,))
    mr_co = cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT COUNT(*) FROM school_districts sd 
        JOIN counties c ON sd.county_id = c.id 
        WHERE c.state_id = ? AND sd.verification_status = 'manual_review_required'
    """, (s_id,))
    mr_sd = cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT COUNT(*) FROM nonprofit_organizations no 
        JOIN counties c ON no.county_id = c.id 
        WHERE c.state_id = ? AND no.verification_status = 'manual_review_required'
    """, (s_id,))
    mr_no = cursor.fetchone()[0]
    
    mr_cnt = mr_co + mr_sd + mr_no
    
    if counties_cnt > 0 or offices_cnt > 0 or districts_cnt > 0 or nonprofits_cnt > 0 or advocates_cnt > 0:
        print(f"{s_name:<20} | {counties_cnt:<8} | {offices_cnt:<8} | {districts_cnt:<9} | {nonprofits_cnt:<10} | {advocates_cnt:<9} | {fallbacks_cnt:<9} | {mr_cnt:<5}")

conn.close()
