import sqlite3

db_path = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

for state_id in ['california', 'texas', 'arizona']:
    print(f"\n=== Programs for {state_id.upper()} ===")
    cursor.execute("SELECT id, name, category, official_source_url FROM programs WHERE state_id = ?", (state_id,))
    for pid, name, cat, url in cursor.fetchall():
        print(f" - [{pid}] {name} ({cat}) -> {url}")

conn.close()
