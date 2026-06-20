# Minimum-Token Gap Fill Prompt

Generated: 2026-06-17

## Purpose

Use this prompt when the goal is to finish the remaining information gaps with the lowest possible token spend while preserving the truth-first standard.

## Current Reality

- All 50 states are currently truth-safe and gold-eligible in the strict truth registry.
- Core programs, forms, DD routing, county offices, education coverage, nonprofits, and advocates are broadly complete enough to pass the current truth and completeness audits.
- The main remaining national information gap is `resource_providers`.
- Current provider presence: 7 states pass, 43 states still have no public-safe provider layer.
- Do not spend tokens re-auditing already-green layers unless a provider change breaks them.

## Low-Token Operator Prompt

```text
Work inside the special-needs-ca repo.

Goal: reduce the remaining "all info" gap with minimum tokens, without lowering the truth-first bar.

Truth constraints:
- Never invent, infer, or synthesize local public resources.
- Only add provider rows backed by official first-party source URLs.
- Every promoted public provider must include a real name, source_url, state, county, and at least one contact signal.
- If evidence is weak or ambiguous, skip the row instead of writing filler.

What is already done:
- Current truth audit is green for all 50 states.
- Current completeness audit shows the main remaining blocker is provider coverage in 43 states.
- Do not revisit programs, forms, DD routing, offices, education, nonprofits, or advocates unless needed for a provider dependency.

Primary task:
- Add the smallest truthful provider set needed to expand real provider coverage state by state.
- Prefer 1 to 3 official hospital, university, or children's developmental clinic rows per target state before doing anything broader.

Priority order:
1. Zero-provider states with the strongest existing nonprofit ecosystem:
   Louisiana, Indiana, New York, Virginia, Michigan, Kentucky, Tennessee, Nebraska, Kansas, Colorado.
2. Small-county cheap batch states:
   Delaware, Hawaii, Rhode Island, Connecticut, New Hampshire.
3. Remaining zero-provider states after the pattern is proven.

How to work:
1. Pick one target state only.
2. Reuse existing source-target files and existing provider seed patterns before inventing new logic.
3. Add only official first-party provider rows that clearly meet truth requirements.
4. Run only the smallest relevant scripts and audits needed to confirm the provider rows were added correctly.
5. Stop after one clean state pass unless explicitly told to continue.

Keep output short:
- First line: target state.
- Then: sources used.
- Then: rows added.
- Then: audit result.
- Then: next best state.

Do not write a long narrative, broad recap, or strategy memo.
```

## Even Cheaper Single-State Prompt

```text
In special-needs-ca, add the minimum truthful public-safe provider layer for one zero-provider state.

Rules:
- Official first-party sources only
- No synthetic listings
- Reuse existing provider seed patterns
- Add only 1 to 3 provider rows
- Run only the smallest necessary verification
- Return only: state, sources, rows added, audit result, next state

Start with: New York
Fallbacks: Louisiana, Indiana, Virginia
```

## Why This Is The Cheapest Honest Path

- It avoids repaying context on already-green layers.
- It uses the only blocker family still affecting most states.
- It constrains each pass to one state and a tiny number of trustworthy rows.
- It forces reuse of existing repo patterns instead of exploratory redesign.
