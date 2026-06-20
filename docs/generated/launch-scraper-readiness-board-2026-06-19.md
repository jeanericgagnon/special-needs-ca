# Launch Scraper Readiness Board

Generated: 2026-06-19T23:21:12.644Z

Family-by-family readiness board for the launch scraper spec, combining queue state, fixture coverage, lifecycle entry, staging support, and remaining spec gaps.

## Summary

- familyCount: 9
- fullySpecifiedReady: 8
- readyWithSpecGap: 0
- notQueueReadyButSpecified: 1
- notQueueReadyWithSpecGap: 0

## Board

| family | readiness class | ready | author | repair | fixture coverage | stage supported | top spec gap |
|---|---|---:|---:|---:|---|---|---|
| dd_routing | fully_specified_ready | 12 | 0 | 78 | accepted_and_rejected | true |  |
| programs_benefits | fully_specified_ready | 30 | 0 | 4 | accepted_and_rejected | true |  |
| waivers | fully_specified_ready | 13 | 0 | 78 | accepted_and_rejected | true |  |
| forms_guides | fully_specified_ready | 220 | 5 | 77 | accepted_and_rejected | true |  |
| program_waitlists | not_queue_ready_but_specified | 0 | 0 | 0 | accepted_and_rejected | true | no_ready_target_scrape_queue |
| medicaid_hhs_offices | fully_specified_ready | 131 | 0 | 0 | accepted_and_rejected | true |  |
| education_routing | fully_specified_ready | 15 | 0 | 0 | accepted_and_rejected | true |  |
| providers_care | fully_specified_ready | 65 | 182 | 0 | accepted_and_rejected | true |  |
| knowledge_content | fully_specified_ready | 65 | 11 | 0 | accepted_and_rejected | true |  |

## dd_routing

- readinessClass: fully_specified_ready
- readyTargetScrape: 12
- authorFirst: 0
- repairFirst: 78
- deferredBlockedSource: 0
- recommendedRunMode: full_lane_when_successful
- startQueueClass: ready_target_scrape
- fixtureCoverageClass: accepted_and_rejected
- fixtureGap: none
- negativeFixtureClosureStatus: not_applicable
- stageSupported: true
- stagingTable: staging_scraped_state_resource_agencies
- topSpecGap: none

## programs_benefits

- readinessClass: fully_specified_ready
- readyTargetScrape: 30
- authorFirst: 0
- repairFirst: 4
- deferredBlockedSource: 0
- recommendedRunMode: fetch_only_first
- startQueueClass: ready_target_scrape
- fixtureCoverageClass: accepted_and_rejected
- fixtureGap: none
- negativeFixtureClosureStatus: not_applicable
- stageSupported: true
- stagingTable: staging_scraped_programs
- topSpecGap: none

## waivers

- readinessClass: fully_specified_ready
- readyTargetScrape: 13
- authorFirst: 0
- repairFirst: 78
- deferredBlockedSource: 0
- recommendedRunMode: full_lane_when_successful
- startQueueClass: ready_target_scrape
- fixtureCoverageClass: accepted_and_rejected
- fixtureGap: none
- negativeFixtureClosureStatus: not_applicable
- stageSupported: true
- stagingTable: staging_scraped_programs
- topSpecGap: none

## forms_guides

- readinessClass: fully_specified_ready
- readyTargetScrape: 220
- authorFirst: 5
- repairFirst: 77
- deferredBlockedSource: 0
- recommendedRunMode: fetch_only_first
- startQueueClass: ready_target_scrape
- fixtureCoverageClass: accepted_and_rejected
- fixtureGap: none
- negativeFixtureClosureStatus: not_applicable
- stageSupported: true
- stagingTable: staging_scraped_forms
- topSpecGap: none

## program_waitlists

- readinessClass: not_queue_ready_but_specified
- readyTargetScrape: 0
- authorFirst: 0
- repairFirst: 0
- deferredBlockedSource: 0
- recommendedRunMode: author_first_only
- startQueueClass: author_first
- fixtureCoverageClass: accepted_and_rejected
- fixtureGap: none
- negativeFixtureClosureStatus: not_applicable
- stageSupported: true
- stagingTable: staging_scraped_waitlists
- topSpecGap: no_ready_target_scrape_queue

## medicaid_hhs_offices

- readinessClass: fully_specified_ready
- readyTargetScrape: 131
- authorFirst: 0
- repairFirst: 0
- deferredBlockedSource: 0
- recommendedRunMode: fetch_only_first
- startQueueClass: ready_target_scrape
- fixtureCoverageClass: accepted_and_rejected
- fixtureGap: none
- negativeFixtureClosureStatus: not_applicable
- stageSupported: true
- stagingTable: staging_scraped_county_offices
- topSpecGap: none

## education_routing

- readinessClass: fully_specified_ready
- readyTargetScrape: 15
- authorFirst: 0
- repairFirst: 0
- deferredBlockedSource: 0
- recommendedRunMode: full_lane_when_successful
- startQueueClass: ready_target_scrape
- fixtureCoverageClass: accepted_and_rejected
- fixtureGap: none
- negativeFixtureClosureStatus: not_applicable
- stageSupported: true
- stagingTable: staging_scraped_regional_education_agencies
- topSpecGap: none

## providers_care

- readinessClass: fully_specified_ready
- readyTargetScrape: 65
- authorFirst: 182
- repairFirst: 0
- deferredBlockedSource: 0
- recommendedRunMode: fetch_only_first
- startQueueClass: ready_target_scrape
- fixtureCoverageClass: accepted_and_rejected
- fixtureGap: none
- negativeFixtureClosureStatus: not_applicable
- stageSupported: true
- stagingTable: staging_scraped_resource_providers
- topSpecGap: none

## knowledge_content

- readinessClass: fully_specified_ready
- readyTargetScrape: 65
- authorFirst: 11
- repairFirst: 0
- deferredBlockedSource: 54
- recommendedRunMode: fetch_only_first
- startQueueClass: ready_target_scrape
- fixtureCoverageClass: accepted_and_rejected
- fixtureGap: none
- negativeFixtureClosureStatus: not_applicable
- stageSupported: true
- stagingTable: staging_scraped_knowledge_content
- topSpecGap: none

