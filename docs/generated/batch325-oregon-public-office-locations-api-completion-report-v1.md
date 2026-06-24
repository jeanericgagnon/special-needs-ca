# Batch 325 Oregon Public Office Locations API Completion Report v1

- classification: COMPLETE
- index_safe: true
- change: replaced the Oregon custom-shell blocker with the verified public `Office Locations` SharePoint list contract

## Evidence

- Reviewed 2026-06-24 exact official Oregon ODHS office-finder data contract. The live `https://www.oregon.gov/odhs/pages/office-finder.aspx` page preserves a custom `<odhs-office-finder />` component, and the same first-party stack publicly exposes the SharePoint `Office Locations` list at `https://www.oregon.gov/odhs/_api/web/lists/GetByTitle('Office Locations')/items`. That list returns 269 office rows with explicit multi-choice `County` values, office names, addresses, cities, zip codes, phone numbers, and office-type ids. The returned county arrays span all 36 Oregon counties from Baker through Yamhill, and the list itself includes exact local rows such as `Baker City Aging and People with Disabilities` with Baker County, street address, and phone. Oregon therefore now has a reviewed official county-grade ODHS office contract instead of only a custom app shell.
