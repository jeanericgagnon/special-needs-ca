import sqlite3

db_path = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Inspect iep_advocates table columns
cursor.execute("PRAGMA table_info(iep_advocates)")
print("iep_advocates columns:")
for col in cursor.fetchall():
    print(f" - {col[1]} ({col[2]})")

# Inspect iep_advocate_counties table columns
cursor.execute("PRAGMA table_info(iep_advocate_counties)")
print("\niep_advocate_counties columns:")
for col in cursor.fetchall():
    print(f" - {col[1]} ({col[2]})")

# Let's count records in both tables
cursor.execute("SELECT count(*) FROM iep_advocates")
print(f"\nTotal advocates: {cursor.fetchone()[0]}")

cursor.execute("SELECT count(*) FROM iep_advocate_counties")
print(f"Total advocate-county associations: {cursor.fetchone()[0]}")

# Let's see how many advocates serve California vs other states
cursor.execute("""
    SELECT count(distinct a.id) FROM iep_advocates a
    JOIN iep_advocate_counties ac ON a.id = ac.iep_advocate_id
    JOIN counties c ON ac.county_id = c.id
    WHERE c.state_id = 'california'
""")
print(f"Advocates serving California: {cursor.fetchone()[0]}")

# Let's see some example states in counties table
cursor.execute("SELECT DISTINCT state_id FROM counties")
print("States in counties table:", [r[0] for r in cursor.fetchall()])

conn.close()
