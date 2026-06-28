export type SourceReviewDisplay = {
  label: string;
  color: string;
  background: string;
  borderColor: string;
};

export function resolvePublicSourceVerificationStatus(
  verificationStatus?: string | null,
  hasReviewableUrl: boolean = false,
): string {
  const status = String(verificationStatus || '').trim().toLowerCase();
  if (status) return status;
  return hasReviewableUrl ? 'source_listed' : 'needs_review';
}

export function getSourceReviewDisplay(verificationStatus?: string | null): SourceReviewDisplay {
  const status = String(verificationStatus || '').trim().toLowerCase();

  if (status === 'official_verified' || status === 'human_verified' || status === 'verified') {
    return {
      label: 'Reviewed public source',
      color: '#0f766e',
      background: 'rgba(15, 118, 110, 0.08)',
      borderColor: '#0f766e30',
    };
  }

  if (status === 'source_listed') {
    return {
      label: 'Public source linked',
      color: '#2563eb',
      background: 'rgba(37, 99, 235, 0.08)',
      borderColor: '#2563eb30',
    };
  }

  return {
    label: 'Needs more verification',
    color: '#64748b',
    background: 'rgba(100, 116, 139, 0.08)',
    borderColor: '#64748b30',
  };
}
