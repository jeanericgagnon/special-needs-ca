# Launch-Critical Data Acquisition Plan

Generated: 2026-06-20

## Summary

- Artifact target: `docs/generated/launch-critical-data-acquisition-plan-2026-06-20.md`
- Launch rule: Acquire only data that directly improves truthful disability-to-program search results, routing, forms, offices, providers, and next-step guidance.
- Queue baseline: readyRows=20, ready_lightweight=15, ready_js_heavy=3, ready_pdf=0, discovery_only=2, missingSourceFamilyCount=0

## Authoritative Inputs

- completionPlanPath: `docs/generated/source-acquisition-completion-plan-2026-06-20.json`
- fullInformationGapAuditPath: `docs/generated/full-information-gap-audit-2026-06-20.json`
- missingSourceFamiliesPath: `docs/generated/missing-source-families-2026-06-18.json`
- informationInventoryPath: `docs/generated/information-inventory-2026-06-20.json`
- scrapeNowOnlyPath: `docs/generated/scrape-now-only-2026-06-18.json`
- providerSourcePackPath: `docs/generated/provider-source-pack-plan-2026-06-19.json`
- knowledgeStatusQueuePath: `docs/generated/knowledge-content-status-queue-2026-06-19.json`
- formsSourcePackPath: `data/source_packs/forms_source_pack.json`
- officialStateDomainRepairsPath: `data/source_packs/official_state_domain_repairs.json`
- authoredMissingSourceTargetsPath: `docs/generated/authored-missing-source-targets-2026-06-19.json`
- dbPath: `ca_disability_navigator.db`

## Blocker Resolution Registry

- artifactPath: `docs/generated/blocker-resolution-registry-2026-06-20.json`
- totalRows: 89
- byFamily: disability_to_program_matching=1, knowledge_content=2, medicaid_hhs_offices=40, providers_care=46
- byBlockerClass: author_first=46, defer_blocked_source=2, promotion_only=1, repair_first=40

## Canonical Launch Queue Accounting

### forms_guides

- totalStates: 50
- alreadyClearedStates: 7
- readyExactStates: 6
- authorFirstStates: 37
- blockedStates: 0
- fallbackOnlyStates: 37
- stateSpecificFallbackOnlyStates: 34
- federalOnlyFallbackStates: 3
- unaccountedStates: 0
- rawGapAuditBlockedStates: 37
- rawGapAuditTotal: 43
- launchInterpretation: 7 states are already cleared outside the current forms gap audit., 6 states are ready exact., 37 states are author-first fallback states, not true scrape-blocked launch states., 0 states remain unknown in canonical launch accounting.

### program_waitlists

- launchExactReadyRows: 6
- launchExactReadyStates: florida, georgia, ohio, pennsylvania, illinois, texas
- followupReadyRows: 0
- followupReadyStates: 0
- followupReadyClassification: waitlist_like_db_discovered_not_yet_exact_launch_queue
- hiddenUnderGapFamily: general_gap_fill
- firstClassLaunchFamilyRequired: true
- launchInterpretation: Only curated first-party exact waitlist targets count as the initial launch-critical execution lane., DB-discovered waitlist-like rows stay visible as follow-up inventory and must not remain invisible inside general_gap_fill.

## Blocked Work Taxonomy

- author_first: Needs exact source-pack or state-packet authoring before it can enter a bounded scrape lane. | next lanes: author_first, ready_target_scrape
- repair_first: Has a known bad, malformed, or stale target that must be repaired before bounded scraping resumes. | next lanes: repair_first, ready_target_scrape
- fetch_blocked: The exact target is known but repeated access failures mean it should not be retried blindly. | next lanes: defer_blocked_source, repair_first
- promotion_blocked: Data exists but cannot be promoted safely because truth, provenance, or public-safe semantics are incomplete. | next lanes: promotion_only, defer_blocked_source
- coverage_below_threshold: Queue execution is exhausted, but launch state or topic coverage is still below threshold and needs explicit authoring or blocking artifacts. | next lanes: author_first, promotion_only

## Provider Launch Standard

- anchorsRequiredPerState: 3
- mandatorySubtypeBuckets:
- evaluation_diagnostic: developmental_pediatrics, developmental_clinic, diagnostic_center
- therapy_services: therapy_program, therapy_clinic, speech_therapy, occupational_therapy, physical_therapy, aba_therapy
- specialty_entrypoint: autism_center, childrens_hospital, pediatric_specialty_center
- anchorEligibilityRule:
- first-party or official source only
- named clinic/program/service, not org shell
- phone or intake contact required
- physical address required
- source URL required
- next-step URL or next-step phone required
- verification must be verified or official_verified
- no directory-only or inferred local presence
- stateStatusRules:
- launch_ready: all 3 mandatory subtype buckets satisfied and minimum 3 anchors total
- blocked: after authoring, one or more mandatory buckets still lack any exact first-party target; blocker reason saved and provider results stay gated
- not_ready_author_first: exact targets are not yet authored enough to evaluate readiness
- nationalLaunchRule:
- decisionComplete: all 50 states are either launch_ready or blocked
- goodEnoughForLaunch: no state remains unknown
- blockedStatePolicy: blocked states are acceptable only if provider surfaces are gated there
- currentStatus:
- launchReadyStates: 0
- blockedStates: 0
- notReadyAuthorFirstStates: 50
- pullNowPlannedStates: 10
- authoredProviderTargets: 42
- directReadyQueueRows: 0
- discoveryOnlyRows: 1

## Launch-Critical Families

### Programs and benefits `programs_benefits`

Required subtypes
- program definitions
- eligibility rules
- document requirements
- application steps
- appeal information

Required launch fields
- programs: id, name, description, who_it_is_for, who_might_qualify, official_source_url, state_id, source_url, source_type, data_origin, verification_status, confidence_score, program_type
- programEligibilityRules: program_id, min_age_years, max_age_years, required_condition, required_need, insurance_status, school_status, trigger_reason
- programDocumentRequirements: program_id, name, description, is_mandatory
- programApplicationSteps: program_id, step_number, title, action_description, apply_url_or_contact
- programAppealInfo: program_id, deadline_days, appeal_steps, denial_reasons, appeal_form_name, official_appeal_source_url

