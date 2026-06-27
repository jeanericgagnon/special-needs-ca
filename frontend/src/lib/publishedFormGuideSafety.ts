import { hasStrongPublishedProvenance } from './publishedProvenance.ts';
import { hasOfficialProgramSource } from './seo-policy.ts';

export type PublishedFormGuideCandidate = {
  source_url?: string | null;
  pdf_url?: string | null;
  verification_status?: string | null;
};

export function isSafePublishedFormGuide(candidate: PublishedFormGuideCandidate | null | undefined): boolean {
  if (!candidate) return false;
  const primaryUrl = candidate.source_url?.trim() || candidate.pdf_url?.trim() || '';
  const downloadUrl = candidate.pdf_url?.trim() || '';
  const hasOfficialUrl = hasOfficialProgramSource(primaryUrl) || hasOfficialProgramSource(downloadUrl);
  return hasOfficialUrl && hasStrongPublishedProvenance(candidate);
}
