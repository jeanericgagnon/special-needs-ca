# Batch 21 Statewide Mapping Repair Report v1

This pass converts Batch 20 exact leaves into statewide county-grade repairs only when the verified leaf itself carries explicit structured county coverage in static official HTML. Local-only or interactive-only leaves remain partial.

## State results

- california: repaired_families=none; unresolved_families=district_or_county_education_routing; classification=PARTIAL; index_safe=false
- pennsylvania: repaired_families=none; unresolved_families=district_or_county_education_routing, county_local_disability_resources; classification=PARTIAL; index_safe=false
- florida: repaired_families=developmental_disability_idd_authority; unresolved_families=district_or_county_education_routing; classification=PARTIAL; index_safe=false
- georgia: repaired_families=county_local_disability_resources; unresolved_families=developmental_disability_idd_authority; classification=BLOCKED; index_safe=false
- ohio: repaired_families=none; unresolved_families=district_or_county_education_routing; classification=BLOCKED; index_safe=false

## Outcome

- repaired_family_count: 2
- unresolved_family_count: 6
- No state was promoted COMPLETE/index_safe in this pass.
- Texas remains COMPLETE/index_safe and was not modified.
