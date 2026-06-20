# Directory Org Program Location Foundation V1

This document defines the normalization landing zone for the directory foundation without forcing a full rewrite of existing public tables.

## Purpose

The current public model still renders from:

- `resource_providers`
- `nonprofit_organizations`
- `iep_advocates`
- `county_offices`
- `state_resource_agencies`
- `regional_education_agencies`

That remains the active public path.

The new normalization layer exists so future upgrades can separate:

- organization identity
- program/service identity
- physical service locations
- administrative office locations
- virtual or catchment-based service areas

## New Normalization Tables

### `organizations`

Canonical parent entity for:

- provider groups
- nonprofits
- advocacy organizations
- public agencies
- school-related systems

Core fields:

- `id`
- `name`
- `organization_type`
- `parent_organization_id`
- `website`
- `intake_phone`
- `intake_email`
- trust metadata

### `organization_program_links`

Bridges an organization to a concrete program, service line, or public-facing offering.

Core fields:

- `organization_id`
- `program_id`
- `listing_type`
- `title`
- `intake_model`
- `service_summary`
- `eligibility_summary`
- trust metadata

This prevents flattening every service into a single provider row.

### `service_locations`

Physical service-delivery sites such as:

- clinics
- therapy campuses
- community sites
- mobile/home-based anchors

Core fields:

- `organization_id`
- `location_name`
- `location_type`
- address fields
- county/state linkage
- phone/email/website
- `appointment_url`
- trust metadata

### `office_locations`

Administrative or intake offices such as:

- county benefit offices
- DD intake offices
- regional education offices
- appeals/admin offices

Core fields:

- `organization_id`
- `office_name`
- `office_type`
- address fields
- county/state linkage
- `intake_phone`
- `intake_email`
- trust metadata

### `virtual_service_areas`

Non-physical coverage footprints for:

- statewide services
- county groups
- regional catchments
- virtual-only coverage

Core fields:

- `organization_id`
- `program_link_id`
- `area_type`
- `area_name`
- `state_id`
- `coverage_notes`
- `intake_model`
- trust metadata

### `virtual_service_area_counties`

County junction table for virtual/catchment coverage.

This allows:

- one organization to serve many counties without duplicating rows
- catchment evidence to remain explicit
- later migration away from fake county cloning

## Current Migration Rules

- Do not rewrite current public routes to depend on these tables yet.
- Do not duplicate a single organization into many fake county-local provider rows just to simulate coverage.
- Keep `programs` as the canonical program knowledge layer.
- Use the normalization tables as the landing zone for future scraper promotion and cleanup work.

## Practical Mapping Guidance

Use this model when the current public rows represent different concepts:

- `resource_providers` row
  - often maps to `organizations` + `service_locations`
- `nonprofit_organizations` row
  - often maps to `organizations` + optional `virtual_service_areas`
- `iep_advocates` row
  - often maps to `organizations` or a solo-operator organization + `service_locations` or `virtual_service_areas`
- `county_offices` row
  - often maps to `organizations` + `office_locations`
- `state_resource_agencies` row
  - often maps to `organizations` + `office_locations` + `virtual_service_areas`
- `regional_education_agencies` row
  - often maps to `organizations` + `virtual_service_areas`

## Current Backfill Scope

The first normalized backfill is intentionally narrow and truth-first.

It currently backfills from:

- `state_resource_agencies`
- `county_offices`
- `resource_providers` with real `source_url` and acceptable public `verification_status`
- `nonprofit_organizations` with real `source_url` and acceptable public `verification_status`
- `iep_advocates` with real `source_url` and acceptable public `verification_status`

It currently populates:

- `organizations`
- `organization_program_links`
- `service_locations`
- `office_locations`
- `virtual_service_areas`
- `virtual_service_area_counties`

It does **not** yet backfill:

- cross-row organization deduping across providers, nonprofits, and advocates
- shared multi-surface organizations that should later collapse into one canonical parent

This keeps the first slice safe:

- no fake service locations
- no invented organization merges across provider rows
- nonprofit normalization stays catchment-oriented unless a real physical service site is already modeled elsewhere
- advocate normalization stays catchment-oriented unless a real physical office/location is already modeled elsewhere
- no guessed program linkages beyond existing office/program relationships
- no forced rewrite of the public rendering path

## Why This Is Safe Now

This adds support without forcing:

- a public route rewrite
- a data backfill campaign
- fake linkage values
- enterprise provider tooling

It gives the repo a clean, source-friendly place to move future data as the directory becomes more structured.
