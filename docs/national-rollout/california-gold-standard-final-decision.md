# California Gold Standard Final Decision

This document records the final launch classification decision for California under the V3 quality gates.

---

## 1. Safety Assessment

* **Verification Gaps:** California contains **77 programmatic fallbacks** and a **69.09% manual review rate** (primarily unverified special education advocates).
* **Doorway Page Risk:** If sitemaps were expanded to all California county routes, the presence of identical school district fallbacks would trigger search indexation penalties.
* **Fidelity Rating:** While California is structurally deep and has 100% verified local Regional Center and county IHSS/Medi-Cal office coverage, the advocate layer is uncurated and represents a low-fidelity user experience.

---

## 2. Final Release Decision

* **Final Status Classification:** `LEGACY_EXCEPTION_KEEP_GATED`
* **Gating Directives:**
  1. **Maintain Sitemap Gating:** Keep California in `/sitemaps/counties.xml` for backward compatibility only. Block all county x diagnosis sub-page listings from indexation.
  2. **Enforce noindex:** Gated California sub-routes (such as diagnosis leaves) must return `noindex, nofollow` headers dynamically.
  3. **VA Curation Priority:** In the upcoming 30-day curation roadmap, VAs must focus on replacing the 77 fallback districts with direct special education contacts and verifying the advocate registry.
