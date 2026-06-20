# Track A Operator Handoff

Generated: 2026-06-18T20:37:43.934Z

This artifact is the single handoff surface for continuing Track A from disk.

## Summary

- missing source families: 0
- unknown blockers: 0
- blocker count: 5
- first priority blocker: provider_directory

## Handoff

- P1 provider_directory: queue=docs/generated/provider-followup-repair-queue-2026-06-18.json (1)
  Entry command: npm run run:next-provider-depth-step
  Queue audit: npm run audit:source-acquisition-completion-plan
- P2 knowledge_content_depth: queue=docs/generated/knowledge-content-status-queue-2026-06-18.json (4)
  Entry command: npm run run:next-knowledge-content-step
  Queue audit: npm run audit:knowledge-content-status-queue
- P3 advocate_directory_depth: queue=docs/generated/advocate-depth-queue-2026-06-18.json (0)
  Entry command: npm run run:next-advocate-depth-step
  Queue audit: npm run audit:advocate-depth-queue
- P4 directory_foundation_signals: queue=docs/generated/directory-foundation-enrichment-queue-2026-06-18.json (0)
  Entry command: npm run run:next-directory-foundation-step
  Queue audit: npm run audit:directory-foundation-enrichment-queue
- P5 normalization_depth: queue=docs/generated/normalization-gap-queue-2026-06-18.json (0)
  Entry command: npm run run:next-normalization-step
  Queue audit: npm run audit:normalization-gap-queue
