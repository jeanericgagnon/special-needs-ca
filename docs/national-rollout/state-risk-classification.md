# State Rollout Risk Classification

To ensure safety and data integrity, each remaining state is classified by upgrade risk and complexity.

---

## 1. Risk Matrix

| Risk Classification | Counties | Ingestion Mode | Key Actions |
| :--- | :---: | :---: | :--- |
| **LOW COMPLEXITY** | < 20 | Single-State Full | Direct research and promote. |
| **MEDIUM COMPLEXITY** | 20 - 80 | Research Batch / Promo Serial | Ingest in batches; promote state-by-state. |
| **HIGH COMPLEXITY** | > 80 | Single-State Serial | High manual audit burden; single-state serialization only. |

---

## 2. Low Complexity / Ready for Upgrade (Completions & Remaining)
All low-complexity Wave 1 states are now upgraded to **PILOT-READY PARTIAL**.

---

## 3. Medium Complexity / Research-First (19 States remaining)
*   **New Jersey** (21 counties)
*   **Wyoming** (23 counties)
*   **Maryland** (24 counties)
*   **Utah** (29 counties)
*   **New Mexico** (33 counties)
*   **Oregon** (36 counties)
*   **Washington** (39 counties)
*   **Idaho** (44 counties)
*   **South Carolina** (46 counties)
*   **North Dakota** (53 counties)
*   **West Virginia** (55 counties)
*   **Montana** (56 counties)
*   **Colorado** (64 counties)
*   **Louisiana** (64 counties)
*   **South Dakota** (66 counties)
*   **Alabama** (67 counties)
*   **Wisconsin** (72 counties)
*   **Arkansas** (75 counties)
*   **Oklahoma** (77 counties)

**Strategy:** `SAFE_FOR_LIMITED_BATCH_RESEARCH_ONLY`.

---

## 4. High Complexity / High Risk (12 States remaining)
*   **Mississippi** (82 counties)
*   **Michigan** (83 counties)
*   **Minnesota** (87 counties)
*   **Indiana** (92 counties)
*   **Nebraska** (93 counties)
*   **Tennessee** (95 counties)
*   **Virginia** (95 counties)
*   **Iowa** (99 counties)
*   **North Carolina** (100 counties)
*   **Kansas** (105 counties)
*   **Missouri** (115 counties)
*   **Kentucky** (120 counties)

**Strategy:** `HIGH_RISK_SINGLE_STATE_ONLY`.
