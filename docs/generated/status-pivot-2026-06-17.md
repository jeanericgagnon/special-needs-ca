# Status Pivot 2026-06-17

## Current Position

- Truth registry snapshot: `49 strict-gold states`, `1 public-safe-but-blocked state`, `0 registry mismatches`.
- Provider accessibility pull queue in current focus audit: `0 queued clues`.
- Resource providers accessibility: `83/83` rows have at least one accessibility signal, `0` remain blank.
- Nonprofit accessibility: `258/29499` rows have at least one accessibility signal, `29241` remain blank.
- Nonprofit in-person coverage: `48/29499`.

## What Is Finished In This Lane

- Public-safe provider layer is covered in the current audited set.
- Provider accessibility review queue has been drained for the current focus states.
- Repeated first-party nonprofit promotions have proven the pattern for source-family batch promotion.

## What Is Not Finished

- Nonprofit accessibility remains the dominant remaining information gap by volume.
- The current row-by-row promotion approach is too token-expensive relative to remaining scale.

## Pivot Decision

- Stop status narration and repeated manual checkpoint reconstruction.
- Stop one-row-at-a-time nonprofit promotion in chat.
- Move from information gathering to batch execution.

## Cheapest Next Mode

1. Pick one repeated nonprofit source family.
2. Verify one explicit first-party office/contact fact for that family.
3. Apply that fact to every matching eligible row in one SQL batch.
4. Rerun `node src/db/generate_directory_accessibility_audit.js` once.
5. Record only the new counts.

## Immediate Candidate

- `https://thegao.org`
  - pattern already established
  - repeated across many Georgia nonprofit rows
  - suitable for bulk in-person promotion from the same first-party address evidence
