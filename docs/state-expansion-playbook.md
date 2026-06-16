# Playbook: Repeatable State Expansion (Exhaustive Standard)

This document serves as the official playbook for adding new states to the Special Needs Disability Navigator. It outlines the requirements, schemas, trust rules, and checklist gates that ensure any new state achieves California-equivalent data depth and safety before public launch.

---

## A. State Expansion Workflow

Expanding to a new state (e.g. Florida, New York) follows a strict sequence of stages to prevent the generation of low-quality pages and California-specific terminology leaks.

1. **State Configuration**: Create/update state configuration in `stateConfigs.ts` inside `stateConfigs`. Define local terminology (`localAgencyType`, `educationAgencyLabel`, `earlyInterventionLabel`), timelines (`timelineDaysPlan`, `timelineDaysMeeting`, `timelinesCode`), and register `corePrograms` and `requiredForms`.
2. **Identify Local Disability Routing Equivalent**: Determine which local agency maps to the California Regional Center model. E.g., Texas has LIDDAs, Florida has APD Regional Offices, New York has OPWDD Front Door. Set up the mapping in the `state_resource_agencies` and `regional_center_counties` tables.
3. **Collect Official Agency Sources**: Harvest official links, eligibility rules, and forms from the state's Health & Human Services, Developmental Disabilities, and Education departments.
4. **Seed Counties**: Map all state counties into the `counties` table using the `<county-slug>-<state-code>` format (e.g. `travis-tx`, `miami-dade-fl`).
5. **Seed Local Agency Mappings**: Map each county to its respective local routing agency (catchment) in `regional_center_counties`.
6. **Seed Medicaid / DD / Waiver Programs**: Insert program entries into the `programs` table. Ensure they have official URLs, description fields, and target demographics.
7. **Seed Education / IEP Resources**: Add the state's regional education agencies (e.g. Texas ESCs, Florida FDLRS, New York BOCES) to the `regional_education_agencies` and map them in `selpa_counties`.
8. **Seed Forms & Guides**: Add full metadata entries for all required forms in `requiredForms` to `SEO_CLUSTERS` inside `seo-data.ts`. Include templates, download links, and instruction guides.
9. **Seed Nonprofits & Support Orgs**: Seed localized parent training resources and respite support groups.
10. **Seed Providers & Advocates**: Seed special education attorneys and parent advocates with appropriate trust labels.
11. **Trust Metadata & Freshness**: Log all sources in the `sources` table and verify records in the `source_verifications` table.
12. **Run Audits**: Run `npm run audit:state-standard -- [state]`. Verify the score is in the target launch range (85%+ for pilot launch, 90%+ for public).
13. **Sitemap Gating & SEO Review**: Configure sitemap gates to restrict page exposure.
14. **Add E2E Smoke Tests**: Write and run Playwright tests for the state.

---

## B. State Data Collection Checklist

For each new state, you must locate and document the following items:

- **Medicaid Agency**: Official name, application portal, and local county intake offices.
- **Developmental Disability Agency**: Agency in charge of intellectual and developmental disabilities (IDD).
- **Local Intake/Routing Agencies**: Catchment agencies (e.g., LIDDAs, OPWDD Front Door).
- **HCBS Waivers**: Medicaid Home & Community-Based Services waiver list, eligibility, and waitlists.
- **Early Intervention Program**: State early childhood intervention (ages 0-3) program name and contact.
- **Special Education Agency**: State Department of Education (e.g., TEA, FLDOE, NYSED) and special education rules.
- **Complaint/Due Process**: State complaint, mediation, and due process instructions.
- **Parent Training Center**: The federally mandated Parent Training and Information (PTI) center.
- **ABLE Program**: State-specific ABLE savings plan.
- **Children's Medical/Special Health Services**: Medical therapy or Title V specialized healthcare program.
- **Paid Caregiver / Personal Care Programs**: State paid caregiver/IHSS equivalent (e.g. STAR Kids / MDCP CDS).
- **County/Local Offices**: Physical address, phone number, and intake email for benefits routing.
- **School Districts or Regional Education Agencies**: Names, websites, and special education contacts.
- **Nonprofit/Support Organizations**: Local chapters of Arc, autism societies, and respite networks.
- **Forms and Official PDFs**: Direct download links for applications, intake packets, and complaints.
- **Appeal Deadlines**: Specific timelines for Medicaid hearings and special education complaints.
- **Waitlists / Interest Lists**: Length of wait, contact to check status, and mitigation tips.

---

