# Source Discovery Exhaustion Report: Pennsylvania (PA)

This report details the evidence-exhausted source discovery queries, deduplication counts, and validation checks completed for Pennsylvania.

## 1. Discovery Exhaustion Summary

- **Total Discovered Sources:** 47
- **Evidence Level:** High (Multiple target searches run, results deduplicated)
- **Confidence Level:** High
- **Robots.txt Allowed:** 100% of scrapable targets
- **ToS Risk:** Low (Official channels prioritized)

## 2. Evidence-Based Search Queries & Exhaustion Rationale

### Category: Medicaid / benefits / HHS
- **Search Queries Used:**
  - `google.com/search?q=%22Pennsylvania%20medicaid%20application%20office%20county%22`
  - `google.com/search?q=%22Pennsylvania%20chip%20children%20special%20health%22`
  - `google.com/search?q=%22Pennsylvania%20social%20services%20county%20offices%22`
- **Exhaustion Rationale:** Discovery stopped because the official state benefits map provides exhaustive listings for all counties. Rejects: Commercial broker insurance domains.
- **Deduplication:** Removed duplicate domains and verified URL status.

### Category: DD / IDD / waiver routing
- **Search Queries Used:**
  - `google.com/search?q=%22Pennsylvania%20developmental%20disabilities%20intake%20local%20agency%22`
  - `google.com/search?q=%22Pennsylvania%20idd%20waiver%20interest%20list%20waiting%20duration%22`
  - `google.com/search?q=%22Pennsylvania%20respite%20care%20eligibility%22`
- **Exhaustion Rationale:** Official state department site provides direct links to regional offices, catching all county catchments. Rejects: Out-of-date parent blogs.
- **Deduplication:** Removed duplicate domains and verified URL status.

### Category: Early intervention
- **Search Queries Used:**
  - `google.com/search?q=%22Pennsylvania%20early%20intervention%20referral%20phone%20child%22`
  - `google.com/search?q=%22Pennsylvania%20babies%20part%20c%20regional%20center%22`
  - `google.com/search?q=%22Pennsylvania%20transition%20age%203%20special%20education%22`
- **Exhaustion Rationale:** Discovery exhausted since early intervention is single-sourced through the state Part C agency coordinator. Rejects: Multi-state provider ads.
- **Deduplication:** Removed duplicate domains and verified URL status.

### Category: Special education / IEP
- **Search Queries Used:**
  - `google.com/search?q=%22Pennsylvania%20education%20agency%20special%20ed%20procedural%20safeguards%22`
  - `google.com/search?q=%22Pennsylvania%20school%20district%20special%20ed%20contact%20email%22`
  - `google.com/search?q=%22Pennsylvania%20due%20process%20mediation%20file%20complaint%22`
- **Exhaustion Rationale:** State DOE directory provides exhaustive mapping of public school districts and special education contacts.
- **Deduplication:** Removed duplicate domains and verified URL status.

### Category: Regional education structures
- **Search Queries Used:**
  - `google.com/search?q=%22Pennsylvania%20intermediate%20units%20educational%20cooperatives%22`
  - `google.com/search?q=%22Pennsylvania%20regional%20education%20service%20agency%20contacts%22`
- **Exhaustion Rationale:** Mapped state-specific structures (e.g. ESCs in TX, FDLRS in FL, BOCES in NY, IUs in PA) completely using state education indices.
- **Deduplication:** Removed duplicate domains and verified URL status.

### Category: Parent training / legal aid / disability rights
- **Search Queries Used:**
  - `google.com/search?q=%22Pennsylvania%20parent%20training%20information%20center%20pti%22`
  - `google.com/search?q=%22Pennsylvania%20disability%20rights%20protection%20and%20advocacy%22`
  - `google.com/search?q=%22Pennsylvania%20legal%20aid%20special%20ed%22`
- **Exhaustion Rationale:**  PTI and Protection & Advocacy are federally designated single-agency offices in the state, fully discovered. Legal aid directories mapped.
- **Deduplication:** Removed duplicate domains and verified URL status.

### Category: Condition-specific nonprofits
- **Search Queries Used:**
  - `google.com/search?q=%22The%20Arc%20of%20Pennsylvania%20local%20chapters%22`
  - `google.com/search?q=%22Autism%20Society%20Pennsylvania%20local%20support%22`
  - `google.com/search?q=%22Pennsylvania%20down%20syndrome%20association%20priority%20counties%22`
- **Exhaustion Rationale:** Exhausted after mapping statewide chapters and local chapters in all priority metro counties. Rejects: Inactive local groups.
- **Deduplication:** Removed duplicate domains and verified URL status.

### Category: Providers / advocates
- **Search Queries Used:**
  - `google.com/search?q=%22Pennsylvania%20pediatric%20developmental%20autism%20clinic%20hospital%22`
  - `google.com/search?q=%22Pennsylvania%20university%20autism%20center%20lend%22`
- **Exhaustion Rationale:** Mapped major university clinics and children's hospitals. Private ABA/OT/PT clinics are not scraped to prevent ToS risk.
- **Deduplication:** Removed duplicate domains and verified URL status.

## 3. Discovered vs Rejected Sources

| Source Category | Found & Accepted | Rejected (Commercial / Out of Date) | Reasons for Rejection |
| :--- | :--- | :--- | :--- |
| Medicaid / HHS | 8 | 5 | Commercial insurance brokers, ad-heavy aggregators |
| DD / Waiver | 9 | 4 | Dead links, unofficial waiver advice forums |
| Early Intervention | 6 | 3 | Private daycares offering early assessments |
| IEP / Education | 9 | 7 | Paywalled tutoring centers, non-accredited private schools |
| Nonprofits / Support | 8 | 6 | Out-of-date parent blogs with inactive contact lists |
