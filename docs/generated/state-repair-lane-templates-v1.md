# State Repair Lane Templates v1

These lanes generalize the Texas repair sequence without pretending that one state-specific manifest fits all states.

## 1. Official Manifest Repair
- Input: state failure ledger, unresolved roles, legacy source inventory.
- Output: repaired official domain manifest and reviewed exact-target queue.
- Stop rule: do not fetch broad inventory rows directly.

## 2. Medicaid / Waiver Repair
- Verify Medicaid application, eligibility, waiver, appeal, fair-hearing, and local-office sources separately.
- Reject generic health portals unless the exact workflow page is proven.

## 3. DD / IDD Repair
- Prove main DD authority, intake/application, eligibility, local/regional routing, and complaints separately.
- County PASS cannot inherit statewide DD evidence.

## 4. Early Intervention Repair
- Prove Part C program, referral/intake, eligibility, local office directory, and family-rights/dispute path.
- Generic developmental-delay explainers do not satisfy EI workflow roles.

## 5. Special Education State-Level Repair
- Prove safeguards, complaint, mediation, due-process, and IEP parent-rights pages at the state level.
- Federal IDEA references support content but do not replace state-specific dispute pages.

## 6. District / County Education Repair
- Use direct district-owned pages, reviewed Google Sites, or document evidence with preserved text proof.
- ESC, AskTED, or statewide directory fallback may keep a state operationally useful but cannot create county PASS by themselves.

## 7. VR / Pre-ETS Repair
- Prove state vocational rehabilitation and Pre-ETS entry pages separately from general transition content.

## 8. P&A / PTI / Legal / ABLE Repair
- Use first-party organization pages only.
- State bar directories, generic legal-help aggregators, and general parent hubs stay out of the PASS path.

## 9. Residual Manual Exact-Target Repair
- Use for small-county or district residual failures after sitemap/domain discovery is exhausted.
- Keep exact failure reasons visible (`manual_target_exhausted`, `district_homepage_broken`, etc.).

## 10. Spot-Audit Pass
- Re-open a sample of repaired rows and confirm the evidence snippet still supports the role.
- Update lessons learned only when the audit changes a reusable rule.