Launch sufficiency standard
- Every program surfaced in search has name, description, who_it_is_for, who_might_qualify, and official_source_url.
- Each surfaced program has at least one actionable subtype: eligibility rule, document requirement, application step, appeal record, or linked form.
- Generic agency overview pages never promote as stand-alone programs.

- launchExecutionClass: scrape_now
- directAcquisitionRequired: true
- launchThreshold: 29/29 ready rows resolved
- truthThreshold: 0 launch-visible generic agency pages promoted as programs
- blockerCondition: Any ready row remains unresolved or any launch-visible program lacks all actionable subtypes.
- goodEnoughForLaunchRule: Every launch-visible program has core fields plus at least one actionable subtype.
- currentProgressMetric: 0% queue closure
- primaryUnblockClass: promotion_blocked
- nextLane: promotion_only
- resolutionTarget: Convert remaining launch program concerns into explicit promotion-only artifacts or cleared status.
- resolutionCompleteWhen: No generic blocked program concerns remain; remaining concerns are either cleared or promotion_only.
- remainingBlockerCount: 0
- ledgerArtifactPath: `docs/generated/programs-benefits-promotion-resolution-ledger-2026-06-20.json`

Current-state inventory
- Live counts:
- programs: 507
- programEligibilityRules: 303
- programDocumentRequirements: 502
- programApplicationSteps: 992
- programAppealInfo: 451
- Staging counts:
- stagingScrapedPrograms: 8
- Queue counts:
- total: 0
- byStatus: 
- byQueueSource: 
- Trust and composition:
- verificationStatus: verified=489, official_verified=18
- category: state=506, federal=1
- programType: able_program=1, behavioral_health_waiver=1, early_intervention=1, medicaid_hcbs_waiver=6, medicaid_managed_care=1, medicaid_managed_care_hcbs=1, special_education=1, unknown=494, vocational_rehabilitation=1
- Known weak spots:
- Weak action signals on generic agency pages.
- Live program_type classification is still mostly unknown.
- Truth/risk concerns:
- Large row count can overstate real actionable launch depth.
- Program parser can still over-admit agency pages unless deterministic rejects stay suppressed.

Gap analysis
- Missing pieces:
- Burn down the remaining 0 ready rows.
- Keep only program pages that produce truthful action signals.
- Increase typed waiver/program identity where possible.
- Gap types: source=low, queue=medium, scraper=low, parser=low, validator=medium, staging=low, promotion=medium, truthPolicy=high
- Blocked work summary: none

Source acquisition plan
- Exact source families:
- official state Medicaid overview and eligibility pages
- official DD benefit/program pages
- official SSI/SSA benefit pages already in queue
- Existing source-pack status:
- Completion plan currently has 0 ready lightweight rows.
- No source-family authoring blocker remains for this launch family.
- Authoring needed first: no
- Scraper lane: HTTP
- Suggested batch size class: large
- Control-plane rule: Run deterministic reject suppression for missing_action_signal and missing_program_name before each scrape wave.

### Waivers `waivers`

Required subtypes
- waiver program records
- waiver-specific eligibility
- waiver-specific steps
- waiver appeals
- waiver waitlist linkage

Required launch fields
- programs: id, name, description, who_it_is_for, who_might_qualify, official_source_url, state_id, source_url, source_type, data_origin, verification_status, confidence_score, program_type
- linkage: program_waitlists.program_id

Launch sufficiency standard
- Each state has a truthful DD or HCBS waiver entry path if a waiver is shown.
- Waiver rows link to source-backed steps, eligibility, and waitlist or interest-list status when available.
- Waivers without usable action signals remain blocked or hidden.

- launchExecutionClass: author_first
- directAcquisitionRequired: true
- launchThreshold: 50/50 states have at least one explicit waiver path or explicit no-waiver/blocked state artifact
- truthThreshold: Every launch-visible waiver has explicit waiver identity and source-backed action path
- blockerCondition: A state has waiver surfaced without explicit waiver typing or action path.
- goodEnoughForLaunchRule: Waiver search never falls back to generic program pages.
- currentProgressMetric: 16% state coverage / 0% queue closure
- primaryUnblockClass: coverage_below_threshold
- nextLane: author_first
- resolutionTarget: Every state has an explicit waiver resolution status recorded on disk.
- resolutionCompleteWhen: All 50 states are labeled explicit_waiver_path_present or no_waiver_surfaced.
- remainingBlockerCount: 0
- ledgerArtifactPath: `docs/generated/waivers-state-resolution-ledger-2026-06-20.json`

Current-state inventory
- Live counts:
- waiverTypedPrograms: 8
- programWaitlists: 165
- Staging counts:
- stagingScrapedPrograms: 8
- Queue counts:
- total: 0
- byStatus: 
- byQueueSource: 
- Trust and composition:
- typedProgramBreakdown: behavioral_health_waiver=1, medicaid_hcbs_waiver=6, medicaid_managed_care_hcbs=1
- officialRepairRows: 40
- Known weak spots:
- Very sparse typed waiver rows in live programs.
- Waitlist linkage is incomplete.
- Truth/risk concerns:
- Waiver search can over-rely on generic program rows without explicit waiver identity.

Gap analysis
- Missing pieces:
- Process the 0 ready rows.
- Capture blocked remainder explicitly in artifacts.
- Tighten waiver classification on accepted program rows.
- Gap types: source=low, queue=medium, scraper=low, parser=low, validator=medium, staging=low, promotion=medium, truthPolicy=medium
- Blocked work summary: coverage_below_threshold=42

Source acquisition plan
- Exact source families:
- official state HCBS waiver pages
- official DD waiver pages
- official Medicaid waiver eligibility pages
- Existing source-pack status:
- Completion plan currently has 0 ready lightweight waiver rows.
- Official repair pack includes 40 waiver_program repair rows for later followup.
- Authoring needed first: no
- Scraper lane: HTTP first, PDF if new repaired rows surface
- Suggested batch size class: large HTTP, medium PDF
- Control-plane rule: Do not treat generic policy pages as waivers unless program identity and action path are explicit.

