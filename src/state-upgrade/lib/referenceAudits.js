export function runReferenceAudit(db, targetTable, oldId) {
  const references = [];
  
  // 1. Get all tables in the database
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
  
  for (const table of tables) {
    if (table.startsWith('staging_') || table === 'sqlite_sequence' || table === 'staging_promotion_audit') {
      continue;
    }
    
    // Check foreign keys via SQLite PRAGMA
    try {
      const fks = db.prepare(`PRAGMA foreign_key_list(${table})`).all();
      for (const fk of fks) {
        if (fk.table === targetTable) {
          const colName = fk.from;
          const rows = db.prepare(`SELECT count(*) as count FROM ${table} WHERE ${colName} = ?`).get(oldId);
          if (rows && rows.count > 0) {
            references.push({ table, column: colName, count: rows.count });
          }
        }
      }
    } catch (e) {
      // Table pragma failed or table not found
    }
    
    // 2. Also check common column naming conventions
    const columnMappings = {
      'school_districts': ['school_district_id', 'district_id'],
      'state_resource_agencies': ['regional_center_id', 'agency_id', 'state_resource_agency_id'],
      'county_offices': ['county_office_id'],
      'programs': ['program_id']
    };
    
    const possibleCols = columnMappings[targetTable] || [];
    for (const col of possibleCols) {
      try {
        const colsInfo = db.prepare(`PRAGMA table_info(${table})`).all();
        if (colsInfo.some(c => c.name === col)) {
          const rows = db.prepare(`SELECT count(*) as count FROM ${table} WHERE ${col} = ?`).get(oldId);
          if (rows && rows.count > 0) {
            if (!references.some(r => r.table === table && r.column === col)) {
              references.push({ table, column: col, count: rows.count });
            }
          }
        }
      } catch (e) {
        // Query failed
      }
    }
  }
  
  return references;
}

export function updateReferencesInTransaction(db, targetTable, oldId, newId, referencesList) {
  for (const ref of referencesList) {
    db.prepare(`
      UPDATE ${ref.table}
      SET ${ref.column} = ?
      WHERE ${ref.column} = ?
    `).run(newId, oldId);
    console.log(`  ✓ Updated references in table ${ref.table} (${ref.column}): ${ref.count} rows`);
  }
}
