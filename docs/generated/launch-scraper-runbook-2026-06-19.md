# Launch Scraper Runbook

Generated: 2026-06-19T23:21:10.361Z

Compact family-by-family operator runbook for launch scraper execution so fetch-only and full-lane work can be run without improvising in chat.

## Global Preflight

- Run npm run audit:launch-scrape-link-inventory
- Run npm run audit:launch-scraper-contract
- Run npm run audit:launch-scraper-field-contract
- Run npm run audit:launch-scraper-fixture-matrix
- Do not expand beyond launch-critical families in this runbook.

## dd_routing

- currentReadyTargetScrape: 12
- currentReadyByLane: {"ready_js_heavy":6,"ready_lightweight":6}
- executionMode: fetch_first_then_parse
- recommendedRunMode: full_lane_when_successful
- preflight:
  - Run npm run audit:launch-scrape-link-inventory
  - Run npm run audit:launch-scraper-contract
  - Run npm run audit:launch-scraper-fixture-matrix
  - Confirm 12 ready target(s) still exist for dd_routing.
- cadence: fetch -> followups -> parse -> validate -> stage -> refresh queue truth
- successGate: Fetched pages should contain: agency heading, phone or intake contact, services or eligibility link.
- stopRule: Stop the family wave when any stop condition appears: ready_lane_exhausted, repeated_blocked_pattern, repair_needed_before_more_fetches.
- nextIfBlocked: Move repeated broken URLs into repair-first and do not re-fetch until replaced.
- compactAcceptanceSignals: agency heading, phone or intake contact, services or eligibility link
- compactFailureSignals:
  - Agency page shell without agency name extraction.
    - rejectionReasons: missing_office_name
  - Agency overview with no phone, email, or intake contact signal.
    - rejectionReasons: missing_dd_contact_signal
- commandSet:
  - lane: ready_lightweight
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=dd_routing --status=ready_lightweight --lane=ready_target_scrape --limit=6`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=dd_routing --status=ready_lightweight --lane=ready_target_scrape --limit=6 --concurrency=8 --rate-limit-ms=300`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=dd_routing`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=dd_routing`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=dd_routing --mode=dry-run`
  - lane: ready_js_heavy
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=dd_routing --status=ready_js_heavy --lane=ready_target_scrape --limit=3`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=dd_routing --status=ready_js_heavy --lane=ready_target_scrape --limit=3 --concurrency=3 --rate-limit-ms=1200`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=dd_routing`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=dd_routing`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=dd_routing --mode=dry-run`
- outputArtifacts: manifest.json, summary.json, results.csv, report.md, pages/

## programs_benefits

- currentReadyTargetScrape: 30
- currentReadyByLane: {"ready_lightweight":30}
- executionMode: fetch_first_then_parse
- recommendedRunMode: fetch_only_first
- preflight:
  - Run npm run audit:launch-scrape-link-inventory
  - Run npm run audit:launch-scraper-contract
  - Run npm run audit:launch-scraper-fixture-matrix
  - Confirm 30 ready target(s) still exist for programs_benefits.
- cadence: fetch -> followups -> review compact summary -> only then decide whether parse/validate/stage is worth running
- successGate: Fetched pages should contain: program heading, apply or learn-more action link or phone, official source page.
- stopRule: Stop the family wave when any stop condition appears: ready_lane_exhausted, generic_program_pages_dominate.
- nextIfBlocked: Move repeated broken URLs into repair-first and do not re-fetch until replaced.
- compactAcceptanceSignals: program heading, apply or learn-more action link or phone, official source page
- compactFailureSignals:
  - Generic agency page that never names a distinct program.
    - rejectionReasons: missing_program_name
  - Program explainer without apply link, outbound action path, or phone.
    - rejectionReasons: missing_action_signal
