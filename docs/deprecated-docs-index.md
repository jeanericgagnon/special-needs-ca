# Deprecated Documentation Index

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** ACTIVE

This document indexes, audits, and deprecates all rollout ledgers, planning guides, and quality reports to prevent the use of contradictory or outdated documentation.

---

## 1. Canonical Project Documents (Authoritative)

| Document Path | Classification | Status Notes |
| :--- | :---: | :--- |
| **`docs/national-rollout/canonical-release-decision.md`** | `CURRENT_CANONICAL` | **Authoritative.** Defines the GSC HOLD and release gating rules. |
| **`docs/national-rollout/current-hard-stop-directives.md`** | `CURRENT_CANONICAL` | **Authoritative.** Details current DNS, GSC, and deployment blocks. |
| **`docs/national-rollout/actual-sitemap-allowlist-audit.md`** | `CURRENT_CANONICAL` | **Authoritative.** Records exact allowlist counts (270) verified in code. |
| **`docs/deprecated-docs-index.md`** | `CURRENT_CANONICAL` | **Authoritative.** Indexes and controls active/deprecated doc status. |
| **`docs/current-project-truth-ledger.md`** | `CURRENT_CANONICAL` | **Authoritative.** Summary ledger locking database and code truth parameters. |

---

## 2. Supporting Technical Audit Files

| Document Path | Classification | Status Notes |
| :--- | :---: | :--- |
| **`docs/national-rollout/generated-scaffold-inventory.md`** | `CURRENT_SUPPORTING` | Supporting. Documents scaffold signatures and state classifications. |
| **`docs/national-rollout/source-target-quarantine-list.md`** | `CURRENT_SUPPORTING` | Supporting. List of fake/quarantined domains. |
| **`docs/national-rollout/bad-source-target-quarantine.md`** | `CURRENT_SUPPORTING` | Supporting. Active quarantine registry. |
| **`docs/national-rollout/source-discovery-redo-queue.md`** | `CURRENT_SUPPORTING` | Supporting. Valid search target queries for quarantined domains. |
| **`docs/national-rollout/db-source-url-quarantine-audit.md`** | `CURRENT_SUPPORTING` | Supporting. Registry of database rows containing quarantined domains. |
| **`docs/forms-library-current-truth.md`** | `CURRENT_SUPPORTING` | Supporting. Authoritative status of the forms_and_guides tables. |
| **`docs/forms-library-missing-pdf-and-script-queue.md`** | `CURRENT_SUPPORTING` | Supporting. Registry of call script gaps and missing PDF links. |
| **`docs/national-rollout/batch-1-source-link-reconciliation.md`** | `CURRENT_SUPPORTING` | Supporting. Classifies failed/broken URLs for allowlisted states. |
| **`docs/national-rollout/rendered-batch-1-source-link-audit.md`** | `CURRENT_SUPPORTING` | Supporting. Audits links rendered on Batch 1 sitemap and hub pages. |
| **`docs/batches/wave-a-validation-audit.md`** | `CURRENT_SUPPORTING` | Supporting. Validates database rollbacks and integrity rules. |
| **`docs/batches/wave-a-routing-model-audit.md`** | `CURRENT_SUPPORTING` | Supporting. Audit of geographic catchment structures. |
| **`docs/batches/wave-a-fix-or-rollback-plan.md`** | `CURRENT_SUPPORTING` | Supporting. Details database rollback checkpoints. |
| **`docs/batches/wave-a-record-total-reconciliation.md`** | `CURRENT_SUPPORTING` | Supporting. Reconciles Wave A records. |

---

## 3. Stale or Contradictory Documents (DO NOT USE)

| Document Path | Classification | Status Notes |
| :--- | :---: | :--- |
| **`docs/national-rollout/final-post-repair-status-ledger.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Deprecated because metrics contradict actual database truth (claims TX 0 MR and FL 1 MR, which contradicts the actual database counts of 756 and 88). |
| **`docs/national-rollout/final-national-status-ledger.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Deprecated because metrics contradict actual database truth (claims TX 0 MR, FL 1 MR, PA 0 MR, contradicting SQLite truth of TX 756, FL 88, PA 67). |
| **`docs/national-rollout/final-national-completion-execution-report.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Deprecated. Contains stale forms library staging status and incorrect manual review counts. |
| **`docs/national-rollout/batch-1-public-release-preflight.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Deprecated. Claims TX 0 MR and FL 1 MR, contradicting actual database counts. |
| **`docs/national-rollout/database-truth-audit.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Deprecated. Contains incorrect manual review counts for Batch 1 states (claims TX 0, FL 1, PA 0). |
| **`docs/national-rollout/gsc-go-no-go-report-v2.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Deprecated. Suggests GO status and incorrect county count of 254 for Texas. |
| **`docs/national-rollout/batch-1-county-scope-decision.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Deprecated. Option A proposes indexing 254 TX, 67 FL, 67 PA, which is superseded by the 270-county allowlist. |
| **`docs/national-rollout/batch-1-allowlist-change-report.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Deprecated. Contains incorrect 0% manual review claims. |
| **`docs/national-rollout/canonical-current-state-ledger.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Claims 100% verified depth for gated skeleton states and contains impossible CA values (-128.1%). |
| **`docs/national-rollout/release-candidate-ledger-v4.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Based on incorrect manual review upgrade counts. |
| **`docs/national-rollout/state-by-state-gap-matrix-v4.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Outdated V4 state metrics. |
| **`docs/national-rollout/seo-index-eligibility-results.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Deprecated due to incorrect verified depth scores. |
| **`docs/national-rollout/gsc-go-no-go-report-v3.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Deprecated. Replaced by `canonical-release-decision.md`. |
| **`docs/national-rollout/next-30-day-execution-plan-v3.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Superseded by current project plan. |
| **`docs/national-rollout/national-source-scraping-completion-report.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Outdated completion report. |
| **`docs/ca-equivalence-roadmap.md`** | `CONTRADICTS_CURRENT_STATE` | **Do not use.** Implies California is clean gold standard (contradicts current database which has 657 manual reviews and 40 fallbacks). |
| **`docs/national-ca-equivalence-plan.md`** | `CONTRADICTS_CURRENT_STATE` | **Do not use.** Stale rollout plan. |
| **`docs/national-state-upgrade-rollout-plan.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Do not use.** Replaced by current directives. |
| **`docs/batches/wave-a-official-source-batch-report.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Replaced due to failed batch rollout issues. |
| **`docs/batches/wave-a-state-results-summary.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Replaced due to failed batch rollout issues. |
| **`docs/batches/wave-a-blockers-and-manual-review.md`** | `DO_NOT_USE_FOR_EXECUTION` | **Invalid.** Deprecated because it erroneously suggested that local social service/DD/EI routing could be batch-promoted. |
