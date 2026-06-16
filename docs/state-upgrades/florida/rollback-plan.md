# Rollback Plan: Florida (FL)

Procedures to revert Florida database promotion.

```sql
DELETE FROM state_resource_agencies WHERE state_id = 'florida';
DELETE FROM regional_center_counties WHERE county_id LIKE '%-fl';
```