### Forms and guides `forms_guides`

Required subtypes
- exact official forms
- official form-library roots
- official application guides
- official appeal forms

Required launch fields
- formsAndGuides: state_id, program_id, title, slug, category, form_type, agency, source_url, pdf_url, who_uses_it, who_signs_it, where_to_send_it, deadline, evidence_level, data_origin, verification_status, confidence_score, last_checked_at

Launch sufficiency standard
- Every state has either an exact official forms source or an explicit official fallback class.
- Publicly shown forms remain official or official-library-root backed.
- Fake placeholder domains are completely excluded.

- launchExecutionClass: author_first
- directAcquisitionRequired: true
- launchThreshold: 50/50 states classified into cleared exact, ready exact, or approved fallback class
- truthThreshold: 0 fake/placeholder domains; 0 unofficial public launch forms
- blockerCondition: Any state remains unaccounted or any placeholder domain remains in the launch path.
- goodEnoughForLaunchRule: A state may launch on an approved fallback class even without exact library extraction.
- currentProgressMetric: 14% cleared / 100% accounted
- primaryUnblockClass: author_first
- nextLane: author_first
- resolutionTarget: Every state is assigned one canonical forms launch class with no placeholder ambiguity.
- resolutionCompleteWhen: All 50 states are classified into exact_official_forms_library, approved_state_specific_fallback_root, approved_federal_only_fallback, or explicitly_blocked_no_candidate.
- remainingBlockerCount: 0
- ledgerArtifactPath: `docs/generated/forms-blocker-resolution-ledger-2026-06-20.json`

Current-state inventory
- Live counts:
- formsAndGuides: 1070
- Staging counts:
- stagingScrapedForms: 186
- Queue counts:
- total: 0
- fromGapAudit: total=43, ready=6, blocked=37
- Trust and composition:
- verificationStatus: source_listed=45, verified=1025
- evidenceLevel: manual_review_required=41, official_form_guide_extract=1025, state_upgrade_staging_form=4
- sourcePackRows: 37
- sourcePackReplacementClasses: federal_only_form_fallback=3, state_specific_form_fallback_only=34
- officialRepairRows: 37
- Known weak spots:
- Exact library coverage is still weak for fallback-only states.
- Current ready queue is effectively exhausted until authoring resolves fallback states.
- Truth/risk concerns:
- Fake dhhs.<state>.gov style placeholders must never re-enter launch sources.
- Canonical launch queue accounting:
- totalStates: 50
- alreadyClearedStates: 7
- readyExactStates: 6
- authorFirstStates: 37
- blockedStates: 0
- fallbackOnlyStates: 37
- stateSpecificFallbackOnlyStates: 34
- federalOnlyFallbackStates: 3
- unaccountedStates: 0
- rawGapAuditBlockedStates: 37
- rawGapAuditTotal: 43
- launchInterpretation: 7 states are already cleared outside the current forms gap audit., 6 states are ready exact., 37 states are author-first fallback states, not true scrape-blocked launch states., 0 states remain unknown in canonical launch accounting.

Gap analysis
- Missing pieces:
- Convert fallback-only states into exact official library roots or final explicit fallback classes.
- Rebuild a ready queue only from official targets.
- Gap types: source=high, queue=high, scraper=low, parser=medium, validator=medium, staging=low, promotion=low, truthPolicy=high
- Blocked work summary: author_first=37, ready_target_scrape=6

Source acquisition plan
- Exact source families:
- official state Medicaid form libraries
- official state education or special-ed form libraries
- official appeal and request forms
- Existing source-pack status:
- 37 source-pack rows exist.
- 34 states are still state_specific_form_fallback_only.
- 3 states are federal_only_form_fallback.
- Authoring needed first: yes
- Scraper lane: HTTP primarily, PDF where exact form downloads are the only stable source
- Suggested batch size class: large HTTP, medium PDF
- Control-plane rule: Do not requeue fallback-only states as ready until each state has a final official source class.

### Program waitlists `program_waitlists`

Required subtypes
- waitlist records
- interest-list records
- reserve-capacity notices
- legal deadline notices

Required launch fields
- programWaitlists: program_id, name, duration_label, duration_months, status, description, reserve_capacity_notice, legal_deadline, estimate_source_url, estimate_source_type, last_checked_at

Launch sufficiency standard
- Major waiver and program surfaces have either a current waitlist row or an explicit blocked or missing status in artifact space.
- Waitlists are never inferred from unrelated program text.

- launchExecutionClass: author_first
- directAcquisitionRequired: true
- launchThreshold: 6/6 curated exact waitlist targets classified as first-class launch rows
- truthThreshold: Every launch-visible waitlist row has explicit source linkage and is never inferred from general program text
- blockerCondition: Waitlist rows remain only under general_gap_fill or launch-visible rows lack source type.
- goodEnoughForLaunchRule: Waitlists can be present, blocked, or not available, but never implicit.
- currentProgressMetric: 100% identified / 0% first-class closed
- primaryUnblockClass: author_first
- nextLane: author_first
- resolutionTarget: Every state has a visible first-class waitlist status in a dedicated ledger.
- resolutionCompleteWhen: All 50 states are labeled present or not_available, and the curated exact lane remains visible.
- remainingBlockerCount: 0
- ledgerArtifactPath: `docs/generated/program-waitlists-resolution-ledger-2026-06-20.json`

