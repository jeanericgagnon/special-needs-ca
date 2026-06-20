# Provider Accessibility Enrichment Plan

Generated: 2026-06-18

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This plan converts the current provider accessibility gap into an execution queue. It distinguishes what can be safely backfilled from checked-in data versus what requires fresh source pulls.

## Summary

- trusted public provider rows: 94
- provider rows with any accessibility signal: 94
- states with provider rows: 50
- states needing fresh provider accessibility source pulls: 0

Checked-in provider staging accessibility clue totals:

- english: 0
- spanish: 0
- asl: 0
- interpreter: 0
- wheelchair: 0
- transportation: 1
- home visits: 0
- telehealth: 0

## Recommended Sequence

- Step 1: Do not attempt provider accessibility backfill from checked-in staging — The checked-in provider staging rows currently show zero explicit language or accessibility clues, so any automated backfill would be invented rather than source-backed.
- Step 2: Run fresh provider source pulls for states that already have trusted provider rows — These states are closest to producing a useful accessibility-rich live sample without broad new expansion.
- Step 3: Prefer first-party provider pages that explicitly mention languages, telehealth, interpreter access, or transportation help — This is the smallest safe path to truthful accessibility enrichment.
- Step 4: Re-run accessibility and sample audits after each state pull — The goal is to earn at least one accessibility-rich provider sample per active provider state cluster, not to bulk-fill uncertain booleans.

## State Queue

