import { stateConfigs } from '../frontend/src/lib/stateConfigs.ts';
import { NON_CA_VERIFIED_COUNTIES } from '../frontend/src/lib/verifiedCounties.ts';
import Database from 'better-sqlite3';

console.log("Imports succeeded!");
console.log("Total CA config keys:", Object.keys(stateConfigs).length);
console.log("Total NON_CA_VERIFIED_COUNTIES:", NON_CA_VERIFIED_COUNTIES.length);

const db = new Database("ca_disability_navigator.db");
console.log("Database opened successfully.");
db.close();
