# Launch Partial-State Policy v1

This artifact defines the launch-safe treatment for the 5 blocked states while the 45 complete states remain fully launchable and index-safe.

## Rule

- `COMPLETE` + `indexSafe=true`: fully launchable and indexable
- `BLOCKED`: may remain renderable only in a `partial_gated` mode
- `partial_gated` states must stay `noindex`
- suppressed surfaces must not render county, district, city, or other local claims that rely on the blocked family

## Partial / gated states

| State | Suppressed families | Allowed surfaces | Suppressed surfaces |
|---|---|---|---|
| Arizona | `county_local_disability_resources` | `state-hub` | `programs-index`, `program-guide`, `state-counties-hub`, `condition-hub`, `county-hub`, `county-condition`, `school-district`, `city` |
| Alaska | `county_local_disability_resources` | `state-hub` | `programs-index`, `program-guide`, `state-counties-hub`, `condition-hub`, `county-hub`, `county-condition`, `school-district`, `city` |
| Maine | `county_local_disability_resources` | `state-hub` | `programs-index`, `program-guide`, `state-counties-hub`, `condition-hub`, `county-hub`, `county-condition`, `school-district`, `city` |
| Idaho | `district_or_county_education_routing`, `county_local_disability_resources` | `state-hub` | `programs-index`, `program-guide`, `state-counties-hub`, `condition-hub`, `county-hub`, `county-condition`, `school-district`, `city` |
| New Hampshire | `medicaid_state_health_coverage`, `medicaid_waiver_hcbs_disability_services`, `developmental_disability_idd_authority`, `early_intervention_part_c`, `district_or_county_education_routing`, `vocational_rehabilitation_pre_ets`, `county_local_disability_resources` | `state-hub` | `programs-index`, `program-guide`, `state-counties-hub`, `condition-hub`, `county-hub`, `county-condition`, `school-district`, `city` |

## Launch intent

- The 45 complete states remain fully launchable.
- The 5 blocked states no longer block launch.
- Their statewide audit surfaces may remain visible.
- Their missing local families must stay suppressed, explicitly unavailable, and `noindex`.