Current-state inventory
- Live counts:
- programWaitlists: 165
- Staging counts:
- stagingScrapedWaitlists: 7
- Queue counts:
- directScrapeNowRows: 6
- directScrapeNowStates: florida, georgia, ohio, pennsylvania, illinois, texas
- followupReadyRows: 0
- followupReadyStates: 0
- Trust and composition:
- statusDistribution: active=1, Active Waiting List=48, Active Waitlist / Gated=5, critical=1, moderate=49, not_published=2, priority=4, standard=55
- estimateSourceType: null=52, official_program_page=104, official_report=1, official_state=6, program_source_fallback=2
- Known weak spots:
- Waitlist work is partially hidden under general_gap_fill instead of a dedicated family.
- 52 live waitlist rows still have null estimate_source_type.
- Truth/risk concerns:
- Freshness is uneven and source linkage is missing on part of the live set.
- Canonical launch queue accounting:
- launchExactReadyRows: 6
- launchExactReadyStates: florida, georgia, ohio, pennsylvania, illinois, texas
- followupReadyRows: 0
- followupReadyStates: 0
- followupReadyClassification: waitlist_like_db_discovered_not_yet_exact_launch_queue
- hiddenUnderGapFamily: general_gap_fill
- firstClassLaunchFamilyRequired: true
- launchInterpretation: Only curated first-party exact waitlist targets count as the initial launch-critical execution lane., DB-discovered waitlist-like rows stay visible as follow-up inventory and must not remain invisible inside general_gap_fill.

Gap analysis
- Missing pieces:
- Promote waitlists into a first-class launch family in queue reporting.
- Add exact state waitlist sources for remaining major waiver and program surfaces.
- Gap types: source=medium, queue=high, scraper=low, parser=medium, validator=medium, staging=low, promotion=medium, truthPolicy=medium
- Blocked work summary: ready_target_scrape=6

Source acquisition plan
- Exact source families:
- official waitlist pages
- official interest-list pages
- official enrollment queue pages
- Existing source-pack status:
- 6 direct scrape-now waitlist rows exist today.
- Current queue taxonomy still hides them under general_gap_fill.
- Authoring needed first: yes
- Scraper lane: HTTP
- Suggested batch size class: large
- Control-plane rule: Surface program_waitlists as a first-class launch family before bulk execution so closure can be measured directly.

### County offices and Medicaid/HHS offices `medicaid_hhs_offices`

Required subtypes
- county Medicaid/HHS offices
- IHSS county offices
- CCS or analogous county child-health offices

Required launch fields
- countyOffices: county_id, program_id, office_name, address, phone, email, website, source_url, source_type, data_origin, verification_status, last_verified_date, last_scraped_at, confidence_score, evidence_level

Launch sufficiency standard
- County-facing office lookup is source-backed where shown.
- Shown office records have address and phone at minimum.
- Counties without trustworthy office coverage remain gated instead of padded.

- launchExecutionClass: author_first
- directAcquisitionRequired: true
- launchThreshold: 50/50 states retain at least one truthful office path and 116/116 remaining queue rows are reclassified as ready or repair-first
- truthThreshold: 0 malformed county-domain rows in scrape-now
- blockerCondition: Any malformed county-domain target remains in scrape-now.
- goodEnoughForLaunchRule: Counties without trustworthy coverage stay gated.
- currentProgressMetric: 100% state coverage / 0% repair closure
- primaryUnblockClass: repair_first
- nextLane: repair_first
- resolutionTarget: Every unresolved office blocker is moved into repair_first or cleared state-specific status.
- resolutionCompleteWhen: No medicaid office blocker remains generic; every state is resolved or repair_first.
- remainingBlockerCount: 40
- ledgerArtifactPath: `docs/generated/medicaid-hhs-offices-resolution-ledger-2026-06-20.json`

Current-state inventory
- Live counts:
- countyOffices: 3678
- Staging counts:
- stagingScrapedCountyOffices: 3050
- Queue counts:
- total: 0
- byStatus: 
- byQueueSource: 
- Trust and composition:
- verificationStatus: official_verified=12, verified=3666
- officialRepairRows: 40
- Known weak spots:
- Current remaining queue includes malformed county-domain targets.
- Challenge-blocked counties are mixed into the same remaining lane.
- Truth/risk concerns:
- High live count can hide poor target quality in the unresolved queue.

Gap analysis
- Missing pieces:
- Repair malformed county-domain targets before bulk fetching again.
- Re-run only trustworthy county-office targets after repairs are applied.
- Gap types: source=high, queue=high, scraper=low, parser=medium, validator=medium, staging=low, promotion=low, truthPolicy=medium
- Blocked work summary: repair_first=40

Source acquisition plan
- Exact source families:
- official county IHSS office pages
- official county CCS or Medicaid/HHS office pages
- Existing source-pack status:
- 40 official repair rows exist for medicaid_county_directory.
- 0 queue rows remain, with most still tied to malformed or challenge-blocked targets.
- Authoring needed first: yes
- Scraper lane: HTTP after repair, JS or PDF only for residual exceptions
- Suggested batch size class: large after repair, medium or small for residual JS/PDF
- Control-plane rule: Do not rerun county-office bulk scraping until repair-pack replacements resolve malformed county-domain families.

### DD routing `dd_routing`

Required subtypes
- state DD or IDD intake agencies
- developmental-services routing agencies
- statewide catchment and eligibility routing

Required launch fields
- stateResourceAgencies: state_id, agency_type, name, counties_served, catchment_boundaries, website, intake_phone, agency_intake_contact, eligibility_info_page, services_page, appeals_info, source_url, source_type, data_origin, verification_status, confidence_score, evidence_level

Launch sufficiency standard
- Every state has at least one truthful DD routing path.
- Every shown routing row includes a usable intake contact or routing path plus a services or eligibility page.
- Trust metadata is complete on public rows.

- launchExecutionClass: scrape_now
- directAcquisitionRequired: true
- launchThreshold: 50/50 states with at least one launch-safe DD routing path and 74/74 queue rows resolved or blocked
- truthThreshold: Complete trust metadata on all launch-visible routing rows
- blockerCondition: Any state lacks a truthful routing path or any queue row remains unknown.
- goodEnoughForLaunchRule: One truthful statewide path is enough; deeper routing is additive.
- currentProgressMetric: 100% state coverage / 0% queue closure
- primaryUnblockClass: coverage_below_threshold
- nextLane: promotion_only
- resolutionTarget: Every state has a DD routing resolution row on disk.
- resolutionCompleteWhen: All 50 states are resolved or explicitly blocked with state-level evidence.
- remainingBlockerCount: 0
- ledgerArtifactPath: `docs/generated/dd-routing-state-resolution-ledger-2026-06-20.json`

