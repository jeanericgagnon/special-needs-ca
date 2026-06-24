# Batch 307 Kansas KSDE Request Rejected Finality Report v1

- state: kansas
- classification: BLOCKED
- blocker_family: district_or_county_education_routing
- blocker_code: official_ksde_directory_export_roots_now_return_request_rejected_shells_while_reviewed_district_owned_leaves_cover_16_counties_but_county_grade_is_still_incomplete

## What was confirmed

- Confirmed the current KSDE Directory Reports root returns HTTP 200 only as a `Request Rejected` shell.
- Confirmed the current KSDE Directories root returns the same `Request Rejected` shell.
- Confirmed the current Kansas educational-directory PDF URL also returns the same `Request Rejected` shell in the bounded raw lane.
- Confirmed Kansas still has 16 counties with reviewed local education-routing proof from previously preserved district leads.

## Why Kansas remains blocked

- County-grade local education proof is still incomplete across the remaining unresolved counties.
- The current official KSDE state roots are no longer reusable raw scrape entrypoints for the low-token lane.
- The right next move is district-leaf authoring from saved district leads, not more state-root retries.

## Next action

- continue_only_from_saved_export_backed_district_leads_and_reviewed_district_owned_domains_not_from_live_ksde_root_retries

