# Final Website Audit

Generated: 2026-06-28

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This is the exhaustive data-and-surface audit for the final website. It answers three questions together:

- What the final website needs to support.
- What the repo and DB already have today.
- What the remaining gaps are, with current control-plane evidence.

This is intentionally broader than the launch-only audit. It covers the public website, competitive-help depth, operational support layers, and runtime surfaces that the final website implies.

## Executive Read

- Launch-ready COMPLETE states: 45/50
- Launch-blocked states: 5/50 (arizona, alaska, maine, idaho, new-hampshire)
- Launch index-safe states: 45/50
- Incorrectly index-safe launch states: []
- Audit/queue mismatch count on launch truth fields: 0
- Modeled 50-state completeness: 0/50
- High-confidence states on the current audit bar: 0/50
- Strict-gold states: 0/50
- Public-safe but still blocked states: 45/50 (alabama, arkansas, california, colorado, connecticut, delaware, florida, georgia, hawaii, illinois, indiana, iowa, kansas, kentucky, louisiana, maryland, massachusetts, michigan, minnesota, mississippi, missouri, montana, nebraska, nevada, new-jersey, new-mexico, new-york, north-carolina, north-dakota, ohio, oklahoma, oregon, pennsylvania, rhode-island, south-carolina, south-dakota, tennessee, texas, utah, vermont, virginia, washington, west-virginia, wisconsin, wyoming)
- Public data headline: The repo has strong national program, routing, nonprofit, advocate, and condition foundations, but provider coverage, normalization, knowledge depth, and workflow/runtime layers are still thin or empty in the checked-in DB.

### Most Important Truths

- 50/50 modeled completeness does not mean all information categories are deeply built out.
- 0/50 strict-gold states means 45 states still sit in the public-safe-but-blocked lane on the stricter truth registry.
- The named launch milestone `national-initial-scrape-v1` freezes the current launch baseline at 45 COMPLETE states, 5 BLOCKED states, and 45 index-safe states.
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
| /benefits-matcher | A crawlable, source-backed entry page that explains how diagnosis, age, county, and needs flow into programs, forms, contacts, deadlines, and appeals before families save progress privately. | strong | The landing page is live and source-backed, but its downstream value still depends on benefits, county, and knowledge surfaces staying truthful and deep. |
| /counties, /counties/[state], /counties/[state]/[slug] | County offices, DD routing, education routing, local nonprofits, truthful providers, and public-truth gating. | partial | Routing is strong, but county-level local care/provider depth remains thin. |
| /advocates | Truth-safe advocate records, county coverage, contact signals, specialties, and public-eligibility gating. | thin | Advocate count is broad, but truth-safe local depth is still an active blocker and California remains strict-gold blocked here. |
| /conditions/[slug], /situations/[slug], /programs/[slug] | Condition taxonomy, functional-needs mapping, linked programs, routing, and knowledge content. | partial | Reference taxonomy is strong, but knowledge depth and competitive-help depth are still limited. |
| /forms and /forms/[slug] | Official forms, official library roots, appeal/download URLs, and state coverage accounting. | partial | Live form count is strong, but only 7 states are fully cleared and 37 are still fallback-authoring states. |
| /appeals-center and /deadlines/[slug] | Appeal info, deadline logic, waitlists, official forms, and knowledge explainers. | partial | Appeal rows are strong, but waitlist depth and knowledge explainers still need more depth. |
| /financial-planning, /regional-center-funding, /ihss-behavior-log, /iep-goals, /forms-checklist | Knowledge content, program/routing context, and runtime persistence where applicable. | partial | These surfaces exist, but supporting content/runtime depth is still uneven. |
| /dashboard, /login, /register, /share/log/[token] | Family cases, child profiles, reminders, document tracking, collaboration threads, and sharing tokens. | demo_only | Schema exists, but most runtime tables are empty or demo-only in the checked-in DB. |

## Data Family Audit