Current-state inventory
- Live counts:
- stateResourceAgencies: 636
- Staging counts:
- stagingScrapedStateResourceAgencies: 462
- Queue counts:
- total: 0
- byStatus: 
- byQueueSource: 
- Trust and composition:
- verificationStatus: official_verified=21, verified=615
- officialRepairRows: 40
- Known weak spots:
- This remains the largest launch-critical routing backlog.
- The queue splits across lightweight and JS-heavy targets, so one pass is not enough.
- Truth/risk concerns:
- Incomplete DD routing directly weakens disability-to-program search usefulness at launch.

Gap analysis
- Missing pieces:
- Process the remaining 74 queue rows.
- Treat lightweight and JS-heavy sublanes as one launch workstream with shared closure rules.
- Gap types: source=low, queue=high, scraper=medium, parser=medium, validator=medium, staging=low, promotion=medium, truthPolicy=high
- Blocked work summary: none

Source acquisition plan
- Exact source families:
- official state DD or IDD agencies
- official developmental-services routing pages
- official catchment and intake pages
- Existing source-pack status:
- 0 queue rows remain.
- 40 dd_state_directory repair rows exist for later repair-driven followup.
- Authoring needed first: no
- Scraper lane: HTTP for lightweight rows, Playwright for JS-heavy rows
- Suggested batch size class: large HTTP, small JS-heavy
- Control-plane rule: Closure requires both sublanes to complete or block explicitly; do not report DD routing done after HTTP only.

### Education routing `education_routing`

Required subtypes
- state or regional special-education routing
- district special-ed contacts
- district fallback when regional coverage is thin

Required launch fields
- regionalEducationAgencies: state_id, agency_type, name, counties_served, website, source_url, source_type, data_origin, verification_status, confidence_score, evidence_level
- schoolDistricts: county_id, name, spec_ed_contact_phone, spec_ed_contact_email, website, source_url, source_type, data_origin, verification_status, confidence_score, evidence_level

Launch sufficiency standard
- Every state has at least one truthful education-routing layer.
- District depth is additive rather than blocking when regional routing is usable.
- No district row is shown without a real phone or credible district site.

- launchExecutionClass: author_first
- directAcquisitionRequired: true
- launchThreshold: 50/50 states with at least one regional or district fallback routing path and 11/11 queue rows resolved or blocked
- truthThreshold: No district row shown without real phone or credible district site
- blockerCondition: Regional gap is unresolved in the remaining 3 states without explicit fallback/block status.
- goodEnoughForLaunchRule: Regional routing is sufficient; district depth is additive.
- currentProgressMetric: 94% coverage / 0% queue closure
- primaryUnblockClass: coverage_below_threshold
- nextLane: author_first
- resolutionTarget: Every state has regional_path_present or explicitly_blocked status recorded on disk.
- resolutionCompleteWhen: The remaining 3-state education gap is explicit and no longer generic.
- remainingBlockerCount: 0
- ledgerArtifactPath: `docs/generated/education-routing-state-resolution-ledger-2026-06-20.json`

Current-state inventory
- Live counts:
- regionalEducationAgencies: 313
- schoolDistricts: 3117
- Staging counts:
- stagingScrapedRegionalEducationAgencies: 162
- stagingScrapedSchoolDistricts: 2875
- Queue counts:
- total: 0
- byStatus: 
- byQueueSource: 
- Trust and composition:
- regionalVerificationStatus: official_verified=2, verified=311
- schoolDistrictVerificationStatus: official_verified=200, verified=2917
- regionalCoverageStates: 47/50 states from full gap audit
- officialRepairRows: education_routing=35, special_education=35
- Known weak spots:
- The remaining queue is small but mostly JS-heavy.
- Regional education coverage is still missing in 3 states.
- Truth/risk concerns:
- Launch can tolerate uneven district depth, but not an unknown regional-routing gap.

Gap analysis
- Missing pieces:
- Process the remaining 0 queue rows.
- Close or explicitly block the remaining 3-state regional routing gap.
- Gap types: source=low, queue=medium, scraper=medium, parser=low, validator=medium, staging=low, promotion=medium, truthPolicy=medium
- Blocked work summary: coverage_below_threshold=3

Source acquisition plan
- Exact source families:
- official state special-ed offices
- official regional education agencies
- official district directories for special-ed contacts
- Existing source-pack status:
- 0 queue rows remain.
- 35 education_routing repair rows and 35 special_education repair rows exist.
- Authoring needed first: no
- Scraper lane: HTTP for lightweight rows, Playwright for JS-heavy rows
- Suggested batch size class: large HTTP, small JS-heavy
- Control-plane rule: Regional routing coverage should close first; district-only fallback is additive, not a substitute for missing state/regional routing.

### Providers and care `providers_care`

Required subtypes
- children’s hospitals
- developmental pediatrics
- autism centers
- therapy programs
- diagnostic clinics

Required launch fields
- resourceProviders: name, categories, county_id, phone, email, address, source_url, source_type, data_origin, verification_status, confidence_score, evidence_level, service_tags, availability_status, next_step_type, next_step_label, next_step_url, requirements, application_url, languages

Launch sufficiency standard
- Each state has a small truthful anchor set of provider entry points.
- Every shown provider has a named clinic or program identity plus contact and location evidence.
- Generic directories never imply local in-person care unless explicitly evidenced.

- launchExecutionClass: author_first
- directAcquisitionRequired: true
- launchThreshold: 50/50 states decision-complete under the provider launch standard
- truthThreshold: Every launch-visible anchor satisfies all anchor eligibility rules
- blockerCondition: A state is missing any mandatory subtype bucket or only weak directory evidence exists.
- goodEnoughForLaunchRule: A state is either launch-ready with 3 anchors or explicitly blocked and gated.
- currentProgressMetric: 0% launch-ready / 20% author-planned
- primaryUnblockClass: author_first
- nextLane: author_first
- resolutionTarget: All 50 states are explicitly classed as launch_ready, author_first_with_packet, or explicitly_blocked.
- resolutionCompleteWhen: No provider state is unknown or falsely idle in the packet system.
- remainingBlockerCount: 46
- ledgerArtifactPath: `docs/generated/provider-blocker-resolution-ledger-2026-06-20.json`

