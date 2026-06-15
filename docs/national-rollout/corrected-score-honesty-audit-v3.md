# Corrected Score Honesty Audit Report (V3)

**Audit Version:** 3.0  
**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Status:** IMPLEMENTED & AUDITED

---

## 1. Score Correction Summary

The scoring engine has been corrected to apply V3 honesty filters:
- **Skeleton/Placeholder states** are capped at `0.0%` verified depth.
- **Records with fake domains** contribute `0.0` to verified depth.
- **Empty phone/email/address** reduces record contribution by 50%.
- **Zero negative scores** generated.

### Gated States Verified Depth (Corrected):
- **Alabama (AL):** 0.0% depth (`safe_gated_placeholder`)
- **Alaska (AK):** 0.0% depth (`safe_gated_placeholder`)
- **Arizona (AZ):** 0.0% depth (`safe_gated_placeholder`)
- **Arkansas (AR):** 0.0% depth (`safe_gated_placeholder`)
- **Colorado (CO):** 10.3% depth (`GATED_REVIEW_READY`)
- **Connecticut (CT):** 0.0% depth (`safe_gated_placeholder`)
- **Delaware (DE):** 0.0% depth (`safe_gated_placeholder`)
- **Georgia (GA):** 33.4% depth (`GATED_REVIEW_READY`)
- **Hawaii (HI):** 0.0% depth (`safe_gated_placeholder`)
- **Idaho (ID):** 0.0% depth (`safe_gated_placeholder`)
- **Illinois (IL):** 37.6% depth (`GATED_REVIEW_READY`)
- **Indiana (IN):** 0.0% depth (`safe_gated_placeholder`)
- **Iowa (IA):** 0.0% depth (`safe_gated_placeholder`)
- **Kansas (KS):** 0.0% depth (`safe_gated_placeholder`)
- **Kentucky (KY):** 0.0% depth (`safe_gated_placeholder`)
- **Louisiana (LA):** 0.0% depth (`safe_gated_placeholder`)
- **Maine (ME):** 0.0% depth (`safe_gated_placeholder`)
- **Maryland (MD):** 0.0% depth (`safe_gated_placeholder`)
- **Massachusetts (MA):** 0.0% depth (`safe_gated_placeholder`)
- **Michigan (MI):** 0.0% depth (`safe_gated_placeholder`)
- **Minnesota (MN):** 0.0% depth (`safe_gated_placeholder`)
- **Mississippi (MS):** 0.0% depth (`safe_gated_placeholder`)
- **Missouri (MO):** 0.0% depth (`safe_gated_placeholder`)
- **Montana (MT):** 0.0% depth (`safe_gated_placeholder`)
- **Nebraska (NE):** 0.0% depth (`safe_gated_placeholder`)
- **Nevada (NV):** 0.0% depth (`safe_gated_placeholder`)
- **New Hampshire (NH):** 0.0% depth (`safe_gated_placeholder`)
- **New Jersey (NJ):** 0.0% depth (`safe_gated_placeholder`)
- **New Mexico (NM):** 0.0% depth (`safe_gated_placeholder`)
- **New York (NY):** 38.3% depth (`GATED_REVIEW_READY`)
- **North Carolina (NC):** 0.0% depth (`safe_gated_placeholder`)
- **North Dakota (ND):** 0.0% depth (`safe_gated_placeholder`)
- **Ohio (OH):** 20.8% depth (`GATED_REVIEW_READY`)
- **Oklahoma (OK):** 0.0% depth (`safe_gated_placeholder`)
- **Oregon (OR):** 0.0% depth (`safe_gated_placeholder`)
- **Rhode Island (RI):** 0.0% depth (`safe_gated_placeholder`)
- **South Carolina (SC):** 0.0% depth (`safe_gated_placeholder`)
- **South Dakota (SD):** 0.0% depth (`safe_gated_placeholder`)
- **Tennessee (TN):** 0.0% depth (`safe_gated_placeholder`)
- **Utah (UT):** 0.0% depth (`safe_gated_placeholder`)
- **Vermont (VT):** 0.0% depth (`safe_gated_placeholder`)
- **Virginia (VA):** 0.0% depth (`safe_gated_placeholder`)
- **Washington (WA):** 0.0% depth (`safe_gated_placeholder`)
- **West Virginia (WV):** 0.0% depth (`safe_gated_placeholder`)
- **Wisconsin (WI):** 0.0% depth (`safe_gated_placeholder`)
- **Wyoming (WY):** 0.0% depth (`safe_gated_placeholder`)
