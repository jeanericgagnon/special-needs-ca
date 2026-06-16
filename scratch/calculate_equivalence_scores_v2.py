import sqlite3
import json

db_path = "ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get all states
cursor.execute("SELECT id, name, code FROM states ORDER BY id")
states = [dict(row) for row in cursor.fetchall()]

# Read sitemap allowlist
sitemap_path = "frontend/src/app/sitemaps/counties.xml/route.ts"
non_ca_verified = []
try:
    with open(sitemap_path) as f:
        content = f.read()
        import re
        match = re.search(r"NON_CA_VERIFIED_COUNTIES\s*=\s*\[([\s\S]*?)\]", content)
        if match:
            non_ca_verified = [s.strip().replace("'", "").replace('"', '').replace(",", "") for s in match.group(1).split() if s.strip()]
except Exception as e:
    print("Sitemap read error:", e)

scores = {}

for state in states:
    s_id = state['id']
    s_name = state['name']
    s_code = state['code']
    
    # Counties
    cursor.execute("SELECT id FROM counties WHERE state_id = ?", (s_id,))
    counties = [row['id'] for row in cursor.fetchall()]
    n_counties = len(counties)
    
    # 1. Local Routing Depth (25 pts)
    cursor.execute("SELECT data_origin, verification_status, counties_served FROM state_resource_agencies WHERE state_id = ?", (s_id,))
    dd_agencies = [dict(r) for r in cursor.fetchall()]
    cursor.execute("SELECT data_origin, verification_status, counties_served FROM regional_education_agencies WHERE state_id = ?", (s_id,))
    ed_agencies = [dict(r) for r in cursor.fetchall()]
    
    dd_score = 0
    if len(dd_agencies) > 2: # More than just statewide fallback
        dd_w_sum = 0
        for a in dd_agencies:
            status = (a['verification_status'] or '').lower().strip()
            is_fallback = a['data_origin'] in ('programmatic_fallback', 'generated_county_fallback')
            w = 0.0
            if not is_fallback:
                if status in ('verified', 'official_verified', 'human_verified'):
                    w = 1.0
                elif status in ('source_listed', 'pending_review'):
                    w = 0.5
            dd_w_sum += w
        dd_score = (dd_w_sum / len(dd_agencies)) * 50
    elif len(dd_agencies) > 0:
        dd_score = 10
        
    ed_score = 0
    if len(ed_agencies) > 1:
        ed_w_sum = 0
        for a in ed_agencies:
            status = (a['verification_status'] or '').lower().strip()
            is_fallback = a['data_origin'] in ('programmatic_fallback', 'generated_county_fallback')
            w = 0.0
            if not is_fallback:
                if status in ('verified', 'official_verified', 'human_verified'):
                    w = 1.0
                elif status in ('source_listed', 'pending_review'):
                    w = 0.5
            ed_w_sum += w
        ed_score = (ed_w_sum / len(ed_agencies)) * 50
    elif len(ed_agencies) > 0:
        ed_score = 10
        
    local_routing_pts = dd_score + ed_score # max 100
    
    # 2. Record Quality (25 pts)
    cursor.execute("""
        SELECT t.verification_status, t.phone, t.email, t.website, t.source_url, t.data_origin
        FROM county_offices t JOIN counties c ON t.county_id = c.id WHERE c.state_id = ?
    """, (s_id,))
    offices = [dict(r) for r in cursor.fetchall()]
    
    cursor.execute("""
        SELECT t.verification_status, t.spec_ed_contact_phone as phone, t.spec_ed_contact_email as email, t.website, t.source_url, t.data_origin
        FROM school_districts t JOIN counties c ON t.county_id = c.id WHERE c.state_id = ?
    """, (s_id,))
    districts = [dict(r) for r in cursor.fetchall()]
    
    total_records = len(offices) + len(districts)
    weighted_sum = 0
    
    for r in offices + districts:
        status = (r['verification_status'] or '').lower().strip()
        is_fallback = r['data_origin'] in ('programmatic_fallback', 'generated_county_fallback')
        has_contact = (r['phone'] and r['phone'].strip() != '' and '555' not in r['phone']) or (r['email'] and r['email'].strip() != '')
        has_source = r['source_url'] and r['source_url'].strip() != ''
        
        w = 0.0
        if not is_fallback and has_contact and has_source:
            if status in ('verified', 'official_verified', 'human_verified'):
                w = 1.0
            elif status in ('source_listed', 'pending_review'):
                w = 0.5
                
        weighted_sum += w
            
    record_quality_pts = (weighted_sum / max(total_records, 1)) * 100
    
    # 3. Category Completeness (25 pts)
    cursor.execute("SELECT COUNT(*) as cnt FROM nonprofit_organizations t JOIN counties c ON t.county_id = c.id WHERE c.state_id = ?", (s_id,))
    np_cnt = cursor.fetchone()['cnt']
    
    cursor.execute("""
        SELECT COUNT(DISTINCT t.id) as cnt FROM iep_advocates t 
        JOIN iep_advocate_counties j ON t.id = j.iep_advocate_id 
        JOIN counties c ON j.county_id = c.id WHERE c.state_id = ?
    """, (s_id,))
    adv_cnt = cursor.fetchone()['cnt']
    
    cat_completeness_pts = 0
    if len(offices) > 0: cat_completeness_pts += 20
    if len(districts) > 0: cat_completeness_pts += 20
    if len(dd_agencies) > 0: cat_completeness_pts += 20
    if len(ed_agencies) > 0: cat_completeness_pts += 20
    if np_cnt > 0: cat_completeness_pts += 10
    if adv_cnt > 0: cat_completeness_pts += 10
    
    # 4. Service-Area Modeling (15 pts)
    service_area_pts = 0
    if s_id == 'california':
        service_area_pts = 100
    elif len(dd_agencies) > 2 and not any(a['data_origin'] in ('programmatic_fallback', 'generated_county_fallback') for a in dd_agencies):
        service_area_pts = 85
    elif len(dd_agencies) > 0:
        service_area_pts = 40
        
    # 5. SEO Readiness (10 pts)
    seo_pts = 0
    allowlisted_counties = sum(1 for c in counties if c in non_ca_verified)
    if s_id == 'california':
        seo_pts = 100
    else:
        seo_pts = (allowlisted_counties / max(n_counties, 1)) * 100
        
    # Weighted score
    weighted_score = (
        (local_routing_pts * 0.25) +
        (record_quality_pts * 0.25) +
        (cat_completeness_pts * 0.25) +
        (service_area_pts * 0.15) +
        (seo_pts * 0.10)
    )
    
    # Let's adjust CA score to reflect its legacy exception status
    if s_id == 'california':
        weighted_score = 90.0 # Legacy exception cap
        
    scores[s_id] = {
        "name": s_name,
        "code": s_code,
        "score": weighted_score,
        "local_routing_pts": local_routing_pts,
        "record_quality_pts": record_quality_pts,
        "cat_completeness_pts": cat_completeness_pts,
        "service_area_pts": service_area_pts,
        "seo_pts": seo_pts
    }

# Print sorted scores
sorted_scores = sorted(scores.items(), key=lambda x: x[1]['score'], reverse=True)
print("| State | Code | California-Equivalence score | Local Routing | Record Quality | Category Comp | Service Area | SEO pts |")
print("|---|---|---|---|---|---|---|---|")
for s_id, s_info in sorted_scores:
    print(f"| {s_info['name']} | {s_info['code']} | {s_info['score']:.1f}% | {s_info['local_routing_pts']:.1f}% | {s_info['record_quality_pts']:.1f}% | {s_info['cat_completeness_pts']:.1f}% | {s_info['service_area_pts']:.1f}% | {s_info['seo_pts']:.1f}% |")

with open("scratch/equivalence_scores_v2.json", "w") as f:
    json.dump(scores, f, indent=2)

conn.close()
