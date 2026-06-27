export type PublishedProvenanceRecord = {
  source_url?: string | null;
  source_type?: string | null;
  data_origin?: string | null;
  verification_status?: string | null;
  last_verified_date?: string | null;
  last_verified_at?: string | null;
  last_checked_at?: string | null;
  last_scraped_at?: string | null;
  confidence_score?: number | null;
};

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'number') return Number.isFinite(value);
  return String(value).trim().length > 0;
}

export function getPublishedProvenanceIssues(record: PublishedProvenanceRecord): string[] {
  const issues: string[] = [];
  if (!hasValue(record.source_url)) issues.push('missing_source_url');
  if (!hasValue(record.source_type)) issues.push('missing_source_type');
  if (!hasValue(record.data_origin)) issues.push('missing_data_origin');
  if (!hasValue(record.verification_status)) issues.push('missing_verification_status');
  if (
    !hasValue(record.last_verified_date) &&
    !hasValue(record.last_verified_at) &&
    !hasValue(record.last_checked_at) &&
    !hasValue(record.last_scraped_at)
  ) {
    issues.push('missing_last_checked_signal');
  }
  if (!hasValue(record.confidence_score)) issues.push('missing_confidence_score');
  return issues;
}

export function hasMinimumPublishedProvenance(record: PublishedProvenanceRecord): boolean {
  return hasValue(record.source_url) && hasValue(record.verification_status);
}

export function hasStrongPublishedProvenance(record: PublishedProvenanceRecord): boolean {
  return getPublishedProvenanceIssues(record).length === 0;
}
