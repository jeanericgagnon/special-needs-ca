# Batch 313 Kansas Rejected Shell Submit Finality Report v1

- state: kansas
- classification: BLOCKED
- blocker_family: district_or_county_education_routing
- blocker_code: official_ksde_directory_and_pdf_roots_now_only_serve_request_rejected_shells_and_the_directory_reports_root_exposes_no_hidden_submit_fields_while_reviewed_district_owned_leaves_cover_16_counties

## What was confirmed

- Confirmed the current KSDE Directory Reports root returns HTTP 200 only as a `Request Rejected` shell.
- Confirmed the current KSDE Directories root returns the same `Request Rejected` shell.
- Confirmed the current Kansas educational-directory PDF URL also returns the same `Request Rejected` shell.
- Confirmed the raw Directory Reports shell exposes no `__VIEWSTATE`, `__VIEWSTATEGENERATOR`, or `__EVENTVALIDATION` fields.
- Confirmed Kansas still has 16 counties with reviewed local education-routing proof from previously preserved district leads.

## Why Kansas remains blocked

- County-grade local education proof is still incomplete across the remaining unresolved counties.
- The current official KSDE state roots are no longer reusable raw scrape entrypoints.
- The old exact district-scoped public submit contract is not reproducible from the current raw lane because the hidden ASP.NET form fields are gone.
- The right next move is district-leaf authoring from saved district leads, not more state-root retries.

## Next action

- continue_only_from_saved_export_backed_district_leads_and_reviewed_district_owned_domains_because_live_ksde_submit_contract_is_not_present_in_raw_lane

