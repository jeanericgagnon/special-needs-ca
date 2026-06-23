# Arizona California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 83
- county_count: 15
- primary_gap_reason: des_host_challenge_plus_unmaterialized_report_cards_district_root_inventory

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_report_cards_district_roots_live_but_not_county_keyed (The official AZ School Report Cards host now preserves reviewable district-detail roots and API-backed local routing fields, but Arizona is still not county-grade because those district-specific roots have not yet been converted into one reviewed county-keyed district inventory and no exact district special-education leaves have been attached.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (reviewed first-party protection-and-advocacy evidence is present at the required authority level)
- parent_training_information_center: verified_state_grade (reviewed live first-party PTI designation text is present on the Encircle Families acknowledgements page)
- legal_aid: verified_state_grade (reviewed first-party statewide legal-aid evidence is present at the required authority level)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract (Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations, and no authored Arizona county-office leaf packet is currently present on disk to replace them.)

## Failure ledger

- district_or_county_education_routing: official_report_cards_district_detail_roots_live_but_not_yet_county_keyed_or_leaf_verified :: Reviewed 2026-06-23 bounded official Arizona report-cards checks beyond the generic inventory call. The public AZ School Report Cards app still exposes /api/Entity/GetEntityList and the live district detail route /districts/Detail/<educationOrganizationId>. The app bundle also reveals the exact local-detail contract: /api/Entity/GetEntity?id=<educationOrganizationId>&fiscalYear=2025 returns district-specific fields including nameOfInstitution, webSite, telephone, and address, and sample live calls for St Johns Unified District (educationOrganizationId 4153), Window Rock Unified District (4154), and Round Valley Unified District (4155) returned first-party district websites plus district phones and addresses. Arizona education therefore is no longer blocked by zero local-root inventory; it is now blocked because those reviewable district roots have not yet been materialized into a county-keyed Arizona district inventory and no district-owned special-education leaves have been verified from them.
- county_local_disability_resources: ahcccs_accessible_host_exposes_only_county_map_and_support_letters_no_office_contract :: Reviewed 2026-06-22 live Arizona DES candidates. The root, apply-benefits, Family Assistance Administration, FAA, office-locator, contact, robots.txt, and sitemap URLs all returned the Cloudflare "Just a moment..." HTTP 403 shell. The live county_offices table currently contains 14 Arizona rows still anchored to the DOI FAA placeholder https://doi.org/10.7910/DVN/AVRHMI and 1 row still anchored to the generic legacy root https://dhhs.arizona.gov/locations, and no authored Arizona county-office leaf packet is currently present on disk to replace them.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.azahcccs.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://www.azahcccs.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.arizona.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.azed.gov/specialeducation
- district_or_county_education_routing: blocked_report_cards_district_roots_live_but_not_county_keyed; samples=5; first=https://azreportcards.azed.gov/api/Entity/GetEntityList
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://des.az.gov/ddd
- protection_and_advocacy: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- parent_training_information_center: verified_state_grade; samples=1; first=https://encirclefamilies.org/about-us/acknowledgements/
- legal_aid: verified_state_grade; samples=1; first=http://www.disabilityrightsaz.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=2; first=https://www.azahcccs.gov
- county_local_disability_resources: blocked_ahcccs_accessible_host_without_county_office_contract; samples=9; first=https://des.az.gov/

## Next actions

- [critical] district_or_county_education_routing: materialize_reviewed_district_root_inventory_from_report_cards_api_then_map_counties_before_special_education_leaf_authoring
- [critical] county_local_disability_resources: author_reviewed_county_specific_office_leaves_before_reopening_browser_lane

## Completion decision

- Arizona remains BLOCKED and not index-safe.
- Education is sharper than the prior zero-root blocker: the official report-cards app now proves live district-detail roots and district website/address/phone fields, so the missing work is county-keyed root materialization plus exact special-education leaf verification, not another statewide-host guess.
- County/local disability resources are still blocked separately because the DES office lane remains challenge-blocked and the accessible AHCCCS artifacts still do not preserve a county-to-office contract.

