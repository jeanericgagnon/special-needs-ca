# Forms Library Productionization Report

> [!WARNING]
> SUPERSEDED — DO NOT USE FOR EXECUTION. This report is deprecated because it incorrectly claims that the forms schema migration was deferred. The forms schema migration is complete, and forms are fully productionized in the database.

This document reports on the forms and guides library status, explaining why schema migrations were deferred, and detailing the registry of forms currently in staging.

---

## 1. Schema Migration Status: Deferred

In accordance with safety guidelines to prevent live database alterations during verification phases, the schema migration to create the `forms_and_guides` table has been **DEFERRED**. 

A complete database migration proposal has been designed and stored in:  
📁 [`docs/schema-proposals/forms-and-guides-schema.md`](file:///Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/docs/schema-proposals/forms-and-guides-schema.md)

All forms will remain staged in the `staging_scraped_forms` table for safety.

---

## 2. Audit of Staged Forms

We audited the forms currently residing in `staging_scraped_forms` by state:

* **Texas (5 staged forms):**
  - Model State Complaint Request (`form-model-state-complaint`)
  - Due Process Hearing Request (`form-due-process-hearing`)
  - Mediation Request (`form-mediation-request`)
  - Supported Decision-Making Agreement (`form-supported-decision-making`)
  - Integrated Medicaid/CHIP Application Form H1010 (`form-h1010`)
* **Florida (7 staged forms):**
  - APD iBudget Waiver Application
  - DCF ACCESS Medicaid Application
  - FDLRS ESE Early Intervention Referral
  - Model IEP Evaluation Request
  - Star Kids Managed Care Appeal
  - STAR Kids Fair Hearing Request
  - Star Kids Expedited Appeal Request
* **Pennsylvania (7 staged forms):**
  - COMPASS Medicaid Application
  - MH/ID Local Intake Request
  - Early Intervention Evaluation Request
  - IEP Model Request Form
  - Star Kids Appeal
  - Star Kids Fair Hearing Request
  - Star Kids Expedited Appeal
* **Illinois (5 staged forms):**
  - DHS Medicaid Application
  - Early Intervention Services Request
  - ISBE Special Education Evaluation Request
  - Waiver waitlist intake form
  - Supported Decision Making
* **All Other 46 States (1 staged form each):**
  - Standard model special education evaluation request letter template.

---

## 3. Promotion & Quality Gates

Once schema migration is approved and executed, staged forms will be promoted to the production `forms_and_guides` table only if they satisfy the following quality checks:

1. **Direct PDF Link:** The `official_download_url` must point directly to a valid, official `.pdf` file (not a generic landing page) where available.
2. **Metadata Completeness:** Must possess valid entries for `who_uses_it`, `who_signs_it`, and `where_to_send_it`.
3. **No Placeholders:** Must contain no mock links or placeholder scripts.
4. **Source Provenance:** The parent state config must list a verified official agency mapping supporting the form's origin.
