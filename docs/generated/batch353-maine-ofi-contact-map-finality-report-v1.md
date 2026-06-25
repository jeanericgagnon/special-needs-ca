# Batch 353 Maine OFI Contact And Map Finality v1

- classification: BLOCKED
- index_safe: false
- change: strengthened the Maine county-local blocker by proving the OFI contact/help lane and sampled `Show Map` shortlinks still add only office addresses, not county routing

## Evidence

- Reviewed 2026-06-25 one more bounded official Maine DHHS/OFI county-local pass on same-host contact surfaces and two representative `Show Map` shortlinks. The DHHS district office page still preserves office towns, addresses, phones, emails, map shortlinks, and OFI program links, but no county-served or service-area fields. The OFI contact page at `/dhhs/ofi/about-us/contact` stays live, yet it only repeats the same `District Office locations` link plus statewide eligibility/help routing and exposes no county crosswalk, no office-assignment table, and no service-area text. The OFI programs-and-services page stays equally generic. The `Show Map` shortlinks from the district office page resolve only to raw Google Maps address geocodes such as `35 Anthony Ave, Augusta, ME 04330` and `19 Maine Ave, Bangor, ME 04401`; they add address confirmation, but no county names, no district-office identifiers, and no county-to-office routing metadata. Maine therefore still has office-grade address proof without any truthful county-to-office or county-to-service-area routing contract on the official public host family.
