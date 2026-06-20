# Provider Source-Pack Plan

Generated: 2026-06-17

## Why This Exists

- The provider buildout priority plan tells us which states are missing a public-safe provider layer.
- This source-pack plan answers a narrower execution question: which of those states already have source-backed provider targets that are concrete enough to pull now?

## Scope

- Input provider-priority artifact: docs/generated/provider-buildout-priority-plan-2026-06-17.json
- Source target inventory directory: data/source_targets
- State selection rule: top missing-provider states by existing local ecosystem, excluding California because it is still a remediation state and currently lacks a matching provider source-target JSON file.

## Summary

- States included: 10
- Pull now: 4
- Limited pull now: 6
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

- Pull now: Indiana, Michigan, Tennessee, Missouri
- Limited pull now: Kentucky, Nebraska, Kansas, Colorado, Alabama, Iowa
- Replace placeholders first: none
- Author targets first: none

## Indiana

- counties: 92
- public-safe nonprofits: 1507
- advocate public-safe rows: 397
- provider source targets: 3
- concrete first-party provider targets: 3
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- Riley Children's Health: https://www.rileychildrens.org (static_fetch, rileychildrens.org)
- Peyton Manning Children's Hospital: https://healthcare.ascension.org/locations/indiana/inasc/pmch (static_fetch, healthcare.ascension.org)
- Indiana University Health Pediatric Care: https://iuhealth.org (static_fetch, iuhealth.org)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Michigan

- counties: 83
- public-safe nonprofits: 1015
- advocate public-safe rows: 641
- provider source targets: 3
- concrete first-party provider targets: 3
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- C.S. Mott Children's Hospital: https://www.mottchildren.org (static_fetch, mottchildren.org)
- Children's Hospital of Michigan: https://www.childrensdmc.org (static_fetch, childrensdmc.org)
- Helen DeVos Children's Hospital: https://www.spectrumhealth.org/locations/spectrum-health-hospitals-helen-devos-childrens-hospital (static_fetch, spectrumhealth.org)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Kentucky

- counties: 120
- public-safe nonprofits: 962
- advocate public-safe rows: 261
- provider source targets: 2
- concrete first-party provider targets: 2
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: limited-pull-now
- next move: Use the small concrete provider set first, then author 2-5 more state-specific hospital or university clinic targets before scaling.

Concrete first-party provider targets:

- Norton Children's Hospital: https://nortonchildrens.com (static_fetch, nortonchildrens.com)
- Kentucky Children's Hospital: https://ukhealthcare.com (static_fetch, ukhealthcare.com)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Tennessee

- counties: 95
- public-safe nonprofits: 866
- advocate public-safe rows: 131
- provider source targets: 3
- concrete first-party provider targets: 3
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- Monroe Carell Jr. Children's Hospital at Vanderbilt: https://www.childrenshospitalvanderbilt.org (static_fetch, childrenshospitalvanderbilt.org)
- Le Bonheur Children's Hospital: https://www.lebonheur.org (static_fetch, lebonheur.org)
- Children's Hospital at Erlanger: https://www.childrensaterlanger.org (static_fetch, childrensaterlanger.org)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Nebraska

- counties: 93
- public-safe nonprofits: 751
- advocate public-safe rows: 100
- provider source targets: 2
- concrete first-party provider targets: 2
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: limited-pull-now
- next move: Use the small concrete provider set first, then author 2-5 more state-specific hospital or university clinic targets before scaling.

Concrete first-party provider targets:

- Children's Nebraska: https://www.childrensnebraska.org (static_fetch, childrensnebraska.org)
- Munroe-Meyer Institute: https://www.unmc.edu/mmi (static_fetch, unmc.edu)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Kansas

- counties: 105
- public-safe nonprofits: 738
- advocate public-safe rows: 432
- provider source targets: 2
- concrete first-party provider targets: 2
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: limited-pull-now
- next move: Use the small concrete provider set first, then author 2-5 more state-specific hospital or university clinic targets before scaling.

Concrete first-party provider targets:

- Children's Mercy Kansas City: https://www.childrensmercy.org (static_fetch, childrensmercy.org)
- The University of Kansas Health System Pediatric Care: https://www.kansashealthsystem.com (static_fetch, kansashealthsystem.com)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Colorado

- counties: 64
- public-safe nonprofits: 721
- advocate public-safe rows: 564
- provider source targets: 2
- concrete first-party provider targets: 2
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: limited-pull-now
- next move: Use the small concrete provider set first, then author 2-5 more state-specific hospital or university clinic targets before scaling.

Concrete first-party provider targets:

- Children's Hospital Colorado: https://www.childrenscolorado.org (static_fetch, childrenscolorado.org)
- JFK Partners: https://medschool.cuanschutz.edu/jfk-partners (static_fetch, medschool.cuanschutz.edu)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Missouri

- counties: 115
- public-safe nonprofits: 694
- advocate public-safe rows: 967
- provider source targets: 3
- concrete first-party provider targets: 3
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: pull-now
- next move: Start first-party pulls from the concrete clinic and hospital targets already in source_targets.

Concrete first-party provider targets:

- St. Louis Children's Hospital: https://www.stlouischildrens.org/ (static_fetch, stlouischildrens.org)
- Children's Mercy Kansas City: https://www.childrensmercy.org/ (static_fetch, childrensmercy.org)
- SSM Health Cardinal Glennon Children's Hospital: http://www.cardinalglennon.com/ (static_fetch, cardinalglennon.com)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Alabama

- counties: 67
- public-safe nonprofits: 630
- advocate public-safe rows: 33
- provider source targets: 2
- concrete first-party provider targets: 2
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: limited-pull-now
- next move: Use the small concrete provider set first, then author 2-5 more state-specific hospital or university clinic targets before scaling.

Concrete first-party provider targets:

- Children's of Alabama: https://www.childrensal.org/ (static_fetch, childrensal.org)
- UAB Medicine Pediatrics: https://www.uabmedicine.org/ (static_fetch, uabmedicine.org)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Iowa

- counties: 99
- public-safe nonprofits: 601
- advocate public-safe rows: 210
- provider source targets: 2
- concrete first-party provider targets: 2
- placeholder provider targets: 0
- directory-style provider targets: 0
- support targets: nonprofits 2, trust 1, DD 1, offices 1
- readiness lane: limited-pull-now
- next move: Use the small concrete provider set first, then author 2-5 more state-specific hospital or university clinic targets before scaling.

Concrete first-party provider targets:

- University of Iowa Stead Family Children's Hospital: http://www.uichildrens.org/ (static_fetch, uichildrens.org)
- Blank Children's Hospital: https://www.unitypoint.org/desmoines/iowa-methodist-medical-center.aspx (static_fetch, unitypoint.org)

Placeholder provider targets to replace:

- none

Directory-style provider targets to treat as secondary discovery only:

- none

## Top Recommendations

1. Start provider pulls with the current pull-now states: Indiana, Michigan, Tennessee, Missouri.
2. Use New York as the richest immediate provider expansion state because it now combines multiple concrete first-party hospitals with a large existing nonprofit and advocate ecosystem.
3. Keep the next target-authoring wave focused on the remaining limited-pull-now states: Kentucky, Nebraska, Kansas, Colorado, Alabama, Iowa.
4. Use the existing nonprofit, DD, office, and trust targets in those states as supporting context for provider validation, not as substitutes for provider sources.

## Safety Rule

- Do not promote a provider row from a placeholder target that is not clearly state-specific and first-party.
- Do not promote providers directly from directory-style secondary-discovery targets; use them only to discover stronger first-party provider sites or facility pages.
