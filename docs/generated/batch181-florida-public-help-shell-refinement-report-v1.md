# Batch 181 Florida Public Help Shell Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: public_dcf_contacts_csv_is_county_complete_but_wrong_role_help_lane_is_js_shell_and_myaccess_results_remain_authenticated

## Evidence

- Reviewed 2026-06-23 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://www.myflfamilies.com/services/public-assistance, https://www.myflfamilies.com/services/public-assistance/applying-for-assistance, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch, and the first-party MyACCESS help route https://myaccess.myflfamilies.com/Help/HCINT. The Family Resource Center HTML and providers.csv still preserve reviewed storefront coverage for only 34/67 counties. The public Florida DCF contact-us page now loads a live first-party contacts.csv with explicit county coverage for all 67 counties, but the role-field audit returned zero matches for ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, food assistance, and cash assistance. The public service labels that do appear are general DCF roles such as Adult Protective Services, Child and Family Well-Being, Client Relations, Refugee Services, Human Trafficking, and licensing contacts. The public assistance pages do expose first-party links to Family Resource Centers, Community Partner Search, and MyACCESS help, but the `Help/HCINT` lane itself returns only the generic MyACCESS JavaScript shell with "You need to enable JavaScript to run this app" and no county, office, storefront, or customer-service-center rows. The public config and main bundle still name partnerApproverServices=/accountmanagement and service paths `/getZipCountyDetails` plus `/communityPartnerSearch`, but bounded anonymous POST probes to those exact official endpoints return HTTP 401 with `{"message":"Unauthorized"}`. Florida therefore remains blocked because the county-complete public contract is the wrong service role, the first-party help lane is shell-only, and the public-assistance county-result lane remains authenticated-only.

## Repair decision

- Florida remains blocked and not index-safe.
- The public Florida DCF assistance pages do expose one additional first-party help route on the MyACCESS host.
- That help route is not a hidden county-office fallback: it returns only the generic JavaScript shell and no county, office, storefront, or customer-service-center rows.
- The county-local family should stay blocked until a first-party public-assistance county contract becomes anonymously reviewable.
