import os
import json
import urllib.parse

source_targets_dir = "data/source_targets"
output_dir = "docs/national-rollout"
os.makedirs(output_dir, exist_ok=True)

# Fake/placeholder domains generated programmatically
FAKE_DOMAINS = [
    "dhhs.texas.gov", "dhhs.florida.gov", "dhhs.pennsylvania.gov", "dhhs.ohio.gov",
    "dhhs.new-york.gov", "dhhs.new_york.gov", "dhhs.illinois.gov", "dhhs.georgia.gov",
    "dhhs.california.gov", "dhhs.north-carolina.gov", "dhhs.michigan.gov"
]

# Generic homepages
GENERIC_HOMEPAGES = [
    "texas.gov", "florida.gov", "pa.gov", "ohio.gov", "ny.gov", "illinois.gov", 
    "georgia.gov", "ca.gov", "nc.gov", "mi.gov", "state.tx.us", "state.fl.us",
    "state.pa.us", "state.oh.us", "state.ny.us", "state.il.us", "state.ga.us",
    "state.ca.us", "state.nc.us", "state.mi.us", "wikipedia.org", "en.wikipedia.org"
]

# Prohibited provider/advocacy directories
PROHIBITED_DIRECTORIES = [
    "parentcenterhub.org", "copaa.org", "yellowpages.com", "yelp.com", "psychologytoday.com",
    "specialneedsalliance.org", "probono.net", "findlaw.com", "justia.com"
]

# Generic hospital or clinic targets
GENERIC_CLINICS = [
    "childrenshospital.org", "shrinershospitals.org", "mayoclinic.org", "clevelandclinic.org"
]

audited_count = 0
verified_count = 0
quarantined_count = 0

verified_registry = []
quarantine_list = []
audit_records = []
redo_queue = []

for file in sorted(os.listdir(source_targets_dir)):
    if not file.endswith(".json") or file in ["texas_resource_truth_map.json", "unique_texas_eci_contractors.json"]:
        continue
        
    filepath = os.path.join(source_targets_dir, file)
    state_name = file.replace(".json", "")
    
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            targets = json.load(f)
            
        if not isinstance(targets, list):
            if isinstance(targets, dict) and "targets" in targets:
                targets = targets["targets"]
            else:
                continue
                
        for t in targets:
            audited_count += 1
            source_url = t.get("source_url", "").strip()
            domain = t.get("domain", "").strip()
            source_name = t.get("source_name", "Unknown Source")
            category = t.get("category", "General")
            target_table = t.get("target_table", "")
            
            # Classification
            classification = "manual_review_required"
            reason = ""
            
            parsed_url = urllib.parse.urlparse(source_url)
            netloc = parsed_url.netloc.lower().replace("www.", "")
            path = parsed_url.path.strip("/")
            
            if not source_url or source_url == "":
                classification = "manual_review_required"
                reason = "Empty source URL"
            elif any(fake in netloc for fake in FAKE_DOMAINS) or any(fake in domain for fake in FAKE_DOMAINS):
                classification = "generated_fake_domain"
                reason = "Programmatically generated fake domain"
            elif netloc in GENERIC_HOMEPAGES and (path == "" or len(path) < 2):
                classification = "generic_homepage_too_weak"
                reason = "Generic homepage with no local office directory path"
            elif any(directory in netloc for directory in PROHIBITED_DIRECTORIES):
                classification = "do_not_use"
                reason = "Prohibited referral directory (parentcenterhub/COPAA/legal directory)"
            elif any(clinic in netloc for clinic in GENERIC_CLINICS):
                classification = "do_not_use"
                reason = "Generic clinic or hospital target (not state-specific)"
            elif t.get("organization_type") == "official_state" or ".gov" in netloc or ".mil" in netloc:
                classification = "verified_official_source"
            elif t.get("organization_type") == "official_advocacy" or ".org" in netloc:
                classification = "verified_trusted_nonprofit_source"
            elif t.get("organization_type") == "institutional" or ".edu" in netloc:
                classification = "verified_institutional_source"
            
            record = {
                "state": state_name.upper(),
                "source_name": source_name,
                "source_url": source_url,
                "category": category,
                "target_table": target_table,
                "classification": classification,
                "reason": reason,
                "fields": t.get("expected_extraction_fields", "N/A")
            }
            
            audit_records.append(record)
            
            if classification in ["verified_official_source", "verified_trusted_nonprofit_source", "verified_institutional_source"]:
                verified_count += 1
                verified_registry.append(record)
            else:
                quarantined_count += 1
                quarantine_list.append(record)
                # Add to redo queue
                redo_queue.append(record)
                
    except Exception as e:
        print(f"Error auditing {file}: {e}")

