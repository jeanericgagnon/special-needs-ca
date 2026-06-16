import sqlite3
import requests
import re
import html
import os
import json
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

db_path = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db"
states_json_path = "/Users/ericgagnon/.gemini/antigravity/brain/f5c4e4c5-e6ee-44ba-84bd-d56f69d06707/scratch/thearc_states.json"

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def fetch_url(url):
    try:
        r = requests.get(url, headers=headers, timeout=15)
        if r.status_code == 200:
            return r.text
        return None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def parse_chapter_html(html_content, url):
    name = ""
    address = ""
    phone = ""
    email = ""
    
    # Extract from contact block
    contact_match = re.search(r'<h2>Contact</h2>(.*?)</div>', html_content, re.DOTALL | re.IGNORECASE)
    if contact_match:
        section_html = contact_match.group(1)
        paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', section_html, re.DOTALL | re.IGNORECASE)
        lines = []
        for p in paragraphs:
            clean_p = re.sub(r'<[^>]+>', '', p).strip()
            clean_p = html.unescape(clean_p)
            if clean_p:
                lines.append(clean_p)
        
        if lines:
            name = lines[0]
            if len(lines) > 1:
                address = lines[1]
            for line in lines[1:]:
                if "phone:" in line.lower() or re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', line):
                    p_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', line)
                    if p_match:
                        phone = p_match.group(0)
                if "email:" in line.lower() or "@" in line:
                    e_match = re.search(r'\b[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\b', line)
                    if e_match:
                        email = e_match.group(0)
                        
    if not name:
        title_match = re.search(r'<title>(.*?)</title>', html_content, re.IGNORECASE)
        if title_match:
            name = html.unescape(title_match.group(1).split('-')[0].strip())
            
    if not phone:
        p_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', html_content)
        if p_match:
            phone = p_match.group(0)
            
    if not email:
        e_match = re.search(r'mailto:([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', html_content)
        if not e_match:
            e_match = re.search(r'\b[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\b', html_content)
        if e_match:
            email = e_match.group(1) if e_match.groups() else e_match.group(0)
            
    website = ""
    links = re.findall(r'href=["\'](https?://[^"\']+)["\']', html_content)
    for l in links:
        domain = l.lower()
        if any(kw in domain for kw in ["thearc.org", "bonfire.com", "facebook.com", "twitter.com", "linkedin.com", "instagram.com", "youtube.com", "google.com", "guidestar.org", "charitywatch.org", "give.org", "pci-compliance", "datepicker", "gmpg.org"]):
            continue
        website = l
        break
        
    return {
        "name": name,
        "address": address,
        "phone": phone or "N/A",
        "email": email,
        "website": website or "https://thearc.org"
    }

