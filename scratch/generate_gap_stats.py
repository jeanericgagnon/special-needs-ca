import sqlite3
import json

db_path = "ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get all states
cursor.execute("SELECT id, name, code FROM states ORDER BY id")
states = [dict(row) for row in cursor.fetchall()]

stats = {}

for state in states:
    s_id = state['id']
    s_name = state['name']
    s_code = state['code']
    
    # Counties count
    cursor.execute("SELECT COUNT(*) as cnt FROM counties WHERE state_id = ?", (s_id,))
    counties_cnt = cursor.fetchone()['cnt']
    
    stats[s_id] = {
        "name": s_name,
        "code": s_code,
        "counties_count": counties_cnt,
        "categories": {}
    }
    
    # We will query each of the key tables
    tables = {
        "benefits_hhs": {
            "query": """
                SELECT t.data_origin, t.verification_status, t.phone, t.email, t.website, t.source_url
                FROM county_offices t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = ?
            """,
            "is_county_table": True
        },
        "school_districts": {
            "query": """
                SELECT t.data_origin, t.verification_status, t.spec_ed_contact_phone as phone, t.spec_ed_contact_email as email, t.website, t.source_url
                FROM school_districts t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = ?
            """,
            "is_county_table": True
        },
        "dd_idd_waivers": {
            "query": """
                SELECT t.data_origin, t.verification_status, t.intake_phone as phone, t.early_intervention_contact as email, t.website, t.source_url
                FROM state_resource_agencies t
                WHERE t.state_id = ?
            """,
            "is_county_table": False
        },
        "regional_education": {
            "query": """
                SELECT t.data_origin, t.verification_status, '' as phone, '' as email, t.website, t.source_url
                FROM regional_education_agencies t
                WHERE t.state_id = ?
            """,
            "is_county_table": False
        },
        "nonprofit_organizations": {
            "query": """
                SELECT t.data_origin, t.verification_status, t.phone, '' as email, t.website, t.source_url
                FROM nonprofit_organizations t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = ?
            """,
            "is_county_table": True
        },
        "iep_advocates": {
            "query": """
                SELECT DISTINCT t.data_origin, t.verification_status, t.phone, t.email, t.website, t.source_url
                FROM iep_advocates t
                JOIN iep_advocate_counties j ON t.id = j.iep_advocate_id
                JOIN counties c ON j.county_id = c.id
                WHERE c.state_id = ?
            """,
            "is_county_table": True
        }
    }
    
    for cat_name, info in tables.items():
        cursor.execute(info['query'], (s_id,))
        rows = [dict(row) for row in cursor.fetchall()]
        
        total = len(rows)
        verified = 0
        manual_review = 0
        fallback = 0
        missing_source = 0
        directory_routed = 0
        local_contact_verified = 0
        
        for r in rows:
            origin = r['data_origin']
            status = (r['verification_status'] or '').lower().strip()
            phone = r['phone']
            email = r['email']
            website = r['website']
            source = r['source_url']
            
            # Check fallback
            is_fallback = origin in ('programmatic_fallback', 'generated_county_fallback')
            if is_fallback:
                fallback += 1
                
            # Check verified
            is_verified = status in ('verified', 'official_verified', 'human_verified')
            if is_verified:
                verified += 1
                
            # Check manual review
            if status == 'manual_review_required':
                manual_review += 1
                
            # Check missing source
            if not source or source.strip() == '':
                missing_source += 1
                
            # Check directory routed
            # (Usually defined as programmatic fallbacks or records where contact info is generic state-level)
            # In our case, let's treat fallback or manual review records as directory-routed if they don't have local contact verified
            is_local_contact = (phone and phone.strip() != '' and '555' not in phone) or (email and email.strip() != '')
            if is_local_contact and is_verified:
                local_contact_verified += 1
            else:
                directory_routed += 1
                
        # Service area confidence
        # California regional centers: 100% confidence. Others: if fallbacks are high, confidence is low.
        if total == 0:
            srv_conf = "0%"
            usefulness = "Poor"
        elif fallback / total > 0.5 or manual_review / total > 0.5:
            srv_conf = "Low (40-60%)"
            usefulness = "Thin Boilerplate"
        elif verified / total > 0.8:
            srv_conf = "High (90-100%)"
            usefulness = "Actionable Local Detail"
        else:
            srv_conf = "Medium (60-80%)"
            usefulness = "Useful State-Level"
            
        stats[s_id]["categories"][cat_name] = {
            "total_count": total,
            "verified_count": verified,
            "manual_review_required_count": manual_review,
            "fallback_count": fallback,
            "missing_source_count": missing_source,
            "directory_routed_count": directory_routed,
            "local_contact_verified_count": local_contact_verified,
            "service_area_confidence": srv_conf,
            "frontend_usefulness": usefulness
        }

print("Stats generated successfully!")
with open("scratch/gap_matrix_stats.json", "w") as f:
    json.dump(stats, f, indent=2)

conn.close()
