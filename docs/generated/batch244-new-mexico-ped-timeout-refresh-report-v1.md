# Batch 244 New Mexico PED Timeout Refresh Report v1

- classification: BLOCKED
- index_safe: false
- change: tightened the New Mexico education blocker with bounded live PED root and bureau timeout evidence

## Evidence

- Reviewed 2026-06-23 bounded live PED probes alongside the current California-grade packet. Exact official checks on both `https://webnew.ped.state.nm.us/` and `https://webnew.ped.state.nm.us/bureaus/special-education/` still timed out after 25 seconds, and the preserved New Mexico low-token queue still has zero district-owned, county-grade, or regional education leaves on disk. The only retained PED-side URLs are the generic PED root and the statewide Special Education Bureau page, while one retained candidate is still the wrong-role `https://www.nmhealth.org/about/ddsd` cross-role leak on a non-PED host. district_or_county_education_routing therefore remains blocked on authoring exact local education leaves, not on rerunning the same PED roots.

## Repair decision

- Kept New Mexico BLOCKED.
- Confirmed the exact PED root and the statewide PED Special Education Bureau leaf both still time out under a bounded 25-second live probe.
- Kept the repair lane on district-owned, county-grade, or regional leaf authoring instead of reopening PED-root retries.
