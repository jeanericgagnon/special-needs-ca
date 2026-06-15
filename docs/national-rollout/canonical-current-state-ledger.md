# Canonical Current-State Ledger (V4)

> [!WARNING]
> SUPERSEDED — DO NOT USE FOR EXECUTION. This document contains deprecated/stale directives, county/state bounds, or metrics, and is superseded by the Zero-Churn Authoritative Truth Ledger.


**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Database Status:** WAL Checkpointed & Synchronized  

---

## 1. 50-State Quality Metrics and Release Status

| State Name | Code | Status Label | Fallbacks | Mocks | Manual Reviews | MR Rate | Verified-Depth | Structural Cov | Source Trust | Sitemap | Eligibility | Forms |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Alabama** | AL | `safe_gated_placeholder` | 0 | 0 | 201 | 58.77% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Alaska** | AK | `safe_gated_placeholder` | 0 | 0 | 60 | 56.07% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Arizona** | AZ | `safe_gated_placeholder` | 0 | 0 | 45 | 54.88% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Arkansas** | AR | `safe_gated_placeholder` | 0 | 0 | 225 | 58.9% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **California** | CA | `LEGACY_EXCEPTION` | 40 | 0 | 657 | 70.65% | 14.0% | 100.0% | Medium | Exposed | Gated | 0 |
| **Colorado** | CO | `GATED_REVIEW_READY` | 0 | 0 | 193 | 58.84% | 10.3% | 100.0% | Medium | Blocked | Gated | 1 |
| **Connecticut** | CT | `safe_gated_placeholder` | 0 | 0 | 24 | 51.06% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Delaware** | DE | `safe_gated_placeholder` | 0 | 0 | 15 | 68.18% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Florida** | FL | `READY_FOR_ALLOWLIST` | 0 | 0 | 88 | 20.9% | 31.8% | 100.0% | High | Exposed | Eligible | 7 |
| **Georgia** | GA | `GATED_REVIEW_READY` | 0 | 0 | 265 | 38.69% | 33.4% | 100.0% | Medium | Blocked | Gated | 1 |
| **Hawaii** | HI | `safe_gated_placeholder` | 0 | 0 | 15 | 46.88% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Idaho** | ID | `safe_gated_placeholder` | 0 | 0 | 132 | 58.15% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Illinois** | IL | `GATED_REVIEW_READY` | 0 | 89 | 1 | 0.38% | 37.6% | 100.0% | Medium | Blocked | Gated | 5 |
| **Indiana** | IN | `safe_gated_placeholder` | 0 | 0 | 276 | 59.1% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Iowa** | IA | `safe_gated_placeholder` | 0 | 0 | 297 | 59.16% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Kansas** | KS | `safe_gated_placeholder` | 0 | 0 | 315 | 59.21% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Kentucky** | KY | `safe_gated_placeholder` | 0 | 0 | 360 | 59.31% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Louisiana** | LA | `safe_gated_placeholder` | 0 | 0 | 192 | 58.72% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Maine** | ME | `safe_gated_placeholder` | 0 | 0 | 48 | 55.17% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Maryland** | MD | `safe_gated_placeholder` | 0 | 0 | 72 | 56.69% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Massachusetts** | MA | `safe_gated_placeholder` | 0 | 0 | 42 | 54.55% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Michigan** | MI | `safe_gated_placeholder` | 0 | 0 | 151 | 35.78% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Minnesota** | MN | `safe_gated_placeholder` | 0 | 0 | 261 | 59.05% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Mississippi** | MS | `safe_gated_placeholder` | 0 | 0 | 246 | 58.99% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Missouri** | MO | `safe_gated_placeholder` | 0 | 0 | 345 | 59.28% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Montana** | MT | `safe_gated_placeholder` | 0 | 0 | 168 | 58.54% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Nebraska** | NE | `safe_gated_placeholder` | 0 | 0 | 285 | 60.38% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Nevada** | NV | `safe_gated_placeholder` | 0 | 0 | 51 | 55.43% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **New Hampshire** | NH | `safe_gated_placeholder` | 0 | 0 | 36 | 63.16% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **New Jersey** | NJ | `safe_gated_placeholder` | 0 | 0 | 21 | 18.75% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **New Mexico** | NM | `safe_gated_placeholder` | 0 | 0 | 99 | 57.56% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **New York** | NY | `GATED_REVIEW_READY` | 0 | 50 | 0 | 0.0% | 38.3% | 100.0% | Medium | Blocked | Gated | 0 |
| **North Carolina** | NC | `safe_gated_placeholder` | 0 | 0 | 186 | 36.69% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **North Dakota** | ND | `safe_gated_placeholder` | 0 | 0 | 159 | 58.46% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Ohio** | OH | `GATED_REVIEW_READY` | 0 | 7 | 167 | 50.0% | 20.8% | 100.0% | Medium | Blocked | Gated | 0 |
| **Oklahoma** | OK | `safe_gated_placeholder` | 0 | 0 | 231 | 58.93% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Oregon** | OR | `safe_gated_placeholder` | 0 | 0 | 108 | 57.75% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Pennsylvania** | PA | `READY_FOR_ALLOWLIST` | 0 | 0 | 112 | 56.85% | 18.5% | 100.0% | High | Exposed | Eligible | 7 |
| **Rhode Island** | RI | `safe_gated_placeholder` | 0 | 0 | 15 | 46.88% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **South Carolina** | SC | `safe_gated_placeholder` | 0 | 0 | 138 | 58.23% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **South Dakota** | SD | `safe_gated_placeholder` | 0 | 0 | 198 | 58.75% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Tennessee** | TN | `safe_gated_placeholder` | 0 | 0 | 285 | 59.13% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Texas** | TX | `READY_FOR_ALLOWLIST` | 0 | 0 | 757 | 28.18% | 25.2% | 100.0% | High | Exposed | Eligible | 5 |
| **Utah** | UT | `safe_gated_placeholder` | 0 | 0 | 87 | 57.24% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Vermont** | VT | `safe_gated_placeholder` | 0 | 0 | 42 | 54.55% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Virginia** | VA | `safe_gated_placeholder` | 0 | 0 | 285 | 59.13% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Washington** | WA | `safe_gated_placeholder` | 0 | 0 | 117 | 57.92% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **West Virginia** | WV | `safe_gated_placeholder` | 0 | 0 | 165 | 58.51% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Wisconsin** | WI | `safe_gated_placeholder` | 0 | 0 | 216 | 58.86% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
| **Wyoming** | WY | `safe_gated_placeholder` | 0 | 0 | 25 | 20.49% | 0.0% | 100.0% | Low | Blocked | Gated | 1 |
