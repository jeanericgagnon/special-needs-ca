# Provider Accessibility Pull Results Audit

Generated: 2026-06-16

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This artifact turns provider accessibility source-pull work into a review contract. It shows whether first-party accessibility clues have actually been recorded, reviewed, and promoted for the current focus states without publishing unverified claims.

## Summary

- results table present: yes
- trusted provider rows in focus states: 36
- recorded pull-result rows: 593
- clue statuses: queued=593
- clue fields captured: accessibility_notes=55, application_url=35, asl_available=36, home_visits=36, in_person_services=35, interpreter_available=72, languages=36, next_step_type=36, referral_url=36, requirements=71, transportation_help=36, virtual_services=37, wheelchair_accessible=72

Required evidence before promotion:

- a trusted provider row with a valid first-party `source_url`
- a specific `clue_page_url` where the claim was found
- the `clue_field` being proposed for enrichment
- explicit `clue_text` or structured value from the source page
- a `clue_status` that shows whether the clue is queued, reviewed, promoted, or rejected

## florida

- trusted provider rows: 14
- recorded pull-result rows: 225
- queued clues: 225
- review-ready clues: 0
- promoted clues: 0
- rejected clues: 0

Providers with no recorded clue results yet:

- none

Providers with partial clue coverage:

- none

Review-ready clues:

- none

Queued clues:

- prov-all-childrens-hospital-fl accessibility_notes [patient_services]: https://www.hopkinsallchildrens.org
- prov-all-childrens-hospital-fl application_url [program_overview]: https://www.hopkinsallchildrens.org
- prov-all-childrens-hospital-fl asl_available [accessibility_page]: https://www.hopkinsallchildrens.org
- prov-all-childrens-hospital-fl home_visits [patient_services]: https://www.hopkinsallchildrens.org
- prov-all-childrens-hospital-fl in_person_services [program_overview]: https://www.hopkinsallchildrens.org
- prov-all-childrens-hospital-fl interpreter_available [accessibility_page]: https://www.hopkinsallchildrens.org
- prov-all-childrens-hospital-fl interpreter_available [contact_page]: https://www.hopkinsallchildrens.org
- prov-all-childrens-hospital-fl languages [contact_page]: https://www.hopkinsallchildrens.org
- prov-all-childrens-hospital-fl next_step_type [contact_page]: https://www.hopkinsallchildrens.org
- prov-all-childrens-hospital-fl referral_url [appointment_page]: https://www.hopkinsallchildrens.org
- prov-all-childrens-hospital-fl requirements [appointment_page]: https://www.hopkinsallchildrens.org
- prov-all-childrens-hospital-fl requirements [program_overview]: https://www.hopkinsallchildrens.org

## texas

- trusted provider rows: 9
- recorded pull-result rows: 147
- queued clues: 147
- review-ready clues: 0
- promoted clues: 0
- rejected clues: 0

Providers with no recorded clue results yet:

- none

Providers with partial clue coverage:

- tx-clinic-utd-callier: results=14 | missing=in_person_services, application_url

Review-ready clues:

- none

Queued clues:

- tx-clinic-bcm-meyer accessibility_notes [patient_services]: https://www.bcm.edu
- tx-clinic-bcm-meyer application_url [program_overview]: https://www.bcm.edu
- tx-clinic-bcm-meyer asl_available [accessibility_page]: https://www.bcm.edu
- tx-clinic-bcm-meyer home_visits [patient_services]: https://www.bcm.edu
- tx-clinic-bcm-meyer in_person_services [program_overview]: https://www.bcm.edu
- tx-clinic-bcm-meyer interpreter_available [accessibility_page]: https://www.bcm.edu
- tx-clinic-bcm-meyer interpreter_available [contact_page]: https://www.bcm.edu
- tx-clinic-bcm-meyer languages [contact_page]: https://www.bcm.edu
- tx-clinic-bcm-meyer next_step_type [contact_page]: https://www.bcm.edu
- tx-clinic-bcm-meyer referral_url [appointment_page]: https://www.bcm.edu
- tx-clinic-bcm-meyer requirements [appointment_page]: https://www.bcm.edu
- tx-clinic-bcm-meyer requirements [program_overview]: https://www.bcm.edu

## pennsylvania

- trusted provider rows: 7
- recorded pull-result rows: 119
- queued clues: 119
- review-ready clues: 0
- promoted clues: 0
- rejected clues: 0

Providers with no recorded clue results yet:

- none

Providers with partial clue coverage:

- none

Review-ready clues:

- none

Queued clues:

- pa-clinic-chop accessibility_notes [faq_page]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
- pa-clinic-chop accessibility_notes [patient_services]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
- pa-clinic-chop application_url [program_overview]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
- pa-clinic-chop asl_available [accessibility_page]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
- pa-clinic-chop home_visits [patient_services]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
- pa-clinic-chop in_person_services [program_overview]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
- pa-clinic-chop interpreter_available [accessibility_page]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
- pa-clinic-chop interpreter_available [contact_page]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
- pa-clinic-chop languages [contact_page]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
- pa-clinic-chop next_step_type [contact_page]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
- pa-clinic-chop referral_url [appointment_page]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics
- pa-clinic-chop requirements [appointment_page]: https://www.chop.edu/centers-programs/developmental-and-behavioral-pediatrics

## illinois

- trusted provider rows: 6
- recorded pull-result rows: 102
- queued clues: 102
- review-ready clues: 0
- promoted clues: 0
- rejected clues: 0

Providers with no recorded clue results yet:

- none

Providers with partial clue coverage:

- none

Review-ready clues:

- none

Queued clues:

- clinic-carle-dev-peds-il accessibility_notes [faq_page]: https://www.carle.org
- clinic-carle-dev-peds-il accessibility_notes [patient_services]: https://www.carle.org
- clinic-carle-dev-peds-il application_url [program_overview]: https://www.carle.org
- clinic-carle-dev-peds-il asl_available [accessibility_page]: https://www.carle.org
- clinic-carle-dev-peds-il home_visits [patient_services]: https://www.carle.org
- clinic-carle-dev-peds-il in_person_services [program_overview]: https://www.carle.org
- clinic-carle-dev-peds-il interpreter_available [accessibility_page]: https://www.carle.org
- clinic-carle-dev-peds-il interpreter_available [contact_page]: https://www.carle.org
- clinic-carle-dev-peds-il languages [contact_page]: https://www.carle.org
- clinic-carle-dev-peds-il next_step_type [contact_page]: https://www.carle.org
- clinic-carle-dev-peds-il referral_url [appointment_page]: https://www.carle.org
- clinic-carle-dev-peds-il requirements [appointment_page]: https://www.carle.org
