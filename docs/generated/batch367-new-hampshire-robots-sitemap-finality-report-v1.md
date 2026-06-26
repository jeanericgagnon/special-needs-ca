# Batch 367 New Hampshire Robots Sitemap Finality v1

- classification: BLOCKED
- index_safe: false
- change: tightened the New Hampshire host-family blocker by proving that public robots files alone do not restore a reviewable DHHS lane

## Evidence

- The saved `dhhs.new-hampshire.gov` successor roots remain DNS-dead.
- The exact DHHS, education, NHES, and obvious `nh.gov` successor roots still return the same short `Access Denied` shell with HTTP 403.
- One more bounded pass now shows a split diagnostic picture: `www.dhhs.nh.gov/robots.txt` and `www.nh.gov/robots.txt` are generic public robots files, `www.nh.gov/dhhs/robots.txt` is 404, and `www.dhhs.nh.gov/sitemap.xml` still returns the same short 403 shell, so no public diagnostic recovery lane is preserved there either.
