# Track A Blocker Registry

Generated: 2026-06-18T22:01:29.269Z

This artifact consolidates the remaining non-runtime Track A blockers into one resumable registry backed by generated audits and saved run artifacts.

## Summary

- blocker count: 5
- critical blockers: 2
- explicit only: yes

## Blockers

### Local providers, clinics, therapists, and care

- id: provider_directory
- status: critical_gap
- current state: thin
- summary: This is the biggest information hole if the goal is all local help, especially to compete on care and treatment discovery.
- evidence: 94 public provider rows and 23 staged provider rows across all 50 states.
- next operator action: No live provider repair or authoring queue remains; keep this blocker class explicitly blocked by saved coverage evidence until a future audit yields new exact targets.
- entry command: npm run run:next-provider-depth-step
- queue audit: npm run audit:source-acquisition-completion-plan
- artifacts: docs/generated/exhaustive-gap-master-2026-06-18.json, docs/generated/provider-followup-blocker-registry-2026-06-18.json, docs/generated/provider-followup-repair-queue-2026-06-18.json, docs/generated/provider-authoring-backlog-2026-06-18.json, docs/generated/information-inventory-2026-06-18.json
- metrics:
  - liveProviders: 94
  - stagedProviders: 112
  - repeatedFollowupRows: 47
  - repeatedFollowupDomains: 41
  - repairQueueRows: 0
  - repairQueueDistinctUrls: 0
  - authoringBacklogRows: 0
  - authoringFirstState: 
  - topRepeatedReasons: [{"label":"access_blocked_403","count":17},{"label":"stale_or_invalid_404","count":14},{"label":"dns_lookup_failed","count":6},{"label":"needs_review_unknown","count":4},{"label":"network_fetch_failed","count":3}]

### Advocates and legal/IEP support

- id: advocate_directory_depth
- status: meaningful_but_not_exhaustive
- current state: moderate
- summary: Advocate count is decent, but truth-safe local coverage is not yet strong enough to call exhaustive.
- evidence: 2995 advocate rows, with California still blocked in strict gold because 58 counties lose advocate coverage after truth gating.
- next operator action: No live advocate depth queue remains; keep this blocker class explicitly blocked by saved coverage evidence until a future audit yields new exact targets.
- entry command: npm run run:next-advocate-depth-step
- queue audit: npm run audit:advocate-depth-queue
- artifacts: docs/generated/exhaustive-gap-master-2026-06-18.json, docs/generated/advocate-followup-blocker-registry-2026-06-18.json, docs/generated/advocate-depth-queue-2026-06-18.json, docs/generated/information-inventory-2026-06-18.json
- metrics:
  - liveAdvocates: 2995
  - stagedAdvocates: 4452
  - actionableFollowupRows: 832
  - distinctBlockedDomains: 1319
  - advocateDepthQueueRows: 0
  - californiaTruthRecoveryCounties: 0
  - topActionableReasons: [{"label":"dns_lookup_failed","count":826},{"label":"needs_review_unknown","count":3},{"label":"network_timeout","count":1},{"label":"server_500","count":1},{"label":"stale_or_invalid_404","count":1}]

### Findhelp-like metadata: availability, accessibility, intake, capacity

- id: directory_foundation_signals
- status: partial
- current state: modeled
- summary: The schema exists, but live high-signal metadata is sparse, especially on nonprofits and advocates.
- evidence: Provider accessibility booleans with true signal: accepts_medi_cal 27/94; interpreter_available 22/94; asl_available 12/94; wheelchair_accessible 5/94; virtual_services 18/94; in_person_services 60/94; home_visits 3/94; transportation_help 8/94 Nonprofit accessibility booleans with true signal: interpreter_available 0/29501; asl_available 0/29501; wheelchair_accessible 0/29501; virtual_services 1/29501; in_person_services 22/29501; home_visits 0/29501; transportation_help 0/29501 Advocate accessibility booleans with true signal: interpreter_available 0/2995; asl_available 0/2995; wheelchair_accessible 0/2995; virtual_services 2/2995; in_person_services 0/2995; home_visits 0/2995; transportation_help 0/2995
- next operator action: No live directory-foundation enrichment queue remains; keep this blocker class explicitly blocked by saved low-signal coverage evidence.
- entry command: npm run run:next-directory-foundation-step
- queue audit: npm run audit:directory-foundation-enrichment-queue
- artifacts: docs/generated/exhaustive-gap-master-2026-06-18.json, docs/generated/information-inventory-2026-06-18.json, docs/generated/directory-foundation-enrichment-queue-2026-06-18.json, docs/generated/competitive-help-followup-blocker-registry-2026-06-18.json
- metrics:
  - liveProviders: 94
  - liveNonprofits: 29501
  - liveAdvocates: 2995
  - enrichmentQueueRows: 0
  - providerSourcePullStates: 0
  - nonprofitCandidateRows: 0
  - providerCandidateRows: 0

### Canonical org -> program -> location normalization

- id: normalization_depth
- status: partial
- current state: present
- summary: Normalization exists, but service-location depth is still too thin to support a fully location-rich help product.
- evidence: 36891 organizations, 36891 org-program links, 83 service locations, 4314 office locations, 33130 virtual service areas.
- next operator action: No live normalization gap queue remains; keep this blocker class explicitly blocked by saved thin-location evidence until a future audit yields exact rows.
- entry command: npm run run:next-normalization-step
- queue audit: npm run audit:normalization-gap-queue
- artifacts: docs/generated/exhaustive-gap-master-2026-06-18.json, docs/generated/information-inventory-2026-06-18.json, docs/generated/normalization-gap-queue-2026-06-18.json
- metrics:
  - organizations: 36891
  - orgProgramLinks: 36891
  - serviceLocations: 83
  - officeLocations: 4314
  - virtualServiceAreas: 33130
  - normalizationQueueRows: 0
  - providerServiceLocationGapRows: 0

### Help content and explanatory knowledge

- id: knowledge_content_depth
- status: critical_gap
- current state: thin
- summary: The content layer is still far too small for the full family journey nationally, but staged knowledge growth is now present and measured.
- evidence: 15 knowledge articles, 8 staged knowledge articles.
- next operator action: No live knowledge queue or missing knowledge source family remains; keep this blocker class explicitly blocked by saved thin-coverage evidence until a future audit yields new exact topics.
- entry command: npm run run:next-knowledge-content-step
- queue audit: npm run audit:knowledge-content-status-queue
- artifacts: docs/generated/exhaustive-gap-master-2026-06-18.json, docs/generated/information-inventory-2026-06-18.json, docs/generated/authored-missing-source-targets-2026-06-18.json, docs/generated/knowledge-content-status-queue-2026-06-18.json
- metrics:
  - liveKnowledgeArticles: 15
  - stagedKnowledgeArticles: 8
  - acceptedKnowledgeRows: 33
  - acceptedKnowledgeUrls: 8
  - repeatedFollowupRows: 18
  - repeatedFollowupUrls: 18
  - promotionInspected: 16
  - promotionDuplicates: 14
  - promotionPromoted: 2
  - promotionManualReview: 0
  - exactTargetQueueRows: 0
  - exactTargetDuplicateRows: 6
  - exactTargetPendingRows: 0
  - authoredKnowledgeTargets: 68
  - knowledgeMissingFamilyOpen: 0

