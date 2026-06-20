# Provider Source-Pack Plan

Generated: 2026-06-19

## Why This Exists

- The provider buildout priority plan tells us which states are missing a public-safe provider layer.
- This source-pack plan answers a narrower execution question: which of those states already have source-backed provider targets that are concrete enough to pull now?

## Scope

- Input provider-priority artifact: docs/generated/provider-buildout-priority-plan-2026-06-18.json
- Source target inventory directory: data/source_targets
- State selection rule: top missing-provider states by existing local ecosystem, excluding California because it is still a remediation state and currently lacks a matching provider source-target JSON file.

## Summary

- States included: 10
- Pull now: 10
- Limited pull now: 0
- Replace placeholders first: 0
- Author targets first: 0
- States with directory-style secondary discovery targets: 0
- Total directory-style secondary discovery targets: 0

## California Note

- California is still a top missing-provider state, but it is not in this source-pack because California remains a remediation state and does not currently have a matching state source_targets JSON file for provider-source-pack generation.

## Execution Meaning

- `pull-now`: enough concrete first-party provider targets already exist to begin a safe source pull.
- `limited-pull-now`: one or two concrete first-party targets exist, but the state still needs a few more named clinic or hospital targets before scaling.
- `replace-placeholders-first`: the state has provider targets, but they are generic placeholders or weak directory-style entries and should not be crawled as-is.
- `author-targets-first`: the current provider target inventory is too thin or too generic to support trustworthy provider promotion.

## Lane Summary

- Pull now: Louisiana, Indiana, New York, Virginia, Michigan, Kentucky, Tennessee, North Carolina, Georgia, Nebraska
- Limited pull now: none
- Replace placeholders first: none
- Author targets first: none

## Louisiana

- counties: 64
- public-safe nonprofits: 1664
- advocate public-safe rows: 96
- provider source targets: 5
- concrete first-party provider targets: 5
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- FMOL Health Children's Hospitals: https://www.fmolhs.org/services/childrens-health/our-childrens-hospitals (static_fetch, fmolhs.org)
- FMOL Health Children's Health Services: https://www.fmolhs.org/services/childrens-health (static_fetch, fmolhs.org)
- FMOL Health Children's Hospitals: https://www.fmolhs.org/services/childrens-health/our-childrens-hospitals (static_fetch, fmolhs.org)
- FMOL Health Children's Health Services: https://www.fmolhs.org/services/childrens-health (static_fetch, fmolhs.org)
- Ochsner Hospital for Children: https://www.ochsner.org/ (static_fetch, ochsner.org)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Indiana

- counties: 92
- public-safe nonprofits: 1507
- advocate public-safe rows: 397
- provider source targets: 4
- concrete first-party provider targets: 4
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- Riley Children's Health: https://www.rileychildrens.org (static_fetch, rileychildrens.org)
- Peyton Manning Children's Hospital: https://healthcare.ascension.org/locations/indiana/inasc/pmch (static_fetch, healthcare.ascension.org)
- Indiana University Health Pediatric Care: https://iuhealth.org (static_fetch, iuhealth.org)
- Peyton Manning Children's Hospital Pediatric Neurology: https://healthcare.ascension.org/locations/indiana/inasc/pmch/departments-and-services/departments/pediatric-neurology (static_fetch, healthcare.ascension.org)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## New York

- counties: 62
- public-safe nonprofits: 1403
- advocate public-safe rows: 1116
- provider source targets: 9
- concrete first-party provider targets: 9
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 6, trust 1, DD 2, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- NYU Langone Hassenfeld Children's Hospital Center for Child Development: https://nyulangone.org/locations/hassenfeld-childrens-hospital (static_fetch, nyulangone.org)
- Montefiore Rose F. Kennedy Center: https://www.montefiore.org/rose-f-kennedy-center (static_fetch, montefiore.org)
- Cohen Children's Medical Center: https://childrenshospital.northwell.edu (static_fetch, childrenshospital.northwell.edu)
- Golisano Children's Hospital: https://www.urmc.rochester.edu/childrens-hospital (static_fetch, urmc.rochester.edu)
- Upstate Golisano Children's Hospital: https://www.upstate.edu/gch (static_fetch, upstate.edu)
- NYU Langone Hassenfeld Children's Hospital Center for Child Development: https://nyulangone.org/locations/hassenfeld-childrens-hospital (static_fetch, nyulangone.org)
- Montefiore Rose F. Kennedy Center: https://www.montefiore.org/rose-f-kennedy-center (static_fetch, montefiore.org)
- Cohen Children's Medical Center: https://childrenshospital.northwell.edu/ (static_fetch, childrenshospital.northwell.edu)
- Cohen Children's Medical Center Departments and Services: https://childrenshospital.northwell.edu/departments-services (static_fetch, childrenshospital.northwell.edu)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Virginia

- counties: 95
- public-safe nonprofits: 1157
- advocate public-safe rows: 1435
- provider source targets: 4
- concrete first-party provider targets: 4
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- Children's Hospital of Richmond at VCU: https://www.chrichmond.org (static_fetch, chrichmond.org)
- UVA Health Children's: https://childrens.uvahealth.com (static_fetch, childrens.uvahealth.com)
- Children's Hospital of The King's Daughters: https://www.chkd.org (static_fetch, chkd.org)
- Children's Hospital of The King's Daughters Programs, Clinics, and Centers: https://www.chkd.org/our-care/programs-clinics-and-centers (static_fetch, chkd.org)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Michigan

