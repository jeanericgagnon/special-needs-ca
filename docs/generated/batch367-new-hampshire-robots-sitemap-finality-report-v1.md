# Batch 367 New Hampshire Robots Sitemap Finality v1

- classification: BLOCKED
- index_safe: false
- change: tightened the New Hampshire host-family blocker by proving the official DHHS and `nh.gov/dhhs` robots/sitemap diagnostics return the same Access Denied shell as the content roots

## Evidence

- The saved `dhhs.new-hampshire.gov` successor roots remain DNS-dead.
- The exact DHHS, education, NHES, and obvious `nh.gov` successor roots still return the same short `Access Denied` shell with HTTP 403.
- One more bounded pass now shows `robots.txt` and `sitemap.xml` on the official DHHS and `nh.gov/dhhs` family return that same short 403 shell, so no public diagnostic recovery lane is preserved there either.
