import sqlite3
import json

db_path = "ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get all states
cursor.execute("SELECT id, name, code FROM states ORDER BY id")
states = cursor.fetchall()

categories = [
    ("county_offices", "county_offices", "county_id"),
    ("school_districts", "school_districts", "county_id"),
    ("state_resource_agencies", "state_resource_agencies", "state_id"),
    ("regional_education_agencies", "regional_education_agencies", "state_id"),
    ("nonprofit_organizations", "nonprofit_organizations", "county_id"),
    ("iep_advocates", "iep_advocates", "counties_served") # iep_advocates maps to counties via junction table iep_advocate_counties
]

state_data = {}

for s_id, s_name, s_code in states:
    state_data[s_id] = {
        "name": s_name,
        "code": s_code,
        "counties": 0,
        "county_offices": {"total": 0, "fallback": 0, "manual_review": 0, "verified": 0, "unverified": 0},
        "school_districts": {"total": 0, "fallback": 0, "manual_review": 0, "verified": 0, "unverified": 0},
        "state_resource_agencies": {"total": 0, "fallback": 0, "manual_review": 0, "verified": 0, "unverified": 0},
        "regional_education_agencies": {"total": 0, "fallback": 0, "manual_review": 0, "verified": 0, "unverified": 0},
        "nonprofit_organizations": {"total": 0, "fallback": 0, "manual_review": 0, "verified": 0, "unverified": 0},
        "iep_advocates": {"total": 0, "fallback": 0, "manual_review": 0, "verified": 0, "unverified": 0},
    }

# Counties count
cursor.execute("SELECT state_id, COUNT(*) FROM counties GROUP BY state_id")
for s_id, count in cursor.fetchall():
    if s_id in state_data:
        state_data[s_id]["counties"] = count

# Helper to categorize records
def get_provenance_stats(table, state_id, is_county_table=True, junction_table=None):
    if junction_table:
        query = f"""
            SELECT t.data_origin, t.verification_status, t.phone, t.email, t.website, t.source_url
            FROM {table} t
            JOIN {junction_table} j ON t.id = j.iep_advocate_id
            JOIN counties c ON j.county_id = c.id
            WHERE c.state_id = ?
        """
        cursor.execute(query, (state_id,))
    elif is_county_table:
        if table == "school_districts":
            query = f"""
                SELECT t.data_origin, t.verification_status, t.spec_ed_contact_phone as phone, t.spec_ed_contact_email as email, t.website, t.source_url
                FROM {table} t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = ?
            """
        elif table == "nonprofit_organizations":
            query = f"""
                SELECT t.data_origin, t.verification_status, t.phone, '' as email, t.website, t.source_url
                FROM {table} t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = ?
            """
        else:
            query = f"""
                SELECT t.data_origin, t.verification_status, t.phone, t.email, t.website, t.source_url
                FROM {table} t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = ?
            """
        cursor.execute(query, (state_id,))
    else:
        query = f"""
            SELECT t.data_origin, t.verification_status, t.intake_phone, t.early_intervention_contact, t.website, t.source_url
            FROM {table} t
            WHERE t.state_id = ?
        """
        # Note: regional education agencies table has website, source_url, data_origin, verification_status, but no phone/email columns directly, let's adjust for it.
        if table == "regional_education_agencies":
            query = f"""
                SELECT t.data_origin, t.verification_status, '' as phone, '' as email, t.website, t.source_url
                FROM {table} t
                WHERE t.state_id = ?
            """
        cursor.execute(query, (state_id,))
    
    rows = cursor.fetchall()
    total = len(rows)
    fallback = 0
    manual_review = 0
    verified = 0
    unverified = 0
    
    for row in rows:
        origin = row[0]
        status = row[1]
        
        is_fallback = origin in ('programmatic_fallback', 'generated_county_fallback')
        if is_fallback:
            fallback += 1
        
        # Lowercase status for matching
        status_lower = (status or '').lower().strip()
        if status_lower == 'manual_review_required':
            manual_review += 1
        elif status_lower in ('verified', 'official_verified', 'human_verified'):
            verified += 1
        else:
            unverified += 1
            
    return {"total": total, "fallback": fallback, "manual_review": manual_review, "verified": verified, "unverified": unverified}

for s_id in state_data:
    state_data[s_id]["county_offices"] = get_provenance_stats("county_offices", s_id, is_county_table=True)
    state_data[s_id]["school_districts"] = get_provenance_stats("school_districts", s_id, is_county_table=True)
    state_data[s_id]["state_resource_agencies"] = get_provenance_stats("state_resource_agencies", s_id, is_county_table=False)
    state_data[s_id]["regional_education_agencies"] = get_provenance_stats("regional_education_agencies", s_id, is_county_table=False)
    state_data[s_id]["nonprofit_organizations"] = get_provenance_stats("nonprofit_organizations", s_id, is_county_table=True)
    state_data[s_id]["iep_advocates"] = get_provenance_stats("iep_advocates", s_id, is_county_table=True, junction_table="iep_advocate_counties")

# Print summary
print(json.dumps(state_data, indent=2))
conn.close()
