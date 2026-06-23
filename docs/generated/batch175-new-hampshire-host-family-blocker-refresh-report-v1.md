# New Hampshire California-Grade Host-Family Blocker Refresh v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 42
- county_count: 10
- primary_gap_reason: official_nh_public_host_families_access_denied_and_saved_dhhs_replacement_hosts_unresolvable

## Family status

- medicaid_state_health_coverage: blocked_current_nh_dhhs_replacement_host_unresolvable (Reviewed 2026-06-23 exact first-party checks on the current-looking `dhhs.new-hampshire.gov` hostnames already saved in the packet. The root `https://dhhs.new-hampshire.gov/` plus the saved Medicaid/DD/waiver/early-intervention paths `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` all fail DNS resolution in bounded review. Those replacement-host assumptions therefore cannot remain verified statewide evidence.)
- medicaid_waiver_hcbs_disability_services: blocked_current_nh_dhhs_replacement_host_unresolvable (Reviewed 2026-06-23 exact first-party checks on the current-looking `dhhs.new-hampshire.gov` hostnames already saved in the packet. The root `https://dhhs.new-hampshire.gov/` plus the saved Medicaid/DD/waiver/early-intervention paths `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` all fail DNS resolution in bounded review. Those replacement-host assumptions therefore cannot remain verified statewide evidence.)
- developmental_disability_idd_authority: blocked_current_nh_dhhs_replacement_host_unresolvable (Reviewed 2026-06-23 exact first-party checks on the current-looking `dhhs.new-hampshire.gov` hostnames already saved in the packet. The root `https://dhhs.new-hampshire.gov/` plus the saved Medicaid/DD/waiver/early-intervention paths `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` all fail DNS resolution in bounded review. Those replacement-host assumptions therefore cannot remain verified statewide evidence.)
- early_intervention_part_c: blocked_current_nh_dhhs_replacement_host_unresolvable (Reviewed 2026-06-23 exact first-party checks on the current-looking `dhhs.new-hampshire.gov` hostnames already saved in the packet. The root `https://dhhs.new-hampshire.gov/` plus the saved Medicaid/DD/waiver/early-intervention paths `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` all fail DNS resolution in bounded review. Those replacement-host assumptions therefore cannot remain verified statewide evidence.)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: blocked_official_nh_doe_host_family_access_denied (Reviewed 2026-06-23 bounded browser-style probes on the official New Hampshire education host family. `www.education.nh.gov` root plus exact district-directory leaves and the alternate `my.doe.nh.gov` host all return the same short `Access Denied` shell, so no reviewed district- or county-grade education routing chain is publicly fetchable from the official education stack.)
- vocational_rehabilitation_pre_ets: blocked_official_nh_vr_host_family_access_denied_or_unresolvable (Reviewed 2026-06-23 the current New Hampshire VR lane against the likely official host family. The legacy root `dhhs.new-hampshire.gov/rehab` no longer resolves, `www.nhes.nh.gov` root plus the BVR disabilities path return the same short `Access Denied` shell, and `www.nheasy.nh.gov` does not resolve. No reviewed first-party VR or Pre-ETS surface is publicly fetchable from the current official host family.)
- protection_and_advocacy: verified_state_grade (reviewed first-party DRC-NH history and funding pages explicitly preserve that the organization was designated by the governor as New Hampshire's Protection and Advocacy agency and continues to receive core P&A program funding)
- parent_training_information_center: verified_state_grade (reviewed first-party Parent Information Center of NH evidence preserves statewide parent-center identity, special-education support, and Department of Education funding)
- legal_aid: verified_state_grade (reviewed first-party NH Legal Assistance and 603 Legal Aid pages explicitly preserve statewide free civil legal aid and a centralized statewide intake route for New Hampshire residents)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: blocked_official_nh_dhhs_host_family_access_denied (Reviewed 2026-06-23 bounded browser-style probes on the official New Hampshire DHHS host family. `www.dhhs.nh.gov` root plus the exact `/contact-us` and `/contact-us/district-offices` leaves all return the same short `Access Denied` shell, so the old DOI-derived county-office rows still have no reviewed official county-owned replacement.)

## Failure ledger

- district_or_county_education_routing: official_nh_doe_host_family_returns_access_denied_shell :: Reviewed 2026-06-23 bounded browser-style probes on the official New Hampshire education host family. `www.education.nh.gov` root plus exact district-directory leaves and the alternate `my.doe.nh.gov` host all return the same short `Access Denied` shell, so no reviewed district- or county-grade education routing chain is publicly fetchable from the official education stack.
- vocational_rehabilitation_pre_ets: official_nh_vr_host_family_returns_access_denied_or_unresolvable :: Reviewed 2026-06-23 the current New Hampshire VR lane against the likely official host family. The legacy root `dhhs.new-hampshire.gov/rehab` no longer resolves, `www.nhes.nh.gov` root plus the BVR disabilities path return the same short `Access Denied` shell, and `www.nheasy.nh.gov` does not resolve. No reviewed first-party VR or Pre-ETS surface is publicly fetchable from the current official host family.
- county_local_disability_resources: official_nh_dhhs_host_family_returns_access_denied_shell :: Reviewed 2026-06-23 bounded browser-style probes on the official New Hampshire DHHS host family. `www.dhhs.nh.gov` root plus the exact `/contact-us` and `/contact-us/district-offices` leaves all return the same short `Access Denied` shell, so the old DOI-derived county-office rows still have no reviewed official county-owned replacement.
- medicaid_state_health_coverage: current_nh_dhhs_replacement_host_family_unresolvable :: Reviewed 2026-06-23 exact first-party checks on the current-looking `dhhs.new-hampshire.gov` hostnames already saved in the packet. The root `https://dhhs.new-hampshire.gov/` plus the saved Medicaid/DD/waiver/early-intervention paths `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` all fail DNS resolution in bounded review. Those replacement-host assumptions therefore cannot remain verified statewide evidence.
- medicaid_waiver_hcbs_disability_services: current_nh_dhhs_replacement_host_family_unresolvable :: Reviewed 2026-06-23 exact first-party checks on the current-looking `dhhs.new-hampshire.gov` hostnames already saved in the packet. The root `https://dhhs.new-hampshire.gov/` plus the saved Medicaid/DD/waiver/early-intervention paths `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` all fail DNS resolution in bounded review. Those replacement-host assumptions therefore cannot remain verified statewide evidence.
- developmental_disability_idd_authority: current_nh_dhhs_replacement_host_family_unresolvable :: Reviewed 2026-06-23 exact first-party checks on the current-looking `dhhs.new-hampshire.gov` hostnames already saved in the packet. The root `https://dhhs.new-hampshire.gov/` plus the saved Medicaid/DD/waiver/early-intervention paths `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` all fail DNS resolution in bounded review. Those replacement-host assumptions therefore cannot remain verified statewide evidence.
- early_intervention_part_c: current_nh_dhhs_replacement_host_family_unresolvable :: Reviewed 2026-06-23 exact first-party checks on the current-looking `dhhs.new-hampshire.gov` hostnames already saved in the packet. The root `https://dhhs.new-hampshire.gov/` plus the saved Medicaid/DD/waiver/early-intervention paths `https://dhhs.new-hampshire.gov/dd`, `https://dhhs.new-hampshire.gov/dd/waivers`, and `https://dhhs.new-hampshire.gov/earlystart` all fail DNS resolution in bounded review. Those replacement-host assumptions therefore cannot remain verified statewide evidence.

## Verified source samples

- medicaid_state_health_coverage: blocked_current_nh_dhhs_replacement_host_unresolvable; samples=2; first=https://dhhs.new-hampshire.gov/
- medicaid_waiver_hcbs_disability_services: blocked_current_nh_dhhs_replacement_host_unresolvable; samples=1; first=https://dhhs.new-hampshire.gov/dd/waivers
- developmental_disability_idd_authority: blocked_current_nh_dhhs_replacement_host_unresolvable; samples=1; first=https://dhhs.new-hampshire.gov/dd
- early_intervention_part_c: blocked_current_nh_dhhs_replacement_host_unresolvable; samples=1; first=https://dhhs.new-hampshire.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://www.education.nh.gov/
- district_or_county_education_routing: blocked_official_nh_doe_host_family_access_denied; samples=4; first=https://www.education.nh.gov/
- vocational_rehabilitation_pre_ets: blocked_official_nh_vr_host_family_access_denied_or_unresolvable; samples=4; first=https://dhhs.new-hampshire.gov/rehab
- protection_and_advocacy: verified_state_grade; samples=2; first=https://drcnh.org/about-us/history/
- parent_training_information_center: verified_state_grade; samples=1; first=https://picnh.org/
- legal_aid: verified_state_grade; samples=2; first=https://www.nhla.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: blocked_official_nh_dhhs_host_family_access_denied; samples=4; first=https://doi.org/10.7910/DVN/AVRHMI

## Next actions

- [critical] district_or_county_education_routing: hold_blocked_until_public_nh_education_export_or_browser_reviewable_directory_is_preserved
- [critical] county_local_disability_resources: hold_blocked_until_public_nh_dhhs_district_directory_or_county_export_is_preserved
- [major] vocational_rehabilitation_pre_ets: hold_blocked_until_public_nh_vr_host_or_official_export_is_preserved
- [critical] medicaid_state_health_coverage: hold_blocked_until_live_official_nh_dhhs_host_or_reviewed_successor_is_preserved
- [critical] medicaid_waiver_hcbs_disability_services: hold_blocked_until_live_official_nh_dhhs_host_or_reviewed_successor_is_preserved
- [critical] developmental_disability_idd_authority: hold_blocked_until_live_official_nh_dhhs_host_or_reviewed_successor_is_preserved
- [critical] early_intervention_part_c: hold_blocked_until_live_official_nh_dhhs_host_or_reviewed_successor_is_preserved

## Completion decision

- New Hampshire remains `BLOCKED` and `index_safe=false`.
- The remaining blockers now include both host-family public-access failures and an audit-consistency fix for the unresolvable `dhhs.new-hampshire.gov` replacement host family.
- Medicaid, waiver, DD, and early-intervention can no longer stay verified off `dhhs.new-hampshire.gov` because the exact saved first-party hostnames do not resolve in the current lane.
- Education remains blocked because the official DOE root, district leaves, and alternate `my.doe.nh.gov` host all return the same access-denied shell.
- County/local disability resources remain blocked because the official DHHS root and district-office leaves all return the same access-denied shell, leaving only DOI-derived county rows.
- Vocational rehabilitation remains blocked because the legacy root is dead, the likely NHES VR host family is access-denied, and `nheasy` is not resolvable.
