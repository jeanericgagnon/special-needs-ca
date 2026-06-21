# Source Acquisition Lessons Learned

This is the standing reference for what we learn from acquisition waves.

## Stable Lessons So Far

### 1. Raw fetches should be treated as a filesystem job, not a chat task

Large acquisition waves are token-efficient only when raw pages are saved to disk and Codex reads summaries instead of page bodies.

### 2. Followup bucketing is mandatory

The fetch step alone is not enough. Every run needs followup classification so we can split:

- parse-ready high-signal pages
- suspect parse-ready pages
- retryable failures
- blocked failures
- stale/bad source targets

### 3. High-volume domains need domain-aware caution

A high-success domain is not automatically safe for direct promotion. Some domains are excellent for fetching but still need parser or validation guardrails before they influence public data.

### 4. Many failures are operational, not informational

Large failure counts often come from:

- transient network fetch failures
- anti-bot or access blocking
- stale URLs

That means we should not confuse fetch failure with content absence.

### 5. Suspect redirect handling saves tokens later

Platform redirects, parked domains, social profiles, and account pages should be separated early so they do not pollute parser runs.

### 6. Parser and validation outputs need their own contracts

Without separate parse and validation artifacts, we lose the ability to rerun one stage without redoing the entire acquisition wave.

### 7. Bounded fetchers still need controlled concurrency

Texas v5 showed that a fully serial low-token lane can be truthful but too slow to finish when many official district sites are dead, slow, or weak. Keep the exact-target contract and per-record fetch caps, but allow small controlled concurrency plus URL-level caching so dead hosts do not consume the whole run wall clock.

### 8. Seed URLs and verified evidence URLs are different artifacts

Discovery seeds like AskTED homepages are useful queue inputs, but they must not overwrite the actual evidence URL that passed validation. The acquisition layer should preserve:

- seed/discovery URL
- verified source URL
- final fetched URL

That separation prevents stale discovery roots from being mistaken for proof.

### 9. Domain correctness is necessary but not sufficient

A page living on the correct official or district domain does not make it safe automatically. Acquisition summaries should carry enough evidence for validators to reject:

- board/trustee pages
- policy pages
- calendar/employment/athletics pages
- generic district homepages

even when the host itself is legitimate.

### 10. Final cleanup lanes should pivot from discovery to manual-target authoring

Texas v6 improved the last 38 counties only modestly through expanded bounded discovery. That was still worth doing, but the remaining counties now clearly belong to a manual-target lane rather than another broad automated retry. When a family reaches a small residual set dominated by `search_fallback_exhausted`, acquisition should switch to exact reviewed targets instead of burning more fetch volume on the same discovery patterns.

### 11. County-level search fallback must stay bounded and auditable

Controlled search fallback helped v6 repair a few additional Texas counties, but it is only safe when:

- queries are fixed and role-specific,
- accepted URLs stay on the official district domain,
- every query is logged to the failure or evidence artifact,
- and failure to find a result closes as `search_fallback_exhausted` instead of silently widening scope.

### 12. Forbidden-term guards must inspect evidence headers, not full navigation-heavy bodies

Texas v7 showed that legitimate district pages such as `Special Populations`, `Dyslexia`, and `SpedTex` can be falsely rejected when the validator scans the full page body and picks up unrelated navigation terms like `board`, `athletics`, or `calendar`. Guardrails that reject governance or generic pages should key off the evidence header surface:

- URL path
- page title
- H1/H2 headings

not the entire navigation-heavy body text.

## Per-Run Practice

After each significant wave:

1. Generate `followups/`
2. Generate `lessons-learned.md`
3. Record the top parse-ready domains
4. Record the dominant failure reasons
5. Decide the next parser-safe queue
6. Document any rule changes before the next run

## Current Priority

Use lessons artifacts to drive parser work on the highest-signal queues first, while keeping the acquisition workflow itself deterministic and reusable.
