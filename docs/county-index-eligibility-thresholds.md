# County Index Eligibility Thresholds

This document defines the strict gatekeeping thresholds that determine whether a county page is allowed to be indexed by search engines. These filters prevent thin-content or unhelpful pages from degrading overall domain authority.

---

## 1. Index Eligibility Criteria

For any county page (e.g., `/counties/[state]/[county-slug]`) to be eligible for public indexation, it must pass **all** of the following validation gates:

| Gate | Requirement | Metric / Check | Severity |
| :--- | :--- | :---: | :---: |
| **1. No Mock Contacts** | Phone numbers, emails, and addresses must not contain placeholders (e.g., `555`, `test@`, `example.com`). | **0 placeholders** | 🛑 **Critical Blocking** |
| **2. No Active Fallbacks** | No active statewide routing pages listed in place of localized school districts or regional centers. | **0 fallback records** | 🛑 **Critical Blocking** |
| **3. Low Manual Review Rate** | The percentage of gray (unverified) cards on the county page must be low. | **< 15.0%** | ⚠️ **Warning Block** |
| **4. Routing Verification** | The page must possess a verified local Health & Human Services (HHS) office OR a verified Developmental Disability (DD) / Early Intervention (EI) routing intake. | **At least 1 verified routing office** | 🛑 **Critical Blocking** |
| **5. Unique Content** | Unique hero intro copy and dynamic metadata must be active. | **Active & Mapped** | 🛑 **Critical Blocking** |
| **6. No Empty Cards** | Cards with missing contacts must be completely hidden from the DOM. | **0 empty cards rendered** | 🛑 **Critical Blocking** |
| **7. Source Trust** | All referenced sources must be classified as `verified_official_source` or `verified_trusted_nonprofit_source`. | **100% verified sources** | 🛑 **Critical Blocking** |

---

## 2. Enforcement Mechanism (Routing Layer)

We enforce these gates dynamically in the Next.js page component (`frontend/src/app/counties/[state]/[slug]/page.tsx`):

```typescript
export async function generateMetadata({ params }) {
  const isEligible = await checkCountyIndexEligibility(params.state, params.slug);
  return {
    title: ...,
    robots: isEligible ? "index, follow" : "noindex, nofollow"
  };
}
```

Any county that fails one or more criteria automatically receives the `noindex, nofollow` header, preventing indexation.

---

## 3. Current Eligible Counties (Batch 1 Summary)

- **Texas (TX):** 248 counties allowlisted (out of 254 total). The remaining 6 counties are gated and return `noindex`.
- **Florida (FL):** 14 counties allowlisted (out of 67 total). The remaining 53 counties are gated and return `noindex`.
- **Pennsylvania (PA):** 8 counties allowlisted (out of 67 total). The remaining 59 counties are gated and return `noindex`.
- **Total non-CA Allowlisted Counties:** 270 counties.
- **All Other 47 States:** Excluded and return `noindex`.
- **County × Diagnosis Leaves:** Excluded from indexing outside CA legacy rules.


