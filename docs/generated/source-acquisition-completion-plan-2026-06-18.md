# Source Acquisition Completion Plan

Generated: 2026-06-18

This is the current answer to: what do we still need to scrape or author to fill the repo gaps?

## Summary

- master-ledger ready rows: 1754
- DB-discovered actionable rows not yet in master ledger: 2888
- authored missing-family rows: 312
- combined unique ready rows: 703
- source families still needing authoring: 0
- suppressed provider repeated blocker urls: 43
- suppressed advocate blocked urls: 1977
- suppressed provider rejected urls: 34
- suppressed provider staged keys: 109
- suppressed deterministic rejected urls: 434
- suppressed repeated family followup urls: 106
- suppressed repeated stale source-repair urls: 404

## Combined Ready Rows By Gap Family

- nonprofit_support: 356
- medicaid_hhs_offices: 116
- dd_routing: 74
- source_registry: 38
- general_gap_fill: 35
- programs_benefits: 29
- geography_counties: 15
- waivers: 11
- education_routing: 11
- transition_programs: 6
- condition_nonprofits: 4
- parent_training_nonprofits: 3
- early_intervention_programs: 3
- providers_care: 1
- transport_utilities_food: 1

## Combined Ready Rows By Status

- ready_js_heavy: 392
- ready_lightweight: 308
- discovery_only: 2
- ready_pdf: 1

## Combined Ready Rows By Execution Lane

- ready_target_scrape: 701
- remaining_ready: 2

## Queue Waves

### Source-family unlock packs

- rows: 0

### Priority lightweight ready targets

- rows: 0

### Advocates and legal ready targets

- rows: 0

### Forms and PDF targets

- rows: 1
- medicaid_hhs_offices: 1

### JS-heavy targets

- rows: 392
- nonprofit_support: 284
- dd_routing: 47
- source_registry: 33
- education_routing: 10
- medicaid_hhs_offices: 9
- general_gap_fill: 8
- parent_training_nonprofits: 1

### Remaining ready targets

- rows: 703
- nonprofit_support: 356
- medicaid_hhs_offices: 116
- dd_routing: 74
- source_registry: 38
- general_gap_fill: 35
- programs_benefits: 29
- geography_counties: 15
- waivers: 11

## Still Need To Author


## Authored Missing-Family Coverage

- advocates_legal: 103
- housing: 52
- goods_supplies: 51
- jobs_vocational: 51
- legal_aid: 51
- providers_care: 2
- transport_utilities_food: 1
- care_independent_living: 1

## Top Combined Ready Targets

- alaska: https://dhss.alaska.gov/dsds (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- alaska: https://dhss.alaska.gov/dsds/Pages/pcs (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- vermont: https://dvha.vermont.gov/ (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- colorado: https://hcpf.colorado.gov/pcs (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- kansas: https://www.kancare.ks.gov/ (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- kansas: https://www.kdads.ks.gov/ (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- massachusetts: https://www.mass.gov/masshealth (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- michigan: https://www.michigan.gov/medicaid (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- minnesota: https://education.minnesota.gov/ (programs; programs_benefits; ready_lightweight; queue=master_ledger_ready)
- vermont: https://education.vermont.gov/ (programs; programs_benefits; ready_lightweight; queue=master_ledger_ready)
- virginia: https://education.virginia.gov/ (programs; programs_benefits; ready_lightweight; queue=master_ledger_ready)
- pennsylvania: https://www.chipcoverspakids.com/ (programs; programs_benefits; ready_lightweight; queue=master_ledger_ready)
- florida: https://www.floridakidcare.org/ (programs; programs_benefits; ready_lightweight; queue=master_ledger_ready)
- new-york: https://www.health.ny.gov/health_care/medicaid/program/longterm/cdpap.htm (programs; programs_benefits; ready_lightweight; queue=master_ledger_ready)
- vermont: https://ddsd.vermont.gov/hcbs/eligibility (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- alaska: https://dhss.alaska.gov/dsds/Pages/hcbw/eligibility.aspx (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- colorado: https://hcpf.colorado.gov/hcbs/eligibility (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- alabama: https://medicaid.alabama.gov/hcbs/eligibility (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- georgia: https://www.georgiaable.org/ (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- new-york: https://www.health.ny.gov/health_care/child_health_plus (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- new-york: https://www.health.ny.gov/health_care/medicaid/redesign/cdpap.htm (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- kansas: https://www.kdads.ks.gov/hcbs/eligibility (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- massachusetts: https://www.mass.gov/dds/hcbs/eligibility (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- michigan: https://www.michigan.gov/mdhhs/hcbs/eligibility (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- florida: https://www.rehabworks.org/student-youth (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- alabama: https://www.ssa.gov/ (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- unknown: https://www.ssa.gov/benefits/disability/apply-child.html (programs; programs_benefits; ready_lightweight; queue=db_discovered_ready)
- florida: https://www.fldoe.org/academics/exceptional-student-edu (programs; programs_benefits; ready_lightweight; queue=master_ledger_ready)
- new-york: https://www.health.ny.gov/health_care/medicaid (programs; programs_benefits; ready_lightweight; queue=master_ledger_ready)
- new-york: https://www.health.ny.gov/community/infants_children/early_intervention/county_eip.htm (state_resource_agencies; dd_routing; ready_lightweight; queue=db_discovered_ready)
- texas: https://citysearch.hhsc.state.tx.us/ (state_resource_agencies; dd_routing; ready_js_heavy; queue=db_discovered_ready)
- new-jersey: https://nj.gov/humanservices/ddd (state_resource_agencies; dd_routing; ready_lightweight; queue=db_discovered_ready)
- new-jersey: https://www.nj.gov/health/fhs/eis (state_resource_agencies; dd_routing; ready_lightweight; queue=db_discovered_ready)
- nevada: https://adsd.nv.gov/Programs/Intellectual/Intellectual (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- rhode-island: https://bhddh.ri.gov/developmental-disabilities (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- kentucky: https://dbhdid.ky.gov/ddid (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- virginia: https://dbhds.virginia.gov/ (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- maryland: https://dda.health.maryland.gov/ (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- vermont: https://ddsd.vermont.gov/ (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- south-carolina: https://ddsn.sc.gov/ (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- arizona: https://des.az.gov/ddd (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- west-virginia: https://dhhr.wv.gov/bms (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- nebraska: https://dhhs.ne.gov/Pages/DD (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- south-dakota: https://dhs.sd.gov/dd (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- alaska: https://dhss.alaska.gov/dsds/Pages/dd/default.aspx (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- delaware: https://dhss.delaware.gov/ddds (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- missouri: https://dmh.mo.gov/dev-disabilities (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- montana: https://dphhs.mt.gov/dsd/ddp (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- utah: https://dspd.utah.gov/ (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
- colorado: https://hcpf.colorado.gov/developmental-disabilities (state_resource_agencies; dd_routing; ready_js_heavy; queue=master_ledger_ready)
