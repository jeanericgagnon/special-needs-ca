# Pennsylvania Upgrade Lessons Learned

This document outlines key technical, architectural, and data modeling lessons compiled during the Pennsylvania state pilot upgrade.

---

## 1. County MH/ID Joinder Routing Model
*   **The Scenario:** Pennsylvania administers intellectual disability/autism waiver services (ODP) through 48 local Administrative Entities (AEs). Many rural counties are grouped together into multi-county "joinders" (e.g. Carbon-Monroe-Pike Joinder, Forest-Warren Joinder, Huntingdon-Mifflin-Juniata Joinder) sharing a single office.
*   **The Lesson:** Rather than duplicating identical physical office listings across multiple counties (violating database normal form), the system must map each individual county to the shared joinder office record via a one-to-many catchment mapping in the routing table.

## 2. Infant/Toddler vs. Preschool EI Split (Part C & Part B)
*   **The Scenario:** Early Intervention in Pennsylvania is split between two separate state agencies:
    *   *Infant/Toddler (Ages 0-3)*: Administered by the Department of Human Services (DHS) via the local county MH/ID offices.
    *   *Preschool EI (Ages 3-5)*: Administered by the Department of Education (PDE) via the 29 regional Intermediate Units (IUs).
*   **The Lesson:** Staging and frontend routing must distinguish between these age bands. Child profiles under age 3 must route to the local county coordinator, while profiles between ages 3 and 5 must route to the local Intermediate Unit (IU) contact.

## 3. CONNECT Helpline Central Entry-Point
*   **The Scenario:** While county offices coordinate local service intake, the statewide CONNECT Helpline (`1-800-692-7288`) serves as the unified referral entry point.
*   **The Lesson:** Upgrades should stage the CONNECT portal as a statewide resource agency while ensuring local county coordinators are mapped for families who prefer direct local contact.

## 4. Intermediate Unit (IU) Catchment Mapping
*   **The Scenario:** The 29 Intermediate Units (IUs) serve all 500+ school districts in Pennsylvania across specific county groupings (e.g., Delaware County IU 25, Montgomery County IU 23).
*   **The Lesson:** Use a regional catchment junction table to map the 67 counties to their respective Intermediate Units. The frontend configuration resolves these regional education boundaries dynamically under the unified label `Intermediate Units (IUs)`.

## 5. School District Source Hierarchy
*   **The Scenario:** Direct special education director contact info is frequently outdated on individual district websites, and state-level databases are often incomplete.
*   **The Lesson:** Establish a strict source verification hierarchy:
    1.  *PDE EdNA Directory:* Sourced first from the official Pennsylvania Department of Education "Education Names and Addresses" (EdNA) database to get the active district names, websites, and county mappings.
    2.  *District Special Education Page:* direct inspection of district ESE department pages to verify intake phone numbers and office locations.
    3.  *Intermediate Unit Directories:* cross-reference with local IU contact directories for confirmation.

## 6. ESE Re-Keying Reference Audit Lesson
*   **The Scenario:** Replacing the 59 fallback school districts required re-keying primary keys from `sd-{county}-pa-fallback` to clean, verified parent school district IDs `sd-{county}-pa` in production.
*   **The Lesson:** Execute a reference audit across all database tables (such as child/case profiles) prior to the transaction to verify that no active user records reference the old fallback primary keys. Since only fallback seeds were affected, the re-keying was clean and safe.

## 7. Institutional Clinics Physical Location vs. Service Area
*   **The Scenario:** Major children's hospital developmental pediatrics clinics (e.g. Children's Hospital of Philadelphia - CHOP, UPMC Children's Hospital of Pittsburgh) serve the entire state from a single physical campus.
*   **The Lesson:** Ingest the clinic once at its physical address (e.g., Philadelphia County for CHOP) and tag it with metadata denoting its regional/statewide service reach. Do not duplicate clinic records across multiple counties.

## 8. Forms Schema Gap Lesson
*   **The Scenario:** The database lacks a production table for state-specific forms, requiring forms to be queried from the staging table.
*   **The Lesson:** Stage forms directly into `staging_scraped_forms` with `review_status = 'auto_accepted'` to satisfy relational check gates while keeping the codebase aligned with the frontend forms catalog queries.

## 9. Provider / Legal Review Queue Boundary
*   **The Scenario:** High-liability commercial entities, such as private special education law firms and for-profit therapy clinics, carry reputational risks if auto-promoted without credentials vetting.
*   **The Lesson:** Route all private attorneys, advocates, and commercial clinics to a local `provider_legal_review_queue.json` file. Only non-profit support groups and public/state services are promoted to the production database.

## 10. Next.js WAL Replica Locks and Database Corruption
*   **The Scenario:** Rebuilding the Next.js frontend with `npm run build` while copying the SQLite database replica can corrupt the database file if stale `-wal` and `-shm` transaction files exist.
*   **The Lesson:** Before performing a database copy to the frontend replica path, proactively delete any stale `-wal` and `-shm` files in the target directory using `fs.unlinkSync`. This ensures a clean SQLite connection and prevents build-time database corruption.
