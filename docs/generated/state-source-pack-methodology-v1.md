# State Source Pack Methodology v2

This artifact replaces scraper-facing use of `all_states_source_pack_v1.jsonl` with a verified-acquisition workflow.

## Core semantics

- `all_states_source_pack_v1.jsonl` is audit-only inventory and must not feed scraper queues.
- `verified_state_source_pack_v2.jsonl` contains only state/local or approved non-government URLs that passed HTTP and semantic verification in this run.
- `global_federal_source_pack_v1.jsonl` dedupes federal crossover URLs once globally.
- Existing provenance rows default to `legacy_candidate` unless re-verified.
- Unresolved critical roles stay explicit in `state_source_unresolved_v2.jsonl`.

## Verification gate

- successful HTTP fetch or explicit blocked/browser-only classification
- correct authority for the role
- state jurisdiction match for state-specific roles
- role-specific semantic evidence from title, headings, text, and URL path
- generic roots do not satisfy critical leaf roles
- DB field names cannot be treated as agency names

## Five-state pass

- Old audit-only inventory rows: 4397
- Verified state-specific rows in v2: 18
- Candidate rows retained for review: 96
- Explicit unresolved roles: 214

## State summary

- New Mexico: verified 0, unresolved critical roles 47, critical verification 0%
- New Hampshire: verified 1, unresolved critical roles 46, critical verification 2%
- Illinois: verified 8, unresolved critical roles 37, critical verification 18%
- Nebraska: verified 5, unresolved critical roles 42, critical verification 11%
- Mississippi: verified 4, unresolved critical roles 42, critical verification 9%

