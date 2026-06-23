# North Carolina Blocker Packets v3

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
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
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-23 the authoritative NDRN member-agencies directory plus the live Disability Rights North Carolina first-party host. The NDRN directory lists `Disability Rights North Carolina` with Raleigh contact information and the `disabilityrightsnc.org` website, and the live DRNC homepage preserves the explicit description `Disability Rights North Carolina (DRNC) is the federally designated protection and advocacy agency for the State of North Carolina.` North Carolina therefore now has reviewed statewide protection-and-advocacy proof.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-23 the authoritative Parent Center Hub North Carolina leaf plus the ECAC first-party host already preserved on disk. `https://www.parentcenterhub.org/findurcenter/north-carolina/` explicitly says `North Carolina PTI (Serving all North Carolina)` and names `ECAC, Inc. (Exceptional Children’s Assistance Center)` with direct contact information and the ECAC host. North Carolina therefore now has reviewed statewide PTI designation and scope proof.)
- legal_aid: verified_state_grade (Reviewed 2026-06-23 the live Legal Aid of North Carolina first-party host. `https://legalaidnc.org/` preserves the title `Legal Aid - Legal Aid of North Carolina` and H1 `North Carolina's Non Profit Law Firm`, while `https://legalaidnc.org/get-help/` says `We provide free legal help to low-income North Carolinians in civil cases involving basic human needs`, and `https://legalaidnc.org/about-us/` preserves `Legal Aid of North Carolina is a statewide, no...` mission statement. North Carolina therefore now has reviewed statewide legal-aid proof from a first-party source.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: legacy_state_grade (Reviewed 2026-06-23 the current North Carolina county-local packet. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned DSS or local assistance directories, so those rows cannot remain California-grade local proof. The blocker is now explicitly a county-owned local office replacement packet, not a generic local-resource shortage.)

## Failure ledger

- district_or_county_education_routing: generic_or_statewide_evidence_used_where_local_required :: Reviewed 2026-06-23 the current North Carolina education-routing packet. The state still preserves one real district-owned exact leaf at Charlotte-Mecklenburg Schools, but many remaining counties still collapse to the statewide DPI Exceptional Children root or other generic/non-district leaves. The blocker is therefore an exact district-leaf authoring gap, not a missing statewide education authority gap.
- county_local_disability_resources: generic_or_statewide_evidence_used_where_local_required :: Reviewed 2026-06-23 the current North Carolina county-local packet. The saved county-local samples still point at the DOI mirror `https://doi.org/10.7910/DVN/AVRHMI` rather than reviewed county-owned DSS or local assistance directories, so those rows cannot remain California-grade local proof. The blocker is now explicitly a county-owned local office replacement packet, not a generic local-resource shortage.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ablenrc.org
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.ncdhhs.gov/innovations/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.north-carolina.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.north-carolina.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.dpi.nc.gov/districts-schools/classroom-resources/exceptional-children
- district_or_county_education_routing: legacy_state_grade; samples=3; first=https://www.cmsk12.org/Page/213
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.ncdhhs.gov/divisions/eipd
- protection_and_advocacy: verified_state_grade; samples=2; first=https://www.ndrn.org/about/ndrn-member-agencies/
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.parentcenterhub.org/findurcenter/north-carolina/
- legal_aid: verified_state_grade; samples=2; first=https://legalaidnc.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: legacy_state_grade; samples=3; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: author_county_or_district_exact_targets
- [critical] county_local_disability_resources: author_county_or_district_exact_targets

## Statewide support repair

- `protection_and_advocacy` is now verified from the authoritative NDRN member-agencies directory plus the live DRNC first-party host.
- `parent_training_information_center` is now verified from the authoritative Parent Center Hub North Carolina leaf, which explicitly says `North Carolina PTI (Serving all North Carolina)` and names ECAC.
- `legal_aid` is now verified from the live Legal Aid of North Carolina first-party host and its get-help / about-us leaves.

## Completion decision

- North Carolina remains `BLOCKED` and `index_safe=false`.
- Education remains blocked on missing district-owned local leaves beyond the single Charlotte-Mecklenburg anchor.
- County-local remains blocked on DOI-backed non-county-owned rows.
- Statewide support families are no longer blockers.
