# State Source Targets: California (CA)

This document records the authoritative California source-target pack used to fill exact scrape coverage for benefits, DD routing, education, forms, providers, advocates, and verification sources.

Source of truth:

- [data/source_targets/california.json](/Users/ericgagnon/Documents/Ablefull/special-needs-ca/data/source_targets/california.json)

## Summary

- exact targets: `33`
- target tables covered:
  - `counties`
  - `county_offices`
  - `forms`
  - `iep_advocates`
  - `nonprofit_organizations`
  - `program_appeal_info`
  - `program_application_steps`
  - `program_document_requirements`
  - `program_eligibility_rules`
  - `programs`
  - `regional_education_agencies`
  - `resource_providers`
  - `sources`
  - `state_resource_agencies`

## Key Coverage

### Benefits and county offices

- California DHCS Medi-Cal Homepage
- BenefitsCal
- BenefitsCal County Offices
- Covered California
- California Children's Services
- California Department of Social Services State Hearings

### DD and early intervention

- California DDS Homepage
- California DDS Regional Centers
- California DDS Eligibility
- California DDS Apply for Services
- California DDS Family Support Services
- California Early Start
- California Family Resource Centers Network

### Special education and appeals

- California Department of Education Special Education
- California SELPA Directory
- California Procedural Safeguards Referral Service
- California CDE Special Education Complaint Process
- California OAH Special Education Division

### Legal, nonprofit, and advocate support

- Disability Rights California
- Matrix Parent Network and Resource Center
- LawHelpCA
- The Arc of California
- Office of Clients' Rights Advocacy

### Transition and providers

- California Department of Rehabilitation
- CalABLE
- UC Davis MIND Institute
- Children's Hospital Los Angeles Boone Fetter Clinic
- Stanford Children's Health Autism Services

### Verification and forms

- California DHCS Forms and Publications
- California Open Data Portal

## Notes

- This closes the prior planning gap where California had authored seed rows but no full state source-target JSON file.
- The JSON file is now the canonical California pack for downstream ledger and gap-closure artifact generation.
- `LawHelpCA` remains a discovery-oriented legal-aid source and should still be used conservatively for first-party discovery rather than direct promotion.
