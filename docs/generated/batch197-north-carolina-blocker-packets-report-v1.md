# North Carolina Blocker Packets v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 58
- county_count: 100
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (Reviewed 2026-06-23 the current North Carolina education-routing packet. The state still preserves one real district-owned exact leaf at Charlotte-Mecklenburg Schools, but many remaining counties still collapse to the statewide DPI Exceptional Children root or other generic/non-district leaves. The blocker is therefore an exact district-leaf authoring gap, not a missing statewide education authority gap.)
- vocational_rehabilitation_pre_ets: verified_state_grade (reviewed first-party EIPD evidence preserves statewide vocational rehabilitation routing and local office coverage language)
- protection_and_advocacy: missing (Reviewed 2026-06-23 the current statewide-support blocker set. North Carolina still lacks any reviewed statewide first-party protection-and-advocacy artifact, any reviewed statewide legal-aid artifact, and any fetched PTI leaf that explicitly preserves statewide North Carolina PTI designation. The ECAC homepage is useful support context, but homepage PTI navigation alone is not designation proof.)
- parent_training_information_center: inventory_only (Reviewed 2026-06-23 the current statewide-support blocker set. North Carolina still lacks any reviewed statewide first-party protection-and-advocacy artifact, any reviewed statewide legal-aid artifact, and any fetched PTI leaf that explicitly preserves statewide North Carolina PTI designation. The ECAC homepage is useful support context, but homepage PTI navigation alone is not designation proof.)
- legal_aid: missing (Reviewed 2026-06-23 the current statewide-support blocker set. North Carolina still lacks any reviewed statewide first-party protection-and-advocacy artifact, any reviewed statewide legal-aid artifact, and any fetched PTI leaf that explicitly preserves statewide North Carolina PTI designation. The ECAC homepage is useful support context, but homepage PTI navigation alone is not designation proof.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (Reviewed 2026-06-23 the current North Carolina county-local packet. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned DSS or local assistance directories, so those rows cannot remain California-grade local proof. The blocker is now explicitly a county-owned local office replacement packet, not a generic local-resource shortage.)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Reviewed 2026-06-23 the current North Carolina education-routing packet. The state still preserves one real district-owned exact leaf at Charlotte-Mecklenburg Schools, but many remaining counties still collapse to the statewide DPI Exceptional Children root or other generic/non-district leaves. The blocker is therefore an exact district-leaf authoring gap, not a missing statewide education authority gap.
- protection_and_advocacy: missing_required_source_family :: Reviewed 2026-06-23 the current statewide-support blocker set. North Carolina still lacks any reviewed statewide first-party protection-and-advocacy artifact, any reviewed statewide legal-aid artifact, and any fetched PTI leaf that explicitly preserves statewide North Carolina PTI designation. The ECAC homepage is useful support context, but homepage PTI navigation alone is not designation proof.
- parent_training_information_center: legacy_or_inventory_only_evidence :: Reviewed 2026-06-23 the current statewide-support blocker set. North Carolina still lacks any reviewed statewide first-party protection-and-advocacy artifact, any reviewed statewide legal-aid artifact, and any fetched PTI leaf that explicitly preserves statewide North Carolina PTI designation. The ECAC homepage is useful support context, but homepage PTI navigation alone is not designation proof.
- legal_aid: missing_required_source_family :: Reviewed 2026-06-23 the current statewide-support blocker set. North Carolina still lacks any reviewed statewide first-party protection-and-advocacy artifact, any reviewed statewide legal-aid artifact, and any fetched PTI leaf that explicitly preserves statewide North Carolina PTI designation. The ECAC homepage is useful support context, but homepage PTI navigation alone is not designation proof.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: Reviewed 2026-06-23 the current North Carolina county-local packet. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned DSS or local assistance directories, so those rows cannot remain California-grade local proof. The blocker is now explicitly a county-owned local office replacement packet, not a generic local-resource shortage.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.ncdhhs.gov/innovations/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.north-carolina.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.north-carolina.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.dpi.nc.gov/districts-schools/classroom-resources/exceptional-children
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.cmsk12.org/Page/213
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.ncdhhs.gov/divisions/eipd
- protection_and_advocacy: missing; samples=0
- parent_training_information_center: inventory_only; samples=1; first=https://www.ecac-parentcenter.org/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] protection_and_advocacy: author_or_verify_statewide_source_family
- [major] parent_training_information_center: author_verified_state_manifest
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Packetized blockers

- `district_or_county_education_routing` is now an exact district-leaf authoring packet: Charlotte-Mecklenburg is the only reviewed local anchor, and the statewide DPI root is explicitly exhausted as county proof.
- `county_local_disability_resources` is now a county-owned directory replacement packet: DOI mirror rows are preserved only as blocker evidence, not as usable local proof.
- `protection_and_advocacy`, `legal_aid`, and `parent_training_information_center` are now separated into a statewide-source-family packet so later work does not mix source-family repair with county/district leaf repair.

## Completion decision

- North Carolina remains `BLOCKED` and `index_safe=false`.
- Education remains blocked on missing district-owned local leaves beyond the single Charlotte-Mecklenburg anchor.
- County-local remains blocked on DOI-backed non-county-owned rows.
- Statewide support families remain blocked on missing reviewed first-party artifacts or explicit PTI designation proof.
