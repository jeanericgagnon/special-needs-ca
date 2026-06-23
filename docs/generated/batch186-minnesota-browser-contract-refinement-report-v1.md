# Batch 186 Minnesota Browser Contract Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_families: district_or_county_education_routing, county_local_disability_resources

## Education evidence

- Reviewed 2026-06-23 bounded browser and exact-root HTML checks on the live official Minnesota education lane. The root page at https://education.mn.gov/MDE/about/SchOrg/ is live, titled `Schools and Organizations (MDE-ORG)`, explicitly says MDE-ORG is a searchable database that includes school, district, and education-related organization directories and can generate files from search parameters, and exposes exact child surfaces `https://pub.education.mn.gov/MDEAnalytics/Data.jsp`, `https://pub.education.mn.gov/MDEAnalytics/DataSecure.jsp`, `https://pub.education.mn.gov/MDEAnalytics/Sleds.jsp`, `https://pub.education.mn.gov/MDEAnalytics/Summary.jsp`, and `https://pub.education.mn.gov/MdeOrgView/`. But the exact embedded front-end it points to at https://education.mn.gov/mdeprod/groups/communications/documents/unzip/048426/index.html does not render a directory in browser mode either; it opens as a slide-style course shell with text like `This course is designed to be accessible...` and `Progress, Slide 1 of 25`. The public analytics and org-view children land on live Radware captcha pages rather than a public search or export contract. Minnesota therefore still lacks a reviewed first-party county-to-district routing artifact, but the blocker is now correctly narrowed to a live directory root whose exact linked child surfaces are either miswired or challenge-protected.

## County-local evidence

- Reviewed 2026-06-23 bounded browser checks on the exact Minnesota DHS county-and-tribal routing replacements. The legacy `county-and-tribal-offices.jsp` path remains stale, but the slash replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/county-and-tribal-offices/ now lands on a live `validate.perfdrive.com` Radware Bot Manager captcha page titled `Radware Bot Manager Captcha` with body text `Please validate your request` and `Complete this task to confirm you are a human generating this request.` The adjacent replacement at https://mn.gov/dhs/people-we-serve/adults/services/disability-services/partners-and-providers/county-tribal-nation-directory/ also resolves into the same validate.perfdrive.com captcha family. Minnesota therefore still lacks a reviewed county-grade local office contract in bounded low-token mode, but the blocker is now precisely a live replatformed DHS family fronted by Radware captcha rather than one bad redirect guess.

## Repair decision

- Minnesota remains blocked and not index-safe.
- The MDE-ORG root is live, but its exact linked child is miswired into an unrelated course shell and the adjacent official summary surface is challenge-protected.
- The DHS county-and-tribal replacement family is also live, but browser review lands on a Radware captcha before any county-grade contract appears.
