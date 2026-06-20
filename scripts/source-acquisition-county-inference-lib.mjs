function normalizeText(value) {
  return ` ${String(value || '')
    .toLowerCase()
    .replace(/&amp;/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
}

function stripCountySuffix(name) {
  return String(name || '')
    .replace(/\s+(county|parish|borough|census area|municipality|city and borough|city)$/i, '')
    .trim();
}

export function buildCountyIndex(rows) {
  const byState = new Map();
  for (const row of rows) {
    const stateRows = byState.get(row.state_id) || [];
    const officialNeedle = normalizeText(row.name);
    const shortName = stripCountySuffix(row.name);
    const shortNeedle = shortName && shortName.toLowerCase() !== String(row.name || '').toLowerCase()
      ? normalizeText(shortName)
      : '';
    stateRows.push({
      countyId: row.id,
      name: row.name,
      officialNeedle,
      shortNeedle,
    });
    byState.set(row.state_id, stateRows);
  }
  return byState;
}

function findMatchesInText(text, matchers, { allowShortName = false } = {}) {
  const normalized = normalizeText(text);
  const matches = [];
  for (const matcher of matchers) {
    if (matcher.officialNeedle && normalized.includes(matcher.officialNeedle)) {
      matches.push({ countyId: matcher.countyId, matchedName: matcher.name, matchType: 'official_name' });
      continue;
    }
    if (allowShortName && matcher.shortNeedle && normalized.includes(matcher.shortNeedle)) {
      matches.push({ countyId: matcher.countyId, matchedName: matcher.name, matchType: 'short_name' });
    }
  }
  return matches;
}

function uniqueCountyMatches(matches) {
  const byCounty = new Map();
  for (const match of matches) {
    if (!byCounty.has(match.countyId)) byCounty.set(match.countyId, match);
  }
  return [...byCounty.values()];
}

export function inferCountyAssignment(row, matchers) {
  if (!row || !row.state_id || !matchers?.length) {
    return { action: 'skip', reason: 'missing_state_or_matchers', matches: [] };
  }

  const signals = [
    { field: 'extracted_name', value: row.extracted_name, allowShortName: false, evidenceLevel: 'county_name_match' },
    { field: 'source_name', value: row.source_name, allowShortName: false, evidenceLevel: 'county_name_match' },
    { field: 'extracted_address', value: row.extracted_address, allowShortName: false, evidenceLevel: 'county_address_match' },
    { field: 'counties_served', value: row.counties_served, allowShortName: false, evidenceLevel: 'county_coverage_match' },
    { field: 'catchment_boundaries', value: row.catchment_boundaries, allowShortName: false, evidenceLevel: 'county_coverage_match' },
    { field: 'raw_text_excerpt', value: row.raw_text_excerpt, allowShortName: false, evidenceLevel: 'county_excerpt_match' },
  ].filter((signal) => String(signal.value || '').trim());

  const matches = [];
  for (const signal of signals) {
    for (const match of findMatchesInText(signal.value, matchers, { allowShortName: signal.allowShortName })) {
      matches.push({
        ...match,
        field: signal.field,
        evidenceLevel: signal.evidenceLevel,
      });
    }
  }

  const uniqueMatches = uniqueCountyMatches(matches);
  if (uniqueMatches.length === 0) {
    return { action: 'skip', reason: 'no_explicit_county_match', matches: [] };
  }

  const uniqueEvidence = [...new Set(matches.map((match) => match.evidenceLevel))];
  if (uniqueMatches.length === 1) {
    return {
      action: 'assign_single_county',
      reason: 'single_explicit_county_match',
      countyId: uniqueMatches[0].countyId,
      evidenceLevel: uniqueEvidence[0] || 'county_excerpt_match',
      matches: uniqueMatches,
    };
  }

  return {
    action: 'assign_precise_coverage',
    reason: 'multiple_explicit_county_matches',
    countyIds: uniqueMatches.map((match) => match.countyId).sort(),
    evidenceLevel: uniqueEvidence.includes('county_coverage_match') ? 'county_coverage_match' : 'county_excerpt_match',
    matches: uniqueMatches,
  };
}

export function buildCountyUpdate(tableName, inference) {
  if (!inference || !tableName) return null;

  if (tableName === 'staging_scraped_state_resource_agencies') {
    if (inference.action === 'assign_single_county') {
      return {
        county_id: inference.countyId,
        counties_served: inference.countyId,
        catchment_boundaries: inference.countyId,
        evidence_level: inference.evidenceLevel,
      };
    }
    if (inference.action === 'assign_precise_coverage') {
      return {
        counties_served: inference.countyIds.join(','),
        catchment_boundaries: inference.countyIds.join(','),
        evidence_level: inference.evidenceLevel,
      };
    }
    return null;
  }

  if (inference.action !== 'assign_single_county') {
    return null;
  }

  return {
    county_id: inference.countyId,
    evidence_level: inference.evidenceLevel,
  };
}
