import os
import re

audit_file = "docs/launch/texas-source-link-audit.md"
output_file = "docs/national-rollout/batch-1-source-link-reconciliation.md"

def classify_error(url, status_msg):
    url_lower = url.lower()
    
    # 1. Fake LIDDA domains
    if "-lidda.tx.gov" in url_lower or "lidda" in url_lower and "ENOTFOUND" in status_msg:
        return "fake_placeholder_domain"
        
    # 2. 403 Forbidden (often bot-blocked)
    if "403" in status_msg:
        return "bot_blocked_human_valid"
        
    # 3. 404 Not Found
    if "404" in status_msg:
        return "dead_404"
        
    # 4. ENOTFOUND (failed DNS)
    if "ENOTFOUND" in status_msg:
        return "stale_needs_replacement"
        
    # 5. Connection Timeout
    if "Timeout" in status_msg:
        return "unknown_needs_browser_check"
        
    return "unknown_needs_browser_check"

def main():
    if not os.path.exists(audit_file):
        print(f"Error: {audit_file} not found.")
        return
        
    with open(audit_file, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    records = []
    
    for line in lines:
        if line.strip().startswith("- [BROKEN"):
            # Format: - [BROKEN Status: 403 / Forbidden] https://integralcare.org (Used by: ...)
            match = re.search(r'- \[BROKEN Status: ([^\]]+)\]\s+(https?://\S+)\s+(.*)', line)
            if match:
                status_msg = match.group(1)
                url = match.group(2)
                used_by = match.group(3)
                
                classification = classify_error(url, status_msg)
                records.append({
                    "url": url,
                    "status": status_msg,
                    "classification": classification,
                    "used_by": used_by
                })
                
    # Reconcile counts
    counts = {}
    for r in records:
        c = r["classification"]
        counts[c] = counts.get(c, 0) + 1
        
    has_repair_items = any(r["classification"] in ["fake_placeholder_domain", "dead_404", "stale_needs_replacement"] for r in records)
    
    # Build markdown report
    report = f"""# Batch 1 Source Link Reconciliation Report

**Date:** June 14, 2026  
**Auditor:** Antigravity (AI Coding Assistant)  
**Release Posture Verdict:** 🛑 **GSC HOLD MUST REMAIN IN PLACE**

---

## 1. Summary of Link Classifications

We analyzed and classified all {len(records)} failed/broken URLs from the Texas link audit:

| Classification | Count | Description | Action Required |
| :--- | :---: | :--- | :--- |
| **`bot_blocked_human_valid`** | {counts.get("bot_blocked_human_valid", 0)} | 403 Forbidden responses (likely due to automated crawler blocks). | Safe. Verify in browser. |
| **`fake_placeholder_domain`** | {counts.get("fake_placeholder_domain", 0)} | Programmatically generated subdomains (e.g., `*-lidda.tx.gov`). | **Critical Repair.** Must be replaced. |
| **`dead_404`** | {counts.get("dead_404", 0)} | 404 Page Not Found responses. | **Critical Repair.** Replace with live deep links. |
| **`stale_needs_replacement`** | {counts.get("stale_needs_replacement", 0)} | Domains that failed DNS resolution (`ENOTFOUND`). | **Critical Repair.** Replace with live deep links. |
| **`unknown_needs_browser_check`** | {counts.get("unknown_needs_browser_check", 0)} | Timeouts or general socket connection drops. | Needs manual verification. |

---

## 2. Verdict & Risk Analysis

> [!WARNING]
> **Active GSC Hold Enforced:** Because the allowlisted Texas county pages still contain {counts.get("fake_placeholder_domain", 0)} fake LIDDA domains and {counts.get("dead_404", 0) + counts.get("stale_needs_replacement", 0)} dead or DNS-failing links, **the Google Search Console (GSC) sitemap submission hold must remain active**.
> Submitting these pages for indexing with invalid or fake links risks penalties for low-quality doorways and broken crawler paths.

---

## 3. Sample Classified Broken Links Registry (First 50):

| Classification | Flagged URL | Status | Mapped Entity |
| :--- | :--- | :---: | :--- |
"""
    for r in records[:50]:
        report += f"| `{r['classification']}` | {r['url']} | {r['status']} | {r['used_by']} |\n"
        
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(report)
        
    print(f"Reconciliation report written to {output_file}")

if __name__ == '__main__':
    main()
