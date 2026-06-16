# Ohio School District Depth Audit

This audit evaluates the database depth of school district special education resources for Ohio (OH) compared to the actual public school district universe.

---

## 1. Ohio Public School District Universe

*   **Total Public School Districts (Statewide):** Ohio contains **611 public school districts** operating under local municipal boards, supervised by the Ohio Department of Education and Workforce (ODE).
*   **Total Districts in Database:** **88**
*   **Database Schema Support:** Verified. The `school_districts` table uses a non-unique `county_id` index (`idx_districts_county`), allowing multiple districts to map to a single county (similar to California and Florida). The frontend queries districts using `SELECT * FROM school_districts WHERE county_id = ?` and loops through all matching records to display them in a list.

---

## 2. Coverage Type Classification

*   **County-Level Routing Coverage:** **100.0%** (Every county is covered by exactly one directory entry).
*   **Exhaustive District-Level Coverage:** **14.4%** (88 represented out of 611 actual districts).
*   **District-Level Representative Mappings:** In the 7 metropolitan counties (Cuyahoga, Franklin, Hamilton, Lucas, Montgomery, Stark, Summit), the DB records map to their major municipal school board contacts (e.g., Cleveland Metropolitan School District, Columbus City Schools). For the remaining 81 rural counties, the DB contains a single representative contact record (e.g. Adams County School District Special Education) rather than local municipal districts.

---

## 3. UI and Content Truth Check

*   **Audit Finding:** The current directory copy and headlines (e.g., "Special Education Contacts") map families to "their county directory," which accurately reflects the current routing model. However, to align with the Texas/Florida/New York internal standards, the site copy should explicitly distinguish between **County-Wide Special Education Directory Contacts** and **Individual Municipal School Districts**.
*   **Mitigation:** The frontend UI should list these under the category header **"County-Wide / Primary Special Education Contacts"** to ensure zero false expectations for parents searching for local township districts.
