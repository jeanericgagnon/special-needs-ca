import json

with open("scratch/gap_matrix_stats.json") as f:
    stats = json.load(f)

with open("scratch/equivalence_scores_v2.json") as f:
    scores = json.load(f)

target_states = ["california", "texas", "florida", "pennsylvania", "georgia", "illinois", "new-york", "ohio"]

for s_id in target_states:
    print(f"=== {stats[s_id]['name']} ({scores[s_id]['score']:.1f}%) ===")
    for cat_name, cat_stats in stats[s_id]['categories'].items():
        print(f"  - {cat_name}: total={cat_stats['total_count']}, ver={cat_stats['verified_count']}, mr={cat_stats['manual_review_required_count']}, fb={cat_stats['fallback_count']}, dir={cat_stats['directory_routed_count']}, local_ver={cat_stats['local_contact_verified_count']}, conf={cat_stats['service_area_confidence']}, use={cat_stats['frontend_usefulness']}")
