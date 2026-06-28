# Directory Public Trust Audit

Generated: 2026-06-28T00:24:27.778Z

Database: `frontend/ca_disability_navigator.db`

This audit measures public directory rows that would currently be suppressed because of missing provenance, placeholder contacts, placeholder names, or other trust issues.

## IEP Advocates

- Total rows: 137
- Public-eligible rows: 40
- Renderable rows: 40
- Blocked rows: 97

Top issues:
- invalid_public_phone: 97
- synthetic_source_url: 96
- synthetic_website: 96

Sample blocked rows:
- ga-adv-legal-statewide | Georgia Advocacy Office Legal Services | issues=invalid_public_phone
- ny-adv-local-legal-kings-ny | Kings Special Needs Advocacy & Legal Aid | issues=synthetic_source_url, synthetic_website, invalid_public_phone
- ny-prov-local-therapy-kings-ny | Kings Pediatric Therapy Services | issues=synthetic_source_url, synthetic_website, invalid_public_phone
- ny-adv-local-legal-queens-ny | Queens Special Needs Advocacy & Legal Aid | issues=synthetic_source_url, synthetic_website, invalid_public_phone
- ny-prov-local-therapy-queens-ny | Queens Pediatric Therapy Services | issues=synthetic_source_url, synthetic_website, invalid_public_phone
- ny-adv-local-legal-new-york-ny | New York Special Needs Advocacy & Legal Aid | issues=synthetic_source_url, synthetic_website, invalid_public_phone

## Resource Providers

- Total rows: 1
- Public-eligible rows: 0
- Renderable rows: 0
- Blocked rows: 1

Top issues:
- invalid_public_email: 1
- invalid_public_phone: 1
- invalid_service_tags: 1
- missing_data_origin: 1
- missing_last_checked_signal: 1
- missing_source_type: 1

Sample blocked rows:
- rp1 | Kids Clinic | issues=invalid_service_tags, missing_source_type, missing_data_origin, missing_last_checked_signal, invalid_public_phone, invalid_public_email

## Nonprofit Organizations

- Total rows: 1775
- Public-eligible rows: 1390
- Renderable rows: 1390
- Blocked rows: 385

Top issues:
- invalid_public_phone: 385
- synthetic_source_url: 42
- synthetic_website: 42
- invalid_availability_status: 1
- invalid_public_next_step_phone: 1
- invalid_service_tags: 1
- missing_data_origin: 1
- missing_last_checked_signal: 1
- missing_source_type: 1

Sample blocked rows:
- np1 | Parent Support Center | issues=invalid_availability_status, invalid_service_tags, missing_source_type, missing_data_origin, missing_last_checked_signal, invalid_public_phone, invalid_public_next_step_phone
- np-gen-alpine | Alpine Family Resource & Support Center | issues=synthetic_source_url, synthetic_website, invalid_public_phone
- np-gen-amador | Amador Family Resource & Support Center | issues=synthetic_source_url, synthetic_website, invalid_public_phone
- np-gen-butte | Butte Family Resource & Support Center | issues=synthetic_source_url, synthetic_website, invalid_public_phone
- np-gen-calaveras | Calaveras Family Resource & Support Center | issues=synthetic_source_url, synthetic_website, invalid_public_phone
- np-gen-colusa | Colusa Family Resource & Support Center | issues=synthetic_source_url, synthetic_website, invalid_public_phone

## County Offices

- Total rows: 720
- Public-eligible rows: 20
- Renderable rows: 19
- Blocked rows: 701

Top issues:
- not_public_county_office_eligible: 701
- not_public_record_eligible: 700

Sample blocked rows:
- office1 | LA IHSS Office | issues=not_public_record_eligible, not_public_county_office_eligible
- off-alameda-medi-cal | Alameda County Social Services - Medi-Cal Intake | issues=not_public_record_eligible, not_public_county_office_eligible
- off-alameda-ccs | Alameda County Health Department - CCS Program | issues=not_public_record_eligible, not_public_county_office_eligible
- off-alpine-ihss | Alpine County Social Services - IHSS Division | issues=not_public_record_eligible, not_public_county_office_eligible
- off-alpine-medi-cal | Alpine County Social Services - Medi-Cal Intake | issues=not_public_record_eligible, not_public_county_office_eligible
- off-alpine-ccs | Alpine County Health Department - CCS Program | issues=not_public_record_eligible, not_public_county_office_eligible

