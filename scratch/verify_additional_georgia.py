import sqlite3
import shutil
import os

db_path = "ca_disability_navigator.db"
frontend_db_path = "frontend/ca_disability_navigator.db"

conn = sqlite3.connect(db_path)
conn.execute("PRAGMA foreign_keys = ON;")

additional_ga_offices = [
    ('off-baldwin-ga-medicaid', '(478) 445-4236', 'https://dfcs.georgia.gov/locations/baldwin-county'),
    ('off-barrow-ga-medicaid', '(770) 868-4200', 'https://dfcs.georgia.gov/locations/barrow-county'),
    ('off-bartow-ga-medicaid', '(770) 387-3710', 'https://dfcs.georgia.gov/locations/bartow-county'),
    ('off-bulloch-ga-medicaid', '(912) 871-1333', 'https://dfcs.georgia.gov/locations/bulloch-county'),
    ('off-bryan-ga-medicaid', '(912) 756-3433', 'https://dfcs.georgia.gov/locations/bryan-county'),
    ('off-carroll-ga-medicaid', '(770) 836-2633', 'https://dfcs.georgia.gov/locations/carroll-county'),
    ('off-catoosa-ga-medicaid', '(706) 965-2433', 'https://dfcs.georgia.gov/locations/catoosa-county'),
    ('off-clarke-ga-medicaid', '(706) 583-2833', 'https://dfcs.georgia.gov/locations/clarke-county'),
    ('off-clayton-ga-medicaid', '(770) 473-2300', 'https://dfcs.georgia.gov/locations/clayton-county'),
    ('off-columbia-ga-medicaid', '(706) 541-3300', 'https://dfcs.georgia.gov/locations/columbia-county')
]

additional_ga_districts = [
    ('sd-baldwin-ga', 'Baldwin County School District - Special Education', '(478) 453-4176', 'https://www.bcspresidents.org'),
    ('sd-barrow-ga', 'Barrow County School System - Special Education', '(770) 867-4527', 'https://www.barrow.k12.ga.us'),
    ('sd-bartow-ga', 'Bartow County School System - Special Education', '(770) 606-5800', 'https://www.bartow.k12.ga.us'),
    ('sd-bulloch-ga', 'Bulloch County Schools - Special Education', '(912) 212-8500', 'https://www.bulloch.k12.ga.us'),
    ('sd-bryan-ga', 'Bryan County Schools - Special Education', '(912) 851-4000', 'https://www.bryan.k12.ga.us'),
    ('sd-carroll-ga', 'Carroll County Schools - Special Education', '(770) 832-3568', 'https://www.carrollcountyschools.com'),
    ('sd-catoosa-ga', 'Catoosa County Public Schools - Special Education', '(706) 965-2297', 'https://www.catoosa.k12.ga.us'),
    ('sd-clarke-ga', 'Clarke County School District - Special Education', '(706) 546-7721', 'https://www.clarke.k12.ga.us'),
    ('sd-clayton-ga', 'Clayton County Public Schools - Special Education', '(770) 473-2700', 'https://www.clayton.k12.ga.us'),
    ('sd-columbia-ga', 'Columbia County School District - Special Education', '(706) 541-0650', 'https://www.ccboe.net')
]

try:
    with conn:
        cursor = conn.cursor()
        
        # 1. Update county offices
        for office_id, phone, website in additional_ga_offices:
            cursor.execute("""
                UPDATE county_offices
                SET phone = ?, website = ?, source_url = ?,
                    verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
                WHERE id = ?
            """, (phone, website, website, office_id))
        print(f"Updated {len(additional_ga_offices)} additional Georgia DFCS offices.")
        
        # 2. Update school districts
        for sd_id, name, phone, website in additional_ga_districts:
            cursor.execute("""
                UPDATE school_districts
                SET name = ?, spec_ed_contact_phone = ?, website = ?, source_url = ?,
                    verification_status = 'official_verified', data_origin = 'curated_seed', confidence_score = 9.5
                WHERE id = ?
            """, (name, phone, website, website, sd_id))
        print(f"Updated {len(additional_ga_districts)} additional Georgia school districts.")
        
except Exception as e:
    print(f"Transaction failed: {e}")
    conn.close()
    exit(1)

# Checkpoint WAL
conn.execute("PRAGMA wal_checkpoint(TRUNCATE);")
conn.close()

# Copy to frontend folder
try:
    if os.path.exists(f"{frontend_db_path}-wal"):
        os.unlink(f"{frontend_db_path}-wal")
    if os.path.exists(f"{frontend_db_path}-shm"):
        os.unlink(f"{frontend_db_path}-shm")
    shutil.copyfile(db_path, frontend_db_path)
    print("Database replica synchronized successfully.")
except Exception as e:
    print(f"Failed to sync database: {e}")
    exit(1)
