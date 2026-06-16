# Wave A Blockers and Manual Review

> [!WARNING]
> SUPERSEDED — DO NOT USE FOR EXECUTION. This batch was rejected and rolled back due to fake county mirroring and state address leakage.

This document outlines the manual review items, blockers, and category gating status for Wave A states following the low-risk official-source batch upgrade.

---

## 1. Provider and Legal Review Queue

Per safety guidelines, all private therapists, commercial special education attorneys, and private clinics were excluded from auto-promotion.

*   **Staged Queue Files:**
    *   `data/state-upgrades/pennsylvania/phase_records/provider_legal_review_queue.json`
    *   `data/state-upgrades/illinois/phase_records/provider_legal_review_queue.json`
    *   `data/state-upgrades/georgia/phase_records/provider_legal_review_queue.json`
    *   `data/state-upgrades/north-carolina/phase_records/provider_legal_review_queue.json`
*   **Held Records count:** **0** (No commercial directories were scraped during this low-risk official-source batch).
*   **Safety Status:** **PASS** (Zero private/commercial providers promoted).

---

## 2. Category Safety Classification (Next Steps)

Following Wave A execution, categories are classified for the next wave:

### Safe for next Batch step (Low-Risk):
*   **Forms / appeals / ABLE:** Wave B forms and ABLE links can be batch-ingested.
*   **HHS locator storefronts:** Wave B local social services offices can be batch-ingested.
*   **DD regional office mappings:** Wave B regional waiver/developmental intake offices can be batch-ingested.
*   **Early Intervention storefronts:** Wave B early childhood coordination directories can be batch-ingested.

### MUST return to Single-State Mode (Isolated):
*   **School District Replacements:** Must remain strictly isolated. Upgrading school districts requires database-wide primary key re-keying and foreign-key reference audits which are too high-risk for multi-state batching.
*   **Provider / Legal Review Queue:** Promotion of directories requires manual verification on a state-by-state basis.
*   **Metropolitan Exceptions:** Borough and city-wide routing exceptions must be handled manually per state.
