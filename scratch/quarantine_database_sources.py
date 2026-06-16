import sqlite3
import re
import os

db_path = "ca_disability_navigator.db"

def main():
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Fake domains patterns
    fake_patterns = [
        r'dhhs\.[a-z-]+\.gov',
        r'education\.[a-z-]+\.gov',
        r'www\.thearc[a-z-]+\.org',
        r'childrenshospital\.org',
        r'parentcenterhub\.org',
        r'copaa\.org',
        r'[a-z-]+-lidda\.tx\.gov'
    ]
    
    # Real official exceptions
    real_exceptions = [
        'dhhs.nh.gov', 'dhhs.ne.gov', 'dhhs.nv.gov',
        'education.pa.gov', 'education.ohio.gov', 'education.mn.gov',
        'education.vermont.gov', 'education.alaska.gov', 'education.ne.gov',
        'education.nh.gov', 'education.ky.gov', 'education.wv.gov',
        'education.wy.gov', 'thearctx.org'
    ]

    generic_homepages = [
        'texas.gov', 'hhs.texas.gov', 'dshs.texas.gov', 'tea.texas.gov',
        'myflfamilies.com', 'myflorida.com', 'fldoe.org', 'apd.myflorida.com',
        'pa.gov', 'dhs.pa.gov', 'education.pa.gov'
    ]

    tables_with_status = [
        'county_offices',
        'school_districts',
        'nonprofit_organizations',
        'iep_advocates',
        'regional_education_agencies'
    ]

    total_updated = 0
    quarantine_audit = []

    for t in tables_with_status:
        cursor.execute(f"PRAGMA table_info({t})")
        cols = [col[1] for col in cursor.fetchall()]
        
        # find URL and status columns
        url_cols = [c for c in cols if any(p in c for p in ['url', 'website', 'page', 'link'])]
        if 'verification_status' not in cols:
            continue
            
        for col in url_cols:
            cursor.execute(f"SELECT rowid, {col}, verification_status FROM {t} WHERE {col} IS NOT NULL AND {col} != ''")
            rows = cursor.fetchall()
            
            for row_id, url, status in rows:
                match = re.search(r'https?://([^/]+)', url)
                if not match:
                    continue
                domain = match.group(1).lower()
                
                is_fake = False
                reason = ""
                
                # Check fake patterns
                for pat in fake_patterns:
                    if re.search(pat, domain):
                        if domain not in real_exceptions:
                            is_fake = True
                            reason = f"Fake domain pattern matching '{pat}'"
                            break
                            
                # Check generic homepages
                if not is_fake:
                    for gh in generic_homepages:
                        if domain == gh or domain == "www." + gh:
                            is_fake = True
                            reason = "Generic homepage used as local proof"
                            break
                            
                if is_fake:
                    # Quarantine this record: set status to manual_review_required
                    if status != 'manual_review_required':
                        cursor.execute(f"UPDATE {t} SET verification_status = 'manual_review_required' WHERE rowid = ?", (row_id,))
                        total_updated += 1
                    quarantine_audit.append((t, col, row_id, url, reason))

    conn.commit()
    print(f"Total records updated to 'manual_review_required': {total_updated}")
    print(f"Total quarantined records checked: {len(quarantine_audit)}")
    
    # Write db quarantine audit file
    audit_file_path = "docs/national-rollout/db-source-url-quarantine-audit.md"
    os.makedirs(os.path.dirname(audit_file_path), exist_ok=True)
    
    with open(audit_file_path, "w", encoding="utf-8") as f:
        f.write("# Database Source URL Quarantine Audit\n\n")
        f.write(f"**Total Quarantined Records Found:** {len(quarantine_audit)}  \n")
        f.write(f"**Total Status Records Set to `manual_review_required`:** {total_updated}  \n\n")
        f.write("| Table | Column | RowID | Reason | Flagged URL |\n")
        f.write("| :--- | :--- | :--- | :--- | :--- |\n")
        for t, col, row_id, url, reason in quarantine_audit[:200]: # Limit to first 200 for file size
            f.write(f"| `{t}` | `{col}` | {row_id} | {reason} | {url} |\n")
            
    print(f"Audit written to {audit_file_path}")
    conn.execute("PRAGMA wal_checkpoint(TRUNCATE);")
    conn.close()

if __name__ == '__main__':
    main()
