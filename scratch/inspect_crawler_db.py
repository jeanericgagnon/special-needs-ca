import sqlite3

conn = sqlite3.connect("ca_disability_crawler.db")
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print("=== TABLES IN CRAWLER DB ===")
for t in tables:
    print(t[0])
    # Print schema
    cursor.execute(f"PRAGMA table_info({t[0]})")
    for col in cursor.fetchall():
        print(f"  Col: {col[1]} ({col[2]})")

conn.close()
