import sqlite3
import re
import os
import json
import html
from datetime import datetime

db_path = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db"
cache_file = "/Users/ericgagnon/.gemini/antigravity/brain/f5c4e4c5-e6ee-44ba-84bd-d56f69d06707/.system_generated/steps/14922/content.md"

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def main():
    if not os.path.exists(cache_file):
        print(f"❌ Cache file not found: {cache_file}")
        return

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Clear old NY DSS/Medicaid records from staging
    cursor.execute("DELETE FROM staging_scraped_county_offices WHERE state_id = 'new-york' AND program_id = 'ny-medicaid'")
    conn.commit()
    print("✓ Cleared existing staging records for New York LDSS offices.")

    # Get counties mapping from DB
    cursor.execute("SELECT id, name FROM counties WHERE state_id = 'new-york'")
    counties_mapping = {row['name'].replace(" County", "").strip().lower(): row['id'] for row in cursor.fetchall()}

    with open(cache_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Clean out comments and style sheets
    clean_html = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    
    # Find all table rows
    rows = re.findall(r'<tr>(.*?)</tr>', clean_html, re.DOTALL)
    print(f"Found {len(rows)} HTML table rows in content.")

    timestamp = datetime.now().isoformat()
    staged_count = 0

    for row in rows:
        tds = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
        if len(tds) < 2:
            continue

        # Cell 1: County Name / ID
        cell1 = tds[0]
        county_name = re.sub(r'<[^>]+>', '', cell1).replace("Back to Map", "").strip()
        county_name = html.unescape(county_name)
        if not county_name or county_name.lower() in ["county", "website", "address"]:
            continue

        # Cell 2: Website / Name
        cell2 = tds[1]
        link_match = re.search(r'href=["\']([^"\']+)["\']', cell2)
        website = link_match.group(1).strip() if link_match else "https://www.health.ny.gov/health_care/medicaid/"
        link_text = re.sub(r'<[^>]+>', '', cell2).strip()
        link_text = html.unescape(link_text)

        # Cell 3: Address & Phone (if table has 3 columns, else merge)
        if len(tds) >= 3:
            cell3 = tds[2]
            address_phone = re.sub(r'<[^>]+>', '', cell3).strip()
            address_phone = html.unescape(address_phone)
        else:
            address_phone = re.sub(r'<[^>]+>', '', cell2).strip()
            address_phone = html.unescape(address_phone)

        # Standardize spaces
        address_phone = re.sub(r'\s+', ' ', address_phone)

        # Phone extraction
        phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', address_phone)
        phone = phone_match.group(0).strip() if phone_match else ""

        # Address extraction
        address = address_phone
        if phone:
            address = address.replace(phone, "").strip()
            address = re.sub(r'[,;\s-]+$', '', address).strip()

        # Handle fallback for NYC or other missing data
        if county_name.lower() == "new york city":
            # Map NYC to all 5 boroughs
            target_counties = [
                ("bronx-ny", "Bronx County"),
                ("kings-ny", "Kings County"),
                ("new-york-ny", "New York County"),
                ("queens-ny", "Queens County"),
                ("richmond-ny", "Richmond County")
            ]
            office_name = "NYC Human Resources Administration (HRA) - Medicaid Office"
            phone = phone if phone else "(718) 557-1399"
            address = address if address else "HRA Central Office, 150 Greenwich Street, New York, NY 10007"
            website = "https://www1.nyc.gov/site/hra/index.page"
        else:
            # Map single county
            county_key = county_name.lower().replace("saint ", "st. ").strip()
            if county_key not in counties_mapping:
                # Try to fuzzy match
                found_id = None
                for c_name, c_id in counties_mapping.items():
                    if county_key in c_name or c_name in county_key:
                        found_id = c_id
                        break
                if not found_id:
                    print(f"  ⚠️ Warning: County '{county_name}' could not be matched. Skipping.")
                    continue
                county_id = found_id
            else:
                county_id = counties_mapping[county_key]
            
            target_counties = [(county_id, f"{county_name} County")]
            office_name = link_text if link_text else f"{county_name} County Department of Social Services"
            if not office_name.lower().startswith(county_name.lower()):
                office_name = f"{county_name} County - {office_name}"

        # Insert staged records
        for c_id, c_name in target_counties:
            suggested_id = slugify(f"off-{c_id}-{office_name}-medicaid")

            # Check duplicate in staging
            dup = cursor.execute("""
                SELECT id FROM staging_scraped_county_offices 
                WHERE county_id = ? AND program_id = 'ny-medicaid' AND extracted_name = ?
            """, (c_id, office_name)).fetchone()
            
            if dup:
                continue

            cursor.execute("""
                INSERT INTO staging_scraped_county_offices (
                    source_url, source_name, source_type, scraped_at, state_id, county_id,
                    confidence_score, extraction_notes, raw_text_excerpt, review_status,
                    extracted_name, extracted_phone, extracted_address, extracted_website, program_id,
                    suggested_target_table, suggested_target_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                "https://www.health.ny.gov/health_care/medicaid/ldss.htm",
                "New York State DOH Local Social Services directory",
                "official_state",
                timestamp,
                "new-york",
                c_id,
                1.0,
                f"Scraped from NY DOH official directory page for county {c_name}",
                f"Row: {row[:500]}",
                "pending_review",
                office_name,
                phone if phone else "(800) 541-2831",
                address,
                website,
                "ny-medicaid",
                "county_offices",
                suggested_id
            ))
            staged_count += 1

    conn.commit()
    conn.close()
    print(f"✓ Finished scraping New York social services offices. Total staged entries: {staged_count}")

if __name__ == "__main__":
    main()