## C. State Routing Adapter Guide

Special needs resources must route through the state-specific equivalent of California Regional Centers. Below is the mapping architecture for these routing adapters:

| State | Local Catchment Agency Equivalent | Primary Database Table | Junction Mapping Table |
| :--- | :--- | :--- | :--- |
| **California** | Regional Centers | `regional_centers` | `regional_center_counties` |
| **Texas** | LIDDAs (Local Intellectual & Developmental Disability Authorities) | `state_resource_agencies` | `regional_center_counties` |
| **Florida** | APD Regional Offices (Agency for Persons with Disabilities) | `state_resource_agencies` | `regional_center_counties` |
| **New York** | OPWDD DDROs / Front Door (Dev. Disabilities Regional Offices) | `state_resource_agencies` | `regional_center_counties` |
| **Pennsylvania**| County IDD Offices | `state_resource_agencies` | `regional_center_counties` |
| **Ohio** | County Boards of Developmental Disabilities | `state_resource_agencies` | `regional_center_counties` |
| **Colorado** | Community Centered Boards (CCBs) | `state_resource_agencies` | `regional_center_counties` |

### Required Fields for Routing Mappings
When inserting a catchment agency into `state_resource_agencies`, the following fields are required:
- `id`: Unique lowercase slug (e.g. `esc-region-4`, `west-texas-lidda`).
- `state_id`: Match state ID (e.g. `texas`, `florida`).
- `agency_type`: String matching `'developmental_services_agency'`, `'esc'`, `'boces'`, etc.
- `name`: Official full name of the agency.
- `counties_served`: Comma-separated list of county IDs.
- `catchment_boundaries`: Text description of the region covered.
- `website`: Official landing page URL.
- `intake_phone`: Main phone number for intake requests.
- `eligibility_info_page`: Direct page detailing eligibility guidelines.
- `services_page`: Direct page detailing services provided.
- `appeals_info`: Direct page detailing appeal guidelines.
- `source_url`: Official URL where this data was sourced.
- `last_verified_date`: Format `YYYY-MM-DD`.
- `verification_status`: Status matching trust label standards.

---

## D. Source / Trust Rules

To preserve absolute integrity and protect families from inaccurate information, every database record must carry a verified provenance label.

> [!CRITICAL]
> **No Overclaiming Verification**: Scraped or generated fallback records must NEVER be labeled `official_verified` or `human_verified`. They must be labeled honestly as `scraped_unverified` or `generated_county_fallback`.

### Trust Label Classifications

1. `official_verified`: Sourced directly from official agency documentation and verified by direct comparison.
2. `source_listed`: Sourced from a public repository, registry, or directory without individual manual validation.
3. `scraped_unverified`: Collected programmatically via web scraper. Requires review before manual verification.
4. `generated_county_fallback`: Created automatically as a regional placeholder (e.g. using statewide contact numbers) to ensure sitemaps and directories resolve without breaking, clearly marked to families as a fallback.
5. `community_submitted`: Submitted by a user. Unverified until moderated.
6. `human_verified`: Reviewed and verified manually by a team member.
7. `stale_needs_review`: Record has not been updated in over 12 months.

---

## E. Audit Workflow & Depth Penalties

Before promoting code or indexing new state directories, you must run the following test and quality suite. The standard completeness audit evaluates each category against both **Coverage** and **Depth**:

### 1. Score Calculation Rules
- **coverageScore**: Percentage of counties with at least one record in the category.
- **depthScore**: Percentage of records that are NOT generated fallbacks (i.e., `(total - fallback) / total * 100`).
- **Category Score**: The arithmetic average of `coverageScore` and `depthScore`.

### 2. Provider Metro Coverage Metrics
To ensure core metropolitan areas are populated regardless of remote county fallbacks, provider layer audits calculate and report:
- **Unique providers statewide**: Total count of unique advocates registered.
- **Priority metro mapped**: Count of unique providers mapped to the state's `priorityMetroCounties`.
- **Counties with >=3 providers**: Number of priority metro counties with at least 3 source-listed providers.
- **Counties with >=1 legal/advocacy**: Number of priority metro counties with at least 1 legal/advocacy resource.
- **Counties with >=1 therapy**: Number of priority metro counties with at least 1 therapy provider.
- **Statewide rural fallback coverage**: Percentage of rural (non-priority) counties covered by statewide resources.

