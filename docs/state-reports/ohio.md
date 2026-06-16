# Data Provenance Report: Ohio (OH)

This report details the data sources, records count, trust classifications, and launch readiness for the State of Ohio under the V3 release-quality standards as of June 2026.

---

## 1. Executive Summary & Gating Status
- **V3 Status Label**: `KEEP_GATED (Pilot)`
- **Canonical Release Gate Score**: **0.00%**
- **Live Raw Database Depth Score**: **50.0%** (Manual Review Rate: **50.0%**)
- **Sitemap Indexing Posture**: `Blocked`
- **Search Engine Gating Policy**: `Gated` (County detail pages return `noindex` headers except allowlisted counties).
- **Verified Allowlisted Counties (0):** None

---

## 2. Terminology & Routing Configuration
These mappings route users to local-specific terminology on the frontend:
- **Catchment / Regional Label**: `County Board of DD`
- **Medicaid Program Name**: `Ohio Medicaid`
- **Waiver Program Name**: `Individual Options (IO) Waiver`
- **Personal Care Program**: `Participant Directed Services`
- **Developmental Disability (DD) Agency**: `Ohio Department of Developmental Disabilities (DODD)`
- **State Education Agency**: `Ohio Department of Education`
- **State Education Agency SPED Label**: `Educational Service Centers (ESCs)`
- **State Early Intervention Label**: `Ohio Early Intervention (Ages 0-3)`
- **ABLE Savings Program**: `STABLE Account`

---

## 3. Database Records Inventory
A complete count of records stored in the production SQLite database for this state:
- **Counties**: 88
- **County Social Service Storefronts**: 88
- **School Districts**: 176
- **Regional Education Agencies (REAs)**: 51
- **State-Level Resource Agencies**: 176
- **Local Nonprofit Support Organizations**: 3
- **Special Education (IEP) Advocates/Attorneys**: 16
- **Medicaid Waitlist Profiles**: 1
- **Waiver Denial Appeal Guides**: 3

---

## 4. Trust Status & Verification Audit
Detailed breakdown of records by trust status, verification level, and provenance:
- **Verified / Human Curated Records**: 128 records (verification_status = `verified`, `official_verified`, or `human_verified`)
- **Source Listed / Pending Review**: 159 records
- **Manual Review Backlog (Flagged)**: 167 records (verification_status = `manual_review_required`)
- **Programmatic Fallbacks (Scaffolds)**: 0 records
- **Active Mock Contacts (Phone/Email)**: 7 records (Scrubbed to 0)

---

## 5. Official State Programs & Waitlists Mapped
The state-level programs, waivers, and waitlists registered in the database:
- **Individual Options (IO) Waiver** (State Program): Source URL: https://dodd.ohio.gov/your-family/waivers-and-services/individual-options-waiver
  * Description: Ohio's comprehensive HCBS waiver for individuals with intellectual or developmental disabilities.
- **Level One Waiver** (State Program): Source URL: https://dodd.ohio.gov/your-family/waivers-and-services/level-one-waiver
  * Description: Ohio waiver with capped budget for family support, respite, and home personal care.
- **ODE Exceptional Children IEP** (State Program): Source URL: https://education.ohio.gov/Topics/Special-Education
  * Description: Individualized Education Programs (IEP) and school accommodations under Ohio Department of Education.
- **OOD Transition Services** (State Program): Source URL: https://ood.ohio.gov/
  * Description: Opportunities for Ohioans with Disabilities transition and job coaching program.
- **Ohio Early Intervention / Help Me Grow** (State Program): Source URL: https://ohioearlyintervention.org/
  * Description: Early intervention services for infants/toddlers, coordinated by Help Me Grow.
- **Ohio Healthy Start** (State Program): Source URL: https://medicaid.ohio.gov/families-and-individuals/coverage/health-care-programs/healthy-start
  * Description: Ohio's CHIP program providing free or low-cost health coverage to children in low-income families.
- **Ohio Medicaid** (State Program): Source URL: https://medicaid.ohio.gov/
  * Description: Health coverage managed by Ohio Department of Medicaid. Bypasses parent income for waiver clients.
- **SELF Waiver** (State Program): Source URL: https://dodd.ohio.gov/your-family/waivers-and-services/self-waiver
  * Description: Participant-directed waiver allowing individuals to manage their own services and budget.
