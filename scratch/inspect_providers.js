import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const states = db.prepare("SELECT distinct county_id FROM resource_providers").all();
console.log("Unique county suffixes in resource_providers:", states);

const countsByState = db.prepare("SELECT count(*) as count, substr(county_id, -3) as suffix FROM resource_providers GROUP BY suffix").all();
console.log("Counts by state suffix:", countsByState);

const ohioProviders = db.prepare("SELECT * FROM resource_providers WHERE county_id LIKE '%-oh' OR id LIKE '%-oh%' OR name LIKE '%Ohio%'").all();
console.log("Ohio Providers matched:", ohioProviders.length);
console.log(ohioProviders);

db.close();
