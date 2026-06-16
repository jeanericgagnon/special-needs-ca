import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const offices = db.prepare("SELECT * FROM county_offices WHERE county_id LIKE '%-oh' AND verification_status = 'source_listed'").all();
console.log(offices);
db.close();
