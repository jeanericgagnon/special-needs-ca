import assert from 'node:assert/strict';
import { classifyGeorgiaDdBlocker, inspectGeorgiaDbhddCountyPage } from './run-batch30-georgia-dd-blocker-refresh-v1.mjs';

const html = `
<html>
  <body>
    <table>
      <tr><th>County</th><th>Region</th></tr>
      <tr><td></td><td>Region 1 Field Office</td></tr>
      <tr><td></td><td>Region 2 Field Office</td></tr>
    </table>
  </body>
</html>
`;

const inspection = inspectGeorgiaDbhddCountyPage(
  html,
  'https://dbhdd.georgia.gov/regional-field-office-county',
  '2026-06-21T00:00:00.000Z',
);
assert.equal(inspection.rowCount, 2);
assert.equal(inspection.emptyCountyCount, 2);

const blocker = classifyGeorgiaDdBlocker(inspection, [
  { url: 'https://dbhdd.georgia.gov/region-1-field-office', status: 403 },
  { url: 'https://dbhdd.georgia.gov/region-2-field-office', status: 403 },
  { url: 'https://dbhdd.georgia.gov/regional-field-offices', status: 200 },
]);
assert.equal(
  blocker.blocker_code,
  'official_county_lookup_table_has_empty_county_cells',
  'Georgia DD blocker should remain closed when the county table is blank and the obvious same-domain region leaves are forbidden.',
);

console.log('test-batch30-georgia-dd-blocker-refresh-v1: ok');
