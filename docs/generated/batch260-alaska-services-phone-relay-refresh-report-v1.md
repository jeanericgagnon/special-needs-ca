# Batch 260 Alaska Services Phone Relay Refresh Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: live_dfcs_services_page_only_provides_statewide_phone_relay_while_health_host_county_equivalent_directory_stays_challenged

## Evidence

- Reviewed 2026-06-23 bounded official Alaska rechecks against the live DFCS successor hub plus the challenged health host. The current DFCS Services page at https://dfcs.alaska.gov/Pages/Services.aspx is live and publicly reviewable. It now preserves explicit statewide phone-only routing for `Adult Public Assistance` and `Apply for Medicaid`, both with the same statewide number `888-804-6330`, and its exact links point to https://health.alaska.gov/en/services/adult-public-assistance-apa/ and https://health.alaska.gov/en/services/division-of-public-assistance-services/apply-for-medicaid/. But those health-host leaves still return HTTP 403 with the Cloudflare `Just a moment...` shell in the low-token lane, just like the reviewed DPA offices directory at https://health.alaska.gov/en/resources/division-of-public-assistance-dpa-offices/ and the legacy office-locations page at https://health.alaska.gov/dpa/Pages/office-locations.aspx. The DFCS Department Contacts page is also live, but it still exposes no borough names, no census-area names, and no Public Assistance or disability office-location mapping contract. So Alaska now has better proof that the successor hub exists and offers statewide program phone routing, but it still lacks a reviewable borough- or census-area-to-office contract and remains blocked.

## Repair decision

- Alaska remains blocked and not index-safe.
- The live DFCS Services page proves the successor hub is real and exposes statewide APA/Medicaid phone routing.
- But the page still lacks borough or census-area office mapping, and the office-facing health host remains challenge-blocked.