### Truth and public eligibility contract

- Status: strong
- Final website needs: Every public page must be source-backed and non-synthetic.; Indexing, sitemap inclusion, and render eligibility must follow the same truth rule.; Verification metadata must remain complete for public-serving layers.
- What we have now: 45/50 California-grade COMPLETE states; 5/50 BLOCKED states held in noindex launch posture; 45 index-safe states in the current launch contract; 6 verified diagnosis slugs
- Current staging or authored work: Partial-gated blocked states: arizona, alaska, maine, idaho, new-hampshire
- Current queue or control-plane state: Audit vs queue mismatch count: 0; No direct scrape lane; enforced through truth audits, render gating, sitemap policy, and promotion rules.
- Main gap: The remaining launch work is not broader indexing. It is keeping the 5 blocked states visible only through explicit partial-state gating without implying local proof.

### Geography and coverage foundation

- Status: strong
- Final website needs: 50-state coverage, full county coverage, and junction-based service-area mapping without fake county cloning.
- What we have now: 50 states; 3050 counties; 244 regional-center county links; 174 education county links; 1229 advocate county links; 0 virtual service-area county links
- Current queue or control-plane state: No major geography scrape backlog remains in the broad runnable universe.
- Main gap: Foundation-grade. Keep using junction tables instead of fake local duplication.

### Programs, benefits, appeals, and forms

- Status: strong_but_not_exhaustive
- Final website needs: Program definitions, eligibility rules, document requirements, application steps, appeals, forms, and public-safe program pages.
- What we have now: 258 programs; 300 eligibility rules; 0 document requirements; 1 application steps; 18 appeal records; 2 live forms and guides; Program verification mix: verified=170; source_listed=63; official_verified=25; Form verification mix: needs_review=1; official_verified=1
- Current staging or authored work: 0 staged programs; 0 staged forms; 0 ready rows unresolved; 507 live programs
- Current queue or control-plane state: Launch closure: 100% queue closure; Launch forms accounting: 7 cleared, 6 ready exact, 37 author-first fallback
- Main gap: Programs and forms are structurally strong, but forms exact-state coverage is not finished and generic agency-page overpromotion still has to stay suppressed.

### Waivers and waitlists

- Status: partial
- Final website needs: Explicit waiver identity, source-backed action paths, waitlist or interest-list visibility, and official linkage where applicable.
- What we have now: 6 live waitlist rows; 0 staged waitlist rows; 0 ready rows unresolved; 8 typed live waiver rows; Waitlist launch exact states: florida; georgia; ohio; pennsylvania; illinois; texas
- Current staging or authored work: Program waitlist source types: null=6
- Current queue or control-plane state: Waiver closure: 16% state coverage / 100% queue closure; Waitlist closure: 100% identified / 100% followup queue closure
- Main gap: Waitlists are materially shallower than the broader program layer, and waiver typing/state-level waiver resolution is still incomplete.

### County offices, DD routing, and education routing

- Status: strong_but_not_exhaustive
- Final website needs: Truthful county office lookup, statewide DD/IDD intake paths, regional or district education routing, and complete trust metadata.
- What we have now: 720 county offices; 134 state resource agencies; 174 regional education agencies; 649 school districts; Office verification mix: generated_county_fallback=649; needs_review=49; source_listed=14; official_verified=8; State routing verification mix: source_listed=57; official_verified=44; verified=33
- Current staging or authored work: 17 staged county offices; 0 staged DD routing rows; 0 staged regional education rows; 0 staged school district rows; 50/50 state coverage live; 0 ready rows unresolved; 47/50 regional state coverage; 0 ready rows unresolved
- Current queue or control-plane state: 50/50 state coverage live; 0 ready rows remain; 40 repair rows remain; 94% coverage / 100% queue closure
- Main gap: This is one of the strongest public layers, but regional education is still 47/50 states and final repair-ledger cleanup remains.

### Providers and care

