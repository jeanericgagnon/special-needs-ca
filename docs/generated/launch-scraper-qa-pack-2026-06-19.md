# Launch Scraper QA Pack

Generated: 2026-06-19T23:21:11.632Z

Real-artifact QA pack for launch scraper families using saved accepted and rejected records from source-acquisition runs.

## dd_routing

- hasRealAcceptedCase: true
- hasRealRejectedCase: true
- qaReady: true
- acceptedCase:
  - runId: 2026-06-19T01-46-07-185Z
  - stateId: florida
  - sourceUrl: https://www.floridaearlysteps.com/
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T01-46-07-185Z/pages/00005-florida-dd-routing-florida-early-steps-program.html
  - parseStatus: parsed
- rejectedCase:
  - runId: 2026-06-19T01-46-07-185Z
  - stateId: new-jersey
  - sourceUrl: https://www.nj.gov/humanservices/ddd
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T01-46-07-185Z/pages/00001-new-jersey-dd-routing-new-jersey-division-of-developmental-disabilities.html
  - validationReasons: missing_dd_contact_signal
- recommendedAssertions: accepted case should preserve sourceUrl/finalUrl/stateId and expected family extraction | rejected case should preserve validationReasons exactly as saved on disk

## programs_benefits

- hasRealAcceptedCase: true
- hasRealRejectedCase: true
- qaReady: true
- acceptedCase:
  - runId: 2026-06-18T23-18-00-538Z
  - stateId: california
  - sourceUrl: https://www.coveredca.com/
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T23-18-00-538Z/pages/00014-california-programs-benefits-covered-california.html
  - parseStatus: parsed
- rejectedCase:
  - runId: 2026-06-18T23-22-47-034Z
  - stateId: kentucky
  - sourceUrl: https://dbhdid.ky.gov/
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T23-22-47-034Z/pages/00001-kentucky-programs-benefits-kentucky-self-direction-services.html
  - validationReasons: missing_action_signal
- recommendedAssertions: accepted case should preserve sourceUrl/finalUrl/stateId and expected family extraction | rejected case should preserve validationReasons exactly as saved on disk

## waivers

- hasRealAcceptedCase: true
- hasRealRejectedCase: true
- qaReady: true
- acceptedCase:
  - runId: 2026-06-18T23-21-16-378Z
  - stateId: missouri
  - sourceUrl: https://dmh.mo.gov/dev-disabilities/hcbs
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T23-21-16-378Z/pages/00013-missouri-waivers-missouri-hcbs-waivers.html
  - parseStatus: parsed
- rejectedCase:
  - runId: 2026-06-19T00-59-54-445Z
  - stateId: kentucky
  - sourceUrl: https://dbhdid.ky.gov/hcbs
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T00-59-54-445Z/pages/00001-kentucky-waivers-kentucky-hcbs-waivers.html
  - validationReasons: missing_action_signal
- recommendedAssertions: accepted case should preserve sourceUrl/finalUrl/stateId and expected family extraction | rejected case should preserve validationReasons exactly as saved on disk

## forms_guides

- hasRealAcceptedCase: true
- hasRealRejectedCase: true
- qaReady: true
- acceptedCase:
  - runId: 2026-06-18T22-50-55-042Z
  - stateId: illinois
  - sourceUrl: https://www.illinois.gov/hfs/MedicalPrograms/AllKids/Pages/default.aspx
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T22-50-55-042Z/pages/00009-illinois-forms-guides-illinois-all-kids-app-guide.html
  - parseStatus: parsed
- rejectedCase:
  - runId: 2026-06-18T22-58-57-693Z
  - stateId: california
  - sourceUrl: https://www.dhcs.ca.gov/services/medi-cal/pages/apply_for_medi-cal.aspx
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T22-58-57-693Z/pages/00001-california-forms-guides-california-medi-cal-application-single-streamlined-form.html
  - validationReasons: missing_title_and_heading, missing_form_program_name
- recommendedAssertions: accepted case should preserve sourceUrl/finalUrl/stateId and expected family extraction | rejected case should preserve validationReasons exactly as saved on disk

## program_waitlists

- hasRealAcceptedCase: true
- hasRealRejectedCase: true
- qaReady: true
- acceptedCase:
  - runId: 2026-06-19T00-16-10-127Z
  - stateId: pennsylvania
  - sourceUrl: https://www.dhs.pa.gov/Services/Disabilities-Aging/Pages/ODP-Waivers.aspx
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T00-16-10-127Z/pages/00002-pennsylvania-program-waitlists-odp-community-living-waiver-enrollment-queue.html
  - parseStatus: parsed
