# Release Readiness Definition V2

This document defines the strict, checklist-based gating requirements that must be met before a state's sitemap gating is lifted and public indexing is enabled.

---

## 1. Indexation Readiness Checklist

A state is eligible for public release and allowlisting in `verifiedCounties.ts` only if it passes all the following quality checks:

* **0.0% Mock Data:** Zero active records containing `555` phone numbers, placeholder websites, or mock emails.
* **0.0% Fallbacks:** Zero programmatic fallback records (`data_origin = 'programmatic_fallback'`) in school district and county office layers.
* **< 5.0% Manual Review Rate:** The total number of unverified records (`verification_status = 'manual_review_required'`) divided by total records must be strictly less than 5.0%.
* **Verified Local Routing:** Direct county-level or catchment-level intake lines must be verified for the primary early intervention and Medicaid waiver agencies.
* **Unique SEO Assets:** The county-level routes must serve unique, dynamically generated title tags and meta descriptions, with parent introduction copy describing local services.
* **Zero Empty Cards:** The frontend layout must safely hide cards that have empty contact information, ensuring parents never see empty placeholder frames.
* **Source Trust Completeness:** All verified records must have active `source_url` metadata pointing to official program folders (not generic homepages).
