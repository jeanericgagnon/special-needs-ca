# Batch 305 Ohio Root Family Finality Report v1

- classification: BLOCKED
- index_safe: false
- change: sharpened the Ohio county-local blocker from dead guessed directory paths to dead official root/discovery families

## Evidence

- Reviewed 2026-06-23 one more bounded live official Ohio county-local pass after the earlier JFS retirement finding. The blocker is now stronger than dead guessed county-directory paths alone: in the current repo-side verification lane, even the official root and discovery surfaces fail closed. `https://jfs.ohio.gov/`, `https://medicaid.ohio.gov/`, and `https://ohio.gov/` all return HTTP 404, and the same is true for `robots.txt` and `sitemap.xml` on each host family. The already-tried legacy and guessed county-directory paths remain dead as well, including `https://jfs.ohio.gov/home/local-agencies-directory`, `https://medicaid.ohio.gov/families-and-individuals/county-agencies`, `https://medicaid.ohio.gov/resources/county-agencies`, and `https://ohio.gov/residents/resources/job-family-services-directory`, all of which still return HTTP 404. This means the blocker is no longer just that a county-office page moved; the bounded lane currently has no live official JFS, Medicaid, or Ohio.gov root/discovery contract from which to verify a county-office successor. The DOI-hosted county dataset therefore remains planning evidence only.
