import path from 'node:path';
import fs from 'node:fs';
import { isGenericHeading } from './source-acquisition-promote-lib.mjs';

const STATE_ID_TO_CODE = {
  alabama: 'al',
  alaska: 'ak',
  arizona: 'az',
  arkansas: 'ar',
  california: 'ca',
  colorado: 'co',
  connecticut: 'ct',
  delaware: 'de',
  florida: 'fl',
  georgia: 'ga',
  hawaii: 'hi',
  idaho: 'id',
  illinois: 'il',
  indiana: 'in',
  iowa: 'ia',
  kansas: 'ks',
  kentucky: 'ky',
  louisiana: 'la',
  maine: 'me',
  maryland: 'md',
  massachusetts: 'ma',
  michigan: 'mi',
  minnesota: 'mn',
  mississippi: 'ms',
  missouri: 'mo',
  montana: 'mt',
  nebraska: 'ne',
  nevada: 'nv',
  'new-hampshire': 'nh',
  'new-jersey': 'nj',
  'new-mexico': 'nm',
  'new-york': 'ny',
  'north-carolina': 'nc',
  'north-dakota': 'nd',
  ohio: 'oh',
  oklahoma: 'ok',
  oregon: 'or',
  pennsylvania: 'pa',
  'rhode-island': 'ri',
  'south-carolina': 'sc',
  'south-dakota': 'sd',
  tennessee: 'tn',
  texas: 'tx',
  utah: 'ut',
  vermont: 'vt',
  virginia: 'va',
  washington: 'wa',
  'west-virginia': 'wv',
  wisconsin: 'wi',
  wyoming: 'wy',
};