def main():
    if not os.path.exists(states_json_path):
        print(f"Error: {states_json_path} does not exist. Run states parser first.")
        return

    with open(states_json_path, "r") as f:
        states_list = json.load(f)

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Clear old Arc records from nonprofit staging
    cursor.execute("DELETE FROM staging_scraped_nonprofit_organizations WHERE source_url LIKE '%thearc.org%'")
    conn.commit()
    print("✓ Cleared existing staging records from thearc.org.")

    # Get states mapping from DB
    cursor.execute("SELECT id, name, code FROM states")
    db_states = {row['name'].lower(): dict(row) for row in cursor.fetchall()}

    # Fetch all state directory pages concurrently
    print(f"⏳ Fetching state chapter directories for {len(states_list)} states...")
    state_pages = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_state = {executor.submit(fetch_url, s['url']): s for s in states_list}
        for future in as_completed(future_to_state):
            s = future_to_state[future]
            res = future.result()
            if res:
                state_pages[s['state']] = (res, s['url'])
                print(f"  ✓ Fetched directory for {s['state']}")
            else:
                print(f"  ❌ Failed to fetch directory for {s['state']}")

    # Extract all unique chapter URLs grouped by state
    chapter_urls_by_state = {}
    total_chapters_count = 0
    for state_name, (html_content, state_url) in state_pages.items():
        links = re.findall(r'href=["\']((?:https://thearc.org)?/chapter/[a-zA-Z0-9_-]+/?)["\']', html_content)
        
        unique_chapters = set()
        for l in links:
            abs_url = urllib.parse.urljoin("https://thearc.org", l)
            if not abs_url.endswith("/"):
                abs_url += "/"
            # Filter out state directory URL and base chapter path
            if abs_url.lower() != state_url.lower() and abs_url.lower() != "https://thearc.org/chapter/":
                unique_chapters.add(abs_url)
                
        chapter_urls_by_state[state_name] = list(unique_chapters)
        total_chapters_count += len(unique_chapters)
        print(f"  Found {len(unique_chapters)} local chapters for {state_name}")

    print(f"\nTotal unique chapters to fetch: {total_chapters_count}")

    # Flatten and map URLs to their state
    chapter_tasks = []
    for state_name, urls in chapter_urls_by_state.items():
        for url in urls:
            chapter_tasks.append((state_name, url))

    # Fetch and parse all local chapter pages concurrently
    print(f"\n⏳ Fetching chapter detail pages concurrently...")
    parsed_chapters = []
    completed = 0
    
    with ThreadPoolExecutor(max_workers=15) as executor:
        future_to_chapter = {executor.submit(fetch_url, task[1]): task for task in chapter_tasks}
        for future in as_completed(future_to_chapter):
            state_name, url = future_to_chapter[future]
            html_content = future.result()
            completed += 1
            if html_content:
                details = parse_chapter_html(html_content, url)
                details['state_name'] = state_name
                details['url'] = url
                parsed_chapters.append(details)
                if completed % 20 == 0 or completed == total_chapters_count:
                    print(f"  Progress: {completed}/{total_chapters_count} chapter pages fetched.")
            else:
                print(f"  ❌ Failed to fetch chapter details for {url}")

    print(f"\n✓ Fetched details for {len(parsed_chapters)} chapters. Resolving counties and inserting into staging...")

    timestamp = datetime.now().isoformat()
    staged_count = 0

    for item in parsed_chapters:
        state_name = item['state_name'].lower()
        if state_name not in db_states:
            print(f"  ⚠️ State '{state_name}' not found in database states table. Skipping.")
            continue
            
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
            # Search for county name with word boundaries
            if re.search(r'\b' + re.escape(county_name_clean) + r'\b', name_lower):
                mapped_counties.append(county['id'])
                
        # If no county name in name, search in address
        if not mapped_counties and item['address']:
            for county in state_counties:
                county_name_clean = county['name'].lower().replace(" county", "").strip()
                if re.search(r'\b' + re.escape(county_name_clean) + r'\b', address_lower):
                    mapped_counties.append(county['id'])
                    
        # Fallback to all counties if still empty or is state chapter
        is_state_chapter = any(kw in name_lower for kw in ["state chapter", "the arc of " + state_name, "the arc of the state"])
        if not mapped_counties or is_state_chapter:
            mapped_counties = [c['id'] for c in state_counties]

        # Ingest to staging
        for county_id in mapped_counties:
            suggested_id = slugify(f"{state_id}-{county_id}-{item['name']}") + "-np"
            
            # Check duplicate in staging
            dup = cursor.execute("""
                SELECT id FROM staging_scraped_nonprofit_organizations 
                WHERE county_id = ? AND extracted_name = ? AND source_url = ?
            """, (county_id, item['name'], item['url'])).fetchone()
            
            if dup:
                continue
                
            cursor.execute("""
                INSERT INTO staging_scraped_nonprofit_organizations (
                    source_url, source_name, source_type, scraped_at, state_id, county_id,
                    confidence_score, extraction_notes, raw_text_excerpt, suggested_target_table,
                    suggested_target_id, review_status, extracted_name, extracted_website, extracted_phone, focus_condition
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item['url'],
                "The Arc Directory",
                "official_directory",
                timestamp,
                state_id,
                county_id,
                1.0,
                f"Scraped from The Arc chapter page for state {state_name}",
                f"Name: {item['name']}\nAddress: {item['address']}\nPhone: {item['phone']}\nEmail: {item['email']}",
                "nonprofit_organizations",
                suggested_id,
                "pending_review",
                item['name'],
                item['website'],
                item['phone'],
                "Intellectual and Developmental Disabilities"
            ))
            staged_count += 1

    conn.commit()
    conn.close()
    print(f"\n✓ Finished scraping The Arc Chapters. Total staged entries: {staged_count}")

if __name__ == "__main__":
    main()
