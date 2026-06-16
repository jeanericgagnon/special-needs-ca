# New York State Upgrade - 15 Lessons Learned

This document outlines key engineering, structural, and process lessons learned during the New York (NY) state-upgrade process.

---

## 1. NYC HRA Centralized Benefits Routing Model
Unlike other counties where Medicaid and public benefits are routed to local Department of Social Services (DSS) offices, the five boroughs of New York City (Bronx, Kings, New York, Queens, Richmond) route through a single centralized agency: the Human Resources Administration (HRA). Centralizing these in the routing map prevented duplicate local offices.

## 2. Municipal Early Intervention Program (EIP) Office Splitting
While New York State has 58 Local Health Departments managing EIP, NYC splits its municipal EIP office into 5 distinct borough offices under the NYC Department of Health and Mental Hygiene. We mapped these individually to represent local borough contact points.

## 3. Boards of Cooperative Educational Services (BOCES) Coverage Mapping
BOCES regional education agencies serve catchments of school districts that cross county borders. Ensuring that county-level mappings accurately represented the catchment areas of all 37 BOCES was critical to avoid routing gaps in regional educational services.

## 4. SQLite WAL/SHM Replication Corruption Mismatch
**CRITICAL LESSON:** Copying an active SQLite database to a new location (e.g. `frontend/`) while WAL (Write-Ahead Log) and SHM (Shared Memory) files are present can result in database corruption. When the copy is opened, SQLite attempts to apply the old WAL transactions to the new DB file, resulting in `SQLITE_CORRUPT`. WAL files must be checkpointed and deleted, or WAL/SHM files deleted before copy.

## 5. generic Prepared Statement NOT NULL Constraints
When refactoring a database runner to be generic, all prepared INSERT statements must explicitly map every column defined with a `NOT NULL` constraint in the database, even if staging records leave them blank. Failing to provide empty string defaults for fields like `catchment_boundaries` or `early_intervention_contact` will trigger SQLite constraint failures.

## 6. School District Primary Key (PK) Re-Keying Reference Audit
When replacing fallback school districts with source-listed districts, re-keying the primary key (e.g. `sd-allegany-ny-fallback` to `sd-allegany-ny`) requires a database-wide reference audit. The runner successfully identified and migrated all foreign key references in `resource_providers` and `nonprofit_organizations` to prevent orphaned rows.

## 7. DB_ENCRYPTION_KEY Environment Variable Runtime Dependencies
Because the Next.js production server runs under production mode, it enforces strict encryption checks on SQLite database files. The runner must explicitly inject `DB_ENCRYPTION_KEY` into child processes during testing and build compilation.

## 8. Playwright Concurrency Dev Server CPU Starvation
Running Playwright E2E tests concurrently (162 tests) causes severe CPU starvation on the Next.js dev server, leading to page-load timeouts exceeding 45000ms. Restricting worker thread concurrency or compiling a production server prior to E2E runs mitigates this.

## 9. Sitemap Indexation Gating Gaps
For pilot states, sitemap generation must actively filter county detail pages and diagnosis leaves via explicit allowlists to prevent search crawlers (like Googlebot) from indexing incomplete county directory lists.

## 10. Separation of BOCES from School District Records
Regional education agencies (BOCES) and local school districts must be staged in separate database tables (`regional_education_agencies` vs `school_districts`) to preserve UI directory integrity, even though they both handle special education.

## 11. Multi-State Routing Label Isolation
Label mappings (e.g. `dd_agency` = `OPWDD Regional Office` in NY vs `APD Regional Office` in FL) must be stored in decoupled `state_config.json` configurations, ensuring zero leakage of state-specific terminology into the generic runner.

## 12. Rollback SQL Script Generation Safety
Generating automated transactional rollback SQL scripts during promotion provides a guaranteed recovery path. This allowed us to iterate on constraint errors safely.

## 13. Staging and Direct Promotion Split
Certain curated/source-backed tables (nonprofits, forms) do not have staging tables and are promoted directly. The runner must support bypass rules to execute empty phases cleanly.

## 14. Transactional SQLite Backups
Every stage/promote database mutation must create a timestamped file copy backup before execution, and automatically restore the backup on failure. This prevented database loss during staging constraint errors.

## 15. Manual Review Queue Boundary for Commercial Data
Commercial providers and private attorneys must be stored in a local JSON review queue rather than being promoted directly to the SQLite database. This enforces manual curation gates and prevents unverified advertising links.