- commandSet:
  - lane: ready_lightweight
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=programs_benefits --status=ready_lightweight --lane=ready_target_scrape --limit=10`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=programs_benefits --status=ready_lightweight --lane=ready_target_scrape --limit=10 --concurrency=8 --rate-limit-ms=300`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=programs_benefits`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=programs_benefits`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=programs_benefits --mode=dry-run`
- outputArtifacts: manifest.json, summary.json, results.csv, report.md, pages/

## waivers

- currentReadyTargetScrape: 13
- currentReadyByLane: {"ready_lightweight":13}
- executionMode: fetch_first_then_parse
- recommendedRunMode: full_lane_when_successful
- preflight:
  - Run npm run audit:launch-scrape-link-inventory
  - Run npm run audit:launch-scraper-contract
  - Run npm run audit:launch-scraper-fixture-matrix
  - Confirm 13 ready target(s) still exist for waivers.
- cadence: fetch -> followups -> parse -> validate -> stage -> refresh queue truth
- successGate: Fetched pages should contain: waiver name, application or eligibility step link, official source page.
- stopRule: Stop the family wave when any stop condition appears: ready_lane_exhausted, needs_repair_replacements.
- nextIfBlocked: Move repeated broken URLs into repair-first and do not re-fetch until replaced.
- compactAcceptanceSignals: waiver name, application or eligibility step link, official source page
- compactFailureSignals:
  - Generic Medicaid page with no distinct waiver identity.
    - rejectionReasons: missing_program_name
  - Waiver summary page with no application/contact step.
    - rejectionReasons: missing_action_signal
- commandSet:
  - lane: ready_lightweight
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=waivers --status=ready_lightweight --lane=ready_target_scrape --limit=8`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=waivers --status=ready_lightweight --lane=ready_target_scrape --limit=8 --concurrency=8 --rate-limit-ms=300`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=waivers`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=waivers`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=waivers --mode=dry-run`
- outputArtifacts: manifest.json, summary.json, results.csv, report.md, pages/

## forms_guides

- currentReadyTargetScrape: 220
- currentReadyByLane: {"ready_pdf":220}
- executionMode: fetch_first_then_parse
- recommendedRunMode: fetch_only_first
- preflight:
  - Run npm run audit:launch-scrape-link-inventory
  - Run npm run audit:launch-scraper-contract
  - Run npm run audit:launch-scraper-fixture-matrix
  - Confirm 220 ready target(s) still exist for forms_guides.
- cadence: fetch -> followups -> review compact summary -> only then decide whether parse/validate/stage is worth running
- successGate: Fetched pages should contain: official-like source URL, program or form title, download URL or library URL.
- stopRule: Stop the family wave when any stop condition appears: ready_lane_exhausted, pdf_batch_failure_spike.
- nextIfBlocked: Move repeated broken URLs into repair-first and do not re-fetch until replaced.
- compactAcceptanceSignals: official-like source URL, program or form title, download URL or library URL
- compactFailureSignals:
  - Unofficial mirror or placeholder domain page.
    - rejectionReasons: forms_requires_official_source
  - Official form library page with no form/program context extractable.
    - rejectionReasons: missing_form_program_name
  - Official page with no download URL and no approved library target.
    - rejectionReasons: missing_official_download_or_library_url
