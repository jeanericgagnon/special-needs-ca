import sqlite3

db_path = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get list of states
cursor.execute("SELECT id, name FROM states ORDER BY name")
states = cursor.fetchall()

print(f"{'State':<20} | {'Programs':<8} | {'County Offices':<14} | {'School Districts':<16} | {'Nonprofits':<10} | {'Advocates':<9}")
print("-" * 90)

for state_id, state_name in states:
    cursor.execute("SELECT count(*) FROM programs WHERE state_id = ?", (state_id,))
    programs = cursor.fetchone()[0]
    
    cursor.execute("SELECT count(*) FROM county_offices WHERE county_id IN (SELECT id FROM counties WHERE state_id = ?)", (state_id,))
    offices = cursor.fetchone()[0]
    
    cursor.execute("SELECT count(*) FROM school_districts WHERE county_id IN (SELECT id FROM counties WHERE state_id = ?)", (state_id,))
    districts = cursor.fetchone()[0]
    
    cursor.execute("SELECT count(*) FROM nonprofit_organizations WHERE county_id IN (SELECT id FROM counties WHERE state_id = ?)", (state_id,))
    nonprofits = cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT count(distinct a.id) FROM iep_advocates a
        JOIN iep_advocate_counties ac ON a.id = ac.iep_advocate_id
        JOIN counties c ON ac.county_id = c.id
        WHERE c.state_id = ?
    """, (state_id,))
    advocates = cursor.fetchone()[0]
    
    print(f"{state_name:<20} | {programs:<8} | {offices:<14} | {districts:<16} | {nonprofits:<10} | {advocates:<9}")

conn.close()
