# Nonprofit Gap Planner

Generated: 2026-06-17

This plan maps the current nonprofit repo gaps to the source families, target types, and page types most likely to close them.

## Current gap summary

- trusted nonprofit rows: 29499
- trusted nonprofit rows missing all accessibility: 29108
- local in-person evidence rows: 0
- org-level physical presence rows: 159
- registry targets available: 843
- projected candidate pages available: 13540

## Priority plan

### 1. Nonprofit local in-person evidence

- blocker rows/pages: 29108
- current coverage: 0
- desired outcome: Confirm county- or location-safe in-person coverage for nonprofit rows when local first-party evidence exists.
- target types: affiliate_chapter, affiliate_site, site_path
- page types: contact, location, about, services
- matching registry targets: 507
- estimated targets to work: 150
- estimated pages to collect: 3000
- top source families: thearc.org/chapter/the-arc-of-dallas-fort-worth | thearc.org/chapter/the-arc-of-the-gulf-coast | thearc.org/chapter/the-arc-of-katy | thearc.org/chapter/the-arc-of-greater-beaumont | thearc.org/chapter/the-arc-of-san-antonio | thearc.org/chapter/the-arc-of-bryan-college-station | autismqc.org | thearc.org/chapter/the-arc-southwest-georgia

### 2. Nonprofit org-level physical presence

- blocker rows/pages: 28949
- current coverage: 159
- desired outcome: Record safe org-level office or statewide service-area evidence without implying local office coverage.
- target types: statewide_service_org, single_site
- page types: contact, about, services, events
- matching registry targets: 283
- estimated targets to work: 80
- estimated pages to collect: 1800
- top source families: texasautismsociety.org | txp2p.org | thearcoftexas.org | disabilityrightstx.org | navigatelifetexas.org | prntexas.org | autismqc.org | p2pga.org

### 3. Affiliate discovery for umbrella domains

- blocker rows/pages: 9389
- current coverage: 499
- desired outcome: Convert umbrella and state-listing domains into real affiliate or chapter scrape targets before deep extraction.
- target types: network_directory, state_listing_page
- page types: directory, affiliate, general
- matching registry targets: 53
- estimated targets to work: 60
- estimated pages to collect: 600
- top source families: parentcenterhub.org | thearc.org | dcdcthearc.org

### 4. High-signal page extraction depth

- blocker rows/pages: 13540
- current coverage: 167
- desired outcome: Expand enough candidate pages to feed deterministic extractors for contact, services, about, location, and event evidence.
- target types: affiliate_chapter, affiliate_site, statewide_service_org, single_site
- page types: contact, about, services, location, events
- matching registry targets: 784
- estimated targets to work: 400
- estimated pages to collect: 10000
- top source families: https://thearc.org/chapter/the-arc-of-dallas-fort-worth | https://thearc.org/chapter/the-arc-of-greater-beaumont | https://thearc.org/chapter/the-arc-of-katy | https://thearc.org/chapter/the-arc-of-the-gulf-coast | https://thearc.org/chapter/the-arc-of-bryan-college-station | https://thearc.org/chapter/the-arc-of-san-antonio | https://www.texasautismsociety.org/ | https://www.txp2p.org/

## Immediate execution order

- Expand 100-150 `affiliate_chapter` targets from `thearc.org` first for local office/contact/service pages.
- Mine `parentcenterhub.org` state listing pages into real center-site domains before any promotion work.
- Re-run direct statewide orgs only after adding stronger contact/location/event extraction.
- Promote org-level presence separately from local in-person evidence.
