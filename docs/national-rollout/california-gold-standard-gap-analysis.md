# California Gold Standard Gap Analysis

This document outlines the definition of the **California Gold Standard** for resource directory depth and compares the rest of the nation against it. It details the dimensions of quality, service-area modeling, category completeness, and answers the core questions regarding rollout candidates, blocked states, and California's own legacy exceptions.

---

## 1. Defining the California Gold Standard Dimensions

The California baseline represents a mature, hand-curated directory designed to give parents of children with special needs directly actionable local contacts. To achieve California-equivalent quality, a state must meet these requirements across five core dimensions:

### 1.1 Local Routing Depth
* **County benefits/HHS offices:** Every county must have a direct, localized link/address to the local social services office administering Medi-Cal (or equivalent state Medicaid).
* **DD/IDD intake/routing:** Regional center or localized DD waiver intake offices must be mapped directly to the counties they serve, avoiding generic state-level redirects.
* **Early Intervention / Part C routing:** County-level contacts for infant/toddler developmental intakes (e.g., California's Early Start intakes).
* **Regional education structures:** Mapped Intermediate Educational Units (like California SELPAs or New York BOCES) that manage regional special education funding.
* **School district special education contacts:** Direct phone numbers and email addresses of Special Education Directors for individual school districts, rather than generic superintendent contacts.

### 1.2 Record Quality
* **Verified Local Data:** Every contact card must contain a verified local phone number (no 555 mock numbers), a verified local physical address (no PO boxes or state capitals for local services), and a verified direct website.
* **Metadata Integrity:** Records must have `source_url` populated with the official government directory source, `evidence_level` set to credible levels (`official_site` or `curated`), and `data_origin` indicating `curated_seed` or `official` rather than fallback.
* **No Scoring Inflation:** Directory-only listings (e.g., standard nationwide registries) must not be counted as "verified local depth" unless they provide a specific local contact person and phone number. Records marked `manual_review_required` must have a score of 0 depth weight.

### 1.3 Service-Area Modeling
* **Catchment Boundaries:** Correctly distinguishing between:
  - **Physical County:** Where the office is physically located.
  - **Counties Served:** The actual list of counties the office has jurisdiction over.
  - **Statewide Service:** Resources that apply globally and do not need to be repeated on county pages.
  - **Regional Catchment:** Offices like DD intake that serve 3–4 specific counties.
* **No Clinic Over-Mapping:** Clinics or providers must not be mapped as "serving" counties 100 miles away unless they have a documented mobile unit or telehealth service area in that county.

### 1.4 Frontend Usefulness
* **Actionable Contacts:** A parent must be able to take action (e.g., call a direct phone number, email a director, download a form) directly from the page.
* **No Thin Repeated Boilerplate:** Avoid empty cards, repetitive lists of state-level links under local headings, and misleading "verified" badges on unverified records.
* **Clear Section Separation:** Dedicated cards for HHS, school districts, DD routing, and local advocates, rather than a single mixed directory list.

### 1.5 SEO Readiness
* **Uniqueness:** Each county page must have enough unique local text, tables, and resource counts to satisfy Google's Helpful Content System.
* **No Thin Page Indexing Risk:** Gated states with low content depth must remain `noindex` to avoid site-wide search rank penalties.
* **Internal Linking:** Strong localized cross-linking between county hubs, benefits hubs, and category pages.

---

## 2. Category Completeness Requirements

To be considered a COMPLETE state, the directory must contain verified local records for the following 12 categories:

1. **Benefits/HHS:** Local Medicaid enrollment and food/financial support offices.
2. **Medicaid:** Managed care plans and specialized pediatric waivers.
3. **DD/IDD Waivers:** Local offices administering HCBS waivers and intake.
4. **Early Intervention:** Infant/toddler Part C program entry contacts.
5. **School Districts:** Special education departments of local public school districts.
6. **Regional Education:** Intermediate educational service agencies (SELPAs, BOCES, COOPs).
7. **Institutional Clinics:** Children's hospitals, developmental clinics, and diagnostic centers.
8. **Trusted Nonprofits:** Local Arc chapters, parent training and information centers (PTIs), and condition-specific support groups.
9. **Forms and Appeals:** Direct links to PDF application packets and fair hearing appeal forms.
10. **Transition Resources:** Transition-to-adulthood planning toolkits and vocational rehab offices.
11. **ABLE/STABLE:** State-administered ABLE savings program links and guides.
12. **Legal & Advocacy:** Local special education attorneys, advocates, and legal aid groups.

---

## 3. Special Analysis of Key States

### 3.1 Why Texas, Florida, and Pennsylvania are Batch 1 Release Candidates
Despite their verified-depth scores sitting around **57–63%** under the new strict v2 calculator (and 75–79% in the standard corrector), these three states are our approved Batch 1 release candidates:
* **0 Mock Contacts:** They are completely clean of active mock contacts or 555 numbers.
* **0 Fallback Records:** They have 0 programmatic fallbacks (meaning every office and contact is source-backed).
* **0% Manual Review:** All records have been successfully verified (`source_listed` or higher) with actual working addresses and phone numbers.
* **High Actionability:** They contain extensive real directories. For instance, Texas has 2,129 nonprofits and 814 IEP advocates, and Florida has 235 nonprofits and 177 IEP advocates, all verified with physical locations and working websites.

They are allowlisted because they represent the highest quality of non-California data in the system and are safe for production indexing.

### 3.2 Why Georgia is Blocked
Georgia is set to **BLOCKED** because it suffers from a massive manual-review backlog:
* **93.1% Manual Review Rate:** Out of 159 county offices and 159 school districts, 148 of each are marked `manual_review_required`.
* **Broken Gating:** These records contain empty fields or state-level fallbacks that require human verification before they can be safely shown as local contacts.
* **Frontend Risk:** Unverified records render as empty cards or repeat generic state hotline numbers, creating a poor user experience.

### 3.3 Status of Illinois: Gated and Unreleasable
Illinois is closer to releasability than Georgia, but remains **gated**:
* **87.2% School District Block:** 89 out of 102 school districts are marked `manual_review_required`.
* **Clean HHS:** Fortunately, 102 out of 102 county offices are clean and verified (`source_listed`).
* **Recommendation:** Keep Illinois gated until a targeted script or crawler resolves the school district special education contacts.

### 3.4 New York and Ohio: Post-Scrub Action Items
New York and Ohio were downgraded from Complete to **PILOT-READY PARTIAL** following a mock contact scrub:
* **Ohio Gaps:** 166 out of 176 school districts are currently in `manual_review_required` after clearing scraped 555 numbers. Ohio also has **0 nonprofits** in the database.
* **New York Gaps:** 12 county offices and 50 school districts are in `manual_review_required`. New York also has **0 nonprofits** in the database.
* **Action Items:** Ohio and New York need targeted crawlers to ingest local special education contacts and seed nonprofit organizations before they can be re-evaluated for allowlisting.

### 3.5 California Legacy Exceptions
Even though California is the gold standard baseline, it still requires cleanup:
* **82 Mock Numbers:** 82 records still use programmatic mock contacts (e.g., template numbers).
* **119 Fallback Records:** 119 records use `programmatic_fallback` or `generated_county_fallback` (mostly in nonprofits and regional education).
* **Required Action:** Run a dedicated cleanup sprint to replace CA's mock numbers and fallbacks with verified local sources, bringing California to a true 100% clean gold standard.
