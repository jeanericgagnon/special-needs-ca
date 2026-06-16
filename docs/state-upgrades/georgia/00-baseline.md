# Georgia State Baseline (GA)

This document establishes the baseline geographic, demographic, and database parameters for the Georgia state upgrade.

## 1. Geographic Definition
*   **Total Counties:** 159 counties (highest county count in the eastern US)
*   **Priority Metro Counties (11):** 
    *   `fulton-ga` (Atlanta)
    *   `gwinnett-ga` (Lawrenceville)
    *   `cobb-ga` (Marietta)
    *   `dekalb-ga` (Decatur)
    *   `clayton-ga` (Jonesboro)
    *   `cherokee-ga` (Canton)
    *   `forsyth-ga` (Cumming)
    *   `chatham-ga` (Savannah)
    *   `richmond-ga` (Augusta)
    *   `muscogee-ga` (Columbus)
    *   `clarke-ga` (Athens)

## 2. Baseline Readiness Metrics
*   **Readiness Score:** 14.9% (Source-backed pilot depth: 63.5%)
*   **Fallback Local Offices:** 148 / 159 (93% fallback)
*   **Fallback School Districts:** 148 / 159 (93% fallback)
*   **Verified Local Providers:** 0
*   **Existing State Resource Agencies:** 5 (DBHDD regional offices covering priority counties only)
*   **Existing Regional Education Service Agencies (RESAs):** 5 (covering priority counties only)

## 3. High-Risk Categories
*   **HHS/Medicaid County Offices:** Standard files mirrored 1:1 using fake Harrisburg addresses and duplicate statewide helplines.
*   **LIDDA/DD Routing:** Mirroring local county offices instead of using the 6 official DBHDD regions.
*   **Early Intervention:** Mirroring local counties instead of the 18 official Babies Can't Wait health districts.
*   **School Districts:** 148 districts populated with mock numbers `(800) 555-0199` and fictional websites.
*   **Nonprofits:** 488 records, including 159 duplicated local Arc records with mock number `(770) 555-0131`.
