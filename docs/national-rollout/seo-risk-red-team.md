# SEO Risk Red-Team Analysis: National Disability Directory

**Purpose:** Red-team evaluation of programmatic SEO architecture and search engine indexing safety.  
**Auditor:** Antigravity (AI Coding Assistant)  
**Date:** June 14, 2026

---

## 1. Vulnerability Analysis: Programmatic Doorways & Thin Content

Programmatic SEO directories are highly targeted by Google’s recent Helpful Content Updates (HCU). The core risk lies in **automated thin content scale**.

```
[ Boilerplate Layout: 92% ] ──────────────────┐
[ Statewide Resource Links: 6% ] ─────────────┼─► [ Programmatic County Page ]
[ Dynamic County Name/Seat: 2% ] ─────────────┘   (High Doorway Page Risk)
```

### Thin Content Risk
Many rural counties have zero local nonprofits and only 1-2 fallback local offices. This results in pages containing:
* A generic paragraph about the county.
* Mappings to statewide agencies.
* A single gray "Unverified" school district card.
Google classifies pages that do not offer unique local utility beyond what is available on state-level parent directories as **soft-404s** or **thin content**, dropping them from the index.

### Doorway Page Risk
A doorway page is a page created solely for search engine rankings without offering real standalone utility. Because our county pages share identical internal layout, headers, and navigation links, Google's page-clustering algorithms will group them together. If Google clusters 254 Texas counties and finds that 240 of them offer no unique local phone numbers or localized guides, it will flag the entire cluster as a doorway network, sandboxing the domain.

---

## 2. Technical Audit: Indexation Safety Gates

### Noindex Gating Review
* **Status:** **PASS.** All gated county pages (e.g., `/counties/georgia/*`, `/counties/illinois/*`) correctly serve the `<meta name="robots" content="noindex, follow" />` tag.
* **Mechanism:** Next.js metadata API dynamically injects the tag based on the state’s presence in `verifiedCounties.ts`.
* **Playwright Verification:** Smoke tests successfully assert that navigating to gated counties returns the `noindex` tag in headers/meta elements.

### Sitemap Isolation Review
* **Status:** **PASS.** The counties sitemap `/sitemaps/counties.xml` correctly references only CA and counties present in `NON_CA_VERIFIED_COUNTIES` (Texas, Florida, and Pennsylvania).
* **XML Route Quality Gate:** Gated counties are safely omitted, preventing search crawlers from wasting crawl budget on non-indexable routes.

---

## 3. SEO Moat: Differentiating Batch 1 Pages

To protect Batch 1 (Texas, Florida, Pennsylvania) from manual reviewer quality actions, we must implement three immediate differentiators:

### 1. County-Specific Content Injection
Avoid using identical text templates across counties. We must inject at least two unique data points per county page:
* Local county seat physical office hours (instead of just addresses).
* A short, localized guide section (e.g., "Applying for ECI in Harris County requires contact with the local contractor [Contractor Name] at [Phone Number].").

### 2. Intermediate Unit and Catchment Consolidation
For Pennsylvania, intermediate education units are duplicated across multiple counties. We must group and present these as shared regional assets, clearly showing the parent that the resource serves their county rather than duplicating the cards blindly.

### 3. State-level Hub Internal Linking
Ensure that every county page links back to the state benefits hub (`/benefits/texas`) with keyword-rich, contextual anchor text (e.g., "Texas Medicaid Waiver guides") rather than generic "Back to state" buttons. This distributes PageRank cleanly across the state network.
