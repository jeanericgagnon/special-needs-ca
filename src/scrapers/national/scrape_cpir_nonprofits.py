import sqlite3
import requests
import re
import html
import os
import json
from datetime import datetime

db_path = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

STATE_TO_MAP_ID = {
  "al": 1, "ak": 2, "az": 3, "ar": 4, "ca": 5, "co": 6, "ct": 7, "de": 8, "dc": 9,
  "fl": 10, "ga": 11, "hi": 12, "id": 13, "il": 14, "in": 15, "ia": 16, "ks": 17,
  "ky": 18, "la": 19, "me": 20, "md": 21, "ma": 22, "mi": 23, "mn": 24, "ms": 25,
  "mo": 26, "mt": 27, "ne": 28, "nv": 29, "nh": 30, "nj": 31, "nm": 32, "ny": 33,
  "nc": 34, "nd": 35, "oh": 36, "ok": 37, "or": 38, "pa": 39, "ri": 40, "sc": 41,
  "sd": 42, "tn": 43, "tx": 44, "ut": 45, "vt": 46, "va": 47, "wa": 48, "wv": 49,
  "wi": 50, "wy": 51, "pr": 52, "vi": 53, "gu": 54, "as": 55, "mp": 56
}

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

# Fetch all states from DB
cursor.execute("SELECT id, name, code FROM states")
db_states = [dict(row) for row in cursor.fetchall()]

# Clear any previous CPIR records from nonprofit staging
cursor.execute("DELETE FROM staging_scraped_nonprofit_organizations WHERE source_url LIKE '%parentcenterhub.org%'")
conn.commit()
print("✓ Cleared staging table CPIR records.")

timestamp = datetime.now().isoformat()
staged_count = 0

