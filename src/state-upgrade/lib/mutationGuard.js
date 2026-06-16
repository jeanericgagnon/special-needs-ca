export function getDbChecksum(db) {
  const checksum = {};
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
  
  for (const table of tables) {
    if (table.startsWith('staging_') || table === 'sqlite_sequence' || table === 'staging_promotion_audit') {
      continue;
    }
    try {
      const cnt = db.prepare(`SELECT count(*) as cnt FROM ${table}`).get().cnt;
      checksum[table] = cnt;
    } catch (e) {
      // Ignore errors for missing tables
    }
  }
  return checksum;
}

export function assertMutationSafety(preChecksum, postChecksum, allowedTables) {
  for (const table in preChecksum) {
    if (preChecksum[table] !== postChecksum[table]) {
      if (!allowedTables.includes(table)) {
        throw new Error(`Mutation Guard Violation: Table '${table}' was mutated (Row Count: ${preChecksum[table]} -> ${postChecksum[table]}), but it is not in the allowed tables list for this phase: [${allowedTables.join(', ')}].`);
      }
    }
  }
}

export function getProtectedRecordCounts(db) {
  const counts = {};
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
  
  for (const table of tables) {
    if (table.startsWith('staging_') || table === 'sqlite_sequence' || table === 'staging_promotion_audit') {
      continue;
    }
    try {
      // Check if table exists and has relevant columns
      const cols = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
      const hasOrigin = cols.includes('data_origin');
      const hasVerification = cols.includes('verification_status');
      
      if (hasOrigin || hasVerification) {
        let query = `SELECT count(*) as cnt FROM ${table} WHERE `;
        const conditions = [];
        if (hasOrigin) {
          conditions.push(`data_origin IN ('curated_seed', 'write_protected')`);
        }
        if (hasVerification) {
          conditions.push(`verification_status IN ('human_verified', 'official_verified', 'write_protected')`);
        }
        query += conditions.join(' OR ');
        
        const cnt = db.prepare(query).get().cnt;
        counts[table] = cnt;
      }
    } catch (e) {
      // Ignore errors
    }
  }
  return counts;
}

export function assertProtectedCountsSafety(preCounts, postCounts, forceProtected = false) {
  for (const table in preCounts) {
    const pre = preCounts[table] || 0;
    const post = postCounts[table] || 0;
    if (post < pre) {
      const diff = pre - post;
      if (forceProtected) {
        console.warn(`⚠️ [FORCE WRITE] Protected records count in table '${table}' decreased from ${pre} to ${post} (lost ${diff} records) due to --force-protected flag.`);
        continue;
      }
      throw new Error(`Promotion Guard Violation: Protected record count in table '${table}' decreased from ${pre} to ${post} (lost ${diff} records). This is strictly blocked to prevent silent deletion of write-protected data.`);
    }
  }
}
