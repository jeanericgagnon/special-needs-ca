# Product Usability Pivot 2026-06-17

## Why We Are Pivoting

- Information/status work is documented in `docs/generated/status-pivot-2026-06-17.md`.
- The next leverage is product usability and core functionality, not more token-heavy coverage narration.

## Current Product Surfaces

- Home: `frontend/src/app/page.tsx`
  - primary entry is the benefits wizard
- Find Help hub: `frontend/src/app/find-help/page.tsx`
  - large multi-tool navigation surface
- County detail page: `frontend/src/app/counties/[state]/[slug]/page.tsx`
  - heavy local directory / trust / education / office surface
- Dashboard: `frontend/src/app/dashboard/page.tsx`
  - logged-in ongoing workflow surface

## High-Probability Product Issues

1. County pages are dense and likely overload users before they reach the highest-value actions.
2. Find Help is broad, but may make tool selection harder than it should be.
3. The product has many routes and tools, but the main user journey may not be tightly sequenced.
4. Trust/data disclosures exist, but they may compete with task completion instead of supporting it.

## Product Priority Order

1. Tighten the main user journey from homepage to answer to next action.
2. Simplify county pages around the most urgent actions.
3. Improve Find Help information scent and prioritization.
4. Tighten dashboard usefulness for returning families.

## Competitive Coverage We Need

To compete with Findhelp while staying focused on the disability-family niche, the product needs strong, navigable information across these domains:

1. Housing
   - emergency housing
   - rental help
   - accessible housing
   - utility assistance
   - home modification support
2. Goods
   - food
   - diapers and hygiene supplies
   - medical equipment
   - assistive technology
   - clothing and household goods
3. Jobs
   - parent employment support
   - disability employment services
   - vocational rehabilitation
   - supported employment
   - transition-age youth work pathways
4. Care
   - respite
   - in-home support
   - personal care
   - behavioral support
   - transportation
   - crisis and urgent family support
5. Education
   - early intervention
   - school district and special education navigation
   - IEP and 504 support
   - transition planning
   - postsecondary disability supports
6. Legal
   - disability rights
   - special education disputes
   - benefits appeals
   - guardianship and alternatives
   - immigration / public benefits intersection where relevant

## Product Interpretation

- We do not need to become a generic directory.
- We do need these categories represented in a disability-family workflow, with better guidance, sequencing, and trust than generic resource hubs.
- Our niche advantage should be:
  - disability-specific context
  - state and county specificity
  - actionable next steps
  - trust and freshness signaling
  - integrated planning instead of flat listings

## Recommended Next Build Mode

- Work route-by-route on:
  - task clarity
  - action hierarchy
  - empty states
  - trust disclosure placement
  - save/share/follow-up usability

## Immediate First Target

- `frontend/src/app/counties/[state]/[slug]/page.tsx`
  - largest likely usability drag
  - high value if simplified
  - directly tied to local action-taking
