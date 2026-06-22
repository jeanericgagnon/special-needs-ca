# Illinois California-Grade Audit Report v2

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 102
- primary_gap_reason: none

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_county_grade (Official Illinois county-grade education routing is now decision-complete. The official ISBE ROE page publicly directs families to the IARSS interactive map and IARSS Directory. The reviewed public IARSS map embeds 35 ROE/ISC region assignments with 101 unique Illinois county IDs plus county-specific ROE/ISC routing URLs, and Cook County remains covered by the existing verified North/West/South Cook ISC rows. The one weak outbound map URL for ROE 13 no longer blocks completion because the reviewed IARSS directory preserves a dedicated public ROE 13 listing with phone routing.)
- vocational_rehabilitation_pre_ets: verified_state_grade (Illinois DRS Services is already present as reviewed official statewide VR routing evidence.)
- protection_and_advocacy: verified_state_grade (Equip for Equality is already present as reviewed first-party statewide P&A evidence.)
- parent_training_information_center: verified_state_grade (Reviewed current first-party successor pages now preserve statewide Illinois PTI designation. FRCD states it no longer holds the Illinois PTIC role as of October 1, 2025, and Family Matters PTIC states it is the only federally funded Parent Training and Information Center in Illinois and now covers the entire state.)
- legal_aid: verified_state_grade (Illinois Legal Aid Online now provides reviewed Illinois statewide legal-help routing from a first-party portal.)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Official IDHS Office Locator replaced the dead county-office page and now serves as the verified county/local routing surface.)

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=29737
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=47257
- developmental_disability_idd_authority: verified_state_grade; samples=3; first=https://www.dhs.state.il.us/page.aspx?item=31182
- early_intervention_part_c: verified_state_grade; samples=1; first=https://www.dhs.state.il.us/page.aspx?item=31183
- special_education_idea_part_b: verified_state_grade; samples=3; first=https://www.roe1.net
- district_or_county_education_routing: verified_county_grade; samples=4; first=https://www.isbe.net/roe
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://www.dhs.state.il.us/page.aspx?item=29737
- protection_and_advocacy: verified_state_grade; samples=1; first=https://www.equipforequality.org
- parent_training_information_center: verified_state_grade; samples=2; first=https://frcd.org/
- legal_aid: verified_state_grade; samples=1; first=https://www.illinoislegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://illinoisable.com/
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov/benefits/disability/apply-child.html
- county_local_disability_resources: verified_state_grade; samples=1; first=https://www.dhs.state.il.us/page.aspx?item=26210

## Illinois completion decision

- Illinois is now COMPLETE and index-safe under the hardened California-grade gate.
- The final education blocker is cleared by a reviewed official-to-authoritative chain: ISBE /roe points families to the IARSS interactive map and directory, the public IARSS map embeds 35 county-routing assignments covering 101 unique Illinois county IDs, and Cook County remains covered by existing verified ISC rows.
- The one weak external ROE 13 map target no longer blocks completion because the IARSS directory preserves a reviewed public ROE 13 listing with routing phone evidence.
- This pass does not broaden scraping or weaken county-grade proof; it replaces the stale “three leaves only” assumption with a narrower, public county-map contract.
