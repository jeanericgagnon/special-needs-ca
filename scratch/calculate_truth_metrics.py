import sqlite3
from collections import defaultdict

db_path = "ca_disability_navigator.db"
conn = sqlite3.connect(db_path)

tables = [
    "county_offices",
    "school_districts",
    "nonprofit_organizations",
    "iep_advocates",
    "regional_education_agencies",
    "state_resource_agencies"
]

# Structure: state -> status -> count
state_stats = defaultdict(lambda: defaultdict(int))
# Structure: category -> status -> count
category_stats = defaultdict(lambda: defaultdict(int))

cursor = conn.cursor()

for table in tables:
    cursor.execute(f"PRAGMA table_info({table})")
    columns = [col[1] for col in cursor.fetchall()]
    
    query = ""
    if table in ["county_offices", "school_districts", "nonprofit_organizations"]:
        query = f"""
            SELECT c.state_id, t.verification_status, COUNT(*)
            FROM {table} t
            JOIN counties c ON t.county_id = c.id
            GROUP BY c.state_id, t.verification_status
        """
    elif table == "regional_education_agencies" or table == "state_resource_agencies":
        query = f"""
            SELECT t.state_id, t.verification_status, COUNT(*)
            FROM {table} t
            GROUP BY t.state_id, t.verification_status
        """
    elif table == "iep_advocates":
        # check columns
        if "state_id" in columns:
            query = """
                SELECT t.state_id, t.verification_status, COUNT(*)
                FROM iep_advocates t
                GROUP BY t.state_id, t.verification_status
            """
        else:
            # check if linked via county_id
            if "county_id" in columns:
                query = """
                    SELECT c.state_id, t.verification_status, COUNT(*)
                    FROM iep_advocates t
                    JOIN counties c ON t.county_id = c.id
                    GROUP BY c.state_id, t.verification_status
                """
            else:
                # iep_advocate_counties
                query = """
                    SELECT c.state_id, t.verification_status, COUNT(distinct t.id)
                    FROM iep_advocates t
                    JOIN iep_advocate_counties iac ON t.id = iac.iep_advocate_id
                    JOIN counties c ON iac.county_id = c.id
                    GROUP BY c.state_id, t.verification_status
                """
                
    try:
        cursor.execute(query)
        rows = cursor.fetchall()
        for state_id, status, count in rows:
            if not state_id:
                state_id = "unknown"
            if not status:
                status = "unverified"
            state_stats[state_id][status] += count
            category_stats[table][status] += count
    except Exception as e:
        print(f"Error querying {table}: {e}")

# Process state metrics
state_report = []
total_mr_count = 0
total_all_records = 0

for state_id, statuses in state_stats.items():
    mr = statuses.get("manual_review_required", 0)
    total = sum(statuses.values())
    rate = (mr / total * 100) if total > 0 else 0.0
    state_report.append({
        "state_id": state_id,
        "mr_count": mr,
        "total": total,
        "mr_rate": rate
    })
    total_mr_count += mr
    total_all_records += total

# Sort by MR count
state_report_sorted_count = sorted(state_report, key=lambda x: x["mr_count"], reverse=True)
# Sort by MR rate
state_report_sorted_rate = sorted(state_report, key=lambda x: x["mr_rate"], reverse=True)

print("\n--- TOP 10 STATES BY MANUAL-REVIEW COUNT ---")
for i, item in enumerate(state_report_sorted_count[:10]):
    print(f"{i+1}. {item['state_id']}: Count={item['mr_count']}, Total={item['total']}, Rate={item['mr_rate']:.2f}%")

print("\n--- TOP 10 STATES BY MANUAL-REVIEW RATE ---")
for i, item in enumerate(state_report_sorted_rate[:10]):
    print(f"{i+1}. {item['state_id']}: Rate={item['mr_rate']:.2f}%, Count={item['mr_count']}, Total={item['total']}")

print("\n--- TOTAL MANUAL REVIEW REQUIRED NATIONALLY ---")
print(f"Total MR Count: {total_mr_count}")
print(f"Total Records Count: {total_all_records}")
print(f"National MR Rate: {(total_mr_count / total_all_records * 100):.2f}%" if total_all_records > 0 else "0.00%")

print("\n--- CATEGORIES BREAKDOWN ---")
for cat, statuses in category_stats.items():
    mr = statuses.get("manual_review_required", 0)
    total = sum(statuses.values())
    rate = (mr / total * 100) if total > 0 else 0.0
    print(f"{cat}: MR Count={mr}, Total={total}, Rate={rate:.2f}%")

conn.close()
