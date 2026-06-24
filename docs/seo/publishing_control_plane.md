# SEO Publishing Control Plane

Ablefull uses a **SEO Publishing Control Plane** designed to ensure only high-quality, verified, and parent-useful pages are indexable by search engines. Programmatic directory sites often suffer from search-engine penalties due to thin content or placeholders. Ablefull addresses this by defaulting every route to `noindex, follow` and only upgrading them to `index, follow` when they pass strict quality gates.

---

## Core Principles

1.  **Closed by Default**: All programmatic or generated pages default to `noindex, follow` and are excluded from all sitemap indexes.
2.  **No Placeholders Indexed**: Any page containing draft text, `555` phone numbers, mock addresses, or fallback placeholders is blocked from indexation.
3.  **No Empty Indexation**: Category pages with zero programs or matrix comparison pages with fewer than two programs are blocked from indexation.
4.  **Audit-Gated Data Truth**: Indexability is tied directly to the state audit status. The SEO gate cross-checks `data/generated/all_state_california_grade_audit_v3.json` and `data/generated/all_state_priority_queue_v3.jsonl`. Only states with `classification === "COMPLETE"` and `index_safe === true` in both files are indexable. All others render but are strictly `noindex` and excluded from sitemaps.
5.  **Fail-Closed & Overrides**: If audit data is missing, inconsistent, or malformed, the system fails closed (marks the state `noindex`). Texas is manually overridden to `indexSafe: false` until Part C early intervention evidence is fully verified.

---

## Route Types & Indexation Gates

All routes are evaluated programmatically via the central policy checker (`evaluateSeoPolicy` in `seo-policy.ts`). Sitemaps use this same central policy to determine page inclusion.

| Route Type | URL Pattern | Indexation Gate Criteria |
| :--- | :--- | :--- |
| **State Hub** | `/benefits/[state]` | Enabled only if the state is marked COMPLETE and index-safe in state audit artifacts. Requires no placeholder indicators. |
| **County Hub** | `/benefits/[state]/[county]` | Requires the state to be index-safe, school district records >= 1, localized agency contact info, official source URL, freshness verification date, and zero placeholders. |
| **Condition Hub** | `/benefits/[state]/[diagnosis]` | State must be index-safe and diagnosis must be part of the verified list of core conditions (Autism, ADHD, Down Syndrome, etc.). |
| **Program Guide** | `/programs/[slug]` | State must be index-safe. The program must contain statutory eligibility rules, structured application steps, a document checklist, and an official agency source URL. |
| **Category Hub** | `/benefits/[state]/category/[cat]` | Must contain at least 1 program belonging to that state/category. State must be index-safe. |
| **Comparison Matrix** | `/benefits/[state]/compare` | Must contain at least 2 programs to compare side-by-side. State must be index-safe. |
| **County-Condition Leaf** | `/benefits/[state]/[diag]/[county]` | **Extremely Strict**: Limited currently to California + Los Angeles/Orange. Requires state index-safe, verified diagnosis, real local assets in database, localized contacts, and zero placeholders. |
| **School District** | `/school-districts/[state]/[slug]` | **Strictly Noindex**: Currently not ready for indexation; excluded from sitemaps. |
| **City** | `/benefits/[state]/[diagnosis]/[city]` | **Strictly Noindex**: Currently not ready for indexation; excluded from sitemaps. |
| **Static Page** | Various | Statically configured pages; allowed if free of placeholders. |

---

## Structured Data Rules

All pages utilize semantic JSON-LD structures to align with Google Search Console E-E-A-T guidelines:
*   **FAQPage**: Generated dynamically from verified FAQs.
*   **GovernmentService**: Emitted only for verified state/federal waiver programs on indexable pages. Gated to prevent emission on blocked pages.
*   **MedicalCondition**: Emitted for condition-specific hubs.
*   **EducationalOrganization**: Mapped for public school districts.
*   **ProfessionalService / Park**: Only generated for real, database-backed clinics, playgrounds, and support organizations. Zero mock elements are emitted.

---

## Quality Assurance Checker

We utilize `scripts/qa-seo-checker.ts` as an automated gate. It queries the navigator database directly, imports the centralized SEO policy, and checks:
1. All indexable/sitemap-eligible routes pass the central quality policy.
2. No indexable page contains placeholder patterns or `555` numbers in database fields.
3. No empty categories or sparse comparisons are marked indexable.
4. Source code files do not contain banned hardcoded date fallbacks, mock confidence scores, or fake citations.
5. No blocked state (including Texas, New York, Ohio, Georgia, Illinois) is marked indexable or included in sitemaps.

To run the checker:
```bash
npm run seo:qa
```

---

## Entitlement Rules & Screening Hints

Eligibility rules generated dynamically are presented strictly as matching/screening hints (using language like "may qualify" or "screening hint") rather than verified legal entitlement rules, unless each rule has explicit official citation evidence in the database.

---

## UI Disclosures

Blocked or partial states/pages:
*   Display a highly visible "Verification Pending" banner explaining the audit status and known blockers (sourced from failure ledger/gap reasons).
*   Serve a `noindex, follow` robots meta tag.
*   Do not emit strong GovernmentService or FAQ schema claims.

Complete/index-safe states:
*   Display verified source details and freshness verification dates.
*   Link directly to first-party official sources.
*   Display the audit status badge.
