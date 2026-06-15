# Current Hard-Stop Directives

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** **ACTIVE / ENFORCED**

This document establishes the official and active hard-stop directives for the Special Needs Navigator project. All release, indexation, promotion, and deployment processes must conform strictly to these constraints.

---

## 1. Google Search Console (GSC) Hold
* **Directive:** 🛑 **HOLD**
* **Action:** No sitemaps shall be submitted to Google Search Console (GSC), and no DNS TXT domain verification properties shall be promoted to search console indexing.

## 2. DNS Property Changes
* **Directive:** 🛑 **HOLD**
* **Action:** No DNS TXT records for search console property verification or domain ownership verification shall be created or modified.

## 3. Sitemap Allowlist Expansion
* **Directive:** 🛑 **HOLD**
* **Action:** No new counties or states shall be added to the verified allowlist in `frontend/src/lib/verifiedCounties.ts`. The allowlist is strictly frozen at the current Batch 1 scope (TX 248, FL 14, PA 8, total 270).

## 4. Public Deployment Gating
* **Directive:** 🛑 **HOLD**
* **Action:** No production deployment actions shall be triggered, and no indexing headers shall be enabled on environments exposed to the public. All county detail pages for non-allowlisted states must remain strictly index-gated using `noindex, follow` robots meta tags.

## 5. Geographic Batch Promotion Suspension
* **Directive:** 🛑 **HOLD**
* **Action:** All multi-state geographic batch promotions are strictly suspended. Ingestions and promotions of regional offices, school districts, and county storefronts must be run in isolated, single-state serial runs only to prevent template/mirroring errors.
