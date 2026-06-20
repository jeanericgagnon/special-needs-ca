# Full Information Gap Audit

Generated: 2026-06-20

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This artifact is intentionally stricter than the truth/completeness/confidence audits.
It answers a different question:

Do we already have all of the information depth implied by the full product model?

## Executive Result

- No. The repo has strong national program, routing, nonprofit, advocate, and condition foundations, but provider coverage, normalization, knowledge depth, and workflow/runtime layers are still thin or empty in the checked-in DB.

## Layer Summary

- Substantial layers: 3
- Partial layers: 4
- Thin layers: 2
- Demo-only layers: 1
- Modeled-only layers: 1

## Track Summary

- Information track complete: no
- Information blockers: provider_depth_thin, knowledge_content_thin, waitlist_depth_shallow, education_routing_not_all_states
- Runtime track operational-ready: yes
- Runtime blockers: user_submissions_empty, coverage_gaps_empty, case_program_tracking_demo_only

## Completion Audit

- Missing source families: 0
- Actionable blocker classes: 0
- Queued in-scope families: 3
- Processed in-scope families: 3
- Explicitly blocked in-scope families: 4
- Unknown in-scope families: 5
- All in-scope families accounted for: no
- Programs, waivers, appeals, and waitlists: processed (queue=0)
- Forms and guides: unknown (queue=0)
- County offices and DD routing: processed (queue=0)
- Education routing: processed (queue=0)
- Nonprofits: queued (queue=17)
- Advocates and legal support: explicitly_blocked (queue=0; blocker=advocate_directory_depth)
- Providers and care: queued (queue=1; blocker=provider_directory)
- Housing: unknown (queue=0)
- Goods and supplies: unknown (queue=0)
- Jobs and vocational support: unknown (queue=0)
- Care and independent living: unknown (queue=0)
- Transport, utilities, and food: queued (queue=1)
- Knowledge content: explicitly_blocked (queue=0; blocker=knowledge_content_depth)
- Directory foundation metadata: explicitly_blocked (queue=0; blocker=directory_foundation_signals)
- Org -> program -> location normalization: explicitly_blocked (queue=0; blocker=normalization_depth)

## Programs, waivers, appeals, forms, and waitlists

- Status: substantial
- Evidence: 507 programs across 50/50 states
- Evidence: 303 eligibility rules
- Evidence: 502 document requirements
- Evidence: 992 application steps
- Evidence: 451 appeal records
- Evidence: 165 waitlist records
- Main gap: Program foundation is strong, but waitlist depth is still smaller than the rest of the program layer.

## County offices, DD routing, and education routing

- Status: partial
- Evidence: 3678 county offices across 50/50 states
- Evidence: 636 state routing agencies across 50/50 states
- Evidence: 313 regional education agencies across 47/50 states
- Evidence: 3117 school districts across 50/50 states
- Main gap: Routing layers are broadly populated, but density and local depth still vary by state and county.

## Local nonprofit support organizations

- Status: substantial
- Evidence: 29501 nonprofit listings across 50/50 states
- Main gap: Nonprofit coverage is broad, but foundation metadata like accessibility and live capacity is still sparse.

## IEP advocates and advocacy support

- Status: thin
- Evidence: 2995 advocate listings
- Main gap: Advocate count is strong, but truth quality and public eligibility still need to stay under active audit.

## Clinics, therapists, and local providers

- Status: partial
- Evidence: 96 provider listings across 50/50 states
- Evidence: 125 staged provider rows waiting in provider staging
- Main gap: Provider coverage is the clearest national information gap. This layer exists, but it is nowhere near all-state depth.

## Findhelp-like metadata on directory listings

- Status: partial
- Evidence: Schema support exists for tags, availability, next steps, accessibility, claims, and trust fields on providers, nonprofits, and advocates.
- Evidence: Those fields sit on 32592 directory rows total.
- Main gap: The metadata model exists, but live availability, accessibility, and capacity signals are still sparse on the checked-in DB.

## Organization -> program -> location normalization

- Status: thin
- Evidence: 36902 organizations
- Evidence: 36902 organization-program links
- Evidence: 94 service locations
- Evidence: 4314 office locations
- Evidence: 33130 virtual service areas
- Main gap: This migration landing zone is modeled in schema but not yet populated in the checked-in DB.

## Conditions, functional needs, and reference knowledge

- Status: substantial
- Evidence: 78 conditions
- Evidence: 18 functional needs
- Evidence: 7 age bands
- Evidence: 4 insurance types
- Main gap: No major structural gap detected in this layer.

## Knowledge articles and guidance content

- Status: partial
- Evidence: 23 knowledge articles
- Evidence: 8 staged knowledge articles
- Main gap: Knowledge content exists and staged growth is underway, but live article volume is still small relative to the breadth of the rest of the information model.

## Family, case, and navigator-adjacent workflow data

- Status: demo_only
- Evidence: 1 family cases
- Evidence: 1 child profiles
- Evidence: 0 case program status rows
- Main gap: The schema supports family/case workflows, but the checked-in DB mostly shows demo-level or empty runtime data.

## User submissions, coverage gaps, and feedback loops

- Status: modeled_only
- Evidence: 0 user-submitted resources
- Evidence: 0 coverage gap records
- Main gap: These operational loops are modeled but not populated in the checked-in DB snapshot.

## Honest Read

- The repo is strong on programs, public routing, nonprofits, advocates, and condition/need taxonomy.
- The repo is not yet at "all info" depth for local providers, normalized org-program-location data, broad knowledge content, or live family/case runtime data.
- Truth-safe and structurally complete is not the same thing as fully exhaustive.
- Runtime and feedback layers should be judged as operational capability, not broad prepopulation with fake user data.

## Best Next Moves

- Expand truthful provider coverage state by state, because provider depth is the biggest visible information gap.
- Populate normalization tables only when they can be filled truthfully from existing directory/program records.
- Increase knowledge article depth around the main diagnosis, school, waiver, respite, and transition journeys.
- Keep family/case and operational tables scoped unless the product is actively using them in runtime.
