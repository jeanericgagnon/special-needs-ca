# Launch Scraper Queue Governance

Generated: 2026-06-19T23:21:10.985Z

Governance contract for launch scraper queue classes, lane transitions, and terminal queue states.

## Queue Class Counts

- author_first: 198
- defer_blocked_source: 54
- discovery_only: 1
- do_not_scrape_quarantined: 339
- live_refresh_candidate: 2248
- manual_review: 119
- ready_target_scrape: 551
- repair_first: 237

## Launch Need Class Rules

## ready_target_scrape

- meaning: Exact runnable target already present in control-plane artifacts and allowed to consume scrape volume now.
- classificationTriggers: ledgerStatus is one of ready_lightweight, ready_js_heavy, or ready_pdf; family is launch-critical; row is not quarantined
- allowedNextLanes: ready_target_scrape, defer_blocked_source, repair_first, manual_review, promotion_only
- terminalWhen: family lane is exhausted and downstream decision is captured elsewhere

## author_first

- meaning: Candidate exists but needs source-pack authoring or packet completion before scraping.
- classificationTriggers: ledgerStatus is author_first_candidate; or family plan marks the blocker as author_first
- allowedNextLanes: author_first, ready_target_scrape, manual_review
- terminalWhen: authoring is complete and row becomes ready_target_scrape, or family is explicitly blocked

## repair_first

- meaning: Known broken, malformed, stale, or fake source must be repaired before more scraping.
- classificationTriggers: ledgerStatus is repair_first; or official-domain/followup repair pack provides reviewed replacements
- allowedNextLanes: repair_first, ready_target_scrape, do_not_scrape_quarantined
- terminalWhen: replacement is accepted into ready_target_scrape or source is permanently quarantined

## defer_blocked_source

- meaning: Known blocked or dead source that should not be retried until replaced.
- classificationTriggers: ledgerStatus is defer_blocked_source; or knowledge/blocked-source registry marks it deferred
- allowedNextLanes: defer_blocked_source, author_first, repair_first
- terminalWhen: replacement exact target is authored or family records an explicit blocked outcome

## live_refresh_candidate

- meaning: Existing DB provenance URL for refresh/validation, not first-pass launch scraping.
- classificationTriggers: row comes from live DB source fields; launchNeedClass explicitly set to live_refresh_candidate
- allowedNextLanes: live_refresh_candidate, ready_target_scrape, repair_first, do_not_scrape_quarantined
- terminalWhen: either promoted into a real exact-target lane or explicitly retired/quarantined

## manual_review

- meaning: Needs operator judgment before entering a runnable fetch or repair lane.
- classificationTriggers: crawlMethod implies manual review; or candidate confidence is low in repair/source-pack artifacts
- allowedNextLanes: manual_review, author_first, repair_first, ready_target_scrape, do_not_scrape_quarantined
- terminalWhen: operator decides a next lane and the row leaves manual_review

## do_not_scrape_quarantined

- meaning: Fake, malformed, stale, or forbidden target retained only so it stays visible and excluded.
- classificationTriggers: quarantineReason or quarantineClassification is present; or reviewed pack explicitly marks it do_not_scrape
- allowedNextLanes: do_not_scrape_quarantined, repair_first
- terminalWhen: remains excluded until an explicit reviewed repair row replaces it

## discovery_only

- meaning: Known URL exists but is not yet an exact runnable launch target.
- classificationTriggers: ledgerStatus is discovery_only
- allowedNextLanes: discovery_only, author_first, manual_review
- terminalWhen: either narrowed into author_first/ready_target_scrape or dropped from launch scope

## Blocked Work Taxonomy

- author_first: Needs exact source-pack or state-packet authoring before it can enter a bounded scrape lane.
  - allowedNextLanes: author_first, ready_target_scrape
- repair_first: Has a known bad, malformed, or stale target that must be repaired before bounded scraping resumes.
  - allowedNextLanes: repair_first, ready_target_scrape
- fetch_blocked: The exact target is known but repeated access failures mean it should not be retried blindly.
  - allowedNextLanes: defer_blocked_source, repair_first
- promotion_blocked: Data exists but cannot be promoted safely because truth, provenance, or public-safe semantics are incomplete.
  - allowedNextLanes: promotion_only, defer_blocked_source
- coverage_below_threshold: Queue execution is exhausted, but launch state or topic coverage is still below threshold and needs explicit authoring or blocking artifacts.
  - allowedNextLanes: author_first, promotion_only

## Family Blocked Lane Summary

- programs_benefits: primaryUnblockClass=promotion_blocked; nextLane=promotion_only
- waivers: primaryUnblockClass=coverage_below_threshold; nextLane=author_first
- forms_guides: primaryUnblockClass=author_first; nextLane=author_first
- program_waitlists: primaryUnblockClass=author_first; nextLane=author_first
- medicaid_hhs_offices: primaryUnblockClass=repair_first; nextLane=repair_first
- dd_routing: primaryUnblockClass=coverage_below_threshold; nextLane=ready_target_scrape
- education_routing: primaryUnblockClass=coverage_below_threshold; nextLane=author_first
- providers_care: primaryUnblockClass=author_first; nextLane=author_first
- knowledge_content: primaryUnblockClass=fetch_blocked; nextLane=defer_blocked_source
- disability_to_program_matching: primaryUnblockClass=coverage_below_threshold; nextLane=promotion_only

## Invariants

- A quarantined URL must never appear in ready_target_scrape.
- A launch-critical URL must resolve to one explicit queue class.
- Only ready_target_scrape is allowed to consume scrape volume directly.
- author_first and repair_first are preparation lanes, not fetch lanes.
- defer_blocked_source is terminal for fetch until a reviewed replacement exists.
- live_refresh_candidate is not equivalent to ready_target_scrape.

