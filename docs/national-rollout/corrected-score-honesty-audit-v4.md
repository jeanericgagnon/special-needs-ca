# Corrected Score Honesty Audit (v4)

**Date:** June 15, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** **AUTHORITATIVE**

This audit implements the strict scoring policies to correct legacy state scores and enforce truth-in-metrics across all dynamic directories.

---

## 1. Core Gating & Scoring Policies

To prevent inflated depth metrics from misleading users and crawlers, the following scoring rules are strictly enforced:
- **`manual_review_required`:** 0% verified depth contribution.
- **`generated_fake_domain`:** 0% verified depth contribution.
- **`generated scaffold`:** 0% verified local depth.
- **`safe_gated_placeholder`:** 0% verified local depth.
- **`source_listed`:** Capped at 0.5 only if the source is verified real and direct.
- **`generic homepage`:** Structure only, contributes 0 to verified local depth.
- **Empty contacts (phone/email/address):** Caps usefulness.
- **High manual-review burden states:** Strictly excluded from launch/release candidacy.
- **No negative scores allowed.**
- **Gated skeleton states:** Locked at 0% corrected depth.

---

## 2. Gated Skeleton State Correction

All gated skeleton states (46 states, excluding TX, FL, PA, and CA) represent programmatically generated scaffolds:
- **Corrected Verified Depth Score:** **0.00%**
- **Status Label:** `KEEP_GATED` (Dynamic routes return `noindex` headers).
