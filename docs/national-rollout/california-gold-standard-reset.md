# California Gold Standard Reset

**Status:** LEGACY_EXCEPTION_AUDITED  
**Auditor:** Antigravity (AI Coding Assistant)  
**Date:** June 14, 2026

---

## 1. Re-evaluating the "Gold Standard"

California was historically treated as the baseline gold standard for this project because it has a deep, fully integrated county-to-agency mapping structure. However, our adversarial audit reveals that the data is far from pure:

* **Local DD Routing (Regional Centers):** **CLEAN.** 21 Regional Centers are fully mapped to all 58 counties. These represent 100% verified, useful local portals with direct intake phone lines.
* **Local Medicaid/HHS Offices:** **CLEAN.** 174 county administrative offices (Medi-Cal, IHSS, CCS) are verified and have active local contact numbers.
* **School Districts:** **DIRTY.** 77 out of 142 school district records in the CA database are marked `programmatic_fallback` with missing local special education contacts.
* **IEP Advocates/Providers:** **DIRTY.** Out of 580 advocates statewide, over **90%** are marked `manual_review_required` because they lack current verification status.

---

## 2. Redefining the California Gold Standard

To protect product credibility, we are resetting the definition of the "California Gold Standard". It is no longer an absolute completeness marker. Instead, it is defined as follows:

1. **Intake Quality:** Every county page must render a verified, localized developmental intake phone number (Regional Center).
2. **Local Office Coverage:** Every county page must contain at least 2 verified local HHS/social services contacts (Medi-Cal & IHSS).
3. **Verified Badge Integrity:** No unverified advocate or school district placeholder is allowed to display a green "Verified" badge.
4. **Fallback Isolation:** All programmatic school district fallbacks must be clearly labeled as "Statewide directory reference" to warn parents that the contact is not direct.
