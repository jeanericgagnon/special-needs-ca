# Source Acquisition Completion Plan

Generated: 2026-06-17

This is the current answer to: what do we still need to scrape or author to fill the repo gaps?

## Summary

- master-ledger ready rows: 1773
- DB-discovered actionable rows not yet in master ledger: 3005
- authored missing-family rows: 212
- combined unique ready rows: 4005
- source families still needing authoring: 5

## Combined Ready Rows By Gap Family

- advocates_legal: 1977
- nonprofit_support: 796
- providers_care: 237
- programs_benefits: 210
- forms_guides: 188
- general_gap_fill: 152
- medicaid_hhs_offices: 132
- dd_routing: 111
- source_registry: 63
- geography_counties: 48
- transition_programs: 17
- parent_training_nonprofits: 15
- education_routing: 14
- waivers: 13
- condition_nonprofits: 13
- early_intervention_programs: 10
- housing: 2
- knowledge_content: 2
- goods_supplies: 1
- jobs_vocational: 1
- care_independent_living: 1
- legal_aid: 1
- transport_utilities_food: 1

## Combined Ready Rows By Status

- ready_lightweight: 3456
- ready_js_heavy: 355
- ready_pdf: 192
- discovery_only: 2

## Combined Ready Rows By Execution Lane

- ready_target_scrape: 3993
- source_family_authoring: 12

## Queue Waves

### Source-family unlock packs

- rows: 12
- providers_care: 2
- housing: 2
- knowledge_content: 2
- advocates_legal: 1
- goods_supplies: 1
- jobs_vocational: 1
- care_independent_living: 1
- legal_aid: 1

### Priority lightweight ready targets

- rows: 242
- providers_care: 235
- knowledge_content: 2
- housing: 1
- goods_supplies: 1
- jobs_vocational: 1
- care_independent_living: 1
- legal_aid: 1

### Advocates and legal ready targets

- rows: 500
- advocates_legal: 500

### Forms and PDF targets

- rows: 192
- forms_guides: 188
- advocates_legal: 3
- medicaid_hhs_offices: 1

### JS-heavy targets

- rows: 355
- nonprofit_support: 282
- source_registry: 33
- education_routing: 9
- medicaid_hhs_offices: 9
- general_gap_fill: 8
- dd_routing: 7
- advocates_legal: 4
- providers_care: 1

### Remaining ready targets

- rows: 2000
- advocates_legal: 1566
- providers_care: 237
- forms_guides: 188
- housing: 2
- knowledge_content: 2
- goods_supplies: 1
- jobs_vocational: 1
- care_independent_living: 1

## Still Need To Author

- First-party advocate and legal-support sources: Current advocate/legal targets are overwhelmingly quarantined COPAA-style directories and need replacement with first-party or official sources.
- Exact forms libraries for most states: Only 1 forms source is currently scrape-ready; most state form targets are blocked by fake-domain patterns or still too weak.
- Repair generated fake official domains: Many state office, DD, waiver, early intervention, and form targets are blocked because the repo currently has generated fake official domains.
- More named first-party provider targets: Provider coverage is still the biggest visible info gap even after the ready provider URLs are scraped.
- Knowledge article source families: The product needs many more explanatory content inputs, but the current target inventory is mostly directory/routing oriented.

## Authored Missing-Family Coverage

- housing: 52
- goods_supplies: 51
- jobs_vocational: 51
- legal_aid: 51
- providers_care: 2
- knowledge_content: 2
- advocates_legal: 1
- transport_utilities_food: 1
- care_independent_living: 1

## Top Combined Ready Targets

- national: https://findahealthcenter.hrsa.gov/ (resource_providers; providers_care; ready_js_heavy; queue=authored_missing_family)
- national: https://www.medicare.gov/care-compare (resource_providers; providers_care; discovery_only; queue=authored_missing_family)
- national: https://www.ndrn.org/about/ndrn-member-agencies (iep_advocates; advocates_legal; ready_lightweight; queue=authored_missing_family)
- national: https://resources.hud.gov/ (nonprofit_organizations; housing; ready_js_heavy; queue=authored_missing_family)
- national: https://www.hud.gov/program_offices/public_indian_housing/pha/contacts (nonprofit_organizations; housing; ready_lightweight; queue=authored_missing_family)
- national: https://at3center.net/state-at-programs (nonprofit_organizations; goods_supplies; ready_lightweight; queue=authored_missing_family)
- national: https://rsa.ed.gov/about/states (programs; jobs_vocational; ready_lightweight; queue=authored_missing_family)
- national: https://www.ilru.org/projects/cil-net/cil-center-and-association-directory (nonprofit_organizations; care_independent_living; ready_lightweight; queue=authored_missing_family)
- national: https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help (nonprofit_organizations; legal_aid; ready_lightweight; queue=authored_missing_family)
- national: https://sites.ed.gov/idea (knowledge_articles; knowledge_content; ready_lightweight; queue=authored_missing_family)
- national: https://www.cdc.gov/child-development/about/developmental-disabilities.html (knowledge_articles; knowledge_content; ready_lightweight; queue=authored_missing_family)
- national: https://www.211.org/ (nonprofit_organizations; transport_utilities_food; discovery_only; queue=authored_missing_family)
- georgia: https://dch.georgia.gov/specialized-roster-1 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-10 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-11 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-12 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-13 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-14 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-15 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-16 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-17 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-18 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-19 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-2 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-20 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-21 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-3 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-4 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-5 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-6 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-7 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-8 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- georgia: https://dch.georgia.gov/specialized-roster-9 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-1 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-10 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-11 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-12 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-13 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-14 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-15 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-16 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-17 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-18 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-19 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-2 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-20 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-21 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-22 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-23 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
- illinois: https://hfs.illinois.gov/specialized-roster-3 (resource_providers; providers_care; ready_lightweight; queue=master_ledger_ready)
