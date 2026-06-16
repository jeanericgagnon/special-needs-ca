# Scraping Upgrade Proposal: New York (NY)

This upgrade proposal maps out the transition from seeded/programmatic fallback records to live, scraper-derived official data for New York.

## 1. Current Placeholders and Fallbacks

We currently rely on **100** programmatic fallback placeholders across the state. Replacing these with verified listings is the primary goal of the scraping system.

| Category / Table | Current Fallback Count | Target Source URL | Expected Replacement Candidates | Expected Confidence |
| :--- | :--- | :--- | :--- | :--- |
| **Medicaid Offices** (`county_offices`) | 50 | Official state locator/directory | Scraped county offices | `0.90` (Official Domain) |
| **School Districts** (`school_districts`) | 50 | State DOE directory | Scraped special education contacts | `0.95` (State DOE) |
| **Nonprofits** (`nonprofit_organizations`) | 0 | N/A | Completed/Source-listed | N/A |

## 2. Upgrade Action Plan & Impact

- **Total Proposed Replacements:** 100 records
- **Expected CA-Equivalence Score Lift:** **+24.0%**
- **Critical Hard Caps Resolved:** Medicaid office depth hard cap (max 85%) will be removed.

## 3. Exact Records Proposed for Replacement (Sample)

All county-level placeholder records where `data_origin = 'programmatic_fallback'` or `data_origin = 'generated_county_fallback'` will be marked as deprecated and replaced in production. Examples:
- Replaces programmatic office: `newyork-medicaid-office-albany-county`
- Replaces programmatic district: `newyork-school-district-albany-county-fallback`

## 4. Promotion Confidence Rules
1. Official state listings from `.gov` domains are auto-promoted if confidence score is $\ge 0.85$.
2. Provider listings and private directories require manual review and will default to `scraped_unverified` until audited.