for state in db_states:
    state_id = state['id']
    state_code = state['code'].lower()
    state_name = state['name'].lower()
    
    if state_code not in STATE_TO_MAP_ID:
        continue
        
    map_id = STATE_TO_MAP_ID[state_code]
    url = f"https://www.parentcenterhub.org/index.php?map_id=0&usterritorieshtml5map_get_state_info={map_id}"
    
    print(f"⏳ Fetching CPIR centers for {state['name']} (ID: {map_id})...")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"  ❌ Failed to fetch {state['name']}: HTTP {response.status_code}")
            continue
            
        html_content = html.unescape(response.text)
        
        # Extract paragraph blocks
        blocks = re.findall(r'<p[^>]*>(.*?)</p>', html_content, re.DOTALL | re.IGNORECASE)
        if not blocks:
            blocks = [b.strip() for b in html_content.split('<br />\n<br />') if b.strip()]
            
        state_counties = [dict(row) for row in cursor.execute("SELECT id, name FROM counties WHERE state_id = ?", (state_id,)).fetchall()]
        
        state_centers_count = 0
        for block in blocks:
            block_clean = block.strip()
            if not block_clean:
                continue
                
            # Extract emails
            emails = re.findall(r'mailto:([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', block_clean)
            
            # Extract websites
            websites = re.findall(r'href=["\'](https?://[^"\']+)["\']', block_clean)
            websites = [w for w in websites if "mailto:" not in w and "parentcenterhub" not in w]
            
            # Extract raw lines
            lines_html = re.split(r'<br\s*/?>', block_clean, flags=re.IGNORECASE)
            lines = []
            for line in lines_html:
                line_stripped = re.sub(r'<[^>]+>', '', line).strip()
                if line_stripped:
                    lines.append(line_stripped)
                    
            if not lines:
                continue
                
            name = lines[0]
            if len(name) < 5 or any(kw in name.lower() for kw in ["click on your state", "welcome to our", "hover over and click"]):
                continue
                
            # Extract phone numbers
            phones = []
            for line in lines:
                phone_match = re.search(r'(\+?\d{1,2}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', line)
                if phone_match:
                    phones.append(line)
            
            # Extract address lines
            address_lines = []
            for line in lines[1:]:
                if any(keyword in line.lower() for keyword in ["phone:", "toll-free:", "toll free:", "e-mail:", "email:", "website:", "url:"]):
                    continue
                if any(email in line for email in emails):
                    continue
                if any(site in line for site in websites):
                    continue
                if any(phone in line for phone in phones):
                    continue
                address_lines.append(line)
                
            address = ", ".join(address_lines)
            
            # Formatting fields
            extracted_email = emails[0] if emails else ""
            extracted_website = websites[0] if websites else "https://www.parentcenterhub.org"
            extracted_phone = phones[0] if phones else "N/A"
            
            # Find a line starting with "Serving"
            serving_line = None
            for line in lines:
                if line.lower().startswith("serving"):
                    serving_line = line
                    break
            
            mapped_counties = []
            
            if serving_line:
                serving_text = serving_line.lower()
                is_statewide = any(kw in serving_text for kw in ["statewide", "entire state", "across " + state_name, "across " + state_code])
                
                if is_statewide:
                    mapped_counties = [c['id'] for c in state_counties]
                elif state_code == 'ny' and any(nyc_kw in serving_text for nyc_kw in ["5 boroughs", "new york city", "nyc", "brooklyn", "queens", "manhattan", "bronx", "staten island"]):
                    mapped_counties = [c['id'] for c in state_counties if c['name'].lower() in ["new york", "kings", "queens", "bronx", "richmond"]]
                else:
                    # Search specifically in the serving line for county names
                    for county in state_counties:
                        county_name_clean = county['name'].lower().replace(" county", "").strip()
                        if re.search(r'\b' + re.escape(county_name_clean) + r'\b', serving_text):
                            mapped_counties.append(county['id'])
                            
                    # If the serving line didn't match any counties, fall back to matching the whole block minus address
                    if not mapped_counties:
                        # Fallback: search name and serving line
                        for county in state_counties:
                            county_name_clean = county['name'].lower().replace(" county", "").strip()
                            if re.search(r'\b' + re.escape(county_name_clean) + r'\b', name.lower() + " " + serving_text):
                                mapped_counties.append(county['id'])
            else:
                # No serving line means it defaults to statewide!
                mapped_counties = [c['id'] for c in state_counties]
                
            # Final fallback: if mapped_counties is still empty, map to all counties in the state
            if not mapped_counties:
                mapped_counties = [c['id'] for c in state_counties]
                
            for county_id in mapped_counties:
                suggested_id = slugify(f"{state_id}-{county_id}-{name}") + "-np"
                
                # Check duplicate in staging
                dup = cursor.execute("""
                    SELECT id FROM staging_scraped_nonprofit_organizations 
                    WHERE county_id = ? AND extracted_name = ?
                """, (county_id, name)).fetchone()
                
                if dup:
                    continue
                    
                cursor.execute("""
                    INSERT INTO staging_scraped_nonprofit_organizations (
                        source_url, source_name, source_type, scraped_at, state_id, county_id,
                        confidence_score, extraction_notes, raw_text_excerpt, suggested_target_table,
                        suggested_target_id, review_status, extracted_name, extracted_website, extracted_phone, focus_condition
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    url,
                    "Center for Parent Information & Resources",
                    "official_directory",
                    timestamp,
                    state_id,
                    county_id,
                    1.0,
                    f"Parsed from map ID {map_id} representing state {state_id}",
                    block_clean[:1000],
                    "nonprofit_organizations",
                    suggested_id,
                    "pending_review",
                    name,
                    extracted_website,
                    extracted_phone,
                    "All Disabilities"
                ))
                staged_count += 1
                state_centers_count += 1
                
        print(f"  ✓ Ingested {state_centers_count} regional parent center mappings for {state['name']}.")
        conn.commit()
    except Exception as e:
        print(f"  ❌ Error processing {state['name']}: {e}")

print(f"\n✓ Finished scraping CPIR Nonprofits. Total staged entries: {staged_count}")
conn.close()
