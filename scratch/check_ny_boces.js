import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');
const boces = db.prepare("SELECT id, data_origin, verification_status FROM regional_education_agencies WHERE state_id = 'new-york'").all();
console.log(boces);
db.close();
