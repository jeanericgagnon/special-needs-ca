# Final Website Audit

Generated: 2026-06-20

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This is the exhaustive data-and-surface audit for the final website. It answers three questions together:

- What the final website needs to support.
- What the repo and DB already have today.
- What the remaining gaps are, with current control-plane evidence.

This is intentionally broader than the launch-only audit. It covers the public website, competitive-help depth, operational support layers, and runtime surfaces that the final website implies.

## Executive Read

- Modeled 50-state completeness: 50/50
- High-confidence states on the current audit bar: 50/50
- Strict-gold states: 49/50
- Public-safe but still blocked states: 1/50 (california)
- Public data headline: The repo has strong national program, routing, nonprofit, advocate, and condition foundations, but provider coverage, normalization, knowledge depth, and workflow/runtime layers are still thin or empty in the checked-in DB.

### Most Important Truths

- 50/50 modeled completeness does not mean all information categories are deeply built out.
- 49/50 strict gold means one state is still blocked even on the stricter public-truth bar.
- Provider coverage and knowledge-content depth are still the largest visible product information gaps.
- Directory metadata exists in schema, but most nonprofit and advocate rows still lack rich accessibility and capacity signals.
- Several workflow and support layers are still mostly empty despite having schema support.

### Biggest Remaining Final-Website Gaps

- Providers and care are still the biggest final-website data hole.
- Competitive-help families are not live in the checked-in DB at all.
- Knowledge content remains too thin for a fully guided national family journey.
- Directory foundation metadata is modeled well but sparsely populated, especially on nonprofits and advocates.
- Normalization is present but too shallow to power a truly location-rich final website.
- Advocates remain truth-sensitive and still block California from strict gold.
- Runtime/feedback/product-support tables are mostly empty, so signed-in workflows are not final-product complete.

## Public Surface Map

| Route or Surface | What It Needs | Current Status | Main Gap |
| --- | --- | --- | --- |
| / | Trust framing, search entry points, strong downstream data for benefits, county help, and knowledge journeys. | strong | Not data-blocked itself; value depends on downstream public surfaces staying truthful and deep. |
| /find-help | Providers, nonprofits, advocates, directory-foundation metadata, truthful local contact paths, and competitive-help categories. | partial | Providers are thin, competitive-help is not live, and nonprofit/advocate metadata is sparse. |
| /benefits and /benefits/[state]/[[...slug]] | Programs, eligibility, documents, steps, appeals, forms, waitlists, waiver typing, DD routing, and knowledge support. | strong_but_not_exhaustive | Waitlists are shallower than the rest of the program layer and waiver typing is still sparse. |
| /counties, /counties/[state], /counties/[state]/[slug] | County offices, DD routing, education routing, local nonprofits, truthful providers, and public-truth gating. | partial | Routing is strong, but county-level local care/provider depth remains thin. |
| /advocates | Truth-safe advocate records, county coverage, contact signals, specialties, and public-eligibility gating. | thin | Advocate count is broad, but truth-safe local depth is still an active blocker and California remains strict-gold blocked here. |
| /conditions/[slug], /situations/[slug], /programs/[slug] | Condition taxonomy, functional-needs mapping, linked programs, routing, and knowledge content. | partial | Reference taxonomy is strong, but knowledge depth and competitive-help depth are still limited. |
| /forms and /forms/[slug] | Official forms, official library roots, appeal/download URLs, and state coverage accounting. | partial | Live form count is strong, but only 7 states are fully cleared and 37 are still fallback-authoring states. |
| /appeals-center and /deadlines/[slug] | Appeal info, deadline logic, waitlists, official forms, and knowledge explainers. | partial | Appeal rows are strong, but waitlist depth and knowledge explainers still need more depth. |
| /financial-planning, /regional-center-funding, /ihss-behavior-log, /iep-goals | Knowledge content, program/routing context, and runtime persistence where applicable. | partial | These surfaces exist, but supporting content/runtime depth is still uneven. |
| /dashboard, /login, /register, /share/log/[token] | Family cases, child profiles, reminders, document tracking, collaboration threads, and sharing tokens. | demo_only | Schema exists, but most runtime tables are empty or demo-only in the checked-in DB. |

## Data Family Audit

### Truth and public eligibility contract

- Status: strong
- Final website needs: Every public page must be source-backed and non-synthetic.; Indexing, sitemap inclusion, and render eligibility must follow the same truth rule.; Verification metadata must remain complete for public-serving layers.
- What we have now: 49/50 strict-gold states; 1/50 public-safe but blocked states; 50 indexable states in the public truth contract; 6 verified diagnosis slugs
- Current staging or authored work: Blocked strict-gold state IDs: california
- Current queue or control-plane state: No direct scrape lane; enforced through truth audits, render gating, and promotion rules.
- Main gap: California is still the only strict-gold exception; deeper local data must not bypass truth gating.