- counties: 83
- public-safe nonprofits: 1016
- advocate public-safe rows: 641
- provider source targets: 4
- concrete first-party provider targets: 4
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- C.S. Mott Children's Hospital: https://www.mottchildren.org (static_fetch, mottchildren.org)
- Children's Hospital of Michigan: https://www.childrensdmc.org (static_fetch, childrensdmc.org)
- Helen DeVos Children's Hospital: https://www.spectrumhealth.org/locations/spectrum-health-hospitals-helen-devos-childrens-hospital (static_fetch, spectrumhealth.org)
- University of Michigan Health Autism Spectrum Disorders Clinic: https://www.uofmhealth.org/our-care/specialties-services/autism-spectrum-disorders-appointments (static_fetch, uofmhealth.org)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Kentucky

- counties: 120
- public-safe nonprofits: 962
- advocate public-safe rows: 261
- provider source targets: 4
- concrete first-party provider targets: 4
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- Norton Children's Hospital: https://nortonchildrens.com (static_fetch, nortonchildrens.com)
- Kentucky Children's Hospital: https://ukhealthcare.com (static_fetch, ukhealthcare.com)
- University of Louisville Pediatrics: https://medicine.louisville.edu/academics-programs/academic-departments/pediatrics (static_fetch, medicine.louisville.edu)
- Golisano Children's at UK: https://ukhealthcare.com/kentucky-childrens-hospital/golisano-childrens-uk (static_fetch, ukhealthcare.com)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Tennessee

- counties: 95
- public-safe nonprofits: 866
- advocate public-safe rows: 131
- provider source targets: 7
- concrete first-party provider targets: 7
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- Dolly Parton Children's Hospital: https://www.dollychildrens.org/ (static_fetch, dollychildrens.org)
- Dolly Parton Children's Hospital Specialty Clinics: https://www.dollychildrens.org/medical-services/specialty-clinics (static_fetch, dollychildrens.org)
- Dolly Parton Children's Hospital Main Campus: https://www.dollychildrens.org/about-us/our-locations/dolly-parton-childrens-hospital-main-campus (static_fetch, dollychildrens.org)
- Dolly Parton Children's Hospital: https://www.dollychildrens.org/ (static_fetch, dollychildrens.org)
- Dolly Parton Children's Hospital Specialty Clinics: https://www.dollychildrens.org/medical-services/specialty-clinics/ (static_fetch, dollychildrens.org)
- Dolly Parton Children's Hospital Main Campus: https://www.dollychildrens.org/about-us/our-locations/dolly-parton-childrens-hospital-main-campus/ (static_fetch, dollychildrens.org)
- Monroe Carell Jr. Children's Hospital at Vanderbilt: https://www.childrenshospitalvanderbilt.org/ (static_fetch, childrenshospitalvanderbilt.org)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## North Carolina

- counties: 100
- public-safe nonprofits: 823
- advocate public-safe rows: 864
- provider source targets: 4
- concrete first-party provider targets: 4
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- Duke Children's Hospital & Health Center: https://www.dukehealth.org/hospitals/duke-childrens-hospital (static_fetch, dukehealth.org)
- Levine Children's Hospital: https://atriumhealth.org/medical-services/childrens-services/levine-childrens-hospital (static_fetch, atriumhealth.org)
- WakeMed Children's Services: https://www.wakemed.org/care-and-services/childrens-services (static_fetch, wakemed.org)
- UNC Carolina Institute for Developmental Disabilities: https://cidd.unc.edu/ (static_fetch, cidd.unc.edu)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Georgia

- counties: 159
- public-safe nonprofits: 812
- advocate public-safe rows: 2184
- provider source targets: 4
- concrete first-party provider targets: 4
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 3, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- CHOA Marcus Autism Center: https://www.marcus.org (static_fetch, marcus.org)
- CHOA Marcus Autism Center: https://www.marcus.org/ (static_fetch, marcus.org)
- Marcus Autism Center Contact Us: https://www.marcus.org/contact-us (static_fetch, marcus.org)
- Marcus Autism Center Medical Services: https://www.marcus.org/care-and-services/medical-services (static_fetch, marcus.org)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Nebraska

- counties: 93
- public-safe nonprofits: 751
- advocate public-safe rows: 100
- provider source targets: 4
- concrete first-party provider targets: 4
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- Children's Nebraska: https://www.childrensnebraska.org (static_fetch, childrensnebraska.org)
- Munroe-Meyer Institute: https://www.unmc.edu/mmi (static_fetch, unmc.edu)
- Boys Town National Research Hospital: https://www.boystownhospital.org (static_fetch, boystownhospital.org)
- Munroe-Meyer Institute Appointments: https://www.unmc.edu/mmi/pt-resources/appointments.html (static_fetch, unmc.edu)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Top Recommendations

1. Start provider pulls with the current pull-now states: Louisiana, Indiana, New York, Virginia, Michigan, Kentucky, Tennessee, North Carolina, Georgia, Nebraska.
2. Use New York as the richest immediate provider expansion state because it now combines multiple concrete first-party hospitals with a large existing nonprofit and advocate ecosystem.
3. Keep the next target-authoring wave focused on the remaining limited-pull-now states: none.
4. Use the existing nonprofit, DD, office, and trust targets in those states as supporting context for provider validation, not as substitutes for provider sources.

## Safety Rule

- Do not promote a provider row from a placeholder target that is not clearly state-specific and first-party.
- Do not promote providers directly from directory-style secondary-discovery targets; use them only to discover stronger first-party provider sites or facility pages.