- Status: thin
- Final website needs: Truthful anchor providers per state, named clinics/programs, contact and location evidence, and eventually deeper care discovery.
- What we have now: 1 live providers; 0 staged providers; 1/50 provider states represented; 1/3050 counties with provider rows; Provider verification mix: needs_review=1; Launch provider standard: 0 launch-ready states; 10 pull-now planned; 42 authored targets; 1 discovery-only row
- Current staging or authored work: 42 authored provider targets; 10 pull-now planned states; 1 discovery-only provider rows
- Current queue or control-plane state: Runnable universe leftovers: 1; Completion disposition: queued
- Main gap: This remains the clearest data hole for the final website. Provider rows exist in all states, but county depth and launch-ready anchor coverage are still far from finished.

### Nonprofits and parent-support organizations

- Status: strong_but_not_exhaustive
- Final website needs: Broad local support coverage, trustworthy contact paths, and richer intake/accessibility metadata.
- What we have now: 1775 live nonprofits; 0 staged nonprofits; 7/50 nonprofit states represented; 604/3050 counties with nonprofit rows; Nonprofit verification mix: source_listed=1390; needs_review=343; generated_county_fallback=42
- Current queue or control-plane state: Completion disposition: queued (17 in scope); Runnable universe leftovers: 2
- Main gap: Coverage breadth is strong, but nonprofit metadata remains sparse and there is no separate live competitive-help table yet.

### Advocates and legal / IEP support

- Status: thin
- Final website needs: Truth-safe advocate records, specialties, counties served, contact details, and public-safe legal/IEP support presentation.
- What we have now: 137 live advocates; 0 staged advocates; 545/3050 counties with advocate coverage links; Advocate verification mix: needs_review=97; source_listed=40
- Current queue or control-plane state: Completion disposition: explicitly_blocked; Blocker: advocate_directory_depth; Runnable universe leftovers: 2
- Main gap: Advocate volume is high, but truth-safe local advocate depth is still explicitly blocked and directly affects final website confidence.

### Housing, goods, jobs, care, and other competitive-help families

- Status: missing_live
- Final website needs: Live website rows for housing, goods/supplies, jobs/vocational, care/independent living, and transport/utilities/food.; Actionable service/contact evidence, not just taxonomy or topic tags.
- What we have now: Live help_resources table: missing; staging_scraped_help_resources rows: 0; Completion dispositions: housing=explicitly_blocked, goods=explicitly_blocked, jobs=explicitly_blocked, care=explicitly_blocked, transport=queued
- Current queue or control-plane state: Runnable universe leftovers: housing=0, goods=0, jobs=0, care=0, transport=0
- Main gap: This is a major final-website gap: the site model wants these families, but the checked-in live DB has no dedicated public help-resource table and no staged rows.

### Directory foundation metadata

- Status: partial
- Final website needs: Service taxonomy, audience tags, availability, next-step instructions, accessibility, capacity, claim state, and trust freshness across listings.
- What we have now: 22 service tags; 12 serving tags; Provider accessibility signals: accepts_medi_cal=0/0; interpreter_available=0/0; asl_available=0/0; wheelchair_accessible=0/0; virtual_services=0/0; in_person_services=0/0; home_visits=0/0; transportation_help=0/0; Nonprofit accessibility signals: interpreter_available=0/0; asl_available=0/0; wheelchair_accessible=0/0; virtual_services=0/0; in_person_services=0/0; home_visits=0/0; transportation_help=0/0; Advocate accessibility signals: interpreter_available=0/137; asl_available=0/137; wheelchair_accessible=0/137; virtual_services=0/137; in_person_services=0/137; home_visits=0/137; transportation_help=0/137
- Current queue or control-plane state: Completion disposition: explicitly_blocked; Blocker: directory_foundation_signals
- Main gap: Schema support is excellent, but live nonprofit and advocate accessibility/intake/capacity signals are still near-zero in the checked-in DB.