### Geography and coverage foundation

- Status: strong
- Final website needs: 50-state coverage, full county coverage, and junction-based service-area mapping without fake county cloning.
- What we have now: 50 states; 3094 counties; 6320 regional-center county links; 833 education county links; 21178 advocate county links; 52258 virtual service-area county links
- Current queue or control-plane state: No major geography scrape backlog remains in the broad runnable universe.
- Main gap: Foundation-grade. Keep using junction tables instead of fake local duplication.

### Programs, benefits, appeals, and forms

- Status: strong_but_not_exhaustive
- Final website needs: Program definitions, eligibility rules, document requirements, application steps, appeals, forms, and public-safe program pages.
- What we have now: 507 programs; 303 eligibility rules; 502 document requirements; 992 application steps; 451 appeal records; 1070 live forms and guides; Program verification mix: verified=489; official_verified=18; Form verification mix: verified=1025; source_listed=45
- Current staging or authored work: 8 staged programs; 186 staged forms; 0 ready rows unresolved; 507 live programs
- Current queue or control-plane state: Launch closure: 100% queue closure; Launch forms accounting: 7 cleared, 6 ready exact, 37 author-first fallback
- Main gap: Programs and forms are structurally strong, but forms exact-state coverage is not finished and generic agency-page overpromotion still has to stay suppressed.

### Waivers and waitlists

- Status: partial
- Final website needs: Explicit waiver identity, source-backed action paths, waitlist or interest-list visibility, and official linkage where applicable.
- What we have now: 165 live waitlist rows; 7 staged waitlist rows; 0 ready rows unresolved; 8 typed live waiver rows; Waitlist launch exact states: florida; georgia; ohio; pennsylvania; illinois; texas
- Current staging or authored work: Program waitlist source types: official_program_page=104; null=52; official_state=6; program_source_fallback=2; official_report=1
- Current queue or control-plane state: Waiver closure: 16% state coverage / 100% queue closure; Waitlist closure: 100% identified / 100% followup queue closure
- Main gap: Waitlists are materially shallower than the broader program layer, and waiver typing/state-level waiver resolution is still incomplete.

### County offices, DD routing, and education routing

- Status: strong_but_not_exhaustive
- Final website needs: Truthful county office lookup, statewide DD/IDD intake paths, regional or district education routing, and complete trust metadata.
- What we have now: 3678 county offices; 636 state resource agencies; 313 regional education agencies; 3117 school districts; Office verification mix: verified=3666; official_verified=12; State routing verification mix: verified=615; official_verified=21
- Current staging or authored work: 3050 staged county offices; 462 staged DD routing rows; 162 staged regional education rows; 2875 staged school district rows; 50/50 state coverage live; 0 ready rows unresolved; 47/50 regional state coverage; 0 ready rows unresolved
- Current queue or control-plane state: 50/50 state coverage live; 0 ready rows remain; 40 repair rows remain; 94% coverage / 100% queue closure
- Main gap: This is one of the strongest public layers, but regional education is still 47/50 states and final repair-ledger cleanup remains.

### Providers and care

- Status: thin
- Final website needs: Truthful anchor providers per state, named clinics/programs, contact and location evidence, and eventually deeper care discovery.
- What we have now: 96 live providers; 125 staged providers; 50/50 provider states represented; 74/3094 counties with provider rows; Provider verification mix: source_listed=90; official_verified=6; Launch provider standard: 0 launch-ready states; 10 pull-now planned; 42 authored targets; 1 discovery-only row
- Current staging or authored work: 42 authored provider targets; 10 pull-now planned states; 1 discovery-only provider rows
- Current queue or control-plane state: Runnable universe leftovers: 1; Completion disposition: queued
- Main gap: This remains the clearest data hole for the final website. Provider rows exist in all states, but county depth and launch-ready anchor coverage are still far from finished.

### Nonprofits and parent-support organizations

- Status: strong_but_not_exhaustive
- Final website needs: Broad local support coverage, trustworthy contact paths, and richer intake/accessibility metadata.
- What we have now: 29501 live nonprofits; 21597 staged nonprofits; 50/50 nonprofit states represented; 3094/3094 counties with nonprofit rows; Nonprofit verification mix: verified=22429; official_verified=7070; source_listed=2
- Current queue or control-plane state: Completion disposition: queued (17 in scope); Runnable universe leftovers: 2
- Main gap: Coverage breadth is strong, but nonprofit metadata remains sparse and there is no separate live competitive-help table yet.

### Advocates and legal / IEP support

