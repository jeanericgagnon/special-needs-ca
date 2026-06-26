import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const repoRoot = process.cwd();
const dbPath = path.join(repoRoot, 'frontend', 'ca_disability_navigator.db');
const outJsonPath = path.join(repoRoot, 'data', 'generated', 'runtime_launch_registry_v1.json');
const outMdPath = path.join(repoRoot, 'docs', 'generated', 'runtime-launch-registry-v1.md');

function countByState(db, tableSql, stateId) {
  return db.prepare(tableSql).get(stateId).c;
}

const db = new Database(dbPath, { readonly: true });
const states = db.prepare('SELECT id, code, name FROM states ORDER BY id').all();

const rows = states.map((state) => {
  const countyCount = countByState(db, 'SELECT COUNT(*) AS c FROM counties WHERE state_id = ?', state.id);
  const programCount = countByState(db, 'SELECT COUNT(*) AS c FROM programs WHERE state_id = ?', state.id);
  const stateResourceAgencyCount = countByState(db, 'SELECT COUNT(*) AS c FROM state_resource_agencies WHERE state_id = ?', state.id);
  const regionalEducationAgencyCount = countByState(db, 'SELECT COUNT(*) AS c FROM regional_education_agencies WHERE state_id = ?', state.id);
  const countyOfficeCount = countByState(
    db,
    'SELECT COUNT(*) AS c FROM county_offices WHERE county_id IN (SELECT id FROM counties WHERE state_id = ?)',
    state.id
  );
  const schoolDistrictCount = countByState(
    db,
    'SELECT COUNT(*) AS c FROM school_districts WHERE county_id IN (SELECT id FROM counties WHERE state_id = ?)',
    state.id
  );

  const hasProgramLayer = programCount > 0;
  const hasLocalCountyLayer = countyOfficeCount > 0 && schoolDistrictCount > 0;
  const hasStateRoutingLayer = stateResourceAgencyCount > 0 || regionalEducationAgencyCount > 0;
  const runtimeIndexSafe = hasProgramLayer && (hasLocalCountyLayer || hasStateRoutingLayer);

  const blockers = [];
  if (!hasProgramLayer) blockers.push('missing_runtime_programs');
  if (!hasLocalCountyLayer && !hasStateRoutingLayer) blockers.push('missing_runtime_local_or_state_routing');

  return {
    stateId: state.id,
    stateCode: state.code,
    stateName: state.name,
    countyCount,
    programCount,
    countyOfficeCount,
    schoolDistrictCount,
    stateResourceAgencyCount,
    regionalEducationAgencyCount,
    hasProgramLayer,
    hasLocalCountyLayer,
    hasStateRoutingLayer,
    runtimeIndexSafe,
    blockers,
  };
});

const runtimeIndexSafeCount = rows.filter((row) => row.runtimeIndexSafe).length;

const payload = {
  generatedAt: new Date().toISOString(),
  dbPath: 'frontend/ca_disability_navigator.db',
  rule: {
    programLayerRequired: true,
    localCountyLayerRule: 'countyOfficeCount > 0 && schoolDistrictCount > 0',
    stateRoutingLayerRule: 'stateResourceAgencyCount > 0 || regionalEducationAgencyCount > 0',
    runtimeIndexSafeRule: 'programCount > 0 && (localCountyLayer || stateRoutingLayer)',
  },
  runtimeIndexSafeCount,
  states: rows,
};

fs.mkdirSync(path.dirname(outJsonPath), { recursive: true });
fs.mkdirSync(path.dirname(outMdPath), { recursive: true });
fs.writeFileSync(outJsonPath, `${JSON.stringify(payload, null, 2)}\n`);

const md = [
  '# Runtime Launch Registry v1',
  '',
  `Generated at: ${payload.generatedAt}`,
  '',
  `Runtime index-safe states: ${runtimeIndexSafeCount}/${rows.length}`,
  '',
  'Rule:',
  '- programs required',
  '- plus county offices + school districts, or state routing agencies',
  '',
  '| State | Runtime Index Safe | Programs | County Offices | School Districts | State Agencies | Regional Education | Blockers |',
  '| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |',
  ...rows.map((row) => `| ${row.stateName} | ${row.runtimeIndexSafe ? 'yes' : 'no'} | ${row.programCount} | ${row.countyOfficeCount} | ${row.schoolDistrictCount} | ${row.stateResourceAgencyCount} | ${row.regionalEducationAgencyCount} | ${row.blockers.join(', ') || 'none'} |`),
  '',
].join('\n');

fs.writeFileSync(outMdPath, `${md}\n`);
console.log(`Wrote ${outJsonPath}`);
console.log(`Wrote ${outMdPath}`);
