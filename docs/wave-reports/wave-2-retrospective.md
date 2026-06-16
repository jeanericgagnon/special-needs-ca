# Wave 2 Retrospective & Discovery Report

## 1. Wave Summary

This report outlines the scraper results, data quality improvements, and extraction lessons for Wave 2.

## 2. Key Findings

- **Source Discovery:** Easiest targets were official .gov directories, hardest were local advocacy/nonprofit rosters.
- **Crawl Complexity:** Pages that use complex dynamic dropdowns require Playwright, static lists are fetched using static fetch tools.
- **Data Quality:** Mapped counties correctly and normalized phone numbers.

## 3. Data Schema & Normalization Updates

- Adjusted address formatting selectors for urban counties.
- Resolved ZIP code lookup mapping issues.

## 4. Next Wave Goals

Apply general selectors to the next wave, reducing custom scraper code by reusing parsing rules.
