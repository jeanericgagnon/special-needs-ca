export type SourceReviewDisplay = {
  label: string;
  color: string;
  background: string;
  borderColor: string;
};

export function getSourceReviewDisplay(verificationStatus?: string | null): SourceReviewDisplay {
  const status = String(verificationStatus || '').trim().toLowerCase();

  if (status === 'official_verified' || status === 'human_verified' || status === 'verified') {
    return {
      label: 'Source-backed checked',
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
    label: 'Needs deeper verification',
    color: '#64748b',
    background: 'rgba(100, 116, 139, 0.08)',
    borderColor: '#64748b30',
  };
}
