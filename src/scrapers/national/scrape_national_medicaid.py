import sqlite3
import urllib.request
import csv
import io
import re
import sys
import os
import requests
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

db_path = "/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db"

state_id_to_code = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
    'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
    'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
    'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
    'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new-hampshire': 'NH',
    'new-jersey': 'NJ', 'new-mexico': 'NM', 'new-york': 'NY', 'north-carolina': 'NC',
    'north-dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA',
    'rhode-island': 'RI', 'south-carolina': 'SC', 'south-dakota': 'SD', 'tennessee': 'TN',
    'texas': 'TX', 'utah': 'UT', 'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA',
    'west-virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
}

state_medicaid_hotlines = {
    'AL': '(800) 362-1504', 'AK': '(800) 770-9755', 'AZ': '(800) 654-8713', 'AR': '(800) 482-5431',
    'CO': '(800) 221-3943', 'CT': '(877) 284-8759', 'DE': '(800) 372-2022', 'FL': '(877) 711-3662',
    'GA': '(877) 423-4746', 'HI': '(800) 316-8005', 'ID': '(877) 456-1233', 'IL': '(800) 843-6154',
    'IN': '(800) 403-0864', 'IA': '(800) 338-8366', 'KS': '(800) 766-9012', 'KY': '(800) 635-2570',
    'LA': '(888) 342-6207', 'ME': '(800) 977-6740', 'MD': '(800) 492-5231', 'MA': '(800) 841-2900',
    'MI': '(800) 642-3195', 'MN': '(800) 657-3739', 'MS': '(800) 421-2408', 'MO': '(855) 373-4636',
    'MT': '(888) 706-1535', 'NE': '(855) 632-7633', 'NV': '(800) 992-0900', 'NH': '(844) 275-3447',
    'NJ': '(800) 356-1561', 'NM': '(800) 283-4465', 'NY': '(800) 541-2831', 'NC': '(800) 662-7030',
    'ND': '(844) 854-4825', 'OH': '(800) 324-8680', 'OK': '(800) 987-7767', 'OR': '(800) 699-9075',
    'PA': '(800) 692-7462', 'RI': '(855) 697-4347', 'SC': '(888) 549-0820', 'SD': '(800) 597-1603',
    'TN': '(800) 342-3145', 'TX': '(877) 541-7905', 'UT': '(866) 435-7414', 'VT': '(800) 250-8427',
    'VA': '(855) 242-8282', 'WA': '(800) 562-3022', 'WV': '(888) 542-5034', 'WI': '(800) 362-3002',
    'WY': '(855) 294-2440'
}

state_medicaid_websites = {
    'AL': 'https://medicaid.alabama.gov/', 'AK': 'https://health.alaska.gov/dhcs/Pages/default.aspx',
    'AZ': 'https://www.azahcccs.gov/', 'AR': 'https://humanservices.arkansas.gov/divisions-shared-services/medical-services/',
    'CO': 'https://www.healthfirstcolorado.com/', 'CT': 'https://portal.ct.gov/HUSKY',
    'DE': 'https://dhss.delaware.gov/dhss/dmma/', 'FL': 'https://www.myflfamilies.com/services/public-assistance/medicaid',
    'GA': 'https://medicaid.georgia.gov/', 'HI': 'https://medquest.hawaii.gov/',
    'ID': 'https://healthandwelfare.idaho.gov/services-programs/medicaid-health', 'IL': 'https://hfs.illinois.gov/',
    'IN': 'https://www.in.gov/medicaid/', 'IA': 'https://hhs.iowa.gov/ime',
    'KS': 'https://www.kancare.ks.gov/', 'KY': 'https://chfs.ky.gov/agencies/dms/Pages/default.aspx',
    'LA': 'https://ldh.la.gov/subhome/1', 'ME': 'https://www.maine.gov/dhhs/ofi/applications-forms',
    'MD': 'https://health.maryland.gov/mmcp/Pages/home.aspx', 'MA': 'https://www.mass.gov/topics/masshealth',
    'MI': 'https://www.michigan.gov/mdhhs/assistance-programs/medicaid', 'MN': 'https://mn.gov/dhs/people-we-serve/seniors/health-care/health-care-programs/',
    'MS': 'https://medicaid.ms.gov/', 'MO': 'https://mydss.mo.gov/healthcare',
    'MT': 'https://dphhs.mt.gov/brd/medicaid', 'NE': 'https://dhhs.ne.gov/Pages/Medicaid-Eligibility.aspx',
    'NV': 'https://dhcfp.nv.gov/', 'NH': 'https://www.dhhs.nh.gov/programs-services/medicaid',
    'NJ': 'https://www.state.nj.us/humanservices/dmahs/clients/medicaid/', 'NM': 'https://www.hsd.state.nm.us/lookingforassistance/medical_assistance_division.aspx',
    'NY': 'https://www.health.ny.gov/health_care/medicaid/', 'NC': 'https://medicaid.ncdhhs.gov/',
    'ND': 'https://www.hhs.nd.gov/healthcare', 'OH': 'https://medicaid.ohio.gov/',
    'OK': 'https://oklahoma.gov/ohca.html', 'OR': 'https://www.oregon.gov/oha/hsd/ohp/pages/index.aspx',
    'PA': 'https://www.dhs.pa.gov/Services/Assistance/Pages/Medical-Assistance.aspx', 'RI': 'https://eohhs.ri.gov/consumer/medicaid-eligibility',
    'SC': 'https://www.scdhhs.gov/', 'SD': 'https://dss.sd.gov/medicaid/',
    'TN': 'https://www.tn.gov/tenncare.html', 'TX': 'https://www.hhs.texas.gov/services/health/medicaid-chip',
    'UT': 'https://medicaid.utah.gov/', 'VT': 'https://dvha.vermont.gov/',
    'VA': 'https://www.coverva.dmas.virginia.gov/', 'WA': 'https://www.hca.wa.gov/free-or-low-cost-health-care/i-need-medical-dental-or-vision-care/apple-health-medicaid-coverage',
    'WV': 'https://dhhr.wv.gov/bms/Pages/default.aspx', 'WI': 'https://www.dhs.wisconsin.gov/medicaid/index.htm',
    'WY': 'https://health.wyo.gov/healthcarefin/medicaid/'
}

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def clean_county_name(name):
    name = name.lower()
    name = re.sub(r'\b(county|parish|borough|census area|municipality|city and county|city)\b', '', name)
    return name.strip()

