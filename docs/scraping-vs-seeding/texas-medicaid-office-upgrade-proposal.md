# Upgrade Proposal: Texas Medicaid Office Data Ingestion

This proposal outlines the upgrade path to replace 239 programmatic fallback records for Texas Medicaid/HHS local offices with real, source-listed records.

## 1. Executive Summary

Texas currently relies on **programmatic fallbacks** for the vast majority of its county-level Medicaid and HHS enrollment office records. This proposal details the ingestion of scraped local office details from the Texas Health and Human Services Commission (HHSC) to bring all 254 counties to 100% source-backed depth.

*   **Current State:** 15 curated regional offices, 239 programmatic fallbacks (unverified placeholders).
*   **Proposed State:** 15 curated regional offices, 239 scraped local offices, 0 programmatic fallbacks.
*   **Target Staging Table:** `staging_scraped_county_offices`
*   **Target Production Table:** `county_offices`
*   **Verification Method:** Cross-referenced county seat mapping.
*   **Expected Score Lift:** +11.7% increase to the Texas CA-Equivalence Depth score.

---

## 2. Ingestion Analysis

### Data Comparison

| Dimension | Current Fallback Records | New Scraped Records |
| :--- | :--- | :--- |
| **Record Count** | 239 fallbacks (total 254) | 239 scraped (total 254) |
| **Office Name** | `Texas Health & Human Services Commission (HHSC)` | `Texas Health & Human Services - [City] Office` |
| **Address** | `Texas routes this through the state HHSC benefits...` | `[Street Address], [City], TX [Zip]` (real/localized) |
| **Phone** | `(877) 541-7905` (generic state hotline) | Unique local office telephone (e.g., `(903) 729-2223`) |
| **Website** | `https://hhs.texas.gov/about-hhs/find-us` | Local office locator landing page |
| **Data Origin** | `programmatic_fallback` | `official_locator_derived` |
| **Verification** | `generated_county_fallback` | `source_listed` |
| **Confidence Score**| `0.30` | `0.95` (high confidence official source) |

### Sample Records Transformation

```diff
- ID: off-anderson-tx-tx-mdcp
- Office Name: Texas Health & Human Services Commission (HHSC)
- Address: Texas routes this through the state HHSC benefits system and office locator.
- Phone: (877) 541-7905
- Data Origin: programmatic_fallback
- Verification Status: generated_county_fallback

+ ID: tx-anderson-tx-texas-health-human-services-palestine-office
+ Office Name: Texas Health & Human Services - Palestine Office
+ Address: 1000 N Loop 256, Palestine, TX 75801
+ Phone: (903) 767-6539
+ Data Origin: official_locator_derived
+ Verification Status: source_listed
```

---

## 3. Impact Assessment & Hard Caps

### CA-Equivalence Score Lift

The `medicaidOffices` category accounts for **12%** of the final CA-equivalence depth score.
*   **Before Category Score:** **2.3%** (Depth: 6%, Dens: 6%, Fallback Penalty: 0.06)
*   **After Category Score:** **100.0%** (Depth: 100%, Dens: 100%, Fallback Penalty: 1.00)
*   **Net Score Impact:** `+11.7%` to the final Texas CA-Equivalence score.

### Hard Cap Impact

*   **Medicaid/HHS Local Depth Hard Cap:** Currently **Triggered** (limiting the overall Texas score to a max of **85.0%** because local Medicaid office depth was below 25%).
*   **After Upgrade:** **Resolved** (Medicaid Local Depth rises to 100%, resolving the cap).
*   *Note: The Education Local Depth hard cap (<35%) remains triggered at 5.5% until school districts are upgraded in a future run.*

---

## 4. Verification & Promotion Strategy

Promotion will be automated via `src/db/promote_scraped_state_records.js` under the following safety rules:
1.  **Duplicate Deletion:** The 239 existing fallback records will be deleted from `county_offices`.
2.  **Curated Protection:** The 15 existing curated seed offices will be preserved and not overwritten (staged matches are marked as `rejected_duplicate`).
3.  **Strict Audit Log:** All removals and additions will be written to `staging_promotion_audit` with full before/after JSON strings.
4.  **No Auto-Verification:** Promoted records will be set to `verification_status = 'source_listed'` and will not be marked as `human_verified` automatically.
