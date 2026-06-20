# Launch Scraper Meta Audit

Generated: 2026-06-19T23:21:13.043Z

Meta-audit for launch scraper specification artifacts so the full spec stack can be checked with one command.

- overallPassed: true
- passedCheckCount: 29
- failedCheckCount: 0

## Canonical Families

- dd_routing
- education_routing
- forms_guides
- knowledge_content
- medicaid_hhs_offices
- program_waitlists
- programs_benefits
- providers_care
- waivers

## Checks

- artifact_presence: PASS (requiredArtifacts=19)
- canonical_family_count: PASS (canonicalFamilyCount=9)
- field_contract_family_match: PASS (fieldFamilies=dd_routing,education_routing,forms_guides,knowledge_content,medicaid_hhs_offices,program_waitlists,programs_benefits,providers_care,waivers)
- fixture_matrix_family_match: PASS (fixtureFamilies=dd_routing,education_routing,forms_guides,knowledge_content,medicaid_hhs_offices,program_waitlists,programs_benefits,providers_care,waivers)
- false_positive_taxonomy_covers_launch_families: PASS (falsePositiveFamilies=dd_routing,education_routing,knowledge_content,medicaid_hhs_offices,program_waitlists,programs_benefits,providers_care,waivers)
- lifecycle_contract_family_match: PASS (lifecycleFamilies=dd_routing,education_routing,forms_guides,knowledge_content,medicaid_hhs_offices,program_waitlists,programs_benefits,providers_care,waivers)
- staging_support_family_match: PASS (stagingFamilies=dd_routing,education_routing,forms_guides,knowledge_content,medicaid_hhs_offices,program_waitlists,programs_benefits,providers_care,waivers)
- readiness_board_family_match: PASS (readinessFamilies=dd_routing,education_routing,forms_guides,knowledge_content,medicaid_hhs_offices,program_waitlists,programs_benefits,providers_care,waivers)
- gap_registry_subset_valid: PASS (gapFamilies=)
- runbook_family_match: PASS (runbookFamilies=dd_routing,education_routing,forms_guides,knowledge_content,medicaid_hhs_offices,program_waitlists,programs_benefits,providers_care,waivers)
- provenance_family_match: PASS (provenanceFamilies=dd_routing,education_routing,forms_guides,knowledge_content,medicaid_hhs_offices,program_waitlists,programs_benefits,providers_care,waivers)
- qa_pack_family_match: PASS (qaFamilies=dd_routing,education_routing,forms_guides,knowledge_content,medicaid_hhs_offices,program_waitlists,programs_benefits,providers_care,waivers)
- queue_governance_has_ready_lane: PASS (ready_target_scrape present)
- artifact_contract_has_resume_guarantees: PASS (resumeGuarantees=6)
- inventory_has_launch_rows: PASS (launchCriticalUniqueUrls=3747)
- inventory_ready_matches_governance_count: PASS (inventoryReady=551; governanceReady=551)
- qa_pack_has_real_cases: PASS (acceptedFamilies=9; rejectedFamilies=9)
- false_positive_taxonomy_has_real_examples: PASS (classesWithExamples=4)
- queue_false_positive_risk_has_launch_rows: PASS (queueRiskRows=900)
- queue_false_positive_risk_flags_live_refresh_placeholder_domains: PASS (placeholderLiveRefreshRows=136)
- queue_false_positive_risk_keeps_placeholder_domains_out_of_ready_scrape: PASS (placeholderReadyRows=0)
- readiness_board_matches_fixture_coverage: PASS (dd_routing:accepted_and_rejected/accepted_and_rejected; education_routing:accepted_and_rejected/accepted_and_rejected; forms_guides:accepted_and_rejected/accepted_and_rejected; knowledge_content:accepted_and_rejected/accepted_and_rejected; medicaid_hhs_offices:accepted_and_rejected/accepted_and_rejected; program_waitlists:accepted_and_rejected/accepted_and_rejected; programs_benefits:accepted_and_rejected/accepted_and_rejected; providers_care:accepted_and_rejected/accepted_and_rejected; waivers:accepted_and_rejected/accepted_and_rejected)
- negative_fixture_packet_matches_plan: PASS (planRows=0; captureRows=0)
- negative_fixture_packet_has_commands: PASS (rowsWithCommands=0)
- negative_fixture_closure_tracks_open_rows: PASS (openCount=0; plannedRows=0)
- lifecycle_contract_has_resume_guarantees: PASS (resumeGuarantees=6)
- staging_support_has_full_launch_family_coverage: PASS (unsupportedFamilyCount=0)
- readiness_board_flags_known_spec_gaps: PASS (no launch family retains the old rejected-fixture or waitlist staging spec gaps)
- gap_registry_row_count_matches_known_gaps: PASS (gapRegistryRows=0)

## Artifact Paths

- launch-scrape-link-inventory: `docs/generated/launch-scrape-link-inventory-2026-06-19.json`
- launch-scraper-contract: `docs/generated/launch-scraper-contract-2026-06-19.json`
- launch-scraper-field-contract: `docs/generated/launch-scraper-field-contract-2026-06-19.json`
- launch-scraper-fixture-matrix: `docs/generated/launch-scraper-fixture-matrix-2026-06-19.json`
- launch-scraper-false-positive-taxonomy: `docs/generated/launch-scraper-false-positive-taxonomy-2026-06-19.json`
- launch-scraper-queue-false-positive-risk: `docs/generated/launch-scraper-queue-false-positive-risk-2026-06-19.json`
- launch-scraper-lifecycle-contract: `docs/generated/launch-scraper-lifecycle-contract-2026-06-19.json`
- launch-scraper-staging-support-matrix: `docs/generated/launch-scraper-staging-support-matrix-2026-06-19.json`
- launch-scraper-readiness-board: `docs/generated/launch-scraper-readiness-board-2026-06-19.json`
- launch-scraper-gap-registry: `docs/generated/launch-scraper-gap-registry-2026-06-19.json`
- launch-scraper-negative-fixture-plan: `docs/generated/launch-scraper-negative-fixture-plan-2026-06-19.json`
- launch-scraper-negative-fixture-capture-packet: `docs/generated/launch-scraper-negative-fixture-capture-packet-2026-06-19.json`
- launch-scraper-negative-fixture-closure-status: `docs/generated/launch-scraper-negative-fixture-closure-status-2026-06-19.json`
- launch-scraper-runbook: `docs/generated/launch-scraper-runbook-2026-06-19.json`
- launch-scraper-artifact-contract: `docs/generated/launch-scraper-artifact-contract-2026-06-19.json`
- launch-scraper-provenance-contract: `docs/generated/launch-scraper-provenance-contract-2026-06-19.json`
- launch-scraper-queue-governance: `docs/generated/launch-scraper-queue-governance-2026-06-19.json`
- launch-scraper-qa-pack: `docs/generated/launch-scraper-qa-pack-2026-06-19.json`
- launch-scraper-fixture-coverage-audit: `docs/generated/launch-scraper-fixture-coverage-audit-2026-06-19.json`

