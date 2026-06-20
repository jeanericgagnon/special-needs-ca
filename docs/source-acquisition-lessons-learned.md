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
