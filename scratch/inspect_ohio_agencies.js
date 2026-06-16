import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const agencies = db.prepare("SELECT * FROM state_resource_agencies WHERE state_id = 'ohio'").all();
console.log(`Ohio Agencies Count: ${agencies.length}`);
console.log(agencies);
db.close();
