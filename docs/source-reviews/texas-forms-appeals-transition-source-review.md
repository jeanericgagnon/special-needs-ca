# Texas Forms, Appeals, Waitlists & Transition Source Review

**Date:** June 13, 2026  
**State:** Texas (TX)  
**Scope:** Phase 4 (Official Forms, Appeals, Waitlists, VR, ABLE, and Transition Resources)

---

## 1. Medicaid & Benefits Resources

### YourTexasBenefits Portal
*   **Source Name:** YourTexasBenefits Portal
*   **Source URL:** [https://www.yourtexasbenefits.com](https://www.yourtexasbenefits.com)
*   **Resource Type:** portal
*   **Agency:** Texas Health and Human Services Commission (HHSC)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Statewide benefits application and management portal.

### YourTexasBenefits Form H1010
*   **Source Name:** Form H1010 - Texas Works Application for Assistance
*   **Source URL:** [https://www.hhs.texas.gov/regulations/forms/1000-1999/form-h1010-texas-works-application](https://www.hhs.texas.gov/regulations/forms/1000-1999/form-h1010-texas-works-application)
*   **Resource Type:** form
*   **Agency:** Texas Health and Human Services Commission (HHSC)
*   **Target Table:** `staging_scraped_forms`
*   **Extraction Method:** Static page verify
*   **Fields Available:** title, category, form_type, source_url, pdf_url, agency, language
*   **Risk Level:** Low
*   **Notes:** Unified benefits application (Medicaid, CHIP, SNAP, TANF).

### HHSC Medicaid Fair Hearings
*   **Source Name:** HHSC Medicaid & CHIP Fair Hearings Info Page
*   **Source URL:** [https://www.hhs.texas.gov/services/your-rights/medicaid-chip-fair-hearings](https://www.hhs.texas.gov/services/your-rights/medicaid-chip-fair-hearings)
*   **Resource Type:** appeal_guide
*   **Agency:** Texas Health and Human Services Commission (HHSC)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Official instructions and routing for requesting a Medicaid appeal.

### HHSC Ombudsman Managed Care Help
*   **Source Name:** HHSC Ombudsman Managed Care Appeal Help
*   **Source URL:** [https://www.hhs.texas.gov/services/your-rights/hhs-ombudsman/medicaid-managed-care-help](https://www.hhs.texas.gov/services/your-rights/hhs-ombudsman/medicaid-managed-care-help)
*   **Resource Type:** appeal_guide
*   **Agency:** Texas Health and Human Services Commission (HHSC)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Central resource page for filing appeals against Managed Care Organizations (MCOs).

---

## 2. Waiver Interest Lists (Waitlists)

### HHSC IDD Waiver Interest List Status
*   **Source Name:** Texas HHS IDD Waiver Interest List Status Page
*   **Source URL:** [https://www.hhs.texas.gov/about/records-statistics/interest-list-status](https://www.hhs.texas.gov/about/records-statistics/interest-list-status)
*   **Resource Type:** waitlist_statistics
*   **Agency:** Texas Health and Human Services Commission (HHSC)
*   **Target Table:** `sources` (with waitlist statistics mapped to `program_waitlists`)
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating, waitlist_counts
*   **Risk Level:** Low
*   **Notes:** Mapped as the official source for waiver waitlists. Since HHSC does not officially state wait times, all `duration_label` values are set to null and marked as undocumented by the state.

---

## 3. Early Childhood Intervention (ECI)

### ECI Central Information
*   **Source Name:** Texas HHS ECI Services Central Page
*   **Source URL:** [https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services)
*   **Resource Type:** portal
*   **Agency:** Texas Health and Human Services Commission (HHSC)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Main portal for ECI early intervention services.

### ECI How to Make a Referral
*   **Source Name:** ECI How to Make a Referral
*   **Source URL:** [https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/how-make-referral-early-childhood-intervention](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/how-make-referral-early-childhood-intervention)
*   **Resource Type:** referral_guide
*   **Agency:** Texas Health and Human Services Commission (HHSC)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Provides official instructions and local program referral links.

### ECI Dispute Resolution
*   **Source Name:** ECI Dispute Resolution Page
*   **Source URL:** [https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-dispute-resolution](https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-dispute-resolution)
*   **Resource Type:** appeal_guide
*   **Agency:** Texas Health and Human Services Commission (HHSC)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Routing page for filing complaints, requesting mediation, or due process under ECI.

---

## 4. Special Education & IEP

### TEA Dispute Resolution
*   **Source Name:** TEA Special Education Dispute Resolution System
*   **Source URL:** [https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution](https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution)
*   **Resource Type:** portal
*   **Agency:** Texas Education Agency (TEA)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Central portal for special education disputes in Texas.

### TEA Procedural Safeguards
*   **Source Name:** TEA Procedural Safeguards Parent Rights
*   **Source URL:** [https://tea.texas.gov/academics/special-student-populations/special-education/parent-and-family-resources/procedural-safeguards](https://tea.texas.gov/academics/special-student-populations/special-education/parent-and-family-resources/procedural-safeguards)
*   **Resource Type:** legal_guide
*   **Agency:** Texas Education Agency (TEA)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Legal safeguards document required to be distributed to parents.

### TEA Due Process Complaint Form
*   **Source Name:** TEA Due Process Hearing Request Form
*   **Source URL:** [https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution/special-education-due-process-hearing-program](https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution/special-education-due-process-hearing-program)
*   **Resource Type:** form
*   **Agency:** Texas Education Agency (TEA)
*   **Target Table:** `staging_scraped_forms`
*   **Extraction Method:** Static page verify
*   **Fields Available:** title, category, form_type, source_url, pdf_url, agency
*   **Risk Level:** Low
*   **Notes:** Model complaint form for requesting a special education due process hearing.

### TEA State Complaint Form
*   **Source Name:** TEA Special Education Model State Complaint Form
*   **Source URL:** [https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution/special-education-complaint-process](https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution/special-education-complaint-process)
*   **Resource Type:** form
*   **Agency:** Texas Education Agency (TEA)
*   **Target Table:** `staging_scraped_forms`
*   **Extraction Method:** Static page verify
*   **Fields Available:** title, category, form_type, source_url, pdf_url, agency
*   **Risk Level:** Low
*   **Notes:** Model complaint form for filing a formal state compliance complaint.

### TEA Mediation Request Form
*   **Source Name:** TEA Request for Special Education Mediation
*   **Source URL:** [https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution/special-education-mediation-program](https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution/special-education-mediation-program)
*   **Resource Type:** form
*   **Agency:** Texas Education Agency (TEA)
*   **Target Table:** `staging_scraped_forms`
*   **Extraction Method:** Static page verify
*   **Fields Available:** title, category, form_type, source_url, pdf_url, agency
*   **Risk Level:** Low
*   **Notes:** Request form for joint mediation under special education.

### SPEDTex Information Hub
*   **Source Name:** SPEDTex - Special Education Information Center
*   **Source URL:** [https://www.spedtex.org](https://www.spedtex.org)
*   **Resource Type:** portal
*   **Agency:** SPEDTex (funded by TEA contract)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Parent information hub contractually mandated by TEA.

---

## 5. Transition & Vocational Rehabilitation

### TWC Vocational Rehabilitation Services
*   **Source Name:** TWC Vocational Rehabilitation Services Page
*   **Source URL:** [https://www.twc.texas.gov/services/vocational-rehabilitation](https://www.twc.texas.gov/services/vocational-rehabilitation)
*   **Resource Type:** portal
*   **Agency:** Texas Workforce Commission (TWC)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Primary portal for vocational rehabilitation services in Texas.

### TWC VR Transition Youth Services
*   **Source Name:** TWC VR Transition Youth & Students
*   **Source URL:** [https://www.twc.texas.gov/services/vocational-rehabilitation/youth-students](https://www.twc.texas.gov/services/vocational-rehabilitation/youth-students)
*   **Resource Type:** legal_guide
*   **Agency:** Texas Workforce Commission (TWC)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Specialized portal for youth transition support services.

### HHSC Supported Decision-Making
*   **Source Name:** HHSC Supported Decision-Making Agreement sample
*   **Source URL:** [https://www.hhs.texas.gov/regulations/legal-information/supported-decision-making](https://www.hhs.texas.gov/regulations/legal-information/supported-decision-making)
*   **Resource Type:** form
*   **Agency:** Texas Health and Human Services Commission (HHSC)
*   **Target Table:** `staging_scraped_forms`
*   **Extraction Method:** Static page verify
*   **Fields Available:** title, category, form_type, source_url, pdf_url, agency
*   **Risk Level:** Low
*   **Notes:** Official sample agreement template under Texas Estates Code Chapter 1357.

### Texas ABLE Savings Program
*   **Source Name:** Texas ABLE savings account enrollment
*   **Source URL:** [https://www.texasable.org](https://www.texasable.org)
*   **Resource Type:** portal
*   **Agency:** Texas Prepaid Higher Education Tuition Board (ABLE Comptroller)
*   **Target Table:** `sources`
*   **Extraction Method:** Static page verify
*   **Fields Available:** url, type, confidence_rating
*   **Risk Level:** Low
*   **Notes:** Enrollment and management portal for Texas ABLE savings accounts.
