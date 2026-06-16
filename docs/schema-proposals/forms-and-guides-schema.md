# Schema Proposal: Forms and Guides Production Table

**Date:** June 14, 2026  
**Status:** PROPOSED (Staged for future migration)

---

## 1. Table Schema: `forms_and_guides`

To transition forms from a staging workaround into a robust production structure, we propose creating the `forms_and_guides` table:

```sql
CREATE TABLE forms_and_guides (
    id TEXT PRIMARY KEY,
    state_id TEXT NOT NULL,
    program_id TEXT, -- Nullable if not tied to specific waiver
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- e.g., 'medicaid_appeal', 'iep_request'
    form_type TEXT NOT NULL, -- 'pdf', 'interactive_guide', 'document_template'
    agency TEXT NOT NULL, -- e.g., 'NYS DOH', 'Texas HHSC'
    source_url TEXT NOT NULL,
    pdf_url TEXT, -- Link to official PDF file if available
    language TEXT DEFAULT 'en',
    description TEXT,
    related_action TEXT, -- Action key like 'request_assessment'
    display_context TEXT, -- Frontend routing context
    who_uses_it TEXT, -- e.g., 'Parents', 'Advocates'
    who_signs_it TEXT,
    where_to_send_it TEXT,
    deadline TEXT,
    attachments TEXT, -- Comma-separated list of required attachments
    common_mistakes TEXT, -- Markdown advisory text
    letter_template TEXT, -- Markdown cover letter template
    call_script TEXT, -- Call script for telephone follow-ups
    evidence_level TEXT,
    data_origin TEXT, -- 'curated_seed', 'national_seed', etc.
    verification_status TEXT DEFAULT 'manual_review_required',
    confidence_score REAL DEFAULT 0.0,
    last_checked_at TEXT,
    last_verified_at TEXT,
    FOREIGN KEY (state_id) REFERENCES states(id),
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

CREATE INDEX idx_forms_state_category ON forms_and_guides(state_id, category);
```

---

## 2. Benefits of the Proposed Schema
1. **Dynamic Content rendering:** Avoids hardcoding appeal instructions in Next.js page controllers.
2. **Clear Curation Audits:** Integrates forms directly into our verified-depth and confidence score metrics.
3. **Structured PDF Linking:** Allows the frontend to link directly to official state PDF files while providing localized cover letters and scripts.
