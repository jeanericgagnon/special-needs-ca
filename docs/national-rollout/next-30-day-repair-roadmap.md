# 30-Day Repair Roadmap: Path to Indexation & Quality

This roadmap outlines the tactical steps required to safely launch Batch 1, clean California, upgrade gated states, and scale manual data curation over the next 30 days.

---

## 📅 Immediate Actions (Before GSC Submission)

### 1. Hardening verification
* [ ] Run `npm run build` and sequentially run the Playwright E2E suite (`npx playwright test --workers=1`) to confirm all changes compile and pass.
* [ ] Verify sitemap exclusions are active for all 47 gated states.

### 2. Inject Unique Meta Descriptions for Batch 1 Counties
* [ ] The dynamic metadata generator has been integrated via `countySeoHelpers.ts` to automatically populate unique metadata for all 270 allowlisted Batch 1 counties (TX, FL, PA). Verify GSC mock crawlers see these tags.

---

## 📅 Week 1–2: California Cleanup & Batch 2 Ingestion

### California (CA) Curation Campaign
*Goal: Remove CA's legacy-exception status and make it genuinely release-safe.*
* [ ] Query and delete CA's legacy unverified IEP advocates that lack active website domains or verified phone numbers.
* [ ] VA research to replace the 77 regional education and school district fallback records with direct contacts.
* [ ] Seed 20 new parent-support nonprofits in rural California counties to replace the deleted placeholders.

### Batch 2 (New York, Illinois, Ohio) Launch Prep
*Goal: Bring NY, IL, and OH manual review rates below 5.0%.*
* [ ] **New York:** Verify and populate the remaining 30 school district special education director phone numbers.
* [ ] **Illinois:** Verify the remaining regional education agency intake lines.
* [ ] **Ohio:** Seed at least 10 local county board of developmental disabilities (CBDD) contact numbers.

---

## 📅 Week 3–4: Operational Curation Scaling & Wave 2 Pilot

### Manual Review Curation System
*Goal: Scalably tackle the national 6,091 manual review queue.*
* [ ] **Hire Virtual Assistants (VAs):** Hire 2 remote VAs specialized in web research.
* [ ] **Tooling:** Deploy the structured queues generated in `school-district-review-queue.md` and `county-office-review-queue.md` as active target files for VAs.
* [ ] **Daily Quota:** Target 150 record verifications per day.

### Wave 2 (North Carolina & Michigan) Upgrades
*Goal: Bring NC and MI manual review rates below 5.0% and allowlist them.*
* [ ] Verify the remaining DSS/DHHS offices in North Carolina.
* [ ] Verify the remaining CMHSP (Community Mental Health Services Programs) catchment intake numbers in Michigan.
* [ ] Verify and allowlist NC and MI counties in `verifiedCounties.ts` once their manual review rates drop below 5.0%.
