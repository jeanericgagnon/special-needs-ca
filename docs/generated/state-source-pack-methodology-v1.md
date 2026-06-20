# State Source Pack Methodology v1

Generated: 2026-06-20

## Purpose

Build a deterministic, disk-first official-source pack that improves low-token scraping by improving the URL queue rather than deepening the crawler.

## Input Layers

- ca_disability_navigator.db
- data/source_packs/california/ca_directory_targets_v1.jsonl
- data/source_packs/california/ca_official_source_pack_v2.jsonl
- data/source_packs/forms_source_pack.json
- data/source_packs/official_state_domain_repairs.json
- data/source_targets/alabama.json
- data/source_targets/alaska.json
- data/source_targets/arizona.json
- data/source_targets/arkansas.json
- data/source_targets/california.json
- data/source_targets/colorado.json
- data/source_targets/connecticut.json
- data/source_targets/delaware.json
- data/source_targets/florida.json
- data/source_targets/georgia.json
- data/source_targets/hawaii.json
- data/source_targets/idaho.json
- data/source_targets/illinois.json
- data/source_targets/indiana.json
- data/source_targets/iowa.json
- data/source_targets/kansas.json
- data/source_targets/kentucky.json
- data/source_targets/louisiana.json
- data/source_targets/maine.json
- data/source_targets/maryland.json
- data/source_targets/massachusetts.json
- data/source_targets/michigan.json
- data/source_targets/minnesota.json
- data/source_targets/mississippi.json
- data/source_targets/missouri.json
- data/source_targets/montana.json
- data/source_targets/nebraska.json
- data/source_targets/nevada.json
- data/source_targets/new-hampshire.json
- data/source_targets/new-jersey.json
- data/source_targets/new-mexico.json
- data/source_targets/new-york.json
- data/source_targets/north-carolina.json
- data/source_targets/north-dakota.json
- data/source_targets/ohio.json
- data/source_targets/oklahoma.json
- data/source_targets/oregon.json
- data/source_targets/pennsylvania.json
- data/source_targets/rhode-island.json
- data/source_targets/south-carolina.json
- data/source_targets/south-dakota.json
- data/source_targets/tennessee.json
- data/source_targets/texas.json
- data/source_targets/utah.json
- data/source_targets/vermont.json
- data/source_targets/virginia.json
- data/source_targets/washington.json
- data/source_targets/west-virginia.json
- data/source_targets/wisconsin.json
- data/source_targets/wyoming.json
- docs/generated/knowledge-content-status-queue-2026-06-19.json
- docs/generated/launch-scrape-link-inventory-2026-06-20.json
- docs/generated/provider-source-pack-plan-2026-06-19.json

## Passes

1. Repo-first extraction from generated ledgers, launch inventory, current scrape universe, California source-pack artifacts, forms/repair/provider/knowledge artifacts, and live DB provenance URLs.
2. Bounded targeted discovery from existing official repair and source-pack hints only. No broad result harvesting and no recursive crawl.

## Classification Rules

- Every output URL is assigned one canonical workflow role from the shared taxonomy.
- Fake scaffold domains from the official-domain repair pack are excluded from the pack and instead drive gap scoring.
- `verified_target` is reserved for existing repo/DB-backed URLs already present in active queue/provenance artifacts.
- `target_candidate` is used for bounded authoring/discovery candidates that look plausible but are not proven active queue targets yet.
- `blocked_known` is used for quarantined, blocked, or explicitly deferred URLs.
- `needs_review` is used when role/authority mapping is ambiguous or the source is weak for that role.

## Output Summary

- Total taxonomy roles: 72
- Total pack rows: 4397
- States with fewer than 25 targets: 0
- States missing critical DD URLs: 50
- States missing Medicaid appeals URLs: 46
- States missing special-education dispute URLs: 45
- States missing local office directories: 50

## Top 10 States To Manually Repair First

- New Mexico: gap_score=189, total_targets=60, next=needs_manual_review
- New Hampshire: gap_score=176, total_targets=69, next=needs_manual_review
- Illinois: gap_score=172, total_targets=67, next=needs_manual_review
- Nebraska: gap_score=171, total_targets=70, next=needs_manual_review
- Mississippi: gap_score=170, total_targets=85, next=needs_manual_review
- Florida: gap_score=166, total_targets=71, next=needs_manual_review
- Kansas: gap_score=159, total_targets=78, next=needs_manual_review
- Massachusetts: gap_score=155, total_targets=82, next=needs_manual_review
- Colorado: gap_score=154, total_targets=80, next=needs_manual_review
- Tennessee: gap_score=154, total_targets=78, next=needs_manual_review
