# Kansas DD Host Access Pattern Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: developmental_disability_idd_authority
- failure_code: exact_kdads_and_kancare_dd_leaves_are_hostwide_access_denied_while_robots_stays_open

## Evidence

- Reviewed 2026-06-23 bounded live official Kansas DD probes on https://www.kdads.ks.gov/, https://www.kdads.ks.gov/services/developmental-disabilities, https://www.kdads.ks.gov/services/disability-services, https://www.kdads.ks.gov/commissions/home-community-based-services-hcbs, https://www.kdads.ks.gov/search?searchTerm=developmental%20disabilities, https://www.kdads.ks.gov/sitemap.xml, https://www.kancare.ks.gov/, https://www.kancare.ks.gov/home-and-community-based-services-hcbs, https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000, https://www.kancare.ks.gov/search-results?searchtext=developmental%20disability, and https://www.kancare.ks.gov/sitemap.xml. Every exact KDADS and KanCare content, search, and sitemap surface returned the same Access Denied shell in bounded raw fetches, while https://www.kdads.ks.gov/robots.txt still responded publicly. Kansas therefore still lacks any raw-fetch-reviewable official DD authority leaf, and the blocker is now transport-specific rather than a generic stale-root claim.

## Repair decision

- Kansas DD remains blocked on a hostwide transport pattern, not just a stale root.
- Exact KDADS DD leaves, search, and sitemap are access denied; the supporting KanCare crossover leaves are too.
- The next honest lane is browser-assisted or alternate-official DD review.
