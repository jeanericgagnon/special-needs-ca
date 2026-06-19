# SEO Publishing Control Plane

Ablefull uses a **SEO Publishing Control Plane** designed to ensure only high-quality, verified, and parent-useful pages are indexable by search engines. Programmatic directory sites often suffer from search-engine penalties due to thin content or placeholders. Ablefull addresses this by defaulting every route to `noindex, follow` and only upgrading them to `index, follow` when they pass strict quality gates.

---

## Core Principles

1.  **Closed by Default**: All programmatic or generated pages default to `noindex, follow` and are excluded from all sitemap indexes.
2.  **No Placeholders Indexed**: Any page containing draft text, `555` phone numbers, mock addresses, or fallback placeholders is blocked from indexation.
3.  **No Empty Indexation**: Category pages with zero programs or matrix comparison pages with fewer than two programs are blocked from indexation.
4.  **Codex Data Verification**: Indexation is tied directly to the quality of the database entries populated by the Codex ingestion pipelines.

---

## Route Types & Indexation Gates

| Route Type | URL Pattern | Indexation Gate Criteria |
| :--- | :--- | :--- |
| **State Hub** | `/benefits/[state]` | Enabled for the verified list of states (CA, TX, FL, PA, NY, OH, IL) with no placeholder indicators. |
| **County Hub** | `/benefits/[state]/[county]` | Requires the state and county to be high-fidelity (verified contact info present, database-backed regional center and school boards mapped, and zero placeholders). |
| **Condition Hub** | `/benefits/[state]/[diagnosis]` | Diagnosis must be part of the verified list of core conditions (Autism, ADHD, Down Syndrome, etc.) and state must be verified. |
| **Program Guide** | `/programs/[slug]` | The program must contain statutory eligibility rules, structured application steps, a document checklist, and an official agency source URL. |
| **Category Hub** | `/benefits/[state]/category/[cat]` | Must contain at least 1 program belonging to that state/category. |
| **Comparison Matrix** | `/benefits/[state]/compare` | Must contain at least 2 programs to compare side-by-side. |
| **County-Condition Leaf** | `/benefits/[state]/[diag]/[county]` | **Extremely Strict**: Limited currently to California + Los Angeles/Orange. Requires verified diagnosis, real local assets (clinics, playgrounds, support groups) in database, and zero placeholders. |

---

## Structured Data Rules

All pages utilize semantic JSON-LD structures to align with Google Search Console E-E-A-T guidelines:
*   **FAQPage**: Generated dynamically from verified FAQs.
*   **GovernmentService**: Emitted for verified state/federal waiver programs.
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

To run the checker:
```bash
npm run seo:qa
```

### Known Limitations

* **Database-Level QA**: The checker runs assertions on raw database records, which is not the same as verifying fully rendered pages.
* **Source-Code Scans**: Source-level string scans check for banned patterns, but do not prove that final rendered pages are 100% clean of all thin content.
* **Future Work**: Future improvements should include a crawler that crawls built HTML pages, parses metadata, and validates schema/JSON-LD structures in a staging environment.

---

## Codex Data Dependencies & Next Actions

To unlock indexation for additional counties and states:
1.  **Verify Contacts**: Ensure county offices have valid, non-mock phone numbers and physical addresses in the `county_offices` table.
2.  **Populate Local Assets**: Ingest real pediatric clinics, sensory parks, and parent support groups into the `resource_providers` table.
3.  **Audit Program Rules**: Ensure waiver programs have complete eligibility rules, step-by-step applications, and document lists in `program_eligibility_rules`, `program_application_steps`, and `program_document_requirements`.
