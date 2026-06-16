# Paid Caregiver / Personal Care Layer Buildout Plan

This document details the architectural design and implementation plan to expose paid caregiver benefits—the state-equivalent of California's IHSS program—on all priority county hub routes.

---

## 1. Goal & Objectives

Many parents of children with severe developmental delays are unaware that state Medicaid waivers allow them to be hired as paid personal care assistants or respite providers for their own children. 

We will introduce a dedicated **Paid Caregiver Guidance Section** to county-level pages across the 10 priority states to:
- Clearly define the state-equivalent program (e.g. CDS in Texas, CDC+ in Florida, CAP/C in North Carolina).
- List parent eligibility rules (e.g., whether minor children's parents are paid, and max weekly hours).
- Provide application steps, appeals pathways, and links to download necessary intake forms.

---

## 2. Dynamic Integration Design

We will enrich the state configuration objects in `frontend/src/lib/stateConfigs.ts` with structured caregiver metadata:

```typescript
export interface CaregiverConfig {
  programName: string;
  agencyName: string;
  parentAllowed: boolean;
  selfDirection: boolean;
  wageEstimate: number;
  sourceUrl: string;
  applicationSteps: string[];
}
```

This configuration will automatically feed:
1. **The Hero Intro Copy:** Dynamically displaying the state's caregiver program name and estimated hourly wage.
2. **The Local Office Routing:** Displaying the specific local offices administering personal care eligibility (e.g., local CDJFS offices in Ohio, county Assistance Offices in Pennsylvania).
3. **The Forms Catalog:** Surfacing the required application forms and caregiver timesheet logs.
