# Canonical Current-State Ledger (V4)

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Database Status:** WAL Checkpointed & Synchronized  

---

## 1. 50-State Quality Metrics and Release Status

| State Name | Code | Status Label | Fallbacks | Mocks | Manual Reviews | MR Rate | Verified-Depth | Structural Cov | Source Trust | Sitemap | Eligibility | Forms |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Alabama** | AL | `safe_gated_placeholder` | 0 | 0 | 67 | 19.59% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Alaska** | AK | `safe_gated_placeholder` | 0 | 0 | 20 | 18.69% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Arizona** | AZ | `safe_gated_placeholder` | 0 | 0 | 15 | 18.29% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Arkansas** | AR | `safe_gated_placeholder` | 0 | 0 | 75 | 19.63% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **California** | CA | `LEGACY_EXCEPTION` | 40 | 0 | 657 | 70.65% | 14.0% | 100.0% | Medium | Exposed | Gated | 0 |
| **Colorado** | CO | `GATED_REVIEW_READY` | 0 | 0 | 64 | 19.51% | 30.0% | 100.0% | Medium | Blocked | Gated | 1 |
| **Connecticut** | CT | `safe_gated_placeholder` | 0 | 0 | 8 | 17.02% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Delaware** | DE | `safe_gated_placeholder` | 0 | 0 | 9 | 40.91% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Florida** | FL | `READY_FOR_ALLOWLIST` | 0 | 0 | 0 | 0.0% | 48.1% | 100.0% | High | Exposed | Eligible | 7 |
| **Georgia** | GA | `GATED_REVIEW_READY` | 0 | 0 | 1 | 0.15% | 52.6% | 100.0% | Medium | Blocked | Gated | 1 |
| **Hawaii** | HI | `safe_gated_placeholder` | 0 | 0 | 5 | 15.62% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Idaho** | ID | `safe_gated_placeholder` | 0 | 0 | 44 | 19.38% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Illinois** | IL | `GATED_REVIEW_READY` | 0 | 89 | 1 | 0.38% | 37.6% | 100.0% | Medium | Blocked | Gated | 5 |
| **Indiana** | IN | `safe_gated_placeholder` | 0 | 0 | 92 | 19.7% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Iowa** | IA | `safe_gated_placeholder` | 0 | 0 | 99 | 19.72% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Kansas** | KS | `safe_gated_placeholder` | 0 | 0 | 105 | 19.74% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Kentucky** | KY | `safe_gated_placeholder` | 0 | 0 | 126 | 20.76% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Louisiana** | LA | `safe_gated_placeholder` | 0 | 0 | 64 | 19.57% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Maine** | ME | `safe_gated_placeholder` | 0 | 0 | 16 | 18.39% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Maryland** | MD | `safe_gated_placeholder` | 0 | 0 | 24 | 18.9% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Massachusetts** | MA | `safe_gated_placeholder` | 0 | 0 | 14 | 18.18% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Michigan** | MI | `safe_gated_placeholder` | 0 | 0 | 0 | 0.0% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Minnesota** | MN | `safe_gated_placeholder` | 0 | 0 | 93 | 21.04% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Mississippi** | MS | `safe_gated_placeholder` | 0 | 0 | 82 | 19.66% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Missouri** | MO | `safe_gated_placeholder` | 0 | 0 | 115 | 19.76% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Montana** | MT | `safe_gated_placeholder` | 0 | 0 | 56 | 19.51% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Nebraska** | NE | `safe_gated_placeholder` | 0 | 0 | 99 | 20.97% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Nevada** | NV | `safe_gated_placeholder` | 0 | 0 | 17 | 18.48% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **New Hampshire** | NH | `safe_gated_placeholder` | 0 | 0 | 16 | 28.07% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **New Jersey** | NJ | `safe_gated_placeholder` | 0 | 0 | 0 | 0.0% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **New Mexico** | NM | `safe_gated_placeholder` | 0 | 0 | 33 | 19.19% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **New York** | NY | `GATED_REVIEW_READY` | 0 | 50 | 0 | 0.0% | 38.3% | 100.0% | Medium | Blocked | Gated | 0 |
| **North Carolina** | NC | `safe_gated_placeholder` | 0 | 0 | 0 | 0.0% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **North Dakota** | ND | `safe_gated_placeholder` | 0 | 0 | 53 | 19.49% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Ohio** | OH | `GATED_REVIEW_READY` | 0 | 7 | 1 | 0.3% | 45.7% | 100.0% | Medium | Blocked | Gated | 0 |
| **Oklahoma** | OK | `safe_gated_placeholder` | 0 | 0 | 77 | 19.64% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Oregon** | OR | `safe_gated_placeholder` | 0 | 0 | 36 | 19.25% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Pennsylvania** | PA | `READY_FOR_ALLOWLIST` | 0 | 0 | 29 | 14.72% | 22.6% | 100.0% | High | Exposed | Eligible | 7 |
| **Rhode Island** | RI | `safe_gated_placeholder` | 0 | 0 | 5 | 15.62% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **South Carolina** | SC | `safe_gated_placeholder` | 0 | 0 | 46 | 19.41% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **South Dakota** | SD | `safe_gated_placeholder` | 0 | 0 | 66 | 19.58% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Tennessee** | TN | `safe_gated_placeholder` | 0 | 0 | 95 | 19.71% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Texas** | TX | `READY_FOR_ALLOWLIST` | 0 | 0 | 0 | 0.0% | 39.0% | 100.0% | High | Exposed | Eligible | 5 |
| **Utah** | UT | `safe_gated_placeholder` | 0 | 0 | 29 | 19.08% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Vermont** | VT | `safe_gated_placeholder` | 0 | 0 | 14 | 18.18% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Virginia** | VA | `safe_gated_placeholder` | 0 | 0 | 95 | 19.71% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Washington** | WA | `safe_gated_placeholder` | 0 | 0 | 39 | 19.31% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **West Virginia** | WV | `safe_gated_placeholder` | 0 | 0 | 55 | 19.5% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Wisconsin** | WI | `safe_gated_placeholder` | 0 | 0 | 72 | 19.62% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Wyoming** | WY | `safe_gated_placeholder` | 0 | 0 | 23 | 18.85% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
