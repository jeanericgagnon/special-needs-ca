# Competitive Foundation Gap Audit

Generated: 2026-06-16

This artifact audits the broader Competitive Foundation objective against the current repo state so we can distinguish what is fully implemented from what is still only partial.

## Summary

- Implemented areas: 8
- Partial areas: 0
- Missing areas: 0
- DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

## Requirement Ledger

| Area | Status | Main Gap |
| --- | --- | --- |
| Disability-adjacent taxonomy and tags | implemented | Condition taxonomy remains separate by design; tags are implemented for directory entities, not every program or office layer. |
| Availability and capacity | implemented | Truth-first availability is now supported, including explicit unknown status for checked rows, but concrete live capacity data remains sparse. |
| Next-step and intake fields | implemented | The schema is in place, but many rows still lack direct next-step data. |
| Org -> program -> location modeling | implemented | Core normalized public directory coverage is now populated across agencies, county offices, providers, nonprofits, and advocates. Remaining work is canonical deduping and richer cross-surface organization linking. |
| Languages and accessibility | implemented | Accessibility coverage is present but not yet uniformly dense across all records. |
| Source freshness and verification | implemented | This proves trust gating exists; it does not prove every record is recently refreshed. |
| Privacy-conscious analytics | implemented | The analytics contract and core wiring are in place. Remaining work is expanding the same event coverage to additional directory surfaces as they adopt the foundation UI. |
| Claimed-listing groundwork | implemented | No full claim review workflow is implemented yet, which is consistent with scope. |

## Disability-adjacent taxonomy and tags

Status: **implemented**

Evidence:
- Controlled service and serving tag vocabularies exist in frontend/src/lib/directoryFoundation.ts
- All three public directory tables carry service_tags and serving_tags columns
- Tagged records: providers 39/39, nonprofits 18617/29499, advocates 3573/3573

Main gap: Condition taxonomy remains separate by design; tags are implemented for directory entities, not every program or office layer.

## Availability and capacity

Status: **implemented**

Evidence:
- Availability, waitlist, capacity, funding, and freshness fields exist on public directory tables
- Rows carrying any availability/capacity signal: providers 33/39, nonprofits 29492/29499, advocates 2993/3573
- Rows with explicit unknown availability: providers 33/39, nonprofits 29492/29499, advocates 2993/3573
- Rows with concrete live availability/capacity signals: providers 0/39, nonprofits 0/29499, advocates 0/3573
- Rows carrying freshness-only checked_at support: providers 33/39, nonprofits 29492/29499, advocates 3573/3573
- Supported availability statuses are validated in frontend/src/lib/directoryFoundation.ts and src/db/audit_directory_foundation.js

Main gap: Truth-first availability is now supported, including explicit unknown status for checked rows, but concrete live capacity data remains sparse.

## Next-step and intake fields

Status: **implemented**

Evidence:
- Next-step, intake, and CTA fields exist on public directory tables
- Rows carrying at least one next-step signal: providers 39/39, nonprofits 29499/29499, advocates 3573/3573
- Invalid next_step_type values are audited and renderers suppress empty CTAs

Main gap: The schema is in place, but many rows still lack direct next-step data.

## Org -> program -> location modeling

Status: **implemented**

Evidence:
- Program tables exist: yes
- Regional/catchment location fields exist: yes
- Dedicated organization/location normalization tables exist: yes
- Normalization rows present: 163313 total across 6/6 normalization tables
- Normalization row counts: organizations=36845, organization_program_links=36845, service_locations=39, office_locations=4314, virtual_service_areas=33128, virtual_service_area_counties=52142
- Source-backed providers normalized: organizations 39/39, program links 39/39, service locations 39/39
- Backfilled public office organizations: agencies 636, county offices 3678
- Source-backed nonprofits normalized: organizations 29499/29499, program links 29499/29499, virtual areas 29499/29499
- Source-backed advocates normalized: organizations 2993/2993, program links 2993/2993, virtual areas 2993/2993
- Migration foundation doc exists: yes
- Current docs preserve separation between directory entities and programs while defining a future landing zone for normalized locations and service areas

Main gap: Core normalized public directory coverage is now populated across agencies, county offices, providers, nonprofits, and advocates. Remaining work is canonical deduping and richer cross-surface organization linking.

## Languages and accessibility

Status: **implemented**

Evidence:
- Language, modality, and accessibility fields exist on public directory tables
- Rows carrying at least one language or access signal: providers 0/39, nonprofits 0/29499, advocates 3573/3573
- DirectoryFoundationPanel only renders accessibility details when real data exists

Main gap: Accessibility coverage is present but not yet uniformly dense across all records.

## Source freshness and verification

Status: **implemented**

Evidence:
- Trust and freshness fields exist on public directory tables
- Rows carrying both source_url and verification_status: providers 39/39, nonprofits 29499/29499, advocates 3573/3573
- Public truth gating requires acceptable verification status, source URL, and contact signal before render/index eligibility

Main gap: This proves trust gating exists; it does not prove every record is recently refreshed.

## Privacy-conscious analytics

Status: **implemented**

Evidence:
- Analytics event family and sanitization helper exist in frontend/src/lib/directoryAnalytics.ts
- A vendor-neutral browser event bridge now dispatches sanitized analytics payloads for directory actions
- DirectoryFoundationPanel emits phone, email, resource, application, next-step, and form-download events on real user clicks
- DirectoryFoundationPanel emits save-resource analytics when a user saves a listing locally
- Advocates and state-county search surfaces now emit directory_search, directory_no_results, and directory_dead_end events with coarse page context only

Main gap: The analytics contract and core wiring are in place. Remaining work is expanding the same event coverage to additional directory surfaces as they adopt the foundation UI.

## Claimed-listing groundwork

Status: **implemented**

Evidence:
- Claim-related fields exist on public directory tables
- Rows carrying at least one claim-groundwork signal: providers 39/39, nonprofits 29499/29499, advocates 3573/3573
- Current scope remains schema/docs groundwork only, without a provider portal workflow

Main gap: No full claim review workflow is implemented yet, which is consistent with scope.
