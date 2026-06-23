# Kansas California-Grade Education Leaf Rehydration v1

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 105
- primary_gap_reason: kansas_dd_authority_still_access_blocked_and_no_county_or_district_education_contract_preserved

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed live KanCare Home, Eligibility, and Appeals/Fair Hearings leaves now preserve Kansas Medicaid coverage, eligibility rules, and appeal routing on the official first-party stack.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (The live official KanCare stack now preserves reviewed HCBS waiver evidence even when sibling raw fetches to KDADS still hit access-denied shells: the KanCare home page explicitly says Kansas is developing the Community Support Waiver (CSW) to shorten the HCBS waiting list, and the official FS-7 KanCare fact sheet names seven HCBS waivers, including the Intellectual/Developmental Disability waiver, with application routing through the KanCare Clearinghouse.)
- developmental_disability_idd_authority: blocked_live_dd_authority_source_access_denied (Kansas now has a deterministic DD repair packet, but the family remains blocked because the only live state-agency DD row in the DB still points at the dead dhhs.kansas.gov/dd root and the reviewed KDADS replacement remains access denied. The next honest lane is exact alternative-official DD leaf review, not another generic statewide probe.)
- early_intervention_part_c: verified_state_grade (Reviewed live KSDE Early Childhood Special Education leaf again provides Kansas birth-to-three, Part C, KDHE administration, and the local ITS referral pointer.)
- special_education_idea_part_b: verified_state_grade (Reviewed live KSDE Special Education leaf again provides a role-pure IDEA Part B root and links to dispute-resolution plus parent-rights leaves on the same official path.)
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified (Kansas now has a deterministic district-routing authoring packet, but the family remains blocked because all 105 current school_district rows still point at statewide KSDE placeholders rather than reviewed district-owned leaves. The live KSDE map/report stack proves official statewide county and district roots exist, but it still does not preserve a reviewable county-to-district join or district-owned special-education contact contract.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Reviewed live DCF Rehabilitation Services Program Overview page replaced the old KDADS misclassification.)
- protection_and_advocacy: verified_state_grade (Reviewed first-party DRC Kansas evidence plus live About/Get Help pages prove the statewide protection-and-advocacy role and help path.)
- parent_training_information_center: verified_state_grade (Reviewed first-party Families Together evidence explicitly states that it is Kansas’ federally designated PTI.)
- legal_aid: verified_state_grade (Reviewed live Kansas Legal Services homepage explicitly proves the statewide legal-aid role.)
- able_program: verified_state_grade (Statewide ABLE crossover evidence remains reviewed and intact.)
- ssi_ssa_federal_reference: verified_state_grade (SSA crossover evidence remains reviewed and intact.)
- county_local_disability_resources: verified_state_grade (The official KanCare Ombudsman Counties in Alphabetical Order directory now exposes county-specific Community Resources guide links across all 105 Kansas counties on the live first-party stack.)

## Failure ledger

- developmental_disability_idd_authority: legacy_dd_root_dead_and_reviewed_replacement_access_blocked :: Reviewed 2026-06-22 current Kansas DD blocker artifacts plus the live state_resource_agencies DB rows. The only Kansas DD authority row still points at the dead legacy root https://dhhs.kansas.gov/dd, while the current reviewed replacement root on the KDADS host remains HTTP 403 Forbidden / access denied instead of serving DD, intake, or eligibility content. Kansas therefore still lacks a reviewed official DD authority leaf, but the next lane can now work from a deterministic DD repair packet that binds the stale DB row, the dead legacy root, and the blocked replacement host together on disk.
- district_or_county_education_routing: official_statewide_education_leaves_live_but_no_county_or_district_contract_preserved :: Reviewed 2026-06-22 current Kansas education blocker artifacts plus the live school_districts DB rows. All 105 Kansas county rows still point at the statewide KSDE root https://www.ksde.org/ with the same placeholder website https://www.ksde.org/Default.aspx?tabid=101. The official KSDE School District Maps page, Special Education root, Dispute Resolution page, Parent Rights page, Data Central Special Education Reports page, and the live USD county map PDF at https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5 remain the right statewide authoring roots, but the packet still preserves no reviewable county-to-district join and no district-owned special-education contact source. Kansas therefore still needs district-owned leaf authoring, but the next lane can now work from a deterministic packet instead of rereading the same statewide KSDE materials.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.kancare.ks.gov/
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=2; first=https://www.kancare.ks.gov/
- developmental_disability_idd_authority: blocked_live_dd_authority_source_access_denied; samples=0
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.ksde.gov/student-success/early-childhood/early-childhood-special-education
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.ksde.gov/policy-and-funding/special-education
- district_or_county_education_routing: blocked_exact_district_or_county_leafs_unverified; samples=1; first=https://www.ksde.gov/docs/default-source/sf/2025-usd-county-map.pdf?sfvrsn=8ceea3ce_5
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dcf.ks.gov/services/RS/Pages/default.aspx
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.drckansas.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://familiestogetherinc.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.kansaslegalservices.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/
- county_local_disability_resources: verified_state_grade; samples=105; first=https://www.kancare.ks.gov/members/help-resources/kancare-ombudsman/resources/counties-in-alphabetical-order

## Next actions

- [critical] developmental_disability_idd_authority: use_kansas_dd_repair_packet_to_try_reviewed_alt_official_dd_leaves_before_any_new_statewide_probe
- [critical] district_or_county_education_routing: use_kansas_district_leaf_packet_to_replace_105_ksde_placeholder_rows_with_reviewed_district_owned_special_education_leaves

## Completion decision

- Kansas remains BLOCKED and not index-safe.
- The DD family is still blocked because the only DB DD agency row still points at the dead dhhs.kansas.gov root and the reviewed KDADS replacement is still access denied, but the next lane now has an explicit DD repair packet instead of a generic browser-assisted note.
- County-grade education routing is still blocked because all 105 district rows still use one statewide KSDE placeholder, but the next lane now has a deterministic district-owned leaf packet built from the placeholder inventory and the reviewed KSDE statewide roots.

