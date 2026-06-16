# Florida DCF ACCESS / Medicaid-Benefits Routing Model

Analysis of Florida's real Medicaid application routing structure, expanded to include regional storefronts, local community partner points, and library kiosks.

## 1. Routing Model

Florida utilizes a **locator-based mixed model** to process and route Medicaid and public benefit applications. This model is comprised of the following key entry and processing points:

*   **dcf_service_center / access_storefront:** Official state-run storefronts serving major metropolitan counties (14 priority counties + Escambia and Volusia).
*   **access_community_partner:** Local assistance points (often county health departments or community action agencies) hosting computers or staff to assist applicants.
*   **access_kiosk:** Public library or nonprofit service terminals that allow citizens to access the MyACCESS portal in rural counties.
*   **regional_service_hub:** Major regional storefronts (like Jacksonville or Panama City) that also serve as the main processing and enrollment coordination hubs for surrounding rural counties.
*   **online_portal:** The primary statewide self-service application portal (myaccess.myflfamilies.com).
*   **central_call_center:** The central customer call center (1-850-300-4323) serving as a backup navigation layer.

## 2. Location Classification & Confidence Mapping

To reflect data origin and verification confidence honestly, records are categorized as follows:

1.  **access_storefront / dcf_service_center (Confidence: 0.90):** Direct, state-run physical storefront offices. Mapped to 14 priority counties + Escambia and Volusia.
2.  **access_community_partner (Confidence: 0.80):** Verified community partner points (e.g. County Health Departments) listed on official directories.
3.  **access_kiosk (Confidence: 0.70):** Library and local access kiosks providing portal-only terminals.
4.  **online_portal / central_call_center (Confidence: 0.95):** Authoritative statewide processing channels.
