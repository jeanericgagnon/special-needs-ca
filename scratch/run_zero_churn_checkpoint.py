import sqlite3
import shutil
import time
import os
import re
import glob

# Paths
db_root = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db"
db_frontend = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/ca_disability_navigator.db"
backup_dir = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/backups"
os.makedirs(backup_dir, exist_ok=True)

# Generate timestamp
timestamp = int(time.time() * 1000)
backup_root_path = os.path.join(backup_dir, f"ca_disability_navigator.db.backup-zero-churn-{timestamp}")
backup_frontend_path = os.path.join(backup_dir, f"frontend-ca_disability_navigator.db.backup-zero-churn-{timestamp}")

# Copy databases
print(f"⚙️ Backing up root database to {backup_root_path}...")
shutil.copyfile(db_root, backup_root_path)
print(f"⚙️ Backing up frontend database to {backup_frontend_path}...")
shutil.copyfile(db_frontend, backup_frontend_path)
print("✓ Backups complete.")

# Integrity check
def run_integrity_check(db_path):
    print(f"⚙️ Running SQLite integrity_check on {os.path.basename(db_path)}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA integrity_check")
    result = cursor.fetchone()[0]
    conn.close()
    return result

integrity_root = run_integrity_check(db_root)
integrity_frontend = run_integrity_check(db_frontend)
print(f"✓ Root integrity: {integrity_root}")
print(f"✓ Frontend integrity: {integrity_frontend}")

if integrity_root != "ok" or integrity_frontend != "ok":
    print("❌ SQLite Database is corrupt! Aborting execution.")
    exit(1)

# Snapshot protected counts
protected_tables = [
    "county_offices",
    "school_districts",
    "nonprofit_organizations",
    "regional_education_agencies",
    "iep_advocates",
    "resource_providers",
    "state_resource_agencies"
]

