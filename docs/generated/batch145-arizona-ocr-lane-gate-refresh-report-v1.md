# Arizona OCR Lane Gate Refresh Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: ahcccs_county_mapping_requires_reviewed_admin_html_leaves_or_explicit_ocr_artifact

## Evidence

- Re-checked the Arizona AHCCCS county-local lane against the current local toolchain only. The official ALTCS office leaf and partial county-map extraction remain real, but the county-admin PDFs still do not yield reviewable county/admin mappings.
- The current repo/runtime has no deterministic low-token OCR lane available: `tesseract`, `pdftotext`, and `pdftoppm` are absent on PATH, and `pytesseract`, `pdf2image`, and `PIL` are not importable.
- That means more retries against the same PDFs would only churn the same blocker. The honest next lane is reviewed AHCCCS admin HTML leaves or a committed OCR artifact.

## Repair decision

- Arizona county-local routing is no longer described as a generic parser problem.
- It is now explicitly blocked on a missing admin-mapping artifact plus no local OCR lane in the current repo/runtime.
