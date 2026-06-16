import sqlite3

db_path = "ca_disability_navigator.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# List of 54 dead/stale URLs from the repair queue
dead_stale_urls = [
    "https://integralcare.org/en/client-rights/",
    "https://integralcare.org/en/services/",
    "https://www.aogh.org",
    "https://www.ccisd.net/specialeducation",
    "https://www.ccisd.us/Special-Education",
    "https://www.cfisd.net/Page/1886",
    "https://www.chesco.org/817/Mental-Health-Intellectual-Dev-Disabilit",
    "https://www.co.lancaster.pa.us/146/Behavioral-Health-Developmental-Services",
    "https://www.conroeisd.net/department/special-education/",
    "https://www.countyofberks.com/departments/mental-health-and-developmental-disabilities",
    "https://www.dentonisd.org/specialeducation",
    "https://www.ecisd.us/apps/pages/special-education",
    "https://www.fortbendisd.com/sped",
    "https://www.fwisd.org/page/1199",
    "https://www.houstonisd.org/sped",
    "https://www.myflfamilies.com/ACCESS",
    "https://www.nisd.net/schools/special-education",
    "https://www.pearlandisd.org/departments/special-education",
    "https://www.phila.gov/services/mental-health-disabilities/register-for-intellectual-disability-services/",
    "https://www.pisd.edu/sped",
    "https://www.rehabworks.org/student-youth/transition.html",
    "https://www.theharriscenter.org/About-Us/Rights-and-Privacy",
    "https://www.theharriscenter.org/Services/Intellectual-and-Developmental-Disability-Services",
    "https://sdolancaster.org/",
    "https://thearctampabay.org",
    "https://www.afi-polk.org",
    "https://www.arcdallas.org",
    "https://www.arcnetx.org",
    "https://www.arcofcentralflorida.org",
    "https://www.arcofsa.org",
    "https://www.arcsf.org",
    "https://www.arcspacecoast.org",
    "https://www.arctallahassee.org",
    "https://www.cmsplan.floridahealth.gov/",
    "https://www.dsaoh.org",
    "https://www.dsast.org",
    "https://www.education.pa.gov/K-12/Special%20Education/Pages/default.aspx",
    "https://www.larcleeco.org",
    "https://www.pennsbury.k12.pa.us",
    "https://www.thearcoftexas.org",
    "https://www.thearctb.org",
    "https://www.txf2f.org",
    "https://www.vailtx.org",
    "https://fccflorida.org",
    "https://tea.texas.gov/reports-and-data/school-performance/accountability-research/school-district-locator",
    "https://www.arcflorida.org",
    "https://www.arcofthecapitalarea.org",
    "https://www.autismsocietyep.org",
    "https://www.delcopa.gov/",
    "https://www.delcopa.gov/humanservices/intellectualdisabilities.html",
    "https://www.montcopa.org/",
    "https://www.montcopa.org/168/Behavioral-Health-Developmental-Disabilit",
    "https://www.navigatelifetexas.org",
    "https://www.rgvdsa.org"
]

tables_columns = [
    ("county_offices", ["website", "source_url"]),
    ("school_districts", ["website", "source_url"]),
    ("nonprofit_organizations", ["website", "source_url"]),
    ("programs", ["official_source_url", "source_url"]),
    ("state_resource_agencies", ["website", "source_url", "source_urls", "eligibility_info_page", "services_page", "appeals_info"])
]

found_records = []

for table, cols in tables_columns:
    for col in cols:
        for url in dead_stale_urls:
            # Check for exact matches
            cursor.execute(f"SELECT id, {col} FROM {table} WHERE {col} = ?", (url,))
            rows = cursor.fetchall()
            for row_id, val in rows:
                found_records.append((table, col, row_id, val))
                
            # Check for partial matches or trailing slashes mismatches
            if url.endswith("/"):
                url_alt = url[:-1]
            else:
                url_alt = url + "/"
            cursor.execute(f"SELECT id, {col} FROM {table} WHERE {col} = ?", (url_alt,))
            rows = cursor.fetchall()
            for row_id, val in rows:
                found_records.append((table, col, row_id, val))

with open("scratch/found_db_links.txt", "w") as f:
    f.write(f"Found {len(found_records)} usages of dead/stale URLs:\n")
    for t, c, r_id, val in found_records:
        f.write(f"Table: {t:<25} | Column: {c:<12} | ID: {r_id:<25} | Value: {val}\n")

print(f"✓ Saved {len(found_records)} records to scratch/found_db_links.txt")
conn.close()