def geocode_coordinate_fallback(longitude, latitude):
    url = f"https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x={longitude}&y={latitude}&benchmark=Public_AR_Current&vintage=Current_Current&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            counties = data.get('result', {}).get('geographies', {}).get('Counties', [])
            if counties:
                return counties[0].get('GEOID')
    except Exception as e:
        pass
    return None

def main():
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Load counties from DB
    cursor.execute("SELECT id, name, state_id FROM counties")
    counties = cursor.fetchall()

    county_map = {}
    for c in counties:
        state_code = state_id_to_code.get(c['state_id'])
        if not state_code:
            continue
        clean_name = clean_county_name(c['name'])
        county_map[(state_code, clean_name)] = c['id']
        county_map[(state_code, slugify(clean_name).replace('-', ''))] = c['id']

    # 1. Download FIPS national_county.txt
    print("⏳ Downloading Census FIPS county reference...")
    fips_to_county = {}
    try:
        req = urllib.request.Request("https://www2.census.gov/geo/docs/reference/codes/files/national_county.txt", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as res:
            lines = res.read().decode('utf-8').split('\n')
            for line in lines:
                if not line.strip():
                    continue
                parts = [p.strip() for p in line.split(',')]
                if len(parts) >= 4:
                    state_code, state_fips, county_fips, county_name, _ = parts[:5]
                    # Format state+county FIPS e.g. "01073"
                    fips_to_county[state_fips + county_fips] = (state_code, clean_county_name(county_name))
        print(f"✓ Loaded {len(fips_to_county)} county FIPS mappings.")
    except Exception as e:
        print(f"❌ Failed to load Census FIPS: {e}")
        return

    # 2. Download offices_data.tab from Dataverse
    print("⏳ Downloading Boston University geocoded Medicaid offices dataset...")
    try:
        req = urllib.request.Request("https://dataverse.harvard.edu/api/access/datafile/8943772", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as res:
            tab_content = res.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(tab_content), delimiter='\t')
        rows = list(reader)
        print(f"✓ Downloaded {len(rows)} office records.")
    except Exception as e:
        print(f"❌ Failed to download offices: {e}")
        return

    # 3. Filter out California
    rows = [r for r in rows if r['state'] != 'CA']
    print(f"Filtered to {len(rows)} offices (excluding CA).")

    # 4. Prepare addressbatch CSV
    print("⏳ Sending batch geocoding request to U.S. Census Bureau Addressbatch API...")
    url = "https://geocoding.geo.census.gov/geocoder/geographies/addressbatch"
    
    geocoded_results = {}
    batch_size = 1000
    
    for start_idx in range(0, len(rows), batch_size):
        end_idx = min(start_idx + batch_size, len(rows))
        print(f"  Geocoding batch {start_idx // batch_size + 1}... (Rows {start_idx} to {end_idx})")
        
        csv_content = io.StringIO()
        csv_writer = csv.writer(csv_content)
        
        for idx in range(start_idx, end_idx):
            r = rows[idx]
            street = r['street1']
            if r['street2']:
                street += ' ' + r['street2']
            csv_writer.writerow([idx, street, r['city'], r['state'], r['zip_code']])
            
        try:
            files = {'addressFile': ('batch.csv', csv_content.getvalue().encode('utf-8'), 'text/csv')}
            data = {
                'benchmark': 'Public_AR_Current',
                'vintage': 'Current_Current'
            }
            response = requests.post(url, files=files, data=data, timeout=90)
            
            # Parse response CSV
            resp_reader = csv.reader(io.StringIO(response.text))
            for resp_row in resp_reader:
                if len(resp_row) < 12:
                    continue
                row_id_str, _, match_status = resp_row[:3]
                row_id = int(row_id_str)
                
                if match_status == "Match" or match_status == "Tie":
                    state_fips = resp_row[8]
                    county_fips = resp_row[9]
                    geocoded_results[row_id] = state_fips + county_fips
        except Exception as e:
            print(f"  ⚠️ Batch geocoding failed for this batch: {e}")

    print(f"✓ Batch geocoding completed. Matched {len(geocoded_results)} / {len(rows)} offices.")

    # 5. Geocode unmatched rows via coordinates fallback
    unmatched_rows = [i for i in range(len(rows)) if i not in geocoded_results]
    if unmatched_rows:
        print(f"⏳ Reverse-geocoding {len(unmatched_rows)} unmatched coordinates via fallback API...")
        
        def process_unmatched(idx):
            r = rows[idx]
            lat = r.get('latitude')
            lon = r.get('longitude')
            if lat and lon:
                geoid = geocode_coordinate_fallback(lon, lat)
                if geoid:
                    return idx, geoid
            return idx, None

        with ThreadPoolExecutor(max_workers=20) as executor:
            futures = {executor.submit(process_unmatched, idx): idx for idx in unmatched_rows}
            for fut in as_completed(futures):
                idx, geoid = fut.result()
                if geoid:
                    geocoded_results[idx] = geoid

        matched_count = sum(1 for i in range(len(rows)) if i in geocoded_results)
        print(f"✓ Coordinate fallback complete. Total matched: {matched_count} / {len(rows)}")

    # 6. Map and group offices by county
    offices_by_county = {}
    failed_mappings = 0

    for idx, r in enumerate(rows):
        geoid = geocoded_results.get(idx)
        county_id = None
        
        if geoid:
            fips_info = fips_to_county.get(geoid)
            if fips_info:
                state_code, county_clean = fips_info
                county_id = county_map.get((state_code, county_clean))
                if not county_id:
                    county_id = county_map.get((state_code, slugify(county_clean).replace('-', '')))
        
        # If FIPS geocoding failed, try direct city-state county fallback lookup
        if not county_id:
            # Look for any county in the state that matches city/county names
            state_code = r['state']
            clean_c = clean_county_name(r['city'])
            county_id = county_map.get((state_code, clean_c))
            
        if not county_id:
            failed_mappings += 1
            continue
            
        if county_id not in offices_by_county:
            offices_by_county[county_id] = []
        offices_by_county[county_id].append(r)

    print(f"Mapped offices to {len(offices_by_county)} counties. Failed mappings: {failed_mappings}")

    # 7. Delete existing storefront placeholder offices
    print("⏳ Purging existing placeholder storefront offices...")
    cursor.execute("""
        DELETE FROM county_offices 
        WHERE office_name LIKE '%storefront%' OR office_name LIKE '%placeholder%'
    """)
    conn.commit()
    print("✓ Purged placeholder storefront offices.")

    # 8. Ingest the physical offices
    staged_inserts = []
    timestamp = datetime.now().isoformat()

    for county_id, plist in offices_by_county.items():
        # Clean out any old scraped offices in these counties to prevent duplication
        # (We only do this for counties where we have real physical offices)
        state_code = county_id.split('-')[-1].upper()
        program_id = f"{state_code.lower()}-medicaid"
        
        cursor.execute("""
            DELETE FROM county_offices 
            WHERE county_id = ? AND program_id = ? AND data_origin = 'scraped'
        """, (county_id, program_id))
        
        # Insert all offices for this county with sequential index IDs
        for idx, r in enumerate(plist):
            office_id = f"off-{county_id}-medicaid-{idx+1}"
            
            # Format Address
            addr_parts = [r['street1']]
            if r['street2']:
                addr_parts.append(r['street2'])
            addr_parts.append(f"{r['city']}, {r['state']} {r['zip_code']}")
            full_address = ", ".join(addr_parts)
            
            office_name = r['agency_name'].strip()
            # If office name doesn't specify county/state, make it clearer
            if not office_name.lower().startswith(r['state'].lower()) and not office_name.lower().startswith(county_id.split('-')[0]):
                office_name = f"Medicaid Office - {office_name}"

            phone = state_medicaid_hotlines.get(r['state'], "(800) 555-2674")
            website = state_medicaid_websites.get(r['state'], "https://www.medicaid.gov/")

            staged_inserts.append((
                office_id,
                county_id,
                program_id,
                office_name,
                full_address,
                phone,
                "", # email
                website,
                "https://doi.org/10.7910/DVN/AVRHMI",
                "official_directory_extract",
                "scraped",
                "unverified",
                timestamp,
                0.85,
                "source_listed"
            ))

    if staged_inserts:
        cursor.executemany("""
            INSERT OR REPLACE INTO county_offices (
                id, county_id, program_id, office_name, address, phone, email, website,
                source_url, source_type, data_origin, verification_status, last_verified_date,
                confidence_score, evidence_level
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, staged_inserts)
        conn.commit()
        print(f"🎉 Ingestion complete! Total physical Medicaid offices added: {len(staged_inserts)}")

    conn.close()

if __name__ == "__main__":
    main()
