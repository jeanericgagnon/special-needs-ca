import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class RollbackGenerator {
  constructor(stateConfig, phaseConfig) {
    this.stateConfig = stateConfig;
    this.phaseConfig = phaseConfig;
    this.statements = [];
    this.timestamp = Date.now();
    this.dateStr = new Date().toISOString().split('T')[0];
  }

  escapeSql(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val.toString();
    return `'${val.toString().replace(/'/g, "''")}'`;
  }

  recordInsert(table, recordId) {
    this.statements.push(`DELETE FROM ${table} WHERE id = ${this.escapeSql(recordId)};`);
  }

  recordUpdate(table, oldRow) {
    const sets = Object.keys(oldRow)
      .filter(k => k !== 'id')
      .map(k => `${k} = ${this.escapeSql(oldRow[k])}`)
      .join(', ');
    this.statements.push(`UPDATE ${table} SET ${sets} WHERE id = ${this.escapeSql(oldRow.id)};`);
  }

  recordDelete(table, oldRow) {
    const cols = Object.keys(oldRow).join(', ');
    const vals = Object.values(oldRow).map(v => this.escapeSql(v)).join(', ');
    this.statements.push(`INSERT INTO ${table} (${cols}) VALUES (${vals});`);
  }

  recordMappingInsert(regionalCenterId, countyId) {
    this.statements.push(`DELETE FROM regional_center_counties WHERE regional_center_id = ${this.escapeSql(regionalCenterId)} AND county_id = ${this.escapeSql(countyId)};`);
  }

  recordMappingDelete(regionalCenterId, countyId) {
    this.statements.push(`INSERT INTO regional_center_counties (regional_center_id, county_id) VALUES (${this.escapeSql(regionalCenterId)}, ${this.escapeSql(countyId)});`);
  }

  recordSelpaMappingInsert(selpaId, countyId) {
    this.statements.push(`DELETE FROM selpa_counties WHERE selpa_id = ${this.escapeSql(selpaId)} AND county_id = ${this.escapeSql(countyId)};`);
  }

  recordSelpaMappingDelete(selpaId, countyId) {
    this.statements.push(`INSERT INTO selpa_counties (selpa_id, county_id) VALUES (${this.escapeSql(selpaId)}, ${this.escapeSql(countyId)});`);
  }

  recordRekey(table, oldId, newId, referencesList) {
    // 1. Rename ID back to oldId
    this.statements.push(`UPDATE ${table} SET id = ${this.escapeSql(oldId)} WHERE id = ${this.escapeSql(newId)};`);
    
    // 2. Revert reference table updates
    for (const ref of referencesList) {
      this.statements.push(`UPDATE ${ref.table} SET ${ref.column} = ${this.escapeSql(oldId)} WHERE ${ref.column} = ${this.escapeSql(newId)};`);
    }
  }

  save() {
    if (this.statements.length === 0) return null;

    const rollbackDir = path.resolve(__dirname, `../../../docs/state-upgrades/${this.stateConfig.state_slug}/rollback`);
    if (!fs.existsSync(rollbackDir)) {
      fs.mkdirSync(rollbackDir, { recursive: true });
    }

    const filepath = path.join(rollbackDir, `${this.phaseConfig.phase_id}-rollback-${this.timestamp}.sql`);
    
    const fileContent = `-- Rollback Script for State: ${this.stateConfig.state_name} | Phase: ${this.phaseConfig.phase_id}\n` +
                        `-- Generated At: ${new Date().toISOString()}\n\n` +
                        `BEGIN TRANSACTION;\n\n` +
                        this.statements.reverse().join('\n') + // Revert in reverse order of changes
                        `\n\nCOMMIT;\n`;

    fs.writeFileSync(filepath, fileContent, 'utf8');
    console.log(`✓ Rollback SQL script saved to: docs/state-upgrades/${this.stateConfig.state_slug}/rollback/${path.basename(filepath)}`);
    return filepath;
  }
}
