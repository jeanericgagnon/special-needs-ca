# North Dakota Blocker Packets v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 75
- county_count: 53
- primary_gap_reason: generic_or_statewide_evidence_used_where_local_required

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: legacy_state_grade (Reviewed 2026-06-23 the current North Dakota education-routing packet. The current district or county education-routing labels are still state-root-backed district labels that collapse to the statewide `https://www.nd.gov/` surface, including rows labeled as Burleigh and Cass special education. The blocker is therefore a missing district-owned local leaves authoring gap with no trustworthy local leaves yet preserved on disk.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party NDP&A evidence preserves statewide protection-and-advocacy identity on the live first-party domain)
- parent_training_information_center: verified_state_grade (reviewed first-party Pathfinder evidence preserves statewide nonprofit scope and explicit Parent Training and Information (PTI) identity)
- legal_aid: missing (Reviewed 2026-06-23 the current North Dakota statewide-support set. P&A and PTI are now covered by reviewed first-party sources, but statewide legal-aid support still has no reviewed first-party or authoritative statewide artifact on disk. The remaining legal-aid work is a standalone source-family packet, not part of county or district leaf repair.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (Reviewed 2026-06-23 the current North Dakota county-local packet. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned Human Service Zone or local assistance directories, so those rows cannot remain California-grade local proof. The blocker is explicitly a county-owned replacement packet, not a discovery-only gap.)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Reviewed 2026-06-23 the current North Dakota education-routing packet. The current district or county education-routing labels are still state-root-backed district labels that collapse to the statewide `https://www.nd.gov/` surface, including rows labeled as Burleigh and Cass special education. The blocker is therefore a missing district-owned local leaves authoring gap with no trustworthy local leaves yet preserved on disk.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: Reviewed 2026-06-23 the current North Dakota county-local packet. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned Human Service Zone or local assistance directories, so those rows cannot remain California-grade local proof. The blocker is explicitly a county-owned replacement packet, not a discovery-only gap.
- legal_aid: missing_required_source_family :: Reviewed 2026-06-23 the current North Dakota statewide-support set. P&A and PTI are now covered by reviewed first-party sources, but statewide legal-aid support still has no reviewed first-party or authoritative statewide artifact on disk. The remaining legal-aid work is a standalone source-family packet, not part of county or district leaf repair.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.hhs.nd.gov/dd/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.north-dakota.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.north-dakota.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.nd.gov/
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.nd.gov/
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.hhs.nd.gov/dd
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.ndpanda.org/home
- parent_training_information_center: verified_state_grade; samples=1; first=https://pathfinder-nd.org/
- legal_aid: missing; samples=0
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [major] legal_aid: author_or_verify_statewide_source_family
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Packetized blockers

- `district_or_county_education_routing` is now an exact local-leaf authoring packet: the current state-root-backed district labels are preserved only as blocker evidence.
- `county_local_disability_resources` is now a county-owned directory replacement packet: DOI mirror rows are preserved only as blocker evidence, not as local proof.
- `legal_aid` is now a standalone statewide source-family packet.

## Completion decision

- North Dakota remains `BLOCKED` and `index_safe=false`.
- Education remains blocked on missing district-owned local leaves.
- County-local remains blocked on DOI-backed non-local proof.
- Legal aid remains blocked on missing statewide source-family evidence.
