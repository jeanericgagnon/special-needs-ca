# VA Standard Operating Procedure: Forms Library Curation

**SOP ID:** VA-SOP-04  
**Category:** Forms & Guides  
**Objective:** Verify staged forms, retrieve direct PDF downloads, and draft parent guides.

---

## 1. Curation Guidelines

1. **Verify PDF Download Links:**
   - Test each `official_download_url` in the queue. Confirm it initiates a direct download of a `.pdf` file.
   - If the link points to a landing page, navigate the page to locate the direct PDF download link. Update the database record with the direct PDF URL.
2. **Metadata Compilation:**
   - Read the form instructions to identify `who_uses_it` (e.g. Parents, Physicians) and `who_signs_it`.
   - Extract the submission instructions (`where_to_send_it` - e.g. local assistance office address, fax number, online portal).
3. **Appeals Call Script:**
   - For appeal request forms, write a 2-3 sentence phone script that parents can use to call the agency and verify receipt of their appeal packet.

---

## 2. Database Logging

- **Verification Status:** Set to `verified` once the PDF and submission metadata are fully populated.
- **Source URL:** Log the state webpage where the form was sourced.