def get_protected_counts(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    counts = {}
    for table in protected_tables:
        try:
            cursor.execute(f"PRAGMA table_info({table})")
            cols = [c[1] for c in cursor.fetchall()]
            conditions = []
            if 'data_origin' in cols:
                conditions.append("data_origin IN ('curated_seed', 'write_protected')")
            if 'verification_status' in cols:
                conditions.append("verification_status IN ('human_verified', 'official_verified', 'write_protected')")
            if conditions:
                query = f"SELECT COUNT(*) FROM {table} WHERE " + " OR ".join(conditions)
                cursor.execute(query)
                counts[table] = cursor.fetchone()[0]
            else:
                counts[table] = 0
        except Exception as e:
            counts[table] = f"Error: {e}"
    conn.close()
    return counts

root_protected_counts = get_protected_counts(db_root)
frontend_protected_counts = get_protected_counts(db_frontend)

# Sitemap allowlist counts
sitemap_file = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/frontend/src/lib/verifiedCounties.ts"
tx_count = 0
fl_count = 0
pa_count = 0
other_count = 0
total_sitemap_count = 0

if os.path.exists(sitemap_file):
    with open(sitemap_file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract entries inside the NON_CA_VERIFIED_COUNTIES array
    match = re.search(r'export const NON_CA_VERIFIED_COUNTIES = \[\s*([\s\S]*?)\s*\];', content)
    if match:
        entries_str = match.group(1)
        entries = re.findall(r"'([^']+)'", entries_str)
        total_sitemap_count = len(entries)
        for entry in entries:
            if entry.endswith("-tx"):
                tx_count += 1
            elif entry.endswith("-fl"):
                fl_count += 1
            elif entry.endswith("-pa"):
                pa_count += 1
            else:
                other_count += 1

# Forms counts
def get_forms_counts(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    counts = {}
    for table in ["forms_and_guides", "staging_scraped_forms"]:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            counts[table] = cursor.fetchone()[0]
        except Exception as e:
            counts[table] = f"Error: {e}"
    conn.close()
    return counts

root_forms_counts = get_forms_counts(db_root)
frontend_forms_counts = get_forms_counts(db_frontend)

# Fake/generated source counts
fake_regexes = [
    re.compile(r'dhhs\.[a-z]{2}\.gov', re.IGNORECASE),
    re.compile(r'education\.[a-z]{2}\.gov', re.IGNORECASE),
    re.compile(r'[a-z0-9-]+\-lidda\.tx\.gov', re.IGNORECASE),
    re.compile(r'childrenshospital\.org', re.IGNORECASE),
    re.compile(r'parentcenterhub\.org', re.IGNORECASE),
    re.compile(r'copaa\.org', re.IGNORECASE),
    re.compile(r'google\.com/search', re.IGNORECASE),
    re.compile(r'google\.com/url', re.IGNORECASE)
]

def count_matches_in_text(text):
    count = 0
    for r in fake_regexes:
        count += len(r.findall(text))
    return count

# Scan docs
docs_fake_count = 0
for filepath in glob.glob("/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/**/*.md", recursive=True):
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        docs_fake_count += count_matches_in_text(content)
    except Exception as e:
        pass

# Scan data json files
data_fake_count = 0
for filepath in glob.glob("/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/**/*.json", recursive=True):
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        data_fake_count += count_matches_in_text(content)
    except Exception as e:
        pass

# Scan database fields
def count_db_fake_sources(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [r[0] for r in cursor.fetchall()]
    total_db_fake = 0
    
    for table in tables:
        try:
            cursor.execute(f"PRAGMA table_info({table})")
            cols = [c[1] for c in cursor.fetchall()]
            cursor.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            for row in rows:
                for val in row:
                    if isinstance(val, str):
                        total_db_fake += count_matches_in_text(val)
        except Exception as e:
            pass
    conn.close()
    return total_db_fake

db_root_fake_count = count_db_fake_sources(db_root)
db_frontend_fake_count = count_db_fake_sources(db_frontend)

# Write Zero-Churn start checkpoint
checkpoint_path = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/national-rollout/zero-churn-start-checkpoint.md"
os.makedirs(os.path.dirname(checkpoint_path), exist_ok=True)

checkpoint_content = f"""# Zero-Churn Final Hardening Start Checkpoint

**Date:** June 15, 2026  
**Timestamp:** {timestamp}  
**Root Database Backup:** `{backup_root_path}`  
**Frontend Database Backup:** `{backup_frontend_path}`  
**Root PRAGMA integrity_check:** `{integrity_root}`  
**Frontend PRAGMA integrity_check:** `{integrity_frontend}`  

---

## 1. Protected-Record Snapshot Counts

| Table Name | Root DB Protected Count | Frontend DB Protected Count |
| :--- | :---: | :---: |
"""

for table in protected_tables:
    checkpoint_content += f"| `{table}` | **{root_protected_counts.get(table, 0)}** | **{frontend_protected_counts.get(table, 0)}** |\n"

checkpoint_content += f"""
---

## 2. Sitemap Allowlist Count

* **Sitemap Allowlist File:** `frontend/src/lib/verifiedCounties.ts`
* **Texas (TX):** {tx_count}
* **Florida (FL):** {fl_count}
* **Pennsylvania (PA):** {pa_count}
* **Other States:** {other_count}
* **Total Non-CA Sitemap Count:** {total_sitemap_count}

---

## 3. Forms Table / Staging Counts

| Table Name | Root DB Count | Frontend DB Count |
| :--- | :---: | :---: |
| `forms_and_guides` | **{root_forms_counts.get('forms_and_guides', 0)}** | **{frontend_forms_counts.get('forms_and_guides', 0)}** |
| `staging_scraped_forms` | **{root_forms_counts.get('staging_scraped_forms', 0)}** | **{frontend_forms_counts.get('staging_scraped_forms', 0)}** |

---

## 4. Fake/Generated Source Counts

* **Docs Directory (`docs/**/*.md`):** {docs_fake_count}
* **Data Directory (`data/**/*.json`):** {data_fake_count}
* **Root Database (`ca_disability_navigator.db`):** {db_root_fake_count}
* **Frontend Database (`frontend/ca_disability_navigator.db`):** {db_frontend_fake_count}
"""

with open(checkpoint_path, "w", encoding="utf-8") as f:
    f.write(checkpoint_content)

print(f"✓ Checkpoint report written successfully to {checkpoint_path}")
print(f"ROOT_INTEGRITY={integrity_root}")
print(f"FRONTEND_INTEGRITY={integrity_frontend}")
print(f"TOTAL_SITEMAP_COUNT={total_sitemap_count}")
print(f"ROOT_FORMS_COUNT={root_forms_counts.get('forms_and_guides', 0)}")
print(f"STAGING_FORMS_COUNT={root_forms_counts.get('staging_scraped_forms', 0)}")
