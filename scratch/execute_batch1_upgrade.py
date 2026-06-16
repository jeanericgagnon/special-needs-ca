import sqlite3
import os

def upgrade_db(db_path):
    print(f"\n--- UPGRADING DATABASE: {db_path} ---")
    if not os.path.exists(db_path):
        print(f"Error: {db_path} does not exist.")
        return False
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # 1. Texas County Offices
        # curated_seed: set verification_status = 'source_listed'
        cursor.execute("""
            UPDATE county_offices
            SET verification_status = 'source_listed'
            WHERE id IN (
                SELECT t.id FROM county_offices t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = 'texas' AND t.data_origin = 'curated_seed' AND t.verification_status = 'manual_review_required'
            )
        """)
        tx_co_seed_count = cursor.rowcount
        print(f"Texas County Offices (curated_seed) updated: {tx_co_seed_count}")

        # official_locator_derived: phone = '(877) 541-7905', email = '', website = 'https://www.yourtexasbenefits.com', verification_status = 'source_listed', confidence_score = 0.85
        cursor.execute("""
            UPDATE county_offices
            SET phone = '(877) 541-7905',
                email = '',
                website = 'https://www.yourtexasbenefits.com',
                verification_status = 'source_listed',
                confidence_score = 0.85
            WHERE id IN (
                SELECT t.id FROM county_offices t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = 'texas' AND t.data_origin = 'official_locator_derived' AND t.verification_status = 'manual_review_required'
            )
        """)
        tx_co_derived_count = cursor.rowcount
        print(f"Texas County Offices (official_locator_derived) updated: {tx_co_derived_count}")

        # 2. Texas School Districts
        # official_locator_derived: spec_ed_contact_phone = '(877) 787-3389', spec_ed_contact_email = '', website = 'https://www.spedtex.org', verification_status = 'source_listed', confidence_score = 0.85
        cursor.execute("""
            UPDATE school_districts
            SET spec_ed_contact_phone = '(877) 787-3389',
                spec_ed_contact_email = '',
                website = 'https://www.spedtex.org',
                verification_status = 'source_listed',
                confidence_score = 0.85
            WHERE id IN (
                SELECT t.id FROM school_districts t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = 'texas' AND t.data_origin = 'official_locator_derived' AND t.verification_status = 'manual_review_required'
            )
        """)
        tx_sd_count = cursor.rowcount
        print(f"Texas School Districts updated: {tx_sd_count}")

        # 3. Texas Nonprofits (Arc of Texas statewide support chapters in manual_review_required)
        cursor.execute("""
            UPDATE nonprofit_organizations
            SET verification_status = 'source_listed'
            WHERE id IN (
                SELECT t.id FROM nonprofit_organizations t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = 'texas' AND t.verification_status = 'manual_review_required'
            )
        """)
        tx_np_count = cursor.rowcount
        print(f"Texas Nonprofits updated: {tx_np_count}")

        # 4. Texas IEP Advocates
        cursor.execute("""
            UPDATE iep_advocates
            SET verification_status = 'source_listed'
            WHERE id = 'tx-advocate-arc-state'
        """)
        tx_adv_count = cursor.rowcount
        print(f"Texas Advocates (tx-advocate-arc-state) updated: {tx_adv_count}")

        # 5. Florida County Offices (DCF ACCESS Storefronts)
        cursor.execute("""
            UPDATE county_offices
            SET verification_status = 'source_listed'
            WHERE id IN (
                SELECT t.id FROM county_offices t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = 'florida' AND t.verification_status = 'manual_review_required'
            )
        """)
        fl_co_count = cursor.rowcount
        print(f"Florida County Offices updated: {fl_co_count}")

        # 6. Florida School Districts (ESE Districts)
        cursor.execute("""
            UPDATE school_districts
            SET verification_status = 'source_listed'
            WHERE id IN (
                SELECT t.id FROM school_districts t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = 'florida' AND t.verification_status IN ('manual_review_required', 'source_supported_ready_to_stage')
            )
        """)
        fl_sd_count = cursor.rowcount
        print(f"Florida School Districts updated: {fl_sd_count}")

        # 7. Florida Nonprofits (Arc of Tampa Bay)
        cursor.execute("""
            UPDATE nonprofit_organizations
            SET verification_status = 'source_listed',
                evidence_level = 'source_listed'
            WHERE id IN ('fl-np-arc-tampabay-pinellas-fl', 'fl-np-arc-tampabay-hillsborough-fl', 'fl-np-arc-tampabay-pasco-fl')
        """)
        fl_np_count = cursor.rowcount
        print(f"Florida Nonprofits (Arc of Tampa Bay) updated: {fl_np_count}")

        # 8. Pennsylvania County Offices (DHS County Assistance Offices)
        cursor.execute("""
            UPDATE county_offices
            SET verification_status = 'source_listed'
            WHERE id IN (
                SELECT t.id FROM county_offices t
                JOIN counties c ON t.county_id = c.id
                WHERE c.state_id = 'pennsylvania' AND t.verification_status = 'manual_review_required'
            )
        """)
        pa_co_count = cursor.rowcount
        print(f"Pennsylvania County Offices updated: {pa_co_count}")

        # 9. Pennsylvania IEP Advocates & Providers
        # For the 8 legal aid advocates
        cursor.execute("""
            UPDATE iep_advocates
            SET name = 'Disability Rights Pennsylvania',
                website = 'https://www.disabilityrightspa.org/',
                phone = '800-692-7443',
                email = 'intake@disabilityrightspa.org',
                description = 'Disability Rights Pennsylvania is the designated protection and advocacy agency for Pennsylvania. Address: 1800 JFK Boulevard Suite 900, Philadelphia, PA 19103',
                verification_status = 'source_listed'
            WHERE id LIKE 'pa-adv-local-legal-%' AND id IN (
                SELECT t.id FROM iep_advocates t
                JOIN iep_advocate_counties j ON t.id = j.iep_advocate_id
                JOIN counties c ON j.county_id = c.id
                WHERE c.state_id = 'pennsylvania'
            )
        """)
        pa_adv_legal_count = cursor.rowcount
        print(f"Pennsylvania Advocates (Legal Aid) updated: {pa_adv_legal_count}")

        # For the 8 therapy providers
        cursor.execute("""
            UPDATE iep_advocates
            SET name = 'The PEAL Center (Parent Training & Information Center)',
                website = 'https://pealcenter.org',
                phone = '866-950-1040',
                email = 'info@pealcenter.org',
                description = 'The PEAL Center is Pennsylvania''s Parent Training and Information Center (PTI). Address: 1119 Penn Avenue, Suite 400, Pittsburgh, PA 15222',
                verification_status = 'source_listed'
            WHERE id LIKE 'pa-prov-local-therapy-%' AND id IN (
                SELECT t.id FROM iep_advocates t
                JOIN iep_advocate_counties j ON t.id = j.iep_advocate_id
                JOIN counties c ON j.county_id = c.id
                WHERE c.state_id = 'pennsylvania'
            )
        """)
        pa_adv_therapy_count = cursor.rowcount
        print(f"Pennsylvania Advocates (Therapy / PTI) updated: {pa_adv_therapy_count}")

        conn.commit()
        print("Transaction committed successfully.")
        return True
    except Exception as e:
        conn.rollback()
        print(f"Error occurred, transaction rolled back: {e}")
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    db_root = "ca_disability_navigator.db"
    db_frontend = "frontend/ca_disability_navigator.db"
    
    success_root = upgrade_db(db_root)
    success_frontend = upgrade_db(db_frontend)
    
    if success_root and success_frontend:
        print("\nAll database upgrades completed successfully.")
    else:
        print("\nFailed to upgrade one or both databases.")
