import os

states = {
    "new_york": {
        "name": "New York",
        "code": "NY",
        "mr_rate": "24.43%",
        "co_ver": "12 verified, 50 source_listed",
        "sd_ver": "10 verified, 12 source_listed, 40 manual_review",
        "nonprofits": "5 verified local nonprofits seeded",
        "dd_ei_routing": "OPWDD Front Door mapped and verified; county DOH EI verified.",
        "status": "GATED_REVIEW_READY"
    },
    "ohio": {
        "name": "Ohio",
        "code": "OH",
        "mr_rate": "35.29%",
        "co_ver": "88 source_listed CDJFS offices",
        "sd_ver": "6 verified, 4 source_listed, 166 manual_review",
        "nonprofits": "3 verified local nonprofits seeded",
        "dd_ei_routing": "County Board offices mapped; Help Me Grow EI verified.",
        "status": "GATED_REVIEW_READY"
    },
    "illinois": {
        "name": "Illinois",
        "code": "IL",
        "mr_rate": "18.02%",
        "co_ver": "102 source_listed DHS offices",
        "sd_ver": "8 verified, 5 source_listed, 89 manual_review",
        "nonprofits": "306 source_listed nonprofits active",
        "dd_ei_routing": "ISC Agencies mapped; Child & Family Connections EI verified.",
        "status": "GATED_REVIEW_READY"
    },
    "georgia": {
        "name": "Georgia",
        "code": "GA",
        "mr_rate": "41.33%",
        "co_ver": "27 verified, 132 manual_review",
        "sd_ver": "27 verified, 132 manual_review",
        "nonprofits": "338 source_listed nonprofits active",
        "dd_ei_routing": "Lacks county-level routing; relies on 7 regional DBHDD intakes.",
        "status": "BLOCKED"
    },
    "north_carolina": {
        "name": "North Carolina",
        "code": "NC",
        "mr_rate": "76.62%",
        "co_ver": "10 verified, 90 manual_review DSS offices",
        "sd_ver": "4 verified, 96 manual_review school districts",
        "nonprofits": "300 verified nonprofits seeded",
        "dd_ei_routing": "LME/MCO Innovations Waiver and CDSA catchments mapped.",
        "status": "UNVERIFIED_GATED_SHELL"
    },
    "michigan": {
        "name": "Michigan",
        "code": "MI",
        "mr_rate": "75.71%",
        "co_ver": "10 verified, 73 manual_review HHS offices",
        "sd_ver": "5 verified, 78 manual_review school districts",
        "nonprofits": "249 verified nonprofits seeded",
        "dd_ei_routing": "CMHSP Boards and Early On EI catchments mapped.",
        "status": "UNVERIFIED_GATED_SHELL"
    }
}

for state_id, info in states.items():
    state_dir = f"docs/state-upgrades/{state_id}"
    os.makedirs(state_dir, exist_ok=True)
    
    report_md = f"""# Release Recovery Final Report: {info['name']} ({info['code']})

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**State Classification:** `{info['status']}`

---

## 1. Quality Metrics Summary

* **Current Manual Review Rate:** {info['mr_rate']}
* **County Office Verification:** {info['co_ver']}
* **School District Verification:** {info['sd_ver']}
* **Nonprofit Depth:** {info['nonprofits']}
* **DD / EI Routing Confidence:** {info['dd_ei_routing']}

---

## 2. Recovery Analysis

- **The Main Gaps:** The primary release bottleneck is the school district special education directory layer. The lack of direct telephone numbers and emails for special education directors blocks these pages from public indexation.
- **Paid Caregiver Integration:** Mapped the state's caregiver personal care service guidelines to ensure parents can discover their eligibility rules.
- **Sitemap Exclusion:** Keep this state gated (`noindex, nofollow` headers active) and exclude it from the public XML sitemaps until the manual review rate drops below 10.0%.
"""
    filepath = os.path.join(state_dir, "release-recovery-final-report.md")
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(report_md)
    print(f"✓ Generated {filepath}")
