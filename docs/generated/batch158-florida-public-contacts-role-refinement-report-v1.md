# Florida Public Contacts Role Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: county_local_disability_resources
- failure_code: public_dcf_contacts_csv_is_county_complete_but_wrong_service_role_and_myaccess_results_remain_authenticated

## Evidence

- Reviewed 2026-06-23 bounded live official checks on https://familyresourcecenter.myflfamilies.com/providers.csv, https://www.myflfamilies.com/contact-us, https://www.myflfamilies.com/contact-us/contacts.csv, https://myaccess.myflfamilies.com/Public/CPCPS, https://myaccess.myflfamilies.com/config/appconfig.js, https://myaccess.myflfamilies.com/accountmanagement/getZipCountyDetails, and https://myaccess.myflfamilies.com/accountmanagement/communityPartnerSearch. The Family Resource Center HTML and providers.csv still preserve reviewed storefront coverage for only 34/67 counties. The public Florida DCF contact-us page, however, now loads a live first-party contacts.csv that preserves 109 rows and explicit county coverage for all 67 Florida counties through 20 circuit header rows plus named service contacts. That public CSV is real, but its row roles are general DCF contacts such as Child and Family Well-Being, Substance Abuse Licensing, Refugee Services, Adult Protective Services, and Client Relations; it does not expose ACCESS, Medicaid, SNAP, TANF, economic self-sufficiency, or county office intake routing. The public config and main bundle still name partnerApproverServices=/accountmanagement and service paths `/getZipCountyDetails` plus `/communityPartnerSearch`, but bounded anonymous POST probes to those exact official endpoints return HTTP 401 with `{"message":"Unauthorized"}`. Florida therefore remains blocked not because no county-complete public contract exists, but because the county-complete public contract is the wrong service role and the public-assistance county-result lane remains authenticated-only.

## Repair decision

- Florida does publish a county-complete first-party contacts.csv, but it is a general DCF contact directory rather than an ACCESS or Medicaid office contract.
- The public storefront CSV still stops at 34 counties, and the remaining MyACCESS county-result endpoints stay authenticated-only.
- Florida remains blocked until a role-matching public-assistance county contract exists or the authenticated county-result lane becomes public.
