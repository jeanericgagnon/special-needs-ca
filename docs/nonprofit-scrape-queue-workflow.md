# Nonprofit Scrape Queue Workflow

Use this before running nonprofit accessibility domain scrapes.

## Step 1

Generate the normalized scrape queue:

```bash
npm run audit:nonprofit-scrape-queue
```

## Step 2

Open the compact report:

`docs/generated/nonprofit-scrape-queue-<date>.md`

Use it to decide whether each target is:

- a real site to scrape directly
- a chapter/affiliate path to scrape separately
- a network/umbrella domain that needs affiliate discovery first

## Step 3

Only run the nonprofit accessibility wrapper against targets that are:

- `single_site`
- `site_path`
- `statewide_service_org`

Do not run direct live promotion against:

- `network_directory`
- `aggregator_or_network`

Those should move to affiliate discovery first.

## Step 4

Use the generated flags from the queue report with:

```bash
npm run run:nonprofit-accessibility-domain -- --domain=example.org
```

The goal is to decide the scrape target list once, then keep promotion runs deterministic and low-token.
