import json

with open("data/state-upgrades/ohio/phase_records/district_replacements.json") as f:
    data = json.load(f)

print(f"Total records in Ohio: {len(data)}")
mocks = sum(1 for r in data if "555" in r.get("phone", "") or "555" in r.get("spec_ed_contact_phone", ""))
has_phone = sum(1 for r in data if r.get("phone", "") or r.get("spec_ed_contact_phone", ""))
real = has_phone - mocks

print(f"Total with phone: {has_phone}")
print(f"Mocks: {mocks}")
print(f"Real: {real}")

if len(data) > 0:
    print("\n=== FIRST RECORD ===")
    print(data[0])
