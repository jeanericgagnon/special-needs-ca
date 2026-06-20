## California Source Pack Import

Place the California source-pack files in this directory with these exact names:

- `ca_official_source_pack_v2.jsonl`
- `ca_directory_targets_v1.jsonl`
- `ca_source_repair_ledger_v2.jsonl`
- `ca_source_coverage_matrix_v1.csv`
- `ca_source_pack_manifest_v2.json`

Run the lightweight first-pass ingestion with:

```bash
npm run run:ca-source-pack-lightweight
```

The command reads the files above and writes:

- `data/generated/ca_scrape_results_v1.jsonl`
- `data/generated/ca_fetch_failures_v1.jsonl`
- `data/generated/ca_blocked_targets_v1.jsonl`
- `data/generated/ca_source_completion_summary_v1.json`

Interpretation:

- `complete enough for first pass`
  - target fetched successfully
  - or `portal` verified reachable
  - or fetch recorded honestly as `fetched_unparsed` for file types without an existing parser
- `blocked`
  - official target exists but fetch was blocked, challenged, or returned a known hard stop like `403`
- `repair_needed`
  - the source repair ledger still contains unresolved official targets that need exact current replacements or follow-up verification

This runner does not deep crawl. For directory roots it may verify at most one same-domain leaf candidate, but it does not claim a leaf page exists unless it actually verifies one.
