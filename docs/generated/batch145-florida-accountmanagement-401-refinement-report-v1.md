# Florida Accountmanagement 401 Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: myaccess_accountmanagement_endpoints_exist_but_require_authentication_for_county_results

## Evidence

- Reviewed 2026-06-22 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, and https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch. The Family Resource Center CSV still preserves reviewed storefront coverage for only 34/67 Florida counties. The public config and main bundle explicitly name partnerApproverServices=/accountmanagement and service paths `/getZipCountyDetails` plus `/communityPartnerSearch`, proving the MyACCESS lane does have a same-domain county-search contract. But bounded anonymous POST probes to those exact official endpoints returned HTTP 401 with `{"message":"Unauthorized"}` for ZIP and county sample payloads. The older public shell, plain GET proxy lane, Broward/Dade stub, sample rows, and dead `ess-storefronts-and-lobbies` help link still fail as public county-grade evidence. Florida therefore remains blocked not because no official contract exists, but because the remaining county-results contract is authenticated-only and not publicly reviewable for the other 33 counties.

## Repair decision

- The same-domain accountmanagement endpoints are real official contracts, but they are not public anonymous county-result lanes.
- Florida remains blocked until a public county dataset or other anonymous official office contract exists for the remaining counties.
