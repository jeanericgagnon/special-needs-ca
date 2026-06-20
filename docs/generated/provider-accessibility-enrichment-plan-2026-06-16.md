# Provider Accessibility Enrichment Plan

Generated: 2026-06-16

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This plan converts the current provider accessibility gap into an execution queue. It distinguishes what can be safely backfilled from checked-in data versus what requires fresh source pulls.

## Summary

- trusted public provider rows: 39
- provider rows with any accessibility signal: 0
- states with provider rows: 7
- states needing fresh provider accessibility source pulls: 7

Checked-in provider staging accessibility clue totals:

- english: 0
- spanish: 0
- asl: 0
- interpreter: 0
- wheelchair: 0
- transportation: 0
- home visits: 0
- telehealth: 0

## Recommended Sequence

- Step 1: Do not attempt provider accessibility backfill from checked-in staging — The checked-in provider staging rows currently show zero explicit language or accessibility clues, so any automated backfill would be invented rather than source-backed.
- Step 2: Run fresh provider source pulls for states that already have trusted provider rows — These states are closest to producing a useful accessibility-rich live sample without broad new expansion.
  Targets: florida, texas, pennsylvania, illinois, georgia, north-carolina, ohio
- Step 3: Prefer first-party provider pages that explicitly mention languages, telehealth, interpreter access, or transportation help — This is the smallest safe path to truthful accessibility enrichment.
- Step 4: Re-run accessibility and sample audits after each state pull — The goal is to earn at least one accessibility-rich provider sample per active provider state cluster, not to bulk-fill uncertain booleans.

## State Queue

- florida: provider rows 14, accessibility rows 0 (0%), top hosts floridacard.org, ucf-card.org, card-usf.fmhi.usf.edu, fau.edu, fsucard.com, card.ufl.edu, action fresh source pull required
- texas: provider rows 9, accessibility rows 0 (0%), top hosts texaschildrens.org, cookchildrens.org, calliercenter.utdallas.edu, dellchildrens.net, uth.edu, utsouthwestern.edu, action fresh source pull required
- pennsylvania: provider rows 7, accessibility rows 0 (0%), top hosts chop.edu, chp.edu, pennstatehealth.org, geisinger.org, stchristophershospital.com, templehealth.org, action fresh source pull required
- illinois: provider rows 6, accessibility rows 0 (0%), top hosts luriechildrens.org, rush.edu, ahs.uic.edu, carle.org, osfhealthcare.org, thehopeclinic.org, action fresh source pull required
- georgia: provider rows 1, accessibility rows 0 (0%), top hosts marcus.org, action fresh source pull required
- north-carolina: provider rows 1, accessibility rows 0 (0%), top hosts med.unc.edu, action fresh source pull required
- ohio: provider rows 1, accessibility rows 0 (0%), top hosts nationwidechildrens.org, action fresh source pull required

## Source-Pull Priority Lane

- florida: 14 trusted provider rows, 0 accessibility rows, hosts floridacard.org, ucf-card.org, card-usf.fmhi.usf.edu, fau.edu, fsucard.com, card.ufl.edu
- texas: 9 trusted provider rows, 0 accessibility rows, hosts texaschildrens.org, cookchildrens.org, calliercenter.utdallas.edu, dellchildrens.net, uth.edu, utsouthwestern.edu
- pennsylvania: 7 trusted provider rows, 0 accessibility rows, hosts chop.edu, chp.edu, pennstatehealth.org, geisinger.org, stchristophershospital.com, templehealth.org
- illinois: 6 trusted provider rows, 0 accessibility rows, hosts luriechildrens.org, rush.edu, ahs.uic.edu, carle.org, osfhealthcare.org, thehopeclinic.org
- georgia: 1 trusted provider rows, 0 accessibility rows, hosts marcus.org
- north-carolina: 1 trusted provider rows, 0 accessibility rows, hosts med.unc.edu
- ohio: 1 trusted provider rows, 0 accessibility rows, hosts nationwidechildrens.org
