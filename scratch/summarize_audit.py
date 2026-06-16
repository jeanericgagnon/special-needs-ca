import json
import os

metrics_path = 'scratch/national_audit_metrics.json'

if not os.path.exists(metrics_path):
    print(f"Error: {metrics_path} does not exist.")
    exit(1)

with open(metrics_path, 'r') as f:
    data = json.load(f)

print("=" * 80)
print("NATIONAL INTEGRITY AUDIT - SUMMARY REPORT")
print("=" * 80)
print(f"Timestamp: {data.get('timestamp')}")
print()

# Registry Integrity
reg = data.get('registryIntegrity', {})
print("1. STATE REGISTRY INTEGRITY")
print(f"  - Duplicate states: {reg.get('duplicates')}")
print(f"  - States with wrong slugs: {reg.get('wrongSlugs')}")
print(f"  - County mismatch list: {reg.get('countyMismatch')}")

# Filter out CA counties from crossStateCountyMappings (since CA baseline counties do not have '-ca' suffix)
cross_state = reg.get('crossStateCountyMappings', [])
real_cross_state = []
for c in cross_state:
    county_id = c.get('countyId')
    state_id = c.get('stateId')
    suffix = c.get('suffix')
    if state_id == 'california':
        continue
    real_cross_state.append(c)

print(f"  - Real Cross-State County Mappings (excluding CA baseline): {len(real_cross_state)}")
if real_cross_state:
    for rc in real_cross_state[:10]:
        print(f"    * {rc}")
    if len(real_cross_state) > 10:
        print("    * ... and more")

print(f"  - Wrong State Records (unassigned): {len(reg.get('wrongStateRecords', []))}")
for w in reg.get('wrongStateRecords', []):
    print(f"    * Table {w.get('table')}: {len(w.get('records'))} records")

print()

# Fallbacks, Placeholders, Manual Review, Protected, Providers
states_metrics = data.get('stateMetrics', {})
print("2. STATE-BY-STATE METRICS OVERVIEW")
print(f"{'State':<15} | {'Status':<20} | {'Records':<8} | {'Fallback':<8} | {'Mock':<5} | {'Manual':<6} | {'Manual %':<8} | {'Protected':<9}")
print("-" * 100)

total_fallback_all = 0
total_mock_all = 0
total_manual_all = 0
total_protected_all = 0
total_records_all = 0

states_list = sorted(states_metrics.items(), key=lambda x: x[0])
for sid, metrics in states_list:
    name = metrics.get('name')
    claimed_status = metrics.get('claimedStatus')
    active_counts = metrics.get('activeCounts', {})
    total_rec = active_counts.get('total', 0)
    
    fallbacks = metrics.get('fallbacks', {})
    fb_total = fallbacks.get('total', 0)
    
    placeholders = metrics.get('placeholders', {})
    mock_count = placeholders.get('mockCount', 0)
    
    mr = metrics.get('manualReview', {})
    mr_total = mr.get('total', 0)
    mr_pct = mr.get('percentage', 0.0)
    
    prot = metrics.get('protected', {})
    prot_total = prot.get('total', 0)
    
    total_fallback_all += fb_total
    total_mock_all += mock_count
    total_manual_all += mr_total
    total_protected_all += prot_total
    total_records_all += total_rec
    
    print(f"{sid[:15]:<15} | {claimed_status[:20]:<20} | {total_rec:<8} | {fb_total:<8} | {mock_count:<5} | {mr_total:<6} | {mr_pct:7.2f}% | {prot_total:<9}")

print("-" * 100)
print(f"{'TOTAL':<15} | {'':<20} | {total_records_all:<8} | {total_fallback_all:<8} | {total_mock_all:<5} | {total_manual_all:<6} | {total_manual_all/total_records_all*100:7.2f}% | {total_protected_all:<9}")
print()

# Summary analysis
print("3. ANOMALIES & AUDIT FINDINGS")
print("-" * 30)

# Check fallbacks
states_with_fallbacks = []
for sid, metrics in states_list:
    fb_total = metrics.get('fallbacks', {}).get('total', 0)
    if fb_total > 0:
        states_with_fallbacks.append((sid, fb_total))
print(f"States with active fallbacks: {len(states_with_fallbacks)}")
for s, count in states_with_fallbacks:
    print(f"  - {s}: {count} fallbacks")

# Check placeholders
states_with_mocks = []
for sid, metrics in states_list:
    mock_count = metrics.get('placeholders', {}).get('mockCount', 0)
    if mock_count > 0:
        states_with_mocks.append((sid, mock_count))
print(f"States with mock/placeholder contacts: {len(states_with_mocks)}")
for s, count in states_with_mocks:
    print(f"  - {s}: {count} mock records")

# Check manual review shown as verified
verified_manual_states = []
for sid, metrics in states_list:
    ver_man = metrics.get('manualReview', {}).get('verifiedManual', [])
    if ver_man:
        verified_manual_states.append((sid, len(ver_man)))
print(f"States with manual-review records marked verified/curated: {len(verified_manual_states)}")
for s, count in verified_manual_states:
    print(f"  - {s}: {count} records")

# Check providers auto-promoted (commercial providers in production county_id)
states_with_providers = []
for sid, metrics in states_list:
    providers = metrics.get('providersCount', 0)
    if providers > 0:
        states_with_providers.append((sid, providers))
print(f"States with active resource_providers records in counties: {len(states_with_providers)}")
for s, count in states_with_providers:
    print(f"  - {s}: {count} providers")
