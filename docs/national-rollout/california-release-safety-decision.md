# California Release Safety Decision

**Final Release Status:** COMPLETE_WITH_LEGACY_EXCEPTION  
**Gating Strategy:** KEEP_GATED (Exclude from expanded index allowlists)  
**Date:** June 14, 2026

---

## 1. Safety Assessment

Although California has **0 active mock contacts**, it is not fully clean for a new public indexation release:

* **The Fallback Risk:** The database still contains **77 programmatic fallback school districts**. Indexing these pages invites doorway page de-indexing penalties because these pages share identical statewide fallback links.
* **The Manual Review Risk:** **69.09%** of California records are marked `manual_review_required`. This creates a low-fidelity user experience if parents search for advocates and encounter unverified gray cards.

---

## 2. Release Decision

We classify California as: **COMPLETE_WITH_LEGACY_EXCEPTION**.

### Action Directives:
1. **Maintain Gating:** Keep California in `verifiedCounties.ts` for backward compatibility only. Do not add any new California directories or subpages to sitemaps.
2. **Apply Index Gating:** Gated CA routes (such as county x diagnosis leaves) must remain blocked via the `noindex` tag.
3. **Deep Curation Priority:** California's 77 fallbacks should be queued for manual VA verification in the upcoming 30-day sprint.
