# Batch 1 County Scope Decision

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** 🛑 **SUPERSEDED / DO_NOT_USE_FOR_EXECUTION**  

> [!WARNING]
> **Active GSC Hold Enforced:** This document has been superseded. GSC sitemap submission is blocked. 
> 
> The proposal to promote the 6 missing Texas counties is superseded by the active code-level gating which locks the allowlist at 270 counties (248 TX, 14 FL, 8 PA). Do NOT use this document for execution.

---

---

## 1. Scope Discrepancy Analysis

The database contains data for every county, but the allowlist in `verifiedCounties.ts` restricts sitemap indexation:

| State | Database Counties | Allowlisted Counties | Status | Gated Rural Counties |
| :--- | :---: | :---: | :--- | :---: |
| **Texas (TX)** | 254 | **248** | 6 counties missing due to manual exclusion. | 6 |
| **Florida (FL)** | 67 | **14** | Curated subset limited to high-density metros. | 53 |
| **Pennsylvania (PA)**| 67 | **8** | Curated subset limited to high-density metros. | 59 |
| **Total** | **388** | **270** | **118 counties gated in code.** | **118** |

*The missing 6 Texas counties are:* `brazos-tx`, `lavaca-tx`, `mclennan-tx`, `tyler-tx`, `victoria-tx`, and `wichita-tx`.

---

## 2. Risk Evaluation: All-Counties (Option A) vs. Curated Subset (Option B)

### 🔴 Option A: Index All Counties (254 TX, 67 FL, 67 PA)
* **SEO Doorway-Page Risk:** **HIGH.** Florida and Pennsylvania contain 112 rural/suburban counties where local parent-support nonprofits and direct school contacts are thin. Indexing these thin pages violates Google's Webmaster Guidelines, risking a domain-wide "thin content" penalty.
* **User/Parent Experience Risk:** **HIGH.** Parents in rural counties will see empty contact cards or generic statewide hotlines instead of local verified storefronts.
* **Curation Burden:** High. Requires verifying 112 additional counties immediately.

### 🟢 Option B: Index Curated Subset (248 TX, 14 FL, 8 PA) - *Recommended*
* **SEO Doorway-Page Risk:** **LOW.** Gating the 112 rural counties behind `noindex` shields the site from doorway-page penalties.
* **User/Parent Experience Risk:** **LOW.** Only high-fidelity counties with complete, verified local data are allowlisted.
* **Curation Burden:** Closed. Focuses efforts on metro hubs where 80%+ of the special needs population resides.

---

## 3. Proposed Allowlist Correction Plan

To align the code with the database coverage while maintaining search safety, we propose the following changes:

1. **Promote the 6 Missing Texas Counties:** Add `brazos-tx`, `lavaca-tx`, `mclennan-tx`, `tyler-tx`, `victoria-tx`, and `wichita-tx` to the allowlist in `verifiedCounties.ts`. Texas has a **0.00% manual review rate** and ECI/LIDDA routing is complete for all 254 counties.
2. **Maintain Gating on Florida & Pennsylvania:** Keep the 53 rural Florida counties and 59 rural Pennsylvania counties gated (`noindex`) and excluded from the sitemaps.
3. **Founder Approval Required:** We will wait for explicit founder instruction before modifying `verifiedCounties.ts`.