- commandSet:
  - lane: ready_pdf
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=forms_guides --status=ready_pdf --lane=ready_target_scrape --limit=10`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=forms_guides --status=ready_pdf --lane=ready_target_scrape --limit=10 --concurrency=4 --rate-limit-ms=300`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=forms_guides`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=forms_guides`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=forms_guides --mode=dry-run`
- outputArtifacts: manifest.json, summary.json, results.csv, report.md, pages/

## program_waitlists

- currentReadyTargetScrape: 0
- currentReadyByLane: {}
- executionMode: author_or_queue_refresh_first
- recommendedRunMode: author_first_only
- preflight:
  - Run npm run audit:launch-scrape-link-inventory
  - Run npm run audit:launch-scraper-contract
  - Run npm run audit:launch-scraper-fixture-matrix
  - Do not fetch until waitlist rows are visible as a first-class queue lane.
- cadence: refresh queue truth -> author or reclassify exact targets -> regenerate launch queue artifacts -> re-check family readiness
- successGate: Queue must first become launch-visible and exact-target-backed before any fetch starts.
- stopRule: Stop immediately if no exact ready targets are visible; do queue/authoring refresh instead of fetching.
- nextIfBlocked: Refresh authoring or queue artifact instead of opening a fetch wave.
- compactAcceptanceSignals: program or waiver name, waitlist or interest-list language, official next-step link or phone
- compactFailureSignals:
  - Program page with no named program or waiver identity.
    - rejectionReasons: missing_program_name
  - Waitlist mention inferred from generic program copy without explicit action signal.
    - rejectionReasons: missing_action_signal
- commandSet: none until queue/authoring refresh creates exact ready targets
- outputArtifacts: manifest.json, summary.json, results.csv, report.md, pages/

## medicaid_hhs_offices

- currentReadyTargetScrape: 131
- currentReadyByLane: {"ready_js_heavy":9,"ready_lightweight":121,"ready_pdf":1}
- executionMode: fetch_first_after_repair
- recommendedRunMode: fetch_only_first
- preflight:
  - Run npm run audit:launch-scrape-link-inventory
  - Run npm run audit:launch-scraper-contract
  - Run npm run audit:launch-scraper-fixture-matrix
  - Confirm 131 ready target(s) still exist for medicaid_hhs_offices.
- cadence: fetch -> followups -> review compact summary -> only then decide whether parse/validate/stage is worth running
- successGate: Fetched pages should contain: office name, office phone, street address.
- stopRule: Stop the family wave when any stop condition appears: ready_lane_exhausted, malformed_hostname_cluster, repair_first_backlog_growth.
- nextIfBlocked: Pause the family wave and review the compact followup summary only.
- compactAcceptanceSignals: office name, office phone, street address
- compactFailureSignals:
  - County office page that fails to expose an office name.
    - rejectionReasons: missing_office_name
  - Office page with no phone.
    - rejectionReasons: missing_office_phone
  - Office page with no physical address.
    - rejectionReasons: missing_office_address
- commandSet:
  - lane: ready_lightweight
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=medicaid_hhs_offices --status=ready_lightweight --lane=ready_target_scrape --limit=15`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=medicaid_hhs_offices --status=ready_lightweight --lane=ready_target_scrape --limit=15 --concurrency=10 --rate-limit-ms=300`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=medicaid_hhs_offices`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=medicaid_hhs_offices`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=medicaid_hhs_offices --mode=dry-run`
  - lane: ready_js_heavy
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=medicaid_hhs_offices --status=ready_js_heavy --lane=ready_target_scrape --limit=3`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=medicaid_hhs_offices --status=ready_js_heavy --lane=ready_target_scrape --limit=3 --concurrency=3 --rate-limit-ms=1200`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=medicaid_hhs_offices`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=medicaid_hhs_offices`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=medicaid_hhs_offices --mode=dry-run`
  - lane: ready_pdf
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=medicaid_hhs_offices --status=ready_pdf --lane=ready_target_scrape --limit=1`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=medicaid_hhs_offices --status=ready_pdf --lane=ready_target_scrape --limit=1 --concurrency=2 --rate-limit-ms=300`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=medicaid_hhs_offices`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=medicaid_hhs_offices`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=medicaid_hhs_offices --mode=dry-run`
- outputArtifacts: manifest.json, summary.json, results.csv, report.md, pages/

## education_routing

- currentReadyTargetScrape: 15
- currentReadyByLane: {"ready_js_heavy":10,"ready_lightweight":5}
- executionMode: fetch_first_then_parse
- recommendedRunMode: full_lane_when_successful
- preflight:
  - Run npm run audit:launch-scrape-link-inventory
  - Run npm run audit:launch-scraper-contract
  - Run npm run audit:launch-scraper-fixture-matrix
  - Confirm 15 ready target(s) still exist for education_routing.
- cadence: fetch -> followups -> parse -> validate -> stage -> refresh queue truth
- successGate: Fetched pages should contain: district or agency identity, credible official site, phone, email, or routing page link.
- stopRule: Stop the family wave when any stop condition appears: ready_lane_exhausted, 3_state_gap_needs_explicit_block_or_fallback.
- nextIfBlocked: Pause the family wave and review the compact followup summary only.
- compactAcceptanceSignals: district or agency identity, credible official site, phone, email, or routing page link
- compactFailureSignals:
  - Thin education page with no phone, no email, and no usable routing link.
    - rejectionReasons: missing_basic_signal
- commandSet:
  - lane: ready_lightweight
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=education_routing --status=ready_lightweight --lane=ready_target_scrape --limit=5`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=education_routing --status=ready_lightweight --lane=ready_target_scrape --limit=5 --concurrency=8 --rate-limit-ms=300`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=education_routing`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=education_routing`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=education_routing --mode=dry-run`
  - lane: ready_js_heavy
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=education_routing --status=ready_js_heavy --lane=ready_target_scrape --limit=3`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=education_routing --status=ready_js_heavy --lane=ready_target_scrape --limit=3 --concurrency=3 --rate-limit-ms=1200`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=education_routing`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=education_routing`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=education_routing --mode=dry-run`
- outputArtifacts: manifest.json, summary.json, results.csv, report.md, pages/