### Org -> program -> location normalization

- Status: thin
- Final website needs: Canonical organizations, org-program links, service locations, office locations, and virtual service areas that support location-rich discovery without false local claims.
- What we have now: 1 organizations; 1 organization-program links; 1 service locations; 1 office locations; 0 virtual service areas
- Current queue or control-plane state: Completion disposition: explicitly_blocked; Blocker: normalization_depth
- Main gap: Normalization exists, but service-location depth is still far too thin for a fully location-rich final website.

### Conditions, needs, and matching support

- Status: strong
- Final website needs: Condition taxonomy, functional-need taxonomy, age/insurance references, and rule-backed links from disabilities or needs to programs/routing.
- What we have now: 78 conditions; 0 functional needs; null age bands; null insurance types; 300 eligibility rules; reference tables present; no direct queue
- Current queue or control-plane state: Dependency-verification family: 100% direct data present / 0% dependency verification complete
- Main gap: The reference layer is strong; the remaining gap is downstream depth in programs, waivers, providers, and knowledge.

### Knowledge content and guidance

- Status: partial
- Final website needs: Structured explainers for diagnosis, waivers, school rights, appeals, respite, transition, and related family journeys, with provenance-safe serving.
- What we have now: 5 live knowledge articles; 0 staged knowledge articles; 2 promoted live; 54 blocked; 3 unresolved; provenance not yet launch-safe
- Current queue or control-plane state: Completion disposition: explicitly_blocked; Blocker: knowledge_content_depth
- Main gap: Live article volume is still small, and launch planning still flags provenance-safe topic coverage as unresolved.

### Sources, review, and operational feedback loops

- Status: modeled_only
- Final website needs: Healthy source registry, source verifications, user submissions, coverage gaps, and verification queues to sustain the final website.
- What we have now: 0 sources; 0 source verifications; null user-submitted resources; null coverage gaps; null verification queue items
- Main gap: Operational maintenance loops are mostly modeled, but almost empty in live data.

### Family cases, child profiles, reminders, and document tracking

- Status: demo_only
- Final website needs: Real runtime support for cases, children, tracking, documents, reminders, and waiver vault flows if the final website includes signed-in family workflows.
- What we have now: null family cases; 0 child profiles; 0 case program statuses; 0 document checklist items; 0 reminders
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
- Processed in-scope families: 4
- Explicitly blocked in-scope families: 8
- Unknown in-scope families: 0
- All in-scope families accounted for: yes

| Family | Disposition | Queue | Blocker |
| --- | --- | --- | --- |
| Programs, waivers, appeals, and waitlists | processed | 0 |  |
| Forms and guides | processed | 0 |  |
| County offices and DD routing | processed | 0 |  |
| Education routing | processed | 0 |  |
| Nonprofits | queued | 17 |  |
| Advocates and legal support | explicitly_blocked | 0 | advocate_directory_depth |
| Providers and care | queued | 1 | provider_directory |
| Housing | explicitly_blocked | 0 |  |
| Goods and supplies | explicitly_blocked | 0 |  |
| Jobs and vocational support | explicitly_blocked | 0 |  |
| Care and independent living | explicitly_blocked | 0 |  |
| Transport, utilities, and food | queued | 1 |  |
| Knowledge content | explicitly_blocked | 0 | knowledge_content_depth |
| Directory foundation metadata | explicitly_blocked | 0 | directory_foundation_signals |
| Org -> program -> location normalization | explicitly_blocked | 0 | normalization_depth |

## Bottom Line

- The final website already has a strong national foundation for programs, routing, counties, nonprofits, and truth gating.
- The final website is not yet fully complete because providers, competitive-help families, knowledge depth, directory metadata, normalization depth, and runtime collaboration layers are still incomplete or missing.
- The broad scrape universe has now been burned down from 3564 runnable rows to 7 leftovers, so the next work is targeted cleanup and product-depth completion, not another blind broad scrape wave.
