# Batch 20 Leaf Target Verification Report v1

This pass uses the Batch 19 root-domain packets to fetch and verify exact county/district leaf targets for CA/PA/FL/GA/OH. It replaces generic-root evidence where exact leaves were verified, but it does not promote any state to COMPLETE unless every critical family actually passes.

## State results

- california: verified_leaf_targets=3; repaired_families=district_or_county_education_routing; classification=PARTIAL; index_safe=false
- pennsylvania: verified_leaf_targets=0; repaired_families=none; classification=PARTIAL; index_safe=false
- florida: verified_leaf_targets=4; repaired_families=developmental_disability_idd_authority, district_or_county_education_routing; classification=PARTIAL; index_safe=false
- georgia: verified_leaf_targets=4; repaired_families=developmental_disability_idd_authority, county_local_disability_resources; classification=BLOCKED; index_safe=false
- ohio: verified_leaf_targets=3; repaired_families=district_or_county_education_routing; classification=BLOCKED; index_safe=false

## Outcome

- Texas remains COMPLETE/index_safe and was not modified.
- States with verified exact leaves still remain gated until county/district coverage is fully re-proved.
