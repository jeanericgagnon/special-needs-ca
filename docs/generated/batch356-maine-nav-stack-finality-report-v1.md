# Batch 356 Maine Nav Stack Finality v1

- classification: BLOCKED
- index_safe: false
- change: widened the Maine county-local blocker from the OFI contact/help lane to the full live DHHS navigation stack, which still exposes office labels and addresses but no county routing

## Evidence

- Reviewed 2026-06-25 one more bounded official Maine DHHS navigation-stack pass across District Office Locations, OFI Contact, OFI Programs & Services, Offices/Divisions, Administrative Office Locations, the DHHS sitemap, and representative `Show Map` shortlinks. The current public stack still preserves office names, office towns, street addresses, phones, emails, program labels, office/division descriptions, and map shortlinks, but it still exposes zero county-served fields, zero service-area labels, and zero county-to-office assignment metadata. The district office page remains the strongest office-address source; the OFI contact/help lane only loops back to district offices plus statewide eligibility routing; Offices/Divisions and Administrative Office Locations add more office labels and addresses but no county routing; the sitemap only confirms the same public office leaves; and the sampled `Show Map` shortlinks still resolve only to raw Google Maps address geocodes. Maine therefore still has official office-grade address proof without any truthful county-to-office or county-to-service-area routing contract on the public host family.
