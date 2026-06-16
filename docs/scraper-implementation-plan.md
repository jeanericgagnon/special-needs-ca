# Scraper Implementation Plan

This plan outlines the architecture, input schemas, extraction fields, staging tables, and logging guidelines for the 11 scraper types designed to crawl benefits, education, and provider listings.

## 1. Scraper Types Overview

| ID | Scraper Type | Target Staging Table | Extraction Method |
| :--- | :--- | :--- | :--- |
| 1 | **Medicaid/HHS Office Locator Scraper** | `staging_scraped_county_offices` | `Crawls HTML local social services directories and locator systems.` |
| 2 | **DD Local Agency Scraper** | `staging_scraped_state_resource_agencies` | `Crawls regional developmental services centers (e.g. CMHSPs, LIDDAs, APD regions).` |
| 3 | **HCBS Waiver Source Scraper** | `staging_scraped_sources` | `Parses state waiver pages, CMS PDFs, and comparison guides.` |
| 4 | **Early Intervention Local Agency Scraper** | `staging_scraped_state_resource_agencies` | `Extracts Part C baby/infant service points.` |
| 5 | **Education/Regional Agency Scraper** | `staging_scraped_regional_education_agencies` | `Crawls regional service support cooperatives (e.g., BOCES, Intermediate Units).` |
| 6 | **School District Special Ed Contact Scraper** | `staging_scraped_school_districts` | `Parses special education contact emails, websites, and student counts.` |
| 7 | **Nonprofit/Support Org Scraper** | `staging_scraped_nonprofit_organizations` | `Extracts parent networks, The Arc chapters, and conditions support services.` |
| 8 | **Forms/PDF Scraper** | `staging_scraped_forms` | `Discovers and downloads official PDF forms, application guides, and mailing addresses.` |
| 9 | **Waitlist/Appeal Source Scraper** | `staging_scraped_waitlists` | `Crawls waiver interest list durations, priority criteria, and appeal rules.` |
| 10 | **Provider/Advocate Source Scraper** | `staging_scraped_iep_advocates / resource_providers` | `Crawls legal directories and local pediatric clinics where permitted.` |
| 11 | **Source Verification/Link Checker** | `N/A` | `Performs weekly dry-run checks on URL freshness, sitemaps, and robots.txt changes.` |

## 2. Base Input Target JSON Format

```json
{
  "state": "TX",
  "category": "Medicaid / benefits / HHS",
  "source_name": "Texas Medicaid Offices Directory",
  "organization_type": "official_state",
  "source_url": "https://hhs.texas.gov/social-service-offices",
  "domain": "hhs.texas.gov",
  "target_tables": "county_offices",
  "expected_fields": "office_name, address, phone, website",
  "crawl_method": "playwright",
  "robots_txt_status": "allowed",
  "terms_risk": "low",
  "priority": 1,
  "last_checked_at": "2026-06-13"
}
```

## 3. General Deduplication and Scoring Logic

1. **Standardize inputs:** Clean phone numbers, trim addresses, expand common road suffix abbreviations, lowercase all URLs.
2. **Confidence Score Calculation:**
   - Official domains (.gov, .mil, .edu) -> Base score `0.90`
   - Nonprofit domains (.org) -> Base score `0.75`
   - Other/commercial domains -> Base score `0.50`
   - Deduct `0.15` for incomplete fields (missing phone or address).
3. **Audit Trail Logging:** All promotions must append to `staging_promotion_audit` recording exact changes, source URLs, and reasons.

## 4. Test Fixtures & Failure Modes

- **Test Fixtures:** Mock HTML files simulating state directories and locators.
- **Failures Handling:** Retry network failures up to 3 times, alert Slack/logs on robots.txt block or selector mismatch, skip records with missing names.
