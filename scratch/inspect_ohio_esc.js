import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const escs = db.prepare("SELECT id, name, verification_status FROM regional_education_agencies WHERE state_id = 'ohio'").all();
console.log(`Ohio ESCs Count: ${escs.length}`);
console.log(escs);
db.close();
