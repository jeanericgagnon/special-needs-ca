# State Upgrade Checklist Template

Use this checklist to track the status of a state upgrade. Copy this file to `docs/state-upgrades/[state]/upgrade-checklist.md` at the beginning of the upgrade process.

---

## State: [State Name] ([State Code])

### Phase 1: Research & Planning (Gate 1)
*   [ ] **00-baseline.md Created**: Defined the basic parameters, target counties, and demographics.
*   [ ] **01-resource-truth-map.md Created**: Identified official agency directories, service areas, and target tables.
*   [ ] **02-gap-analysis.md Created**: Completed the audit of current database listings against the truth map.
*   [ ] **03-pull-plan.md Created**: Formulated scraper targets, crawl patterns, and data schema mappings.
*   [ ] **JSON Files Scaffolded**: Sourced target, gap, and pull plan configurations stored under `data/state-upgrades/[state]/`.
*   [ ] **Gate 1 Approval**: [ ] Approved by Lead Developer/Reviewer.

### Phase 2: Category Ingestion & Staging (Serial Gates)

#### Phase 2A: benefits / HHS Local Offices Routing
*   [ ] **HHS Storefront Structure Verified**: Documented county-level vs regional/locator structure.
*   [ ] **HHS Local Offices Staged**: Storefront and community partner directories cataloged in staging tables.
*   [ ] **04-benefits-routing.md Created**: Documented the state's Medicaid/HHS routing model.
*   [ ] **[state]-benefits-upgrade-proposal.md Created**: Outlined target staging/production tables, deduplication rules, and validation plans.
*   [ ] **Staging Report Created**: Verified county coverage and record counts.
*   [ ] **Gate 2A Approval**: [ ] Approved by Lead Developer/Reviewer.

#### Phase 2B: DD / IDD / Local Catchment Routing
*   [ ] **DD/IDD Regions & Waivers Cataloged**: Sourced developmental disability waivers and regional intake offices.
*   [ ] **05-dd-idd-routing.md Created**: Mapped regional boundaries, waitlist registry status, and county assignment rules.
*   [ ] **[state]-dd-idd-upgrade-proposal.md Created**: Detailed ingestion rules, waitlist duration normalizations, and staging schemas.
*   [ ] **Gate 2B Approval**: [ ] Approved by Lead Developer/Reviewer.

#### Phase 2C: Early Intervention (Ages 0-3)
*   [ ] **Early Intervention Portals Cataloged**: Sourced local Part C contractors/portals.
*   [ ] **06-early-intervention.md Created**: Mapped portals to county boundaries, supporting overlapping metropolitan areas.
*   [ ] **[state]-early-intervention-upgrade-proposal.md Created**: Outlined staging rules and geographic coverage mappings.
*   [ ] **Gate 2C Approval**: [ ] Approved by Lead Developer/Reviewer.

#### Phase 2D: School Districts & Regional Education Support
*   [ ] **Special Education & District Structures Cataloged**: Mapped intermediate/regional education units and school districts.
*   [ ] **07-education-routing.md Created**: Documented regional education routing and ESE/special education contact directories.
*   [ ] **[state]-education-upgrade-proposal.md Created**: Outlined staging rules, source hierarchies, and primary-key re-keying dependency checks.
*   [ ] **Gate 2D Approval**: [ ] Approved by Lead Developer/Reviewer.

#### Phase 2E: Hospital & University Clinics
*   [ ] **Autism & Developmental Clinics Cataloged**: Sourced major children's hospitals and academic clinical networks.
*   [ ] **08-clinics.md Created**: Mapped clinic coordinates and separated physical county locations from service catchments.
*   [ ] **[state]-clinics-upgrade-proposal.md Created**: Outlined staging rules for clinical providers and state forms.
*   [ ] **Gate 2E Approval**: [ ] Approved by Lead Developer/Reviewer.

### Phase 3: Nonprofits & Review Queue (Gate 3)
*   [ ] **Nonprofits Cataloged**: Mapped parent training networks, statewide advocacy organizations, and local support chapters.
*   [ ] **Advocate Review Queue Established**: Sourced commercial legal, advocacy, and therapy entities into the local review queue.
*   [ ] **Staging Verification Run**: Ran duplicate and schema validation scripts.
*   [ ] **Promotion Proposal Created**: Outlined database promotion paths.
*   [ ] **rollback-plan.md Created**: Documented how to revert database promotion.
*   [ ] **Gate 3 Integration Approval**: [ ] Approved by Lead Developer/Reviewer.

### Phase 4: Local Build & Sitemap Verification (Gate 4)
*   [ ] **Database Promotion & Fast Integrity Checks**: Promoted staged records into production tables and ran the post-promotion fast audits (standard audit, depth audit, mutation guard, fakeCoverageDetector, SQL rollback, and before/after diff checks).
*   [ ] **State Config Added**: Registered state configuration in `frontend/src/lib/stateConfigs.ts`.
*   [ ] **Playwright Spec Created**: Smoke tests written in `frontend/e2e/[state]-launch.spec.ts`.
*   [ ] **Local Build Completed**: Run `npm run build --prefix frontend` locally with no compilation errors.
*   [ ] **Targeted Smoke Test Pass**: Verified localhost routes with targeted Playwright test `npx playwright test e2e/[state]-launch.spec.ts` returning **100% SUCCESS**.
*   [ ] **05-local-verification-report.md Created**: Logs local build results and local smoke test outputs.
*   [ ] **Gate 4 Build & Sitemap Approval**: [ ] Approved by Lead Developer/Reviewer.

### Phase 5: Public Production Launch (Gate 5)
*   [ ] **Vercel Deployment**: Database and code changes pushed to production Vercel.
*   [ ] **Environment Variables Verified**: `DB_ENCRYPTION_KEY`, `NEXT_PUBLIC_SITE_URL`, and `NODE_ENV` verified in production settings.
*   [ ] **Public Domain Smoke Test**: Executed live domain tests with **100% SUCCESS**.
*   [ ] **docs/launch/[state]-live-production-verification-report.md Created**: Summarized live-site outputs and GSC status.
*   [ ] **Gate 5 Live Domain Audit**: [ ] Approved by Lead Developer/Reviewer.
*   [ ] **Google Search Console Submission**: Submitted `sitemap.xml` to GSC and requested manual indexation of priority hub routes.