Current-state inventory
- Live counts:
- resourceProviders: 96
- Staging counts:
- stagingScrapedResourceProviders: 125
- Queue counts:
- total: 1
- byStatus: discovery_only=1
- byQueueSource: authored_missing_family=1
- Trust and composition:
- verificationStatus: official_verified=6, source_listed=90
- claimStatus: null=13, unclaimed=83
- providerSourcePackSummary: statesIncluded=10, pullNowStates=10, limitedPullNowStates=0, replacePlaceholdersFirstStates=0, authorTargetsFirstStates=0, statesWithSecondaryDiscoveryTargets=0, secondaryDiscoveryTargetCount=0
- authoredTargetsForFamily: 42
- Known weak spots:
- This is the thinnest launch-critical public family.
- Current completion-plan queue is effectively empty because authoring has not produced enough exact targets.
- Truth/risk concerns:
- Launch cannot compensate with generic directories or weak locality inference.
- Launch provider standard:
- anchorsRequiredPerState: 3
- currentStatus: launchReadyStates=0, blockedStates=0, notReadyAuthorFirstStates=50, pullNowPlannedStates=10, authoredProviderTargets=42, directReadyQueueRows=0, discoveryOnlyRows=1

Gap analysis
- Missing pieces:
- Author state anchor-provider packs before new scrape waves.
- Create a real actionable queue from pull-now states.
- Promote only providers with first-party contact and location evidence.
- Gap types: source=critical, queue=critical, scraper=medium, parser=low, validator=medium, staging=low, promotion=medium, truthPolicy=high
- Blocked work summary: author_first=50, ready_target_scrape=1

Source acquisition plan
- Exact source families:
- first-party children’s hospitals
- first-party developmental pediatrics
- first-party autism centers
- first-party therapy systems
- first-party diagnostic clinics
- Existing source-pack status:
- Provider source-pack plan includes 10 states and 10 pull-now states.
- Authored targets for providers_care remain only 42.
- Authoring needed first: yes
- Scraper lane: HTTP where static; Playwright for JS-heavy clinic systems
- Suggested batch size class: small
- Control-plane rule: Do not run more provider waves until state anchor packs convert pull-now states into exact ready targets.

### Knowledge content `knowledge_content`

Required subtypes
- diagnosis overviews
- waiver explainers
- school-rights explainers
- appeal and dispute guidance
- respite guidance
- transition guidance

Required launch fields
- knowledgeArticles: category, title, subtitle, title_es, subtitle_es, read_time, read_time_es, difficulty, color, steps_json, steps_json_es
- provenanceNeededAtLaunch: source_url, source_type, data_origin, verification_status, evidence_level

Launch sufficiency standard
- Core journey topics exist as high-trust next-step guidance.
- Every public article retains source-backed provenance somewhere in the serving path.
- If provenance cannot survive promotion into live knowledge_articles, launch use stays limited until the serving contract preserves it.

- launchExecutionClass: author_first
- directAcquisitionRequired: true
- launchThreshold: 6/6 launch topic buckets covered
- truthThreshold: Provenance-safe serving path for every launch-visible article
- blockerCondition: A topic exists only in live content without preserved provenance.
- goodEnoughForLaunchRule: One strong source-backed article per topic bucket is enough.
- currentProgressMetric: 0% launch-safe topic closure
- primaryUnblockClass: fetch_blocked
- nextLane: defer_blocked_source
- resolutionTarget: Each launch topic bucket is classified as covered, replacement_authored, or blocked_with_evidence.
- resolutionCompleteWhen: No launch topic bucket remains generically blocked or unresolved.
- remainingBlockerCount: 0
- ledgerArtifactPath: `docs/generated/knowledge-topic-blocker-ledger-2026-06-20.json`

Current-state inventory
- Live counts:
- knowledgeArticles: 23
- Staging counts:
- stagingScrapedKnowledgeContent: 8
- Queue counts:
- trackedTargets: 65
- finalStatus: deferred_blocked_source=54, deferred_unresolved=3, duplicate_of_existing_live_article=6, promoted_live=2
- Trust and composition:
- authoredTargetsForFamily: 65
- liveSchemaConstraint: knowledge_articles lacks first-class provenance fields in the live serving target
- Known weak spots:
- Most current targets are blocked, not scrapeable.
- Live article schema does not visibly carry provenance fields needed for source-backed launch guidance.
- Truth/risk concerns:
- Guidance cannot launch broadly if the serving path loses source provenance.

Gap analysis
- Missing pieces:
- Replace blocked or dead exact targets with fetchable official or high-trust replacements.
- Define a provenance-safe promotion or serving path before expanding launch usage.
- Gap types: source=critical, queue=critical, scraper=medium, parser=low, validator=medium, staging=low, promotion=high, truthPolicy=critical
- Blocked work summary: author_first=3, defer_blocked_source=54, promotion_only=1

Source acquisition plan
- Exact source families:
- official diagnosis explainers
- official waiver explainers
- official school-rights or procedural-safeguards pages
- official appeals, respite, and transition guidance
- Existing source-pack status:
- 65 authored knowledge-content targets exist.
- 2 are promoted live, 54 are blocked, and 3 remain unresolved.
- Authoring needed first: yes
- Scraper lane: HTTP first, JS only for reviewed replacements that truly require it
- Suggested batch size class: small
- Control-plane rule: Replace blocked targets before any new fetch wave and keep knowledge rows out of local directory targets.

### Disability-to-program matching support `disability_to_program_matching`

Required subtypes
- conditions
- functional_needs
- program_eligibility_rules

Required launch fields
- conditions: id, name
- functionalNeeds: id, name
- programEligibilityRules: required_condition, required_need, min_age_years, max_age_years, insurance_status, school_status

