# Batch 257 Nebraska Office Schema Final Blocker Report v1

- state: Nebraska
- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: official_public_office_service_root_has_no_tables_no_relationships_and_only_37_distinct_counties

## Outcome

- Confirmed the public FeatureServer root exposes no tables.
- Confirmed the office schema is contact-only and contains no service-area or county-coverage fields.
- Confirmed USER_County values are single-county office rows only, not implicit service-area strings.
- Nebraska remains final-blocked on missing public county-assignment data.
