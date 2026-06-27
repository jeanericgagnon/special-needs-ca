import { hasStrongPublishedProvenance } from './publishedProvenance.ts';
import { hasOfficialProgramSource } from './seo-policy.ts';

export type PublishedFormGuideCandidate = {
  title?: string | null;
  agency?: string | null;
  who_uses_it?: string | null;
  who_signs_it?: string | null;
  where_to_send_it?: string | null;
  source_url?: string | null;
  pdf_url?: string | null;
  verification_status?: string | null;
};

function hasValue(value: unknown): boolean {
  return typeof value === 'string'
    ? value.trim().length > 0
    : value !== null && value !== undefined;
}

function hasExplicitSigner(value: string | null | undefined): boolean {
  if (!hasValue(value)) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized !== 'see source instructions';
}

function hasExplicitSubmissionRoute(value: string | null | undefined): boolean {
  if (!hasValue(value)) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized !== 'confirm the current submission route on the linked public source.';
}

export function isSafePublishedFormGuide(candidate: PublishedFormGuideCandidate | null | undefined): boolean {
  if (!candidate) return false;
  const primaryUrl = candidate.source_url?.trim() || candidate.pdf_url?.trim() || '';
  const downloadUrl = candidate.pdf_url?.trim() || '';
  const hasOfficialUrl = hasOfficialProgramSource(primaryUrl) || hasOfficialProgramSource(downloadUrl);
  return hasOfficialUrl &&
    hasStrongPublishedProvenance(candidate) &&
    hasValue(candidate.title) &&
    hasValue(candidate.agency) &&
    hasValue(candidate.who_uses_it) &&
    hasExplicitSigner(candidate.who_signs_it) &&
    hasExplicitSubmissionRoute(candidate.where_to_send_it);
}
