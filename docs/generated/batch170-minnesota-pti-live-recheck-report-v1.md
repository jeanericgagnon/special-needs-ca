# Batch 170 Minnesota PTI Live Recheck Report v1

This pass does not broaden Minnesota discovery. It rechecks the current PACER first-party site against the older retired PTI path family so the PTI blocker is based on live current evidence instead of only older saved artifacts.

- classification: BLOCKED
- index_safe: false
- refreshed_family: parent_training_information_center
- failure_code: current_pacer_pages_and_retired_pti_paths_do_not_preserve_explicit_pti_designation

## Evidence

- Reviewed 2026-06-23 bounded current PACER first-party probes on https://www.pacer.org/, https://www.pacer.org/about/, https://www.pacer.org/parent/, https://www.pacer.org/advice-guidance/topic-iep-and-504/, https://www.pacer.org/parent/php/PIC/, and https://www.pacer.org/parent/php/PIC/fedfund.asp. The live PACER homepage and About page remain public and current, and the old `/parent/` route now resolves into the general advice-and-guidance page at https://www.pacer.org/advice-guidance/topic-iep-and-504/. However, the rechecked current pages still do not preserve explicit Parent Training and Information Center designation text, while the older `/parent/php/PIC/` and `/parent/php/PIC/fedfund.asp` PTI path family now returns HTTP 404. Minnesota therefore still lacks a saved live first-party PTI designation artifact even though statewide support evidence remains strong.
