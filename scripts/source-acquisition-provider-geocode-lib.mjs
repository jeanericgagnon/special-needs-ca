import countiesReference from '../data/us_counties.json' with { type: 'json' };

export const CENSUS_BATCH_URL = 'https://geocoding.geo.census.gov/geocoder/geographies/addressbatch';

export const STATE_ID_TO_CODE = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new-hampshire': 'NH',
  'new-jersey': 'NJ',
  'new-mexico': 'NM',
  'new-york': 'NY',
  'north-carolina': 'NC',
  'north-dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode-island': 'RI',
  'south-carolina': 'SC',
  'south-dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west-virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
};

export function buildFipsCountyIndex(countyRows) {
  const byFips = new Map();
  const stateKeyToCountyId = new Map();
  const dbKeyToCountyId = new Map();

  for (const row of countyRows) {
    dbKeyToCountyId.set(`${row.state_id}::${String(row.name || '').trim().toLowerCase()}`, row.id);
  }

  for (const entry of Object.values(countiesReference)) {
    const stateId = Object.entries(STATE_ID_TO_CODE).find(([, code]) => code.toLowerCase() === stateCodeFromName(entry.state).toLowerCase())?.[0];
    if (!stateId) continue;
    const dbCountyId = dbKeyToCountyId.get(`${stateId}::${String(entry.name || '').trim().toLowerCase()}`);
    if (!dbCountyId) continue;
    byFips.set(entry.fips, dbCountyId);
    stateKeyToCountyId.set(`${stateCodeFromName(entry.state)}::${cleanCountyName(entry.name)}`, dbCountyId);
  }

  return {
    byFips,
    stateKeyToCountyId,
  };
}

function stateCodeFromName(name) {
  const normalized = String(name || '').trim().toLowerCase();
  const found = Object.entries(STATE_ID_TO_CODE).find(([stateId]) => stateId.replace(/-/g, ' ') === normalized);
  return found ? found[1] : '';
}

export function cleanCountyName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/\b(county|parish|borough|census area|municipality|city and borough|city and county|city)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseAddressParts(address) {
  const value = String(address || '').trim();
  const canonicalMatch = value.match(/^(.*?),\s*([^,]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i);
  if (canonicalMatch) {
    return {
      street: canonicalMatch[1].trim(),
      city: canonicalMatch[2].trim(),
      stateCode: canonicalMatch[3].toUpperCase(),
      zipCode: canonicalMatch[4],
    };
  }

  const missingCommaMatch = value.match(
    /^(.*\b(?:st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|way|ct|court|pkwy|parkway|pl|place|cir|circle|ter|terrace|trl|trail|hwy|highway)\b)\s+([^,]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i
  );
  if (!missingCommaMatch) return null;
  return {
    street: missingCommaMatch[1].trim(),
    city: missingCommaMatch[2].trim(),
    stateCode: missingCommaMatch[3].toUpperCase(),
    zipCode: missingCommaMatch[4],
  };
}

export function buildBatchCsv(rows) {
  return rows.map((row, index) => {
    const parsed = parseAddressParts(row.extracted_address);
    if (!parsed) return null;
    return [index, parsed.street, parsed.city, parsed.stateCode, parsed.zipCode].join(',');
  }).filter(Boolean).join('\n');
}

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }
    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

export function parseCensusBatchResponse(text) {
  const rows = [];
  for (const line of String(text || '').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const cols = parseCsvLine(trimmed);
    if (cols.length < 3) continue;
    rows.push({
      rowId: Number(cols[0]),
      inputAddress: cols[1] || '',
      matchStatus: cols[2] || '',
      matchType: cols[3] || '',
      matchedAddress: cols[4] || '',
      coordinates: cols[5] || '',
      tigerLineId: cols[6] || '',
      side: cols[7] || '',
      stateFips: cols[8] || '',
      countyFips: cols[9] || '',
      tractFips: cols[10] || '',
      blockFips: cols[11] || '',
    });
  }
  return rows;
}

export function mapGeocodeMatches(records, geocodeRows, fipsIndex) {
  const updates = [];
  const skipped = [];

  function isVirginiaIndependentCityGeoid(geoid) {
    return typeof geoid === 'string' && /^51([5-8]\d{2})$/.test(geoid);
  }

  for (const geocode of geocodeRows) {
    const record = records[geocode.rowId];
    if (!record) continue;
    if (!['Match', 'Tie'].includes(geocode.matchStatus)) {
      skipped.push({
        rowId: record.id,
        sourceUrl: record.source_url,
        extractedName: record.extracted_name,
        reason: geocode.matchStatus === 'No_Match' ? 'no_census_match' : 'unmatched_status',
        geoid: '',
      });
      continue;
    }
    const geoid = `${geocode.stateFips}${geocode.countyFips}`;
    const countyId = fipsIndex.byFips.get(geoid) || null;
    if (!countyId) {
      skipped.push({
        rowId: record.id,
        sourceUrl: record.source_url,
        extractedName: record.extracted_name,
        reason: isVirginiaIndependentCityGeoid(geoid)
          ? 'county_equivalent_missing_from_repo'
          : 'unknown_fips_match',
        geoid,
      });
      continue;
    }

    updates.push({
      rowId: record.id,
      countyId,
      geoid,
      evidenceLevel: 'census_batch_geocode',
      sourceUrl: record.source_url,
      extractedName: record.extracted_name,
      extractedAddress: record.extracted_address,
    });
  }

  return { updates, skipped };
}
