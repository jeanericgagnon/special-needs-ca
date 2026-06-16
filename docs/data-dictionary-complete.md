# Complete Data Dictionary

This document details the database schema and table relationships for the national disability navigator repository.

---

## 1. Table Definitions & Schemas

### Table: `states`
* `id` (TEXT, PRIMARY KEY): e.g., `'california'`, `'texas'`.
* `name` (TEXT, NOT NULL): Full name of the state.
* `code` (TEXT, NOT NULL): 2-character abbreviation (e.g. `'CA'`).

### Table: `counties`
* `id` (TEXT, PRIMARY KEY): e.g., `'los-angeles'`, `'travis-tx'`.
* `name` (TEXT, NOT NULL): Name of the county.
* `state_id` (TEXT, FOREIGN KEY references `states(id)`).
* `ihss_wage_rate` (REAL): Local paid caregiver hourly rate (default 18.00).

### Table: `county_offices`
* `id` (TEXT, PRIMARY KEY): Unique identifier.
* `county_id` (TEXT, FOREIGN KEY references `counties(id)`).
* `office_name` (TEXT, NOT NULL): Name of the local office.
* `phone` (TEXT): Clickable intake phone line.
* `website` (TEXT): Web url.
* `program_id` (TEXT, FOREIGN KEY references `programs(id)`).
* `verification_status` (TEXT): Verification status.
* `data_origin` (TEXT): e.g. `'curated_seed'`, `'programmatic_fallback'`.

### Table: `school_districts`
* `id` (TEXT, PRIMARY KEY): Unique identifier.
* `county_id` (TEXT, FOREIGN KEY references `counties(id)`).
* `name` (TEXT, NOT NULL): Name of school district.
* `spec_ed_contact_phone` (TEXT): Phone contact.
* `spec_ed_contact_email` (TEXT): Email contact.
* `website` (TEXT): Website.
* `verification_status` (TEXT): Status.
* `data_origin` (TEXT): Origin.

### Table: `nonprofit_organizations`
* `id` (TEXT, PRIMARY KEY): Unique identifier.
* `name` (TEXT, NOT NULL): Organization name.
* `county_id` (TEXT, FOREIGN KEY references `counties(id)`).
* `website` (TEXT): URL.
* `phone` (TEXT): Contact number.
* `focus_condition` (TEXT): Delays/conditions focus.
* `verification_status` (TEXT): Status.

---

## 2. Table Relationship Schema Map

```
  [states] <── (1:N) ── [counties] <── (1:N) ── [county_offices]
                            │
                            ├─── (1:N) ── [school_districts]
                            │
                            └─── (1:N) ── [nonprofit_organizations]
```
