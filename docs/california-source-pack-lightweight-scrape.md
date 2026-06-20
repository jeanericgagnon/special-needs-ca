## California Lightweight Source-Pack Scrape

This is a bounded first-pass ingestion for the California source-pack artifacts under [data/source_packs/california](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source_packs/california).

### Run

```bash
npm run run:ca-source-pack-lightweight
```

Optional overrides:

```bash
npm run run:ca-source-pack-lightweight -- --source-dir=data/source_packs/california --output-dir=data/generated
```

### Reads

- `ca_official_source_pack_v2.jsonl`
- `ca_directory_targets_v1.jsonl`
- `ca_source_repair_ledger_v2.jsonl`
- `ca_source_coverage_matrix_v1.csv`
- `ca_source_pack_manifest_v2.json`

### Writes

- `data/generated/ca_scrape_results_v1.jsonl`
- `data/generated/ca_fetch_failures_v1.jsonl`
- `data/generated/ca_blocked_targets_v1.jsonl`
- `data/generated/ca_source_completion_summary_v1.json`

### Behavior

- exact-target only
- polite lightweight fetch
- request and body timeout around 20s by default
- one retry on transient 429 and 5xx
- stable user agent via the existing source-acquisition fetch helper
- no deep crawl
- directory roots may perform at most one same-domain discovery fetch for obvious leaf candidates like intake, eligibility, contact, appeal, county office, or application
- portals are reachability-checked only

### Completion Semantics

- `fetched`
  - HTML target retrieved and basic evidence extracted
- `fetched_unparsed`
  - PDF, DOCX, or XLSX retrieved but not deeply parsed because no existing parser dependency is required for this pass
- `skipped_portal`
  - portal target is reachable but not session-scraped
- `blocked`
  - target hit a known hard blocker such as `403` or fetch challenge
- `failed`
  - fetch failed without a known hard-block classification

### Truth Rules

- No unofficial replacement URLs are introduced.
- Directory roots are not treated as verified leaf pages unless a same-domain leaf page is actually fetched.
- Known blockers remain honest:
  - OAH `403` stays blocked
  - CDE challenge/timeout spreadsheet targets stay blocked
