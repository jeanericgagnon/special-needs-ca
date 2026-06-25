# Vermont California-Grade Audit Report v2

- classification: BLOCKED
- index_safe: false
- completeness_pct: 91
- county_count: 14
- primary_gap_reason: official_vermont_vr_and_pre_ets_host_family_returns_403_without_reviewable_public_alternate

## Family status

- medicaid_state_health_coverage: verified_state_grade (Reviewed 2026-06-25 the accessible official Vermont Department of Health `Find Health Insurance` page. The page says health insurance is the first step to accessing health care and screenings for children and youth, explicitly lists `Dr. Dynasaur- Medicaid`, and describes it as low-cost or free health insurance for children, teenagers under age 19, and pregnant people. The same page also links Department of Vermont Health Access Medicaid information for children and adults, including people who are blind or disabled.)
- medicaid_waiver_hcbs_disability_services: verified_state_grade (statewide evidence is present at the required authority level)
- developmental_disability_idd_authority: verified_state_grade (statewide evidence is present at the required authority level)
- early_intervention_part_c: verified_state_grade (statewide evidence is present at the required authority level)
- special_education_idea_part_b: verified_state_grade (statewide evidence is present at the required authority level)
- district_or_county_education_routing: verified_state_grade (Reviewed 2026-06-25 the official Vermont Education Dashboard Organization Information dataset on `data.vermont.gov`. The public dataset describes itself as `Organization information from 2004-2025`, its schema exposes `SchoolCity`, `SchoolOrganizationName`, `SchoolAddress`, `SchoolYear`, `SupervisoryUnionOrganizationName`, and `SupervisoryUnionOrganizationIdentifier`, and current 2025 rows publicly map local schools in New Haven, Bristol, Monkton, Ferrisburgh, and Vergennes to named supervisory unions and districts. This replaces Vermont's old statewide education fallback with current official district-routing evidence on a Vermont government open-data host.)
- vocational_rehabilitation_pre_ets: blocked_official_vr_hosts_return_403_without_reviewed_public_alternate (Reviewed 2026-06-25 bounded official Vermont vocational-rehabilitation probes on `https://vocrehab.vermont.gov/`, `https://vocrehab.vermont.gov/students`, `https://vocrehab.vermont.gov/pre-employment-transition-services`, `https://dbvi.vermont.gov/`, and `https://dbvi.vermont.gov/pre-employment-transition-services`. Each returned an HTTP 403 CloudFront/Volt ADC error shell in the current pass, and no reviewed alternate public official Vermont VR or Pre-ETS page is preserved on disk. Vermont therefore remains blocked on the official VR / Pre-ETS family even though county-local routing is now repaired.)
- protection_and_advocacy: verified_state_grade (Reviewed 2026-06-25 the live first-party Disability Rights Vermont homepage. The page states `Advocating for the legal rights of Vermonters with disabilities`, says `Disability Rights Vermont (DRVT) is part of the national Protection and Advocacy (P&A) system`, and explains that DRVT provides information, referrals, advocacy services, and legal representation when appropriate to individuals with disabilities across Vermont. This now supplies direct first-party protection-and-advocacy designation evidence for Vermont.)
- parent_training_information_center: verified_state_grade (Reviewed 2026-06-25 the live first-party Vermont Family Network workshops page and its metadata. The page description states that Vermont Family Network is the `federally designated Parent Training and Information Center`, the Family-to-Family Health Information Center, and a statewide family support organization. This replaces Vermont's old inventory-only PTI hint with current first-party designation evidence.)
- legal_aid: verified_state_grade (reviewed first-party Vermont Legal Aid evidence preserves statewide free civil legal-help routing on the live first-party domain)
- able_program: verified_state_grade (statewide evidence is present at the required authority level)
- ssi_ssa_federal_reference: verified_state_grade (statewide evidence is present at the required authority level)
- county_local_disability_resources: verified_county_grade (Reviewed 2026-06-25 the accessible official Vermont Department of Health local-health network. `Find Your Local Health Office` publishes a statewide town selector, links each local office, and includes a map whose alt text says it outlines the towns and counties served by Health Districts. The local office pages then preserve explicit service-area contracts such as `The Barre Local Health Office serves all of Washington County and five towns in Orange County`, `Serving East Central Vermont (Northern Windsor and Southern Orange Counties)`, and `We work with partners in Franklin and Grand Isle Counties to prevent disease.` The same official local `Family and Child Health` leaves connect those local offices to disability-adjacent routing: Bennington says the local office refers children with development concerns to the `Children Integrated (CIS) Team` and links `Children with Special Health Needs`, Morrisville links `Children with Special Health Needs`, `Help Me Grow`, and `Children's Integrated Services - Lamoille Family Center`, and White River Junction lists `Children’s Integrated Services` plus county-local parent-child and rehabilitation partners. This is now sufficient official county-grade local disability-family routing.)

## Failure ledger

- vocational_rehabilitation_pre_ets: official_vr_and_pre_ets_hosts_return_403_without_reviewed_public_alternate :: Reviewed 2026-06-25 bounded official Vermont vocational-rehabilitation probes on `https://vocrehab.vermont.gov/`, `https://vocrehab.vermont.gov/students`, `https://vocrehab.vermont.gov/pre-employment-transition-services`, `https://dbvi.vermont.gov/`, and `https://dbvi.vermont.gov/pre-employment-transition-services`. Each returned an HTTP 403 CloudFront/Volt ADC error shell in the current pass, and no reviewed alternate public official Vermont VR or Pre-ETS page is preserved on disk. Vermont therefore remains blocked on the official VR / Pre-ETS family even though county-local routing is now repaired.

## Verified source samples

- medicaid_state_health_coverage: verified_state_grade; samples=2; first=https://www.healthvermont.gov/family/health-care-children-youth/find-health-insurance
- medicaid_waiver_hcbs_disability_services: verified_state_grade; samples=1; first=https://ddsd.vermont.gov/hcbs/eligibility
- developmental_disability_idd_authority: verified_state_grade; samples=1; first=https://dhhs.vermont.gov/dd
- early_intervention_part_c: verified_state_grade; samples=1; first=https://dhhs.vermont.gov/earlystart
- special_education_idea_part_b: verified_state_grade; samples=1; first=https://education.vermont.gov/
- district_or_county_education_routing: verified_state_grade; samples=4; first=https://data.vermont.gov/Education/Vermont-Education-Dashboard-Organization-Informati/9uwi-evpg
- vocational_rehabilitation_pre_ets: blocked_official_vr_hosts_return_403_without_reviewed_public_alternate; samples=3; first=https://vocrehab.vermont.gov/
- protection_and_advocacy: verified_state_grade; samples=3; first=https://disabilityrightsvt.org/
- parent_training_information_center: verified_state_grade; samples=2; first=https://www.vermontfamilynetwork.org/what-we-do/family-support/workshops-consultation/
- legal_aid: verified_state_grade; samples=1; first=https://www.vtlegalaid.org/
- able_program: verified_state_grade; samples=1; first=https://www.ablenrc.org
- ssi_ssa_federal_reference: verified_state_grade; samples=1; first=https://www.ssa.gov
- county_local_disability_resources: verified_county_grade; samples=6; first=https://www.healthvermont.gov/find-your-local-health-office

## Next actions

- [critical] vocational_rehabilitation_pre_ets: browser_review_or_author_reviewed_alternate_official_vermont_vr_and_pre_ets_source

## Refresh decision

- Vermont remains `BLOCKED` and `index_safe=false`.
- `county_local_disability_resources` now clears because the official Vermont Department of Health local-office finder publishes statewide town coverage, county-served local office contracts, and same-host Family and Child Health leaves that link Children with Special Health Needs, Help Me Grow, and Children’s Integrated Services.
- `medicaid_state_health_coverage` is now anchored to the accessible official Vermont Department of Health insurance page instead of the mixed generic packet samples.
- The active blocker moves to `vocational_rehabilitation_pre_ets`: the current official Vermont VR and DBVI host family returned only 403 shells in bounded review, and no alternate reviewed public official Vermont VR / Pre-ETS source is preserved on disk.
