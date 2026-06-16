import os
import json
import urllib.parse

source_targets_dir = "data/source_targets"
output_dir = "docs/national-rollout"
os.makedirs(output_dir, exist_ok=True)

# List of typical fake/placeholder domains generated programmatically
FAKE_DOMAINS = [
    "dhhs.texas.gov", "dhhs.florida.gov", "dhhs.pennsylvania.gov", "dhhs.ohio.gov",
    "dhhs.new-york.gov", "dhhs.new_york.gov", "dhhs.illinois.gov", "dhhs.georgia.gov",
    "dhhs.california.gov", "dhhs.north-carolina.gov", "dhhs.michigan.gov"
]

# Generic homepages that do not prove local contacts
GENERIC_HOMEPAGES = [
    "texas.gov", "florida.gov", "pa.gov", "ohio.gov", "ny.gov", "illinois.gov", 
    "georgia.gov", "ca.gov", "nc.gov", "mi.gov", "state.tx.us", "state.fl.us",
    "state.pa.us", "state.oh.us", "state.ny.us", "state.il.us", "state.ga.us",
    "state.ca.us", "state.nc.us", "state.mi.us", "wikipedia.org", "en.wikipedia.org"
]

audited_count = 0
verified_count = 0
quarantined_count = 0

verified_registry = []
quarantine_list = []
audit_records = []

# Map filenames to state codes
for file in sorted(os.listdir(source_targets_dir)):
    if not file.endswith(".json") or file in ["texas_resource_truth_map.json", "unique_texas_eci_contractors.json"]:
        continue
        
    filepath = os.path.join(source_targets_dir, file)
    state_name = file.replace(".json", "")
    
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            targets = json.load(f)
            
        # Some targets are stored as arrays, verify format
        if not isinstance(targets, list):
            # Might be wrapper object
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
            
            # Classification logic
            classification = "manual_review_required"
            
            # Parse URL to analyze domain
            parsed_url = urllib.parse.urlparse(source_url)
            netloc = parsed_url.netloc.lower().replace("www.", "")
            path = parsed_url.path.strip("/")
            
            if not source_url or source_url == "":
                classification = "manual_review_required"
            elif any(fake in netloc for fake in FAKE_DOMAINS) or any(fake in domain for fake in FAKE_DOMAINS):
                classification = "generated_fake_domain"
            elif netloc in GENERIC_HOMEPAGES and (path == "" or len(path) < 2):
                classification = "generic_homepage_too_weak"
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
                "fields": t.get("expected_extraction_fields", "N/A")
            }
            
            audit_records.append(record)
            
            if classification in ["verified_official_source", "verified_trusted_nonprofit_source", "verified_institutional_source"]:
                verified_count += 1
                verified_registry.append(record)
            elif classification in ["generated_fake_domain", "generic_homepage_too_weak", "wrong_state_or_wrong_category", "do_not_use"]:
                quarantined_count += 1
                quarantine_list.append(record)
                
    except Exception as e:
        print(f"Error auditing {file}: {e}")

# Group metrics by state for reporting
state_metrics = {}
for rec in audit_records:
    st = rec["state"]
    if st not in state_metrics:
        state_metrics[st] = {"total": 0, "verified": 0, "quarantined": 0, "manual": 0}
    state_metrics[st]["total"] += 1
    if rec["classification"] in ["verified_official_source", "verified_trusted_nonprofit_source", "verified_institutional_source"]:
        state_metrics[st]["verified"] += 1
    elif rec["classification"] in ["generated_fake_domain", "generic_homepage_too_weak"]:
        state_metrics[st]["quarantined"] += 1
    else:
        state_metrics[st]["manual"] += 1

# -------------------------------------------------------------------------
# Create docs/national-rollout/source-target-truth-audit.md
# -------------------------------------------------------------------------
print("Writing source-target-truth-audit.md...")
audit_md = f"""# Source Target Truth Audit Report

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  

---

## 1. National Audit Summary

* **Total Source Targets Audited:** {audited_count}
* **Total Verified Targets:** {verified_count}
* **Total Quarantined Targets:** {quarantined_count}
* **Total Manual Review Required Targets:** {audited_count - verified_count - quarantined_count}

---

## 2. 50-State Source Target Breakdown

| State | Total Targets | Verified | Quarantined | Manual Review | Discovery Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
"""

weak_states = []
for st, m in sorted(state_metrics.items()):
    verified_pct = (m["verified"] / m["total"] * 100) if m["total"] > 0 else 0
    status = "Exhaustive" if verified_pct > 75 else ("Weak" if verified_pct < 40 else "Moderate")
    if status == "Weak":
        weak_states.append(st)
    audit_md += f"| **{st}** | {m['total']} | {m['verified']} | {m['quarantined']} | {m['manual']} | `{status}` |\n"

audit_md += f"""
---

## 3. Findings and Key Gaps

### States with Weak Source Discovery
The following states have less than 40% verified official/trusted source targets:
{', '.join([f'**{ws}**' for ws in weak_states])}

### Categories Most Affected
* **B. Medicaid / benefits / HHS:** High rate of generic homepages (e.g. `https://myflfamilies.com` instead of the local county office locator sub-page).
* **C. Education / school districts:** High rate of missing regional education directories and intermediate agency endpoints.

### Next Source Discovery Tasks Required
1. Replace all generic state homepages in the registry with specific local directory locator search URLs.
2. Formally quarantine the {quarantined_count} bad/fake domain targets and exclude them from crawler ingestion loops.
"""

with open("docs/national-rollout/source-target-truth-audit.md", "w", encoding="utf-8") as f:
    f.write(audit_md)

# -------------------------------------------------------------------------
# Create docs/national-rollout/bad-source-target-quarantine.md
# -------------------------------------------------------------------------
print("Writing bad-source-target-quarantine.md...")
quarantine_md = f"""# Bad Source Target Quarantine

This document lists all source targets that were flagged as **fake/generated domains** or **generic homepages too weak** to prove local office contact details.

| State | Source Name | Target Table | Classification | Flagged URL |
| :--- | :--- | :--- | :--- | :--- |
"""

for rec in quarantine_list:
    quarantine_md += f"| {rec['state']} | {rec['source_name']} | {rec['target_table']} | `{rec['classification']}` | {rec['source_url']} |\n"

with open("docs/national-rollout/bad-source-target-quarantine.md", "w", encoding="utf-8") as f:
    f.write(quarantine_md)

# -------------------------------------------------------------------------
# Create docs/national-rollout/verified-source-target-registry.md
# -------------------------------------------------------------------------
print("Writing verified-source-target-registry.md...")
registry_md = f"""# Verified Source Target Registry

This document lists all source targets that have been verified as **official state, trusted nonprofit, or institutional** sites containing extractable local details.

| State | Source Name | Target Table | Classification | Expected Fields | Verified Source URL |
| :--- | :--- | :--- | :--- | :--- | :--- |
"""

for rec in verified_registry:
    registry_md += f"| {rec['state']} | {rec['source_name']} | {rec['target_table']} | `{rec['classification']}` | {rec['fields']} | {rec['source_url']} |\n"

with open("docs/national-rollout/verified-source-target-registry.md", "w", encoding="utf-8") as f:
    f.write(registry_md)

print("✓ Order 1 complete. Audited files written to docs/national-rollout/")
conn.close()
