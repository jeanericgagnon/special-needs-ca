# Nonprofit Accessibility Domain Pipeline

This pipeline now separates org-level physical presence evidence from true local in-person coverage.

## Evidence levels

- `service_location_address`
  Use when a row behaves like a single physical service-location record and first-party evidence supports a real office or service location.
- `county_specific_location`
  Use when first-party evidence clearly ties the address to the county/local row itself.
- `organization_physical_address`
  Use when the source confirms an organization office address, but not a local office for each county/service-area row.
- `statewide_service_area`
  Use when one org address is being applied across many county rows inside one state. This is org-level presence plus statewide service-area coverage, not local county office proof.
- `national_or_network_directory`
  Use when the domain looks like a parent org, affiliate network, or directory. Do not live-promote without special mode.
- `ambiguous_address_evidence`
  Use when an address appears on the first-party site but does not clearly support public-safe local in-person wording.

## Guardrails

- A single address cannot bulk-promote local `in_person_services=1` across many county rows.
- If one address would affect more than `50` rows, the default run stops at dry-run style review unless `--allow-bulk-org-level` is passed.
- Aggregator or network domains do not live-promote unless `--allow-network-domain` is passed.
- If address evidence is tiny relative to row count, the report emits a many-to-one warning.
- County-spanning or state-spanning rows default to org-level presence wording unless row semantics make local promotion safe.

## Low-Token Workflow

Use the wrapper command so future runs stay out of Codex context and only produce compact local summaries.

Dry run first:

```bash
npm run run:nonprofit-accessibility-domain -- --domain=thegao.org
```

If the compact report looks safe and you intentionally want a live correction/promotion:

```bash
npm run run:nonprofit-accessibility-domain -- --domain=thegao.org --mode=live --allow-bulk-org-level
```

If you need a one-off custom domain without editing the profile file:

```bash
npm run run:nonprofit-accessibility-domain -- --domain=example.org --org="Example Org" --org="Example Network"
```

The wrapper:

- loads org terms from `scripts/nonprofit-domain-profiles.json` when available
- defaults risky/high-volume domains to `dry-run`
- prints only a compact JSON summary
- keeps full artifacts on disk
- reruns `audit:directory-accessibility` automatically after live mode unless `--skip-audit` is passed

Recommended operator loop:

1. Run wrapper in dry-run mode.
2. Open the generated markdown report only.
3. Check `safeStatus`, warnings, sample rows, and evidence level counts.
4. Only use live mode if the report shows public-safe semantics.
5. Move to the next domain without bringing raw datasets back into Codex.

## Outputs

- Full crawl, evidence, mutation, and rollback artifacts:
  `data/nonprofit-accessibility-domains/<domain>/<run-stamp>/`
- Compact generated report:
  `docs/generated/nonprofit-accessibility-domain-<domain>-<date>.md`

Rollback SQL is written beside the run artifacts so org-level corrections are reversible.