- rejectedCase:
  - runId: 2026-06-19T01-05-07-122Z
  - stateId: kentucky
  - sourceUrl: https://dbhdid.ky.gov/
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T01-05-07-122Z/pages/00002-kentucky-program-waitlists-kentucky-self-direction-services-enrollment-queue.html
  - validationReasons: missing_action_signal
- recommendedAssertions: accepted case should preserve sourceUrl/finalUrl/stateId and expected family extraction | rejected case should preserve validationReasons exactly as saved on disk

## medicaid_hhs_offices

- hasRealAcceptedCase: true
- hasRealRejectedCase: true
- qaReady: true
- acceptedCase:
  - runId: 2026-06-19T01-12-06-353Z
  - stateId: georgia
  - sourceUrl: https://dfcs.georgia.gov/locations
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T01-12-06-353Z/pages/00003-georgia-medicaid-hhs-offices-georgia-division-of-family-and-children-services-dfcs-county-directory.html
  - parseStatus: parsed
- rejectedCase:
  - runId: 2026-06-19T01-15-57-999Z
  - stateId: illinois
  - sourceUrl: https://www.dhs.state.il.us/page.aspx?module=12
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T01-15-57-999Z/pages/00002-illinois-medicaid-hhs-offices-idhs-family-community-resource-centers-fcrc-locator.html
  - validationReasons: missing_office_address
- recommendedAssertions: accepted case should preserve sourceUrl/finalUrl/stateId and expected family extraction | rejected case should preserve validationReasons exactly as saved on disk

## education_routing

- hasRealAcceptedCase: true
- hasRealRejectedCase: true
- qaReady: true
- acceptedCase:
  - runId: 2026-06-19T00-41-49-096Z
  - stateId: new-york
  - sourceUrl: https://data.nysed.gov/
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T00-41-49-096Z/pages/00001-new-york-education-routing-nys-school-district-profiles.html
  - parseStatus: needs_review
- rejectedCase:
  - runId: curated_saved_page_replay
  - stateId: florida
  - sourceUrl: https://www.fldoe.org/schools/school-choice/k-12-schools/
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T00-42-52-835Z/pages/00004-florida-education-routing-florida-school-district-directory.html
  - validationReasons: missing_basic_signal
- recommendedAssertions: accepted case should preserve sourceUrl/finalUrl/stateId and expected family extraction | rejected case should preserve validationReasons exactly as saved on disk

## providers_care

- hasRealAcceptedCase: true
- hasRealRejectedCase: true
- qaReady: true
- acceptedCase:
  - runId: 2026-06-19T01-34-25-789Z
  - stateId: new-york
  - sourceUrl: https://childrenshospital.northwell.edu/departments-services
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T01-34-25-789Z/pages/00001-new-york-providers-care-cohen-children-s-medical-center-departments-and-services.html
  - parseStatus: parsed
- rejectedCase:
  - runId: 2026-06-19T01-34-25-789Z
  - stateId: georgia
  - sourceUrl: https://www.marcus.org/care-and-services/medical-services
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T01-34-25-789Z/pages/00006-georgia-providers-care-marcus-autism-center-medical-services.html
  - validationReasons: missing_provider_contact_signal
- recommendedAssertions: accepted case should preserve sourceUrl/finalUrl/stateId and expected family extraction | rejected case should preserve validationReasons exactly as saved on disk

## knowledge_content

- hasRealAcceptedCase: true
- hasRealRejectedCase: true
- qaReady: true
- acceptedCase:
  - runId: 2026-06-19T01-39-53-513Z
  - stateId: national
  - sourceUrl: https://sites.ed.gov/idea/regs/b/d/300.304
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-19T01-39-53-513Z/pages/00003-national-knowledge-content-idea-evaluation-procedures.html
  - parseStatus: parsed
- rejectedCase:
  - runId: curated_saved_page_replay
  - stateId: national
  - sourceUrl: https://www.ssa.gov/benefits/disability/apply-child.html
  - savedPath: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source-acquisition-runs/2026-06-18T03-38-52-430Z/pages/00005-national-knowledge-content-ssa-apply-for-child-disability-benefits.html
  - validationReasons: knowledge_summary_too_thin
- recommendedAssertions: accepted case should preserve sourceUrl/finalUrl/stateId and expected family extraction | rejected case should preserve validationReasons exactly as saved on disk

