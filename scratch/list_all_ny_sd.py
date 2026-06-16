import sqlite3

conn = sqlite3.connect("ca_disability_navigator.db")
cursor = conn.cursor()

cursor.execute("""
    SELECT sd.id, sd.name, sd.spec_ed_contact_phone, sd.verification_status, sd.data_origin
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = 'new-york'
""")
rows = cursor.fetchall()
print(f"Total NY school districts: {len(rows)}")
for r in rows:
    print(r)

conn.close()
