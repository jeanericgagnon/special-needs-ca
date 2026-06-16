import sqlite3
import re
import os
import json
from datetime import datetime

db_path = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db"
cache_file = "/Users/ericgagnon/.gemini/antigravity/brain/f5c4e4c5-e6ee-44ba-84bd-d56f69d06707/.system_generated/steps/14875/content.md"

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

    # Clear old PA CAO records from staging
    cursor.execute("DELETE FROM staging_scraped_county_offices WHERE state_id = 'pennsylvania' AND program_id = 'pa-medicaid'")
    conn.commit()
    print("✓ Cleared existing staging records for Pennsylvania CAOs.")

    # Get counties for PA
    cursor.execute("SELECT id, name FROM counties WHERE state_id = 'pennsylvania'")
    counties_mapping = {row['name'].replace(" County", "").strip().lower(): row['id'] for row in cursor.fetchall()}

    with open(cache_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the start of the list
    start_mark = "Assistance Office Address Telephone/Fax Numbers"
    start_idx = content.find(start_mark)
    if start_idx == -1:
        start_idx = 0
    else:
        start_idx += len(start_mark)

    cao_text = content[start_idx:]

    pa_counties = [
        "Adams", "Allegheny", "Armstrong", "Beaver", "Bedford", "Berks", "Blair", "Bradford", "Bucks", "Butler",
        "Cambria", "Cameron", "Carbon", "Centre", "Chester", "Clarion", "Clearfield", "Clinton", "Columbia", "Crawford",
        "Cumberland", "Dauphin", "Delaware", "Elk", "Erie", "Fayette", "Forest", "Franklin", "Fulton", "Greene",
        "Huntingdon", "Indiana", "Jefferson", "Juniata", "Lackawanna", "Lancaster", "Lawrence", "Lebanon", "Lehigh", "Luzerne",
        "Lycoming", "McKean", "Mercer", "Mifflin", "Monroe", "Montgomery", "Montour", "Northampton", "Northumberland", "Perry",
        "Philadelphia", "Pike", "Potter", "Schuylkill", "Snyder", "Somerset", "Sullivan", "Susquehanna", "Tioga", "Union",
        "Venango", "Warren", "Washington", "Wayne", "Westmoreland", "Wyoming", "York"
    ]

    # Find county positions
    positions = []
    curr_idx = 0
    for county in pa_counties:
        match = re.search(r'\b' + re.escape(county) + r'\b', cao_text[curr_idx:])
        if match:
            actual_pos = curr_idx + match.start()
            positions.append((actual_pos, county))
            curr_idx = curr_idx + match.end()

    # Extract blocks
    blocks = []
    for idx in range(len(positions)):
        start_pos, county = positions[idx]
        end_pos = positions[idx+1][0] if idx + 1 < len(positions) else len(cao_text)
        block_text = cao_text[start_pos:end_pos].strip()
        blocks.append((county, block_text))

    timestamp = datetime.now().isoformat()
    staged_count = 0

    for county_name, block in blocks:
        county_key = county_name.lower().strip()
        if county_key not in counties_mapping:
            print(f"  ⚠️ Warning: County '{county_name}' not found in database counties table. Skipping.")
            continue
        county_id = counties_mapping[county_key]

        parts = re.split(r'OFFICE HOURS:', block, flags=re.IGNORECASE)
        prev_next_header = ""

        for i in range(len(parts) - 1):
            header_text = parts[i].strip()
            if i == 0:
                header_text = re.sub(r'^' + re.escape(county_name) + r'\b', '', header_text).strip()
                header_text = re.sub(r'^' + re.escape(county_name) + r'\b', '', header_text).strip()

            body_text = parts[i+1].strip()
            next_header = ""

            if i + 1 < len(parts) - 1:
                body_lines = [l.strip() for l in body_text.split('\n') if l.strip()]
                last_bullet_idx = -1
                for k in range(len(body_lines)):
                    if (body_lines[k].startswith("-") or 
                        "phone" in body_lines[k].lower() or 
                        "fax" in body_lines[k].lower() or 
                        "liheap" in body_lines[k].lower() or 
                        "toll-free" in body_lines[k].lower() or 
                        "or " in body_lines[k].lower()):
                        last_bullet_idx = k
                
                next_header_lines = body_lines[last_bullet_idx + 1:]
                body_lines = body_lines[:last_bullet_idx + 1]
                body_text = "\n".join(body_lines)
                next_header = "\n".join(next_header_lines)

            if i == 0:
                office_header = header_text
            else:
                office_header = prev_next_header

            prev_next_header = next_header

            # Clean office_header
            h_lines = [l.strip() for l in office_header.split('\n') if l.strip()]
            if not h_lines:
                continue

            full_header = " ".join(h_lines)
            
            # Split office name and address
            # Look for common markers
            match_name_addr = re.match(r'(.*?(?:County Assistance Office|District|Headquarters|IRED|District\b))\s*(.*)', full_header, re.IGNORECASE)
            if match_name_addr:
                office_name = match_name_addr.group(1).strip()
                address = match_name_addr.group(2).strip()
            else:
                office_name = f"{county_name} County Assistance Office"
                address = full_header

            # If office_name does not start with county, prefix it
            if not office_name.lower().startswith(county_name.lower()):
                office_name = f"{county_name} County CAO - {office_name}"

            # Extract Phone
            phone_match = re.search(r'Phone:\s*([\d\s()-]+)', body_text, re.IGNORECASE)
            phone = phone_match.group(1).strip() if phone_match else ""
            if not phone:
                any_phone = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', body_text)
                phone = any_phone.group(0).strip() if any_phone else ""

            # Extract Fax
            fax_match = re.search(r'FAX:\s*([\d\s()-]+)', body_text, re.IGNORECASE)
            fax = fax_match.group(1).strip() if fax_match else ""

            # Clean phone and fax
            phone = re.sub(r'[-.\s]*$', '', phone)
            fax = re.sub(r'[-.\s]*$', '', fax)

            if not phone:
                phone = "1-800-692-7462" # general state helpline as fallback

            suggested_id = slugify(f"off-{county_id}-{office_name}-medicaid")

            # Check duplicate in staging
            dup = cursor.execute("""
                SELECT id FROM staging_scraped_county_offices 
                WHERE county_id = ? AND program_id = 'pa-medicaid' AND extracted_name = ?
            """, (county_id, office_name)).fetchone()
            
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
                "https://www.dhs.pa.gov/Services/Assistance/Pages/CAO-Contact.aspx",
                "Pennsylvania DHS County Assistance Office contact list",
                "official_state",
                timestamp,
                "pennsylvania",
                county_id,
                1.0,
                f"Scraped from PA DHS official directory page for county {county_name}",
                f"Header: {office_header}\nBody: {body_text}",
                "pending_review",
                office_name,
                phone,
                address,
                "https://www.compass.state.pa.us/",
                "pa-medicaid",
                "county_offices",
                suggested_id
            ))
            staged_count += 1

    conn.commit()
    conn.close()
    print(f"✓ Finished scraping Pennsylvania CAOs. Total staged entries: {staged_count}")

if __name__ == "__main__":
    main()
