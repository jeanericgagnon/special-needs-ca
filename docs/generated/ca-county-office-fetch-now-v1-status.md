# California County Office Fetch-Now Lane v1 Status

- Generated: `2026-06-27`
- Queue source: `data/generated/ca_county_office_fetch_now_queue_v1.jsonl`
- Run ID: `ca-county-office-fetch-now-v5`

## Queue

- Fetch-now rows: `3`
- Review-first rows still pending: `4`
- Unresolved counties still pending manual authoring / one-hop live navigation: `2`
  - `san-luis-obispo`
  - `sierra`

## Live Fetch Result

- Attempted: `3`
- HTTP fetched: `3`
- Failures: `0`
- Blocked: `0`
- Parse-ready rows: `3`
- County/program metadata preserved into parse-ready rows:
  - `nevada` → `ihss-for-children`
  - `stanislaus` → `ihss-for-children`

## Verification Result

- Verified exact county office leaves: `2`
  - `Nevada County IHSS`
    - URL: `https://www.nevadacountyca.gov/984/In-Home-Supportive-Services-IHSS`
    - Why accepted: explicit IHSS identity, phone, mailing/physical address, apply/contact guidance
  - `Stanislaus County Adult Services IHSS section`
    - URL: `https://www.csa-stanislaus.com/adult-services/index.html#_ihss`
    - Why accepted: explicit IHSS section with office contact/address and application call-to-action
- Rejected false positives: `1`
  - `IHSS Advisory Committee`
    - URL: `https://www.csa-stanislaus.com/ihss-advisory-committee/index.html`
    - Why rejected: advisory / meetings page, not an intake office leaf

## Parse / Validate / Stage

- Parsed `medicaid_hhs_offices` rows: `3`
- Accepted: `2`
- Rejected: `1`
- Stage dry-run supported candidates: `2`
- Target staging table: `staging_scraped_county_offices`
- Apply-stage inserts: `2`
- Apply-stage replacements: `2`
- Staged rows now present with:
  - `county_id=nevada`, `program_id=ihss-for-children`
  - `county_id=stanislaus`, `program_id=ihss-for-children`

## Current Lane Outcome

- The fetch-now lane materially improved the California county-office repair path.
- `Nevada` now has one verified exact IHSS office leaf ready for staging.
- `Stanislaus` now has one verified exact IHSS office leaf ready for staging.
- The advisory committee false positive is quarantined by validator rule and does not advance.
- Remaining work is now concentrated in:
  - `review_first` counties: `el-dorado`, `merced`, `nevada`, `san-luis-obispo`
  - unresolved counties: `san-luis-obispo`, `sierra`

## Primary Artifacts

- `data/generated/ca_county_office_fetch_now_v1/ca_county_office_fetch_lane_summary_v1.json`
- `data/generated/ca_county_office_fetch_now_v1/ca_county_office_fetch_verification_v1.jsonl`
- `data/generated/ca_county_office_fetch_now_v1/ca_county_office_fetch_verification_summary_v1.json`
- `data/source-acquisition-runs/ca-county-office-fetch-now-v5/validated/medicaid_hhs_offices/summary.json`
- `data/source-acquisition-runs/ca-county-office-fetch-now-v5/staged/medicaid_hhs_offices/promotion-summary.json`
