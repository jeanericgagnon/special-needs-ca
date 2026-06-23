# Arizona La Paz Leaf And County Packet Alignment Report v1

- classification: BLOCKED
- index_safe: false
- repaired_counties: la-paz-az
- education_verified_counties: apache-az, graham-az, greenlee-az, la-paz-az, maricopa-az, pinal-az, santa-cruz-az, yuma-az
- education_unresolved_counties: cochise-az, coconino-az, gila-az, mohave-az, navajo-az, pima-az, yavapai-az
- county_local_packet_exact_leaf_count: 0

## What changed

- Added the reviewed Parker Unified School District ESS leaf at `https://www.parkerusd.org/page/ess-department` for La Paz County.
- Updated the Arizona education packet metrics from 7 reviewed exact leaves / 8 unresolved counties to 8 reviewed exact leaves / 7 unresolved counties.
- Corrected the Arizona county-local blocker so it no longer falsely says no packet exists; the real blocker is that the existing packet still has zero reviewed exact county-office leaves.

## Result

- Arizona remains BLOCKED and `index_safe=false` because both critical local families are still incomplete.
- Education is sharper and now verified for 8/15 counties.
- County-local remains blocked until AHCCCS or DES yields a real county-to-office contract or reviewed county-office leaves.

