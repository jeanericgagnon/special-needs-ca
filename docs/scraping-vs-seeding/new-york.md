# Scraping vs Seeding Report: New York (NY)

This report provides the provenance breakdown of all active records for New York as of June 2026.

## 1. Records Provenance Breakdown

* **Scraped Live Records (`data_origin = 'scraped_live'`):** 0
* **Curated Seed Records (`data_origin = 'curated_seed'`):** 32 (Priority metro counties only)
* **Crawler-derived Records (`data_origin = 'crawler_derived'`):** 0
* **Source-Listed Records (`verification_status = 'source_listed'`):** 224
* **Programmatic Placeholder Fallbacks (`data_origin = 'programmatic_fallback'`):** 100
* **Human Verified Records (`verification_status = 'human_verified'`):** 0

## 2. Quality Metrics
* **Total Records in DB:** 356
* **Fallbacks Ratio:** 28.1%
* **Human Verification Ratio:** 0.0%
* **Extraction Failures:** 0 (database is clean, all schemas validated)
* **Records Needing Review:** 100 (all fallback placeholders require crawler-driven data replacement)
