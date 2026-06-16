import os
import json

states = ["georgia", "north-carolina", "michigan"]
for state in states:
    print(f"=== STATE: {state} ===")
    path = f"data/state-upgrades/{state}/phase_records/district_replacements.json"
    if os.path.exists(path):
        with open(path) as f:
            data = json.load(f)
        mocks = sum(1 for r in data if "555" in r.get("phone", "") or "555" in r.get("spec_ed_contact_phone", ""))
        has_phone = sum(1 for r in data if r.get("phone", "") or r.get("spec_ed_contact_phone", ""))
        print(f"district_replacements: total={len(data)}, with_phone={has_phone}, mocks={mocks}")
    else:
        print(f"district_replacements: file not found at {path}")
        
    path2 = f"data/state-upgrades/{state}/phase_records/benefits_hhs.json"
    if os.path.exists(path2):
        with open(path2) as f:
            data = json.load(f)
        mocks = sum(1 for r in data if "555" in r.get("phone", "") or "555" in r.get("phone", ""))
        has_phone = sum(1 for r in data if r.get("phone", ""))
        print(f"benefits_hhs: total={len(data)}, with_phone={has_phone}, mocks={mocks}")
    else:
        print(f"benefits_hhs: file not found at {path2}")
