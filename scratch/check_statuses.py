import sqlite3

conn = sqlite3.connect("ca_disability_navigator.db")
cursor = conn.cursor()

tables = ["county_offices", "school_districts", "state_resource_agencies", "regional_education_agencies", "nonprofit_organizations", "iep_advocates"]

for t in tables:
    print(f"=== {t} ===")
    if t in ("state_resource_agencies", "regional_education_agencies"):
        cursor.execute(f"SELECT state_id, verification_status, COUNT(*) FROM {t} GROUP BY state_id, verification_status")
    elif t == "iep_advocates":
        cursor.execute(f"SELECT c.state_id, t.verification_status, COUNT(*) FROM iep_advocates t JOIN iep_advocate_counties j ON t.id = j.iep_advocate_id JOIN counties c ON j.county_id = c.id GROUP BY c.state_id, t.verification_status")
    else:
        cursor.execute(f"SELECT c.state_id, t.verification_status, COUNT(*) FROM {t} t JOIN counties c ON t.county_id = c.id GROUP BY c.state_id, t.verification_status")
    
    for row in cursor.fetchall():
        print(row)

conn.close()
