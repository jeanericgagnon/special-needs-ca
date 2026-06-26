# Batch 389 New Mexico Live vs Shadow List Finality v1

- classification: BLOCKED
- index_safe: false
- change: tightened the education blocker to distinguish the live 935-row WebED list from a zero-item shadow schema and to prove the exact PED REC leaf still times out or aborts under bounded live checks

## Conclusion

- The live official `2017 NM Schools` list remains the controlling public row contract and still exposes only `Title` plus `Column2` through `Column13` on actual rows.
- A separate shadow `NM Schools` schema exposes `County Name`, but it has `ItemCount=0` and cannot be used as county-grade public routing proof.
- The exact PED `REC Executive Directors Directory` leaf is also not a current fallback contract because a bounded plain fetch timed out after 15 seconds and a browser-style probe aborted before rendering body text.
- New Mexico stays BLOCKED and index_safe=false until a live official county-to-district or county-to-REC contract appears.
