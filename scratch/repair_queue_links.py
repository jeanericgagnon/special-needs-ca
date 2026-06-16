import re
import os
import urllib.parse

# Fake patterns to check
fake_patterns = [
    r'dhhs\.[a-z-]+\.gov',
    r'education\.[a-z-]+\.gov',
    r'www\.thearc[a-z-]+\.org',
    r'childrenshospital\.org',
    r'parentcenterhub\.org',
    r'copaa\.org',
    r'[a-z-]+-lidda\.tx\.gov'
]

real_exceptions = [
    'dhhs.nh.gov', 'dhhs.ne.gov', 'dhhs.nv.gov',
    'education.pa.gov', 'education.ohio.gov', 'education.mn.gov',
    'education.vermont.gov', 'education.alaska.gov', 'education.ne.gov',
    'education.nh.gov', 'education.ky.gov', 'education.wv.gov',
    'education.wy.gov', 'thearctx.org'
]

def is_fake_url(url):
    match = re.search(r'https?://([^/]+)', url)
    if not match:
        return False
    domain = match.group(1).lower()
    for pat in fake_patterns:
        if re.search(pat, domain):
            if domain not in real_exceptions:
                return True
    return False

def get_search_url(state, name):
    state_clean = state.strip().title()
    name_clean = name.strip()
    
    # Customize search term based on name/category
    query = f"site:.gov {state_clean} {name_clean}"
    if "Medicaid" in name_clean or "DFCS" in name_clean or "HHS" in name_clean:
        query = f"site:.gov {state_clean} medicaid office contact telephone"
    elif "Developmental" in name_clean or "DD" in name_clean:
        query = f"site:.gov {state_clean} developmental disabilities intake services"
    elif "Early Intervention" in name_clean or "Part C" in name_clean:
        query = f"site:.gov {state_clean} early intervention coordinator contact info"
    elif "School District" in name_clean or "Public Schools" in name_clean:
        query = f"site:.gov {state_clean} {name_clean} special education contact department"
        
    encoded_query = urllib.parse.quote_plus(query)
    return f"https://www.google.com/search?q={encoded_query}"

def process_file(file_path):
    if not os.path.exists(file_path):
        print(f"Skipping {file_path} (not found)")
        return
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    lines = content.splitlines()
    new_lines = []
    updated_count = 0
    
    for line in lines:
        if not line.strip() or not line.startswith("|"):
            new_lines.append(line)
            continue
            
        parts = [p.strip() for p in line.split("|")]
        # Detect state and name based on column structures
        state = ""
        name = ""
        
        # Structure for dd-ei-routing-review-queue.md:
        # | State | Category / Name | ID | Search Link | Time |
        if len(parts) >= 7 and parts[1].upper() in [
            'ALABAMA', 'ALASKA', 'ARIZONA', 'ARKANSAS', 'CALIFORNIA', 'COLORADO', 'CONNECTICUT', 'DELAWARE', 
            'FLORIDA', 'GEORGIA', 'HAWAII', 'IDAHO', 'ILLINOIS', 'INDIANA', 'IOWA', 'KANSAS', 'KENTUCKY', 
            'LOUISIANA', 'MAINE', 'MARYLAND', 'MASSACHUSETTS', 'MICHIGAN', 'MINNESOTA', 'MISSISSIPPI', 'MISSOURI', 
            'MONTANA', 'NEBRASKA', 'NEVADA', 'NEW-HAMPSHIRE', 'NEW-JERSEY', 'NEW-MEXICO', 'NEW-YORK', 'NORTH-CAROLINA', 
            'NORTH-DAKOTA', 'OHIO', 'OKLAHOMA', 'OREGON', 'PENNSYLVANIA', 'RHODE-ISLAND', 'SOUTH-CAROLINA', 'SOUTH-DAKOTA', 
            'TENNESSEE', 'TEXAS', 'UTAH', 'VERMONT', 'VIRGINIA', 'WASHINGTON', 'WEST-VIRGINIA', 'WISCONSIN', 'WYOMING'
        ]:
            state = parts[1]
            name = parts[2]
            
            # Find markdown link in columns
            for idx, p in enumerate(parts):
                link_match = re.search(r'\[([^\]]+)\]\((https?[^\)]+)\)', p)
                if link_match:
                    url = link_match.group(2)
                    if is_fake_url(url):
                        search_url = get_search_url(state, name)
                        parts[idx] = f"[Search Link]({search_url})"
                        updated_count += 1
                        
        # Structure for forms-library-missing-pdf-and-script-queue.md
        # | State | Form/Guide Title | Missing Direct Link |
        elif len(parts) >= 4 and parts[1].replace("*", "").upper() in [
            'ALABAMA', 'ALASKA', 'GEORGIA', 'NORTH CAROLINA', 'NORTH-CAROLINA'
        ]:
            state = parts[1].replace("*", "")
            name = parts[2]
            url = parts[3]
            if is_fake_url(url):
                search_url = get_search_url(state, name)
                parts[3] = search_url
                updated_count += 1
                
        # Reconstruct line
        # Clean up empty split elements from starting/ending pipes
        if len(parts) > 0 and parts[0] == "":
            parts = parts[1:]
        if len(parts) > 0 and parts[-1] == "":
            parts = parts[:-1]
        new_line = "| " + " | ".join(parts) + " |"
        new_lines.append(new_line)
        
    if updated_count > 0:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write("\n".join(new_lines) + "\n")
        print(f"Updated {updated_count} fake links in {file_path}")
    else:
        print(f"No fake links updated in {file_path}")

def main():
    files = [
        "docs/national-rollout/dd-ei-routing-review-queue.md",
        "docs/national-rollout/county-office-review-queue.md",
        "docs/national-rollout/school-district-review-queue.md",
        "docs/forms-library-missing-pdf-and-script-queue.md",
        "docs/national-rollout/nonprofit-seeding-queue.md"
    ]
    for f in files:
        process_file(f)

if __name__ == '__main__':
    main()