- **SSI for Children (Ohio)** (State Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Federal benefits with state supplement and Ohio Medicaid integration.
- **STABLE Account** (State Program): Source URL: https://www.stableaccount.com/
  * Description: Ohio's ABLE program, the national leader in special needs savings accounts.
- **Supplemental Security Income (SSI) for Children** (Federal Program): Source URL: https://www.ssa.gov/benefits/disability/apply-child.html
  * Description: Cash-assistance cash benefits administered by the Social Security Administration providing monthly financial aid and aut...


---

## 6. State-Level Resource Agencies
The statewide organizations coordinating Medicaid, SPED, and advocacy:
- **Adams County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Adams County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Allen County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Allen County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Ashland County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Ashland County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Ashtabula County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Ashtabula County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Athens County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Athens County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Auglaize County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Auglaize County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Belmont County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Belmont County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Brown County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Brown County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Butler County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Butler County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Carroll County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Carroll County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Champaign County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Champaign County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Clark County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Clark County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Clermont County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Clermont County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Clinton County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Clinton County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Columbiana County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Columbiana County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Coshocton County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Coshocton County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Crawford County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Crawford County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Cuyahoga County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (216) 241-8230 | Status: `source_listed`
- **Cuyahoga County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Darke County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Darke County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Defiance County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Defiance County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Delaware County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Delaware County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Erie County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Erie County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Fairfield County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Fairfield County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Fayette County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Fayette County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Franklin County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (614) 475-6050 | Status: `source_listed`
- **Franklin County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Fulton County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Fulton County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Gallia County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Gallia County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Geauga County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Geauga County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Greene County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Greene County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Guernsey County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Guernsey County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Hamilton County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Hamilton County Developmental Disabilities Services** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (513) 794-3300 | Status: `source_listed`
- **Hancock County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Hancock County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Hardin County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Hardin County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Harrison County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Harrison County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Henry County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Henry County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Highland County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Highland County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Hocking County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Hocking County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Holmes County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Holmes County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Huron County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Huron County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Jackson County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Jackson County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Jefferson County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Jefferson County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Knox County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Knox County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Lake County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Lake County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Lawrence County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Lawrence County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Licking County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Licking County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Logan County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Logan County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Lorain County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Lorain County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Lucas County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (419) 380-4000 | Status: `source_listed`
- **Lucas County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Madison County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Madison County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Mahoning County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Mahoning County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Marion County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Marion County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Medina County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Medina County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Meigs County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Meigs County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Mercer County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Mercer County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Miami County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Miami County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Monroe County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Monroe County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Montgomery County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (937) 837-9200 | Status: `source_listed`
- **Montgomery County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Morgan County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Morgan County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Morrow County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Morrow County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Muskingum County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Muskingum County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Noble County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Noble County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Ottawa County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Ottawa County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Paulding County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Paulding County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Perry County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Perry County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Pickaway County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Pickaway County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Pike County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Pike County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Portage County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Portage County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Preble County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Preble County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Putnam County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Putnam County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Richland County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Richland County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Ross County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Ross County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Sandusky County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Sandusky County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Scioto County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Scioto County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Seneca County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Seneca County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Shelby County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Shelby County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Stark County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (330) 477-5200 | Status: `source_listed`
- **Stark County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Summit County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (330) 634-8000 | Status: `source_listed`
- **Summit County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Trumbull County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Trumbull County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Tuscarawas County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Tuscarawas County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Union County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Union County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Van Wert County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Van Wert County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Vinton County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Vinton County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Warren County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Warren County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Washington County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Washington County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Wayne County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Wayne County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Williams County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Williams County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Wood County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Wood County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`
- **Wyandot County County Board of Developmental Disabilities** (cbdd): Website: https://dodd.ohio.gov/ | Phone: (800) 617-6733 | Status: `source_listed`
- **Wyandot County County Early Intervention (Help Me Grow)** (early_intervention): Website: https://ohioearlyintervention.org/ | Phone: (800) 755-4769 | Status: `source_listed`


---

## 7. County-by-County Resource Coverage & Gap Matrix
Below is a complete county-by-county audit of local resources. This shows exactly which counties have local coverage and where gaps remain:

| County Name | Offices | School Districts | Nonprofits | IEP Advocates | Coverage Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Adams County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Allen County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Ashland County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Ashtabula County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Athens County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Auglaize County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Belmont County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Brown County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Butler County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Carroll County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Champaign County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Clark County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Clermont County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Clinton County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Columbiana County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Coshocton County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Crawford County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Cuyahoga County | 1 | 2 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Darke County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Defiance County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Delaware County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Erie County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Fairfield County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Fayette County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Franklin County | 1 | 2 | 2 | 4 | 🟢 COMPLETE |
| Fulton County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Gallia County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Geauga County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Greene County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Guernsey County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Hamilton County | 1 | 2 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Hancock County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Hardin County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Harrison County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Henry County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Highland County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Hocking County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Holmes County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Huron County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Jackson County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Jefferson County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Knox County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lake County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lawrence County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Licking County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Logan County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lorain County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Lucas County | 1 | 2 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Madison County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Mahoning County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Marion County | 1 | 2 | 1 | 2 | 🟢 COMPLETE |
| Medina County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Meigs County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Mercer County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Miami County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Monroe County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Montgomery County | 1 | 2 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Morgan County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Morrow County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Muskingum County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Noble County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Ottawa County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Paulding County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Perry County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Pickaway County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Pike County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Portage County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Preble County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Putnam County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Richland County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Ross County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Sandusky County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Scioto County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Seneca County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Shelby County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Stark County | 1 | 2 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Summit County | 1 | 2 | 0 | 4 | ⚠️ PARTIAL (Missing Nonprofits) |
| Trumbull County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Tuscarawas County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Union County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Van Wert County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Vinton County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Warren County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Washington County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Wayne County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Williams County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Wood County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |
| Wyandot County | 1 | 2 | 0 | 2 | ⚠️ PARTIAL (Missing Nonprofits) |

---

## 8. Detailed County-Level Gap Registry
List of specific counties with zero resource mappings:
- **Counties Missing Social Service Offices**: None
- **Counties Missing School Districts**: None
- **Counties Missing Local Nonprofits**: Adams County, Allen County, Ashland County, Ashtabula County, Athens County, Auglaize County, Belmont County, Brown County, Butler County, Carroll County, Champaign County, Clark County, Clermont County, Clinton County, Columbiana County, Coshocton County, Crawford County, Cuyahoga County, Darke County, Defiance County, Delaware County, Erie County, Fairfield County, Fayette County, Fulton County, Gallia County, Geauga County, Greene County, Guernsey County, Hamilton County, Hancock County, Hardin County, Harrison County, Henry County, Highland County, Hocking County, Holmes County, Huron County, Jackson County, Jefferson County, Knox County, Lake County, Lawrence County, Licking County, Logan County, Lorain County, Lucas County, Madison County, Mahoning County, Medina County, Meigs County, Mercer County, Miami County, Monroe County, Montgomery County, Morgan County, Morrow County, Muskingum County, Noble County, Ottawa County, Paulding County, Perry County, Pickaway County, Pike County, Portage County, Preble County, Putnam County, Richland County, Ross County, Sandusky County, Scioto County, Seneca County, Shelby County, Stark County, Summit County, Trumbull County, Tuscarawas County, Union County, Van Wert County, Vinton County, Warren County, Washington County, Wayne County, Williams County, Wood County, Wyandot County

---

## 9. Manual Review Queue Registry
List of records flagged as `manual_review_required` in the database, representing exactly what needs to be verified before this state can be advanced:

| Category | Record Name | County | ID |
| :--- | :--- | :--- | :--- |
| School District | Adams County County School District Special Education | Adams County | `sd-adams-oh` |
| School District | Allen County County School District Special Education | Allen County | `sd-allen-oh` |
| School District | Ashland County County School District Special Education | Ashland County | `sd-ashland-oh` |
| School District | Ashtabula County County School District Special Education | Ashtabula County | `sd-ashtabula-oh` |
| School District | Athens County County School District Special Education | Athens County | `sd-athens-oh` |
| School District | Auglaize County County School District Special Education | Auglaize County | `sd-auglaize-oh` |
| School District | Belmont County County School District Special Education | Belmont County | `sd-belmont-oh` |
| School District | Brown County County School District Special Education | Brown County | `sd-brown-oh` |
| School District | Butler County County School District Special Education | Butler County | `sd-butler-oh` |
| School District | Carroll County County School District Special Education | Carroll County | `sd-carroll-oh` |
| School District | Champaign County County School District Special Education | Champaign County | `sd-champaign-oh` |
| School District | Clark County County School District Special Education | Clark County | `sd-clark-oh` |
| School District | Clermont County County School District Special Education | Clermont County | `sd-clermont-oh` |
| School District | Clinton County County School District Special Education | Clinton County | `sd-clinton-oh` |
| School District | Columbiana County County School District Special Education | Columbiana County | `sd-columbiana-oh` |
| School District | Coshocton County County School District Special Education | Coshocton County | `sd-coshocton-oh` |
| School District | Crawford County County School District Special Education | Crawford County | `sd-crawford-oh` |
| School District | Darke County County School District Special Education | Darke County | `sd-darke-oh` |
| School District | Defiance County County School District Special Education | Defiance County | `sd-defiance-oh` |
| School District | Delaware County County School District Special Education | Delaware County | `sd-delaware-oh` |
| School District | Erie County County School District Special Education | Erie County | `sd-erie-oh` |
| School District | Fairfield County County School District Special Education | Fairfield County | `sd-fairfield-oh` |
| School District | Fayette County County School District Special Education | Fayette County | `sd-fayette-oh` |
| School District | Fulton County County School District Special Education | Fulton County | `sd-fulton-oh` |
| School District | Gallia County County School District Special Education | Gallia County | `sd-gallia-oh` |
| School District | Geauga County County School District Special Education | Geauga County | `sd-geauga-oh` |
| School District | Greene County County School District Special Education | Greene County | `sd-greene-oh` |
| School District | Guernsey County County School District Special Education | Guernsey County | `sd-guernsey-oh` |
| School District | Hancock County County School District Special Education | Hancock County | `sd-hancock-oh` |
| School District | Hardin County County School District Special Education | Hardin County | `sd-hardin-oh` |
| School District | Harrison County County School District Special Education | Harrison County | `sd-harrison-oh` |
| School District | Henry County County School District Special Education | Henry County | `sd-henry-oh` |
| School District | Highland County County School District Special Education | Highland County | `sd-highland-oh` |
| School District | Hocking County County School District Special Education | Hocking County | `sd-hocking-oh` |
| School District | Holmes County County School District Special Education | Holmes County | `sd-holmes-oh` |
| School District | Huron County County School District Special Education | Huron County | `sd-huron-oh` |
| School District | Jackson County County School District Special Education | Jackson County | `sd-jackson-oh` |
| School District | Jefferson County County School District Special Education | Jefferson County | `sd-jefferson-oh` |
| School District | Knox County County School District Special Education | Knox County | `sd-knox-oh` |
| School District | Lake County County School District Special Education | Lake County | `sd-lake-oh` |
| School District | Lawrence County County School District Special Education | Lawrence County | `sd-lawrence-oh` |
| School District | Licking County County School District Special Education | Licking County | `sd-licking-oh` |
| School District | Logan County County School District Special Education | Logan County | `sd-logan-oh` |
| School District | Lorain County County School District Special Education | Lorain County | `sd-lorain-oh` |
| School District | Madison County County School District Special Education | Madison County | `sd-madison-oh` |
| School District | Mahoning County County School District Special Education | Mahoning County | `sd-mahoning-oh` |
| School District | Marion County County School District Special Education | Marion County | `sd-marion-oh` |
| School District | Medina County County School District Special Education | Medina County | `sd-medina-oh` |
| School District | Meigs County County School District Special Education | Meigs County | `sd-meigs-oh` |
| School District | Mercer County County School District Special Education | Mercer County | `sd-mercer-oh` |
| ... | *and 117 more records in manual review queue* | ... | ... |


---

## 10. Actionable Next Steps
1. **Scrape Special Education Directories**: Replace fallback school districts with official special education coordinators.
2. **Local HHS Storefront Verification**: Verify direct phone lines and intake details for county storefront offices.
3. **Seed Parent Support Chapters**: Partner with state PTI networks to verify and seed local nonprofit support organizations.
