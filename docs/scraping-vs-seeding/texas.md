# Scraping vs Seeding Report: Texas (TX)

This report provides the provenance breakdown of all active records for Texas as of June 2026.

## 1. Records Provenance Breakdown

* **Scraped Live Records (`data_origin = 'scraped_live'`):** 0
* **Curated Seed Records (`data_origin = 'curated_seed'`):** 51 (Priority metro counties only)
* **Crawler-derived Records (`data_origin = 'crawler_derived'`):** 0
* **Source-Listed Records (`verification_status = 'source_listed'`):** 1809
* **Programmatic Placeholder Fallbacks (`data_origin = 'programmatic_fallback'`):** 704
* **Human Verified Records (`verification_status = 'human_verified'`):** 39

## 2. Quality Metrics
* **Total Records in DB:** 2564
* **Fallbacks Ratio:** 27.5%
* **Human Verification Ratio:** 1.5%
* **Extraction Failures:** 0 (database is clean, all schemas validated)
* **Records Needing Review:** 704 (all fallback placeholders require crawler-driven data replacement)
