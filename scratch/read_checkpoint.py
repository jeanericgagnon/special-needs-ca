import json
import os
import sys

state = "TX"
if len(sys.argv) > 1:
    state = sys.argv[1].upper()

cp_path = f"/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/src/scrapers/national/data/checkpoints/wrightslaw_{state}.json"

if not os.path.exists(cp_path):
    print(f"Checkpoint file for {state} does not exist yet at: {cp_path}")
    sys.exit(0)

try:
    with open(cp_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"Checkpoint Details for {state}:")
    print(" - Last Processed Page/Index:", data.get("lastProcessedPage"))
    results = data.get("metadata", {}).get("results", [])
    print(" - Extracted Results Count:", len(results))
    if results:
        print(" - Sample Name:", results[-1].get("name"))
except Exception as e:
    print("Error:", e)
