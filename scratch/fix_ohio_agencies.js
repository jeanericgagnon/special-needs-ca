import Database from 'better-sqlite3';

const db = new Database('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/ca_disability_navigator.db');

const res = db.prepare(`
  UPDATE state_resource_agencies 
  SET evidence_level = 'source_listed' 
  WHERE state_id = 'ohio' AND evidence_level IS NULL
`).run();
console.log(`✓ Updated evidence_level for ${res.changes} curated state resource agencies.`);

db.close();
