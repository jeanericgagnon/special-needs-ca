# Nonprofit Link Registry Workflow

This is the low-token path to `10k+` stored links.

## Step 1

Generate the canonical scrape target registry:

```bash
npm run audit:nonprofit-link-registry
```

This merges:

- direct nonprofit scrape targets
- affiliate chapter targets
- state listing pages
- discovered affiliate site seeds

## Step 2

Expand the registry into stored page candidates:

```bash
npm run run:nonprofit-link-registry-expand -- --limit-targets=50 --max-pages-per-target=8
```

Optional filters:

```bash
npm run run:nonprofit-link-registry-expand -- --target-type=affiliate_chapter --limit-targets=100
npm run run:nonprofit-link-registry-expand -- --domain=thearc.org --limit-targets=100
```

## Step 3

Use the expansion summary instead of raw pages:

- page counts
- page-type guesses
- failed targets
- next extraction candidates

## Goal

The registry lets us store and rank `10k+` candidate links locally without loading them into Codex context.
