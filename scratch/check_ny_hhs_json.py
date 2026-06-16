import json

with open("data/state-upgrades/new-york/phase_records/benefits_hhs.json") as f:
    data = json.load(f)

print(f"Total benefits_hhs records: {len(data)}")
mocks = sum(1 for r in data if "555" in r.get("phone", ""))
real = sum(1 for r in data if "555" not in r.get("phone", "") and r.get("phone", ""))
empty = sum(1 for r in data if not r.get("phone", ""))

print(f"Mock phone numbers (555): {mocks}")
print(f"Real phone numbers: {real}")
print(f"Empty phone numbers: {empty}")

# Print first few real records
print("\n=== FIRST 5 REAL RECORDS ===")
printed = 0
for r in data:
    if "555" not in r.get("phone", "") and r.get("phone", ""):
        print(r)
        printed += 1
        if printed >= 5:
            break
