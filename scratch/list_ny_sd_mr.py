import sqlite3

conn = sqlite3.connect("ca_disability_navigator.db")
cursor = conn.cursor()

cursor.execute("""
    SELECT sd.id, sd.name, sd.spec_ed_contact_phone, sd.verification_status, sd.data_origin
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = 'new-york' AND sd.verification_status = 'manual_review_required'
""")
rows = cursor.fetchall()
print(f"Count of NY school districts in manual review: {len(rows)}")
for r in rows:
    print(r)

conn.close()
