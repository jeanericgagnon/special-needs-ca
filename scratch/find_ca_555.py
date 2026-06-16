import sqlite3

conn = sqlite3.connect("ca_disability_navigator.db")
cursor = conn.cursor()

tables = ["county_offices", "school_districts", "state_resource_agencies", "regional_education_agencies", "nonprofit_organizations", "iep_advocates"]

for t in tables:
    if t == "iep_advocates":
        cursor.execute("""
            SELECT COUNT(*) FROM iep_advocates t
            JOIN iep_advocate_counties j ON t.id = j.iep_advocate_id
            JOIN counties c ON j.county_id = c.id
            WHERE c.state_id = 'california' AND t.phone LIKE '%555%'
        """)
    elif t in ("state_resource_agencies", "regional_education_agencies"):
        cursor.execute(f"SELECT COUNT(*) FROM {t} WHERE state_id = 'california' AND (website LIKE '%555%' OR website LIKE '%example.com%' OR website LIKE '%test%')")
    else:
        phone_col = "spec_ed_contact_phone" if t == "school_districts" else "phone"
        cursor.execute(f"""
            SELECT COUNT(*) FROM {t} t
            JOIN counties c ON t.county_id = c.id
            WHERE c.state_id = 'california' AND t.{phone_col} LIKE '%555%'
        """)
    count = cursor.fetchone()[0]
    print(f"Table {t} CA 555 counts: {count}")

# Let's list some specific examples of CA school districts with programmatic_fallback
print("\n=== CA SCHOOL DISTRICTS FALLBACKS ===")
cursor.execute("""
    SELECT sd.id, sd.name, sd.spec_ed_contact_phone, sd.website, sd.data_origin
    FROM school_districts sd
    JOIN counties c ON sd.county_id = c.id
    WHERE c.state_id = 'california' AND sd.data_origin = 'programmatic_fallback'
    LIMIT 10
""")
for r in cursor.fetchall():
    print(r)

# Let's list some specific examples of CA nonprofits with programmatic_fallback
print("\n=== CA NONPROFITS FALLBACKS ===")
cursor.execute("""
    SELECT no.id, no.name, no.phone, no.website, no.data_origin
    FROM nonprofit_organizations no
    JOIN counties c ON no.county_id = c.id
    WHERE c.state_id = 'california' AND no.data_origin = 'programmatic_fallback'
    LIMIT 10
""")
for r in cursor.fetchall():
    print(r)

conn.close()