Launch sufficiency standard
- A disability or need query maps to at least one truthful program or routing path.
- Matching stays rule-backed rather than inferred from broad page text.

- launchExecutionClass: dependency_verification_only
- directAcquisitionRequired: false
- launchThreshold: 0 direct acquisition work, plus verification pass after linked-family closure
- truthThreshold: Matching remains rule-backed only
- blockerCondition: The launch artifact still treats this family as scrapeable.
- goodEnoughForLaunchRule: Reference tables are present and linked-family verification passes.
- currentProgressMetric: 100% direct data present / 0% dependency verification complete
- primaryUnblockClass: coverage_below_threshold
- nextLane: promotion_only
- resolutionTarget: Keep matching as dependency-verification-only with a dedicated verification ledger.
- resolutionCompleteWhen: The family is no longer treated as scrapeable anywhere in the launch control plane.
- remainingBlockerCount: 1
- ledgerArtifactPath: `docs/generated/disability-to-program-matching-verification-ledger-2026-06-20.json`

Current-state inventory
- Live counts:
- conditions: 78
- functionalNeeds: 18
- programEligibilityRules: 303
- Queue counts:
- total: 0
- Trust and composition:
- dependency: This layer depends on launch completion of programs, waivers, DD routing, and education routing.
- Known weak spots:
- Reference tables exist; launch quality is constrained by linked family coverage rather than missing taxonomy.
- Truth/risk concerns:
- Matching is only as truthful as the linked program and routing families.

Gap analysis
- Missing pieces:
- No direct acquisition gap; launch risk is downstream linked-family coverage.
- Gap types: source=none, queue=none, scraper=none, parser=none, validator=low, staging=none, promotion=none, truthPolicy=low
- Blocked work summary: coverage_below_threshold=1

Source acquisition plan
- Exact source families:
- none new for launch; this family rides on programs, waivers, and routing completion
- Existing source-pack status:
- No dedicated acquisition family or source pack is needed.
- Authoring needed first: no
- Scraper lane: none direct
- Suggested batch size class: none
- Control-plane rule: Verify matching behavior only after launch program and routing families are refreshed.

## Execution Order

### Scrape now


### Author first

- waivers: queue=0; lane=HTTP first, PDF if new repaired rows surface; batch=large HTTP, medium PDF; class=coverage_below_threshold; next=Do not treat generic policy pages as waivers unless program identity and action path are explicit.
- forms_guides: queue=0; lane=HTTP primarily, PDF where exact form downloads are the only stable source; batch=large HTTP, medium PDF; class=author_first; next=Do not requeue fallback-only states as ready until each state has a final official source class.
- program_waitlists: queue=6; lane=HTTP; batch=large; class=author_first; next=Surface program_waitlists as a first-class launch family before bulk execution so closure can be measured directly.
- medicaid_hhs_offices: queue=0; lane=HTTP after repair, JS or PDF only for residual exceptions; batch=large after repair, medium or small for residual JS/PDF; class=repair_first; next=Do not rerun county-office bulk scraping until repair-pack replacements resolve malformed county-domain families.
- education_routing: queue=0; lane=HTTP for lightweight rows, Playwright for JS-heavy rows; batch=large HTTP, small JS-heavy; class=coverage_below_threshold; next=Regional routing coverage should close first; district-only fallback is additive, not a substitute for missing state/regional routing.
- providers_care: queue=1; lane=HTTP where static; Playwright for JS-heavy clinic systems; batch=small; class=author_first; next=Do not run more provider waves until state anchor packs convert pull-now states into exact ready targets.
- knowledge_content: queue=0; lane=HTTP first, JS only for reviewed replacements that truly require it; batch=small; class=fetch_blocked; next=Replace blocked targets before any new fetch wave and keep knowledge rows out of local directory targets.

### Dependency / verification only

- disability_to_program_matching: queue=0; lane=none direct; batch=none; next=Verify matching behavior only after launch program and routing families are refreshed.

### Blocked / later

- advocates_legal
- broad nonprofit_support
- runtime / feedback tables
- deep normalization beyond launch-safe search display
- broad knowledge expansion beyond the launch core set
- provider long-tail depth after anchor coverage

### Deprioritized but allowed if they unblock launch

- source_registry only when it directly repairs a launch family
- general_gap_fill only when the row is actually a waitlist, waiver, or program launch surface
- transition_programs or early_intervention_programs only when they are required to make a common disability journey truthful in a state

## Exit Criteria

- programs_benefits: 29/29 ready rows resolved; 0 launch-visible generic agency pages promoted as programs; blocker=Any ready row remains unresolved or any launch-visible program lacks all actionable subtypes.; good_enough=Every launch-visible program has core fields plus at least one actionable subtype.
- waivers: 50/50 states have at least one explicit waiver path or explicit no-waiver/blocked state artifact; Every launch-visible waiver has explicit waiver identity and source-backed action path; blocker=A state has waiver surfaced without explicit waiver typing or action path.; good_enough=Waiver search never falls back to generic program pages.
- forms_guides: 50/50 states classified into cleared exact, ready exact, or approved fallback class; 0 fake/placeholder domains; 0 unofficial public launch forms; blocker=Any state remains unaccounted or any placeholder domain remains in the launch path.; good_enough=A state may launch on an approved fallback class even without exact library extraction.
- program_waitlists: 6/6 curated exact waitlist targets classified as first-class launch rows; Every launch-visible waitlist row has explicit source linkage and is never inferred from general program text; blocker=Waitlist rows remain only under general_gap_fill or launch-visible rows lack source type.; good_enough=Waitlists can be present, blocked, or not available, but never implicit.
- medicaid_hhs_offices: 50/50 states retain at least one truthful office path and 116/116 remaining queue rows are reclassified as ready or repair-first; 0 malformed county-domain rows in scrape-now; blocker=Any malformed county-domain target remains in scrape-now.; good_enough=Counties without trustworthy coverage stay gated.
- dd_routing: 50/50 states with at least one launch-safe DD routing path and 74/74 queue rows resolved or blocked; Complete trust metadata on all launch-visible routing rows; blocker=Any state lacks a truthful routing path or any queue row remains unknown.; good_enough=One truthful statewide path is enough; deeper routing is additive.
- education_routing: 50/50 states with at least one regional or district fallback routing path and 11/11 queue rows resolved or blocked; No district row shown without real phone or credible district site; blocker=Regional gap is unresolved in the remaining 3 states without explicit fallback/block status.; good_enough=Regional routing is sufficient; district depth is additive.
- providers_care: 50/50 states decision-complete under the provider launch standard; Every launch-visible anchor satisfies all anchor eligibility rules; blocker=A state is missing any mandatory subtype bucket or only weak directory evidence exists.; good_enough=A state is either launch-ready with 3 anchors or explicitly blocked and gated.
- knowledge_content: 6/6 launch topic buckets covered; Provenance-safe serving path for every launch-visible article; blocker=A topic exists only in live content without preserved provenance.; good_enough=One strong source-backed article per topic bucket is enough.
- disability_to_program_matching: 0 direct acquisition work, plus verification pass after linked-family closure; Matching remains rule-backed only; blocker=The launch artifact still treats this family as scrapeable.; good_enough=Reference tables are present and linked-family verification passes.

