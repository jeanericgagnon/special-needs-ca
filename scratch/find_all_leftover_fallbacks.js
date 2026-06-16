import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../ca_disability_navigator.db');

const db = new Database(dbPath, { readonly: true });

const tables = [
  { name: 'county_offices', idCol: 'id', countyCol: 'county_id' },
  { name: 'school_districts', idCol: 'id', countyCol: 'county_id' },
  { name: 'nonprofit_organizations', idCol: 'id', countyCol: 'county_id' },
  { name: 'state_resource_agencies', idCol: 'id', countyCol: 'state_id' },
  { name: 'regional_education_agencies', idCol: 'id', countyCol: 'state_id' }
];

const tbl = tables[1]; // school_districts
let parentCol = tbl.countyCol;
let filterCond = "AND parent NOT LIKE '%-ca'";

const query = `
  SELECT ${tbl.idCol} as id, ${tbl.countyCol} as parent, data_origin, verification_status 
  FROM ${tbl.name} 
  WHERE (data_origin = 'programmatic_fallback' OR ${tbl.idCol} LIKE '%-fallback')
    ${filterCond}
`;
const rows = db.prepare(query).all();
console.log(`\n=== Leftover Fallbacks in ${tbl.name} ===`);
console.log(rows);

db.close();
