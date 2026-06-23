# Batch 188 Idaho District Leaf Signal Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: district_or_county_education_routing
- failure_code: official_district_roots_now_show_live_special_services_leaf_signals_but_not_reviewed_county_grade_leaves

## Evidence

- Reviewed 2026-06-23 bounded live official Idaho SDE probes on https://www.sde.idaho.gov/school-districts/ and https://www.sde.idaho.gov/wp-json/wp/v2/pages/9049, then ran one bounded sample on five district-owned roots taken directly from the official directory. The official SDE surfaces still preserve 116 exact outbound district website links and 30 county-bearing names, but still expose no explicit county field, county filter, or district special-education contacts. The sampled district-owned roots prove the next lane is exact district leaf authoring from those local sites rather than another statewide reread: https://www.cassiaschools.org/sitemap.xml exposes https://www.cassiaschools.org/page/special-services/ and a `compliance504` route; https://www.payetteschools.org/ navigation exposes /our-district/departments/special-education; and https://www.sd25.us/ exposes /departments/special-services plus /schools-programs/special-programs on the public homepage and robots surface. Blaine County District homepage text also preserves special-education and 504 signals on the district-owned host even though an exact department leaf was not yet isolated in this bounded pass. A live DB reconciliation still shows all 44 Idaho county rows pointing at statewide SDE fallbacks rather than reviewed district-owned leaves: 42 rows use https://www.sde.idaho.gov/sped/ and 2 rows (Ada and Canyon) still use the generic SDE root https://www.sde.idaho.gov/. Idaho education therefore remains blocked, but the exact next lane is now narrower: author reviewed district-owned special-education or student-services leaves from the official district roots and their local sitemap/navigation signals.

## Repair decision

- Idaho remains blocked and not index-safe.
- The official statewide SDE directory still does not itself satisfy county-grade education routing.
- But sampled district-owned roots now prove the next honest lane is exact local leaf authoring from district sitemap/navigation signals, not more statewide directory or search churn.
- The county-local blocker remains unchanged in this pass.
