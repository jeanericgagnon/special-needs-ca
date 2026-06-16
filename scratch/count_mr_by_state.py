import sqlite3

conn = sqlite3.connect("ca_disability_navigator.db")
cursor = conn.cursor()

tables = ["county_offices", "school_districts", "state_resource_agencies", "regional_education_agencies"]
states = ["california", "new-york", "ohio", "illinois", "georgia", "north-carolina", "michigan"]

print(f"| State | Table | Total | Manual Review | Fallback |")
print(f"|---|---|---|---|---|")

for state in states:
    for t in tables:
        # Determine how to filter by state
        if t in ("state_resource_agencies", "regional_education_agencies"):
            query = f"""
                SELECT COUNT(*), 
                       SUM(CASE WHEN verification_status = 'manual_review_required' THEN 1 ELSE 0 END),
                       SUM(CASE WHEN data_origin IN ('programmatic_fallback', 'generated_county_fallback') THEN 1 ELSE 0 END)
                FROM {t}
                WHERE state_id = ?
            """
            cursor.execute(query, (state,))
        else:
            query = f"""
                SELECT COUNT(*), 
                       SUM(CASE WHEN t.verification_status = 'manual_review_required' THEN 1 ELSE 0 END),
                       SUM(CASE WHEN t.data_origin IN ('programmatic_fallback', 'generated_county_fallback') THEN 1 ELSE 0 END)
                FROM {t} t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = ?
            """
            cursor.execute(query, (state,))
        
        tot, mr, fb = cursor.fetchone()
        tot = tot or 0
        mr = mr or 0
        fb = fb or 0
        if tot > 0:
            print(f"| {state} | {t} | {tot} | {mr} | {fb} |")

conn.close()
