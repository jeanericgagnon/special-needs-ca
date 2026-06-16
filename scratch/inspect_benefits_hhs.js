import fs from 'fs';

const records = JSON.parse(fs.readFileSync('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/new-york/phase_records/benefits_hhs.json', 'utf8'));
console.log(`Number of records: ${records.length}`);
console.log("Counties generated:", records.map(r => r.physical_county));
