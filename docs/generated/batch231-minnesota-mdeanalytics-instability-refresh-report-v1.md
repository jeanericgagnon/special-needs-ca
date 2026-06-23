# Batch 231 Minnesota MDEAnalytics Instability Refresh Report v1

- classification: BLOCKED
- index_safe: false
- family updated: district_or_county_education_routing

## What changed

- Kept the public MDE-ORG glossary root as real official evidence.
- Confirmed the district, county, and contact child routes still land on Radware captcha pages.
- Corrected the education blocker to reflect that `MDEAnalytics/Data.jsp` is unstable rather than simply absent: one bounded probe returned a live `Data Reports and Analytics` shell, while a second exact probe on the same route flipped to `Radware Captcha Page`.

## Result

- Minnesota remains BLOCKED and index_safe=false.
- The education lane is now more precise: live official root, challenged directory routes, unstable analytics route, and still no reproducible county-grade contract.
