# California Next-Source Alignment Audit v1

Generated: 2026-06-27T22:29:31.400Z

- Status: `pass`
- Families: `10`
- Seed entries: `18`
- Seed-ready entries: `18`
- Queue rows: `18`
- Mapped rows: `18`

## By Family
- ihss: 2
- selpa: 2
- ccs_mtu: 2
- dhcs_epsdt: 2
- ssi: 2
- calable: 2
- frcnca: 1
- pti_cprc: 2
- help_me_grow: 1
- local_nonprofits: 2

## Invariants
- registrySummaryMatchesDefinitions: pass
- seedReadyCountMatchesEntries: pass
- queueRowsMatchSeedReadyCount: pass
- mappedRowsMatchQueueRows: pass
- queueSummaryMatchesQueueJsonl: pass
- runPlanMatchesQueueAndMappedPack: pass
- allQueueFamiliesPresentInRegistry: pass
- allMappedRowsStayNeedsReviewOnIngest: pass
- allMappedRowsCarryExpectedStateAndStatus: pass
- noDuplicateQueueJobIds: pass
- noDuplicateMappedSeedJobIds: pass

## Failures
- none

## Artifact Paths
- registry: `data/generated/california-next-source-registry-v1.json`
- queueSummary: `data/generated/california-next-source-seed-queue-v1.json`
- queueJsonl: `data/generated/california-next-source-seed-queue-v1.jsonl`
- runPlan: `data/generated/california-next-source-seed-run-plan-v1.json`
- mappedPack: `data/generated/california-next-source-seed-pack-v1.jsonl`
