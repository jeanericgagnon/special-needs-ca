# Canonical Release Decision

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** APPROVED BY RECONCILIATION (Supersedes all prior release verdict reports)

This document establishes the single, authoritative release decision for Batch 1 and all other state directories. It resolves all prior document discrepancies and serves as the final directive before any public search indexing occurs.

---

## 1. Authoritative Release Posture

| State / Group | Technical Status | Business/Release Status | Google Search Console (GSC) | Search Indexing Policy |
| :--- | :--- | :--- | :--- | :--- |
| **Texas (TX)** | **TECHNICALLY READY** | 🛑 **HOLD** | **HOLD** (Do not submit sitemaps) | Allowlisted locally but gated from public indexation pending founder approval. |
| **Florida (FL)** | **TECHNICALLY READY** | 🛑 **HOLD** | **HOLD** (Do not submit sitemaps) | Allowlisted locally but gated from public indexation pending founder approval. |
| **Pennsylvania (PA)**| **TECHNICALLY READY** | 🛑 **HOLD** | **HOLD** (Do not submit sitemaps) | Allowlisted locally but gated from public indexation pending founder approval. |
| **California (CA)** | **COMPLETE_WITH_LEGACY_EXCEPTION** | 🔒 **GATED** | **HOLD** (Do not submit sitemaps) | Do not expand indexing; legacy-only county allowance; new leaf routes return `noindex`. |
| **All Other States** | **KEEP_GATED** | 🔒 **GATED** | **EXCLUDED** | Strictly served with `noindex` robots headers; excluded from XML sitemaps. |

---

## 2. Decision Directives

### Directive 1: Google Search Console Submission Posture
* **Verdict:** 🛑 **HOLD**
* **Action:** No sitemaps shall be submitted to Google Search Console (GSC), and no DNS TXT domain verification properties shall be promoted to search console indexing. This hold remains in place until:
  1. Live production deployment verification passes (verifying sitemap and canonical response headers on staging/production environments).
  2. The founder/leadership team grants explicit written approval to go live.

### Directive 2: California Indexation Boundary
* **Verdict:** **COMPLETE_WITH_LEGACY_EXCEPTION**
* **Action:** California is not treated as a clean gold standard due to its 77 legacy fallbacks and 69.09% manual review rate. Its county-level indexation is frozen. No new diagnosis or leaf routes (`/benefits/california/` diagnosis leaf paths) shall be indexed.

### Directive 3: Geographic Batch Promotion Suspension
* **Verdict:** **SUSPENDED**
* **Action:** To prevent the duplication of template files, geographic mirroring, or unverified contact data leaks, all multi-state geographic batch promotions are suspended. Upgrades for regional catchments, school districts, and county storefront offices must be executed in isolated, single-state serial mode only.
