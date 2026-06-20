# Information Types V1

This document is the human-readable source of truth for the kinds of information the repo currently supports.

It is intentionally organized by information type and subtype, not by state.

For row counts, controlled values, and live schema-backed details, use the generated inventory artifact:

- `npm run audit:information-inventory`
- output: `docs/generated/information-inventory-YYYY-MM-DD.md`

## 1. Geography and Coverage

Subtypes:

- states
- counties
- regional center county coverage
- regional education county coverage
- advocate county coverage
- virtual service area county coverage

## 2. Programs, Benefits, and Application Knowledge

Subtypes:

- program definitions
- eligibility rules
- required and optional documents
- application steps
- appeal rules
- waitlists and interest lists

## 3. Public Administrative and Education Routing

Subtypes:

- county offices
- state DD or IDD routing agencies
- regional education agencies
- school districts

## 4. Local Directory Layers

Subtypes:

- resource providers
- nonprofit organizations
- IEP advocates

## 5. Directory Foundation Metadata

Subtypes:

- service taxonomy
- audience taxonomy
- availability and capacity
- next-step and intake
- languages and accessibility
- claim groundwork
- trust and freshness

## 6. Normalization Foundation

Subtypes:

- canonical organizations
- organization to program links
- service locations
- office locations
- virtual service areas

## 7. Disability Knowledge and Reference

Subtypes:

- conditions
- functional needs
- age bands
- insurance types

## 8. Family and Navigator Workflow Data

Subtypes:

- family cases
- child profiles
- child condition mappings
- child need mappings
- program tracking
- document tracking
- reminders
- waiver vault

## 9. Family Support, Planning, and Collaboration

Subtypes:

- safety incidents
- parent declarations
- caregiver profiles
- transition tasks
- caregiver self-care logs
- child coordinators
- clinical documents
- consultation threads and messages
- shared portal tokens
- IEP accommodations and goals
- respite assessments

## 10. Knowledge Content

Subtypes:

- bilingual structured knowledge articles

## 11. Source, Review, and Operations Layers

Subtypes:

- source registry
- source verifications
- user-submitted resources
- coverage gaps
- verification queue

## 12. Staging and Promotion Layers

Subtypes:

- source targets
- scraped county offices
- scraped state resource agencies
- scraped regional education agencies
- scraped school districts
- scraped nonprofits
- scraped advocates
- scraped resource providers
- scraped forms
- scraped waitlists
- scraped sources
- promotion audit

## 13. Truth and Public Eligibility Contract

Subtypes:

- source-backed trust metadata
- public-safe render eligibility
- index-safe gating
- verified diagnosis allowlist
- indexable state allowlist

## Notes

- This inventory describes what the repo supports, not what every state fully has.
- Condition taxonomy stays separate from `serving_tags`; a directory listing should not imply diagnosis-specific support without source support.
- Directory layers and program/routing layers remain intentionally separate while normalization matures.