- Status: thin
- Final website needs: Truth-safe advocate records, specialties, counties served, contact details, and public-safe legal/IEP support presentation.
- What we have now: 2995 live advocates; 4454 staged advocates; 2660/3094 counties with advocate coverage links; Advocate verification mix: verified=2933; official_verified=62
- Current queue or control-plane state: Completion disposition: explicitly_blocked; Blocker: advocate_directory_depth; Runnable universe leftovers: 2
- Main gap: Advocate volume is high, but truth-safe local advocate depth is still explicitly blocked and directly affects final website confidence.

### Housing, goods, jobs, care, and other competitive-help families

- Status: missing_live
- Final website needs: Live website rows for housing, goods/supplies, jobs/vocational, care/independent living, and transport/utilities/food.; Actionable service/contact evidence, not just taxonomy or topic tags.
- What we have now: Live help_resources table: missing; staging_scraped_help_resources rows: 0; Completion dispositions: housing=unknown, goods=unknown, jobs=unknown, care=unknown, transport=queued
- Current queue or control-plane state: Runnable universe leftovers: housing=0, goods=0, jobs=0, care=0, transport=0
- Main gap: This is a major final-website gap: the site model wants these families, but the checked-in live DB has no dedicated public help-resource table and no staged rows.

### Directory foundation metadata

- Status: partial
- Final website needs: Service taxonomy, audience tags, availability, next-step instructions, accessibility, capacity, claim state, and trust freshness across listings.
- What we have now: 22 service tags; 12 serving tags; Provider accessibility signals: accepts_medi_cal=27/96; interpreter_available=22/96; asl_available=12/96; wheelchair_accessible=5/96; virtual_services=18/96; in_person_services=70/96; home_visits=3/96; transportation_help=9/96; Nonprofit accessibility signals: interpreter_available=0/29501; asl_available=0/29501; wheelchair_accessible=0/29501; virtual_services=1/29501; in_person_services=22/29501; home_visits=0/29501; transportation_help=0/29501; Advocate accessibility signals: interpreter_available=0/2995; asl_available=0/2995; wheelchair_accessible=0/2995; virtual_services=2/2995; in_person_services=0/2995; home_visits=0/2995; transportation_help=0/2995
- Current queue or control-plane state: Completion disposition: explicitly_blocked; Blocker: directory_foundation_signals
- Main gap: Schema support is excellent, but live nonprofit and advocate accessibility/intake/capacity signals are still near-zero in the checked-in DB.

### Org -> program -> location normalization

- Status: thin
- Final website needs: Canonical organizations, org-program links, service locations, office locations, and virtual service areas that support location-rich discovery without false local claims.
- What we have now: 36902 organizations; 36902 organization-program links; 94 service locations; 4314 office locations; 33130 virtual service areas
- Current queue or control-plane state: Completion disposition: explicitly_blocked; Blocker: normalization_depth
- Main gap: Normalization exists, but service-location depth is still far too thin for a fully location-rich final website.

### Conditions, needs, and matching support

- Status: strong
- Final website needs: Condition taxonomy, functional-need taxonomy, age/insurance references, and rule-backed links from disabilities or needs to programs/routing.
- What we have now: 78 conditions; 18 functional needs; 7 age bands; 4 insurance types; 303 eligibility rules; reference tables present; no direct queue
- Current queue or control-plane state: Dependency-verification family: 100% direct data present / 0% dependency verification complete
- Main gap: The reference layer is strong; the remaining gap is downstream depth in programs, waivers, providers, and knowledge.

### Knowledge content and guidance

- Status: partial
- Final website needs: Structured explainers for diagnosis, waivers, school rights, appeals, respite, transition, and related family journeys, with provenance-safe serving.
- What we have now: 23 live knowledge articles; 8 staged knowledge articles; 2 promoted live; 54 blocked; 3 unresolved; provenance not yet launch-safe
- Current queue or control-plane state: Completion disposition: explicitly_blocked; Blocker: knowledge_content_depth
- Main gap: Live article volume is still small, and launch planning still flags provenance-safe topic coverage as unresolved.

### Sources, review, and operational feedback loops

- Status: modeled_only
- Final website needs: Healthy source registry, source verifications, user submissions, coverage gaps, and verification queues to sustain the final website.
- What we have now: 30 sources; 18 source verifications; 0 user-submitted resources; 0 coverage gaps; 2 verification queue items
- Main gap: Operational maintenance loops are mostly modeled, but almost empty in live data.

### Family cases, child profiles, reminders, and document tracking

- Status: demo_only
- Final website needs: Real runtime support for cases, children, tracking, documents, reminders, and waiver vault flows if the final website includes signed-in family workflows.
- What we have now: 1 family cases; 1 child profiles; 0 case program statuses; 0 document checklist items; 0 reminders
- Main gap: This is mostly demo-level runtime data today, not a fully live family workflow layer.

### Support planning, collaboration, and shared portal flows

