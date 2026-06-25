# Batch 350 Arizona PDF Support Letter Finality v1

- classification: BLOCKED
- index_safe: false
- change: replaced the stale “missing PDF stack” county-local blocker with exact official PDF review showing the AHCCCS bundle is support-letter evidence, not a county-routing contract

## Evidence

- Reviewed 2026-06-25 the exact official Arizona AHCCCS UniversityFamilyCare PDF bundle with the current bundled PDF runtime instead of relying on the older missing-parser assumption. The oversight page https://www.azahcccs.gov/Resources/OversightOfHealthPlans/UniversityFamilyCare.html still points to three county-relevant PDFs: `Pima.pdf`, `PimaCountyAdmin.pdf`, and `CountyAdminOffice.pdf`. The current bundled runtime can now parse or render those files, and the result is stronger but still blocking: `Pima.pdf` is text-extractable and reads as a support letter from Michal Goforth of Pima Community Access Program backing the University Family Care merger, not as a county office directory or routing contract. `PimaCountyAdmin.pdf` and `CountyAdminOffice.pdf` render as image-based letters on Pima County Administrator letterhead to AHCCCS Director Tom Betlach, dated September 5, 2014, offering support for the University Family Care merger. Those PDFs preserve county and administrator identity, but they still do not expose county-to-office routing, office assignments, service areas, or a county-admin contact contract that can clear county-local disability resources. DES remains challenge-blocked on its office surfaces, so Arizona county-local routing is now source-final on non-contract support letters rather than on a missing PDF toolchain.