## Launch Closure Table

| family | current count/status | launch threshold | current % to threshold | blocking gap type | actionable unblock class | next control-plane artifact | next command |
|---|---|---|---|---|---|---|---|
| programs_benefits | 0 ready rows unresolved; 507 live programs | 29/29 ready rows resolved | 100% queue closure | validator/truth-policy | promotion_blocked | source-acquisition-completion-plan | npm run audit:source-acquisition-completion-plan |
| waivers | 0 ready rows unresolved; 8 typed live waiver rows | 50/50 states have at least one explicit waiver path or explicit no-waiver/blocked state artifact | 16% state coverage / 100% queue closure | queue/promotion | coverage_below_threshold | source-acquisition-completion-plan | npm run audit:source-acquisition-completion-plan |
| forms_guides | 7 cleared states; 6 ready exact; 37 author-first fallback | 50/50 states classified and placeholder-free | 14% cleared / 100% accounted | source/authoring | author_first | forms_source_pack | npm run audit:forms-source-pack |
| program_waitlists | 6 exact curated launch rows; 0 followup ready rows visible in live queue | 6/6 curated exact waitlist targets classified as first-class launch rows | 100% identified / 100% followup queue closure | queue/accounting | author_first | launch-critical-data-plan | npm run audit:launch-critical-data-plan |
| medicaid_hhs_offices | 50/50 state coverage live; 0 ready rows remain; 40 repair rows remain | 50/50 states truthful + 116/116 rows reclassified | 100% state coverage / 100% repair closure | source/queue | repair_first | official_state_domain_repairs | npm run audit:source-acquisition-completion-plan |
| dd_routing | 50/50 state coverage live; 0 ready rows unresolved | 50/50 states truthful + 74/74 rows resolved or blocked | 100% state coverage / 100% queue closure | queue/scraper | coverage_below_threshold | source-acquisition-completion-plan | npm run audit:source-acquisition-completion-plan |
| education_routing | 47/50 regional state coverage; 0 ready rows unresolved | 50/50 states with regional or district fallback path | 94% coverage / 100% queue closure | queue/source | coverage_below_threshold | source-acquisition-completion-plan | npm run audit:source-acquisition-completion-plan |
| providers_care | 0 launch-ready states; 10 pull-now planned; 42 authored targets; 1 discovery-only row | 50/50 states decision-complete under the provider launch standard | 0% launch-ready / 20% author-planned | source/queue | author_first | provider-source-pack-plan | npm run audit:provider-source-pack |
| knowledge_content | 2 promoted live; 54 blocked; 3 unresolved; provenance not yet launch-safe | 6/6 topic buckets with provenance-safe serving path | 0% launch-safe topic closure | promotion/truth-policy | fetch_blocked | knowledge-content-status-queue | npm run audit:knowledge-content-status-queue |
| disability_to_program_matching | reference tables present; no direct queue | dependency verification only after linked-family closure | 100% direct data present / 0% dependency verification complete | dependency/verification | coverage_below_threshold | launch-critical-data-plan | npm run audit:launch-critical-data-plan |

## Important Interface / Artifact Changes

- Keep this launch artifact as docs/generated/launch-critical-data-acquisition-plan-<date>.json|md.
- Use source-acquisition-completion-plan as the authoritative execution queue.
- Use scrape-now-only to expose direct scrapeable waitlist and launch rows.
- Use forms_source_pack, official_state_domain_repairs, knowledge-content-status-queue, and provider-source-pack-plan as author-first control planes.
- Promote program_waitlists into a visible launch family in queue reporting rather than leaving it under general_gap_fill only.
- Split blocked launch work into author_first, repair_first, fetch_blocked, promotion_blocked, and coverage_below_threshold so only runnable exact-target lanes reach the scraper.

## Test Plan

- Artifact generation: launch artifact regenerates from current repo state and includes all launch families with counts and status.
- Queue correctness: program deterministic rejects stay suppressed; fake forms domains do not re-enter; malformed county-office rows remain author-first rather than scrape-now.
- Blocked taxonomy: below-threshold launch families resolve to a primary unblock class and next lane instead of remaining generically blocked.
- Launch sufficiency: sampled launch program results retain source-backed fields plus an actionable subtype; DD and education routing stay truthful; provider rows do not imply local care without contact/location evidence; knowledge serving path preserves provenance.
- Truth policy: blocked rows remain explicit and resumable from disk.

## Assumptions

- Exhaustive local provider depth is not required for launch; truthful anchor coverage is.
- Regional or state education routing is sufficient for launch if district depth is uneven.
- Waitlists can launch as present, missing, or blocked rather than perfect nationwide freshness.
- Knowledge content can launch with a small high-trust core set rather than a large article library.
- The completion-plan artifact remains execution truth unless a newer regenerated artifact supersedes it.