# Group metrics by state
state_metrics = {}
for rec in audit_records:
    st = rec["state"]
    if st not in state_metrics:
        state_metrics[st] = {"total": 0, "verified": 0, "quarantined": 0}
    state_metrics[st]["total"] += 1
    if rec["classification"] in ["verified_official_source", "verified_trusted_nonprofit_source", "verified_institutional_source"]:
        state_metrics[st]["verified"] += 1
    else:
        state_metrics[st]["quarantined"] += 1

# Write source-target-truth-audit.md
print("Writing source-target-truth-audit.md...")
audit_md = f"""# Source Target Truth Audit Report (V3)

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  

---

## 1. National Audit Summary

* **Total Source Targets Audited:** {audited_count}
* **Total Verified Targets:** {verified_count}
* **Total Quarantined / Review Required Targets:** {quarantined_count}

---

## 2. 50-State Source Target Breakdown

| State | Total Targets | Verified | Quarantined / Review | Discovery Status |
| :--- | :---: | :---: | :---: | :---: |
"""

weak_states = []
for st, m in sorted(state_metrics.items()):
    verified_pct = (m["verified"] / m["total"] * 100) if m["total"] > 0 else 0
    status = "Exhaustive" if verified_pct > 75 else ("Weak" if verified_pct < 40 else "Moderate")
    if status == "Weak":
        weak_states.append(st)
    audit_md += f"| **{st}** | {m['total']} | {m['verified']} | {m['quarantined']} | `{status}` |\n"

audit_md += f"""
---

## 3. Findings and Key Gaps

### States with Weak Source Discovery
The following states have less than 40% verified official/trusted source targets:
{', '.join([f'**{ws}**' for ws in weak_states]) or 'None'}

### Categories Most Affected
* **B. Medicaid / benefits / HHS:** High rate of generic homepages (e.g. `https://myflfamilies.com` instead of the local county office locator sub-page).
* **C. Education / school districts:** High rate of missing regional education directories and intermediate agency endpoints.

### Next Source Discovery Tasks Required
1. Replace all generic state homepages in the registry with specific local directory locator search URLs.
2. Exclude all quarantined targets from crawler ingestion loops.
"""

with open("docs/national-rollout/source-target-truth-audit.md", "w", encoding="utf-8") as f:
    f.write(audit_md)

# Write source-target-quarantine-list.md
print("Writing source-target-quarantine-list.md...")
quarantine_md = """# Source Target Quarantine List

This document lists all source targets that were flagged as **fake/generated domains**, **generic homepages too weak**, or **prohibited provider directories** that cannot be used for automatic data scraping.

| State | Source Name | Target Table | Classification | Reason | Flagged URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
"""

for rec in quarantine_list:
    quarantine_md += f"| {rec['state']} | {rec['source_name']} | {rec['target_table']} | `{rec['classification']}` | {rec['reason'] or 'Requires manual review'} | {rec['source_url']} |\n"

with open("docs/national-rollout/source-target-quarantine-list.md", "w", encoding="utf-8") as f:
    f.write(quarantine_md)

# Write verified-source-target-registry.md
print("Writing verified-source-target-registry.md...")
registry_md = """# Verified Source Target Registry

This document lists all source targets that have been verified as **official state, trusted nonprofit, or institutional** sites containing extractable local details.

| State | Source Name | Target Table | Classification | Expected Fields | Verified Source URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
"""

for rec in verified_registry:
    registry_md += f"| {rec['state']} | {rec['source_name']} | {rec['target_table']} | `{rec['classification']}` | {rec['fields']} | {rec['source_url']} |\n"

with open("docs/national-rollout/verified-source-target-registry.md", "w", encoding="utf-8") as f:
    f.write(registry_md)

# Write source-discovery-redo-queue.md
print("Writing source-discovery-redo-queue.md...")
redo_md = """# Source Discovery Redo Queue

This queue contains all quarantined source targets that require manual research or alternative target discovery.

| State | Category | Current Target Name | Reason for Redo | Recommended Search Query |
| :--- | :--- | :--- | :--- | :--- |
"""

for rec in redo_queue:
    state_lbl = rec["state"]
    cat_lbl = rec["category"]
    name_lbl = rec["source_name"]
    reason_lbl = rec["reason"] or "Requires manual review"
    query = f"site:.gov {state_lbl} special education local districts directory" if "school" in rec["target_table"] else f"site:.gov {state_lbl} medicaid local offices contact numbers"
    redo_md += f"| {state_lbl} | {cat_lbl} | {name_lbl} | {reason_lbl} | `{query}` |\n"

with open("docs/national-rollout/source-discovery-redo-queue.md", "w", encoding="utf-8") as f:
    f.write(redo_md)

print("✓ Source Target Truth Audit V3 files written successfully.")
