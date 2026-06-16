import sqlite3

conn = sqlite3.connect("ca_disability_navigator.db")
cursor = conn.cursor()

cursor.execute("""
    SELECT co.id, c.name, co.office_name, co.phone, co.address
    FROM county_offices co
    JOIN counties c ON co.county_id = c.id
    WHERE c.state_id = 'new-york' AND co.verification_status = 'manual_review_required'
""")
rows = cursor.fetchall()
for r in rows:
    print(r)

conn.close()
