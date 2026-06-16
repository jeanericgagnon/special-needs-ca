import sqlite3
import requests
import re
import html
import os
import json
from datetime import datetime

db_path = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db"

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def main():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Clear old Autism Society records from nonprofit staging
    cursor.execute("DELETE FROM staging_scraped_nonprofit_organizations WHERE source_url LIKE '%autismsociety.org%'")
    conn.commit()
    print("✓ Cleared existing staging records from autismsociety.org.")

    # Get states mapping from DB
    cursor.execute("SELECT id, name, code FROM states")
    db_states = {row['name'].lower(): dict(row) for row in cursor.fetchall()}

    # Fetch Autism Society local-support page content from WP REST API
    url = "https://autismsociety.org/wp-json/wp/v2/pages?slug=local-support"
    print(f"⏳ Fetching Autism Society affiliates from {url}...")
    
    try:
        r = requests.get(url, headers=headers, timeout=15)
        if r.status_code != 200:
            print(f"❌ Failed to fetch page. Status: {r.status_code}")
            return
        data = r.json()
        if not data:
            print("❌ No page content returned from WP REST API.")
            return
        content = data[0].get('content', {}).get('rendered', '')
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return

    # Parse affiliates-lightbox blocks
    starts = [m.start() for m in re.finditer(r'<div class="affiliates-lightbox"', content)]
    print(f"  Found {len(starts)} state-level lightbox blocks in page content.")

    affiliates = []
    for i in range(len(starts)):
        start_idx = starts[i]
        end_idx = starts[i+1] if i+1 < len(starts) else len(content)
        block = content[start_idx:end_idx]
        
        # Extract state name
        state_match = re.search(r'data-name="([^"]+)"', block)
        state_name = state_match.group(1) if state_match else "Unknown"
        
        # Find all lightbox-state-info blocks
        infos = re.findall(r'<div class="lightbox-state-info">(.*?)</div>\s*</div>', block, re.DOTALL)
        
        for info in infos:
            title_match = re.search(r'<div class="lightbox-state-info--title">([^<]+)</div>', info)
            title = title_match.group(1).strip() if title_match else "Unknown"
            
            content_match = re.search(r'<div class="lightbox-state-info--content">(.*)', info, re.DOTALL)
            content_html = content_match.group(1).strip() if content_match else ""
            
            # Clean wrapper closing tag
            content_html = re.sub(r'</div>\s*$', '', content_html)
            
            # Extract fields
            website_match = re.search(r'href=["\'](https?://[^"\']+)["\']', content_html)
            website = website_match.group(1) if website_match else "https://autismsociety.org"
            
            email_match = re.search(r'href=["\']mailto:([^"\']+)["\']', content_html)
            email = email_match.group(1) if email_match else ""
            
            phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', content_html)
            phone = phone_match.group(0) if phone_match else "N/A"
            
            # Address: first element before links/phone
            text_lines = []
            for line in re.split(r'</?(?:p|div|br)\b[^>]*>', content_html):
                clean_line = re.sub(r'<[^>]+>', '', line).strip()
                clean_line = html.unescape(clean_line)
                if clean_line:
                    text_lines.append(clean_line)
            
            address = ""
            for line in text_lines:
                if "@" in line or "http" in line or re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', line):
                    continue
                address = line
                break
                
            affiliates.append({
                "state": state_name,
                "name": title,
                "address": address,
                "phone": phone,
                "email": email,
                "website": website
            })

    print(f"✓ Parsed {len(affiliates)} affiliates. Resolving counties and inserting into staging...")

    timestamp = datetime.now().isoformat()
    staged_count = 0

    for item in affiliates:
        state_name = item['state'].lower()
        if state_name not in db_states:
            # Try to match state code or aliases
            matched_state = None
            for db_state_name, s_info in db_states.items():
                if db_state_name in state_name or s_info['code'].lower() == state_name:
                    matched_state = s_info
                    break
            if not matched_state:
                print(f"  ⚠️ State '{state_name}' not found in database states table. Skipping.")
                continue
            state_info = matched_state
        else:
            state_info = db_states[state_name]
            
        state_id = state_info['id']
        
        # Load counties for this state from DB
        cursor.execute("SELECT id, name FROM counties WHERE state_id = ?", (state_id,))
        state_counties = [dict(row) for row in cursor.fetchall()]
        
        mapped_counties = []
        name_lower = item['name'].lower()
        address_lower = item['address'].lower()
        
        # Check if the name names a specific county
        for county in state_counties:
            county_name_clean = county['name'].lower().replace(" county", "").strip()
            if re.search(r'\b' + re.escape(county_name_clean) + r'\b', name_lower):
                mapped_counties.append(county['id'])
                
        # If no county name in name, search in address
        if not mapped_counties and item['address']:
            for county in state_counties:
                county_name_clean = county['name'].lower().replace(" county", "").strip()
                if re.search(r'\b' + re.escape(county_name_clean) + r'\b', address_lower):
                    mapped_counties.append(county['id'])
                    
        # Fallback to all counties if still empty or is state-wide/regional chapter
        is_state_chapter = any(kw in name_lower for kw in ["state chapter", "autism society of " + state_name, "autism society " + state_name])
        if not mapped_counties or is_state_chapter:
            mapped_counties = [c['id'] for c in state_counties]

        # Ingest to staging
        for county_id in mapped_counties:
            suggested_id = slugify(f"{state_id}-{county_id}-{item['name']}") + "-np"
            
            # Check duplicate in staging
            dup = cursor.execute("""
                SELECT id FROM staging_scraped_nonprofit_organizations 
                WHERE county_id = ? AND extracted_name = ? AND source_url = ?
            """, (county_id, item['name'], item['website'])).fetchone()
            
            if dup:
                continue
                
            cursor.execute("""
                INSERT INTO staging_scraped_nonprofit_organizations (
                    source_url, source_name, source_type, scraped_at, state_id, county_id,
                    confidence_score, extraction_notes, raw_text_excerpt, suggested_target_table,
                    suggested_target_id, review_status, extracted_name, extracted_website, extracted_phone, focus_condition
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item['website'],
                "Autism Society Affiliate Network",
                "official_directory",
                timestamp,
                state_id,
                county_id,
                1.0,
                f"Scraped from Autism Society local-support directory page for state {state_name}",
                f"Name: {item['name']}\nAddress: {item['address']}\nPhone: {item['phone']}\nEmail: {item['email']}",
                "nonprofit_organizations",
                suggested_id,
                "pending_review",
                item['name'],
                item['website'],
                item['phone'],
                "Autism Spectrum Disorder"
            ))
            staged_count += 1

    conn.commit()
    conn.close()
    print(f"\n✓ Finished scraping Autism Society affiliates. Total staged entries: {staged_count}")

if __name__ == "__main__":
    main()