- Status: modeled_only
- Final website needs: Collaboration threads, share tokens, clinical documents, IEP accommodations/goals, and respite/planning tools if the final website includes family coordination.
- What we have now: 0 consultation threads; 0 consultation messages; 0 shared portal tokens; 0 safety incidents; 0 parent declarations; 0 caregiver profiles; 0 transition tasks; 0 caregiver self-care logs; 0 child coordinators; 0 clinical documents; 0 IEP accommodations; 0 IEP goals; 0 respite assessments
- Main gap: These collaboration/planning surfaces are essentially schema-only in the checked-in DB.

## Competitive-Help Read

- The final website clearly wants housing, goods, jobs, care/independent living, transport/utilities/food, and related family-support surfaces.
- The checked-in live DB currently has no `help_resources` table: missing.
- `staging_scraped_help_resources` rows: 0.
- This means the competitive-help portion of a Findhelp-like experience is still a real product/data gap, not just a queue gap.

## Current Scrape and Acquisition Position

- Completion-plan launch queue baseline: readyRows=20, ready_lightweight=15, ready_js_heavy=3, ready_pdf=0, discovery_only=2
- Broad scrape-target universe ready rows: 3564
- Broad scrape-target universe remaining runnable rows: 7
- Excluded/resolved from prior runs: 3557
- Resolved run totals: accepted=2840, rejected=1348, sourceRepair=2742, terminalBlocked=477
- Remaining runnable rows by status: ready_js_heavy=1; ready_lightweight=6
- Remaining runnable rows by family: nonprofit_support=2; advocates_legal=2; condition_nonprofits=1; general_gap_fill=1; providers_care=1

### Notable Burn-Down Runs

- 2026-06-20T02-33-42-899Z (ready_lightweight): Queue burned down from 486 to 6; 469 accepted and 467 staged.
- 2026-06-20T03-03-57-641Z (ready_pdf): Queue burned down from 129 to 0; 41 accepted and 41 staged.
- 2026-06-20T03-05-03-417Z (ready_js_heavy): JS-heavy tail burned from 3 to 1; two rows became blocked and one remains.

### Remaining Runnable Rows

| Family | State | Target Table | Status | Crawl Method | URL |
| --- | --- | --- | --- | --- | --- |
| nonprofit_support | nevada | nonprofit_organizations | ready_js_heavy | playwright | https://thearcnevada.org/ |
| advocates_legal | multi-state | iep_advocates | ready_lightweight | static_fetch | http://ideanet.doe.state.in.us/legal/welcome.html |
| advocates_legal | multi-state | iep_advocates | ready_lightweight | static_fetch | http://www.carlazeiteraba.com/ |
| condition_nonprofits | nevada | nonprofit_organizations | ready_lightweight | static_fetch | https://www.thearcnevada.org/ |
| general_gap_fill | florida | program_document_requirements | ready_lightweight | static_fetch | https://apd.myflorida.com/cdcplus/forms-rules.htm |
| nonprofit_support | texas | nonprofit_organizations | ready_lightweight | static_fetch | https://www.facebook.com/rgvdsa |
| providers_care | indiana | resource_providers | ready_lightweight | static_fetch | https://www.rileychildrens.org/contact-and-locations/riley-hospital-for-children-at-iu-health |

## Completion-Audit Read

- Missing source families: 0
- Actionable blocker classes: 0
- Queued in-scope families: 3
- Processed in-scope families: 3
- Explicitly blocked in-scope families: 4
- Unknown in-scope families: 5
- All in-scope families accounted for: no

| Family | Disposition | Queue | Blocker |
| --- | --- | --- | --- |
| Programs, waivers, appeals, and waitlists | processed | 0 |  |
| Forms and guides | unknown | 0 |  |
| County offices and DD routing | processed | 0 |  |
| Education routing | processed | 0 |  |
| Nonprofits | queued | 17 |  |
| Advocates and legal support | explicitly_blocked | 0 | advocate_directory_depth |
| Providers and care | queued | 1 | provider_directory |
| Housing | unknown | 0 |  |
| Goods and supplies | unknown | 0 |  |
| Jobs and vocational support | unknown | 0 |  |
| Care and independent living | unknown | 0 |  |
| Transport, utilities, and food | queued | 1 |  |
| Knowledge content | explicitly_blocked | 0 | knowledge_content_depth |
| Directory foundation metadata | explicitly_blocked | 0 | directory_foundation_signals |
| Org -> program -> location normalization | explicitly_blocked | 0 | normalization_depth |

## Bottom Line

- The final website already has a strong national foundation for programs, routing, counties, nonprofits, and truth gating.
- The final website is not yet fully complete because providers, competitive-help families, knowledge depth, directory metadata, normalization depth, and runtime collaboration layers are still incomplete or missing.
- The broad scrape universe has now been burned down from 3564 runnable rows to 7 leftovers, so the next work is targeted cleanup and product-depth completion, not another blind broad scrape wave.
