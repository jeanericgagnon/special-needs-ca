# New York Gap Analysis

Audit of current database records against authoritative New York truth maps.

## 1. Benefits / HHS Routing (Medicaid)
- **Current State:** 12 curated counties have valid offices. 50 counties have fallback offices.
- **Target State:** 50 fallbacks replaced with verified LDSS county contacts.

## 2. DD / IDD / OPWDD Routing
- **Current State:** 12 counties served by 7 regional offices. 50 counties lack OPWDD Front Door/DDRO mapping.
- **Target State:** All 62 counties mapped to their respective DDRO office via `regional_center_counties`.

## 3. Early Intervention / Part C
- **Current State:** 12 counties have curated local EIP contacts. 50 counties lack EIP contacts.
- **Target State:** All 62 counties have local county/municipal EIP offices in `state_resource_agencies` mapped via `regional_center_counties`.

## 4. Education / Regional Structures
- **Current State:** Only 7 regional education records in DB.
- **Target State:** 37 BOCES entries created and service areas mapped.

## 5. School Districts
- **Current State:** 12 districts verified. 50 districts have fallback records.
- **Target State:** 50 fallbacks replaced with verified special education contacts, re-keying fallback IDs.

## 6. Clinics, Nonprofits & Forms
- **Target State:** CARD-equivalent clinics added, Parent-to-Parent/DRNY chapters verified, and PDF forms mapped to semantic tables.