### 3. Category Capping Penalties
- **75% Fallback Penalty**: If a major parent-facing category (local offices, education, nonprofits, providers) has >75% generated fallbacks, its category score is capped at **50%** and its status is set to `'partial'`.
- **Localization Check Penalty**: If the ratio of unique advocates to counties is `< 0.1`, the provider layer is flagged as non-localized, its status is forced to `'partial'`, and its category score is capped at **50%**.

### 3. State-Level Capping Rules
- **90% Fallback Penalty**: If school districts, nonprofits, advocates, or local offices have >90% generated fallbacks, the final state score is capped at **80.0%**.
- **Local Office Placeholder Penalty**: If local offices have >50% generated fallbacks, the state classification cannot exceed `Factory Proof / Pilot Launchable` (gating search indexation of county × diagnosis leaf pages).

### 4. Running Audits
```bash
npm run audit:state-standard -- [state]
```
*Checks: County counts, office mapping, program registry, school district coverage, forms, and trust scores.*

### 5. Legacy Audits
```bash
npm run audit:state -- [state]
npm run audit:ca-coverage
npm run audit:seo-launch-ca
```

---

## F. Readiness Classifications

States are classified into one of the following readiness tiers based on their audited score and depth penalties:

1. **Factory Proof / Under-Developed** (Score < 70%): State is missing basic county data, waiver programs, or local offices. Sitemaps must completely block these pages.
2. **Factory Proof / Pilot Launchable** (Score 70% - 85% or local office fallback > 50%): Mapped local routing is complete. Fallback school districts and nonprofits are seeded. State is ready for internal review or gated beta testing. Leaf pages must be set to `noindex`.
3. **Launchable / California-Equivalent** (Score 85% - 90%+ with local office fallback < 50%): All 9 categories are seeded, forms are fully written, sitemaps index the state hub and county root pages.
4. **Exhaustive & Launchable** (Score 90%+ with zero depth penalties active): No fallback records are used for primary routing. All contacts are verified. Leaf pages are open to search engines.

---

## G. SEO / Indexing Rules

Unverified or low-quality generated pages will harm domain authority. Follow these indexing gates:

- **State Hubs** (`/benefits/[state]`): Indexable (index) for `Launchable` or `Pilot Launchable` states.
- **County Root Pages** (`/counties/[state]/[slug]`): Indexable (index) once local routing agencies are mapped (e.g. 100% county coverage).
- **County × Diagnosis Leaf Pages** (`/benefits/[state]/[diagnosis]/[county]`): Only indexable for California. For other states, these pages must return `noindex` headers or robots tags to prevent indexing thin pages.
- **Canonical URLs**: Every page must output a lowercase canonical link.
- **Robots Rules**: Use `robots.ts` to enforce state sitemap gates.

---

## H. E2E Testing Template

Every state must have a Playwright smoke test named `frontend/e2e/[state]-launch.spec.ts`. Use this structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Texas Launch Smoke Tests', () => {
  test('should load the state benefits hub and verify terminology', async ({ page }) => {
    await page.goto('/benefits/texas');
    await expect(page.locator('h1')).toContainText('Texas');
    // Verify no California leakage
    const bodyText = await page.innerText('body');
    expect(bodyText).not.toContain('Regional Center');
    expect(bodyText).not.toContain('Medi-Cal');
  });

  test('should load representative county page and render LIDDA office', async ({ page }) => {
    await page.goto('/counties/texas/harris-tx');
    await expect(page.locator('body')).toContainText('LIDDA');
    await expect(page.locator('body')).toContainText('Region 4 Education Service Center');
  });

  test('should render forms catalog and mediation template', async ({ page }) => {
    await page.goto('/forms?state=texas');
    await expect(page.locator('body')).toContainText('Mediation Request');
  });
});
```

---

## I. Future-State Speed Target

To seed a new state (e.g. Florida) in under 30 minutes, follow this quick-reference template:

1. **State Config**: Duplicate the `texas` entry in `stateConfigs.ts`, rename to `florida`, and replace names (e.g., APD, FDLRS, Florida Medicaid).
2. **Medicaid/Waiver Seeds**: Add Florida programs (e.g. `fl-ibudget`) to the `programs` table.
3. **Run Seeding Script**: Update `seed_texas_exhaustive.js` to handle Florida counties using `fl` suffix and seed local APD offices.
4. **Forms Mapping**: Add required form guides (e.g., `fl-medicaid`, `fl-iep-request`) to `seo-data.ts`.
5. **Audits**: Run `npm run audit:state-standard -- florida`.

---

*This playbook ensures that all data navigator platforms scale predictably while delivering trusted, verified information to special needs families.*
