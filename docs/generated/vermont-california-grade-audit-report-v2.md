# Vermont California-Grade Audit Report v3

- classification: COMPLETE
- index_safe: true
- completeness_pct: 100
- county_count: 14
- primary_gap_reason: all_critical_families_verified_with_reviewed_first_party_or_official_evidence

## Family status

- medicaid_state_health_coverage: verified_state_grade (statewide evidence is present at the required authority level)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 the official Vermont Education Dashboard Organization Information dataset on `data.vermont.gov`. The public dataset describes itself as `Organization information from 2004-2025`, its schema exposes `SchoolCity`, `SchoolOrganizationName`, `SchoolAddress`, `SchoolYear`, `SupervisoryUnionOrganizationName`, and `SupervisoryUnionOrganizationIdentifier`, and current 2025 rows publicly map local schools in New Haven, Bristol, Monkton, Ferrisburgh, and Vergennes to named supervisory unions and districts. This replaces Vermont's old statewide education fallback with current official district-routing evidence on a Vermont government open-data host.)
- vocational_rehabilitation_pre_ets: verified_state_grade (statewide evidence is present at the required authority level)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-25 the live first-party Disability Rights Vermont homepage. The page states `Advocating for the legal rights of Vermonters with disabilities`, says `Disability Rights Vermont (DRVT) is part of the national Protection and Advocacy (P&A) system`, and explains that DRVT provides information, referrals, advocacy services, and legal representation when appropriate to individuals with disabilities across Vermont. This now supplies direct first-party protection-and-advocacy designation evidence for Vermont.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 the live first-party Vermont Family Network workshops page and its metadata. The page description states that Vermont Family Network is the `federally designated Parent Training and Information Center`, the Family-to-Family Health Information Center, and a statewide family support organization. This replaces Vermont's old inventory-only PTI hint with current first-party designation evidence.)
- legal_aid: verified_state_grade (reviewed first-party Vermont Legal Aid evidence preserves statewide free civil legal-help routing on the live first-party domain)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_state_grade (Reviewed 2026-06-25 the current official Vermont AHS Field Services public ArcGIS map and REST service on `arcgis.com` and `maps.healthvermont.gov`. The public AHS Field Services Map says it provides up-to-date AHS Field Office district boundaries, field office locations, field services, and district contact information, and further states that twelve Agency of Human Services Field Offices serve as the administrative centers for programs and services locally in Vermont and that each office covers individuals within towns included in the field office's district. The public MapServer exposes 12 AHS district-contact polygons and 23 service-office locations statewide, while the public Office table lists named office services and divisions at those locations, including AHS District Office entries plus Department of Disabilities, Aging, and Independent Living HireAbility entries such as Barre at 5 Perry Street, Suite 100. This replaces Vermont's old blocked county-local lane with current official local AHS district-routing proof.)

## Failure ledger

- none

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=3; first=https://www.ssa.gov
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://ddsd.vermont.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.vermont.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.vermont.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.vermont.gov/
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://data.vermont.gov/Education/Vermont-Education-Dashboard-Organization-Informati/9uwi-evpg
- vocational_rehabilitation_pre_ets: verified_state_grade; samples=1; first=https://ddsd.vermont.gov
- protection_and_advocacy: verified_state_grade; samples=3; first=https://disabilityrightsvt.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.vermontfamilynetwork.org/what-we-do/family-support/workshops-consultation/
- legal_aid: verified_state_grade; samples=1; first=https://www.vtlegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_state_grade; samples=5; first=https://www.arcgis.com/sharing/rest/content/items/e65275f532ee44ebbb96b2bc36e6ecd5?f=json

## Next actions

- none

## Completion decision

- Vermont is now `COMPLETE` and `index_safe=true`.
- `county_local_disability_resources` now clears because the official Vermont AHS Field Services public ArcGIS map and REST service publish district boundaries, office locations, district contacts, and named services at local office locations on current official hosts.
- The AHS Field Services item metadata explicitly states that twelve field offices serve as local administrative centers and that each office covers individuals within towns included in the office district, which satisfies Vermont's local-routing requirement without relying on dead legacy office pages.
