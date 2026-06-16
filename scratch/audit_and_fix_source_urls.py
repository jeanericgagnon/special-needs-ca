import sqlite3

db_path = "ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Query county offices, school districts, regional centers, etc. for TX, FL, PA
queries = {
    "county_offices": """
        SELECT co.id, co.office_name, co.source_url, c.state_id
        FROM county_offices co
        JOIN counties c ON co.county_id = c.id
        WHERE c.state_id IN ('texas', 'florida', 'pennsylvania')
    """,
    "school_districts": """
        SELECT sd.id, sd.name, sd.source_url, c.state_id
        FROM school_districts sd
        JOIN counties c ON sd.county_id = c.id
        WHERE c.state_id IN ('texas', 'florida', 'pennsylvania')
    """,
    "nonprofit_organizations": """
        SELECT np.id, np.name, np.source_url, c.state_id
        FROM nonprofit_organizations np
        JOIN counties c ON np.county_id = c.id
        WHERE c.state_id IN ('texas', 'florida', 'pennsylvania')
    """,
    "regional_education_agencies": """
        SELECT re.id, re.name, re.source_url, re.state_id
        FROM regional_education_agencies re
        WHERE re.state_id IN ('texas', 'florida', 'pennsylvania')
    """
}

generic_domains = [
    "texas.gov", "hhs.texas.gov", "dshs.texas.gov", "tea.texas.gov",
    "myflfamilies.com", "myflorida.com", "fldoe.org", "apd.myflorida.com",
    "pa.gov", "dhs.pa.gov", "education.pa.gov"
]

total_audited = 0
generic_links = []

for table, query in queries.items():
    cursor.execute(query)
    rows = cursor.fetchall()
    for row_id, name, source_url, state_id in rows:
        total_audited += 1
        if not source_url:
            generic_links.append((table, row_id, name, state_id, "NULL"))
            continue
        
        is_generic = False
        url_lower = source_url.lower().strip()
        clean_url = url_lower.replace("https://", "").replace("http://", "").replace("www.", "").strip("/")
        
        if clean_url in generic_domains or clean_url + "/" in [d + "/" for d in generic_domains]:
            is_generic = True
        elif clean_url.count("/") == 0:
            is_generic = True
            
        if is_generic:
            generic_links.append((table, row_id, name, state_id, source_url))

print(f"Total Audited Links: {total_audited}")
print(f"Generic/Homepage Links Found: {len(generic_links)}")

# Perform updates
cursor.execute("""
    UPDATE regional_education_agencies
    SET source_url = 'https://www.education.pa.gov/K-12/Special%20Education/Pages/default.aspx'
    WHERE state_id = 'pennsylvania' AND (source_url LIKE '%education.pa.gov' OR source_url LIKE '%education.pa.gov/')
""")
if cursor.rowcount > 0:
    print(f"Updated {cursor.rowcount} PA regional education agencies to specific Special Ed page.")

cursor.execute("""
    UPDATE county_offices
    SET source_url = 'https://www.myflfamilies.com/services/public-assistance'
    WHERE id LIKE 'off-%-fl-medicaid' AND (source_url = 'https://www.myflfamilies.com' OR source_url = 'https://www.myflfamilies.com/')
""")
if cursor.rowcount > 0:
    print(f"Updated {cursor.rowcount} FL Medicaid county offices to specific Public Assistance page.")

cursor.execute("""
    UPDATE county_offices
    SET source_url = 'https://www.hhs.texas.gov/services/health/medicaid-chip'
    WHERE id LIKE 'off-%-tx-medicaid' AND (source_url = 'https://hhs.texas.gov' OR source_url = 'https://hhs.texas.gov/')
""")
if cursor.rowcount > 0:
    print(f"Updated {cursor.rowcount} TX Medicaid offices to health/medicaid-chip page.")

# Commit changes
conn.commit()
print("✓ Committed transaction.")

# Checkpoint WAL
conn.execute("PRAGMA wal_checkpoint(TRUNCATE);")
conn.close()
print("✓ Checkpoint completed and database closed.")
