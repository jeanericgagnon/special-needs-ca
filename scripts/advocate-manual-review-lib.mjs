import { isGenericHeading } from './source-acquisition-promote-lib.mjs';

export function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export function inferAdvocateBlocker(row) {
  const stateId = String(row.state_id || '').trim().toLowerCase();
  const countyId = String(row.county_id || '').trim().toLowerCase();
  const extractedName = normalizeWhitespace(row.extracted_name);
  const extractedPhone = normalizeWhitespace(row.extracted_phone);
  const extractedEmail = normalizeWhitespace(row.extracted_email);
  const extractedWebsite = normalizeWhitespace(row.extracted_website);

  let hostname = '';
  try {
    hostname = new URL(extractedWebsite || row.source_url || '').hostname.replace(/^www\./, '').toLowerCase();
  } catch {}

  if (countyId && isGenericHeading(extractedName)) {
    return {
      blockerKey: 'generic_name_with_county',
      reviewStatus: 'blocked_generic_advocate_name',
      reason: 'County is known, but the extracted advocate name is too generic for safe promotion.',
    };
  }

  if (stateId === 'national') {
    if (hostname.endsWith('.gov') || hostname.includes('ed.gov')) {
      return {
        blockerKey: 'national_guidance_not_local_advocate',
        reviewStatus: 'blocked_national_advocate_guidance',
        reason: 'This is national legal or dispute guidance, not a local advocate record that can be promoted directly.',
      };
    }
    return {
      blockerKey: 'national_directory_requires_state_slice',
      reviewStatus: 'blocked_national_directory_state_slice_required',
      reason: 'This is a national advocate directory seed and needs state or local slicing before safe advocate promotion.',
    };
  }

  if (isGenericHeading(extractedName)) {
    return {
      blockerKey: 'generic_advocate_name',
      reviewStatus: 'blocked_generic_advocate_name',
      reason: 'The extracted advocate name is too generic for safe promotion.',
    };
  }

  if (!countyId && stateId === 'multi-state') {
    return {
      blockerKey: 'multistate_advocate_without_county',
      reviewStatus: 'blocked_multistate_advocate_without_county',
      reason: 'This advocate appears multi-state and lacks deterministic county routing for safe local promotion.',
    };
  }

  if (!countyId && (extractedPhone || extractedEmail || extractedWebsite)) {
    return {
      blockerKey: 'missing_advocate_county_resolution',
      reviewStatus: 'blocked_missing_advocate_county_resolution',
      reason: 'The advocate has identity or contact signals, but no deterministic county mapping for safe promotion.',
    };
  }

  if (!extractedPhone && !extractedEmail) {
    return {
      blockerKey: 'missing_advocate_contact_signal',
      reviewStatus: 'blocked_missing_advocate_contact_signal',
      reason: 'The advocate lacks direct contact signals required for safe promotion.',
    };
  }

  return {
    blockerKey: 'unclassified_advocate_manual_review',
    reviewStatus: 'blocked_unclassified_advocate_manual_review',
    reason: 'The advocate still requires deterministic review before safe promotion.',
  };
}

export function buildAdvocateManualReviewDecision(row) {
  const blocker = inferAdvocateBlocker(row);
  let hostname = '';
  try {
    hostname = new URL(row.extracted_website || row.source_url || '').hostname.replace(/^www\./, '').toLowerCase();
  } catch {}

  return {
    rowId: Number(row.id),
    stateId: String(row.state_id || '').trim().toLowerCase(),
    countyId: String(row.county_id || '').trim().toLowerCase(),
    extractedName: normalizeWhitespace(row.extracted_name),
    sourceUrl: String(row.source_url || '').trim(),
    hostname,
    extractedPhone: normalizeWhitespace(row.extracted_phone),
    extractedEmail: normalizeWhitespace(row.extracted_email),
    extractedWebsite: normalizeWhitespace(row.extracted_website),
    confidenceScore: row.confidence_score ?? null,
    blockerKey: blocker.blockerKey,
    reviewStatus: blocker.reviewStatus,
    reason: blocker.reason,
  };
}

export function blockerNote(decision, dateStamp) {
  return `Advocate manual review blocker applied ${dateStamp}: ${decision.blockerKey}. ${decision.reason}`;
}