export function decodeHtmlEntities(value) {
  return String(value || '')
    .replace(/&#8211;/g, '-')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

export function normalizeWhitespace(value) {
  return decodeHtmlEntities(value).replace(/\s+/g, ' ').trim();
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function stateIdFromCountyId(countyId) {
  const normalized = String(countyId || '').trim().toLowerCase();
  if (!normalized || !normalized.includes('-')) return '';
  return normalized.split('-').slice(-1)[0];
}

export function loadProviderGeocodeEvidenceMap(sourceAcquisitionRunsDir, repoRoot = '') {
  const evidenceByRowId = new Map();
  if (!sourceAcquisitionRunsDir || !fs.existsSync(sourceAcquisitionRunsDir)) return evidenceByRowId;

  const runIds = fs.readdirSync(sourceAcquisitionRunsDir)
    .filter((name) => fs.statSync(path.join(sourceAcquisitionRunsDir, name)).isDirectory())
    .sort();

  for (const runId of runIds) {
    const geocodeDir = path.join(sourceAcquisitionRunsDir, runId, 'provider-county-geocode');
    if (!fs.existsSync(geocodeDir)) continue;

    const sources = [
      ['missing-address.json', 'missing_address'],
      ['malformed-address.json', 'malformed_address'],
      ['skipped.json', 'skipped'],
    ];

    for (const [fileName, fallbackReason] of sources) {
      const filePath = path.join(geocodeDir, fileName);
      if (!fs.existsSync(filePath)) continue;
      const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!Array.isArray(rows)) continue;

      for (const row of rows) {
        const rowId = Number(row.rowId);
        if (!Number.isInteger(rowId)) continue;
        const reason = fallbackReason === 'skipped' ? normalizeWhitespace(row.reason || 'skipped') : fallbackReason;
        evidenceByRowId.set(rowId, {
          runId,
          reason,
          artifactPath: repoRoot ? repoRelative(repoRoot, filePath) : filePath,
        });
      }
    }
  }

  return evidenceByRowId;
}

export function inferredProviderBlocker(row, evidence = null) {
  const extractedName = normalizeWhitespace(row.extracted_name);
  const countyId = String(row.county_id || '').trim().toLowerCase();
  const stateId = String(row.state_id || '').trim().toLowerCase();
  const extractedAddress = normalizeWhitespace(row.extracted_address);
  const extractedPhone = normalizeWhitespace(row.extracted_phone);
  const extractedEmail = normalizeWhitespace(row.extracted_email);

  const countyStateSuffix = stateIdFromCountyId(countyId);
  const expectedStateCode = STATE_ID_TO_CODE[stateId] || stateId.split('-').slice(-1)[0] || '';
  if (countyId && countyStateSuffix && expectedStateCode && countyStateSuffix !== expectedStateCode) {
    return {
      blockerKey: 'state_county_mismatch',
      reviewStatus: 'blocked_state_county_mismatch',
      reason: 'County assignment points to a different state than the staged provider row.',
    };
  }

  if (evidence?.reason === 'no_census_match') {
    return {
      blockerKey: 'county_geocode_no_match',
      reviewStatus: 'blocked_county_geocode_no_match',
      reason: 'Provider address failed deterministic Census county geocoding, so county assignment remains unresolved.',
    };
  }

  if (evidence?.reason === 'county_equivalent_missing_from_repo') {
    return {
      blockerKey: 'county_equivalent_missing_from_repo',
      reviewStatus: 'blocked_county_equivalent_missing_from_repo',
      reason: 'Provider address resolved to a county-equivalent geography that is not modeled in the repo, so local county promotion remains gated.',
    };
  }

  if (evidence?.reason === 'missing_address') {
    return {
      blockerKey: 'missing_address_and_county',
      reviewStatus: 'blocked_missing_address_and_county',
      reason: 'Provider lacks a usable street address, so county resolution cannot proceed deterministically.',
    };
  }

  if (evidence?.reason === 'malformed_address') {
    return {
      blockerKey: 'malformed_address_for_county_resolution',
      reviewStatus: 'blocked_malformed_address_for_county_resolution',
      reason: 'Provider address is malformed, so county resolution cannot proceed deterministically.',
    };
  }

  if (countyId && isGenericHeading(extractedName)) {
    return {
      blockerKey: 'generic_name_with_county',
      reviewStatus: 'blocked_generic_provider_name',
      reason: 'County is known, but the extracted provider name is still too generic for safe promotion.',
    };
  }

  if (countyId) {
    return {
      blockerKey: 'unclassified_manual_review_with_county',
      reviewStatus: 'blocked_unclassified_manual_review_with_county',
      reason: 'County is known, but the staged provider still requires deterministic review before promotion.',
    };
  }

  if (extractedAddress) {
    return {
      blockerKey: 'county_unresolved',
      reviewStatus: 'blocked_missing_county_resolution',
      reason: 'Provider still lacks a county after deterministic county inference / geocode attempts.',
    };
  }

  if (extractedPhone || extractedEmail) {
    return {
      blockerKey: 'missing_address_and_county',
      reviewStatus: 'blocked_missing_address_and_county',
      reason: 'Provider has contact signal but no usable address, so county cannot be resolved safely.',
    };
  }

  return {
    blockerKey: 'missing_identity_signals',
    reviewStatus: 'blocked_missing_identity_signals',
    reason: 'Provider lacks enough stable identity signals for safe county resolution or promotion.',
  };
}

export function buildProviderManualReviewDecision(row, evidenceByRowId = new Map()) {
  const extractedName = normalizeWhitespace(row.extracted_name);
  const sourceUrl = String(row.source_url || '').trim();
  const hostname = (() => {
    try {
      return new URL(sourceUrl).hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      return '';
    }
  })();
  const evidence = evidenceByRowId.get(Number(row.id)) || null;
  const blocker = inferredProviderBlocker(row, evidence);
  return {
    rowId: row.id,
    stateId: String(row.state_id || '').trim().toLowerCase(),
    countyId: String(row.county_id || '').trim().toLowerCase(),
    extractedName,
    sourceUrl,
    hostname,
    extractedAddress: normalizeWhitespace(row.extracted_address),
    extractedPhone: normalizeWhitespace(row.extracted_phone),
    extractedEmail: normalizeWhitespace(row.extracted_email),
    evidenceLevel: row.evidence_level || '',
    confidenceScore: row.confidence_score ?? null,
    evidenceReason: evidence?.reason || '',
    evidenceRunId: evidence?.runId || '',
    evidenceArtifactPath: evidence?.artifactPath || '',
    blockerKey: blocker.blockerKey,
    reviewStatus: blocker.reviewStatus,
    reason: blocker.reason,
  };
}

export function blockerNote(decision, dateStamp) {
  return `Provider manual review blocker applied ${dateStamp}: ${decision.blockerKey}. ${decision.reason}`;
}

export function repoRelative(repoRoot, filePath) {
  return path.relative(repoRoot, filePath);
}
