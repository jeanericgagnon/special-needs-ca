import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const ddros = db.prepare("SELECT id, data_origin, verification_status FROM state_resource_agencies WHERE state_id = 'new-york'").all();
console.log(ddros);
db.close();
