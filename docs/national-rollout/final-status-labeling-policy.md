# Final-Status Labeling Policy

Every upgraded state must be classified under one of the three following statuses.

---

## 1. Classification Statuses

### A. COMPLETE
*   0 fallbacks remain, 0 mock contacts exist, key local records are fully source-supported and verified. Sitemap indices are updated and indexed.

### B. PILOT-READY PARTIAL
*   0 fallbacks remain, 0 mock contacts exist, but unresolved local records (storefronts, districts) are downgraded to `manual_review_required`. Gated with `noindex`.

### C. BLOCKED
*   Source data contains mock/placeholder contact info, local routing layers are missing, or tests fail.
