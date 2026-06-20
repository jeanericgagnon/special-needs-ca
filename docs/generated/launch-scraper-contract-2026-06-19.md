# Launch Scraper Contract

Generated: 2026-06-19

## Fetch Contract

- userAgent: Ablefull source acquisition runner/1.0 (+https://ablefull.com)
- requestTimeoutMs: 15000
- bodyTimeoutMs: 15000
- retryCount: 2
- redirectMode: follow
- defaultRateLimitMs: 1200
- outputArtifacts: manifest.json, summary.json, results.csv, report.md, pages/

## Followup Contract

- buckets: parse_ready_high_signal, parse_ready_suspect, retryable, blocked, source_repair
- terminalBlockedStatuses: 401, 403, 409, 421, 444, 999
- terminalRepairStatuses: 400, 404, 410, 451
- retryableStatuses: 500, 502, 503, 504, 523, 530

## Launch Family Order

- dd_routing
- programs_benefits
- waivers
- forms_guides
- program_waitlists
- medicaid_hhs_offices
- education_routing
- providers_care
- knowledge_content

## dd_routing

- Current counts:
- totalKnownUrls: 373
- readyTargetScrape: 12
- authorFirst: 0
- repairFirst: 78
- deferredBlockedSource: 0
- liveRefreshCandidate: 281
- doNotScrapeQuarantined: 0
- manualReview: 2
- readyByLane: ready_js_heavy=6, ready_lightweight=6
- Execution mode: fetch_first_then_parse
- Lane order: ready_lightweight, ready_js_heavy
- Downstream parser: extractDdRouting
- Downstream validator: missing_office_name, missing_dd_contact_signal
- Accepted signals:
- office_name
- contact_signal
- routing_or_services_page
- Stop conditions:
- ready_lane_exhausted
- repeated_blocked_pattern
- repair_needed_before_more_fetches
- Command templates:
- ready_lightweight dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=dd_routing --status=ready_lightweight --lane=ready_target_scrape --limit=6`
- ready_lightweight live: `npm run run:source-acquisition-wave -- --mode=live --gap=dd_routing --status=ready_lightweight --lane=ready_target_scrape --limit=6 --concurrency=8 --rate-limit-ms=300`
- ready_js_heavy dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=dd_routing --status=ready_js_heavy --lane=ready_target_scrape --limit=3`
- ready_js_heavy live: `npm run run:source-acquisition-wave -- --mode=live --gap=dd_routing --status=ready_js_heavy --lane=ready_target_scrape --limit=3 --concurrency=3 --rate-limit-ms=1200`

## programs_benefits

- Current counts:
- totalKnownUrls: 483
- readyTargetScrape: 30
- authorFirst: 0
- repairFirst: 4
- deferredBlockedSource: 0
- liveRefreshCandidate: 337
- doNotScrapeQuarantined: 112
- manualReview: 0
- readyByLane: ready_lightweight=30
- Execution mode: fetch_first_then_parse
- Lane order: ready_lightweight
- Downstream parser: extractPrograms
- Downstream validator: missing_program_name, missing_action_signal
- Accepted signals:
- program_name
- action_signal
- official_source_page
- Stop conditions:
- ready_lane_exhausted
- generic_program_pages_dominate
- Command templates:
- ready_lightweight dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=programs_benefits --status=ready_lightweight --lane=ready_target_scrape --limit=10`
- ready_lightweight live: `npm run run:source-acquisition-wave -- --mode=live --gap=programs_benefits --status=ready_lightweight --lane=ready_target_scrape --limit=10 --concurrency=8 --rate-limit-ms=300`

## waivers

- Current counts:
- totalKnownUrls: 133
- readyTargetScrape: 13
- authorFirst: 0
- repairFirst: 78
- deferredBlockedSource: 0
- liveRefreshCandidate: 0
- doNotScrapeQuarantined: 40
- manualReview: 2
- readyByLane: ready_lightweight=13
- Execution mode: fetch_first_then_parse
- Lane order: ready_lightweight
- Downstream parser: extractPrograms
- Downstream validator: missing_program_name, missing_action_signal
- Accepted signals:
- explicit_waiver_identity
- action_signal
- eligibility_or_steps_path
- Stop conditions:
- ready_lane_exhausted
- needs_repair_replacements
- Command templates:
- ready_lightweight dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=waivers --status=ready_lightweight --lane=ready_target_scrape --limit=8`
- ready_lightweight live: `npm run run:source-acquisition-wave -- --mode=live --gap=waivers --status=ready_lightweight --lane=ready_target_scrape --limit=8 --concurrency=8 --rate-limit-ms=300`

## forms_guides

- Current counts:
- totalKnownUrls: 758
- readyTargetScrape: 220
- authorFirst: 5
- repairFirst: 77
- deferredBlockedSource: 0
- liveRefreshCandidate: 382
- doNotScrapeQuarantined: 74
- manualReview: 0
- readyByLane: ready_pdf=220
- Execution mode: fetch_first_then_parse
- Lane order: ready_pdf
- Downstream parser: extractForms
- Downstream validator: forms_requires_official_source, missing_form_program_name, missing_official_download_or_library_url
- Accepted signals:
- official_source
- form_or_guide_context
- download_or_library_url
- Stop conditions:
- ready_lane_exhausted
- pdf_batch_failure_spike
- Command templates:
- ready_pdf dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=forms_guides --status=ready_pdf --lane=ready_target_scrape --limit=10`
- ready_pdf live: `npm run run:source-acquisition-wave -- --mode=live --gap=forms_guides --status=ready_pdf --lane=ready_target_scrape --limit=10 --concurrency=4 --rate-limit-ms=300`

## program_waitlists

- Current counts:
- totalKnownUrls: 103
- readyTargetScrape: 0
- authorFirst: 0
- repairFirst: 0
- deferredBlockedSource: 0
- liveRefreshCandidate: 103
- doNotScrapeQuarantined: 0
- manualReview: 0
- readyByLane: 
- Execution mode: author_or_queue_refresh_first
- Lane order: none
- Downstream parser: extractPrograms
- Downstream validator: missing_program_name, missing_action_signal
- Accepted signals:
- explicit_waitlist_identity
- source_linkage
- Stop conditions:
- queue_not_first_class
- no_ready_targets_visible

## medicaid_hhs_offices

- Current counts:
- totalKnownUrls: 474
- readyTargetScrape: 131
- authorFirst: 0
- repairFirst: 0
- deferredBlockedSource: 0
- liveRefreshCandidate: 223
- doNotScrapeQuarantined: 40
- manualReview: 80
- readyByLane: ready_js_heavy=9, ready_lightweight=121, ready_pdf=1
- Execution mode: fetch_first_after_repair
- Lane order: ready_lightweight, ready_js_heavy, ready_pdf
- Downstream parser: extractCountyOffice
- Downstream validator: missing_office_name, missing_office_phone, missing_office_address
- Accepted signals:
- office_name
- phone
- address
- Stop conditions:
- ready_lane_exhausted
- malformed_hostname_cluster
- repair_first_backlog_growth
- Command templates:
- ready_lightweight dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=medicaid_hhs_offices --status=ready_lightweight --lane=ready_target_scrape --limit=15`
- ready_lightweight live: `npm run run:source-acquisition-wave -- --mode=live --gap=medicaid_hhs_offices --status=ready_lightweight --lane=ready_target_scrape --limit=15 --concurrency=10 --rate-limit-ms=300`
- ready_js_heavy dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=medicaid_hhs_offices --status=ready_js_heavy --lane=ready_target_scrape --limit=3`
- ready_js_heavy live: `npm run run:source-acquisition-wave -- --mode=live --gap=medicaid_hhs_offices --status=ready_js_heavy --lane=ready_target_scrape --limit=3 --concurrency=3 --rate-limit-ms=1200`
- ready_pdf dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=medicaid_hhs_offices --status=ready_pdf --lane=ready_target_scrape --limit=1`
- ready_pdf live: `npm run run:source-acquisition-wave -- --mode=live --gap=medicaid_hhs_offices --status=ready_pdf --lane=ready_target_scrape --limit=1 --concurrency=2 --rate-limit-ms=300`

## education_routing

- Current counts:
- totalKnownUrls: 912
- readyTargetScrape: 15
- authorFirst: 0
- repairFirst: 0
- deferredBlockedSource: 0
- liveRefreshCandidate: 792
- doNotScrapeQuarantined: 70
- manualReview: 35
- readyByLane: ready_js_heavy=10, ready_lightweight=5
- Execution mode: fetch_first_then_parse
- Lane order: ready_lightweight, ready_js_heavy
- Downstream parser: extractCommonExtraction->regional/district routing
- Downstream validator: credible_website_or_phone_required
- Accepted signals:
- regional_or_district_entity
- credible_site
- phone_or_routing_path
- Stop conditions:
- ready_lane_exhausted
- 3_state_gap_needs_explicit_block_or_fallback
- Command templates:
- ready_lightweight dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=education_routing --status=ready_lightweight --lane=ready_target_scrape --limit=5`
- ready_lightweight live: `npm run run:source-acquisition-wave -- --mode=live --gap=education_routing --status=ready_lightweight --lane=ready_target_scrape --limit=5 --concurrency=8 --rate-limit-ms=300`
- ready_js_heavy dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=education_routing --status=ready_js_heavy --lane=ready_target_scrape --limit=3`
- ready_js_heavy live: `npm run run:source-acquisition-wave -- --mode=live --gap=education_routing --status=ready_js_heavy --lane=ready_target_scrape --limit=3 --concurrency=3 --rate-limit-ms=1200`

## providers_care

- Current counts:
- totalKnownUrls: 381
- readyTargetScrape: 65
- authorFirst: 182
- repairFirst: 0
- deferredBlockedSource: 0
- liveRefreshCandidate: 130
- doNotScrapeQuarantined: 3
- manualReview: 0
- readyByLane: ready_js_heavy=1, ready_lightweight=64
- Execution mode: fetch_small_anchor_batches
- Lane order: ready_lightweight, ready_js_heavy
- Downstream parser: extractProviders
- Downstream validator: missing_provider_name, missing_provider_contact_signal
- Accepted signals:
- named_provider_or_program
- contact_signal
- location_signal
- Stop conditions:
- ready_lane_exhausted
- state_anchor_coverage_stalls
- author_first_provider_packets_needed
- Command templates:
- ready_lightweight dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=providers_care --status=ready_lightweight --lane=ready_target_scrape --limit=5`
- ready_lightweight live: `npm run run:source-acquisition-wave -- --mode=live --gap=providers_care --status=ready_lightweight --lane=ready_target_scrape --limit=5 --concurrency=6 --rate-limit-ms=300`
- ready_js_heavy dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=providers_care --status=ready_js_heavy --lane=ready_target_scrape --limit=1`
- ready_js_heavy live: `npm run run:source-acquisition-wave -- --mode=live --gap=providers_care --status=ready_js_heavy --lane=ready_target_scrape --limit=1 --concurrency=2 --rate-limit-ms=1200`

## knowledge_content

- Current counts:
- totalKnownUrls: 130
- readyTargetScrape: 65
- authorFirst: 11
- repairFirst: 0
- deferredBlockedSource: 54
- liveRefreshCandidate: 0
- doNotScrapeQuarantined: 0
- manualReview: 0
- readyByLane: ready_lightweight=65
- Execution mode: fetch_first_then_parse
- Lane order: ready_lightweight
- Downstream parser: extractKnowledgeContent
- Downstream validator: knowledge_requires_high_trust_source, missing_knowledge_title, knowledge_summary_too_thin
- Accepted signals:
- trusted_source
- article_title
- useful_summary_text
- Stop conditions:
- ready_lane_exhausted
- deferred_blocked_source_replacements_required
- Command templates:
- ready_lightweight dry-run: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=knowledge_content --status=ready_lightweight --lane=ready_target_scrape --limit=10`
- ready_lightweight live: `npm run run:source-acquisition-wave -- --mode=live --gap=knowledge_content --status=ready_lightweight --lane=ready_target_scrape --limit=10 --concurrency=8 --rate-limit-ms=300`

