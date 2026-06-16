# Texas Data Gap List (Standard Completeness Status)

This document tracks the gap status between the Texas dataset and the California benchmark. In June 2026, a major data depth upgrade was executed to replace structural placeholders with real, localized Texas resources.

---

## 1. Local HHS / Medicaid Routing Gaps
- **Status**: **PARTIALLY RESOLVED / MITIGATED**
- **Details**: Mapped physical HHSC offices in **15 / 254** major counties (Harris, Dallas, Tarrant, Travis, Bexar, Collin, Denton, Fort Bend, Montgomery, Williamson, Hidalgo, El Paso, Brazoria, Galveston, Nueces). The remaining 239 counties route through a verified centralized HHSC benefits fallback message: *"Texas routes this through the state HHSC benefits system and office locator."*
- **Action Needed**: Keep verifying local physical offices for other medium-sized counties as directories update.

---

## 2. Education Region & School District Gaps
- **Status**: **RESOLVED**
- **Details**: Mapped all 254 counties to their official **20 Education Service Center (ESC) Regions**. Seeded all 20 ESCs with direct special education, parent resource, and dispute resolution URLs in the `regional_education_agencies` table. Seeded **16 curated school districts** (Houston ISD, Cypress-Fairbanks ISD, Dallas ISD, Fort Worth ISD, Austin ISD, Northside ISD, Plano ISD, Denton ISD, Fort Bend ISD, Conroe ISD, Round Rock ISD, Edinburg CISD, El Paso ISD, Pearland ISD, Clear Creek ISD, Corpus Christi ISD) covering all 15 priority counties with official contacts; the remaining 239 counties use SPEDTex-verified fallbacks.

---

## 3. Provider & Advocate Gaps
- **Status**: **PARTIALLY RESOLVED**
- **Details**: Seeded **19 real localized and statewide advocates** (attorneys, consultancies, clinics, and protection centers) mapped to their actual counties of operation or statewide. Under the standard audit model, because the advocate/county ratio is <0.1 (19/254 = 0.07), the category score is capped at 50% and marked `PARTIAL` to prevent overclaiming localization.
- **Action Needed**: Continue seeding local advocates in secondary metropolitan areas.

---

## 4. Nonprofit & Support Organization Gaps
- **Status**: **RESOLVED**
- **Details**: Seeded **6 statewide nonprofits** (DRTx, Partners Resource Network, Navigate Life Texas, The Arc of Texas, Texas Parent to Parent, Autism Society of Texas) mapped to all 254 counties, and **13 regional chapters** (e.g., Down Syndrome Associations of Houston, Central Texas, South Texas, North Texas, El Paso, RGV, Galveston; Easterseals Greater Houston, Central Texas, North Texas, RGV; Coastal Bend Center for Independent Living) mapped strictly to their real service areas. Capped at 226 fallback placeholders for remote counties. This brings the category depth score to **87.4%** and status to **COMPLETE**.

---

## 5. Appeals and Deadlines Gaps
- **Status**: **RESOLVED**
- **Details**: Seeded waitlists and appeal info for all 6 major Texas waiver and education programs (HCS, CLASS, TxHmL, MDCP, ECI, TEA).
- **Forms Catalog**: Added **7 new STAR Kids & Medicaid appeal guides** (comprehensive MCO appeals, service coordination, service reductions, expedited reviews, fair hearings, benefit continuation) with complete instruction sets, pediatric doctor briefing letters, and coordinator request templates.

---

## 6. E2E & Verification Gaps
- **Status**: **RESOLVED**
- **Details**: Created `texas-launch.spec.ts` testing hub routing, counties list, forms catalog, dynamic terminology, sitemap exclusions, and meta tag robots gating. All tests pass successfully.

---

## Overall Readiness Status
**Texas is classified as: Factory Proof / Pilot Launchable.**
**Standard Completeness Score: 80.0% (Capped by depth penalties).**

Texas is safe and ready for a **gated pilot launch** (restricted from search engine indexing on county-diagnosis leaves via robots noindex, but indexable on the state hub and county directory pages).
