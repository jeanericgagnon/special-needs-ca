import json

with open("scratch/custom_audit_results.json") as f:
    data = json.load(f)

print(f"| State | Counties | offices_tot/mr/fb | districts_tot/mr/fb | state_res_tot/mr/fb | regional_ed_tot/mr/fb | nonprofit_tot/mr/fb | iep_adv_tot/mr/fb |")
print(f"|---|---|---|---|---|---|---|---|")

target_states = ["california", "texas", "florida", "pennsylvania", "georgia", "illinois", "new-york", "ohio"]
# We also want to see a general summary of other states

for s_id in sorted(data.keys()):
    if s_id in target_states or any(data[s_id][cat]["manual_review"] > 0 for cat in ["county_offices", "school_districts"]):
        s = data[s_id]
        print(f"| {s_id} | {s['counties']} | {s['county_offices']['total']}/{s['county_offices']['manual_review']}/{s['county_offices']['fallback']} | {s['school_districts']['total']}/{s['school_districts']['manual_review']}/{s['school_districts']['fallback']} | {s['state_resource_agencies']['total']}/{s['state_resource_agencies']['manual_review']}/{s['state_resource_agencies']['fallback']} | {s['regional_education_agencies']['total']}/{s['regional_education_agencies']['manual_review']}/{s['regional_education_agencies']['fallback']} | {s['nonprofit_organizations']['total']}/{s['nonprofit_organizations']['manual_review']}/{s['nonprofit_organizations']['fallback']} | {s['iep_advocates']['total']}/{s['iep_advocates']['manual_review']}/{s['iep_advocates']['fallback']} |")