## providers_care

- currentReadyTargetScrape: 65
- currentReadyByLane: {"ready_js_heavy":1,"ready_lightweight":64}
- executionMode: fetch_small_anchor_batches
- recommendedRunMode: fetch_only_first
- preflight:
  - Run npm run audit:launch-scrape-link-inventory
  - Run npm run audit:launch-scraper-contract
  - Run npm run audit:launch-scraper-fixture-matrix
  - Confirm 65 ready target(s) still exist for providers_care.
- cadence: fetch -> followups -> review compact summary -> only then decide whether parse/validate/stage is worth running
- successGate: Fetched pages should contain: provider or clinic name, phone or email, address or explicit location signal.
- stopRule: Stop the family wave when any stop condition appears: ready_lane_exhausted, state_anchor_coverage_stalls, author_first_provider_packets_needed.
- nextIfBlocked: Move insufficient targets into author-first and do not expand discovery inside fetch runs.
- compactAcceptanceSignals: provider or clinic name, phone or email, address or explicit location signal
- compactFailureSignals:
  - Provider shell page that never names the clinic or program.
    - rejectionReasons: missing_provider_name
  - Named provider page with no phone, email, address, or other public contact signal.
    - rejectionReasons: missing_provider_contact_signal
- commandSet:
  - lane: ready_lightweight
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=providers_care --status=ready_lightweight --lane=ready_target_scrape --limit=5`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=providers_care --status=ready_lightweight --lane=ready_target_scrape --limit=5 --concurrency=6 --rate-limit-ms=300`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=providers_care`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=providers_care`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=providers_care --mode=dry-run`
  - lane: ready_js_heavy
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=providers_care --status=ready_js_heavy --lane=ready_target_scrape --limit=1`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=providers_care --status=ready_js_heavy --lane=ready_target_scrape --limit=1 --concurrency=2 --rate-limit-ms=1200`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=providers_care`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=providers_care`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=providers_care --mode=dry-run`
- outputArtifacts: manifest.json, summary.json, results.csv, report.md, pages/

## knowledge_content

- currentReadyTargetScrape: 65
- currentReadyByLane: {"ready_lightweight":65}
- executionMode: fetch_first_then_parse
- recommendedRunMode: fetch_only_first
- preflight:
  - Run npm run audit:launch-scrape-link-inventory
  - Run npm run audit:launch-scraper-contract
  - Run npm run audit:launch-scraper-fixture-matrix
  - Confirm 65 ready target(s) still exist for knowledge_content.
- cadence: fetch -> followups -> review compact summary -> only then decide whether parse/validate/stage is worth running
- successGate: Fetched pages should contain: trusted source URL, article title, summary text at least 80 characters.
- stopRule: Stop the family wave when any stop condition appears: ready_lane_exhausted, deferred_blocked_source_replacements_required.
- nextIfBlocked: Move insufficient targets into author-first and do not expand discovery inside fetch runs.
- compactAcceptanceSignals: trusted source URL, article title, summary text at least 80 characters
- compactFailureSignals:
  - Guidance page from non-trusted or weak source domain.
    - rejectionReasons: knowledge_requires_high_trust_source
  - Trusted article page with no extractable title.
    - rejectionReasons: missing_knowledge_title
  - Trusted article page whose extracted summary is too thin.
    - rejectionReasons: knowledge_summary_too_thin
- commandSet:
  - lane: ready_lightweight
    - dryRun: `npm run run:source-acquisition-wave -- --mode=dry-run --gap=knowledge_content --status=ready_lightweight --lane=ready_target_scrape --limit=10`
    - liveRun: `npm run run:source-acquisition-wave -- --mode=live --gap=knowledge_content --status=ready_lightweight --lane=ready_target_scrape --limit=10 --concurrency=8 --rate-limit-ms=300`
    - followups: `npm run run:source-acquisition-followups -- --run-id=<run-id>`
    - parse: `npm run run:source-acquisition-parse -- --run-id=<run-id> --family=knowledge_content`
    - validate: `npm run run:source-acquisition-validate -- --run-id=<run-id> --family=knowledge_content`
    - stage: `npm run run:source-acquisition-stage -- --run-id=<run-id> --family=knowledge_content --mode=dry-run`
- outputArtifacts: manifest.json, summary.json, results.csv, report.md, pages/

