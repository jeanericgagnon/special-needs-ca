import sqlite3

conn = sqlite3.connect("ca_disability_navigator.db")
cursor = conn.cursor()

# Check New York county offices in manual review
print("=== NY COUNTY OFFICES ===")
cursor.execute("""
    SELECT co.id, co.office_name, co.phone, co.website, co.verification_status, co.data_origin
    FROM county_offices co
    JOIN counties c ON co.county_id = c.id
    WHERE c.state_id = 'new-york'
""")
rows = cursor.fetchall()
print(f"Total NY County Offices: {len(rows)}")
for r in rows[:15]:
    print(r)

# Check New York school districts in manual review
print("\n=== NY SCHOOL DISTRICTS ===")
cursor.execute("""
    SELECT sd.id, sd.name, sd.spec_ed_contact_phone, sd.website, sd.verification_status, sd.data_origin
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = 'new-york'
""")
rows = cursor.fetchall()
print(f"Total NY School Districts: {len(rows)}")
for r in rows[:15]:
    print(r)

conn.close()
