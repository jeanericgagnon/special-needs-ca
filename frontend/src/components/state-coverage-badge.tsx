/**
 * StateCoverageBadge
 *
 * Renders an honest public-facing coverage classification label on every
 * state hub page so users (and crawlers) understand the depth of data
 * behind each state.
 *
 * Classifications:
 *   exhaustive          -> California only. Full county x program x provider matrix.
 *   reviewed            -> Completed and index-safe states (e.g. Florida, Pennsylvania).
 *   gated (Texas)       -> Texas manual override due to Part C early intervention gaps.
 *   research preview    -> Blocked/incomplete states. Served as noindex preview directories.
 */

import React from 'react';
import { ShieldCheck, Sparkles, AlertTriangle, Eye } from 'lucide-react';
import { stateAuditStatus, stateGapReason } from '@/lib/seo-policy';

interface StateCoverageBadgeProps {
  stateId: string;
  stateName: string;
}

export function StateCoverageBadge({ stateId, stateName }: StateCoverageBadgeProps) {
  const normalizedStateId = stateId.toLowerCase().trim();
  const audit = stateAuditStatus(normalizedStateId);
  const gapReason = stateGapReason(normalizedStateId);

  // California is exhaustive
  if (normalizedStateId === 'california') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(22, 163, 74, 0.08)',
            border: '1px solid rgba(22, 163, 74, 0.25)',
            color: '#16a34a',
            borderRadius: '20px',
            padding: '0.3rem 0.75rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <ShieldCheck size={12} />
          Exhaustive Launch-Grade Coverage
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', maxWidth: '540px', lineHeight: 1.4 }}>
          {stateName} has full county × program × provider matrix coverage. All local agency contacts, school districts, and provider details are fully verified.
        </span>
      </div>
    );
  }

  // Texas manual override / gated case
  if (normalizedStateId === 'texas') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#ef4444',
            borderRadius: '20px',
            padding: '0.3rem 0.75rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <AlertTriangle size={12} />
          Gated Pending Audit Repair
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', maxWidth: '540px', lineHeight: 1.4 }}>
          Texas directories are temporarily gated from public search indexing pending verification of county-local evidence and Part C Early Childhood Intervention sample counts.
          {gapReason && <span style={{ display: 'block', marginTop: '0.25rem', color: '#b91c1c' }}><strong>Gap Details:</strong> {gapReason}</span>}
        </span>
      </div>
    );
  }

  // Complete & Index-safe states
  if (audit !== null && audit.classification === 'COMPLETE' && audit.indexSafe === true) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(22, 163, 74, 0.08)',
            border: '1px solid rgba(22, 163, 74, 0.25)',
            color: '#16a34a',
            borderRadius: '20px',
            padding: '0.3rem 0.75rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <ShieldCheck size={12} />
          Source-Backed Reviewed Coverage
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', maxWidth: '540px', lineHeight: 1.4 }}>
          {stateName} has passed data-audit truth requirements. Program guides, eligibility rules, and school district contacts are officially verified.
        </span>
      </div>
    );
  }

  // Blocked / Research preview states
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          color: '#d97706',
          borderRadius: '20px',
          padding: '0.3rem 0.75rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        <Eye size={12} />
        Research Preview &mdash; Verification Pending
      </div>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', maxWidth: '540px', lineHeight: 1.4 }}>
        This directory is open for navigation and research, but is not indexed on search engines. Data verification for {stateName} is in progress.
        {gapReason && <span style={{ display: 'block', marginTop: '0.25rem', color: '#b45309' }}><strong>Gap Details:</strong> {gapReason}</span>}
      </span>
    </div>
  );
}
