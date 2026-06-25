# Batch 331 Ohio Live Root Recovery Report v1

- classification: BLOCKED
- index_safe: false
- change: corrected the Ohio county-local family from blocked discovery evidence to verified live official county-directory coverage, leaving education as the sole blocker

## Evidence

- Reviewed 2026-06-24 and rechecked 2026-06-25 one more bounded live official Ohio county-local pass after the earlier stale-root blocker. The Ohio JFS county-directory family is no longer a dead discovery lane. `https://jfs.ohio.gov/`, `https://medicaid.ohio.gov/`, and `https://ohio.gov/` all return HTTP 200, `robots.txt` returns HTTP 200 on each host family, and `https://jfs.ohio.gov/sitemap.xml` is publicly reviewable. The live JFS sitemap advertises 98 `cdjfs-*` local-agency-directory URLs spanning 88 distinct county slugs. A bounded verification sweep across that official sitemap family now shows those county leaves materially render and preserve county-specific office data on the official JFS host. Using the non-shell structured fields on each page, all 88 counties preserve a county-specific title plus local address, phone, fax, and hours data. Sampled verified leaves include Belmont (`68145 Hammond Road, St. Clairsville, OH 43950-8755`, phone `1 (740) 695-1075`), Butler (`315 High St., 9th Fl., Hamilton, OH 45011`, phone `1 (513) 887-5600`), and Wood (`1928 E. Gypsy Lane Rd., P.O. Box 679, Bowling Green, OH 43402-9396`, phone `1 (419) 352-7566`). Ohio county-local disability resources therefore now clear from the live official JFS directory family, and the remaining Ohio blocker is education routing rather than county-local office proof.
