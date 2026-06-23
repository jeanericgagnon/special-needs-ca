# Batch 183 Kansas Uniform SERVE_403 Refinement Report v1

- classification: BLOCKED
- index_safe: false
- refined_family: developmental_disability_idd_authority
- failure_code: uniform_tiny_serve_403_shell_on_kdads_and_kancare_dd_stack

## Evidence

- Reviewed 2026-06-23 bounded live official Kansas DD probes with a browser-style client on https://www.kdads.ks.gov/, https://www.kdads.ks.gov/services/developmental-disabilities, https://www.kdads.ks.gov/robots.txt, https://www.kancare.ks.gov/, and https://www.kancare.ks.gov/home/showpublisheddocument/6224/639013892674730000. Every exact official root and leaf still returned HTTP 403 with the same tiny `Access Denied` HTML shell (roughly 412-476 bytes) and a pseudo-path containing `$(SERVE_403)` rather than role-bearing content. That same denial pattern now holds on the site root, the exact DD leaf, robots.txt, the KanCare root, and the HCBS fact-sheet leaf even under a browser-style fetch contract. Kansas therefore still lacks any publicly raw-fetch-reviewable official DD authority surface, and the blocker should stay classified as a uniform transport denial rather than a content-discovery gap.

## Repair decision

- Kansas remains blocked and not index-safe.
- The DD lane is now sharper in a reusable way: both official hosts return the same tiny `Access Denied` shell across root, exact leaf, and robots.
- The blocker should stay classified as transport-blocked until browser review or an alternate official DD surface exists outside those hosts.