- florida: provider rows 14, accessibility rows 14 (100%), top hosts floridacard.org, ucf-card.org, card-usf.fmhi.usf.edu, fau.edu, fsucard.com, card.ufl.edu, action sustain and verify
- texas: provider rows 10, accessibility rows 10 (100%), top hosts texaschildrens.org, cookchildrens.org, calliercenter.utdallas.edu, dellchildrens.net, uth.edu, utsouthwestern.edu, action sustain and verify
- pennsylvania: provider rows 7, accessibility rows 7 (100%), top hosts chop.edu, chp.edu, pennstatehealth.org, geisinger.org, stchristophershospital.com, templehealth.org, action sustain and verify
- illinois: provider rows 6, accessibility rows 6 (100%), top hosts luriechildrens.org, rush.edu, ahs.uic.edu, carle.org, osfhealthcare.org, thehopeclinic.org, action sustain and verify
- nebraska: provider rows 3, accessibility rows 3 (100%), top hosts childrensnebraska.org, unmc.edu, action sustain and verify
- north-carolina: provider rows 3, accessibility rows 3 (100%), top hosts med.unc.edu, wakemed.org, atriumhealth.org, action sustain and verify
- california: provider rows 2, accessibility rows 2 (100%), top hosts chla.org, health.ucdavis.edu, action sustain and verify
- colorado: provider rows 2, accessibility rows 2 (100%), top hosts childrenscolorado.org, action sustain and verify
- iowa: provider rows 2, accessibility rows 2 (100%), top hosts uihc.org, unitypoint.org, action sustain and verify
- kentucky: provider rows 2, accessibility rows 2 (100%), top hosts ukhealthcare.uky.edu, medicine.louisville.edu, action sustain and verify
- louisiana: provider rows 2, accessibility rows 2 (100%), top hosts manningchildrens.org, ochsner.org, action sustain and verify
- rhode-island: provider rows 2, accessibility rows 2 (100%), top hosts lifespan.org, brownhealth.org, action sustain and verify
- washington: provider rows 2, accessibility rows 2 (100%), top hosts seattlechildrens.org, action sustain and verify
- alabama: provider rows 1, accessibility rows 1 (100%), top hosts childrensal.org, action sustain and verify
- alaska: provider rows 1, accessibility rows 1 (100%), top hosts anthc.org, action sustain and verify
- arizona: provider rows 1, accessibility rows 1 (100%), top hosts phoenixchildrens.org, action sustain and verify
- arkansas: provider rows 1, accessibility rows 1 (100%), top hosts archildrens.org, action sustain and verify
- connecticut: provider rows 1, accessibility rows 1 (100%), top hosts connecticutchildrens.org, action sustain and verify
- delaware: provider rows 1, accessibility rows 1 (100%), top hosts nemours.org, action sustain and verify
- georgia: provider rows 1, accessibility rows 1 (100%), top hosts marcus.org, action sustain and verify
- hawaii: provider rows 1, accessibility rows 1 (100%), top hosts hawaiipacifichealth.org, action sustain and verify
- idaho: provider rows 1, accessibility rows 1 (100%), top hosts stlukesonline.org, action sustain and verify
- indiana: provider rows 1, accessibility rows 1 (100%), top hosts rileychildrens.org, action sustain and verify
- kansas: provider rows 1, accessibility rows 1 (100%), top hosts kansashealthsystem.com, action sustain and verify
- maine: provider rows 1, accessibility rows 1 (100%), top hosts mainehealth.org, action sustain and verify
- maryland: provider rows 1, accessibility rows 1 (100%), top hosts hopkinsmedicine.org, action sustain and verify
- massachusetts: provider rows 1, accessibility rows 1 (100%), top hosts massgeneral.org, action sustain and verify
- michigan: provider rows 1, accessibility rows 1 (100%), top hosts uofmhealth.org, action sustain and verify
- minnesota: provider rows 1, accessibility rows 1 (100%), top hosts childrensmn.org, action sustain and verify
- mississippi: provider rows 1, accessibility rows 1 (100%), top hosts umc.edu, action sustain and verify
- missouri: provider rows 1, accessibility rows 1 (100%), top hosts childrensmercy.org, action sustain and verify
- montana: provider rows 1, accessibility rows 1 (100%), top hosts billingsclinic.com, action sustain and verify
- nevada: provider rows 1, accessibility rows 1 (100%), top hosts umcsn.com, action sustain and verify
- new-hampshire: provider rows 1, accessibility rows 1 (100%), top hosts elliothospital.org, action sustain and verify
- new-jersey: provider rows 1, accessibility rows 1 (100%), top hosts rwjbh.org, action sustain and verify
- new-mexico: provider rows 1, accessibility rows 1 (100%), top hosts unmhealth.org, action sustain and verify
- new-york: provider rows 1, accessibility rows 1 (100%), top hosts childrenshospital.northwell.edu, action sustain and verify
- north-dakota: provider rows 1, accessibility rows 1 (100%), top hosts sanfordhealth.org, action sustain and verify
- ohio: provider rows 1, accessibility rows 1 (100%), top hosts nationwidechildrens.org, action sustain and verify
- oklahoma: provider rows 1, accessibility rows 1 (100%), top hosts ouhealth.com, action sustain and verify
- oregon: provider rows 1, accessibility rows 1 (100%), top hosts ohsu.edu, action sustain and verify
- south-carolina: provider rows 1, accessibility rows 1 (100%), top hosts musckids.org, action sustain and verify
- south-dakota: provider rows 1, accessibility rows 1 (100%), top hosts sanfordhealth.org, action sustain and verify
- tennessee: provider rows 1, accessibility rows 1 (100%), top hosts childrenshospitalvanderbilt.org, action sustain and verify
- utah: provider rows 1, accessibility rows 1 (100%), top hosts intermountainhealthcare.org, action sustain and verify
- vermont: provider rows 1, accessibility rows 1 (100%), top hosts uvmhealth.org, action sustain and verify
- virginia: provider rows 1, accessibility rows 1 (100%), top hosts chrichmond.org, action sustain and verify
- west-virginia: provider rows 1, accessibility rows 1 (100%), top hosts wvumedicine.org, action sustain and verify
- wisconsin: provider rows 1, accessibility rows 1 (100%), top hosts childrenswi.org, action sustain and verify
- wyoming: provider rows 1, accessibility rows 1 (100%), top hosts cheyenneregional.org, action sustain and verify

## Source-Pull Priority Lane

