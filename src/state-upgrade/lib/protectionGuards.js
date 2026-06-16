export function assertWriteProtection(db, tableName, recordId, forceProtected = false) {
  try {
    const record = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(recordId);
    if (record) {
      const isCurated = record.data_origin === 'curated_seed' || record.data_origin === 'write_protected';
      const isHumanVerified = record.verification_status === 'human_verified' || 
                              record.verification_status === 'official_verified' || 
                              record.verification_status === 'write_protected';
      
      if (isCurated || isHumanVerified) {
        if (forceProtected) {
          console.warn(`⚠️ [FORCE WRITE] Bypassing write guard for protected record '${recordId}' in table '${tableName}' (origin: ${record.data_origin}, status: ${record.verification_status}) due to --force-protected flag.`);
          return;
        }
        throw new Error(`Write Guard Violation: Overwriting or deleting protected record '${recordId}' (origin: ${record.data_origin}, status: ${record.verification_status}) in table '${tableName}' is strictly blocked.`);
      }
    }
  } catch (e) {
    if (e.message.includes('Write Guard Violation')) {
      throw e;
    }
    // Ignore schema or missing record errors
  }
}

export function assertBulkWriteProtection(db, tableName, whereClause, whereArgs = [], forceProtected = false) {
  try {
    // Select all matching records
    const records = db.prepare(`SELECT id, data_origin, verification_status FROM ${tableName} WHERE ${whereClause}`).all(...whereArgs);
    for (const record of records) {
      const isCurated = record.data_origin === 'curated_seed' || record.data_origin === 'write_protected';
      const isHumanVerified = record.verification_status === 'human_verified' || 
                              record.verification_status === 'official_verified' || 
                              record.verification_status === 'write_protected';
      
      if (isCurated || isHumanVerified) {
        if (forceProtected) {
          console.warn(`⚠️ [FORCE WRITE] Bypassing bulk write guard for protected record '${record.id}' in table '${tableName}' (origin: ${record.data_origin}, status: ${record.verification_status}) due to --force-protected flag.`);
          continue;
        }
        throw new Error(`Write Guard Violation: Bulk deletion or update affects protected record '${record.id}' (origin: ${record.data_origin}, status: ${record.verification_status}) in table '${tableName}', which is strictly blocked.`);
      }
    }
  } catch (e) {
    if (e.message.includes('Write Guard Violation')) {
      throw e;
    }
    // Ignore schema or missing record errors
  }
}

export function validateStagedRecordProvenance(record, phaseConfig) {
  if (!record.source_url) {
    throw new Error(`Validation Error: Record is missing source_url.`);
  }

  if (phaseConfig.required_fields) {
    for (const field of phaseConfig.required_fields) {
      // In staging database, fields might be prefixed or named differently
      const recordKey = field === 'physical_address' ? 'extracted_address' :
                        field === 'phone' ? 'extracted_phone' :
                        field === 'website' ? 'source_url' : field;
      if (record[recordKey] === undefined || record[recordKey] === null) {
        throw new Error(`Validation Error: Record is missing required field '${field}' (${recordKey}).`);
      }
    }
  }

  if (phaseConfig.allowed_evidence_levels && !phaseConfig.allowed_evidence_levels.includes(record.evidence_level)) {
    throw new Error(`Validation Error: Record has unallowed evidence level '${record.evidence_level}'.`);
  }
}
